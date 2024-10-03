# Router Interceptor - Usage Examples

## Allowing Cross-Origin Requests

The first example is a common functional requirement.

We need to add response `Header` information that allows cross-origin requests before all API requests. This feature can be implemented through middleware:

```go
package main

import (
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/net/ghttp"
)

func MiddlewareCORS(r *ghttp.Request) {
 r.Response.CORSDefault()
 r.Middleware.Next()
}

func main() {
    s := g.Server()
    s.Group("/api.v2", func(group *ghttp.RouterGroup) {
        group.Middleware(MiddlewareCORS)
        group.ALL("/user/list", func(r *ghttp.Request) {
            r.Response.Writeln("list")
        })
    })
    s.SetPort(8199)
    s.Run()
}
```

After execution, the terminal prints the routing table information as follows:

```bash
SERVER  | DOMAIN  | ADDRESS | METHOD |       ROUTE       |      HANDLER      |     MIDDLEWARE
|---------|---------|---------|--------|-------------------|-------------------|---------------------|
  default | default | :8199   | ALL    | /api.v2/user/list | main.main.func1.1 | main.MiddlewareCORS
|---------|---------|---------|--------|-------------------|-------------------|---------------------|
```

Here we use `group.Middleware(MiddlewareCORS)` to register the cross-origin middleware through group routing to all service functions under the `/api.v2` route. Subsequently, we can check if the cross-origin request `Header` information is returned by requesting `http://127.0.0.1:8199/api.v2/user/list`.

## Request Authentication Handling

We add an authentication middleware on the basis of the cross-origin request middleware.

To simplify the example, in this example, when the request contains a `token` parameter with a value of `123456`, it can pass the authentication, allow cross-origin requests, and execute the request method; otherwise, return the `403 Forbidden` status code.

```go
package main

import (
    "net/http"

    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/net/ghttp"
)

func MiddlewareAuth(r *ghttp.Request) {
    token := r.Get("token")
    if token.String() == "123456" {
        r.Response.Writeln("auth")
        r.Middleware.Next()
    } else {
        r.Response.WriteStatus(http.StatusForbidden)
    }
}

func MiddlewareCORS(r *ghttp.Request) {
    r.Response.Writeln("cors")
    r.Response.CORSDefault()
    r.Middleware.Next()
}

func main() {
    s := g.Server()
    s.Group("/api.v2", func(group *ghttp.RouterGroup) {
        group.Middleware(MiddlewareCORS, MiddlewareAuth)
        group.ALL("/user/list", func(r *ghttp.Request) {
            r.Response.Writeln("list")
        })
    })
    s.SetPort(8199)
    s.Run()
}
```

After execution, the terminal prints the routing table information as follows:

```bash
SERVER  | DOMAIN  | ADDRESS | METHOD |       ROUTE       |      HANDLER      |               MIDDLEWARE
|---------|---------|---------|--------|-------------------|-------------------|-----------------------------------------|
  default | default | :8199   | ALL    | /api.v2/user/list | main.main.func1.1 | main.MiddlewareCORS,main.MiddlewareAuth
|---------|---------|---------|--------|-------------------|-------------------|-----------------------------------------|
```

It can be seen that our service method is bound to two middlewares, the `cross-origin` middleware and the authentication middleware. The request will be executed in the order of middleware registration, first executing the `MiddlewareCORS` global middleware, and then executing the `MiddlewareAuth` group middleware. Subsequently, we can compare the effects by requesting `http://127.0.0.1:8199/api.v2/user/list` and `http://127.0.0.1:8199/api.v2/user/list?token=123456`.

## Authentication Exception Handling

Using group routing middleware can easily add authentication exceptions because only the service methods registered under the current group routing will be bound and execute the authentication middleware, otherwise, the authentication middleware will not be executed.

```go
package main

import (
    "net/http"

    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/net/ghttp"
)

func MiddlewareAuth(r *ghttp.Request) {
    token := r.Get("token")
    if token.String() == "123456" {
        r.Middleware Next()
    } else {
        r.Response.WriteStatus(http.StatusForbidden)
    }
}

func main() {
    s := g.Server()
    s.Group("/admin", func(group *ghttp.RouterGroup) {
        group.ALL("/login", func(r *ghttp.Request) {
            r.Response.Writeln("login")
        })
        group.Group("/", func(group *ghttp.RouterGroup) {
            group.Middleware(MiddlewareAuth)
            group.ALL("/dashboard", func(r *ghttp.Request) {
                r.Response.Writeln("dashboard")
            })
        })
    })
    s.SetPort(8199)
    s.Run()
}
```

After execution, the terminal prints the routing table information as follows:

```bash
SERVER  | ADDRESS | DOMAIN  | METHOD | P |      ROUTE       |       HANDLER       |     MIDDLEWARE
|---------|---------|---------|--------|---|------------------|---------------------|---------------------|
  default |  :8199  | default |  ALL   | 2 | /admin/dashboard | main.main.func1.2.1 | main.MiddlewareAuth
|---------|---------|---------|--------|---|------------------|---------------------|---------------------|
  default |  :8199  | default |  ALL   | 2 | /admin/login     | main.main.func1.1   |
|---------|---------|---------|--------|---|------------------|---------------------|---------------------|
```

It can be seen that only the service method of the `/admin/dashboard` route is bound to the authentication middleware `main.MiddlewareAuth`, while the service method of the `/admin/login` route does not have authentication processing. Subsequently, we can visit the following URLs to see the effects:

- `http://127.0.0.1:8199/admin/login`
- `http://127.0.0.1:8199/admin/dashboard`
- `http://127.0.0.1:8199/admin/dashboard?token=123456`

## Unified Error Handling

Based on middleware, we can do some post-processing work after the service function is executed, especially for unified data format return, result processing, error judgment, etc. This requirement can be achieved using a post-processing middleware type. We use a simple example to demonstrate how to use middleware for post-processing judgment of all interface requests, serving as an example.

```go
package main

import (
    "net/http"

    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/net/ghttp"
)

func MiddlewareAuth(r *ghttp.Request) {
    token := r.Get("token")
    if token.String() == "123456" {
        r.Middleware Next()
    } else {
        r.Response.WriteStatus(http.StatusForbidden)
    }
}

func MiddlewareCORS(r *ghttp.Request) {
    r.Response.CORSDefault()
    r.Middleware Next()
}

func MiddlewareErrorHandler(r *ghttp.Request) {
    r.Middleware Next()
    if r.Response.Status >= http.StatusInternalServerError {
        r.Response.ClearBuffer()
        r.Response.Writeln("Oops, the server seems to have taken a nap. Please try again later!")
    }
}

func main() {
    s := g.Server()
    s.Use(MiddlewareCORS)
        s.Group("/api.v2", func(group *ghttp.RouterGroup) {
        group.Middleware(MiddlewareAuth, MiddlewareErrorHandler)
        group.ALL("/user/list", func(r *ghttp.Request) {
            panic("db error: sql is xxxxxxx")
        })
    })
    s.SetPort(8199)
    s.Run()
}
```

After execution, the terminal prints the routing table information as follows:

```bash
SERVER  | DOMAIN  | ADDRESS | METHOD |       ROUTE       |       HANDLER       |                   MIDDLEWARE
|---------|---------|---------|--------|-------------------|---------------------|-------------------------------------------------|
  default | default | :8199   | ALL    | /*                | main.MiddlewareCORS | GLOBAL MIDDLEWARE
|---------|---------|---------|--------|-------------------|---------------------|-------------------------------------------------|
  default | default | :8199   | ALL    | /api.v2/user/list | main.main.func1.1   | main.MiddlewareAuth,main.MiddlewareErrorHandler
|---------|---------|---------|--------|-------------------|---------------------|-------------------------------------------------|
```

In this example, we judge whether there are system errors in the post-processing middleware. If there are, we return a fixed prompt message instead of displaying sensitive error information to users. Of course, in real project scenarios, it is often necessary to parse the data in the return buffer, such as `JSON` data, and encapsulate and return a fixed data format based on the current execution results.

After executing this example, visit `http://127.0.0.1:8199/api.v2/user/list?token=123456` to see the effect.

## Custom Log Handling

Let's further improve the above example by outputting the request log, including the status code, to the terminal. Here we must use a "global middleware" because it can intercept and handle all service requests, even `404` requests.

```go
package main

import (
    "net/http"

    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/net/ghttp"
)

func MiddlewareAuth(r *ghttp.Request) {
    token := r.Get("token")
    if token.String() == "123456" {
        r.Middleware Next()
    } else {
        r.Response.WriteStatus(http.StatusForbidden)
    }
}

func MiddlewareCORS(r *ghttp.Request) {
    r.Response.CORSDefault()
    r.Middleware Next()
}

func MiddlewareLog(r *ghttp.Request) {
    r.Middleware Next()
    errStr := ""
    if err := r.GetError(); err != nil {
        errStr = err.Error()
    }
    g.Log().Println(r.Response.Status, r.URL.Path, errStr)
}

func main() {
    s := g.Server()
    s.SetConfigWithMap(g.Map{
        "AccessLogEnabled": false,
        "ErrorLogEnabled":  false,
    })
    s.Use(MiddlewareLog, MiddlewareCORS)
    s.Group("/api.v2", func(group *ghttp.RouterGroup) {
        group.Middleware(MiddlewareAuth)
        group.ALL("/user/list", func(r *ghttp.Request) {
            panic("Oops! I made a mistake!")
        })
    })
    s.SetPort(8199)
    s.Run()
}
```

After execution, we can compare the effects by requesting `http://127.0.0.1:8199/api.v2/user/list` and `http://127.0.0.1:8199/api.v2/user/list?token=123456`, and check the log output in the terminal.
