# Tracing HTTP Example - Database Operations

## Introduction to HTTP, Database, Redis, and Logging Tracing

This example demonstrates a complete scenario with several core components involved in a single request, showcasing distributed tracing. The example can be found at [https://github.com/gogf/gf/tree/master/example/trace/http_with_db](https://github.com/gogf/gf/tree/master/example/trace/http_with_db).

## Client Code

```go
package main

import (
    "github.com/gogf/gf/contrib/trace/otlphttp/v2"
    "github.com/gogf/gf/v2/database/gdb"
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/net/ghttp"
    "github.com/gogf/gf/v2/net/gtrace"
    "github.com/gogf/gf/v2/os/gctx"
)

const (
    serviceName = "otlp-http-client"
    endpoint    = "tracing-analysis-dc-hz.aliyuncs.com"
    path        = "adapt_******_******/api/otlp/traces"
)

func main() {
    var ctx = gctx.New()
    shutdown, err := otlphttp.Init(serviceName, endpoint, path)
    if err != nil {
        g.Log().Fatal(ctx, err)
    }
    defer shutdown()

    StartRequests()
}

func StartRequests() {
    ctx, span := gtrace.NewSpan(gctx.New(), "StartRequests")
    defer span.End()

    var (
        err    error
        client = g.Client()
    )
    // Add user info.
    var insertRes = struct {
        ghttp.DefaultHandlerResponse
        Data struct{ Id int64 } `json:"data"`
    }{}
    err = client.PostVar(ctx, "http://127.0.0.1:8199/user/insert", g.Map{
        "name": "john",
    }).Scan(&insertRes)
    if err != nil {
        panic(err)
    }
    g.Log().Info(ctx, "insert result:", insertRes)
    if insertRes.Data.Id == 0 {
        g.Log().Error(ctx, "retrieve empty id string")
        return
    }

    // Query user info.
    var queryRes = struct {
        ghttp.DefaultHandlerResponse
        Data struct{ User gdb.Record } `json:"data"`
    }{}
    err = client.GetVar(ctx, "http://127.0.0.1:8199/user/query", g.Map{
        "id": insertRes.Data.Id,
    }).Scan(&queryRes)
    if err != nil {
        panic(err)
    }
    g.Log().Info(ctx, "query result:", queryRes)

    // Delete user info.
    var deleteRes = struct {
        ghttp.DefaultHandlerResponse
    }{}
    err = client.PostVar(ctx, "http://127.0.0.1:8199/user/delete", g.Map{
        "id": insertRes.Data.Id,
    }).Scan(&deleteRes)
    if err != nil {
        panic(err)
    }
    g.Log().Info(ctx, "delete result:", deleteRes)
}
```

**Client Code Explanation:**

1. The client initializes Jaeger using the `otlphttp.Init` method.
2. The client makes three HTTP requests to the server:
   - `/user/insert` to add a new user and get the user's ID.
   - `/user/query` to query the user using the ID obtained from the previous request.
   - `/user/delete` to delete the user using the ID obtained from the previous request.

## Server Code

```go
package main

import (
    "context"
    "fmt"
    "time"

    "github.com/gogf/gf/contrib/trace/otlphttp/v2"
    "github.com/gogf/gf/v2/database/gdb"
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/net/ghttp"
    "github.com/gogf/gf/v2/os/gcache"
    "github.com/gogf/gf/v2/os/gctx"
)

type cTrace struct{}

const (
    serviceName = "otlp-http-client"
    endpoint    = "tracing-analysis-dc-hz.aliyuncs.com"
    path        = "adapt_******_******/api/otlp/traces"
)

func main() {
    var ctx = gctx.New()
    shutdown, err := otlphttp.Init(serviceName, endpoint, path)
    if err != nil {
        g.Log().Fatal(ctx, err)
    }
    defer shutdown()

    // Set ORM cache adapter with redis.
    g.DB().GetCache().SetAdapter(gcache.NewAdapterRedis(g.Redis()))

    // Start HTTP server.
    s := g.Server()
    s.Use(ghttp.MiddlewareHandlerResponse)
    s.Group("/", func(group *ghttp.RouterGroup) {
        group.ALL("/user", new(cTrace))
    })
    s.SetPort(8199)
    s.Run()
}

type InsertReq struct {
    Name string `v:"required#Please input user name."`
}
type InsertRes struct {
    Id int64
}

// Insert is a route handler for inserting user info into the database.
func (c *cTrace) Insert(ctx context.Context, req *InsertReq) (res *InsertRes, err error) {
    result, err := g.Model("user").Ctx(ctx).Insert(req)
    if err != nil {
        return nil, err
    }
    id, _ := result.LastInsertId()
    res = &InsertRes{
        Id: id,
    }
    return
}

type QueryReq struct {
    Id int `v:"min:1#User id is required for querying"`
}
type QueryRes struct {
    User gdb.Record
}

// Query is a route handler for querying user info. It first retrieves the info from redis,
// if there's nothing in the redis, it then does a db select.
func (c *cTrace) Query(ctx context.Context, req *QueryReq) (res *QueryRes, err error) {
    one, err := g.Model("user").Ctx(ctx).Cache(gdb.CacheOption{
        Duration: 5 * time.Second,
        Name:     c.userCacheKey(req.Id),
        Force:    false,
    }).WherePri(req.Id).One()
    if err != nil {
        return nil, err
    }
    res = &QueryRes{
        User: one,
    }
    return
}

type DeleteReq struct {
    Id int `v:"min:1#User id is required for deleting."`
}
type DeleteRes struct{}

// Delete is a route handler for deleting specified user info.
func (c *cTrace) Delete(ctx context.Context, req *DeleteReq) (res *DeleteRes, err error) {
    _, err = g.Model("user").Ctx(ctx).Cache(gdb.CacheOption{
        Duration: -1,
        Name:     c.userCacheKey(req.Id),
        Force:    false,
    }).WherePri(req.Id).Delete()
    if err != nil {
        return nil, err
    }
    return
}

func (c *cTrace) userCacheKey(id int) string {
    return fmt.Sprintf(`userInfo:%d`, id)
}
```

**Server Code Explanation:**

1. The server initializes `Jaeger` using the `otlphttp.Init` method.
2. The server uses both the database and database cache features to demonstrate `ORM` and `Redis` tracing.
3. The server sets the database cache adapter to `Redis` at startup.
4. In `ORM` operations, the context is passed to the component, which automatically enables tracing if the context contains tracing information.
5. The server uses the `Cache` method to cache query results in `Redis` and clears the cache in delete operations.

## Viewing the Effects

- **Starting the Server:**

    ```bash
    ➜ gf-tracing git:(master) go run http+db+redis+log/server/main.go
    2021-01-29 11:40:00.163 70836: http server started listening on [:8199]

    | SERVER  | DOMAIN  | ADDRESS  | METHOD | ROUTE        | HANDLER                        | MIDDLEWARE                   |
    |---------|---------|----------|--------|--------------|--------------------------------|------------------------------|
    | default | default | :8199    | ALL    | /user/delete | main.(*tracingApi).Delete      | ghttp.MiddlewareServerTracing |
    | default | default | :8199    | ALL    | /user/insert | main.(*tracingApi).Insert      | ghttp.MiddlewareServerTracing |
    | default | default | :8199    | ALL    | /user/query  | main.(*tracingApi).Query       | ghttp.MiddlewareServerTracing |

    2021-01-29 11:40:12.915 [DEBU] {TraceID:05c54d2737e4bc8ff1c7d03b87c25b10} [240 ms] [default] SHOW FULL COLUMNS FROM `user`
    2021-01-29 11:40:13.054 [DEBU] {TraceID:05c54d2737e4bc8ff1c7d03b87c25b10} [138 ms] [default] INSERT INTO `user`(`name`) VALUES('john')
    2021-01-29 11:40:13.059 [DEBU] {TraceID:05c54d2737e4bc8ff1c7d03b87c25b10} [  3 ms] [default] SELECT * FROM `user` WHERE `uid`=3 LIMIT 1
    2021-01-29 11:40:13.070 [DEBU] {TraceID:05c54d2737e4bc8ff1c7d03b87c25b10} [ 10 ms] [default] DELETE FROM `user` WHERE `uid`=3
    ```

- **Starting the Client:**

    ```bash
    ➜  gf-tracing git:(master) go run http+db+redis+log/client/main.go
    2021-01-29 11:40:13.055 {TraceID:05c54d2737e4bc8ff1c7d03b87c25b10} insert: 3
    2021-01-29 11:40:13.059 {TraceID:05c54d2737e4bc8ff1c7d03b87c25b10} query: 3 {"name":"john","uid":3}
    2021-01-29 11:40:13.071 {TraceID:05c54d2737e4bc8ff1c7d03b87c25b10} delete: 3 ok
    ```

You can view the tracing information on `Jaeger`

### ORM Tracing Information

**Attributes/Tags:**

- `db.type`: The type of database connection (e.g., `mysql`, `mssql`, `pgsql`).
- `db.link`: The database connection information (password fields are automatically hidden).
- `db.group`: The database group name in the configuration file.

**Events/Process:**

- `db.execution.sql`: The executed `SQL` statement. This is automatically constructed for easy viewing and should be used for reference only.
- `db.execution.type`: The type of `SQL` statement executed (e.g., `DB.ExecContext` and `DB.QueryContext`, representing write and read operations, respectively).
- `db.execution.cost`: The execution time of the `SQL` statement in `milliseconds`.

### Redis Tracing Information

**Attributes/Tags:**

- `redis.host`: The `Redis` connection address.
- `redis.port`: The `Redis` connection port.
- `redis.db`: The `Redis` `database` being operated on.

**Events/Process:**

- `redis.execution.command`: The `Redis` command being executed.
- `redis.execution.arguments`: The arguments for the `Redis` command.
- `redis.execution.cost`: The execution time of the `Redis` command in `milliseconds`.
