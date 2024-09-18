# Queue Type Performance Testing

For a detailed performance benchmark test of `gqueue` versus the standard library `channel`, you can refer to the following link: [Performance Benchmark Test](https://github.com/gogf/gf/v2/blob/master/container/gqueue/gqueue_z_bench_test.go).

In the benchmark test, the value of `b.N` for each test is set to `20,000,000` to ensure consistent performance for dynamic queue operations and to prevent `deadlock`.

## Benchmark Results

```bash
goos: linux
goarch: amd64
pkg: github.com/gogf/gf/v2/container/gqueue
Benchmark_Gqueue_StaticPushAndPop-4       20000000            84.2 ns/op
Benchmark_Gqueue_DynamicPush-4            20000000             164 ns/op
Benchmark_Gqueue_DynamicPop-4             20000000             121 ns/op
Benchmark_Channel_PushAndPop-4            20000000            70.0 ns/op
PASS
```

## Performance Analysis

As shown in the benchmark results, the standard library's `channel` has a very high `read/write` performance. However, due to the need for memory initialization during its creation, the efficiency of creating a `channel` is significantly lower (initialization involves allocating memory). Furthermore, the `channel` is limited by its queue size, meaning that the data written cannot exceed the specified queue size.

In contrast, `gqueue` offers greater flexibility compared to `channel`. It has a higher creation efficiency (due to dynamic memory allocation) and is not limited by the queue size (although it can also be size-restricted if needed).
