# Smooth Restart Feature

`Smooth restart` (`hot restart`) refers to the ability of the `WebServer` to restart without interrupting existing requests. This feature is particularly useful when deploying different project versions sequentially, such as deploying versions `A` and `B`. During the execution of `A`, we can directly overwrite `A`'s program with `B`'s program and use the smooth restart feature (via `Web` or `command line`) to seamlessly transition requests to the new version of the service.

The `GoFrame` framework supports convenient `Web management` capabilities, allowing us to perform `server` restart/shutdown management operations directly through a Web page/interface. Additionally, the framework supports server restart/shutdown management operations through `command-line terminal` commands (limited to `*nix` systems).

## Feature Activation

By default, the smooth restart feature is disabled and can be activated through the `graceful` configuration option. For details, please refer to the `WebServer` configuration management section: [Service Configuration - Configuration File Template](/docs/web-development/server-config/template).

> Currently, the smooth restart feature requires a randomly opened `TCP` listening service on a local port for communication and status exchange between the old and new processes.

## Precautions

- This feature is limited to `*nix` systems (`Linux/Unix/FreeBSD`, etc.), and only full restart functionality is supported on `Windows` (requests cannot be smoothly transitioned).
- When testing the smooth restart feature, do not use `IDE run` (such as Goland) or the `go run` command to run the process, as these methods create parent processes to manage the running `Go` process, which can cause failure in the status exchange between parent and child processes during smooth restart.
- The `SetGraceful` configuration method in the following examples was added after version `v2.7.4`. For versions lower than `v2.7.4`, please use the configuration management method to enable the smooth restart feature.

## Management Methods

Let's take a look at the management operations involved in the WebServer:

```go
func (s *Server) Restart(newExeFilePath...string) error
func (s *Server) Shutdown() error
func (s *Server) EnableAdmin(pattern...string)
```

`Restart` is used for restarting the service (smooth restart on `*nix` systems and full restart on Windows), Shutdown is for shutting down the service, and EnableAdmin is for registering the management page to a specified route rule, with the default address being `/debug/admin` (we can specify a private management address, and we can also use middleware to authenticate this page).

Here is a detailed explanation of two of these methods:

### Restart

The `Restart` parameter can specify a custom restart executable file path (`newExeFilePath`). If not passed, it defaults to the original executable file path. Especially on Windows systems, when the executable file is in use, it cannot be replaced (new version file replaces the old version file). When a custom executable file path is specified, the `Server` will execute the new version of the executable file during restart, no longer using the old version file. This feature simplifies the version update process on some systems.

### EnableAdmin

- Firstly, this method provides a convenient page and interface for users to manage the `Server`, which is very handy for single `Server` management. Directly access the management page and click the corresponding link. It is important to note that since it has management functions, if it is in a production environment, it is recommended to customize this management address to a private address.

- Additionally, the `restart` interface provided by `EnableAdmin` also supports a custom executable file path. Simply pass the `newExeFilePath` variable through the `GET` parameter to the restart interface, for example: [http://127.0.0.1/debug/admin/restart?newExeFilePath=xxxxxxx](http://127.0.0.1/debug/admin/restart?newExeFilePath=xxxxxxx).

- Moreover, in most cases, there are usually not just one `Server` node, so in most service management operations, such as restart operations, it is not feasible to manually execute restart operations by directly accessing each `Server`'s `admin` page. Instead, fully utilize the functional interfaces provided by the `admin` page to achieve unified `Server` management and control through interface control.

### Example 1: Basic Usage

```go
package main

import (
    "time"

    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/net/ghttp"
    "github.com/gogf/gf/v2/os/gproc"
)

func main() {
    s := g.Server()
    s.BindHandler("/", func(r *ghttp.Request) {
        r.Response.Writeln("Hello!")
    })
    s.BindHandler("/pid", func(r *ghttp.Request) {
        r.Response.Writeln(gproc.Pid())
    })
    s.BindHandler("/sleep", func(r *ghttp.Request) {
        r.Response.Writeln(gproc.Pid())
        time.Sleep(10 * time.Second)
        r.Response.Writeln(gproc.Pid())
    })
    s.SetGraceful(true)
    s.EnableAdmin()
    s.SetPort(8199)
    s.Run()
}
```

We can test the smooth restart through the following steps:

1. Visit [http://127.0.0.1:8199/pid](http://127.0.0.1:8199/pid) to view the current process's pid.

2. Visit [http://127.0.0.1:8199/sleep](http://127.0.0.1:8199/sleep), this page will execute for 10 seconds, used to test whether the request execution will be interrupted during the restart.

3. Visit [http://127.0.0.1:8199/debug/admin](http://127.0.0.1:8199/debug/admin), which is a default WebServer management page registered after `s.EnableAdmin`.

4. Then we click the restart management link, and the WebServer will immediately smooth restart (on *nix systems).

    At the same time, the terminal will output the following information:

    ```bash
    2018-05-18 11:02:04.812 11511: http server started listening on [:8199]
    2018-05-18 11:02:09.172 11511: server reloading
    2018-05-18 11:02:09.172 11511: all servers shutdown
    2018-05-18 11:02:09.176 16358: http server restarted listening on [:8199]
    ```

5. We can see that during the entire operation, the execution of the `sleep` page was not interrupted. After waiting a few more seconds, when the sleep execution is completed, the page output is as follows:

6. It can be observed that the process pid output by the `sleep` page is different from before, indicating that the request execution was smoothly taken over by the new process, and the old service process was also destroyed.

### Example 2: HTTPS Support

```go
package main

import (
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/net/ghttp"
)

func main() {
    s := g.Server()
    s.BindHandler("/", func(r *ghttp.Request){
        r.Response.Writeln("Hello!")
    })
    s.SetGraceful(true)
    s.EnableHTTPS("/home/john/temp/server.crt", "/home/john/temp/server.key")
    s.EnableAdmin()
    s.SetPort(8200)
    s.Run()
}
```

The `GoFrame` framework's smooth restart feature is also very friendly and convenient for HTTPS support. The operation steps are as follows:

- Visit [https://127.0.0.1:8200/debug/admin/restart](https://127.0.0.1:8200/debug/admin/restart) to smoothly restart the HTTPS service.
- Visit [https://127.0.0.1:8200/debug/admin/shutdown](https://127.0.0.1:8200/debug/admin/shutdown) to smoothly shut down the WebServer service.

The command line terminal will display the following output information:

```bash
2018-05-18 11:13:05.554 17278: https server started listening on [:8200]
2018-05-18 11:13:21.270 17278: server reloading
2018-05-18 11:13:21.270 17278: all servers shutdown
2018-05-18 11:13:21.278 17319: https server reloaded listening on [:8200]
2018-05-18 11:13:34.895 17319: server shutting down
2018-05-18 11:13:34.895 17269: all servers shutdown
```

### Example 3: Multiple Services and Ports

The `GoFrame` framework's smooth restart feature is quite powerful and stable, supporting not only single service single port listening management but also complex scenarios such as multiple services and multiple ports.

```go
package main

import (
    "github.com/gogf/gf/v2/frame/g"
)

func main() {
    s1 := g.Server("s1")
    s1.SetGraceful(true)
    s1.EnableAdmin()
    s1.SetPort(8100, 8200)
    s1.Start()

    s2 := g.Server("s2")
    s2.SetGraceful(true)
    s2.EnableAdmin()
    s2.SetPort(8300, 8400)
    s2.Start()

    g.Wait()
}
```

The above example demonstrates two WebServers, `s1` and `s2`, listening on ports `8100`, `8200`, and `8300`, `8400`, respectively. We then visit [http://127.0.0.1:8100/debug/admin/reload](http://127.0.0.1:8100/debug/admin/reload) to smoothly restart the service, and then smoothly shut down the service through [http://127.0.0.1:8100/debug/admin/shutdown](http://127.0.0.1:8100/debug/admin/shutdown). The final information printed in the terminal is as follows:

```bash
2018-05-18 11:26:54.729 18111: http server started listening on [:8400]
2018-05-18 11:26:54.729 18111: http server started listening on [:8100]
2018-05-18 11:26:54.729 18111: http server started listening on [:8300]
2018-05-18 11:26:54.729 18111: http server started listening on [:8200]
2018-05-18 11:27:08.203 18111: server reloading
2018-05-18 11:27:08.203 18111: all servers shutdown
2018-05-18 11:27:08.207 18124: http server reloaded listening on [:8300]
2018-05-18 11:27:08.207 18124: http server reloaded listening on [:8400]
2018-05-18 11:27:08.207 18124: http server reloaded listening on [:8200]
2018-05-18 11:27:08.207 18124: http server reloaded listening on [:8100]
2018-05-18 11:27:19.379 18124: server shutting down
2018-05-18 11:27:19.380 18102: all servers shutdown
```

## Command Line Management

In addition to providing `Web-based` management capabilities, the `GoFrame` framework also supports management through the command line, which uses `signals` for management.

### Restarting Service

Implemented using the SIGUSR1 signal, usage:

```bash
kill -SIGUSR1 ProcessID
```

### Shutting Down Service

Implemented using any of the signals `SIGINT/SIGQUIT/SIGKILL/SIGHUP/SIGTERM`, usage:

```bash
kill -SIGTERM ProcessID
```

### Other Management Methods

Since the `GoFrame` framework's `WebServer` uses a singleton design, any place can obtain the corresponding `Server` `singleton` object through `g.Server(name)`, and then the `Restart` and `Shutdown` methods can be used to manage the Server.
