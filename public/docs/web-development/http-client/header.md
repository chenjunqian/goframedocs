# HTTPClient - Custom Header

When the HTTP client initiates a request, it can customize the `Header` content sent to the server, which is achieved through the `SetHeader*` related methods.

## Method List

```go
func (c *Client) SetHeader(key, value string) *Client
func (c *Client) SetHeaderMap(m map[string]string) *Client
func (c *Client) SetHeaderRaw(headers string) *Client
```

Let's look at an example of a client sending custom link tracing information `headers` such as `Span-Id` and `Trace-Id`.

## Server Side

```go
package main

import (
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/net/ghttp"
)

func main() {
    s := g.Server()
    s.BindHandler("/", func(r *ghttp.Request) {
        r.Response.Writef(
            "Span-Id:%s,Trace-Id:%s",
            r.Header.Get("Span-Id"),
            r.Header.Get("Trace-Id"),
        )
    })
    s.SetPort(8199)
    s.Run()
}
```

Since this is an example, the server logic is very simple, directly returning the received `Span-Id` and `Trace-Id` parameters to the client.

## Client Side

Using the `SetHeader` method:

```go
package main

import (
    "fmt"

    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/os/gctx"
)

func main() {
    c := g.Client()
    c.SetHeader("Span-Id", "0.0.1")
    c.SetHeader("Trace-Id", "NBC56410N97LJ016FQA")
    if r, e := c.Get(gctx.New(), "http://127.0.0.1:8199/");  e != nil {
        panic(e)
    } else {
        fmt.Println(r.ReadAllString())
    }
}
```

By creating a custom HTTP request client object through `g.Client()`, and setting custom Header information through `c.SetHeader`.

Using the `SetHeaderRaw` method:

This method is even simpler, allowing you to set client request Headers with raw Header strings.

```go
package main

import (
    "fmt"

    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/os/gctx"
)

func main() {
    c := g.Client()
    c.SetHeaderRaw(`
            Referer: https://localhost
            Span-Id: 0.0.1
            Trace-Id: NBC56410N97LJ016FQA
            User-Agent: MyTestClient
        `)
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
Span-Id:0.0.1,Trace-Id:NBC56410N97LJ016FQA
```
