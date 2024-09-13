# Queue Type Basic Usage

## Basic Usage

### Using Queue Pop

```go
package main

import (
    "fmt"
    "time"
    "github.com/gogf/gf/v2/os/gtimer"
    "github.com/gogf/gf/v2/container/gqueue"
)

func main() {
    q := gqueue.New()

    // Data producer, writes data to the queue every second
    gtimer.SetInterval(time.Second, func() {
        v := gtime.Now().String()
        q.Push(v)
        fmt.Println("Push:", v)
    })

    // Close the queue after 3 seconds
    gtimer.SetTimeout(3*time.Second, func() {
        q.Close()
    })

    // Consumer, continuously reads data from the queue and outputs it to the terminal
    for {
        if v := q.Pop(); v != nil {
            fmt.Println("Pop:", v)
        } else {
            break
        }
    }
}
```

The program will close the queue at the 3rd second, and thus, the output will only display data for the first 2 seconds:

```bash
Push: 2021-09-07 14:03:00
Pop: 2021-09-07 14:03:00
Push: 2021-09-07 14:03:01
Pop: 2021-09-07 14:03:01
```

### Using Queue C

```go
package main

import (
    "context"
    "fmt"
    "time"

    _ "github.com/gogf/gf/contrib/drivers/mysql/v2"
    "github.com/gogf/gf/v2/container/gqueue"
    "github.com/gogf/gf/v2/os/gctx"
    "github.com/gogf/gf/v2/os/gtime"
    "github.com/gogf/gf/v2/os/gtimer"
)

func main() {
    queue := gqueue.New()
    gtimer.AddTimes(gctx.GetInitCtx(), time.Second, 3, func(ctx context.Context) {
        queue.Push(gtime.Now().String())
    })
    for {
        select {
        case queueItem := <-queue.C:
            fmt.Println(queueItem)
        case <-time.After(3 * time.Second):
            fmt.Println("timeout, exit loop")
            return
        }
    }
}
```

### Enqueue and Dequeue

```go
package main

import (
    "fmt"
    "time"
    "github.com/gogf/gf/v2/os/gtimer"
    "github.com/gogf/gf/v2/container/gqueue"
)

func main() {
    q := gqueue.New()

    for i := 0; i < 10; i++ {
        q.Push(i)
    }

    fmt.Println(q.Pop())
    fmt.Println(q.Pop())
    fmt.Println(q.Pop())

    // Output:
    // 0
    // 1
    // 2
}
```

### Queue Length

```go
package main

import (
    "fmt"
    "time"
    "github.com/gogf/gf/v2/os/gtimer"
    "github.com/gogf/gf/v2/container/gqueue"
)

func main() {
    q := gqueue.New()

    q.Push(1)
    q.Push(2)

    fmt.Println(q.Len())
    // Size is an alias for the Len method
    fmt.Println(q.Size())

    // May Output:
    // 2
    // 2
}
```

### Queue Closing

```go
package main

import (
    "fmt"
    "time"
    "github.com/gogf/gf/v2/os/gtimer"
    "github.com/gogf/gf/v2/container/gqueue"
)

func main() {
    q := gqueue.New()

    for i := 0; i < 10; i++ {
        q.Push(i)
    }

    fmt.Println(q.Pop())
    q.Close()
    fmt.Println(q.Pop())
    fmt.Println(q.Len())

    // Output:
    // 0
    // <nil>
    // 0
}
```

## gqueue and glist

The `gqueue` is based on the `glist` linked list to implement its dynamic size feature. When the queue is full or empty, reading data will cause blocking.

`glist` is a concurrency-safe linked list that can function like a regular list when concurrency safety is disabled, allowing for non-blocking data storage and retrieval.
