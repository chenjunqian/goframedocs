# Cookie

## Basic Introduction

For detailed interface documentation, please refer to: [ghttp.Cookie](https://pkg.go.dev/github.com/gogf/gf/v2/net/ghttp#Cookie)

***Commonly Used Methods***

```go
type Cookie
func GetCookie(r *Request) *Cookie
func (c *Cookie) Contains(key string) bool
func (c *Cookie) Flush()
func (c *Cookie) Get(key string, def ...string) string
func (c *Cookie) GetSessionId() string
func (c *Cookie) Map() map[string]string
func (c *Cookie) Remove(key string)
func (c *Cookie) RemoveCookie(key, domain, path string)
func (c *Cookie) Set(key, value string)
func (c *Cookie) SetCookie(key, value, domain, path string, maxAge time.Duration, httpOnly ...bool)
func (c *Cookie) SetHttpCookie(httpCookie *http.Cookie)
func (c *Cookie) SetSessionId(id string)
```

You can obtain the current request's corresponding Cookie object at any time through the `*ghttp.Request` object. Since `Cookies` and `Sessions` are related to request sessions, they both belong to the `ghttp.Request` object and are exposed externally. There is no need to manually close the `Cookie` object; it will be automatically closed by the HTTP Server at the end of the request process.

Additionally, the `Cookie` encapsulates two methods related to SessionId:

- `Cookie.GetSessionId()` is used to retrieve the SessionId submitted in the current request. Each request's SessionId is unique and accompanies the entire request process, which may be empty.
- `Cookie.SetSessionId(id string)` is used to customize the setting of the SessionId in the `Cookie`, which is returned to the client (usually a browser) for storage. Subsequently, the client can carry this SessionId in the `Cookie` with every request.

When setting `Cookie` variables, you can specify an expiration time, which is an optional parameter. The default `Cookie` expiration time is one year.

The default SessionId is stored in the `Cookie` with the name `gfsession`.

## Example Usage

```go
package main

import (
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/os/gtime"
    "github.com/gogf/gf/v2/net/ghttp"
)

func main() {
    s := g.Server()
    s.BindHandler("/cookie", func(r *ghttp.Request) {
        datetime := r.Cookie.Get("datetime")
        r.Cookie.Set("datetime", gtime.Datetime())
        r.Response.Write("datetime:", datetime)
    })
    s.SetPort(8199)
    s.Run()
}
```

Run the outer `main.go`, and you can try refreshing the page at `http://127.0.0.1:8199/cookie` to see the changing time.

For controller objects, many session-related object pointers are inherited from the base class controller, which can be considered as aliases and can be used directly; they all point to the same object:

```go
type Controller struct {
    Request  *ghttp.Request  // Request data object
    Response *ghttp.Response // Response data object (r.Response)
    Server   *ghttp.Server   // WebServer object (r.Server)
    Cookie   *ghttp.Cookie   // COOKIE operation object (r.Cookie)
    Session  *ghttp.Session  // SESSION operation object
    View     *View           // View object
}
```

Since `Cookies` are already a very familiar component for web developers, and the related `APIs` are very simple, further elaboration is not necessary here.

## Cookie Session Expiration

By setting the `maxAge` parameter to 0, the Cookie will expire at the end of the user's session.

```go
r.Cookie.SetCookie("MyCookieKey", "MyCookieValue", "", "/", 0)
```
