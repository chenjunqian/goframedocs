# Redis - Example

## Set and Get

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
    _, err := g.Redis().Set(ctx, "key", "value")
    if err != nil {
        g.Log().Fatal(ctx, err)
    }
    value, err := g.Redis().Get(ctx, "key")
    if err != nil {
        g.Log().Fatal(ctx, err)
    }
    fmt.Println(value.String())
}
```

***After execution, the terminal output will be***

```bash
value
```

## SetEx

```go
package main

import (
    "fmt"
    "time"

    _ "github.com/gogf/gf/contrib/nosql/redis/v2"
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/os/gctx"
)

func main() {
    var ctx = gctx.New()
    err := g.Redis().SetEX(ctx, "key", "value", 1)
    if err != nil {
        g.Log().Fatal(ctx, err)
    }
    value, err := g.Redis().Get(ctx, "key")
    if err != nil {
        g.Log().Fatal(ctx, err)
    }
    fmt.Println(value.IsNil())
    fmt.Println(value.String())

    time.Sleep(time.Second)

    value, err = g.Redis().Get(ctx, "key")
    if err != nil {
        g.Log().Fatal(ctx, err)
    }
    fmt.Println(value.IsNil())
    fmt.Println(value.Val())
}
```

***After execution, the terminal output will be***

```bash
false
value
true
<nil>
```

## HSet and HGetAll

```go
package main

import (
    "fmt"

    _ "github.com/gogf/gf/contrib/nosql/redis/v2"
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/os/gctx"
)

func main() {
    var (
        ctx = gctx.New()
        key = "key"
    )
    _, err := g.Redis().HSet(ctx, key, g.Map{
        "id":    1,
        "name":  "john",
        "score": 100,
    })
    if err != nil {
        g.Log().Fatal(ctx, err)
    }

    // Retrieve hash map
    value, err := g.Redis().HGetAll(ctx, key)
    if err != nil {
        g.Log().Fatal(ctx, err)
    }
    fmt.Println(value.Map())

    // Scan to struct
    type User struct {
        Id    uint64
        Name  string
        Score float64
    }
    var user *User
    if err = value.Scan(&user); err != nil {
        g.Log().Fatal(ctx, err)
    }
    g.Dump(user)
}
```

***After execution, the terminal output will be***

```bash
map[id:1 name:john score:100]
{
    Id:    1,
    Name:  "john",
    Score: 100,
}
```

## HMSet and HMGet

```go
package main

import (
    _ "github.com/gogf/gf/contrib/nosql/redis/v2"
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/os/gctx"
)

func main() {
    var (
        ctx = gctx.New()
        key = "key"
    )
    err := g.Redis().HMSet(ctx, key, g.Map{
        "id":    1,
        "name":  "john",
        "score": 100,
    })
    if err != nil {
        g.Log().Fatal(ctx, err)
    }

    // Retrieve hash map
    values, err := g.Redis().HMGet(ctx, key, "id", "name")
    if err != nil {
        g.Log().Fatal(ctx, err)
    }
    g.Dump(values.Strings())
}
```

***After execution, the terminal output will be***

```bash
[
    "1",
    "john",
]
```

***Note on Redis Version 4.0.0***

> As per Redis 4.0.0, `HMSET` is considered deprecated. Please use `HSET` in new code.
