# CSRF Defense Settings

Cross-Site Request Forgery (`CSRF`), also known as ***one-click attack*** or ***session riding***, is an attack method that tricks users into performing unintended operations on the web applications they are currently logged in to. Compared to Cross-Site Scripting (`XSS`), XSS exploits the trust users have in specific websites, while `CSRF` exploits the trust websites have in users' web browsers.

## How to Defend

We choose to verify requests through `token` validation implemented by middleware. The `CSRF` cross-site defense plugin is provided by the community package.

Developers can add `token` validation functionality to interfaces by adding middleware.

Interested parties can read the plugin source code at [https://github.com/gogf/csrf](https://github.com/gogf/csrf).

## Usage

### Import the Plugin Package

```go
import "github.com/gogf/csrf"
```

### Configure Interface Middleware

The `csrf` plugin supports custom `csrf.Config` configuration. In the `Config`, `Cookie.Name` is the name of the token set in the cookie by the middleware in the response, `ExpireTime` is the token expiration time, `TokenLength` is the length of the token, and `TokenRequestKey` is the parameter name that subsequent requests need to carry.

```go
s := g.Server()
s.Group("/api.v2", func(group *ghttp.RouterGroup) {
    group.Middleware(csrf.NewWithCfg(csrf.Config{
        Cookie: &http.Cookie{
            Name: "_csrf", // token name in cookie
        },
        ExpireTime:      time.Hour * 24,
        TokenLength:     32,
        TokenRequestKey: "X-Token", // use this key to read token in request param
    }))
    group.ALL("/csrf", func(r *ghttp.Request) {
        r.Response.Writeln(r.Method + ": " + r.RequestURI)
    })
})
```

### Front-end Integration

After configuration, the front end reads the `_csrf` value (i.e., token) from the `Cookie` before making a POST request, and then includes the `token` in the request with the parameter name set by `TokenRequestKey` (can be `Header` or `Form`) to pass the `token` validation.

## Code Examples

### Using Default Configuration

```go
package main

import (
    "net/http"
    "time"

    "github.com/gogf/csrf"
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/net/ghttp"
)

// default cfg
func main() {
    s := g.Server()
    s.Group("/api.v2", func(group *ghttp.RouterGroup) {
        group.Middleware(csrf.New())
        group.ALL("/csrf", func(r *ghttp.Request) {
            r.Response.Writeln(r.Method + ": " + r.RequestURI)
        })
    })
    s.SetPort(8199)
    s.Run()
}
```

### Using Custom Configuration

```go
package main

import (
    "net/http"
    "time"

    "github.com/gogf/csrf"
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/net/ghttp"
)

// set cfg
func main() {
    s := g.Server()
    s.Group("/api.v2", func(group *ghttp.RouterGroup) {
        group.Middleware(csrf.NewWithCfg(csrf.Config{
            Cookie: &http.Cookie{
                Name: "_csrf", // token name in cookie
                Secure:   true,
                SameSite: http.SameSiteNoneMode, // customize samesite
            },
            ExpireTime:      time.Hour * 24,
            TokenLength:     32,
            TokenRequestKey: "X-Token", // use this key to read token in request param
        }))
        group.ALL("/csrf", func(r *ghttp.Request) {
            r.Response.Writeln(r.Method + ": " + r.RequestURI)
        })
    })
    s.SetPort(8199)
    s.Run()
}
```

## Experiencing the Effect Through Requests

<http://localhost:8199/api.v2/csrf>
