# Service Configuration - Configuration Methods

## Configuration Object

The configuration object is defined at: [ghttp.ServerConfig](https://pkg.go.dev/github.com/gogf/gf/v2/net/ghttp#ServerConfig)

## Configuration Methods

The list of methods is available at: [ghttp.Server](https://pkg.go.dev/github.com/gogf/gf/v2/net/ghttp#Server)

***Brief Description***

1. Configurations can be set using `SetConfig` and `SetConfigWithMap`.
2. Additionally, specific configurations can be set using the `Server` object's `Set*`/`Enable*` methods.
3. It's important to note that configurations cannot be modified after the `Server` has `started` to prevent concurrent safety issues.

### SetConfigWithMap Method

The `SetConfigWithMap` method allows setting/modifying specific configurations of the `Server` using Key-Value pairs, with the rest of the configurations using default values. The key names are the attribute names in the `ServerConfig` struct and are not case-sensitive. They also support connections using `-`, `_`, or spaces. For more details, refer to the [Type Conversion - Struct Conversion](/docs/core-component/type-convert/struct) section.

#### A Simple Example

```go
s := g.Server()
s.SetConfigWithMap(g.Map{
    "Address":    ":80",
    "ServerRoot": "/var/www/MyServerRoot",
})
s.Run()
```

In this example, the key name `ServerRoot` can also be written as `serverRoot`, `server-root`, `server_root`, or `server root`. The same applies to other configuration attributes.

#### A More Complete Example

```go
s := g.Server()
s.SetConfigWithMap(g.Map{
    "address":          ":80",
    "serverRoot":       "/var/www/Server",
    "indexFiles":       g.Slice{"index.html", "main.html"},
    "accessLogEnabled": true,
    "errorLogEnabled":  true,
    "pprofEnabled":     true,
    "logPath":          "/var/log/ServerLog",
    "sessionIdName":    "MySessionId",
    "sessionPath":      "/tmp/MySessionStoragePath",
    "sessionMaxAge":    24 * time.Hour,
    "dumpRouterMap":    false,
})
s.Run()
```
