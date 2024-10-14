# Service Tracing - gRPC Example

## Introduction to gRPC Tracing

In this chapter, we will modify the previously introduced `HTTP Client` & `Server` example to a `gRPC` microservice. We will demonstrate how to develop a simple `gRPC` server and client using the `GoFrame` framework and add tracing capabilities to the `gRPC` microservice.

The example code for this chapter can be found at: [https://github.com/gogf/gf/tree/master/example/trace/grpc_with_db](https://github.com/gogf/gf/tree/master/example/trace/grpc_with_db)

## Directory Structure

## Protobuf

```proto
syntax = "proto3";

package user;

option go_package = "protobuf/user";

// User service for tracing demo.
service User {
  rpc Insert(InsertReq) returns (InsertRes) {}
  rpc Query(QueryReq) returns (QueryRes) {}
  rpc Delete(DeleteReq) returns (DeleteRes) {}
}

message InsertReq {
  string Name = 1; // v: required#Please input user name.
}
message InsertRes {
  int32 Id = 1;
}

message QueryReq {
  int32 Id = 1; // v: min:1#User id is required for querying.
}
message QueryRes {
  int32  Id = 1;
  string Name = 2;
}

message DeleteReq {
  int32 Id = 1; // v:min:1#User id is required for deleting.
}
message DeleteRes {}
```

Use the `gf gen pb` command to compile the proto file, which will generate the corresponding gRPC interface files and data structure files.

## gRPC Server

```go
package main

import (
    _ "github.com/gogf/gf/contrib/drivers/mysql/v2"
    _ "github.com/gogf/gf/contrib/nosql/redis/v2"
    "github.com/gogf/gf/contrib/registry/etcd/v2"
    "github.com/gogf/gf/example/trace/grpc_with_db/protobuf/user"

    "context"
    "fmt"
    "time"

    "github.com/gogf/gf/contrib/rpc/grpcx/v2"
    "github.com/gogf/gf/contrib/trace/otlpgrpc/v2"
    "github.com/gogf/gf/v2/database/gdb"
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/os/gcache"
    "github.com/gogf/gf/v2/os/gctx"
)

type Controller struct {
    user.UnimplementedUserServer
}

const (
    serviceName = "otlp-grpc-server"
    endpoint    = "tracing-analysis-dc-bj.aliyuncs.com:8090"
    traceToken  = "******_******"
)

func main() {
    grpcx.Resolver.Register(etcd.New("127.0.0.1:2379"))

    var ctx = gctx.New()
    shutdown, err := otlpgrpc.Init(serviceName, endpoint, traceToken)
    if err != nil {
        g.Log().Fatal(ctx, err)
    }
    defer shutdown()

    // Set ORM cache adapter with redis.
    g.DB().GetCache().SetAdapter(gcache.NewAdapterRedis(g.Redis()))

    s := grpcx.Server.New()
    user.RegisterUserServer(s.Server, &Controller{})
    s.Run()
}

// Insert is a route handler for inserting user info into the database.
func (s *Controller) Insert(ctx context.Context, req *user.InsertReq) (res *user.InsertRes, err error) {
    result, err := g.Model("user").Ctx(ctx).Insert(g.Map{
        "name": req.Name,
    })
    if err != nil {
        return nil, err
    }
    id, _ := result.LastInsertId()
    res = &user.InsertRes{
        Id: int32(id),
    }
    return
}

// Query is a route handler for querying user info. It first retrieves the info from redis,
// if there's nothing in the redis, it then does a db select.
func (s *Controller) Query(ctx context.Context, req *user.QueryReq) (res *user.QueryRes, err error) {
    err = g.Model("user").Ctx(ctx).Cache(gdb.CacheOption{
        Duration: 5 * time.Second,
        Name:     s.userCacheKey(req.Id),
        Force:    false,
    }).WherePri(req.Id).Scan(&res)
    if err != nil {
        return nil, err
    }
    return
}

// Delete is a route handler for deleting specified user info.
func (s *Controller) Delete(ctx context.Context, req *user.DeleteReq) (res *user.DeleteRes, err error) {
    err = g.Model("user").Ctx(ctx).Cache(gdb.CacheOption{
        Duration: -1,
        Name:     s.userCacheKey(req.Id),
        Force:    false,
    }).WherePri(req.Id).Scan(&res)
    return
}

func (s *Controller) userCacheKey(id int32) string {
    return fmt.Sprintf(`userInfo:%d`, id)
}
```

**Server Code Explanation:**

1. The server initializes `Jaeger` using the `otlpgrpc.Init` method.
2. The business logic is identical to the previous HTTP example, but the access layer has been modified to use gRPC protocol.
3. We still inject Redis cache through the cache adapter:

   ```go
   g.DB().GetCache().SetAdapter(gcache.NewAdapterRedis(g.Redis()))
   ```

4. The `Cache` method is used to enable `ORM` caching, which has been previously introduced and will not be reiterated here.

## gRPC Client

```go
package main

import (
    "github.com/gogf/gf/contrib/registry/etcd/v2"
    "github.com/gogf/gf/contrib/rpc/grpcx/v2"
    "github.com/gogf/gf/contrib/trace/otlpgrpc/v2"
    "github.com/gogf/gf/example/trace/grpc_with_db/protobuf/user"
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/net/gtrace"
    "github.com/gogf/gf/v2/os/gctx"
)

const (
    serviceName = "otlp-grpc-client"
    endpoint    = "tracing-analysis-dc-bj.aliyuncs.com:8090"
    traceToken  = "******_******"
)

func main() {
    grpcx.Resolver.Register(etcd.New("127.0.0.1:2379"))

    var ctx = gctx.New()
    shutdown, err := otlpgrpc.Init(serviceName, endpoint, traceToken)
    if err != nil {
        g.Log().Fatal(ctx, err)
    }
    defer shutdown()

    StartRequests()
}

func StartRequests() {
    ctx, span := gtrace.NewSpan(gctx.New(), "StartRequests")
    defer span.End()

    client := user.NewUserClient(grpcx.Client.MustNewGrpcClientConn("demo"))

    // Baggage.
    ctx = gtrace.SetBaggageValue(ctx, "uid", 100)

    // Insert.
    insertRes, err := client.Insert(ctx, &user.InsertReq{
        Name: "john",
    })
    if err != nil {
        g.Log().Fatalf(ctx, `%+v`, err)
    }
    g.Log().Info(ctx, "insert id:", insertRes.Id)

    // Query.
    queryRes, err := client.Query(ctx, &user.QueryReq{
        Id: insertRes.Id,
    })
    if err != nil {
        g.Log().Errorf(ctx, `%+v`, err)
        return
    }
    g.Log().Info(ctx, "query result:", queryRes)

    // Delete.
    _, err = client.Delete(ctx, &user.DeleteReq{
        Id: insertRes.Id,
    })
    if err != nil {
        g.Log().Errorf(ctx, `%+v`, err)
        return
    }
    g.Log().Info(ctx, "delete id:", insertRes.Id)

    // Delete with error.
    _, err = client.Delete(ctx, &user.DeleteReq{
        Id: -1,
    })
    if err != nil {
        g.Log().Errorf(ctx, `%+v`, err)
        return
    }
    g.Log().Info(ctx, "delete id:", -1)
}
```

**Client Code Explanation:**

1. The client also initializes `Jaeger` using the `otlpgrpc.Init` method.
2. The client is very simple; the internal initialization and default interceptor settings are encapsulated by the `Katyusha` framework, so developers only need to focus on implementing business logic.

## Viewing the Effects

- **Starting the Server:**

    ```bash
    ➜  gf-tracing git:(master) go run grpc+db+redis+log/server/main.go
    2021-01-29 13:13:28.564 grpc server starts listening on :8000

    2021-01-29 13:13:33.281 [DEBU] {TraceID:d78bb60bfc15c3ca5cb1564be84e511e} [122 ms] [default] SHOW FULL COLUMNS FROM `user`
    2021-01-29 13:13:33.312 [DEBU] {TraceID:d78bb60bfc15c3ca5cb1564be84e511e} [ 31 ms] [default] INSERT INTO `user`(`name`) VALUES('john')
    2021-01-29 13:13:33.318 [DEBU] {TraceID:d78bb60bfc15c3ca5cb1564be84e511e} [  3 ms] [default] SELECT * FROM `user` WHERE `uid`=5 LIMIT 1
    2021-01-29 13:13:33.335 [DEBU] {TraceID:d78bb60bfc15c3ca5cb1564be84e511e} [ 14 ms] [default] DELETE FROM `user` WHERE `uid`=5
    ```

- **Starting the Client:**

    ```bash
    ➜  gf-tracing git:(master) go run grpc+db+redis+log/server/main.go
    2021-01-29 13:13:28.564 grpc server starts listening on :8000

    2021-01-29 13:13:33.281 [DEBU] {TraceID:d78bb60bfc15c3ca5cb1564be84e511e} [122 ms] [default] SHOW FULL COLUMNS FROM `user`
    2021-01-29 13:13:33.312 [DEBU] {TraceID:d78bb60bfc15c3ca5cb1564be84e511e} [ 31 ms] [default] INSERT INTO `user`(`name`) VALUES('john')
    2021-01-29 13:13:33.318 [DEBU] {TraceID:d78bb60bfc15c3ca5cb1564be84e511e} [  3 ms] [default] SELECT * FROM `user` WHERE `uid`=5 LIMIT 1
    2021-01-29 13:13:33.335 [DEBU] {TraceID:d78bb60bfc15c3ca5cb1564be84e511e} [ 14 ms] [default] DELETE FROM `user` WHERE `uid`=5
    ```

The client execution ends with an error, which we intentionally introduced to demonstrate the tracing information when a gRPC error occurs. We open Jaeger to view the tracing information.

### gRPC Client & Server Tracing Information

#### Attributes

- `net.peer.ip`: The target IP of the request.
- `net.peer.port`: The target port of the request.
- `rpc.grpc.status_code`: The internal status code of `gRPC`, 0 indicates success, non-zero indicates failure.
- `rpc.service`: The `RPC` service name; note that it is `RPC`, not `gRPC`, as it is a general definition that supports multiple `RPC` communication protocols, with `gRPC` being one of them.
- `rpc.method`: The `RPC` method name.
- `rpc.system`: The `RPC` protocol type, such as `grpc`, `thrift`, etc.

#### Events/Logs

- `grpc.metadata.outgoing`: The `Metadata` information submitted by the `gRPC` client request, which can be quite large.
- `grpc.request.baggage`: The `Baggage` information submitted by the `gRPC` client request, used for cross-service link information transfer.
- `grpc.request.message`: The `Message` data submitted by the `gRPC` client request, which can be quite large, with a maximum recording size of `512KB`; if it exceeds this size, it is ignored. Only valid for `Unary` request types.
- `grpc.response.message`: The `Message` information received by the `gRPC` client request, which can be quite large. Only valid for `Unary` request types.

#### gRPC Server Attributes

The `Attributes` of the `gRPC Server` are the same as those of the `gRPC Client`, with essentially consistent data printed in the same request.

#### gRPC Server Events

The `Events` of the `gRPC Server` differ from those of the `gRPC Client` in that the `metadata` received by the server in the same request is `grpc.metadata.incoming`, with other aspects being the same as the `gRPC Client`.
