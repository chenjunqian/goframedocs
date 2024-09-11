# Cache - Memory Cache

The caching component in `Goframe` provides a high-performance in-memory cache by default, with operation efficiency at the `nanosecond` level for `CPU` performance consumption.

## Usage Examples

```go
package main

import (
    "fmt"
    "github.com/gogf/gf/v2/os/gcache"
    "github.com/gogf/gf/v2/os/gctx"
)

func main() {
    // Create a cache object.
    // You can also conveniently use the gcache package methods directly.
    var (
        ctx   = gctx.New()
        cache = gcache.New()
    )

    // Set a cache value with no expiration.
    err := cache.Set(ctx, "k1", "v1", 0)
    if err != nil {
        panic(err)
    }

    // Get the cache value.
    value, err := cache.Get(ctx, "k1")
    if err != nil {
        panic(err)
    }
    fmt.Println(value)

    // Get the cache size.
    size, err := cache.Size(ctx)
    if err != nil {
        panic(err)
    }
    fmt.Println(size)

    // Check if a specific key exists in the cache.
    exists, err := cache.Contains(ctx, "k1")
    if err != nil {
        panic(err)
    }
    fmt.Println(exists)

    // Remove a key and return the removed value.
    removedValue, err := cache.Remove(ctx, "k1")
    if err != nil {
        panic(err)
    }
    fmt.Println(removedValue)

    // Close the cache object to allow the garbage collector to reclaim resources.
    if err = cache.Close(ctx); err != nil {
        panic(err)
    }
}
```

**Output:**

```bash
v1
1
true
v1
```

### Expiration

```go
package main

import (
    "fmt"
    "github.com/gogf/gf/v2/os/gcache"
    "github.com/gogf/gf/v2/os/gctx"
    "time"
)

func main() {
    var (
        ctx = gctx.New()
    )
    // Set a key with an expiration time of 1000 milliseconds, only if it doesn't exist.
    _, err := gcache.SetIfNotExist(ctx, "k1", "v1", time.Second)
    if err != nil {
        panic(err)
    }

    // Print the current list of keys.
    keys, err := gcache.Keys(ctx)
    if err != nil {
        panic(err)
    }
    fmt.Println(keys)

    // Print the current list of values.
    values, err := gcache.Values(ctx)
    if err != nil {
        panic(err)
    }
    fmt.Println(values)

    // Get a value by key. If the key doesn't exist, set it with the given value and no expiration.
    value, err := gcache.GetOrSet(ctx, "k2", "v2", 0)
    if err != nil {
        panic(err)
    }
    fmt.Println(value)

    // Print the current key-value pairs.
    data1, err := gcache.Data(ctx)
    if err != nil {
        panic(err)
    }
    fmt.Println(data1)

    // Wait 1 second for the key "k1" to expire automatically.
    time.Sleep(time.Second)

    // Print the current key-value pairs again. Notice that "k1:v1" has expired, leaving only "k2:v2".
    data2, err := gcache.Data(ctx)
    if err != nil {
        panic(err)
    }
    fmt.Println(data2)
}
```

**Output:**

```bash
[k1]
[v1]
v2
map[k1:v1 k2:v2]
map[k2:v2]
```

### GetOrSetFunc

The `GetOrSetFunc*` method retrieves a cache value. If the cache entry does not exist, it executes a specified function `f func(context.Context) (interface{}, error)`, caches the result of `f`, and returns the result.

Note that the `f` function parameter in `GetOrSetFunc` is executed outside of the cache's lock mechanism, which means that `f` can also call `GetOrSetFunc` within itself. However, if `f` is time-consuming, it may be executed multiple times under high concurrency (only the result of the first executed `f` will be cached, and the others will be discarded). On the other hand, `GetOrSetFuncLock` executes `f` within the cache's lock mechanism, ensuring that `f` is only executed once when the cache item does not exist. However, the cache write lock time depends on the execution time of `f`.

Here's an example:

```go
package main

import (
    "fmt"
    "github.com/gogf/gf/v2/os/gcache"
    "github.com/gogf/gf/v2/os/gctx"
    "time"
)

func main() {
    var (
        ch    = make(chan struct{}, 0)
        ctx   = gctx.New()
        key   = `key`
        value = `value`
    )
    for i := 0; i < 10; i++ {
    go func(index int) {
        <-ch
        _, err := gcache.GetOrSetFuncLock(ctx, key, func(ctx context.Context) (interface{}, error) {
            fmt.Println(index, "entered")
            return value, nil
        }, 0)
        if err != nil {
            panic(err)
        }
    }(i)
    }
    close(ch)
    time.Sleep(time.Second)
}
```

**Output (the output may vary, but only one entry will be printed):**

```bash
9 entered
```

As you can see, when multiple goroutines simultaneously call `GetOrSetFuncLock`, only one goroutine's value generation function is executed successfully due to concurrency-safe controls. Once the first goroutine sets the cache value, the other goroutines retrieve the value without executing the corresponding function.

### LRU Cache

```go
package main

import (
    "fmt"
    "github.com/gogf/gf/v2/os/gcache"
    "github.com/gogf/gf/v2/os/gctx"
    "time"
)

func main() {

    var (
        ctx   = gctx.New()
        cache = gcache.New(2) // Set LRU eviction limit.
    )

    // Add 10 elements with no expiration.
    for i := 0; i < 10; i++ {
    if err := cache.Set(ctx, i, i, 0); err != nil {
        panic(err)
    }
    }
    size, err := cache.Size(ctx)
    if err != nil {
        panic(err)
    }
    fmt.Println(size)

    keys, err := cache.Keys(ctx)
    if err != nil {
        panic(err)
    }
    fmt.Println(keys)

    // Access the key "1" to ensure it is retained.
    value, err := cache.Get(ctx, 1)
    if err != nil {
        panic(err)
    }
    fmt.Println(value)

    // After waiting for some time (by default, the LRU check occurs every second),
    // elements are evicted in order from oldest to newest.
    time.Sleep(3 * time.Second)
    size, err = cache.Size(ctx)
    if err != nil {
        panic(err)
    }
    fmt.Println(size)

    keys, err = cache.Keys(ctx)
    if err != nil {
        panic(err)
    }
    fmt.Println(keys)
}
```

**Output:**

```bash
10
[2 3 5 6 7 0 1 4 8 9]
1
2
[1 9]
```

## Performance Testing

### Test Environment

- **CPU**: Intel(R) Core(TM) i5-4460 CPU @ 3.20GHz
- **Memory**: 8GB
- **System**: Ubuntu 16.04 amd64

#### Test Results

```bash
john@john-B85M:~/Workspace/Go/GOPATH/src/github.com/gogf/gf/v2/os/gcache$ go test *.go -bench=".*" -benchmem
goos: linux
goarch: amd64
Benchmark_CacheSet-4                       2000000        897 ns/op      249 B/op        4 allocs/op
Benchmark_CacheGet-4                       5000000        202 ns/op       49 B/op        1 allocs/op
Benchmark_CacheRemove-4                   50000000       35.7 ns/op        0 B/op        0 allocs/op
Benchmark_CacheLruSet-4                    2000000        880 ns/op      399 B/op        4 allocs/op
Benchmark_CacheLruGet-4                    3000000        212 ns/op       33 B/op        1 allocs/op
Benchmark_CacheLruRemove-4                50000000       35.9 ns/op        0 B/op        0 allocs/op
Benchmark_InterfaceMapWithLockSet-4        3000000        477 ns/op       73 B/op        2 allocs/op
Benchmark_InterfaceMapWithLockGet-4       10000000        149 ns/op        0 B/op        0 allocs/op
Benchmark_InterfaceMapWithLockRemove-4    50000000       39.8 ns/op        0 B/op        0 allocs/op
Benchmark_IntMapWithLockWithLockSet-4      5000000        304 ns/op       53 B/op        0 allocs/op
Benchmark_IntMapWithLockGet-4             20000000        164 ns/op        0 B/op        0 allocs/op
Benchmark_IntMapWithLockRemove-4          50000000       33.1 ns

/op        0 B/op        0 allocs/op
PASS
ok   command-line-arguments 47.503s
```
