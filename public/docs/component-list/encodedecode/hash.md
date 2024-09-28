# Classic Hash - ghash

## Introduction

You can use these hash functions by importing the following package:

```go
import "github.com/gogf/gf/v2/encoding/ghash"
```

### API Documentation

You can find the full API documentation at this link:  
[API Documentation - GHash](https://pkg.go.dev/github.com/gogf/gf/v2/encoding/ghash)

## Benchmark Testing

Below are the results of benchmark tests for various hash functions. These tests were conducted on a MacOS system with an Intel i7-9750H CPU running at 2.60 GHz. The following benchmarks indicate performance in nanoseconds per operation (`ns/op`):

```bash
goos: darwin  
goarch: amd64  
pkg: github.com/gogf/gf/v2/encoding/ghash  
cpu: Intel(R) Core(TM) i7-9750H CPU @ 2.60GHz
```

***Benchmark Results***

```markdown
| Function   | Test                        | Operations/sec  | Time (ns/op) |
|------------|-----------------------------|-----------------|--------------|
| BKDR       | `Benchmark_BKDR-12`          | 39,315,165     | 26.88 ns/op  |
| BKDR64     | `Benchmark_BKDR64-12`        | 62,891,215     | 22.61 ns/op  |
| SDBM       | `Benchmark_SDBM-12`          | 49,689,925     | 25.40 ns/op  |
| SDBM64     | `Benchmark_SDBM64-12`        | 48,860,472     | 24.38 ns/op  |
| RS         | `Benchmark_RS-12`            | 39,463,418     | 25.52 ns/op  |
| RS64       | `Benchmark_RS64-12`          | 53,318,370     | 19.45 ns/op  |
| JS         | `Benchmark_JS-12`            | 53,751,033     | 23.20 ns/op  |
| JS64       | `Benchmark_JS64-12`          | 62,440,287     | 19.25 ns/op  |
| PJW        | `Benchmark_PJW-12`           | 42,439,626     | 27.85 ns/op  |
| PJW64      | `Benchmark_PJW64-12`         | 37,491,696     | 33.28 ns/op  |
| ELF        | `Benchmark_ELF-12`           | 38,034,584     | 31.74 ns/op  |
| ELF64      | `Benchmark_ELF64-12`         | 44,047,201     | 27.58 ns/op  |
| DJB        | `Benchmark_DJB-12`           | 46,994,352     | 22.60 ns/op  |
| DJB64      | `Benchmark_DJB64-12`         | 61,980,186     | 19.19 ns/op  |
| AP         | `Benchmark_AP-12`            | 29,544,234     | 40.58 ns/op  |
| AP64       | `Benchmark_AP64-12`          | 28,123,783     | 42.48 ns/op  |
```

## Repeated Testing

The testing results have some randomness and are correlated with the test content. Here, a simple repeatability test is conducted by iterating through the range of `uint64` values. However, due to its simplicity, this test should only be used for reference and is not rigorous.

```go
package main

import (
 "encoding/binary"
 "fmt"
 "math"
 "github.com/gogf/gf/v2/encoding/ghash"
)

func main() {
    var (
        m    = make(map[uint64]struct{})
        b    = make([]byte, 8)
        ok   bool
        hash uint64
    )
    for i := uint64(0); i < math.MaxUint64; i++ {
        binary.LittleEndian.PutUint64(b, i)
        hash = ghash.PJW64(b)
        if _, ok = m[hash]; ok {
        fmt.Println("repeated found:", i)
            break
        }
        m[hash] = struct{}{}
    }
}
```

***Test Results***

The following table shows the first occurrence of hash collisions for various hash functions. These results are for reference only and were run on a machine with 32GB of memory. In some cases, memory consumption caused the system to run out of memory (OOM).

```markdown
| Function   | Collision Index  |  
|------------|------------------|  
| AP64       | 8,388,640         |  
| BKDR64     | 33,536            |  
| DJB64      | 8,448             |  
| ELF64      | 4,096             |  
| JS64       | 734               |  
| PJW64      | 2                 |  
| RS64       | OOM (32G Memory)  |  
| SDBM64     | OOM (32G Memory)  |
```
