# Timer - Basic Usage

## Basic Example

The following is a basic example of how to use the `gtimer` to schedule tasks:

```go
package main

import (
    "context"
    "fmt"
    "github.com/gogf/gf/v2/os/gctx"
    "github.com/gogf/gf/v2/os/gtime"
    "github.com/gogf/gf/v2/os/gtimer"
    "time"
)

func main() {
        var (
        ctx = gctx.New()  // Create a new context
        now = time.Now()   // Store the current time
    )
    
    // Add a task that runs every second, for a total of 10 times
    gtimer.AddTimes(ctx, time.Second, 10, func(ctx context.Context) {
    // Print the current time and the time difference from the last run
    fmt.Println(gtime.Now(), time.Duration(time.Now().UnixNano()-now.UnixNano()))
        now = time.Now()
    })

    select {}
}
```

***Output after execution***

```bash
2021-05-27 13:28:19 1.004516s
2021-05-27 13:28:20 997.262ms
2021-05-27 13:28:21 999.972ms
2021-05-27 13:28:22 1.00112s
2021-05-27 13:28:23 998.773ms
2021-05-27 13:28:24 999.957ms
2021-05-27 13:28:25 1.002468s
2021-05-27 13:28:26 997.468ms
2021-05-27 13:28:27 999.981ms
2021-05-27 13:28:28 1.002504s
```

## Singleton Task

A **singleton task** is a scheduled task that ensures only one instance of the task is running at any time. Here is an example:

```go
package main

import (
    "context"
    "github.com/gogf/gf/v2/os/gctx"
    "github.com/gogf/gf/v2/os/glog"
    "github.com/gogf/gf/v2/os/gtimer"
    "time"
)

func main() {
    var (
        ctx      = gctx.New()  // Create a new context
        interval = time.Second // Set the interval to 1 second
    )

    // Add a singleton task that logs "doing" every second, but the task takes 5 seconds to complete
    gtimer.AddSingleton(ctx, interval, func(ctx context.Context) {
        glog.Print(ctx, "doing")
        time.Sleep(5 * time.Second)
    })

    select {}
}
```

***Output after execution***

```bash
2021-11-14 11:50:42.192 {189cwi9mo40cfp73guzhugo100tnuedg} doing 
2021-11-14 11:50:48.190 {189cwi9mo40cfp73guzhugo100tnuedg} doing 
2021-11-14 11:50:54.192 {189cwi9mo40cfp73guzhugo100tnuedg} doing 
2021-11-14 11:51:00.189 {189cwi9mo40cfp73guzhugo100tnuedg} doing
...
```

## Delayed Task

A **delayed task** is a scheduled task that starts after a specified delay. You can create delayed tasks using the `DelayAdd*` methods. Here's an example:

```go
package main

import (
    "context"
    "fmt"
    "github.com/gogf/gf/v2/os/gctx"
    "github.com/gogf/gf/v2/os/gtime"
    "github.com/gogf/gf/v2/os/gtimer"
    "time"
)

func main() {
    var (
        ctx      = gctx.New()     // Create a new context
        delay    = time.Second    // Set the delay to 1 second
        interval = time.Second    // Set the interval to 1 second
    )
    
    fmt.Println("Start:", gtime.Now())

    // Add a delayed task that runs every second, starting after a 1-second delay
    gtimer.DelayAdd(
        ctx,
        delay,
        interval,
        func(ctx context.Context) {
            fmt.Println("Running:", gtime.Now())
        },
    )
    select {}
}
```

***Output after execution***

```bash
Start: 2021-05-27 13:26:02
Running: 2021-05-27 13:26:04
Running: 2021-05-27 13:26:05
Running: 2021-05-27 13:26:06
Running: 2021-05-27 13:26:07
Running: 2021-05-27 13:26:08
Running: 2021-05-27 13:26:09
Running: 2021-05-27 13:26:10
Running: 2021-05-27 13:26:11
...
```

## SetTimeout and SetInterval

These two methods are inspired by JavaScript's `setTimeout` and `setInterval` functions.

- **`SetTimeout`** creates a one-time task, though you can simulate repeated execution by recursively calling `SetTimeout`.
- **`SetInterval`** creates a repeating task that does not stop unless explicitly instructed.

```go
package main

import (
    "context"
    "fmt"
    "github.com/gogf/gf/v2/os/gctx"
    "github.com/gogf/gf/v2/os/gtime"
    "github.com/gogf/gf/v2/os/gtimer"
    "time"
)

func main() {
    var (
        ctx      = gctx.New()      // Create a new context
        timeout  = time.Second     // Set the timeout to 1 second
        interval = time.Second     // Set the interval to 1 second
    )

    // Set a one-time task that runs after a 1-second delay
    gtimer.SetTimeout(ctx, timeout, func(ctx context.Context) {
        fmt.Println("SetTimeout:", gtime.Now())
    })

    // Set a repeating task that runs every second
    gtimer.SetInterval(ctx, interval, func(ctx context.Context) {
        fmt.Println("SetInterval:", gtime.Now())
    })

    select {}
}
```

***Output after execution***

```bash
SetInterval: 2021-05-27 13:20:50
SetTimeout: 2021-05-27 13:20:50
SetInterval: 2021-05-27 13:20:51
SetInterval: 2021-05-27 13:20:52
SetInterval: 2021-05-27 13:20:53
SetInterval: 2021-05-27 13:20:54
SetInterval: 2021-05-27 13:20:55
SetInterval: 2021-05-27 13:20:56
SetInterval: 2021-05-27 13:20:57
SetInterval: 2021-05-27 13:20:58
...
```

## Exit Method

We can forcefully stop the execution of a task using the `Exit` method. This will remove the task from the timer and prevent it from running again.

```go
package main

import (
    "context"
    "fmt"
    "github.com/gogf/gf/v2/os/gctx"
    "github.com/gogf/gf/v2/os/gtime"
    "github.com/gogf/gf/v2/os/gtimer"
    "time"
)

func main() {
    var (
        ctx = gctx.New()  // Create a new context
    )

    // Set an interval task that stops itself after running once
    gtimer.SetInterval(ctx, time.Second, func(ctx context.Context) {
        fmt.Println("exit:", gtime.Now())
        gtimer.Exit()  // Exit the task
    })

    select {}
}
```

***Output after execution***

```bash
exit: 2021-05-27 13:31:24
```
