# PProf Service Performance Analysis

The `GoFrame` framework's `Web Server` provides a very powerful and convenient service performance analysis feature, which perfectly integrates the `pprof` performance analysis tool. You can enable performance analysis at any time through the `EnablePProf` method and customize the performance analysis tool page route address. If the route address is not passed, the default URI address is `/debug/pprof`.

## PProf Activation

> Activating the `PProf` feature will have a certain impact on program performance. The specific degree of impact needs to be compared before and after `PProf` activation based on the current business scenario.

### EnablePProf

Let's look at a simple example:

```go
package main

import (
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/net/ghttp"
    "runtime"
)

func main() {
    runtime.SetMutexProfileFraction(1) // (Optional) Enable tracking of lock calls
    runtime.SetBlockProfileRate(1)     // (Optional) Enable tracking of blocking operations

    s := g.Server()
    s.EnablePProf()
    s.BindHandler("/", func(r *ghttp.Request) {
        r.Response.Writeln("Hello world!")
    })
    s.SetPort(8199)
    s.Run()
}
```

This example uses `s.EnablePProf()` to enable performance analysis, which will automatically register the following route rules by default:

```bash
/debug/pprof/*action
/debug/pprof/cmdline
/debug/pprof/profile
/debug/pprof/symbol
/debug/pprof/trace
```

Among them, `/debug/pprof/*action` is the route for page access, and the other addresses are prepared for the `go tool pprof` command.

### StartPProfServer

You can also use the `StartPProfServer` method to quickly start a standalone `PProf Server`, which is often used in processes without an `HTTP Server` (such as scheduled tasks, `GRPC` services) to quickly start a `PProf Server` for program performance analysis. The definition of this method is as follows:

```go
func StartPProfServer(port int, pattern ...string)
```

The general scenario is to run the `PProf Server` asynchronously using a `goroutine`, which is often used like this:

```go
package main

import (
    "github.com/gogf/gf/v2/net/ghttp"
)

func main() {
    go ghttp.StartPProfServer(8199)
    // Other service startup and operation
    // ...
}
```

The above example can be improved to:

```go
package main

import (
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/net/ghttp"
)

func main() {
    go ghttp.StartPProfServer(8299)

    s := g.Server()
    s.EnablePProf()
    s.BindHandler("/", func(r *ghttp.Request) {
        r.Response.Writeln("Hello world!")
    })
    s.SetPort(8199)
    s.Run()
}
```

## PProf Metrics

- **heap**: Reports memory allocation samples; used to monitor current and historical memory usage and check for memory leaks.
- **threadcreate**: Reports the parts of the program that lead to the creation of new OS threads.
- **goroutine**: Reports the stack traces of all current goroutines.
- **block**: Shows where goroutines are blocking on synchronization primitives (including timer channels). Disabled by default, manual activation with `runtime.SetBlockProfileRate` is required.
- **mutex**: Reports lock contention. Disabled by default, manual activation with `runtime.SetMutexProfileFraction` is required.

## PProf Pages

For simple performance analysis, we can directly access the `/debug/pprof` address, and the content is as follows:

1. **PProf Page**
2. **Heap Usage**
3. **Details of Goroutines in the Current Process**

## Performance Collection and Analysis

If you want to perform a detailed performance analysis, you basically cannot do without the support of the `go tool pprof` command-line tool. After enabling performance analysis support, you can use the following command to perform performance collection and analysis:

```shell
go tool pprof -http :8080 "http://127.0.0.1:8199/debug/pprof/profile"
```

You can also export the pprof file and then open it with the `go tool pprof` command:

```shell
curl http://127.0.0.1:8199/debug/pprof/profile > pprof.profile
go tool pprof -http :8080 pprof.profile
```

After execution, the `pprof` tool collects interface information for about `30 seconds` (during which the `WebServer` should have traffic), then generates a performance analysis report. Subsequently, you can use the `top10/web` and other `pprof` commands to view the report results. For more commands, use `go tool pprof`. For a detailed introduction to `pprof`, please refer to the Golang official blog: [blog.golang.org/profiling-go-programs](https://blog.golang.org/profiling-go-programs).

### CPU Performance Analysis

The command line performance analysis result in this example is as follows:

```shell
$ go tool pprof -http :8080 "http://127.0.0.1:8199/debug/pprof/profile"
Serving web UI on http://localhost:8080
```

> To graphically display pprof, you need to install the Graphviz graphical tool. Taking my current system as Ubuntu, you can directly execute `sudo apt-get install graphviz` to install the graphical tool (for MacOS, use `brew install Graphviz`).

After running, it will open the following graphical interface in the default browser, showing the CPU overhead chain during this period.

### Memory Usage Analysis

Similar to CPU performance analysis, memory usage analysis also uses the `go tool pprof` command:

```shell
$ go tool pprof -http :8080 "http://127.0.0.1:8199/debug/pprof/heap"
Serving web UI on http://localhost:8080
```

### Goroutine Usage Analysis

Similar to the above analyses, goroutine usage analysis also uses the `go tool pprof` command:

```shell
$ go tool pprof -http :8080 "http://127.0.0.1:8199/debug/pprof/goroutine"
Serving web UI on http://localhost:8080
```
