# Command - Structured Parameters

## Pain Points

The command line management we introduced before relies on the `parser` object of the callback function to obtain parsed arguments and options data. There are several pain points when using this:

- It requires manually passing hard-coded parameter indices or option names to retrieve data.

- It is difficult to define descriptions for parameters/options.

- It is challenging to define the data types for parameters/options.

- It is hard to perform common data validation for parameters/options.

- This can be a disaster for projects that need to manage a large number of command line arguments.

## Object-Oriented Command

Here is a simple example of the object-oriented command line management:

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

The output withou any parameter:

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

With `http` command:

```bash
$ main http
start http server
```

With `grpc` command:

```bash
$ main grpc
start grpc server
```

## Structured Parameter

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

It failed due to the `NAME` parameter is required.

`Goframe` adopts a full error stack design, where all component errors come with a bottom-up error stack to facilitate quick error location. We can obtain the error object returned by the `RunWithError` method to close the stack information.

Now add parameter input and try again:

```bash
$ main http my-http-server -p 8199
2022-01-19 22:52:45.808 [DEBU] openapi specification is disabled

      SERVER     | DOMAIN  | ADDRESS | METHOD | ROUTE |                             HANDLER                             |    MIDDLEWARE
-----------------|---------|---------|--------|-------|-----------------------------------------------------------------|--------------------
  my-http-server | default | :8199   | ALL    | /     | main.(*cMain).Http.func1                                        |
-----------------|---------|---------|--------|-------|-----------------------------------------------------------------|--------------------
  my-http-server | default | :8199   | ALL    | /*    | github.com/gogf/gf/v2/net/ghttp.internalMiddlewareServerTracing | GLOBAL MIDDLEWARE
-----------------|---------|---------|--------|-------|-----------------------------------------------------------------|--------------------

2022-01-19 22:52:45.810 66292: http server started listening on [:8199]
```

`Goframe` development tool commonly utilizes object-oriented, structured command line management. For more details, please refer: <https://github.com/gogf/gf/tree/master/cmd/gf>

## Pre-Defined Tags

`Goframe` also provides a pre-defined struct tags.

- `name`: The name of the command.
  - If it is an input argument structure, the name will automatically be read from the method name when the name is not specified.

- `short`: The short name of the command.

- `usage`: The description of the command.

- `brief`: The brief description of the command.

- `arg`: The input argument, not the option.
  - Only use for tag

- `orpah`: Withou parameters.

- `description`: The description of the command, shorten with `dc`.

- `additional`: The additional description of the command, shorten with `ad`.

- `example`: The example of the command, shorten with `eg`.

- `root`: Specifying the child command name as the parent command, other methods are its child commands.
  - Only use for `Meta` struct command tag

- `strict`: The strict mode, if the `input` parameter/option is not specified, an error will be reported.
  - Only use for `Meta` struct command tag

- `config`: The command's option data supports being read from a specified configuration, which is sourced from the default global singleton configuration object.
  - Only use for `Meta` struct command tag

## Advanced Features

### Automatic Data Conversion

Structured parameter input supports automatic data type conversion. You just need to define the data type, and the framework component will take care of the rest. Automatic data type conversion is found in many components of `goframe`, especially in the parameter input of `HTTP/GRPC` services. The underlying data conversion component used is: [Type Conversion](https://temperory.net).

Command line argument data conversion follows a case-insensitive and special character-ignoring rule to match property fields. For example, if there is a field property called Name in the input argument structure, whether the command line input is named `name` or `NAME`, it will be received by the Name field property.

### Automatic Data Validation

Similarly, the data validation component also uses a unified component. For details, please refer to the section: [Data Validation](https://temperory.net).

### Reading Data from Configuration

When the corresponding data is not passed in the command line, the structured data of the input parameter supports automatic retrieval from the configuration component. Simply set the `config` tag in `Meta`, and the configuration is sourced from the default global singleton configuration object. For specific examples, you can refer to the source code of the `Goframe` framework development tool: <https://github.com/gogf/gf/tree/master/cmd/gf>
