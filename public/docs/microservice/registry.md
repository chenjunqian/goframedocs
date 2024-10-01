# Microservice - Service Registration

## Basic Introduction

The `GoFrame` framework provides a service registration and discovery component managed by the `gsvc` component. This component primarily defines the interface for registration and discovery, with specific implementations provided by community components: [Goframe Registry Components](https://github.com/gogf/gf/tree/master/contrib/registry). Currently, various implementations for registration and discovery are available, such as `etcd, zookeeper, and polaris`. Developers can choose and use these as needed or implement their own registration and discovery components based on the `gsvc` component's interface definition.

## Enabling the Component

The registration and discovery component will only be enabled when a specific implementation is imported. For example, the usage of etcd for registration and discovery is as follows:

```go
package main

import (
 "github.com/gogf/gf/contrib/registry/etcd/v2"
 "github.com/gogf/gf/v2/net/gsvc"
)

func main() {
 gsvc.SetRegistry(etcd.New(`127.0.0.1:2379`))
 
    // ...
}
```

## Common Components

- **file**: [Registry File Component](https://github.com/gogf/gf/tree/master/contrib/registry/file) - Only for single machine testing.
- **etcd**: [Registry Etcd Component](https://github.com/gogf/gf/tree/master/contrib/registry/etcd)
- **polaris**: [Registry Polaris Component](https://github.com/gogf/gf/tree/master/contrib/registry/polaris)
- **zookeeper**: [Registry Zookeeper Component](https://github.com/gogf/gf/tree/master/contrib/registry/zookeeper)

For more components, please refer to: [Goframe Registry](https://github.com/gogf/gf/tree/master/contrib/registry)

## Usage Example

### HTTP

You can set up etcd as the registration and discovery service using `gsvc.SetRegistry(etcd.New(`127.0.0.1:2379`))`. The `etcd.New` function indicates that a `gsvc.Registry` interface implementation object is created via the community component, which is then set as the global default registration and discovery interface implementation object using the `gsvc.SetRegistry` method.

`server.go`

```go
package main

import (
    "github.com/gogf/gf/contrib/registry/etcd/v2"
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/net/ghttp"
    "github.com/gogf/gf/v2/net/gsvc"
)

func main() {
    gsvc.SetRegistry(etcd.New(`127.0.0.1:2379`))

    s := g.Server(`hello.svc`)
    s.BindHandler("/", func(r *ghttp.Request) {
        g.Log().Info(r.Context(), `request received`)
        r.Response.Write(`Hello world`)
    })
    s.Run()
}
```

`client.go`

```go
package main

import (
    "github.com/gogf/gf/contrib/registry/etcd/v2"
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/net/gsvc"
    "github.com/gogf/gf/v2/os/gctx"
)

func main() {
    gsvc.SetRegistry(etcd.New(`127.0.0.1:2379`))
    ctx := gctx.New()
    res := g.Client().GetContent(ctx, `http://hello.svc/`)
    g.Log().Info(ctx, res)
}
```

After executing the server, the output will be:

```bash
$ go run server.go
2023-03-15 20:55:56.256 [INFO] pid[3358]: http server started listening on [:60700]
2023-03-15 20:55:56.256 [INFO] openapi specification is disabled
2023-03-15 20:55:56.256 [DEBU] service register: &{Head: Deployment: Namespace: Name:hello.svc Version: Endpoints:10.35.12.81:60700 Metadata:map[insecure:true protocol:http]}
2023-03-15 20:55:56.297 [DEBU] etcd put success with key "/service/default/default/hello.svc/latest/10.35.12.81:60700", value "{"insecure":true,"protocol":"http"}", lease "7587869265945813002"

   SERVER   | DOMAIN  | ADDRESS | METHOD | ROUTE |                             HANDLER                             |    MIDDLEWARE      
------------|---------|---------|--------|-------|-----------------------------------------------------------------|--------------------
  hello.svc | default | :60700  | ALL    | /     | main.main.func1                                                 |                    
------------|---------|---------|--------|-------|-----------------------------------------------------------------|--------------------
  hello.svc | default | :60700  | ALL    | /*    | github.com/gogf/gf/v2/net/ghttp.internalMiddlewareServerTracing | GLOBAL MIDDLEWARE  
------------|---------|---------|--------|-------|-----------------------------------------------------------------|--------------------

2023-03-15 20:56:45.739 [INFO] {880eaa8104994c17ffb384495cd4c613} request received
```

***Client Output***

```bash
$ go run client.go
2023-03-15 20:56:45.739 [INFO] {880eaa8104994c17ffb384495cd4c613} Hello world
```

### GRPC

> For `GRPC` protocol, you must use the `grpcx.Resolver` module to set up the service registration and discovery component. The server side defaults to "default" if the `grpc.name` value is not set in `config.yaml`.

`server.go`

In the code, `etcd.New` indicates that a `gsvc.Registry` interface implementation object is created through the community component, and the global grpc registration discovery interface implementation object is set using `grpcx.Resolver.Register`.

```go
package main

import (
    "github.com/gogf/gf/contrib/registry/etcd/v2"
    "github.com/gogf/gf/contrib/rpc/grpcx/v2"
    "github.com/gogf/gf/example/registry/etcd/grpc/controller"
)

func main() {
    grpcx.Resolver.Register(etcd.New("127.0.0.1:2379"))

    s := grpcx.Server.New()
    controller.Register(s)
    s.Run()
}
```

`config.yaml`

The default configuration file for the server:

```yaml
grpc:
  name:             "demo"  # Service Name
  address:          ":8000" # Custom service listening address
  logPath:          "./log" # Log storage directory path
  logStdout:        true    # Whether to output logs to the terminal
  errorLogEnabled:  true    # Whether to enable error log recording
  accessLogEnabled: true    # Whether to enable access log recording
  errorStack:       true    # Whether to record the error stack when an error occurs
```

`client.go`

```go
package main

import (
    "github.com/gogf/gf/contrib/registry/etcd/v2"
    "github.com/gogf/gf/contrib/rpc/grpcx/v2"
    "github.com/gogf/gf/example/registry/etcd/grpc/protobuf"
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/os/gctx"
)

func main() {
    grpcx.Resolver.Register(etcd.New("127.0.0.1:2379"))

    var (
        ctx    = gctx.New()
        conn   = grpcx.Client.MustNewGrpcClientConn("demo")
        client = protobuf.NewGreeterClient(conn)
    )
    res, err := client.SayHello(ctx, &protobuf.HelloRequest{Name: "World"})
    if err != nil {
        g.Log().Error(ctx, err)
        return
    }
    g.Log().Debug(ctx, "Response:", res.Message)
}
```

After executing the server, the output will be:

```bash
$ go run server.go
2023-03-15 21:06:57.204 [DEBU] service register: &{Head: Deployment: Namespace: Name:demo Version: Endpoints:10.35.12.81:61978 Metadata:map[protocol:grpc]}
2023-03-15 21:06:57.257 [DEBU] etcd put success with key "/service/default/default/demo/latest/10.35.12.81:61978", value "{"protocol":"grpc"}", lease "7587869265945813015"
2023-03-15 21:06:57.257 [INFO] pid[5786]: grpc server started listening on [:61978]
2023-03-15 21:07:04.955 {08f0aead94994c1731591d2b653ddc18} /protobuf.Greeter/SayHello, 0.002ms, name:"World", message:"Hello World"
```

***Client Output***

```bash
$ go run client.go
2023-03-15 21:07:04.950 [DEBU] Watch key "/service/default/default/demo/latest/"
2023-03-15 21:07:04.952 [DEBU] client conn updated with addresses [{"Addr":"10.35

.12.81:61978","ServerName":"demo","Attributes":{},"BalancerAttributes":null,"Type":0,"Metadata":null}]
2023-03-15 21:07:04.953 [DEBU] client conn updated with addresses [{"Addr":"10.35.12.81:61978","ServerName":"demo","Attributes":{},"BalancerAttributes":null,"Type":0,"Metadata":null}]
2023-03-15 21:07:04.955 [DEBU] {08f0aead94994c1731591d2b653ddc18} Response: Hello World
```

## FAQ

### How to Disable Discovery for Specific Requests When Global Service Discovery is Enabled

**Question**: When using `gclient`, if the global service discovery feature is enabled, all requests from `gclient` will go through the discovery service. However, requests for services that are not maintained in the service registration discovery, such as requests to an IP:PORT address or an external service, will also go through the discovery service, potentially leading to errors when the service cannot be found. How can this issue be avoided?

**Answer**: When the global service discovery feature is enabled, requests from `gclient` will use the globally set discovery service by default. If specific requests do not need to use the discovery service, you can disable the discovery for the current request using the `gclient.Client.Discovery(nil)` chaining method or the `SetDiscovery(nil)` configuration method to disable the discovery service for the current client. This way, the request will not go through the discovery service.

**Example**:

```go
// Disable discovery for the current request using the chaining method
g.Client().Discovery(nil).Get(ctx, "http://192.168.1.1/api/v1/user")

// Disable discovery for the current client using the configuration method
client := g.Client()
client.SetDiscovery(nil)
client.Get(ctx, "http://192.168.1.1/api/v1/user")
```
