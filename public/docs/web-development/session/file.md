# Session-File

## File Storage

By default, the Session storage of `ghttp.Server` uses a combination of memory and file storage, implemented with the `StorageFile` object. The specific principles are as follows:

- `Session` data operations are entirely based on memory.
- The `gcache` process cache module is used to control data expiration.
- File storage is used for the persistent storage management of `Session` data.
- `Session` serialization and file persistent storage are performed only when the `Session` is marked as dirty (when data is updated).
- `Session` data is de-serialized and restored from file storage to memory only when the `Session` does not exist in memory, reducing IO calls.
- Serialization and de-serialization use the standard library's `json.Marshal` and `json.Unmarshal` methods.
- From the principles, it is known that when `Sessions` are used in scenarios with more reads than writes, the data operations are very efficient.

> An important detail to note is that since file storage involves file operations, to reduce `IO` overhead and improve `Session` operation performance, the `TTL` time of each `Session` is not immediately refreshed after every `Session` request. Instead, the `TTL` is immediately refreshed only when an update operation is involved (marked as `dirty`). For read requests, the `TTL` time of the `Session` files corresponding to the read operations in the last minute will be updated every minute, facilitating automatic renewal of `Sessions`.

## Example Usage

```go
package main

import (
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/net/ghttp"
    "github.com/gogf/gf/v2/os/gtime"
    "time"
)

func main() {
    s := g.Server()
    s.SetSessionMaxAge(time.Minute)
    s.Group("/", func(group *ghttp.RouterGroup) {
        group.ALL("/set", func(r *ghttp.Request) {
            r.Session.Set("time", gtime.Timestamp())
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

In this example, to facilitate observation of expiration, the Session expiration time is set to 1 minute. After execution:

1. Visit `http://127.0.0.1:8199/set` to set a Session variable.
2. Then, visit `http://127.0.0.1:8199/get` to see that the Session variable has been set and successfully retrieved.
3. Stop the program, restart it, and visit `http://127.0.0.1:8199/get` again to see that the Session variable has been restored from file storage.
4. After waiting for 1 minute, visit `http://127.0.0.1:8199/get` again to see that the Session is no longer accessible because it has expired.
