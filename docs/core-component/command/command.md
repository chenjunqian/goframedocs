# Command - Object

## Overview

In most scenarios, we manage individual or multiple commands through the `Command` command-line object, and use the default command-line parsing rules (without explicitly using the `Parser`). The `Command` object is defined as follows:

For more details, please refer to the interface documentation: <https://pkg.go.dev/github.com/gogf/gf/v2/os/gcmd@master#Command>

```go
// Command holds the info about an argument that can handle custom logic.
type Command struct {
    Name          string        // Command name(case-sensitive).
    Usage         string        // A brief line description about its usage, eg: gf build main.go [OPTION]
    Brief         string        // A brief info that describes what this command will do.
    Description   string        // A detailed description.
    Arguments     []Argument    // Argument array, configuring how this command act.
    Func          Function      // Custom function.
    FuncWithValue FuncWithValue // Custom function with output parameters that can interact with command caller.
    HelpFunc      Function      // Custom help function
    Examples      string        // Usage examples.
    Additional    string        // Additional info about this command, which will be appended to the end of help info.
    Strict        bool          // Strict parsing options, which means it returns error if invalid option given.
    Config        string        // Config node name, which also retrieves the values from config component along with command line.
    parent        *Command      // Parent command for internal usage.
    commands      []*Command    // Sub commands of this command.
}
```

## Callback

`Command` object supports three callback methods:

- `Func`: We usually need to customize this callback method to implement the operations for the current command execution.

- `FuncWithValue`: This method is similar to `Func`, but it supports return values, which are often used in scenarios where command lines call each other. Generally, this is not needed for most projects.

- `HelpFunc`: Customize the help information. Generally, there is not much need for this, as the `Command` object can automatically generate help information.

### `Func` Callback

Definition:

```go
// Function is a custom command callback function that is bound to a certain argument.
type Function func(ctx context.Context, parser *Parser) (err error)
```

The `parser` achieves and parse the arguments and options.

Usage example:

```go
package main

import (
    "context"

    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/net/ghttp"
    "github.com/gogf/gf/v2/os/gcmd"
    "github.com/gogf/gf/v2/os/gctx"
)

var (
    Main = &gcmd.Command{
        Name:        "main",
        Brief:       "start http server",
        Description: "this is the command entry for starting your http server",
        Func: func(ctx context.Context, parser *gcmd.Parser) (err error) {
            s := g.Server()
            s.BindHandler("/", func(r *ghttp.Request) {
                r.Response.Write("Hello world")
            })
            s.SetPort(8199)
            s.Run()
            return
        },
    }
)

func main() {
    Main.Run(gctx.New())
}
```

This is also the appearance of the startup command-line object for most projects. Most projects have only one entry point and only one callback method implementation.

### `HelpFunc` Callback

The `Command` object can customize the `HelpFunc` callback method, but it can automatically generate help usage information, which is usually not necessary to customize. Moreover, the `gcmd` component has built-in support for the `h/help` option, allowing programs using the gcmd component to automatically generate help information through these options.

Let's look at an example. First, we compile the above example into a binary file named `main` using `go build main.go`. Then, let's briefly look at the automatically generated help information in a scenario with only one command:

```bash
$ ./main -h
USAGE
    main [OPTION]

DESCRIPTION
    this is the command entry for starting your http server
```

## Hierarchical Command Management

### Parent&Sub Commands

A `Command` can have child commands, and when a `Command` has child commands, it becomes a parent command. Child commands can also have their own child commands, and so on, forming a hierarchical command relationship. Both parent and child commands can have their own callback methods, but in most scenarios, once a `Command` becomes a parent command, the callback method is often not very necessary. We usually add child commands to a `Command` using the `AddCommand` method:

```go
// AddCommand adds one or more sub-commands to current command.
func (c *Command) AddCommand(commands ...*Command) error
```

### Hierarchical Command Example

```go
package main

import (
    "context"
    "fmt"

    "github.com/gogf/gf/v2/os/gcmd"
    "github.com/gogf/gf/v2/os/gctx"
)

var (
    Main = &gcmd.Command{
        Name:        "main",
        Brief:       "start http server",
        Description: "this is the command entry for starting your process",
    }
    Http = &gcmd.Command{
        Name:        "http",
        Brief:       "start http server",
        Description: "this is the command entry for starting your http server",
        Func: func(ctx context.Context, parser *gcmd.Parser) (err error) {
            fmt.Println("start http server")
        return
    },
    }
    Grpc = &gcmd.Command{
        Name:        "grpc",
        Brief:       "start grpc server",
        Description: "this is the command entry for starting your grpc server",
        Func: func(ctx context.Context, parser *gcmd.Parser) (err error) {
            fmt.Println("start grpc server")
        return
    },
    }
)

func main() {
    err := Main.AddCommand(Http, Grpc)
    if err != nil {
        panic(err)
    }
    Main.Run(gctx.New())
}
```

We have added two sub-commands, `http/grpc`, to the main command using the `AddCommand` method, which are used to start the `http` and `grpc` services, respectively. When there are sub-commands, it is often unnecessary for the parent command to define a `Func` callback, so we have removed the Func definition for the main command here.

Let's compile it and then execute it to see the effect:

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

```go
$ main http
start http server
```

`grpc` command:

```go
$ main grpc
start grpc server
```
