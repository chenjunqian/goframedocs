# Redis - Interface

The `gredis` package adopts an interface-based design, offering powerful flexibility and scalability.

## Interface Definition

You can find the interface definition [here](https://pkg.go.dev/github.com/gogf/gf/v2/database/gredis#Adapter).

## Related Methods

```go
// SetAdapter sets a custom adapter for the current Redis client.
func (r *Redis) SetAdapter(adapter Adapter) 

// GetAdapter returns the adapter that is set in the current Redis client.
func (r *Redis) GetAdapter() Adapter
```

## Self-Implemented Redis Adapter

The framework community components provide a default implementation of the `Redis Adapter`. If developers need to implement their own `Redis Adapter` or want to override certain methods, they can extend based on this implementation.

Let's look at an example. In this example, we implement a custom `Redis Adapter` and override its underlying `Do` method. To simplify the example, we will just print a log message in our custom `Do` method; the subsequent logic will still utilize the community `Redis Adapter`'s implementation.

***Example Code***

```go
package main

import (
    "context"
    "fmt"

    "github.com/gogf/gf/contrib/nosql/redis/v2"
    "github.com/gogf/gf/v2/container/gvar"
    "github.com/gogf/gf/v2/database/gredis"
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/os/gctx"
)

var (
    ctx    = gctx.New()
    group  = "cache"
    config = gredis.Config{
        Address: "127.0.0.1:6379",
        Db:      1,
    }
)

// MyRedis description
type MyRedis struct {
    *redis.Redis
}

// Do implements and overwrites the underlying function Do from Adapter.
func (r *MyRedis) Do(ctx context.Context, command string, args ...interface{}) (*gvar.Var, error) {
    fmt.Println("MyRedis Do:", command, args)
    return r.Redis.Do(ctx, command, args...)
}

func main() {
    gredis.RegisterAdapterFunc(func(config *gredis.Config) gredis.Adapter {
        r := &MyRedis{redis.New(config)}
        r.AdapterOperation = r // This is necessary.
        return r
    })
    gredis.SetConfig(&config, group)

    _, err := g.Redis(group).Set(ctx, "key", "value")
    if err != nil {
        g.Log().Fatal(ctx, err)
    }
    value, err := g.Redis(group).Get(ctx, "key")
    if err != nil {
        g.Log().Fatal(ctx, err)
    }
    fmt.Println(value.String())
}
```

***Output***

After execution, the terminal will output:

```bash
MyRedis Do: Set [key value]
MyRedis Do: Get [key]
value
```
