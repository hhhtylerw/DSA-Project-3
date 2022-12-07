package main

import (
	"fmt"
	"time"
)

func main() {
	hashes := 1000000
	fmt.Printf("Time to hash and store i=%d:\n", hashes)

	md5DB := make(map[string]string)
	input := "COP3530"
	output := ""
	start := time.Now()
	for i := 0; i < hashes; i++ {
		output = md5(input)
		md5DB[input] = output
		input = output
	}
	fmt.Println("MD5:", time.Since(start))

	sha128DB := make(map[string]string)
	input1 := "COP3530"
	output1 := ""
	start1 := time.Now()
	for i := 0; i < hashes; i++ {
		output1 = sha128(input1)
		sha128DB[input1] = output1
		input1 = output1
	}
	fmt.Println("SHA128:", time.Since(start1))
}
