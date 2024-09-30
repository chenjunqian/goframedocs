# Redis - Configuration

The `gredis` component supports two methods for managing Redis configurations and retrieving Redis objects. One method is using a configuration component and a singleton object. The other method involves modular configuration management and object creation methods.

## Configuration File (Recommended)

In most cases, it is recommended to use the `g.Redis` singleton method to operate Redis. Therefore, it is also recommended to manage Redis configurations through a configuration file. Below is an example of the configuration in `config.yaml`:

### Single Instance Configuration

```yaml
# Redis configuration example
redis:
  # Single instance configuration example 1
  default:
    address: 127.0.0.1:6379
    db:      1

  # Single instance configuration example 2
  cache:
    address:     127.0.0.1:6379
    db:          1
    pass:        123456
    idleTimeout: 600
```

In the configuration above, `default` and `cache` represent configuration group names. In the program, we can retrieve the corresponding Redis singleton object by using these group names. If no group name is passed, the system will use the `redis.default` configuration by default to get the corresponding Redis client singleton.

### Cluster Configuration

```yaml
# Redis configuration example
redis:
  # Cluster mode configuration method
  default:
    address: 127.0.0.1:6379,127.0.0.1:6370
    db:      1
```

### Explanation of Configuration Options

- **address** (Required): Format: `address:port`. Supports both Redis single instance and cluster mode. Multiple addresses can be separated by commas, e.g., `192.168.1.1:6379, 192.168.1.2:6379`.
- **db** (Optional): Default is `0`. Represents the database index.
- **user** (Optional): The authorized user for access.
- **pass** (Optional): The authorized password for access.
- **minIdle** (Optional): The minimum number of idle connections allowed. Default is `0`.
- **maxIdle** (Optional): Default is `10`. The maximum number of idle connections allowed (0 means no limit).
- **maxActive** (Optional): Default is `100`. The maximum number of active connections allowed (0 means no limit).
- **idleTimeout** (Optional): Default is `10`. The maximum idle time for a connection. Use time strings like `30s`, `1m`, or `1d`.
- **maxConnLifetime** (Optional): Default is `30`. The maximum lifetime for a connection. Use time strings like `30s`, `1m`, or `1d`.
- **waitTimeout** (Optional): Default is `0`. The timeout for waiting for a connection from the pool. Use time strings like `30s`, `1m`, or `1d`.
- **dialTimeout** (Optional): Default is `0`. The timeout for TCP connections. Use time strings like `30s`, `1m`, or `1d`.
- **readTimeout** (Optional): Default is `0`. The timeout for TCP read operations. Use time strings like `30s`, `1m`, or `1d`.
- **writeTimeout** (Optional): Default is `0`. The timeout for TCP write operations. Use time strings like `30s`, `1m`, or `1d`.
- **masterName** (Optional): Used in Sentinel mode to set the MasterName.
- **tls** (Optional): Default is `false`. Whether to use TLS authentication.
- **tlsSkipVerify** (Optional): Default is `false`. When connecting via TLS, determines whether to disable server name verification.
- **cluster** (Optional): Default is `false`. Forces the use of cluster mode. If the `address` is a single endpoint in a cluster, the system will automatically detect it as a single instance mode. In this case, set this option to `true`.
- **protocol** (Optional): Default is `3`. Sets the RESP protocol version for communication with Redis Server.
- **sentinelUsername** (Optional): The username in Sentinel mode.
- **sentinelPassword** (Optional): The password in Sentinel mode.

***Example of Usage***

#### `config.yaml`

```yaml
# Redis configuration example
redis:
  # Single instance configuration example
  default:
    address: 127.0.0.1:6379
    db:      1
    pass:    "password" # Configure password here, remove if not needed
```

#### Go Example

```go
package main

import (
    "fmt"
    _ "github.com/gogf/gf/contrib/nosql/redis/v2"
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/os/gctx"
)

func main() {
    var ctx = gctx.New()
    
    // Set a key in Redis
    _, err := g.Redis().Set(ctx, "key", "value")
    if err != nil {
        g.Log().Fatal(ctx, err)
    }
    
    // Retrieve the key from Redis
    value, err := g.Redis().Get(ctx, "key")
    if err != nil {
        g.Log().Fatal(ctx, err)
    }
    
    // Print the value
    fmt.Println(value.String())
}
```

The output after execution will be:

```bash
value
```

## Advanced Configuration Method

Since `GoFrame` is a modular framework, besides using the tightly-coupled and convenient `g` module to automatically parse the configuration file and obtain singleton objects, it also supports developers using the `gredis` package in a modular fashion.

`gredis` provides global group configuration functionality, and the related configuration management methods are as follows:

```go
func SetConfig(config Config, name ...string)
func SetConfigByMap(m map[string]interface{}, name ...string) error
func GetConfig(name ...string) (config Config, ok bool)
func RemoveConfig(name ...string)
func ClearConfig()
```

***Example of Usage***

```go
package main

import (
    "fmt"
    _ "github.com/gogf/gf/contrib/nosql/redis/v2"
    "github.com/gogf/gf/v2/database/gredis"
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/os/gctx"
)

var (
    config = gredis.Config{
        Address: "127.0.0.1:6379",
        Db:      1,
        Pass:    "password",
    }
    group = "cache"
    ctx   = gctx.New()
)

func main() {
    // Set configuration for the group
    gredis.SetConfig(&config, group)

    // Set a key in Redis
    _, err := g.Redis(group).Set(ctx, "key", "value")
    if err != nil {
        g.Log().Fatal(ctx, err)
    }

    // Retrieve the key from Redis
    value, err := g.Redis(group).Get(ctx, "key")
    if err != nil {
        g.Log().Fatal(ctx, err)
    }

    // Print the value
    fmt.Println(value.String())
}
```
