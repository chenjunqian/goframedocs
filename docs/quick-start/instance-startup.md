# Startup

When you start your first project, you might feel confused by the numerous directories under the project. Don't worry, you can get to know the purpose of each directory through this section on [Project Directory Design](https://temperory.net). Next, we will introduce how the project is launched, which directories are involved in the startup of a program, to give everyone an understanding of the overall startup process of the program.

## Entry Point

### 1. main.go

All program entries are made through `main.go`, which calls the corresponding command in the `internal/cmd` package to initiate the program launch. In the project template, the `Run` command of the main object in the `internal/cmd` package is executed by default to guide the program startup.

The core components of the framework all require the passing of a context parameter. `gctx.GetInitCtx` is used to represent the creation of a context object with tracking features for downstream processes.

```go
package main

import (
    _ "github.com/gogf/template-single/internal/packed"

    "github.com/gogf/gf/v2/os/gctx"

    "github.com/gogf/template-single/internal/cmd"
)

func main() {
    cmd.Main.Run(gctx.GetInitCtx())
}
```

### 2. Bootstrap Command

The `Main` command `Run` is used to bootstrap the program. In this template, the `Run` command is used to start the `HTTP server`, register a group of routes. `Http server` run in a block state, while also asynchronously monitoring system signals. Once it receives a termination signal, it gracefully shuts down the connections and then exits the process.

```go
package cmd

import (
    "context"

    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/net/ghttp"
    "github.com/gogf/gf/v2/os/gcmd"

    "github.com/gogf/template-single/internal/controller/hello"
)

var (
    Main = gcmd.Command{
        Name:  "main",
        Usage: "main",
        Brief: "start http server",
        Func: func(ctx context.Context, parser *gcmd.Parser) (err error) {
            s := g.Server()
            s.Group("/", func(group *ghttp.RouterGroup) {
                group.Middleware(ghttp.MiddlewareHandlerResponse)
                group.Bind(
                    hello.NewV1(),
                )
            })
            s.Run()
            return nil
        },
    }
)
```

Related Code: [internal/cmd/cmd.go](https://github.com/gogf/template-single/blob/main/internal/cmd/cmd.go)

More detail of the `Command Line` in Goframe refer to [Command Line](https://temperory.net)

### 3. Router Registration

The `Group` method is used to create grouped routing. The framework's `HTTP Server` supports various methods of route registration, with grouped routing being one of the most common ways to register routes.

```go
s := g.Server()
s.Group("/", func(group *ghttp.RouterGroup) {
    group.Middleware(ghttp.MiddlewareHandlerResponse)
    group.Bind(
        controller.Hello
    )
})
```

Related Code: [internal/controller/hello/hello_v1_hello.go](https://github.com/gogf/template-single/blob/main/internal/controller/hello/hello_v1_hello.go)

Within the closure method of grouped routing, a middleware is registered through the `Middleware` method. This middleware is used by the `HTTP Server` component to standardize the data return of routes. The `Hello` route object is bound through the standardized routing method of `Bind`, and all public methods under this route object will be automatically registered as routes.

More detail of the `Router` in Goframe refer to [Router](https://temperory.net)

### 4. Router Object

In the template project, the `Hello` router object only has a `Hello` router as a example for template.

```go
package hello

import (
    "context"
    "github.com/gogf/gf/v2/frame/g"

    "github.com/gogf/template-single/api/hello/v1"
)

func (c *ControllerV1) Hello(ctx context.Context, req *v1.HelloReq) (res *v1.HelloRes, err error) {
    g.RequestFromCtx(ctx).Response.Writeln("Hello World!")
    return
}
```

The request parameters for `Hello` router is defined in `HeeloReq`

```go
// =================================================================================
// Code generated and maintained by GoFrame CLI tool. DO NOT EDIT. 
// =================================================================================

package hello

import (
    "context"
    
    "github.com/gogf/template-single/api/hello/v1"
)

type IHelloV1 interface {
    Hello(ctx context.Context, req *v1.IHelloV1) (res *v1.HelloRes, err error)
}
```

Related Code [api/hello/hello.go](https://github.com/gogf/template-single/blob/main/api/hello/hello.go)

More detail of [Router Registration](https://temperory.net)
