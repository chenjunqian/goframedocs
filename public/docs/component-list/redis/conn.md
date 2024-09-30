# Redis - Conn Object

## Conn Object

If you need to implement long-lived `Redis` operations (such as publish/subscribe), you can use the `Conn` method to obtain a connection object from the connection pool. You should use this connection object for your operations. However, it's important to explicitly call the `Close` method to return the connection to the pool when you're done using it.

Since the `Conn` is a connection object, be aware that it is subject to connection timeout limits, which depend on the server configuration.

## Publish and Subscribe

You can implement the publish/subscribe pattern using `Redis`'s `Conn`.

***Example Code***

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
        ctx     = gctx.New()
        channel = "channel"
    )
    conn, _ := g.Redis().Conn(ctx)
    defer conn.Close(ctx)
    _, err := conn.Subscribe(ctx, channel)
    if err != nil {
        g.Log().Fatal(ctx, err)
    }
    for {
        msg, err := conn.ReceiveMessage(ctx)
        if err != nil {
            g.Log().Fatal(ctx, err)
        }
        fmt.Println(msg.Payload)
    }
}
```

After executing the program, it will block and wait to receive data.

***Publishing a Message***

Open another terminal and enter the Redis Server using the `redis-cli` command, then publish a message:

```bash
$ redis-cli
127.0.0.1:6379> publish channel test
(integer) 1
127.0.0.1:6379>
```

Immediately, the program terminal will print the data received from the Redis Server:

```bash
test
```
