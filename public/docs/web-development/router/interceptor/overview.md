# Router Interceptor - Overview

`GoFrame` provides an elegant middleware request control mechanism, which is also a mainstream way of request process control provided by `WebServers`. Middleware design can offer a more flexible and powerful plugin mechanism for `WebServers`. The classic middleware onion model:

## Middleware Definition

Middleware is defined like a regular HTTP execution method `HandlerFunc`, but it can use the Middleware attribute object in the `Request` parameter to control the request process.

Let's take a `middleware` definition for CORS (Cross-Origin Resource Sharing) as an example to illustrate:

```go
func MiddlewareCORS(r *ghttp.Request) {
    r.Response.CORSDefault()
    r.Middleware.Next()
}
```

As can be seen in this middleware, after the logic for handling CORS requests is executed, the `r.Middleware.Next()` method is used to further execute the next process. If you exit directly without calling `r.Middleware.Next()` at this point, it will exit the subsequent execution process (which can be used for request authentication processing).

## Types of Middleware

Middleware types are divided into two kinds: `pre middleware` and `post middlewar`e. `Pre middleware` is called before the route service function, and `post middleware` is called after it.

### Pre Middleware

Its definition is similar to:

```go
func Middleware(r *ghttp.Request) {
    // Middleware processing logic
    r.Middleware.Next()
}
```

### Post Middleware

Its definition is similar to:

```go
func Middleware(r *ghttp.Request) {
    r.Middleware.Next()
    // Middleware processing logic
}
```

## Middleware Registration

There are multiple ways to register middlewares, see the interface documentation: [ghttp](https://pkg.go.dev/github.com/gogf/gf/v2/net/ghttp)

***Global Middleware***

```go
func (s *Server) Use(handlers ...HandlerFunc)
```

Global middleware is a request interception method that can be used independently. It is registered through routing rules and bound to the Server. Since `middleware` needs to perform request interception operations, it often uses "fuzzy matching" or "naming matching" rules.

> Global middleware is only effective for dynamic request interception and cannot intercept static file requests.

***Group Route Middleware***

```go
func (g *RouterGroup) Middleware(handlers ...HandlerFunc) *RouterGroup
```

Middleware registered in the group route is bound to all service requests in the current group route. The bound middleware method will be called before the service request is executed. A group route has only one `Middleware` registration method. The difference between group route middleware and global middleware is that group route middleware cannot be used independently; it must be used within the group route registration and is bound to all routes in the current group route as part of the route method.

## Execution Priority

***Global Middleware***

Since global middleware is also executed based on fuzzy route matching, there will be an execution priority:

1. First, because global middleware is based on fuzzy route matching, when the same route matches multiple middlewares, they will be executed according to the route depth-first rule. For details, please refer to the routing section.
2. Secondly, under the same route rule, middleware will be executed in the order they are registered. The middleware registration method also supports registering multiple middlewares in order.
3. Finally, to avoid priority confusion and subsequent management, it is recommended to register all middlewares in one place to control the execution priority by their registration order.
   This recommendation comes from the interceptor design of gRPC, which has no excessive route control and only registers in one place using the same method. Often, the simpler it is, the easier it is to understand and maintain in the long term.

***Group Route Middleware***

Group route middleware is bound to service methods on group routes and does not exist in route rule matching, so it will only be executed in the order of registration. See subsequent examples or the following code execution results.

```go
package main

import (
    "context"
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/net/ghttp"
    "github.com/gogf/gf/v2/os/glog"
)

type HelloReq struct {
    g.Meta `path:"/hello" method:"get"`
}
type HelloRes struct {
}

type Hello struct{}

func (Hello) Say(ctx context.Context, req *HelloReq) (res *HelloRes, err error) {
    glog.Debug(ctx, "Middle")
    return
}

func RequestHandle1(r *ghttp.Request) {
    glog.Debug(r.GetCtx(), "Before 1")
    r.Middleware.Next()
}

func RequestHandle2(r *ghttp.Request) {
    glog.Debug(r.GetCtx(), "Before 2")
    r.Middleware.Next()
}

func RequestHandle3(r *ghttp.Request) {
    glog.Debug(r.GetCtx(), "Before 3")
    r.Middleware.Next()
}

func RequestHandle4(r *ghttp.Request) {
    glog.Debug(r.GetCtx(), "Before 4")
    r.Middleware.Next()
}

func ResponseHandle1(r *ghttp.Request) {
    r.Middleware.Next()
    glog.Debug(r.GetCtx(), "After 1")
}

func ResponseHandle2(r *ghttp.Request) {
    r.Middleware.Next()
    glog.Debug(r.GetCtx(), "After 2")
}

func ResponseHandle3(r *ghttp.Request) {
    r.Middleware.Next()
    glog.Debug(r.GetCtx(), "After 3")
}

func ResponseHandle4(r *ghttp.Request) {
    r.Middleware.Next()
    glog.Debug(r.GetCtx(), "After 4")
}

func main() {
    s := g.Server()
    s.Use(ghttp.MiddlewareHandlerResponse)
    s.Group("/", func(group *ghttp.RouterGroup) {
        // Pre middleware
        group.Middleware(RequestHandle1)
        group.Middleware(RequestHandle2)

        // Post middleware
        group.Middleware(ResponseHandle1)
        group.Middleware(ResponseHandle2)

        group.Group("/sub", func(group *ghttp.RouterGroup) {
            // Pre middleware
            group.Middleware(RequestHandle3)
            group.Middleware(RequestHandle4)

            // Post middleware
            group.Middleware(ResponseHandle3)
            group.Middleware(ResponseHandle4)

            group.Bind(new(Hello))
        })
    })
    s.Run()
}
```

## Execution Interruption

In group route middleware, we can interrupt the current request before the Next() call of the pre middleware by using `return`. After the interruption, all subsequent pre middlewares, peer and sub-level post middlewares, and request processing methods will not be executed.

For example, in the code above used to demonstrate the execution priority of group route middleware:

- Interrupt before the `Next()` call in `RequestHandle1`, only `RequestHandle1` will be executed.
- Interrupt before the `Next()` call in `RequestHandle2`, `RequestHandle1` and `RequestHandle2` will be executed.
- Interrupt before the `Next()` call in `RequestHandle3`, `RequestHandle1`, `RequestHandle2`, `RequestHandle3`, and `ResponseHandle2`, `ResponseHandle1` will be executed.
- Interrupt before the `Next()` call in `RequestHandle4`, `RequestHandle1`, `RequestHandle2`, `RequestHandle3`, `RequestHandle4`, and `ResponseHandle2`, `ResponseHandle1` will be executed.
None of the above interruption examples will execute the request processing method.

In addition to the common method of using `return` to terminate the subsequent processing flow in middleware, the framework also provides `Exit` related methods to forcibly interrupt the execution process at the code execution point. For details, please refer to the section: Data Return - [Exit Control](/docs/web-development/response/exit).
