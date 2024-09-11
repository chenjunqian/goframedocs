# Configuration - Object

We recommend using the singleton pattern to obtain the configuration object. We can conveniently obtain the default global configuration object through `g.Cfg()`. At the same time, we can also obtain the configuration object singleton through the `gcfg.Instance` package method.

## Using `g.Cfg`

Let's look at an example that demonstrates how to read global configuration information. It should be noted that the global configuration is related to the framework, so `g.Cfg()` is used uniformly for retrieval. Below is a default global configuration file that includes directory configuration for the template engine and configuration for a `MySQL` database cluster.

Configuration example:

```yaml
viewpath: "/home/www/templates/"
database:
  default:
  - link: "mysql:root:12345678@tcp(127.0.0.1:3306)/test"
    role: "master"
  - link: "mysql:root:12345678@tcp(127.0.0.1:3306)/test"
    role: "slave"
```

Code example:

```go
package main

import (
    "fmt"

    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/os/gctx"
)

func main() {
    var ctx = gctx.New()
    fmt.Println(g.Cfg().Get(ctx, "viewpath"))
    fmt.Println(g.Cfg().Get(ctx, "database.default.0.role"))
}
```

Output:

```bash
/home/www/templates/
master
```

## Using `gcfg.Instance`

We can also obtain the configuration object singleton through the `gcfg.Instance` package method.

```go
package main

import (
    "fmt"

    "github.com/gogf/gf/v2/os/gcfg"
    "github.com/gogf/gf/v2/os/gctx"
)

func main() {
    var ctx = gctx.New()
    fmt.Println(gcfg.Instance().Get(ctx, "viewpath"))
    fmt.Println(gcfg.Instance().Get(ctx, "database.default.0.role"))
}
```

## Automatic Search Config Files

When the singleton object is created, it automatically searches for configuration files with the suffixes `toml/yaml/yml/json/ini/xml/properties`. By default, it will automatically search for and cache the configuration file `config.toml/yaml/yml/json/ini/xml/properties`, and the cache will be automatically refreshed when the configuration file is modified.

Read multiple configuration files files, the singleton object will automatically use the singleton name for file searching when created. For example: `g.Cfg("redis")` retrieves a singleton object that will automatically search for `redis.toml/yaml/yml/json/ini/xml/properties` by default. If find the file, the file will be loaded into memory cache, and the next time it will be read directly from memory; if the file does not exist, `goframe` will use the default configuration file (`config.toml`).
