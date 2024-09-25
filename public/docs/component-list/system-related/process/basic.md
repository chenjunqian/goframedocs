# Process Management - Basic Usage

## Executing Shell Commands

Below is an example of how to execute shell commands using the `gproc` package in GoFrame:

```go
package main

import (
    "fmt"
    "github.com/gogf/gf/v2/os/gctx"
    "github.com/gogf/gf/v2/os/gproc"
)

func main() {
    r, err := gproc.ShellExec(gctx.New(), `sleep 3; echo "hello gf!";`)
    fmt.Println("result:", r)
    fmt.Println(err)
}
```

After execution, the program will wait for 3 seconds and then output the following result:

```bash
result: hello gf!
<nil>
```

## Parent and Child Processes

Processes created by the `gproc.Manager` object are marked as child processes by default. Within a child process, you can determine if the current process is a child process by using the `gproc.IsChild()` method.

Here’s an example of how to create and manage child processes:

```go
package main

import (
    "os"
    "time"
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/os/gctx"
    "github.com/gogf/gf/v2/os/gproc"
)

func main() {
    var ctx = gctx.New()
    if gproc.IsChild() {
        g.Log().Printf(ctx, "%d: Hi, I am child, waiting 3 seconds to die", gproc.Pid())
        time.Sleep(time.Second)
        g.Log().Printf(ctx, "%d: 1", gproc.Pid())
        time.Sleep(time.Second)
        g.Log().Printf(ctx, "%d: 2", gproc.Pid())
        time.Sleep(time.Second)
        g.Log().Printf(ctx, "%d: 3", gproc.Pid())
    } else {
        m := gproc.NewManager()
        p := m.NewProcess(os.Args[0], os.Args, os.Environ())
        p.Start(ctx)
        p.Wait()
        g.Log().Printf(ctx, "%d: child died", gproc.Pid())
    }
}
```

After execution, the terminal will print the following results:

```bash
2018-05-18 14:35:41.360 28285: Hi, I am child, waiting 3 seconds to die
2018-05-18 14:35:42.361 28285: 1
2018-05-18 14:35:43.361 28285: 2
2018-05-18 14:35:44.361 28285: 3
2018-05-18 14:35:44.362 28278: child died
```

## Multi-Process Management

`gproc` not only supports creating and managing child processes, but it can also manage other processes that it didn’t create. This means it can manage multiple processes simultaneously. Below, we demonstrate process management using a single process.

First, open any file with the `gedit` software (a commonly used text editor on Linux), and find the process ID (PID) for the `gedit` process:

```bash
$ ps aux | grep gedit
john  28536  3.6  0.6 946208 56412 ?  Sl  14:39  0:00 gedit /home/john/Documents/text
```

In the above example, the process ID for `gedit` is `28536`.

Now, let’s write a program to manage this process:

```go
package main

import (
    "fmt"
    "github.com/gogf/gf/v2/os/gproc"
)

func main() {
    pid := 28536
    m := gproc.NewManager()
    m.AddProcess(pid)
    m.KillAll()
    m.WaitAll()
    fmt.Printf("%d was killed\n", pid)
}
```

After executing the above program, `gedit` will be closed, and the terminal output will show:

```bash
28536 was killed
```
