package main

import (
	"encoding/binary"
	"fmt"
	"math"
	"math/bits"
	"os"
)

const (
	sha128BlockSize int = 64
)

var (
	sha128K [64]uint32 = [64]uint32{0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5,
		0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
		0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3,
		0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
		0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc,
		0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
		0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7,
		0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
		0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13,
		0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
		0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3,
		0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
		0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5,
		0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
		0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208,
		0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2}
)

type SHA128State struct {
	length      int
	state       [8]uint32
	filledBytes int
	buffer      [64]byte
	schedule    [sha128BlockSize]uint32
}

func sha128(input string) string {
	sha128State := createSHA128State()
	sha128State.sha128Preprocess([]byte(input))
	sha128State.sha128Computation()
	return sha128State.sha128Digest()
}

func createSHA128State() *SHA128State {
	sha128State := SHA128State{}
	sha128State.length = 0
	sha128State.state[0] = 0x6a09e667
	sha128State.state[1] = 0xbb67ae85
	sha128State.state[2] = 0x3c6ef372
	sha128State.state[3] = 0xa54ff53a
	sha128State.state[4] = 0x510e527f
	sha128State.state[5] = 0x9b05688c
	sha128State.state[6] = 0x1f83d9ab
	sha128State.state[7] = 0x5be0cd19
	return &sha128State
}

func (sha128State *SHA128State) sha128Preprocess(input []byte) { // Input can be max 55 bytes/chars
	if len(input) > 55 {
		fmt.Println("SHA128 input too long")
		os.Exit(1)
	}

	copy(sha128State.buffer[:], input)

	sha128State.filledBytes += len(input)
	sha128State.length += sha128State.filledBytes
	sha128State.buffer[sha128State.filledBytes] = 0x80
	sha128State.filledBytes += 1

	sha128State.buffer[len(sha128State.buffer)-1] = byte((sha128State.length * 8) % (int(math.Pow(2, 64))))
	if sha128State.length*8 > 255 {
		sha128State.buffer[len(sha128State.buffer)-2] = 1
	}
}

func (sha128State *SHA128State) sha128Computation() {
	for i := 0; i < 64; i += 4 {
		sha128State.schedule[i/4] = binary.LittleEndian.Uint32(sha128State.buffer[i : i+4])
	}

	for i := 16; i < sha128BlockSize; i++ {
		lSigma1 := sha128LowerSigma(sha128State.schedule[i-2], 7, 18, 3)
		lSigma0 := sha128LowerSigma(sha128State.schedule[i-15], 17, 19, 10)
		sha128State.schedule[i] = lSigma1 + sha128State.schedule[i-7] + lSigma0 + sha128State.schedule[i-16]
	}

	a := sha128State.state[0]
	b := sha128State.state[1]
	c := sha128State.state[2]
	d := sha128State.state[3]
	e := sha128State.state[4]
	f := sha128State.state[5]
	g := sha128State.state[6]
	h := sha128State.state[7]

	for i := 0; i < sha128BlockSize; i++ {
		uSigma1 := sha128UpperSigma(e, 6, 11, 25)
		choose := sha128Choose(e, f, g)
		t1 := h + uSigma1 + choose + sha128K[i] + sha128State.schedule[i]

		uSigma0 := sha128UpperSigma(a, 2, 13, 22)
		maj := sha128Majority(a, b, c)
		t2 := uSigma0 + maj

		h = g
		g = f
		f = e
		e = d + t1
		d = c
		c = b
		b = a
		a = t1 + t2
	}

	sha128State.state[0] += a
	sha128State.state[1] += b
	sha128State.state[2] += c
	sha128State.state[3] += d
	sha128State.state[4] += e
	sha128State.state[5] += f
	sha128State.state[6] += g
	sha128State.state[7] += h
}

func (sha128state *SHA128State) sha128Digest() string {
	output := ""

	output += fmt.Sprintf("%x", bits.ReverseBytes32(sha128state.state[0]))
	output += fmt.Sprintf("%x", bits.ReverseBytes32(sha128state.state[1]))
	output += fmt.Sprintf("%x", bits.ReverseBytes32(sha128state.state[2]))
	output += fmt.Sprintf("%x", bits.ReverseBytes32(sha128state.state[3]))

	return output
}

func sha128LowerSigma(input uint32, rot1 int, rot2 int, shift int) uint32 {
	// LSigma0: rrot7, rrot18, rshift3
	// LSigma1: rrot17, rrot19, rshift10

	rotA := bits.RotateLeft32(input, -rot1)
	rotB := bits.RotateLeft32(input, -rot2)
	rshiftA := input >> shift

	return rotA + rotB + rshiftA
}

func sha128UpperSigma(input uint32, rot1 int, rot2 int, rot3 int) uint32 {
	// USigma0: rrot2, rrot13, rrot22
	// USigma1: rrot6, rrot11, rrot25

	rotA := bits.RotateLeft32(input, -rot1)
	rotB := bits.RotateLeft32(input, -rot2)
	rotC := bits.RotateLeft32(input, -rot3)

	return rotA + rotB + rotC
}

func sha128Choose(input1 uint32, input2 uint32, input3 uint32) uint32 {
	return input1 ^ (input2 & input3)
}

func sha128Majority(input1 uint32, input2 uint32, input3 uint32) uint32 {
	return (input1 & input2) | (input2 & input3) | (input3 & input1)
}
