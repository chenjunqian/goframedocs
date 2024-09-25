# Process Management - Signal Listening

## Basic Introduction

The `gproc` component provides unified signal listening and callback processing functionality. Its purpose is to address the redundancy in signal handling logic across different components in the program and to solve the issue where the program cannot gracefully destruct after receiving exit signals.

Without a unified signal listening component, when multiple components listen to signals asynchronously using goroutines, the main goroutine often exits immediately upon receiving an exit signal or waits for an unpredictable period, causing the program to exit ungracefully, which may lead to unexpected issues. By using `gproc` for unified signal registration and callback handling, each component can effectively receive exit signals and perform the appropriate cleanup actions, making the program's signal handling logic more rigorous.

## Relevant Methods

```go
// AddSigHandler adds a custom signal handler for one or more signals.
func AddSigHandler(handler SigHandler, signals ...os.Signal)

// AddSigHandlerShutdown adds custom signal handlers for shutdown signals, including:
// syscall.SIGINT,
// syscall.SIGQUIT,
// syscall.SIGKILL,
// syscall.SIGTERM,
// syscall.SIGABRT.
func AddSigHandlerShutdown(handler ...SigHandler)

// Listen blocks the program and listens for signal handling.
func Listen()
```

## Brief Introduction

- The `AddSigHandler` method is used to register a signal listener for the specified signals and their corresponding callback functions.
- The `AddSigHandlerShutdown` method registers listeners for common process exit signals and their corresponding callback functions. Multiple `SigHandler`s can be registered.
- The `Listen` method blocks and listens for signals, automatically executing the registered callback functions when signals are received.

Let's look at two examples.

## Example 1: Using Standard Library for Signal Listening

The following code demonstrates common logic for signal listening using the standard library:

```go
package main

import (
    "fmt"
    "os"
    "os/signal"
    "syscall"
    "time"
)

func signalHandlerForMQ() {
    var (
        sig          os.Signal
        receivedChan = make(chan os.Signal)
    )
    signal.Notify(
        receivedChan,
        syscall.SIGINT,
        syscall.SIGQUIT,
        syscall.SIGKILL,
        syscall.SIGTERM,
        syscall.SIGABRT,
    )
    for {
        sig = <-receivedChan
        fmt.Println("MQ is shutting down due to signal:", sig.String())
        time.Sleep(time.Second)
        fmt.Println("MQ is shut down smoothly")
        return
    }
}

func main() {
    fmt.Println("Process start, pid:", os.Getpid())
    go signalHandlerForMQ()

    var (
        sig          os.Signal
        receivedChan = make(chan os.Signal)
    )
    signal.Notify(
        receivedChan,
        syscall.SIGINT,
        syscall.SIGQUIT,
        syscall.SIGKILL,
        syscall.SIGTERM,
        syscall.SIGABRT,
    )
    for {
        sig = <-receivedChan
        fmt.Println("MainProcess is shutting down due to signal:", sig.String())
        return
    }
}
```

We can run the program using the `go run` command, then exit using the `Ctrl+C` shortcut (Mac users can use `Command+C`).

```bash
$ go run signal_handler.go
Process start, pid: 21928
^CMainProcess is shutting down due to signal: interrupt
MQ is shutting down due to signal: interrupt
```

As you can see, unfortunately, the `MQ` goroutine hasn't fully exited before the process is forcefully terminated.

## Example 2: Using gproc for Signal Listening

Here's the improved signal listening mechanism using the `gproc` component:

```go
package main

import (
    "fmt"
    "github.com/gogf/gf/v2/os/gproc"
    "os"
    "time"
)

func signalHandlerForMQ(sig os.Signal) {
    fmt.Println("MQ is shutting down due to signal:", sig.String())
    time.Sleep(time.Second)
    fmt.Println("MQ is shut down smoothly")
}

func signalHandlerForMain(sig os.Signal) {
    fmt.Println("MainProcess is shutting down due to signal:", sig.String())
}

func main() {
    fmt.Println("Process start, pid:", os.Getpid())
    gproc.AddSigHandlerShutdown(
        signalHandlerForMQ,
        signalHandlerForMain,
    )
    gproc.Listen()
}
```

Run the program using the `go run` command, then exit using the `Ctrl+C` shortcut (Mac users can use `Command+C`).

```bash
$ go run signal_handler_gproc.go
Process start, pid: 22876
^CMQ is shutting down due to signal: interrupt
MainProcess is shutting down due to signal: interrupt
MQ is shut down smoothly
```

Do you see the difference? All the signal listening functions exit properly, and then the process smoothly shuts down.
