# HTTPClient - Custom Cookie

When the HTTP client initiates a request, it can customize the `Cookie` content sent to the server, which is achieved through the `SetCookie*` related methods.

## Method List

```go
func (c *Client) SetCookie(key, value string) *Client
func (c *Client) SetCookieMap(m map[string]string) *Client
```

Let's look at an example of a client customizing `Cookies`.

## Server Side

```go
package main

import (
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/net/ghttp"
)

func main() {
    s := g.Server()
    s.BindHandler("/", func(r *ghttp.Request){
        r.Response.Write(r.Cookie.Map())
    })
    s.SetPort(8199)
    s.Run()
}
```

Since this is an example, the server logic is very simple, directly returning all received `Cookie` parameters to the client.

## Client Side

***Using the `SetCookie` method:***

```go
package main

import (
    "fmt"

    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/os/gctx"
)

func main() {
    c := g.Client()
    c.SetCookie("name", "john")
    c.SetCookie("score", "100")
    if r, e := c.Get(gctx.New(), "http://127.0.0.1:8199/");  e != nil {
        panic(e)
    } else {
        fmt.Println(r.ReadAllString())
    }
}
```

By creating a custom HTTP request client object through `g.Client()`, and setting custom `Cookies` through the `c.SetCookie` method, we set two example `Cookie` parameters, `name` and `score`.

***Using the `SetCookieMap` method:***

This method is even simpler, allowing you to set `Cookie` key-value pairs in batch.

```go
package main

import (
    "fmt"
    
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/os/gctx"
)

func main() {
    c := g.Client()
    c.SetCookieMap(g.MapStrStr{
        "name":  "john",
        "score": "100",
    })
    if r, e := c.Get(gctx.New(), "http://127.0.0.1:8199/");  e != nil {
        panic(e)
    } else {
        fmt.Println(r.ReadAllString())
    }
}
```

## Execution Result

After executing the client code, the terminal will print the return result from the server, as follows:

```bash
map[name:john score:100]
```

It can be seen that the server has received the custom Cookie parameters from the client.
