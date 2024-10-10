# CORS Cross-Domain Handling

Allowing cross-origin access to interfaces often requires combining [Route - Interceptors](/docs/web-development/router/interceptor/) to uniformly set certain routing rules for cross-domain access. At the same time, allowing cross-domain requests for `WebSocket` access is also implemented in this way.

Related methods: [ghttp.Response CORS methods](https://pkg.go.dev/github.com/gogf/gf/v2/net/ghttp#Response)

```go
func (r *Response) CORS(options CORSOptions)
func (r *Response) CORSAllowedOrigin(options CORSOptions) bool
func (r *Response) CORSDefault()
func (r *Response) DefaultCORSOptions() CORSOptions
```

## CORS Object

`CORS` is a standard by the `W3` Internet Standards Organization for HTTP cross-domain requests. In the `ghttp` module, we can manage corresponding cross-domain request options through the `CORSOptions` object. It is defined as follows:

```go
// See https://www.w3.org/TR/cors/.
// Server-side options for allowing cross-origin requests
type CORSOptions struct {
    AllowDomain      []string // Used for allowing requests from custom domains
    AllowOrigin      string   // Access-Control-Allow-Origin
    AllowCredentials string   // Access-Control-Allow-Credentials
    ExposeHeaders    string   // Access-Control-Expose-Headers
    MaxAge           int      // Access-Control-Max-Age
    AllowMethods     string   // Access-Control-Allow-Methods
    AllowHeaders     string   // Access-Control-Allow-Headers
}
```

For detailed descriptions of the specific parameters, please refer to the [W3 organization's official manual](https://www.w3.org/TR/cors/).

## CORS Configuration

### Default CORSOptions

Of course, for convenient cross-domain settings, the `ghttp` module also provides default cross-domain request options, which can be obtained through the `DefaultCORSOptions` method. In most cases, we can directly use `CORSDefault()` to allow cross-domain requests in the interface that needs to allow cross-domain access (generally using middleware).

### Restricting Origin Sources

Most of the time, we need to restrict the request source to our list of trusted domain names. We can use the `AllowDomain` configuration, as shown below:

```go
// Cross-origin request middleware
func Middleware(r *ghttp.Request) {
    corsOptions := r.Response.DefaultCORSOptions()
    corsOptions.AllowDomain = []string{"goframe.org", "johng.cn"}
    r.Response.CORS(corsOptions)
    r.Middleware.Next()
}
```

## OPTIONS Request

Some clients, certain browsers will first send an `OPTIONS` pre-request to detect whether subsequent requests are allowed before sending an `AJAX` request. The `GF` framework's Server fully complies with the `W3C` specification for the `OPTIONS` request method. Therefore, as long as the server-side sets up the `CORS` middleware, `OPTIONS` requests will also be automatically supported.

## Example 1: Basic Usage

Let's look at a simple interface example:

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

The interface address is `http://localhost/api.v1/order`. Of course, this interface does not allow cross-domain access. We open a different domain, such as the Baidu homepage (which happens to use `jQuery`, convenient for debugging), then press F12 to open the developer panel, and execute the following `AJAX` request in the `console`:

```javascript
$.get("http://localhost:8199/api.v1/order", function(result){
    console.log(result)
});
```

It returns a cross-domain request error.

Next, we modify the test code of the server-side interface as follows:

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

func Order(r *ghttp.Request) {
    r.Response.Write("GET")
}

func main() {
    s := g.Server()
    s.Group("/api.v1", func(group *ghttp.RouterGroup) {
        group.Middleware(MiddlewareCORS)
        group.GET("/order", Order)
    })
    s.SetPort(8199)
    s.Run()
}
```

We added a pre-interceptor `MiddlewareCORS` for the route `/api.v1`, which will be called before all services are executed. We use the `CORSDefault` method to use the default cross-domain settings to allow cross-domain requests. The bound event route rule uses a fuzzy matching rule, indicating that all interface addresses starting with `/api.v1` are allowed to make cross-domain requests.

Of course, we can also make more settings for cross-domain requests through the `CORSOptions` object and the `CORS` method.

## Example 2: Authorizing Cross-Origin Origin

In most scenarios, we need to customize the authorization of cross-origin `Origin`. We can improve the above example as follows, in which we only allow `goframe.org` and `google.com` to access cross-domain requests.

```go
package main

import (
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/net/ghttp"
)

func MiddlewareCORS(r *ghttp.Request) {
    corsOptions := r.Response.DefaultCORSOptions()
    corsOptions.AllowDomain = []string{"goframe.org", "google.com"}
    r.Response.CORS(corsOptions)
    r.Middleware.Next()
}

func Order(r *ghttp.Request) {
    r.Response.Write("GET")
}

func main() {
    s := g.Server()
    s.Group("/api.v1", func(group *ghttp.RouterGroup) {
        group.Middleware(MiddlewareCORS)
        group.GET("/order", Order)
    })
    s.SetPort(8199)
    s.Run()
}
```

## Example 3: Custom Authorization Check

Have you noticed a detail in the above examples? Even if the current interface does not allow cross-domain access, as long as the interface is called, the complete logic of the interface will still be executed, and a request process has been completed on the server side. To address this issue, we can customize the authorization `Origin` and use the `CORSAllowedOrigin` method in the middleware to make a judgment. If the current request's `Origin` is allowed to be executed on the server side, then the subsequent process will be executed; otherwise, it will terminate.

In the following example, only cross-domain requests from the `goframe.org` domain are allowed, and requests from other domains will fail and return `403`:

```go
package main

import (
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/net/ghttp"
)

func MiddlewareCORS(r *ghttp.Request) {
    corsOptions := r.Response.DefaultCORSOptions()
    corsOptions.AllowDomain = []string{"goframe.org"}
    if !r.Response.CORSAllowedOrigin(corsOptions) {
        r.Response.WriteStatus(http.StatusForbidden)
        return
    }
    r.Response.CORS(corsOptions)
    r.Middleware.Next()
}

func Order(r *ghttp.Request) {
    r.Response.Write("GET")
}

func main() {
    s := g.Server()
    s.Group("/api.v1", func(group *ghttp.RouterGroup) {
        group.Middleware(MiddlewareCORS)
        group.GET("/order", Order)
    })
    s.SetPort(8199)
    s.Run()
}
```
