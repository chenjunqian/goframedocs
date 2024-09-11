# Dictionary Type - Performance Testing

## Performance Testing

### Concurrent Safety

Performance testing for concurrent safety can be found [here](https://github.com/gogf/gf/v2/blob/master/container/gmap/gmap_z_bench_safe_test.go).

```bash
goos: linux
goarch: amd64
Benchmark_IntIntMap_Set-4               10000000               202 ns/op              15 B/op          0 allocs/op
Benchmark_IntAnyMap_Set-4               10000000               262 ns/op              29 B/op          1 allocs/op
Benchmark_IntStrMap_Set-4               10000000               241 ns/op              22 B/op          0 allocs/op
Benchmark_AnyAnyMap_Set-4                5000000               359 ns/op              40 B/op          2 allocs/op
Benchmark_StrIntMap_Set-4                5000000               305 ns/op              26 B/op          1 allocs/op
Benchmark_StrAnyMap_Set-4                5000000               354 ns/op              40 B/op          2 allocs/op
Benchmark_StrStrMap_Set-4                5000000               338 ns/op              32 B/op          1 allocs/op
Benchmark_IntIntMap_Get-4               20000000              86.6 ns/op               0 B/op          0 allocs/op
Benchmark_IntAnyMap_Get-4               30000000              69.7 ns/op               0 B/op          0 allocs/op
Benchmark_IntStrMap_Get-4               30000000              69.6 ns/op               0 B/op          0 allocs/op
Benchmark_AnyAnyMap_Get-4               20000000              74.4 ns/op               0 B/op          0 allocs/op
Benchmark_StrIntMap_Get-4               20000000               116 ns/op               7 B/op          0 allocs/op
Benchmark_StrAnyMap_Get-4               20000000              92.3 ns/op               7 B/op          0 allocs/op
Benchmark_StrStrMap_Get-4               20000000              91.9 ns/op               7 B/op          0 allocs/op
```

### Non-Concurrent Safety

Performance testing for non-concurrent safety can be found [here](https://github.com/gogf/gf/v2/blob/master/container/gmap/gmap_z_bench_unsafe_test.go).

```bash
goos: linux
goarch: amd64
Benchmark_Unsafe_IntIntMap_Set-4        10000000               318 ns/op              62 B/op          0 allocs/op
Benchmark_Unsafe_IntAnyMap_Set-4         5000000               282 ns/op              57 B/op          1 allocs/op
Benchmark_Unsafe_IntStrMap_Set-4         5000000               332 ns/op              82 B/op          1 allocs/op
Benchmark_Unsafe_AnyAnyMap_Set-4         3000000               471 ns/op              73 B/op          2 allocs/op
Benchmark_Unsafe_StrIntMap_Set-4         5000000               429 ns/op              82 B/op          1 allocs/op
Benchmark_Unsafe_StrAnyMap_Set-4         3000000               424 ns/op              73 B/op          2 allocs/op
Benchmark_Unsafe_StrStrMap_Set-4         2000000               515 ns/op              96 B/op          2 allocs/op
Benchmark_Unsafe_IntIntMap_Get-4        10000000               133 ns/op               0 B/op          0 allocs/op
Benchmark_Unsafe_IntAnyMap_Get-4        20000000               134 ns/op               0 B/op          0 allocs/op
Benchmark_Unsafe_IntStrMap_Get-4        10000000               126 ns/op               0 B/op          0 allocs/op
Benchmark_Unsafe_AnyAnyMap_Get-4        10000000               166 ns/op               0 B/op          0 allocs/op
Benchmark_Unsafe_StrIntMap_Get-4         5000000               246 ns/op               7 B/op          0 allocs/op
Benchmark_Unsafe_StrAnyMap_Get-4        10000000               238 ns/op               7 B/op          0 allocs/op
Benchmark_Unsafe_StrStrMap_Get-4         5000000               229 ns/op               7 B/op          0 allocs/op
```

## Performance of Different Map Types

Performance testing for different types of maps can be found [here](https://github.com/gogf/gf/v2/blob/master/container/gmap/gmap_z_bench_maps_test.go).

```bash
goos: linux
goarch: amd64
Benchmark_HashMap_Set-4                  5000000               349 ns/op              40 B/op          2 allocs/op
Benchmark_ListMap_Set-4                  3000000               455 ns/op              87 B/op          3 allocs/op
Benchmark_TreeMap_Set-4                  3000000               481 ns/op              28 B/op          2 allocs/op
Benchmark_HashMap_Get-4                 30000000              67.8 ns/op               0 B/op          0 allocs/op
Benchmark_ListMap_Get-4                 20000000              74.5 ns/op               0 B/op          0 allocs/op
Benchmark_TreeMap_Get-4                 20000000               189 ns/op               8 B/op          1 allocs/op
```

## Comparison of gmap and sync.Map

Since version 1.9, Go has introduced `sync.Map` for concurrent-safe map operations. However, `gmap` has better performance and richer features compared to the standard library's `sync.Map`.

You can see the benchmark comparison results [here](https://github.com/gogf/gf/v2/blob/master/container/gmap/gmap_z_bench_syncmap_test.go).

```bash
goos: linux
goarch: amd64
Benchmark_GMapSet-4                     10000000               209 ns/op              15 B/op          0 allocs/op
Benchmark_SyncMapSet-4                   3000000               451 ns/op              67 B/op          3 allocs/op
Benchmark_GMapGet-4                     30000000              66.4 ns/op               0 B/op          0 allocs/op
Benchmark_SyncMapGet-4                  30000000              36.0 ns/op               0 B/op          0 allocs/op
Benchmark_GMapRemove-4                  10000000               207 ns/op               0 B/op          0 allocs/op
Benchmark_SyncMapRmove-4                30000000              42.4 ns/op               0 B/op          0 allocs/op
```
