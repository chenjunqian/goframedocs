# Tracing HTTP Example - Baggage

## Baggage for Cross-Service Data Transfer

`Baggage` allows for the transfer of custom information across services in a distributed tracing system.

**Example Code Repository:** [https://github.com/gogf/gf/tree/master/example/trace/http](https://github.com/gogf/gf/tree/master/example/trace/http)

## Client Code

```go
package main

import (
    "github.com/gogf/gf/contrib/trace/otlphttp/v2"
    "github.com/gogf/gf/v2/frame/g"
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

    ctx = gtrace.SetBaggageValue(ctx, "name", "john")

    content := g.Client().GetContent(ctx, "http://127.0.0.1:8199/hello") 
    g.Log().Print(ctx, content)
}
```

**Client Code Explanation:**

1. The client initializes Jaeger using the `jaeger.Init` method.
2. A baggage is set with `gtrace.SetBaggageValue(ctx, "name", "john")`, which will be passed along the entire request chain. However, in this example, there are two nodes, so the baggage data will only be passed to the server.
3. The `g.Client()` creates an HTTP client request object that automatically enables tracing without needing explicit method calls or settings from the developer.
4. `g.Log().Print(ctx, content)` prints the server's response content, with `ctx` passing tracing information to the logging component. If the `context` contains tracing information, the `TraceId` is automatically output to the log content.

## Server Code

```go
package main

import (
    "github.com/gogf/gf/contrib/trace/otlphttp/v2"
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/net/ghttp"
    "github.com/gogf/gf/v2/net/gtrace"
    "github.com/gogf/gf/v2/os/gctx"
)

const (
    serviceName = "otlp-http-server"
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

    s := g.Server()
    s.Group("/", func(group *ghttp.RouterGroup) {
        group.GET("/hello", HelloHandler)
    })
    s.SetPort(8199)
    s.Run()
}

func HelloHandler(r *ghttp.Request) {
    ctx, span := gtrace.NewSpan(r.Context(), "HelloHandler")
    defer span.End()

    value := gtrace.GetBaggageVar(ctx, "name").String()

    r.Response.Write("hello:", value)
}
```

**Server Code Explanation:**

1. The server also initializes Jaeger using the `jaeger.Init` method.
2. The server starts with tracing enabled, without needing explicit method calls or settings from the developer.
3. The server retrieves the baggage information submitted by the client with `gtrace.GetBaggageVar(ctx, "name").String()` and returns it as a string.

## Viewing the Effects

- **Starting the Server:**

```bash
# gf-tracing git:(master) go run http/server/main.go
|  server | domain  | address | method | router |       handler     | middleware                    |
|---------|---------|---------|--------|--------|-------------------|-------------------------------|
| default | default | :8199   | GET    | /hello | main.HelloHandler | ghttp.MiddlewareServerTracing |

2021-01-29 00:50:21.649 67782: http server started listening on[:8199]
```

This table displays the server configuration and the startup message indicating that the HTTP server has started listening on port `8199`.

- **Starting the Client:**

```bash
→ gf-tracing git:(master) go run http/client/main.go

2021-01-29 00:50:34.568{TraceID:71d3dd5d82d801aea6888f5811dd451b} hello:john

→ gf-tracing git:(master)
```

You can see that the `baggage` submitted by the client has been successfully received by the server and printed in the response. Additionally, the client outputs the `TraceId` information in the log content. The `TraceId` is a unique ID for a trace, which can be used to retrieve all log information for that trace and to query the details of the call chain in the `Jaeger` system.

**Viewing Trace Information on Jaeger:**

You can see two service names: `tracing-http-client` and `tracing-http-server`, indicating that the request involves two services: the HTTP client and server. Each service includes two span nodes.

By clicking on the details of this trace, you can see the hierarchical relationship of the call chain. You can also see the client's request address, the server's received route, and the server's route function name.

### HTTP Client Attributes

- `otel.instrumentation_library.name`: The name of the current instrument, often the component name of the current `span` operation.
- `otel.instrumentation_library.version`: The version of the current instrument component.
- `span.kind`: The type of the current `span`, usually automatically written by the component. Common `span` types include:
  - `client`: Client
  - `server`: Server
  - `producer`: Producer, commonly used in MQ
  - `consumer`: Consumer, commonly used in MQ
  - `internal`: Internal method, generally used for business
  - `undefined`: Undefined, less used
- `status.code`: The status of the current `span`, `0` for normal, `non-zero` indicates failure.
- `status.message`: The status message of the current `span`, often containing error information when failed.
- `hostname`: The hostname of the current node.
- `ip.intranet`: The intranet address list of the current node.
- `http.address.local`: The local address and port for HTTP communication.
- `http.address.remote`: The target address and port for HTTP communication.
- `http.dns.start`: The domain name address when the target address of the request has a domain name.
- `http.dns.done`: The IP address after the domain name of the request's target address is resolved.
- `http.connect.start`: The type and address of the connection creation start.
- `http.connect.done`: The type and address after the connection creation is successful.

### HTTP Client Events

- `http.request.headers`: The `Header` information submitted by the HTTP client request, which can be quite large.
- `http.request.baggage`: The `Baggage` information submitted by the HTTP client request, used for cross-service link information transfer.
- `http.request.body`: The `Body` data submitted by the HTTP client request, which can be quite large. Only up to `512KB` is recorded; if it exceeds this size, it is ignored.
- `http.response.headers`: The `Header` information received by the HTTP client request, which can be quite large.
- `http.response.body`: The `Body` data received by the HTTP client request, which can be quite large. Only up to `512KB` is recorded; if it exceeds this size, it is ignored.

### HTTP Server Attributes

The `Attributes` of the `HTTP` Server are the same as those of the `HTTP Client`, and the data printed in the same request is essentially consistent.

### HTTP Server Events

The Events of the `HTTP Server` are the same as those of the `HTTP Client`, and the data printed in the same request is essentially consistent.
