# Configuration - File Adapter

## AdapterFile

`AdapterFile` is the default implementation of configuration management, base on file-based write/read.

## `g.Cfg` Singleton Object

In most scenarios, we can just use the file-based configuration management implementation by the `g.Cfg` singleton object that has been encapsulated by the framework. For example:

`config.yaml`

```yaml
server:
  address:     ":8888"
  openapiPath: "/api.json"
  swaggerPath: "/swagger"
  dumpRouterMap: false

database:
  default:
    link:  "mysql:root:12345678@tcp(127.0.0.1:3306)/test"
    debug:  true
```

`main.go`

```go
package main

import (
    "fmt"

    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/os/gctx"
)

func main() {
    var ctx = gctx.New()
    fmt.Println(g.Cfg().MustGet(ctx, "server.address").String())
    fmt.Println(g.Cfg().MustGet(ctx, "database.default").Map())
}
```

output:

```bash
:8888
map[debug:true link:mysql:root:12345678@tcp(127.0.0.1:3306)/test]
```

## `gcfg.NewWithAdapter` Usage

We can also use `gcfg.NewWithAdapter` to create a configuration object with a custom configuration `Adapter`.

`config.yaml`

```yaml
server:
  address:     ":8888"
  openapiPath: "/api.json"
  swaggerPath: "/swagger"
  dumpRouterMap: false

database:
  default:
    link:  "mysql:root:12345678@tcp(127.0.0.1:3306)/test"
    debug:  true
```

`main.go`

```go
package main

import (
    "fmt"

    "github.com/gogf/gf/v2/os/gcfg"
    "github.com/gogf/gf/v2/os/gctx"
)

func main() {
    var ctx = gctx.New()
    adapter, err := gcfg.NewAdapterFile("config")
    if err != nil {
        panic(err)
    }
    config := gcfg.NewWithAdapter(adapter)
    fmt.Println(config.MustGet(ctx, "server.address").String())
    fmt.Println(config.MustGet(ctx, "database.default").Map())
}
```

Output:

```bash
:8888
map[debug:true link:mysql:root:12345678@tcp(127.0.0.1:3306)/test]
```
