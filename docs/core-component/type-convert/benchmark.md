# Type Convert - Benchmark

## Overview

This document details the performance benchmarks for basic type conversions in the `Goframe`. The benchmarks test various type conversions and measure their performance in terms of time per operation and memory allocations.

## Benchmark Results

Here are the results of the benchmark tests:

```bash
john@john-B85M:~/Workspace/Go/GOPATH/src/github.com/gogf/gf/v2/util/gconv$ go test *.go -bench=".*" -benchmem
goos: linux
goarch: amd64
BenchmarkString-4               20000000                71.8 ns/op            24 B/op          2 allocs/op
BenchmarkInt-4                  100000000               22.2 ns/op             8 B/op          1 allocs/op
BenchmarkInt8-4                 100000000               24.5 ns/op             8 B/op          1 allocs/op
BenchmarkInt16-4                50000000                23.8 ns/op             8 B/op          1 allocs/op
BenchmarkInt32-4                100000000               24.1 ns/op             8 B/op          1 allocs/op
BenchmarkInt64-4                100000000               21.7 ns/op             8 B/op          1 allocs/op
BenchmarkUint-4                 100000000               22.2 ns/op             8 B/op          1 allocs/op
BenchmarkUint8-4                50000000                25.6 ns/op             8 B/op          1 allocs/op
BenchmarkUint16-4               50000000                32.1 ns/op             8 B/op          1 allocs/op
BenchmarkUint32-4               50000000                27.7 ns/op             8 B/op          1 allocs/op
BenchmarkUint64-4               50000000                28.1 ns/op             8 B/op          1 allocs/op
BenchmarkFloat32-4              10000000               155 ns/op              24 B/op          2 allocs/op
BenchmarkFloat64-4              10000000               177 ns/op              24 B/op          2 allocs/op
BenchmarkTime-4                  5000000               240 ns/op              72 B/op          4 allocs/op
BenchmarkTimeDuration-4         50000000                26.2 ns/op             8 B/op          1 allocs/op
BenchmarkBytes-4                10000000               149 ns/op             128 B/op          3 allocs/op
BenchmarkStrings-4              10000000               223 ns/op              40 B/op          3 allocs/op
BenchmarkInts-4                 20000000                55.0 ns/op            16 B/op          2 allocs/op
BenchmarkFloats-4               10000000               186 ns/op              32 B/op          3 allocs/op
BenchmarkInterfaces-4           20000000                66.6 ns/op            24 B/op          2 allocs/op
PASS
ok      command-line-arguments  35.356s
```

## Conclusion

The performance benchmarks show the time and memory efficiency of various type conversions in `Goframe`. The results indicate that integer and simple type conversions are highly efficient, while conversions involving more complex types, such as floating-point numbers and interfaces, have higher execution times and memory usage.
