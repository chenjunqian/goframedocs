# Process Management - Process Communication

> **Note:** The inter-process communication feature provided by `gproc` is currently experimental!

## Principle of Inter-Process Communication

> **"Do not communicate by sharing memory; instead, share memory by communicating."**

There are five common methods for inter-process communication:

- **Pipes**
- **Signals**
- **Shared Memory**
- **Shared Files**
- **Sockets**

Each of these methods is typically best suited for specific use cases:

- **Signals**: Primarily used in *nix systems, signals have poor cross-platform support and provide limited information transfer capabilities.
- **Pipes**: There are two types—regular pipes and named pipes. Pipes are frequently used for communication between parent and child processes but are less suitable for communication between unrelated processes.
- **Shared Memory / Shared Files**: From a concurrent architecture design perspective, we try to minimize the use of lock mechanisms. Both shared memory (memory locks) and shared files (file locks) rely on locking mechanisms to ensure data integrity. However, the complexity introduced by these mechanisms often outweighs the benefits.
  
The inter-process communication mechanism implemented by `gproc` is based on **Sockets**. This mechanism is stable and has broad applicability.

## gproc Process Communication API

The `gproc` API for process communication is very simple and can be implemented with just two methods:

```go
func Send(pid int, data []byte) error
func Receive() *Msg
```

- `Send`: Sends data to a specified process (each call sends one message).
- `Receive`: Receives data in a queue-like manner from other processes. If the queue is empty, this method will block and wait for data.

### Example of Inter-Process Communication

Here’s a basic example demonstrating how to communicate between processes using `gproc`:

```go
package main

import (
    "context"
    "fmt"
    "github.com/gogf/gf/v2/os/gctx"
    "github.com/gogf/gf/v2/os/gproc"
    "github.com/gogf/gf/v2/os/gtime"
    "github.com/gogf/gf/v2/os/gtimer"
    "os"
    "time"
)

var (
 ctx = gctx.New()
)

func main() {
    fmt.Printf("%d: I am child? %v\n", gproc.Pid(), gproc.IsChild())
    if gproc.IsChild() {
        gtimer.SetInterval(ctx, time.Second, func(ctx context.Context) {
        err := gproc.Send(gproc.PPid(), []byte(gtime.Datetime()))
        if err != nil {
            return
        }
    })
    select {}
    } else {
        m := gproc.NewManager()
        p := m.NewProcess(os.Args[0], os.Args, os.Environ())
        p.Start(ctx)
        for {
            msg := gproc.Receive()
            fmt.Printf("receive from %d, data: %s\n", msg.SenderPid, string(msg.Data))
        }
    }
}
```

In this example, the main process creates a child process at startup. The child process sends the current time to the parent process every second. The parent process receives these messages and outputs the data to the terminal.

After running the program, the terminal output will look like this:

```bash
29978: I am child? false
29984: I am child? true
receive from 29984, data: 2018-05-18 15:01:00
receive from 29984, data: 2018-05-18 15:01:01
receive from 29984, data: 2018-05-18 15:01:02
receive from 29984, data: 2018-05-18 15:01:03
receive from 29984, data: 2018-05-18 15:01:04
...
```
