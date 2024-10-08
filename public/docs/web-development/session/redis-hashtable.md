# Session-Redis-HashTable

## RedisHashTableStorage

Unlike `RedisKeyValueStorage`, `RedisHashTableStorage` uses HashTable to store session data at the backend. Each operation of Session addition, deletion, query, and modification directly accesses the `Redis` service (single data item operation). There is no need for an initial full fetch like `RedisKeyValueStorage`, nor is there a full update to the `Redis` service after the request ends if modifications have been made.

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
    s.SetSessionStorage(gsession.NewStorageRedisHashTable(g.Redis()))
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

In this example, to easily observe expiration, the `session` expiration time is set to `1 minute`. After execution:

1. Visit `http://127.0.0.1:8199/set` to set a `session` variable.
2. Then, visit `http://127.0.0.1:8199/get` to see that the `session` variable has been set and successfully retrieved.
3. Stop the program, restart it, and visit `http://127.0.0.1:8199/get` again to see that the `session` variable has been restored from Redis storage.
4. If you manually modify the corresponding key-value data in Redis, the latest value will also be read when the page is refreshed.
5. After waiting for `1 minute`, visit `http://127.0.0.1:8199/get` again to see that the `session` is no longer accessible because it has expired.
