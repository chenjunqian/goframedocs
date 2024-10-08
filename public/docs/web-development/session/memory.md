# Session-Memory

## Memory Storage

Memory storage is relatively simple and offers high performance, but it does not persist `Session` data. Therefore, `Session` data will be lost after the application restarts. It can be used in specific business scenarios where persistence is not required. The memory storage in `gsession` is implemented using the `StorageMemory` object.

## Example Usage

```go
package main

import (
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/net/ghttp"
    "github.com/gogf/gf/v2/os/gsession"
    "github.com/gogf/gf/v2/os/gtime"
    "time"
)

func main() {
    s := g.Server()
    s.SetSessionMaxAge(time.Minute)
    s.SetSessionStorage(gsession.NewStorageMemory())
    s.Group("/", func(group *ghttp.RouterGroup) {
        group.ALL("/set", func(r *ghttp.Request) {
            r.Session.MustSet("time", gtime.Timestamp())
            r.Response.Write("ok")
        })
        group.ALL("/get", func(r *ghttp.Request) {
            r.Response.Write(r.Session.Data())
        })
        group.ALL("/del", func(r *ghttp.Request) {
            _ = r.Session.RemoveAll()
            r.Response.Write("ok")
        })
    })
    s.SetPort(8199)
    s.Run()
}
```

In this example, to easily observe the expiration, the `Session` expiration time is set to 1 minute. After execution:

1. Visit `http://127.0.0.1:8199/set` to set a `Session` variable.
2. Then, visit `http://127.0.0.1:8199/get` to see that the `Session` variable has been set and successfully retrieved.
3. Stop the program, restart it, and visit `http://127.0.0.1:8199/get` again to see that the `Session` variable is no longer available.
