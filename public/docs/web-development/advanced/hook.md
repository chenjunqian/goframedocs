# HOOK Event Callback

The `ghttp.Server` provides event callback registration functionality, similar to `middleware` functionality in other frameworks. Compared to `middleware`, event callbacks are simpler.

`ghttp.Server` supports custom listening and handling for specific events, registered with a `pattern` (consistent with route registration). I***t supports multiple methods for listening to the same event***, and `ghttp.Server` will call the callback methods according to `route priority` and `registration order`. For the same event, the `HOOK` callback function registered first has higher priority. The related methods are as follows:

```go
func (s *Server) BindHookHandler(pattern string, hook string, handler HandlerFunc) error
func (s *Server) BindHookHandlerByMap(pattern string, hookmap map[string]HandlerFunc) error
```

Of course, the domain object also supports event callback registration:

```go
func (d *Domain) BindHookHandler(pattern string, hook string, handler HandlerFunc) error
func (d *Domain) BindHookHandlerByMap(pattern string, hookmap map[string]HandlerFunc) error
```

List of supported `Hook` events:

- `ghttp.HookBeforeServe`

  This event is most commonly used before entering or initializing the service object, especially for handling permissions and cross-domain requests.

- `ghttp.HookAfterServe`

  After the service execution process is completed.

- `ghttp.HookBeforeOutput`

  Before outputting the return content to the client.

- `ghttp.HookAfterOutput`

  After outputting the return content to the client.

## Callback Priority

Since the event binding also uses route rules, its priority is the same as the priority introduced in the [Route - Route Rules](/docs/web-development/router/rule) section.

However, the mechanism for event invocation is different from route registration. ***Multiple event callback methods can be bound under the same route rule***, and the event invocation under that route will be called ***according to priority***. If the priorities are equal, the events will be called in the order of registration.

### Global Callbacks

We often use `HOOK` routes like `/*` to implement global callback processing, which is acceptable. However, the `HOOK` execution priority is the lowest. The more precise the route registration, the higher the priority, and the more vague the route, the lower the priority. `/*` is the vaguest route.

To reduce the coupling of different modules, all routes are often not registered in the same place. For example, the `HOOK` registered by the user module `(/user/*)` will be called first, followed by the global `HOOK`. If the priority is controlled solely by the registration order, it would be difficult to manage when there are many routes and modules.

### Business Function Call Order

It is recommended to process multiple processing functions of the same business (in the same business module) within the same `HOOK` callback function, managing the call order of business processing functions within the registered callback function (function call order: A-B-C).

Although the same requirement can be achieved by registering multiple callback functions for the same `HOOK`, there is no problem functionally, but from a design perspective, the cohesion is reduced, which is not conducive to business function management.

## ExitHook Method

When multiple `HOOK` methods are matched for a route, they are executed in the order of route matching priority. When the `Request.ExitHook` method is called within a HOOK method, subsequent `HOOK` methods will not be executed, similar to `HOOK` method overriding.

## Interface Authentication Control

Event callback registration is commonly used for authentication control/permission control of called interfaces. This operation requires binding to `ghttp.HookBeforeServe`. In this event, all matched interface requests (e.g., binding `/*` event callback route) are callback processed before service execution. If authentication fails, the `r.ExitAll()` method should be called to exit subsequent service execution (including subsequent event callbacks).

In addition, executing `r.Redirect*` methods in the permission verification event callback function without calling `r.ExitAll()` to exit business execution often results in an error of `http multiple response writeheader calls`. This is because `r.Redirect*` methods write the Location header into the returned header, and subsequent business service interfaces often write `Content-Type/Content-Length` headers, causing conflicts.

## Middleware and Event Callbacks

Middleware (`Middleware`) and Event Callbacks (`HOOK`) are two major process control features of the GF framework. Both can be used to control the request process and support binding to specific route rules. However, the differences between the two are also very clear.

- Firstly, middleware focuses on application-level process control, while event callbacks focus on service-level process control; that is, the scope of middleware is limited to the application, while the "authority" of event callbacks is more powerful, belonging to the `Server` level, and can handle static file request callbacks.

- Secondly, middleware is designed using the "onion" design model; event callbacks use specific event hook trigger design.

- Lastly, middleware is relatively more flexible and is the recommended process control method; event callbacks are simpler but less flexible.

### Request.URL and Request.Router

`Request.Router` is the matched route object, containing route registration information, which developers generally will not use. `Request.URL` is the underlying request URL object (inherited from the standard library `http.Request`), containing the request URL information, especially `Request.URL.Path`, which represents the requested URI address.

Therefore, if used in service callback functions, `Request.Router` will have a value because only matched routes will call service callback methods. However, in event callback functions, this object may be `nil` (indicating no matched service callback function route). Especially when using event callbacks for request interface authentication, `Request.URL` objects should be used to obtain request URL information, not `Request.Router`.

## Static File Events

> If you are only providing API interface services (including front-end static file service proxy such as `nginx`) and are not involved in static file services, you can ignore this section.

It should be noted that event callbacks can also match static file access that meets route rules ([Static File](/docs/web-development/advanced/static-server) features in the `GF` framework are default closed, and we can manually enable them using WebServer related configurations, see [Service Configuration](/docs/web-development/server-config/) section).

For example, if we register a global match event callback route `/*`, then static file accesses like `/static/js/index.js` or `/upload/images/thumb.jpg` will also be matched and entered into the registered event callback function for processing.

We can use the `Request.IsFileRequest()` method in the event callback function to determine whether the request is a static file request. If the business logic does not require static file request event callbacks, they can be ignored directly in the event callback function for selective processing.

## Event Callback Examples

### Example 1: Basic Usage

```go
package main

import (
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/net/ghttp"
    "github.com/gogf/gf/v2/os/glog"
)

func main() {
    p := "/:name/info/{uid}"
    s := g.Server()
    s.BindHookHandlerByMap(p, map[string]ghttp.HandlerFunc{
        ghttp.HookBeforeServe:  func(r *ghttp.Request) { glog.Println(ghttp.HookBeforeServe) },
        ghttp.HookAfterServe:   func(r *ghttp.Request) { glog.Println(ghttp.HookAfterServe) },
        ghttp.HookBeforeOutput: func(r *ghttp.Request) { glog.Println(ghttp.HookBeforeOutput) },
        ghttp.HookAfterOutput:  func(r *ghttp.Request) { glog.Println(ghttp.HookAfterOutput) },
    })
    s.BindHandler(p, func(r *ghttp.Request) {
        r.Response.Write("User:", r.Get("name"), ", uid:", r.Get("uid"))
    })
    s.SetPort(8199)
    s.Run()
}
```

When visiting [http://127.0.0.1:8199/john/info/10000](http://127.0.0.1:8199/john/info/10000), the terminal running the WebServer process will print the corresponding event names according to the event execution process.

### Example 2: Same Event Registration

```go
package main

import (
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/net/ghttp"
)

// HOOK with higher priority
func beforeServeHook1(r *ghttp.Request) {
    r.SetParam("name", "GoFrame")
    r.Response.Writeln("set name")
}

// Subsequent HOOK
func beforeServeHook2(r *ghttp.Request) {
    r.SetParam("site", "https://goframe.org")
    r.Response.Writeln("set site")
}

func main() {
    s := g.Server()
    s.BindHandler("/", func(r *ghttp.Request) {
        r.Response.Writeln(r.Get("name"))
        r.Response.Writeln(r.Get("site"))
    })
    s.BindHookHandler("/", ghttp.HookBeforeServe, beforeServeHook1)
    s.BindHookHandler("/", ghttp.HookBeforeServe, beforeServeHook2)
    s.SetPort(8199)
    s.Run()
}
```

After execution, the terminal output of the route table is as follows:

```bash
SERVER  | ADDRESS | DOMAIN  | METHOD | P | ROUTE |        HANDLER        |    MIDDLEWARE
|---------|---------|---------|--------|---|-------|-----------------------|-------------------|
  default |  :8199  | default | ALL    | 1 | /     | main.main.func1       |
|---------|---------|---------|--------|---|-------|-----------------------|-------------------|
  default |  :8199  | default | ALL    | 2 | /     | main.beforeServeHook1 | HOOK_BEFORE_SERVE
|---------|---------|---------|--------|---|-------|-----------------------|-------------------|
  default |  :8199  | default | ALL    | 1 | /     | main.beforeServeHook2 | HOOK_BEFORE_SERVE
|---------|---------|---------|--------|---|-------|-----------------------|-------------------|
```

Manually visit [http://127.0.0.1:8199/](http://127.0.0.1:8199/), the page output content is:

```bash
set name
set site
GoFrame
https://goframe.org
```

### Example 3: Changing Business Logic

```go
package main

import (
    "fmt"
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/net/ghttp"
)

func main() {
    s := g.Server()
    // Multiple event callbacks example, event 1
    pattern1 := "/:name/info"
    s.BindHookHandlerByMap(pattern1, map[string]ghttp.HandlerFunc{
        ghttp.HookBeforeServe: func(r *ghttp.Request) {
            r.SetParam("uid", 1000)
        },
    })
    s.BindHandler(pattern1, func(r *ghttp.Request) {
        r.Response.Write("User:", r.Get("name"), ", uid:", r.Get("uid"))
    })

    // Multiple event callbacks example, event 2
    pattern2 := "/{object}/list/{page}.java"
    s.BindHookHandlerByMap(pattern2, map[string]ghttp.HandlerFunc{
        ghttp.HookBeforeOutput: func(r *ghttp.Request) {
            r.Response.SetBuffer([]byte(
                fmt.Sprintf("Modified output content through event, object:%s, page:%s", r.Get("object"), r.GetRouterString("page"))),
            )
        },
    })
    s.BindHandler(pattern2, func(r *ghttp.Request) {
        r.Response.Write(r.Router.Uri)
    })
    s.SetPort(8199)
    s.Run()
}
```

Event 1 sets the GET parameters when accessing the `/:name/info` route rule; Event 2 changes the output result when the path matches the route `/{object}/list/{page}.java`. After execution, visit the following URLs to see the effects:

```bash
http://127.0.0.1:8199/user/info 
http://127.0.0.1:8199/user/list/1.java 
http://127.0.0.1:8199/user/list/2.java 
```

### Example 4: Callback Execution Priority

```go
package main

import (
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/net/ghttp"
)

func main() {
    s := g.Server()
    s.BindHandler("/priority/show", func(r *ghttp.Request) {
        r.Response.Writeln("priority service")
    })

    s.BindHookHandlerByMap("/priority/:name", map[string]ghttp.HandlerFunc{
        ghttp.HookBeforeServe: func(r *ghttp.Request) {
            r.Response.Writeln("/priority/:name")
        },
    })
    s.BindHookHandlerByMap("/priority/*any", map[string]ghttp.HandlerFunc{
        ghttp.HookBeforeServe: func(r *ghttp.Request) {
            r.Response.Writeln("/priority/*any")
        },
    })
    s.BindHookHandlerByMap("/priority/show", map[string]ghttp.HandlerFunc{
        ghttp.HookBeforeServe: func(r *ghttp.Request) {
            r.Response.Writeln("/priority/show")
        },
    })
    s.SetPort(8199)
    s.Run()
}
```

In this example, we registered event callbacks for three route rules that can all match the route registration address `/priority/show`, so we can visit this address to see what the route execution order is like.

After execution, we visit [http://127.0.0.1:8199/priority/show](http://127.0.0.1:8199/priority/show), and then we see the following information on the page:

```bash
/priority/show
/priority/:name
/priority/*any
priority service
```

### Example 5: Allowing Cross-Origin Requests

> In the sections [Route - Interceptors](/docs/web-development/router/interceptor/) and [CORS Cross-Domain Handling](/docs/web-development/advanced/cors), there are also examples of cross-domain processing. Most of the time, we use middleware to handle cross-domain requests.

Both `HOOK` and middleware can achieve cross-domain request processing. Here we use `HOOK` to implement simple cross-domain processing. First, let's look at a simple interface example:

```go
package main

import (
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/net/ghttp"
)

func Order(r *ghttp.Request) {
    r.Response.Write("GET")
}

func main() {
    s := g.Server()
    s.Group("/api.v1", func(group *ghttp.RouterGroup) {
        group.GET("/order", Order)
    })
    s.SetPort(8199)
    s.Run()
}
```

The interface address is [http://localhost:8199/api.v1/order](http://localhost:8199/api.v1/order), which, of course, does not allow cross-domain access. We open a different domain, such as the Google homepage (which happens to use `jQuery`, convenient for debugging), then press `F12` to open the developer panel, and in the `console`, execute the following `AJAX` request:

```javascript
$.get("http://localhost:8199/api.v1/order",  function(result){
    console.log(result)
});
```

It returns a cross-domain error. Then we modify the test code as follows:

```go
package main

import (
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/net/ghttp"
)

func Order(r *ghttp.Request) {
    r.Response.Write("GET")
}

func main() {
    s := g.Server()
    s.Group("/api.v1", func(group *ghttp.RouterGroup) {
        group.Hook("/*any", ghttp.HookBeforeServe, func(r *ghttp.Request) {
            r.Response.CORSDefault()
        })
        group.GET("/order", Order)
    })
    s.SetPort(8199)
    s.Run()
}
```

We added an event `ghttp.HookBeforeServe` bound to the route `/api.v1/*any`, which will be called before all services are executed. In the callback method of this event, we use the `CORSDefault` method to allow cross-domain requests with the default cross-domain settings. The event route rule bound used a fuzzy matching rule, indicating that all interface addresses starting with `/api.v1` are allowed to make cross-domain requests.

Return to the Google homepage and execute the `AJAX` request again, and it succeeds this time.
