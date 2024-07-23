# CLI - Command

## Pain Points

The command line management we introduced earlier is done by obtaining parsed parameters and option data through the `parser` object of the callback function. There are some pain points when using it:

- It requires manually passing hard-coded parameter indices or option name information to retrieve data.

- It is difficult to define descriptions for parameters/options.

- It is difficult to define the data types for parameters/options.

- It is difficult to perform common data validation for parameters/options.

- It is a disaster for projects that need to manage a large number of command line arguments.

## Object-Oriented Command

We will transform the previously introduced `Command` example into structured management:

```go
package main

import (
    "context"
    "fmt"

    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/os/gcmd"
    "github.com/gogf/gf/v2/os/gctx"
)

type cMain struct {
    g.Meta `name:"main"`
}

type cMainHttpInput struct {
    g.Meta `name:"http" brief:"start http server"`
}
type cMainHttpOutput struct{}

type cMainGrpcInput struct {
    g.Meta `name:"grpc" brief:"start grpc server"`
}
type cMainGrpcOutput struct{}

func (c *cMain) Http(ctx context.Context, in cMainHttpInput) (out *cMainHttpOutput, err error) {
    fmt.Println("start http server")
    return
}

func (c *cMain) Grpc(ctx context.Context, in cMainGrpcInput) (out *cMainGrpcOutput, err error) {
    fmt.Println("start grpc server")
    return
}

func main() {
    cmd, err := gcmd.NewFromObject(cMain{})
    if err != nil {
        panic(err)
    }
    cmd.Run(gctx.New())
}
```

`Goframe` manage the parent command through an object, manage the next level of sub-commands through methods, and define the description/parameters/options of the sub-commands through standardized `Input` parameter objects. In most scenarios, you can ignore the use of the `Output` return object, but it should be retained for standardization and extensibility. If not used, simply return `nil` for the return parameter. There will be an introduction to the structure tags later.

After compiling the example code, execute it to see the effect:

```bash
$ main
USAGE
    main COMMAND [OPTION]

COMMAND
    http    start http server
    grpc    start grpc server

DESCRIPTION
    this is the command entry for starting your process
```

`http` command:

```bash
$ main http
start http server
```

`grpc` command:

```bash
$ main grpc
start grpc server
```

## Structured Parameters

Now that we're managing the command line through object-oriented methods, below is how parameters/options are managed in a structured way.

Below is a simplifyed example of the structured parameters and options, to start a `http` server:

```go
package main

import (
    "context"

    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/net/ghttp"
    "github.com/gogf/gf/v2/os/gcmd"
    "github.com/gogf/gf/v2/os/gctx"
)

type cMain struct {
    g.Meta `name:"main" brief:"start http server"`
}

type cMainHttpInput struct {
    g.Meta `name:"http" brief:"start http server"`
    Name   string `v:"required" name:"NAME" arg:"true" brief:"server name"`
    Port   int    `v:"required" short:"p" name:"port"  brief:"port of http server"`
}
type cMainHttpOutput struct{}

func (c *cMain) Http(ctx context.Context, in cMainHttpInput) (out *cMainHttpOutput, err error) {
    s := g.Server(in.Name)
    s.BindHandler("/", func(r *ghttp.Request) {
        r.Response.Write("Hello world")
    })
    s.SetPort(in.Port)
    s.Run()
    return
}

func main() {
    cmd, err := gcmd.NewFromObject(cMain{})
    if err != nil {
        panic(err)
    }
    cmd.Run(gctx.New())
}
```

For the `http` command, we defined two input parameters:

- `NAME`: The name of the service, input as an argument. It is in uppercase to be clearly displayed in the automatically generated help information.

- `PORT`: The port for the service, input through the `p/port` option.

Both parameters bind a required validation rule by `v:"required"` validation tag. In `Goframe`, a unified validation component is used wherever validation is involved.

After compiling, execute it to check the result:

```bash
$ main http
arguments validation failed for command "http": The Name field is required
1. arguments validation failed for command "http"
   1).  github.com/gogf/gf/v2/os/gcmd.newCommandFromMethod.func1
        /Users/john/Workspace/Go/GOPATH/src/github.com/gogf/gf/v2/os/gcmd/gcmd_command_object.go:290
   2).  github.com/gogf/gf/v2/os/gcmd.(*Command).doRun
        /Users/john/Workspace/Go/GOPATH/src/github.com/gogf/gf/v2/os/gcmd/gcmd_command_run.go:120
   3).  github.com/gogf/gf/v2/os/gcmd.(*Command).RunWithValueError
        /Users/john/Workspace/Go/GOPATH/src/github.com/gogf/gf/v2/os/gcmd/gcmd_command_run.go:77
   4).  github.com/gogf/gf/v2/os/gcmd.(*Command).RunWithValue
        /Users/john/Workspace/Go/GOPATH/src/github.com/gogf/gf/v2/os/gcmd/gcmd_command_run.go:32
   5).  github.com/gogf/gf/v2/os/gcmd.(*Command).Run
        /Users/john/Workspace/Go/GOPATH/src/github.com/gogf/gf/v2/os/gcmd/gcmd_command_run.go:26
   6).  main.main
        /Users/john/Workspace/Go/GOPATH/src/github.com/gogf/gf/.test/test.go:38
2. The Name field is required
```
