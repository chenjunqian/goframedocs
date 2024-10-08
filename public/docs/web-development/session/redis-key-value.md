# Session-Redis-KeyValue

## Redis KeyValue Storage

File storage is excellent for single-node scenarios, but when it comes to multi-node deployment, `sessions` cannot be shared across nodes. Therefore, it's necessary to manage `session` storage separately, and `Redis` servers are a common choice for this purpose.

The Redis storage in `gsession` is implemented using the `StorageRedis` object, which, like file storage, adopts a memory + Redis approach to improve execution efficiency. The only difference from file storage is that in each request where `session` operations are needed, the latest `session` data is pulled from Redis (while file storage only reads the file once when the `session` does not exist). After each request ends, the full `session` data is serialized through JSON and updated to the Redis service via a KeyValue approach.

> This storage method is recommended for business scenarios where the `session` data volume per user is not large. If the `session` data volume per user is large (e.g., `>10MB`), you can refer to the HashTable storage method: [Session-Redis-HashTable](/docs/web-development/session/redis-key-value).

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
    s.SetSessionStorage(gsession.NewStorageRedis(g.Redis()))
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

In this example, to easily observe expiration, the session expiration time is set to `1 minute`. After execution:

1. Visit `http://127.0.0.1:8199/set` to set a `session` variable.
2. Then, visit `http://127.0.0.1:8199/get` to see that the `session` variable has been set and successfully retrieved.
3. Stop the program, restart it, and visit `http://127.0.0.1:8199/get` again to see that the `session` variable has been restored from Redis storage.
4. If you manually modify the corresponding key-value data in Redis, the latest value will also be read when the page is refreshed.
5. After waiting for 1 minute, visit `http://127.0.0.1:8199/get` again to see that the `session` is no longer accessible because it has expired.
