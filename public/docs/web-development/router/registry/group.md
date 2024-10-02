# Routing Registration - Group Routing

Group routing is the primary method used for route registration in business projects.

## Group Routing

The `GoFrame` framework supports the registration of group routing, allowing a `prefix` to be specified for group routing (you can directly give the `/` `prefix`, indicating registration under the root route). All route registrations under this group will be registered under this route `prefix`. ***The group routing registration method is also the recommended way to register routes***.

**Interface Documentation:** [ghttp#RouterGroup](https://pkg.go.dev/github.com/gogf/gf/v2/net/ghttp#RouterGroup)

```go
// Create group routing
func (s *Server) Group(prefix string, groups ...func(g *RouterGroup)) *RouterGroup

// Register Method routes
func (g *RouterGroup) ALL(pattern string, object interface{}, params...interface{})
func (g *RouterGroup) GET(pattern string, object interface{}, params...interface{})
func (g *RouterGroup) PUT(pattern string, object interface{}, params...interface{})
func (g *RouterGroup) POST(pattern string, object interface{}, params...interface{})
func (g *RouterGroup) DELETE(pattern string, object interface{}, params...interface{})

func (g *RouterGroup) Middleware(handlers ...HandlerFunc) *RouterGroup

func (g *RouterGroup) Map(m map[string]interface{})
func (g *RouterGroup) ALLMap(m map[string]interface{}) 
```

***Brief Introduction***

1. The `Group` method is used to create a group routing object and supports creating on a specified domain object.
2. The Methods named with HTTP Method are used to bind specified HTTP Method routes; the `ALL` method is used to register all HTTP Methods to a specified function/object/controller; the `REST` method is used to register `RESTful` style routes, requiring an execution object or controller object.
3. The `Middleware` method is used to bind one or more middlewares to the current group's routes, see the middleware section for details.

## Simple Example

```go
package main

import (
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/net/ghttp"
)

func main() {
    s := g.Server()
    s.Group("/api", func(group *ghttp.RouterGroup) {
        group.ALL("/all", func(r *ghttp.Request) {
            r.Response.Write("all")
        })
        group.GET("/get", func(r *ghttp.Request) {
            r.Response.Write("get")
        })
        group.POST("/post", func(r *ghttp.Request) {
            r.Response.Write("post")
        })
    })
    s.SetPort(8199)
    s.Run()
}
```

After execution, the terminal prints the route table as follows:

```bash
SERVER  | DOMAIN  | ADDRESS | METHOD |   ROUTE   |     HANDLER     | MIDDLEWARE
|---------|---------|---------|--------|-----------|-----------------|------------|
  default | default | :8199   | ALL    | /api/all  | main.main.func1 |
|---------|---------|---------|--------|-----------|-----------------|------------|
  default | default | :8199   | GET    | /api/get  | main.main.func2 |
|---------|---------|---------|--------|-----------|-----------------|------------|
  default | default | :8199   | POST   | /api/post | main.main.func3 |
|---------|---------|---------|--------|-----------|-----------------|------------|
```

Here, `/api/get` only allows access via GET method, `/api/post` only allows access via POST method, and `/api/all` allows all methods of access.

Let's test with the curl tool:

***/api/get***

```shell

$ curl http://127.0.0.1:8199/api/get  
get 
$ curl -X POST http://127.0.0.1:8199/api/get  
Not Found 
```

***/api/post***

```bash
$ curl http://127.0.0.1:8199/api/post  
Not Found 
$ curl -X POST http://127.0.0.1:8199/api/post  post
```

***/api/all***

```bash
$ curl http://127.0.0.1:8199/api/all  
all 
$ curl -X POST http://127.0.0.1:8199/api/all  
all 
$ curl -X DELETE http://127.0.0.1:8199/api/all  
all 
$ curl -X OPTIONS http://127.0.0.1:8199/api/all  
all
```

## Hierarchical Registration

> The hierarchical route registration method of the `GoFrame` framework is inspired by the `PHP Laravel` framework. (wink)

The hierarchical route registration method is recommended for its clearer and more intuitive registration of routes. The group route registration of the `GoFrame` framework supports a more intuitive and elegant hierarchical registration method, making it easier for developers to manage the route list. The hierarchical route registration method is also the recommended way to register routes. Let's look at a comprehensive example that uses middleware, `HOOK`, and different `HTTP Method` bindings for route registration:

```go
package main

import (
    "fmt"
    "net/http"

    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/net/ghttp"
)

func MiddlewareAuth(r *ghttp.Request) {
    if r.Get("token").String() != "123456" {
        r.Response.WriteStatus(http.StatusForbidden)
        return
    }
    r.Middleware.Next()
}

func MiddlewareCORS(r *ghttp.Request) {
    r.Response.CORSDefault()
    r.Middleware.Next()
}

func MiddlewareLog(r *ghttp.Request) {
    r.Middleware.Next()
    fmt.Println(r.Response.Status, r.URL.Path)
}

func main() {
    s := g.Server()
    s.Use(MiddlewareLog)
    s.Group("/api.v2", func(group *ghttp.RouterGroup) {
        group.Middleware(MiddlewareAuth, MiddlewareCORS)
        group.GET("/test", func(r *ghttp.Request) {
            r.Response.Write("test")
        })
        group.Group("/order", func(group *ghttp.RouterGroup) {
            group.GET("/list", func(r *ghttp.Request) {
                r.Response.Write("list")
            })
            group.PUT("/update", func(r *ghttp.Request) {
                r.Response.Write("update")
            })
        })
        group.Group("/user", func(group *ghttp.RouterGroup) {
            group.GET("/info", func(r *ghttp.Request) {
                r.Response.Write("info")
            })
            group.POST("/edit", func(r *ghttp.Request) {
                r.Response.Write("edit")
            })
            group.DELETE("/drop", func(r *ghttp.Request) {
                r.Response.Write("drop")
            })
        })
        group.Group("/hook", func(group *ghttp.RouterGroup) {
            group.Hook("/*", ghttp.HookBeforeServe, func(r *ghttp.Request) {
                r.Response.Write("hook any")
            })
            group.Hook("/:name", ghttp.HookBeforeServe, func(r *ghttp.Request) {
                r.Response.Write("hook name")
            })
        })
    })
    s.SetPort(8199)
    s.Run()
}
```

After execution, the registered route list is as follows:

```plaintext
  SERVER  | DOMAIN  | ADDRESS | METHOD |        ROUTE         |       HANDLER       |               MIDDLEWARE
|---------|---------|---------|--------|----------------------|---------------------|-----------------------------------------|
  default | default | :8199   | ALL    | /*                   | main.MiddlewareLog  | GLOBAL MIDDLEWARE
|---------|---------|---------|--------|----------------------|---------------------|-----------------------------------------|
  default | default | :8199   | ALL    | /api.v2/hook/*       | main.main.func1.4.1 | HOOK_BEFORE_SERVE
|---------|---------|---------|--------|----------------------|---------------------|-----------------------------------------|
  default | default | :8199   | ALL    | /api.v2/hook/:name   | main.main.func1.4.2 | HOOK_BEFORE_SERVE
|---------|---------|---------|--------|----------------------|---------------------|-----------------------------------------|
  default | default | :8199   | GET    | /api.v2/order/list   | main.main.func1.2.1 | main.MiddlewareAuth,main.MiddlewareCORS
|---------|---------|---------|--------|----------------------|---------------------|-----------------------------------------|
  default | default | :8199   | PUT    | /api.v2/order/update | main.main.func1.2.2 | main.MiddlewareAuth,main.MiddlewareCORS
|---------|---------|---------|--------|----------------------|---------------------|-----------------------------------------|
  default | default | :8199   | GET    | /api.v2/test         | main.main.func1.1   | main.MiddlewareAuth,main.MiddlewareCORS
|---------|---------|---------|--------|----------------------|---------------------|-----------------------------------------|
  default | default | :8199   | DELETE | /api.v2/user/drop    | main.main.func1.3.3 | main.MiddlewareAuth,main.MiddlewareCORS
|---------|---------|---------|--------|----------------------|---------------------|-----------------------------------------|
  default | default | :8199   | POST   | /api.v2/user/edit    | main.main.func1.3.2 | main.MiddlewareAuth,main.MiddlewareCORS
|---------|---------|---------|--------|----------------------|---------------------|-----------------------------------------|
  default | default | :8199   | GET    | /api.v2/user/info    | main.main.func1.3.1 | main.MiddlewareAuth,main.MiddlewareCORS
|---------|---------|---------|--------|----------------------|---------------------|-----------------------------------------|
```

## Batch Registration

### Map

The `Map` method can be used to achieve batch registration of group routing, but if it's the same URI with different HTTP Methods, you need to specify the HTTP Method according to the route specification. Usage example:

```go
package main

import (
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/net/ghttp"
)

func UserGet(r *ghttp.Request) {
    r.Response.Write("get")
}

func UserDelete(r *ghttp.Request) {
    r.Response.Write("delete")
}

func main() {
    s := g.Server()
    s.Group("/api", func(group *ghttp.RouterGroup) {
        group.Map(g.Map{
            "GET:    /user": UserGet,
            "DELETE: /user": UserDelete,
        })
    })
    s.SetPort(8199)
    s.Run()
}
```

### AllMap

You can also use the `ALLMap` method to achieve batch registration of group routing. Routes registered through this method will apply the route function/object to all HTTP Methods. Usage example:

```go
s := g.Server()
// Front-end system route registration
s.Group("/", func(group *ghttp.RouterGroup) {
    group.Middleware(service.Middleware.Ctx)
    group.ALLMap(g.Map{
        "/":            api.Index,          // Home page
        "/login":       api.Login,          // Login
        "/register":    api.Register,       // Register
        "/category":    api.Category,       // Category
        "/topic":       api.Topic,          // Topic
        "/topic/:id":   api.Topic.Detail,   // Topic - Details
        "/ask":         api.Ask,            // Q&A
        "/ask/:id":     api.Ask.Detail,     // Q&A - Details
        "/article":     api.Article,        // Article
        "/article/:id": api.Article.Detail, // Article - Details
        "/reply":       api.Reply,          // Reply
        "/search":      api.Search,         // Search
        "/captcha":     api.Captcha,        // Captcha
        "/user/:id":    api.User.Index,     // User - Home
    })
    // Permission control routes
    group.Group("/", func(group *ghttp.RouterGroup) {
        group.Middleware(service.Middleware.Auth)
        group.ALLMap(g.Map{
            "/user":     api.User,     // User
            "/content":  api.Content,  // Content
            "/interact": api.Interact, // Interaction
            "/file":     api.File,     // File
        })
    })
})
```
