package main

import (
	"encoding/binary"
	"fmt"
	"math"
	"math/bits"
	"os"
)

const (
	md5BlockSize int = 64
)

var (
	msgIndex   [64]int = [64]int{0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 1, 6, 11, 0, 5, 10, 15, 4, 9, 14, 3, 8, 13, 2, 7, 12, 5, 8, 11, 14, 1, 4, 7, 10, 13, 0, 3, 6, 9, 12, 15, 2, 0, 7, 14, 5, 12, 3, 10, 1, 8, 15, 6, 13, 4, 11, 2, 9}
	sineRandom [64]int = [64]int{0xd76aa478, 0xe8c7b756, 0x242070db, 0xc1bdceee,
		0xf57c0faf, 0x4787c62a, 0xa8304613, 0xfd469501,
		0x698098d8, 0x8b44f7af, 0xffff5bb1, 0x895cd7be,
		0x6b901122, 0xfd987193, 0xa679438e, 0x49b40821,
		0xf61e2562, 0xc040b340, 0x265e5a51, 0xe9b6c7aa,
		0xd62f105d, 0x02441453, 0xd8a1e681, 0xe7d3fbc8,
		0x21e1cde6, 0xc33707d6, 0xf4d50d87, 0x455a14ed,
		0xa9e3e905, 0xfcefa3f8, 0x676f02d9, 0x8d2a4c8a,
		0xfffa3942, 0x8771f681, 0x6d9d6122, 0xfde5380c,
		0xa4beea44, 0x4bdecfa9, 0xf6bb4b60, 0xbebfbc70,
		0x289b7ec6, 0xeaa127fa, 0xd4ef3085, 0x04881d05,
		0xd9d4d039, 0xe6db99e5, 0x1fa27cf8, 0xc4ac5665,
		0xf4292244, 0x432aff97, 0xab9423a7, 0xfc93a039,
		0x655b59c3, 0x8f0ccc92, 0xffeff47d, 0x85845dd1,
		0x6fa87e4f, 0xfe2ce6e0, 0xa3014314, 0x4e0811a1,
		0xf7537e82, 0xbd3af235, 0x2ad7d2bb, 0xeb86d391}
	shift [64]int = [64]int{7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22,
		5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20,
		4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23,
		6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21}
)

type MD5State struct {
	length      int
	state       [4]uint32
	filledBytes int
	buffer      [md5BlockSize]byte
}

func md5(input string) string { // Max length 55 bytes/chars
	md5State := createMD5State()
	md5State.md5Process([]byte(input))
	md5State.md5Finalize()
	md5State.md5Compress()
	return md5State.md5Digest()
}

func createMD5State() *MD5State { // Constructor for md5 (go is a weak-OOP language with no real constructors or classes)
	md5State := MD5State{}
	md5State.length = 0
	md5State.state[0] = 0x67452301
	md5State.state[1] = 0xefcdab89
	md5State.state[2] = 0x98badcfe
	md5State.state[3] = 0x10325476
	md5State.filledBytes = 0
	return &md5State
}

func (md5State *MD5State) md5Process(input []byte) {
	if len(input) > 55 {
		fmt.Println("MD5 input too long")
		os.Exit(1)
	}

	// Turn input into
	copy(md5State.buffer[:], input)
	md5State.filledBytes += len(input)
}

func (md5State *MD5State) md5Finalize() {
	md5State.length += md5State.filledBytes
	md5State.buffer[md5State.filledBytes] = 0x80
	md5State.filledBytes += 1

	length := (md5State.length * 8) % (int(math.Pow(2, 64)))
	bs := make([]byte, 8)
	binary.LittleEndian.PutUint32(bs, uint32(length))
	copy(md5State.buffer[len(md5State.buffer)-8:], bs)
}

func (md5State *MD5State) md5Compress() {
	msgInts := make([]int, 16)

	for i := 0; i < md5BlockSize; i += 4 {
		msgInts[i/4] = int(binary.LittleEndian.Uint32(md5State.buffer[i : i+4]))
	}

	a := md5State.state[0]
	b := md5State.state[1]
	c := md5State.state[2]
	d := md5State.state[3]

	for i := 0; i < md5BlockSize; i++ {
		a = a + md5bitMixer(i, b, c, d) + uint32(msgInts[msgIndex[i]]) + uint32(sineRandom[i])
		a = bits.RotateLeft32(a, shift[i])
		a = a + b

		a, b, c, d = d, a, b, c
	}

	md5State.state[0] += a
	md5State.state[1] += b
	md5State.state[2] += c
	md5State.state[3] += d
}

func md5bitMixer(i int, b uint32, c uint32, d uint32) uint32 {

	switch step := i; {
	case step < 16:
		return d ^ (b & (c ^ d))
	case step < 32:
		return c ^ (d & (b ^ c))
	case step < 48:
		return b ^ c ^ d
	case step < 64:
		return c ^ (b | (d ^ ^uint32(0)))
	}

	return 0
}

func (md5State *MD5State) md5Digest() string {
	output := ""

	output += fmt.Sprintf("%x", bits.ReverseBytes32(md5State.state[0]))
	output += fmt.Sprintf("%x", bits.ReverseBytes32(md5State.state[1]))
	output += fmt.Sprintf("%x", bits.ReverseBytes32(md5State.state[2]))
	output += fmt.Sprintf("%x", bits.ReverseBytes32(md5State.state[3]))

	return output
}
