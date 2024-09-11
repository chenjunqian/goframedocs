# Command - Tracing

## Overview

`Goframe` command line componenet also support cross process tracing, especially for some temporary process.

Tracing in `Goframe` is base on `OpenTelemetry` standard.

## Example

***Main Process***

```go
package main

import (
    "context"

    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/os/gcmd"
    "github.com/gogf/gf/v2/os/gctx"
    "github.com/gogf/gf/v2/os/gproc"
)

var (
    Main = &gcmd.Command{
        Name:  "main",
        Brief: "main process",
        Func: func(ctx context.Context, parser *gcmd.Parser) (err error) {
            g.Log().Debug(ctx, `this is main process`)
            return gproc.ShellRun(ctx, `go run sub.go`)
        },
    }
)

func main() {
    Main.Run(gctx.GetInitCtx())
}
```

***Sub-Process***

```go
package main

import (
    "context"

    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/os/gcmd"
    "github.com/gogf/gf/v2/os/gctx"
)

var (
    Sub = &gcmd.Command{
        Name:  "sub",
        Brief: "sub process",
        Func: func(ctx context.Context, parser *gcmd.Parser) (err error) {
            g.Log().Debug(ctx, `this is sub process`)
            return nil
        },
    }
)

func main() {
    Sub.Run(gctx.GetInitCtx())
}
```

***Result***

```bash
$ go run main.go
2022-06-21 20:35:06.196 [DEBU] {00698a61e2a2fa1661da5d7993d72e8c} this is main process
2022-06-21 20:35:07.482 [DEBU] {00698a61e2a2fa1661da5d7993d72e8c} this is sub process
```

We can see that the tracing information is passed from the main process to the sub process.
