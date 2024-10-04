# Request Input - Context

## Basic Introduction

Request processes often involve sharing some custom settings in the context, such as setting variables at the beginning of the request through middleware, which can then be retrieved in the route service method for corresponding processing. This need is very common. In the `GoFrame` framework, we recommend using the `Context` object to handle process-shared context variables, and even passing this object further into the dependent modules. The `Context` object type implements the standard library's `context.Context` interface, which is often used as the first parameter of module invocation methods and is the recommended way by the Golang official for passing context variables between modules.

***Method List***

```go
func (r *Request) GetCtx() context.Context
func (r *Request) SetCtx(ctx context.Context)
func (r *Request) GetCtxVar(key interface{}, def ...interface{}) *gvar.Var
func (r *Request) SetCtxVar(key interface{}, value interface{})
```

***Brief Explanation***

- `GetCtx` method is used to retrieve the current `context.Context` object, which serves the same purpose as the Context method.
- `SetCtx` method is used to set a custom `context.Context` context object.
- `GetCtxVar` method is used to retrieve context variables and can provide a default value if the variable does not exist.
- `SetCtxVar` method is used to set context variables.

## Usage Example

### Example 1: SetCtxVar GetCtxVar

```go
package main

import (
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/net/ghttp"
)

const (
    TraceIdName = "trace-id"
)

func main() {
    s := g.Server()
    s.Group("/", func(group *ghttp.RouterGroup) {
        group.Middleware(func(r *ghttp.Request) {
            r.SetCtxVar(TraceIdName, "HBm876TFCde435Tgf")
            r.Middleware.Next()
        })
        group.ALL("/", func(r *ghttp.Request) {
            r.Response.Write(r.GetCtxVar(TraceIdName))
        })
    })
    s.SetPort(8199)
    s.Run()
}
```

It can be seen that we can set and get custom variables through `SetCtxVar` and `GetCtxVar`. The lifecycle of these variables is limited to the current request process.

After execution, when accessing `http://127.0.0.1:8199/`, the page output content will be:

```bash
HBm876TFCde435Tgf
```

### Example 2: SetCtx

The `SetCtx` method is often used in middleware to integrate some third-party components, such as third-party link tracking components, etc.

To simplify the example, we will transform the above example using the `SetCtx` method for demonstration.

```go
package main

import (
    "context"
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/net/ghttp"
)

const (
    TraceIdName = "trace-id"
)

func main() {
    s := g.Server()
    s.Group("/", func(group *ghttp.RouterGroup) {
        group.Middleware(func(r *ghttp.Request) {
            ctx := context.WithValue(r.Context(), TraceIdName, "HBm876TFCde435Tgf")
            r.SetCtx(ctx)
            r.Middleware.Next()
        })
        group.ALL("/", func(r *ghttp.Request) {
            r.Response.Write(r.Context().Value(TraceIdName))
            // Alternatively, you can use
            // r.Response.Write(r.GetCtxVar(TraceIdName))
        })
    })
    s.SetPort(8199)
    s.Run()
}
```

After execution, when accessing `http://127.0.0.1:8199/`, the page output content will be:

```bash
HBm876TFCde435Tgf
```
