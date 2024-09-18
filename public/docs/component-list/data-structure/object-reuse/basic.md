# Object Reuse - Basic Usage

## Basic Usage Example

```go
package main

import (
    "github.com/gogf/gf/v2/container/gpool"
    "fmt"
    "time"
)

func main () {
    // Create an object pool with an expiration time of 1 second
    p := gpool.New(time.Second, nil)

    // Get an object from the pool, returns nil and error
    fmt.Println(p.Get())

    // Put an object into the pool
    p.Put(1)

    // Get an object from the pool again, returns 1
    fmt.Println(p.Get())

    // Wait for 2 seconds and retry, the object is expired, returns nil and error
    time.Sleep(2 * time.Second)
    fmt.Println(p.Get())
}
```

## Creation and Destruction Methods

We can define dynamic creation and destruction methods for objects.

***Example with Creation and Destruction Methods***

```go
package main

import (
    "fmt"
    "github.com/gogf/gf/v2/container/gpool"
    "github.com/gogf/gf/v2/net/gtcp"
    "github.com/gogf/gf/v2/os/glog"
    "time"
)

func main() {
    // Create an object reuse pool with an expiration time of 3 seconds and defined creation/destruction methods
    p := gpool.New(3*time.Second, func() (interface{}, error) {
        return gtcp.NewConn("www.baidu.com:80")
    }, func(i interface{}) {
        glog.Println("expired")
        i.(*gtcp.Conn).Close()
    })

    conn, err := p.Get()
    if err != nil {
        panic(err)
    }

    result, err := conn.(*gtcp.Conn).SendRecv([]byte("HEAD / HTTP/1.1\n\n"), -1)
    if err != nil {
        panic(err)
    }
    fmt.Println(string(result))

    // Put the connection back into the pool for reuse
    p.Put(conn)

    // Wait for a certain amount of time to observe the expiration method call
    time.Sleep(4 * time.Second)
}
```

***Terminal Output After Execution***

```bash
HTTP/1.1 302 Found
Connection: Keep-Alive
Content-Length: 17931
Content-Type: text/html
Date: Wed, 29 May 2019 11:23:20 GMT
Etag: "54d9749e-460b"
Server: bfe/1.0.8.18

2019-05-29 19:23:24.732 expired
```
