# Custom Status Code Handling

We can customize the handling of specific status codes for the WebServer, such as displaying custom error messages, page content, or redirecting to a specific page for common errors like `404/403/500`.

The relevant methods are as follows:

```go
func (s *Server) BindStatusHandler(status int, handler HandlerFunc)
func (s *Server) BindStatusHandlerByMap(handlerMap map[int]HandlerFunc)

func (d *Domain) BindStatusHandler(status int, handler HandlerFunc)
func (d *Domain) BindStatusHandlerByMap(handlerMap map[int]HandlerFunc)
```

It can be seen that we can use `BindStatusHandler` or `BindStatusHandlerMap` to implement custom callback function processing for specified status codes, and this feature also supports binding to specific domain names. Let's look at a few simple examples.

## Basic Usage

```go
package main

import (
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/net/ghttp"
)

func main() {
    s := g.Server()
    s.BindHandler("/", func(r *ghttp.Request){
        r.Response.Writeln("Hello world!")
    })
    s.BindStatusHandler(404, func(r *ghttp.Request){
        r.Response.Writeln("This is a customized 404 page")
    })
    s.SetPort(8199)
    s.Run()
}
```

After execution, when we access a route page that is not bound, such as `http://127.0.0.1:8199/test`, we can see that the page displays the expected return result: `This is a customized 404 page`.

Additionally, a common way to handle web page request errors is to guide users to a specified error page. Therefore, in the status code callback processing function, we can use the `r.RedirectTo` method for page redirection, as shown in the example below:

```go
package main

import (
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/net/ghttp"
)

func main() {
    s := g.Server()
    s.BindHandler("/status/:status", func(r *ghttp.Request) {
        r.Response.Write("woops, status ", r.Get("status"), " found")
    })
    s.BindStatusHandler(404, func(r *ghttp.Request){
        r.Response.RedirectTo("/status/404")
    })
    s.SetPort(8199)
    s.Run()
}
```

After execution, when we manually access a non-existent page through the browser, such as `http://127.0.0.1:8199/test`, we can see that the page is redirected to `http://127.0.0.1:8199/status/404`, and the page returns the content: `woops, status 404 found`.

## Batch Setting

```go
package main

import (
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/net/ghttp"
)

func main() {
    s := g.Server()
    s.BindStatusHandlerByMap(map[int]ghttp.HandlerFunc {
        403 : func(r *ghttp.Request){r.Response.Writeln("403")},
        404 : func(r *ghttp.Request){r.Response.Writeln("404")},
        500 : func(r *ghttp.Request){r.Response.Writeln("500")},
    })
    s.SetPort(8199)
    s.Run()
}
```

It can be seen that we can use the `BindStatusHandlerByMap` method to batch set the status codes that need to be customized. After executing this example program, when the service interface returns a status code of 403/404/500, the interface will return the corresponding status code number.

## Notes

In custom status code handling methods, if content output is involved, it is often necessary to use the `r.Response.ClearBuffer()` method to clear the original buffer's output content.
