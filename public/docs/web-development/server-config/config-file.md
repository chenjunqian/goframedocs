# Service Configuration - Configuration Files

The `Server` object supports convenient configuration through configuration files. For a list of supported configuration options and their descriptions, please refer to the interface documentation, which provides detailed explanations. This section will not introduce the configuration options.

When obtaining a `Server` singleton object using `g.Server(single instance name)`, the corresponding `Server` configuration will be automatically retrieved through the default configuration management object. By default, it will read the `server.single instance name` configuration item. If this configuration item does not exist, it will read the `server` configuration item.

For a list of supported configuration file items, please refer to the properties of the `Server` configuration management object: [ghttp.ServerConfig](https://pkg.go.dev/github.com/gogf/gf/v2/net/ghttp#ServerConfig)

## Example 1: Default Configuration Item

```yaml
server:
    address:    ":80"
    serverRoot: "/var/www/Server"
```

You can then automatically obtain and set this configuration when getting the default singleton object with `g.Server()`.

> If `address` is not configured, the HTTP server will start using all IP addresses of the local network card plus a random available port (default configuration: `0`). If you want to specify an IP but use a random available port to start the HTTP server, you can use the format `ip:0` to configure `address`, for example: `192.168.1.1:0`, `10.0.1.1:0`.

## Example 2: Multiple Configuration Items

Here is an example of configuring multiple `Server` instances:

```yaml
server:
    address:    ":80"
    serverRoot: "/var/www/Server"
    server1:
        address:    ":8080"
        serverRoot: "/var/www/Server1"
    server2:
        address:    ":8088"
        serverRoot: "/var/www/Server2"
```

We can obtain the corresponding configured `Server` singleton objects by their singleton names:

```go
// Corresponds to the server.server1 configuration item
s1 := g.Server("server1")
// Corresponds to the server.server2 configuration item
s2 := g.Server("server2")
// Corresponds to the default configuration item server
s3 := g.Server("none")
// Corresponds to the default configuration item server
s4 := g.Server()
```

## Example 3: More Complete Example

For example, the configuration file corresponding to the previous section's example is as follows:

```yaml
server:
    address:          ":8199"
    serverRoot:       "/var/www/Server"
    indexFiles:       ["index.html", "main.html"]
    accessLogEnabled: true
    errorLogEnabled:  true
    pprofEnabled:     true
    logPath:          "/var/log/ServerLog"
    sessionIdName:    "MySessionId"
    sessionPath:      "/tmp/MySessionStoragePath"
    sessionMaxAge:    "24h"
    dumpRouterMap:    false
```

Similarly, the names of configuration attribute items are not case-sensitive, and words can also be connected with `-` or `_` symbols. In other words, the following configuration file has the same effect as the above configuration file:

```yaml
server:
    address:          ":8199"
    serverRoot:       "/var/www/Server"
    indexFiles:       ["index.html", "main.html"]
    accessLogEnabled: true
    errorLogEnabled:  true
    pprofEnabled:     true
    log-path:         "/var/log/ServerLog"
    session_Id_Name:  "MySessionId"
    Session-path:     "/tmp/MySessionStoragePath"
    session_MaxAge:   "24h"
    DumpRouterMap:    false
```

> We recommend using lowercase camel hump format for configuration item names in the configuration file.

## Upload Limit

The `Server` has size limits for the data submitted by the client, mainly controlled by two configuration parameters:

- `MaxHeaderBytes`: The size limit of the request header, which includes the `Cookie` data submitted by the client. The default setting is `10KB`.
- `ClientMaxBodySize`: The size limit of the `Body` submitted by the client, which also affects the size of file uploads. The default setting is `8MB`.

For security reasons, the default upload limits are not very high, especially the size limit of `ClientMaxBodySize`. If you need to upload files, you may consider adjusting it appropriately through configuration, for example:

```yaml
server:
    maxHeaderBytes:    "20KB"
    clientMaxBodySize: "200MB"
```

This changes the request header size limit to `20KB` and the file upload size limit to `200MB`. If you do not want to impose any restrictions on the upload size, set `clientMaxBodySize` to 0.

## Log Configuration

Starting from version `v2`, `Server` has added support for the `Logger` configuration item in the configuration file, mainly to unify the log component configuration and solve the problem of log rotation and splitting. Configuration example:

```yaml
server:
    address: ":8080"
    logger:
      path:                 "/var/log/server" 
      file:                 "{Y-m-d}.log"          
      stdout:               false      
      rotateSize:           "100M"        
      rotateBackupLimit:    10
      rotateBackupExpire:   "60d"
      rotateBackupCompress: 9
      rotateCheckInterval:  "24h" 
```

For a detailed introduction to the `logger` item, please refer to the [Log Component - Configuration Management](/docs/core-component/log/config) section.
