# Microservices Development - Overview

`GoFrame` offers a complete suite of microservices features and components starting from `version 2.4`.

## Introduction

The GoFrame framework supports microservices development, providing common microservices components, development tools, and tutorials to help teams quickly transition to microservices.

## Simple Example

`GoFrame`'s microservices components are designed with low coupling and generality in mind, supporting most microservice communication protocols through modular usage. In the official documentation, both `HTTP` and `GRPC` protocols are used as examples to introduce microservices development and how to use the components. Since `HTTP web` development is already extensively covered in separate sections, this chapter focuses primarily on `GRPC` for microservices.

### HTTP Microservice Example

You can find an HTTP microservice example on the official repository:
[HTTP Microservice Example](https://github.com/gogf/gf/tree/master/example/registry/file)

`server.go`

```go
package main

import (
    "github.com/gogf/gf/contrib/registry/file/v2"
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/net/ghttp"
    "github.com/gogf/gf/v2/net/gsvc"
    "github.com/gogf/gf/v2/os/gfile"
)

func main() {
    gsvc.SetRegistry(file.New(gfile.Temp("gsvc")))

    s := g.Server(`hello.svc`)
    s.BindHandler("/", func(r *ghttp.Request) {
        g.Log().Info(r.Context(), `request received`)
        r.Response.Write(`Hello world`)
    })
    s.Run()
}
```

In the example above, a simple HTTP microservice server is created. The only significant addition compared to a regular web server is this line:

```go
gsvc.SetRegistry(file.New(gfile.Temp("gsvc")))
```

This line enables and registers the service using a service discovery component. In this case, `file.New(gfile.Temp("gsvc"))` is used, which is a file-based service registry for local system files. `gfile.Temp("gsvc")` specifies the directory to store the service files, typically `/tmp/gsvc` on Linux/macOS systems. This file-based registry is intended for local microservice examples and cannot be used for cross-node communication. For production environments, other service discovery components like **etcd**, **Polaris**, or **Zookeeper** are commonly used. Implementations for these components are provided within the GoFrame community.

Additionally, we name the server `hello.svc` using this line:

```go
s := g.Server(`hello.svc`)
```

This name serves as the unique identifier for the microservice and is used for communication between services. When the service discovery component is enabled, the HTTP server registers its access address, making it easier for other services to discover and connect using the same registry.

`client.go`

```go
package main

import (
    "time"
    "github.com/gogf/gf/contrib/registry/file/v2"
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/net/gsvc"
    "github.com/gogf/gf/v2/os/gctx"
    "github.com/gogf/gf/v2/os/gfile"
)

func main() {
    gsvc.SetRegistry(file.New(gfile.Temp("gsvc")))

    client := g.Client()
    for i := 0; i < 10; i++ {
        ctx := gctx.New()
        res, err := client.Get(ctx, `http://hello.svc/`)
        if err != nil {
            panic(err)
        }
        g.Log().Debug(ctx, res.ReadAllString())
        res.Close()
        time.Sleep(time.Second)
    }
}
```

In the client code, we create an HTTP client with `g.Client()` and send requests to the service at `http://hello.svc/`. The `hello.svc` part refers to the microservice name defined on the server. When the client attempts to access the service via this name, the service discovery component retrieves the corresponding server address and handles the communication.

***Execution Results***

First, run the server (`server.go`) to start a simple service. Then, execute the client (`client.go`) to send requests to the server by its service name.

**Client Output**:

```bash
$ go run client.go  
2023-03-14 20:22:10.006 [DEBU] {8054f3a48c484c1760fb416bb3df20a4} Hello world
2023-03-14 20:22:11.007 [DEBU] {6831cae08c484c1761fb416b9d4df851} Hello world
2023-03-14 20:22:12.008 [DEBU] {9035761c8d484c1762fb416b1e648b81} Hello world
...
```

**Server Output**:

```bash
$ go run server.go  
2023-03-14 20:20:06.364 [INFO] pid[96421]: http server started listening on [:61589]
2023-03-14 20:22:10.006 [INFO] {8054f3a48c484c1760fb416bb3df20a4} request received
2023-03-14 20:22:11.007 [INFO] {6831cae08c484c1761fb416b9d4df851} request received
...
```

### GRPC Microservice Example

GRPC communication differs from HTTP in that it requires **protobuf** for API and data structure definitions.

Find the example here:
[GRPC Microservice Example](https://github.com/gogf/gf/tree/master/example/rpc/grpcx/basic)

`helloworld.proto`

```proto
syntax = "proto3";

package protobuf;

option go_package = "github.com/gogf/gf/grpc/example/helloworld/protobuf";

// The greeting service definition.
service Greeter {
  rpc SayHello (HelloRequest) returns (HelloReply) {}
}

// The request message containing the user's name.
message HelloRequest {
  string name = 1;
}

// The response message containing the greetings.
message HelloReply {
  string message = 1;
}
```

The above protobuf file is compiled using the command (ensure **protoc** is installed):

```bash
gf gen pb
```

This generates the Go structure files `helloworld.pb.go` and `helloworld_grpc.pb.go` for GRPC.

`controller.go`

This controller implements the interfaces defined in the protobuf file. If using GoFrame's standard project structure, this file is generated by the `gf gen pb` tool, and the developer only needs to fill in the method implementations.

```go
type Controller struct {
    protobuf.UnimplementedGreeterServer
}

func Register(s *grpcx.GrpcServer) {
    protobuf.RegisterGreeterServer(s.Server, &Controller{})
}

// SayHello implements helloworld.GreeterServer
func (s *Controller) SayHello(ctx context.Context, in *protobuf.HelloRequest) (*protobuf.HelloReply, error) {
    return &protobuf.HelloReply{Message: "Hello " + in.GetName()}, nil
}
```

`config.yaml`

In this configuration file, the service name is defined as `demo`. This name is used for service-to-service communication.

```yaml
grpc:
  name: "demo"
  logPath: "./log"
  logStdout: true
  errorLogEnabled: true
  accessLogEnabled: true
  errorStack: true
```

`server.go`

```go
package main

import (
    "github.com/gogf/gf/contrib/rpc/grpcx/v2"
    "github.com/gogf/gf/example/rpc/grpcx/basic/controller"
)

func main() {
    s := grpcx.Server.New()
    controller.Register(s)
    s.Run()
}
```

This server sets up a GRPC service using GoFrame's GRPC server, and the controller's `Register` function registers the GRPC method implementations.

`client.go`

```go
package main

import (
    "github.com/gogf/gf/contrib/rpc/grpcx/v2"
    "github.com/gogf/gf/example/rpc/grpcx/basic/protobuf"
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/os/gctx"
)

func main() {
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

In this example, the client connects to the service named `demo` and sends a request to the `SayHello` method, receiving a response.

***Execution Results***

**Server Output**:

```bash
$ go run server.go  
2023-03-14 20:50:58.465 [DEBU] set default registry using file registry as no custom registry set
2023-03-14 20:50:58.466 [DEBU] service register: &{Head: Deployment: Namespace: Name:demo Version: Endpoints:10.35.12.81:64517 Metadata:map[protocol:grpc]}
...
```

***Client Output***

:

```bash
$ go run client.go  
2023-03-14 20:51:01.321 [DEBU] Response: Hello World
```
