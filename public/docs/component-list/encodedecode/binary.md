# Binary Encoding and Decoding - gbinary

## Introduction

The **GoFrame** framework provides an independent binary data operation package called `gbinary`, primarily used for converting between various data types and `[]byte` binary types. It also includes functionality for precise bitwise operations on integer data. This is commonly used in network communication for data encoding/decoding, as well as during file operations involving data encoding/decoding.

### Usage

```go
import "github.com/gogf/gf/v2/encoding/gbinary"
```

### API Documentation

[https://pkg.go.dev/github.com/gogf/gf/v2/encoding/gbinary](https://pkg.go.dev/github.com/gogf/gf/v2/encoding/gbinary)

The following are the available functions for binary data structure conversion and manipulation:

### Encoding Functions

```go
func Encode(vs ...interface{}) ([]byte, error)
func EncodeInt(i int) []byte
func EncodeInt8(i int8) []byte
func EncodeInt16(i int16) []byte
func EncodeInt32(i int32) []byte
func EncodeInt64(i int64) []byte
func EncodeUint(i uint) []byte
func EncodeUint8(i uint8) []byte
func EncodeUint16(i uint16) []byte
func EncodeUint32(i uint32) []byte
func EncodeUint64(i uint64) []byte
func EncodeBool(b bool) []byte
func EncodeFloat32(f float32) []byte
func EncodeFloat64(f float64) []byte
func EncodeString(s string) []byte
```

### Decoding Functions

```go
func Decode(b []byte, vs ...interface{}) error
func DecodeToInt(b []byte) int
func DecodeToInt8(b []byte) int8
func DecodeToInt16(b []byte) int16
func DecodeToInt32(b []byte) int32
func DecodeToInt64(b []byte) int64
func DecodeToUint(b []byte) uint
func DecodeToUint8(b []byte) uint8
func DecodeToUint16(b []byte) uint16
func DecodeToUint32(b []byte) uint32
func DecodeToUint64(b []byte) uint64
func DecodeToBool(b []byte) bool
func DecodeToFloat32(b []byte) float32
func DecodeToFloat64(b []byte) float64
func DecodeToString(b []byte) string
```

### Bitwise Operations API

```go
func EncodeBits(bits []Bit, i int, l int) []Bit
func EncodeBitsWithUint(bits []Bit, ui uint, l int) []Bit
func EncodeBitsToBytes(bits []Bit) []byte
func DecodeBits(bits []Bit) uint
func DecodeBitsToUint(bits []Bit) uint
func DecodeBytesToBits(bs []byte) []Bit
```

The `Bit` type represents a binary digit (0 or 1) and is defined as follows:

```go
type Bit int8
```

## Example

Let's look at a more comprehensive example demonstrating various binary conversion operations:

```go
package main

import (
    "fmt"
    "github.com/gogf/gf/v2/encoding/gbinary"
    "github.com/gogf/gf/v2/os/gctx"
    "github.com/gogf/gf/v2/os/glog"
)

func main() {
    // Using gbinary.Encode to pack basic data types into binary
    if buffer := gbinary.Encode(18, 300, 1.01); buffer != nil {
        // glog.Error(err)
    } else {
        fmt.Println(buffer)
    }

    // Using gbinary.Decode to unpack binary into integers
    // Note: The second and subsequent parameters must be pointers to the specific integer types (e.g., int8/16/32/64, uint8/16/32/64, float32/64)
    if buffer := gbinary.Encode(18, 300, 1.01); buffer != nil {
        // glog.Error(err)
    } else {
        var i1 int8
        var i2 int16
        var f3 float64
        if err := gbinary.Decode(buffer, &i1, &i2, &f3); err != nil {
            glog.Error(gctx.New(), err)
        } else {
            fmt.Println(i1, i2, f3)
        }
    }

    // Encode/Decode int and automatically detect the variable length
    fmt.Println(gbinary.DecodeToInt(gbinary.EncodeInt(1)))
    fmt.Println(gbinary.DecodeToInt(gbinary.EncodeInt(300)))
    fmt.Println(gbinary.DecodeToInt(gbinary.EncodeInt(70000)))
    fmt.Println(gbinary.DecodeToInt(gbinary.EncodeInt(2000000000)))
    fmt.Println(gbinary.DecodeToInt(gbinary.EncodeInt(500000000000)))

    // Encode/Decode uint and automatically detect the variable length
    fmt.Println(gbinary.DecodeToUint(gbinary.EncodeUint(1)))
    fmt.Println(gbinary.DecodeToUint(gbinary.EncodeUint(300)))
    fmt.Println(gbinary.DecodeToUint(gbinary.EncodeUint(70000)))
    fmt.Println(gbinary.DecodeToUint(gbinary.EncodeUint(2000000000)))
    fmt.Println(gbinary.DecodeToUint(gbinary.EncodeUint(500000000000)))

    // Encode/Decode int8/16/32/64
    fmt.Println(gbinary.DecodeToInt8(gbinary.EncodeInt8(int8(100))))
    fmt.Println(gbinary.DecodeToInt16(gbinary.EncodeInt16(int16(100))))
    fmt.Println(gbinary.DecodeToInt32(gbinary.EncodeInt32(int32(100))))
    fmt.Println(gbinary.DecodeToInt64(gbinary.EncodeInt64(int64(100))))

    // Encode/Decode uint8/16/32/64
    fmt.Println(gbinary.DecodeToUint8(gbinary.EncodeUint8(uint8(100))))
    fmt.Println(gbinary.DecodeToUint16(gbinary.EncodeUint16(uint16(100))))
    fmt.Println(gbinary.DecodeToUint32(gbinary.EncodeUint32(uint32(100))))
    fmt.Println(gbinary.DecodeToUint64(gbinary.EncodeUint64(uint64(100))))

    // Encode/Decode string
    fmt.Println(gbinary.DecodeToString(gbinary.EncodeString("I'm string!")))
}
```

The output of the above program is:

```bash
[18 44 1 41 92 143 194 245 40 240 63]
18 300 1.01
1
300
70000
2000000000
500000000000
1
300
70000
2000000000
500000000000
100
100
100
100
100
100
100
100
I'm string!
```

## Encoding

The `gbinary.Encode` function is a very powerful and flexible method that can convert all basic data types into binary (`[]byte`). Internally, it automatically calculates the length of the variable and uses the minimum binary length to store its value. For example, for an `int` value of 1, `gbinary.Encode` will use only 1 byte, while for an `int` value of 300, it will use 2 bytes, aiming to reduce the storage space of the binary result.

Therefore, when decoding, it's important to pay attention to the length of the `[]byte`. If the variable length can be determined, it is recommended to use fixed-length types like `int8/16/32/64` during binary encoding/decoding. This ensures the correct variable type is used for decoding, reducing the risk of errors.

The `gbinary` package also provides several `gbinary.Encode*` methods, which convert basic data types to binary. The `gbinary.EncodeInt` and `gbinary.EncodeUint` methods automatically detect the variable size internally and return a variable-length `[]byte` result (length ranging from 1, 2, 4, or 8 bytes).

## Decoding

When performing binary decoding, the length of the binary (`[]byte` length) is crucial. The correct length must be provided for successful decoding. The `gbinary.Decode` method requires that the second argument corresponds to fixed-length types such as `int8/16/32/64`, `uint8/16/32/64`, or `float32/64`. If the second argument is of type `int` or `uint`, the decoding will fail because the length cannot be determined.

Additionally, the `gbinary` package provides a series of `gbinary.DecodeTo*` methods, which convert binary data into specific data types. The `gbinary.DecodeToInt` and `gbinary.DecodeToUint` methods automatically detect and decode binary data of lengths ranging from 1 to 8 bytes.
