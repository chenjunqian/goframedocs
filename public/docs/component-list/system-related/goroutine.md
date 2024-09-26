# Goroutine - grpool

## Basic Introduction

In the `Go` language, goroutines are relatively lightweight compared to system threads (the initial stack size is only `2KB` and supports dynamic scaling). In contrast, threads in languages like `Java` or `C++` typically consume around `4MB` of memory in kernel mode. For example, if our server has `4GB` of RAM, the total number of kernel-mode threads would be around `1024`. On the other hand, Go's goroutines can reach up to `4*1024*1024/2=2` million. This clearly shows why the Go language naturally supports high concurrency.

## Pain Points

### High Resource Consumption for Goroutines

However, when dealing with high concurrency, the frequent creation and destruction of goroutines impose a significant performance burden, especially on garbage collection (GC). To address this, `grpool` pools and reuses goroutines to reduce the overhead associated with their creation and destruction. For example, for 1 million tasks, using raw goroutines would require continuously creating and destroying 1 million goroutines, whereas with `grpool`, only tens of thousands of goroutines may be needed to handle all tasks through reuse.

Testing shows that while goroutine pools may not drastically improve the execution efficiency of business logic (reducing execution time or CPU usage), and may even be slower than raw goroutines (as the goroutine pool's scheduling is less efficient than Go's native scheduler), the memory usage is greatly reduced due to reuse.

### Large Number of Goroutines Affect Global Scheduling

Some business modules require dynamic goroutine creation, such as asynchronous data collection or metric calculation tasks. These are not core service logic but still produce goroutines. In extreme cases, this can cause a rapid increase in the number of goroutines, affecting the global scheduling of the underlying Go engine and leading to significant service execution delays.

For instance, consider an asynchronous data collection task that runs every 5 seconds, where each run creates 100 goroutines to collect data from various endpoints. If there is network latency and the previous task hasn't completed, the next task will start and create new goroutines. As the tasks accumulate, the number of goroutines can rapidly increase, impacting global service execution. In such scenarios, we can use pooling techniques to manage task execution more efficiently. For example, we can set the pool's maximum task limit to 10,000. As tasks are added to the pool, once the limit is reached, further tasks will block without affecting global service execution.

## Key Concepts

### Pool

A goroutine pool that manages reusable goroutine resources.

### Job

A task added to the pool's task queue, waiting to be executed. It is a function (`Func`), and each `Job` can only be picked up and executed by a single `Worker`. The definition of `Func` is as follows:

```go
type Func func(ctx context.Context)
```

### Worker

A goroutine within the pool responsible for executing jobs. A `Worker` can execute multiple `Job`s until there are no more jobs in the queue.

## Usage Guide

***How to Use***

```go
import "github.com/gogf/gf/v2/os/grpool"
```

***Use Cases***

- Managing large numbers of asynchronous tasks.
- Reusing asynchronous goroutines.
- Reducing memory usage.

***API Documentation***

```go
func Add(ctx context.Context, f Func) error
func AddWithRecover(ctx context.Context, userFunc Func, recoverFunc RecoverFunc) error
func Jobs() int
func Size() int
func New(limit ...int) *Pool
    func (p *Pool) Add(ctx context.Context, f Func) error
    func (p *Pool) AddWithRecover(ctx context.Context, userFunc Func, recoverFunc RecoverFunc) error
    func (p *Pool) Cap() int
    func (p *Pool) Close()
    func (p *Pool) IsClosed() bool
    func (p *Pool) Jobs() int
    func (p *Pool) Size() int
```

By using the `grpool.New` method, you can create a new goroutine pool. The `limit` parameter is optional and sets the maximum number of worker goroutines in the pool. By default, there is no limit. Note that tasks can be continuously added to the pool without any restriction, but the number of worker goroutines can be limited. You can check the current number of worker goroutines using the `Size()` method and the number of pending tasks using the `Jobs()` method.

For convenience, the `grpool` package provides a default goroutine pool, which does not limit the number of goroutines. You can directly use `grpool.Add` to add tasks to the default pool. The task must be a function of type `func()`.

One of the most common questions is how to pass parameters to tasks in `grpool`. Please refer to Example 2 for details.

## Usage Example

### Example: Using the Default Goroutine Pool to Limit 100 Goroutines for 1000 Tasks

```go
package main

import (
    "context"
    "fmt"
    "github.com/gogf/gf/v2/os/gctx"
    "github.com/gogf/gf/v2/os/grpool"
    "github.com/gogf/gf/v2/os/gtimer"
    "time"
)

var (
    ctx = gctx.New()
)

func job(ctx context.Context) {
    time.Sleep(1 * time.Second)
}

func main() {
    pool := grpool.New(100)
    for i := 0; i < 1000; i++ {
        pool.Add(ctx, job)
    }
    fmt.Println("worker:", pool.Size())
    fmt.Println("jobs:", pool.Jobs())
    gtimer.SetInterval(ctx, time.Second, func(ctx context.Context) {
        fmt.Println("worker:", pool.Size())
        fmt.Println("jobs:", pool.Jobs())
        fmt.Println()
    })

    select {}
}
```

In this program, the task function simply `sleeps for 1 second`, which helps demonstrate the goroutine limitation feature. We use the `gtimer.SetInterval` timer to print the number of worker `goroutines` and pending tasks in the pool every second.

---

### Example: Common Mistake with Asynchronous Parameter Passing

**Note:** This example does not work in Go version ≥1.22, as the loop variable trap is removed in Go 1.22.

```go
package main

import (
    "context"
    "fmt"
    "github.com/gogf/gf/v2/os/gctx"
    "github.com/gogf/gf/v2/os/grpool"
    "sync"
)

var (
    ctx = gctx.New()
)

func main() {
    wg := sync.WaitGroup{}
    for i := 0; i < 10; i++ {
        wg.Add(1)
        grpool.Add(ctx, func(ctx context.Context) {
            fmt.Println(i)
            wg.Done()
        })
    }
    wg.Wait()
}
```

The intention of this code is to print the numbers 0-9 sequentially, but the actual output is:

```bash
10
10
10
10
10
10
10
10
10
10
```

***Why?***

This happens because, in asynchronous execution (whether using the `go` keyword or `grpool`), the function is registered for execution but hasn't started yet. When it eventually runs, the value of `i` has already incremented to 10. The variable `i` is passed by reference, and by the time the function executes, it reads the final value.

***Solution***

To fix this, you need to capture the current value of `i` either by passing it as an argument to the goroutine or by assigning it to a temporary variable.

---

***Improved Example Code***

Using the `go` Keyword

```go
package main

import (
    "fmt"
    "sync"
)

func main() {
    wg := sync.WaitGroup{}
    for i := 0; i < 10; i++ {
        wg.Add(1)
        go func(v int) {
            fmt.Println(v)
            wg.Done()
        }(i)
    }
    wg.Wait()
}
```

**Output:**

```bash
0
9
3
4
5
6
7
8
1
2
```

**Note:** The execution order is not guaranteed to follow the registration order in asynchronous execution.

Using a Temporary Variable

```go
package main

import (
    "context"
    "fmt"
    "github.com/gogf/gf/v2/os/gctx"
    "github.com/gogf/gf/v2/os/grpool"
    "sync"
)

var (
    ctx = gctx.New()
)

func main() {
    wg := sync.WaitGroup{}
    for i := 0; i < 10; i++ {
        wg.Add(1)
        v := i
        grpool.Add(ctx, func(ctx context.Context) {
            fmt.Println(v)
            wg.Done()
        })
    }
    wg.Wait()
}
```

**Output:**

```bash
9
0
1
2
3
4
5
6
7
8
```

---

### Automatically Capturing Goroutine Errors: AddWithRecover

The `AddWithRecover` method adds a new task to the pool with a specified recovery function. If the `userFunc` panics during execution, the optional `recoverFunc` is called. If no `recoverFunc` is passed or it's set to `nil`, the panic is ignored, and the task is executed asynchronously.

```go
package main

import (
    "context"
    "fmt"
    "github.com/gogf/gf/v2/container/garray"
    "github.com/gogf/gf/v2/os/gctx"
    "github.com/gogf/gf/v2/os/grpool"
    "time"
)

var (
    ctx = gctx.New()
)

func main() {
    array := garray.NewArray(true)
    grpool.AddWithRecover(ctx, func(ctx context.Context) {
        array.Append(1)
        array.Append(2)
        panic(1)
    }, func(err error) {
        array.Append(1)
    })
    
    grpool.AddWithRecover(ctx, func(ctx context.Context) {
        panic(1)
        array.Append(1)
    })
    
    time.Sleep(500 * time.Millisecond)
    fmt.Print(array.Len())
}
```

---

### Performance Test: grpool vs. Native Goroutines

Let's test the performance between `grpool` and native goroutines by running 10 million tasks in both scenarios.

***grpool***

```go
package main

import (
    "context"
    "fmt"
    "github.com/gogf/gf/v2/os/gctx"
    "github.com/gogf/gf/v2/os/grpool"
    "github.com/gogf/gf/v2/os/gtime"
    "sync"
    "time"
)

var (
    ctx = gctx.New()
)

func main() {
    start := gtime.TimestampMilli()
    wg := sync.WaitGroup{}
    for i := 0; i < 10000000; i++ {
        wg.Add(1)
        grpool.Add(ctx, func(ctx context.Context) {
            time.Sleep(time.Millisecond)
            wg.Done()
        })
    }
    wg.Wait()
    fmt.Println(grpool.Size())
    fmt.Println("time spent:", gtime.TimestampMilli()-start)
}
```

***Native Goroutines***

```go
package main

import (
    "fmt"
    "github.com/gogf/gf/v2/os/gtime"
    "sync"
    "time"
)

func main() {
    start := gtime.TimestampMilli()
    wg := sync.WaitGroup{}
    for i := 0; i < 10000000; i++ {
        wg.Add(1)
        go func() {
            time.Sleep(time.Millisecond)
            wg.Done()
        }()
    }
    wg.Wait()
    fmt.Println("time spent:", gtime.TimestampMilli()-start)
}
```

***Performance Comparison Results***

Both programs are run three times, and the average result is calculated:

```bash
grpool:
    goroutine count: 847313
     memory   spent: ~2.1 G
     time     spent: 37792 ms

goroutine:
    goroutine count: 1000W
    memory    spent: ~4.8 GB
    time      spent: 27085 ms

```

After pooling, the number of `goroutines` is greatly reduced, and memory usage is cut by more than half. The time spent is still acceptable, even though the pooled version is slightly slower than using native `goroutines`.
