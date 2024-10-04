# Request Input - Custom Parameters

Developers can set custom variables in requests. The retrieval priority of custom variables is the highest and can override the original client-submitted parameters.

> Custom variables can often be used for variable sharing in the request process, but it should be noted that these variables become part of the request parameters and are public to the business execution process.

## Method List

```go
func (r *Request) SetParam(key string, value interface{})
func (r *Request) GetParam(key string, def ...interface{}) interface{}
func (r *Request) GetParamVar(key string, def ...interface{}) *gvar.Var
```

Custom variables can be set using the `SetParam` method. Custom variables can be retrieved through request parameter retrieval methods, such as `Get/GetVar/GetMap`, etc., or through specific custom variable methods like `GetParam/GetParamVar`.

## Usage Example

```go
package main

import (
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/net/ghttp"
)

// MiddlewareBefore1 is a前置中间件1
func MiddlewareBefore1(r *ghttp.Request) {
    r.SetParam("name", "GoFrame")
    r.Response.Writeln("set name")
    r.Middleware.Next()
}

// MiddlewareBefore2 is a前置中间件2
func MiddlewareBefore2(r *ghttp.Request) {
    r.SetParam("site", "https://goframe.org")
    r.Response.Writeln("set site")
    r.Middleware.Next()
}

func main() {
    s := g.Server()
    s.Group("/", func(group *ghttp.RouterGroup) {
        group.Middleware(MiddlewareBefore1, MiddlewareBefore2)
        group.ALL("/", func(r *ghttp.Request) {
            r.Response.Writefln(
                "%s: %s",
                r.GetParam("name").String(),
                r.GetParam("site").String(),
            )
        })
    })
    s.SetPort(8199)
    s.Run()
}
```

It can be seen that we can set and get custom variables through `SetParam` and `GetParam`. The lifecycle of these variables is limited to the current request process.

After execution, when accessing `http://127.0.0.1:8199/`, the page output content will be:

```bash
set name
set site
GoFrame: https://goframe.org
```

This demonstrates the setting and retrieval of custom variables using `SetParam` and `GetParam`, where the variable lifecycle is confined to the current request process only.
