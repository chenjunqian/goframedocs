# Redis - Interaction

## Do Method

The `Do` method is a general command interaction function that executes synchronous commands by sending the corresponding Redis API commands to the Redis server. The most significant advantage of the `Do` method is that it uses Redis commands to interact with the server, making it highly extensible. Any Redis commands that are not directly provided by the Redis operation methods can be implemented through the `Do` method.

***Example Usage***

```go
package main

import (
    "fmt"
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/os/gctx"
)

func main() {
    var (
        ctx = gctx.New()
    )
    v, _ := g.Redis().Do(ctx, "SET", "k", "v")
    fmt.Println(v.String())
}
```

## Automatic Serialization and Deserialization

When the provided parameter is a `map`, `slice`, or `struct`, the `gredis` library supports automatic JSON serialization. Additionally, when reading the data, the `gvar.Var` conversion functionality can be used to implement deserialization.

### Map Storage and Retrieval

In this example, we store and retrieve a `map` from Redis, demonstrating how data is automatically serialized and deserialized.

```go
package main

import (
    "fmt"
    "github.com/gogf/gf/v2/container/gvar"
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/os/gctx"
)

func main() {
    var (
        ctx    = gctx.New()
        err    error
        result *gvar.Var
        key    = "user"
        data   = g.Map{
            "id":   10000,
            "name": "john",
        }
    )
    _, err = g.Redis().Do(ctx, "SET", key, data)
    if err != nil {
        panic(err)
    }
    result, err = g.Redis().Do(ctx, "GET", key)
    if err != nil {
        panic(err)
    }
    fmt.Println(result.Map())
}
```

### Struct Storage and Retrieval

In this example, we store and retrieve a `struct` from Redis. The `Do` method allows for serialization and deserialization of structured data, providing a simple way to interact with complex data types.

```go
package main

import (
    "fmt"
    "github.com/gogf/gf/v2/container/gvar"
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/os/gctx"
)

func main() {
    type User struct {
        Id   int
        Name string
    }

    var (
        ctx    = gctx.New()
        err    error
        result *gvar.Var
        key    = "user"
        user   = g.Map{
            "id":   10000,
            "name": "john",
        }
    )

    _, err = g.Redis().Do(ctx, "SET", key, user)
    if err != nil {
        panic(err)
    }
    result, err = g.Redis().Do(ctx, "GET", key)
    if err != nil {
        panic(err)
    }

    var user2 *User
    if err = result.Struct(&user2); err != nil {
        panic(err)
    }
    fmt.Println(user2.Id, user2.Name)
}
```
