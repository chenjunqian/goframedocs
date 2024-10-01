# Microservice - Interceptor

`GRPC` supports the interceptor feature, enhancing the flexibility and extensibility of `GRPC`.

## Using Interceptors

### Server Side

To add additional server-side interceptors, use `grpcx.Server.ChainUnary`:

```go
c := grpcx.Server.NewConfig()
c.Options = append(c.Options, []grpc.ServerOption{
    grpcx.Server.ChainUnary(
        grpcx.Server.UnaryValidate,
    )},
    ...
)
s := grpcx.Server.New(c)
user.Register(s)
s.Run()
```

### Client Side

To add additional client-side interceptors, use `grpcx.Client.ChainUnary`:

```go
conn = grpcx.Client.MustNewGrpcClientConn("demo", grpcx.Client.ChainUnary(
    grpcx.Client.UnaryTracing,
))
```

## List of Interceptors

The `grpcx` component of the framework provides a variety of commonly used interceptors. Some are built-in, while others can be optionally used.

```markdown
| Interceptor Name         | Type      | Client Support | Server Support | Description                                                                       |
|--------------------------|-----------|----------------|----------------|-----------------------------------------------------------------------------------|
| UnaryError               | Client    | Yes            | No             | Supports the framework's error handling component.                                |
| UnaryTracing             | Client    | Yes            | No             | Supports link tracing.                                                            |
| StreamTracing            | Client    | Yes            | No             | Supports link tracing (long connection).                                          |
| UnaryError               | Server    | No             | Yes            | Supports the framework's error handling component.                                |
| UnaryRecover             | Server    | No             | Yes            | Supports automatic capture of server panic without crashing.                      |
| UnaryAllowNilRes         | Server    | No             | Yes            | Supports returning nil response objects.                                          |
| UnaryValidate            | Server    | No             | Yes            | Supports automatic error validation based on struct tags. Manual import required. |
| UnaryTracing             | Server    | No             | Yes            | Supports link tracing.                                                            |
| StreamTracing            | Server    | No             | Yes            | Supports link tracing (long connection).                                          |
```
