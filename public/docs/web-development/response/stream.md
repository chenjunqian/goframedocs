# Response - Stream Response

We can easily implement `HTTP` streaming data responses.

## For Framework Versions < v2.4

If you are using a framework version earlier than `v2.4` (not including beta versions), use the following method to return data (native syntax of the standard library).

```go
package main

import (
    "fmt"
    "net/http"
    "time"

    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/net/ghttp"
)

func main() {
    s := g.Server()
    s.BindHandler("/", func(r *ghttp.Request) {
        rw := r.Response.RawWriter()
        flusher, ok := rw.(http.Flusher)
        if !ok {
            http.Error(rw, "Streaming unsupported!", http.StatusInternalServerError)
            return
        }
        r.Response.Header().Set("Content-Type", "text/event-stream")
        r.Response.Header().Set("Cache-Control", "no-cache")
        r.Response.Header().Set("Connection", "keep-alive")

        for i := 0; i < 100; i++ {
            _, err := fmt.Fprintf(rw, "data: %d\n", i)
            if err != nil {
                panic(err)
            }
            flusher.Flush()
            time.Sleep(time.Millisecond * 200)
        }
    })
    s.SetPort(8999)
    s.Run()
}
```

## For Framework Versions >= v2.4

Since the above operation is a bit cumbersome, some improvements have been made in later versions. If you are using a framework version of `v2.4` or above (not including `beta` versions), you can use the following method to quickly implement streaming data responses.

```go
package main

import (
    "time"

    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/net/ghttp"
)

func main() {
    s := g.Server()
    s.BindHandler("/", func(r *ghttp.Request) {
        r.Response.Header().Set("Content-Type", "text/event-stream")
        r.Response.Header().Set("Cache-Control", "no-cache")
        r.Response.Header().Set("Connection", "keep-alive")

        for i := 0; i < 100; i++ {
            r.Response.Writefln("data: %d", i)
            r.Response.Flush()
            time.Sleep(time.Millisecond * 200)
        }
    })
    s.SetPort(8999)
    s.Run()
}
```

## Example Result

After execution, visiting `http://127.0.0.1:8999/` will show data being continuously returned to the caller in a streaming manner.

## Notes

- If using in a controller, the `Request` object can be obtained through the `g.RequestFromCtx(ctx)` method.
- If there is a unified input/output processing middleware, please place this method outside the middleware scope, or use the `r.ExitAll()` method to exit middleware control.
