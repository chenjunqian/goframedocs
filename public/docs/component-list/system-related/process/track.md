# Process Management - Trace Linking

## Basic Introduction

The process management component supports cross-process trace linking, which is particularly useful for processes that run temporarily. The overall trace linking in the framework follows the OpenTelemetry specification.

## Usage Example

### Main Process

File: `main.go`

```go
package main

import (
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/os/gctx"
    "github.com/gogf/gf/v2/os/gproc"
)

func main() {
    ctx := gctx.GetInitCtx()
    g.Log().Debug(ctx, `this is main process`)
    if err := gproc.ShellRun(ctx, `go run sub.go`); err != nil {
        panic(err)
    }
}
```

### Sub-process

File: `sub.go`

```go
package main

import (
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/os/gctx"
)

func main() {
    ctx := gctx.GetInitCtx()
    g.Log().Debug(ctx, `this is sub process`)
}
```

### Execution Result

After executing the above code, the terminal output is as follows:

```bash
$ go run main.go
2022-06-21 20:35:06.196 [DEBU] {00698a61e2a2fa1661da5d7993d72e8c} this is main process
2022-06-21 20:35:07.482 [DEBU] {00698a61e2a2fa1661da5d7993d72e8c} this is sub process
```

As seen from the output, the trace information is automatically passed to the sub-process.
