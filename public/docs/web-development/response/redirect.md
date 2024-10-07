# Response - Redirect

We can achieve page redirection between pages using `RedirectTo`/`RedirectBack`, which is implemented through the `Location` Header. Here are the related methods:

```go
func (r *Response) RedirectBack(code ...int)
func (r *Response) RedirectTo(location string, code ...int)
```

## RedirectTo

`RedirectTo` is used to guide the client to jump to a specified address. The address can be a relative path to a local service or a complete `HTTP` address. Here's an example of its usage:

```go
package main

import (
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/net/ghttp"
)

func main() {
    s := g.Server()
    s.BindHandler("/", func(r *ghttp.Request) {
        r.Response.RedirectTo("/login")
    })
    s.BindHandler("/login", func(r *ghttp.Request) {
        r.Response.Writeln("Login First")
    })
    s.SetPort(8199)
    s.Run()
}
```

After running, if we access `http://127.0.0.1:8199/` through a browser, we will immediately notice that the browser redirects to the `http://127.0.0.1:8199/login` page.

## RedirectBack

`RedirectBack` is used to guide the client to jump back to the previous page address, which is obtained through the `Referer` Header. Generally, browser clients will transmit this Header. Here's an example of its usage:

```go
package main

import (
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/net/ghttp"
)

func main() {
    s := g.Server()
    s.BindHandler("/page", func(r *ghttp.Request) {
        r.Response.Writeln(`<a href="/back">back</a>`)
    })
    s.BindHandler("/back", func(r *ghttp.Request) {
        r.Response.RedirectBack()
    })
    s.SetPort(8199)
    s.Run()
}
```

After running, if we access `http://127.0.0.1:8199/page` through a browser and click the `back` link on the page, we will find that after clicking, the page redirects back.
