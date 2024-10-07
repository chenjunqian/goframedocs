# Response - Buffer Control

The `Response` output utilizes buffer control, where the output content is first written to a buffer, and only after the service method has been executed is it truly output to the client. This feature not only improves execution efficiency but also provides greater flexibility for controlling the output content.

## Related Methods

```go
func (r *Response) Buffer() []byte
func (r *Response) BufferLength() int
func (r *Response) BufferString() string
func (r *Response) Flush()
func (r *Response) SetBuffer(data []byte)
```

The `Output` function works similarly to `Flush`, outputting the buffer's data to the client and clearing the buffer.

## Example

We can use an after middleware to uniformly process the returned data. If a service method generates an exception, sensitive error information should not be pushed to the client, and a unified error message should be set instead.

```go
package main

import (
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/net/ghttp"
    "net/http"
)

func MiddlewareErrorHandler(r *ghttp.Request) {
    r.Middleware.Next()
    if r.Response.Status >= http.StatusInternalServerError {
        r.Response.ClearBuffer()
        r.Response.Writeln("The server is taking a nap, please try again later!")
    }
}

func main() {
    s := g.Server()
    s.Group("/api.v2", func(group *ghttp.RouterGroup) {
        group.Middleware(MiddlewareErrorHandler)
        group.ALL("/user/list", func(r *ghttp.Request) {
            panic("db error: sql is xxxxxxx")
        })
    })
    s.SetPort(8199)
    s.Run()
}
```

Accessing `http://127.0.0.1:8199/api.v2/user/list` will show the following page output:

```bash
The server is taking a nap, please try again later!
```
