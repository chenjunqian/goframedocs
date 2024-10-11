# TCP Component - TLS Encryption

Created by Guo Qiang, last modified on January 25, 2021

The `gtcp` module supports TLS encrypted communication for both server and client sides, which is essential in scenarios where high security is required. TLS servers can be created using the `NewServerTLS` or `NewServerKeyCrt` methods. TLS clients can be created using the `NewConnKeyCrt` or `NewConnTLS` methods.

## Usage Example

For a complete example, refer to the [gtcp TLS example on GitHub](https://github.com/gogf/gf/v2/tree/master/.example/net/gtcp/tls).

```go
package main

import (
    "fmt"
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/net/gtcp"
    "github.com/gogf/gf/v2/util/gconv"
    "time"
)

func main() {
    address := "127.0.0.1:8999"
    crtFile := "server.crt"
    keyFile := "server.key"
    // TLS Server
    go gtcp.NewServerKeyCrt(address, crtFile, keyFile, func(conn *gtcp.Conn) {
        defer conn.Close()
        for {
            data, err := conn.Recv(-1)
            if len(data) > 0 {
                fmt.Println(string(data))
            }
            if err != nil {
                // if client closes, err will be: EOF
                g.Log().Error(err)
                break
            }
        }
    }).Run()

    time.Sleep(time.Second)

    // Client
    conn, err := gtcp.NewConnKeyCrt(address, crtFile, keyFile)
    if err != nil {
        panic(err)
    }
    defer conn.Close()
    for i := 0; i < 10; i++ {
    if err := conn.Send([]byte(gconv.String(i))); err != nil {
        g.Log().Error(err)
    }
    time.Sleep(time.Second)
    if i == 5 {
        conn.Close()
        break
    }
 }

 // exit after 5 seconds
 time.Sleep(5 * time.Second)
}
```

After execution, you may see an error on the client side:

```bash
panic: x509: certificate has expired or is not yet valid
```

This error occurs because the certificate we created has expired. For demonstration purposes, we will skip client-side certificate verification in the client code.

```go
package main

import (
    "fmt"
    "github.com/gogf/gf/v2/net/gtcp"
    "github.com/gogf/gf/v2/util/gconv"
    "time"
)

func main() {
    address := "127.0.0.1:8999"
    crtFile := "server.crt"
    keyFile := "server.key"
    // TLS Server
    go gtcp.NewServerKeyCrt(address, crtFile, keyFile, func(conn *gtcp.Conn) {
        defer conn.Close()
        for {
            data, err := conn.Recv(-1)
            if len(data) > 0 {
                fmt.Println(string(data))
            }
            if err != nil {
                // if client closes, err will be: EOF
                g.Log().Error(err)
                break
            }
        }
    }).Run()

    time.Sleep(time.Second)

    // Client
    tlsConfig, err := gtcp.LoadKeyCrt(crtFile, keyFile)
    if err != nil {
        panic(err)
    }
    tlsConfig.InsecureSkipVerify = true

    conn, err := gtcp.NewConnTLS(address, tlsConfig)
    if err != nil {
        panic(err)
    }
    defer conn.Close()
    for i := 0; i < 10; i++ {
        if err := conn.Send([]byte(gconv.String(i))); err != nil {
        g.Log().Error(err)
    }
    time.Sleep(time.Second)
    if i == 5 {
        conn.Close()
        break
    }
 }

 // exit after 5 seconds
 time.Sleep(5 * time.Second)
}
```

After execution, the terminal output will be:

```bash
0
1
2
3
4
5
2019-06-05 00:13:12.488 [ERRO] EOF
Stack:
1. /Users/john/Workspace/Go/GOPATH/src/github.com/gogf/gf/v2/geg/net/gtcp/tls/gtcp_server_client.go:25
```

In this example, the client closed the connection after `5 seconds`, resulting in an `EOF` error on the server side. Such errors can be ignored in production use; when an error occurs, the server can simply close the client connection.
