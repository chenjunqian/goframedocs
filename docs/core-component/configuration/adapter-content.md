# Configuration - Adapter Content

## `AdapterContent`

`AdapterContent` is configuration content-base implementation, user can provide specific configuration content to generate an `Adapter` interface object. The configuration content supports multiple formats, with the format list being the same as that of the configuration management component.

## Usage

Normally, we can just use `g.Cfg` singleton object.

```go
package main

import (
    "fmt"

    "github.com/gogf/gf/v2/os/gcfg"
    "github.com/gogf/gf/v2/os/gctx"
)

const content = `
server:
  address:     ":8888"
  openapiPath: "/api.json"
  swaggerPath: "/swagger"
  dumpRouterMap: false

database:
  default:
    link:  "mysql:root:12345678@tcp(127.0.0.1:3306)/test"
    debug:  true
`

func main() {
    var ctx = gctx.New()
    adapter, err := gcfg.NewAdapterContent(content)
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
