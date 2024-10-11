# TCP Component - Connection Pool

The `gtcp` module provides a connection pool feature, implemented by the `gtcp.PoolConn` object. The connection pool caches connections for a fixed lifespan of 600 seconds and implements a reconnection mechanism when data is sent. This feature is ideal for scenarios with frequent short-lived connections and high concurrency. We will demonstrate the use of the connection pool with two examples.

## Usage

```go
import "github.com/gogf/gf/v2/net/gtcp"
```

For more details, refer to the [gtcp package documentation](https://pkg.go.dev/github.com/gogf/gf/v2/net/gtcp).

## PoolConn Type

```go
type PoolConn
    func NewPoolConn(addr string, timeout ...int) (*PoolConn, error)
    func (c *PoolConn) Close() error
    func (c *PoolConn) Recv(length int, retry ...Retry) ([]byte, error)
    func (c *PoolConn) RecvLine(retry ...Retry) ([]byte, error)
    func (c *PoolConn) RecvPkg(option ...PkgOption) ([]byte, error)
    func (c *PoolConn) RecvPkgWithTimeout(timeout time.Duration, option ...PkgOption) ([]byte, error)
    func (c *PoolConn) RecvWithTimeout(length int, timeout time.Duration, retry ...Retry) (data []byte, err error)
    func (c *PoolConn) Send(data []byte, retry ...Retry) error
    func (c *PoolConn) SendPkg(data []byte, option ...PkgOption) (err error)
    func (c *PoolConn) SendPkgWithTimeout(data []byte, timeout time.Duration, option ...PkgOption) error
    func (c *PoolConn) SendRecv(data []byte, receive int, retry ...Retry) ([]byte, error)
    func (c *PoolConn) SendRecvPkg(data []byte, option ...PkgOption) ([]byte, error)
    func (c *PoolConn) SendRecvPkgWithTimeout(data []byte, timeout time.Duration, option ...PkgOption) ([]byte, error)
    func (c *PoolConn) SendRecvWithTimeout(data []byte, receive int, timeout time.Duration, retry ...Retry) ([]byte, error)
    func (c *PoolConn) SendWithTimeout(data []byte, timeout time.Duration, retry ...Retry) error
```

Since `gtcp.PoolConn` inherits from `gtcp.Conn`, you can also use methods from `gtcp.Conn`.

## Example 1: Basic Usage

```go
package main

import (
    "fmt"
    "time"
    "github.com/gogf/gf/v2/net/gtcp"
    "github.com/gogf/gf/v2/os/glog"
    "github.com/gogf/gf/v2/os/gtime"
)

func main() {
    // Server
    go gtcp.NewServer("127.0.0.1:8999", func(conn *gtcp.Conn) {
        defer conn.Close()
        for {
            data, err := conn.Recv(-1)
            if len(data) > 0 {
                if err := conn.Send(append([]byte("> "), data...)); err != nil {
                    fmt.Println(err)
                }
            }
            if err != nil {
                break
            }
        }
    }).Run()

    time.Sleep(time.Second)

    // Client
    for {
       if conn, err := gtcp.NewPoolConn("127.0.0.1:8999"); err == nil {
           if b, err := conn.SendRecv([]byte(gtime.Datetime()), -1); err == nil {
               fmt.Println(string(b), conn.LocalAddr(), conn.RemoteAddr())
           } else {
               fmt.Println(err)
           }
           conn.Close()
       } else {
           glog.Error(err)
       }
       time.Sleep(time.Second)
    }
}
```

In this example, the server creates a new goroutine to run asynchronously, while the client executes within the main goroutine. The server acts as an echo server, and the client sends the current time to the server every second. After the server echoes the data back, the client prints the connection port information of both ends.

The output will be as follows:

```bash
> 2018-07-11 23:29:54 127.0.0.1:55876 127.0.0.1:8999
> 2018-07-11 23:29:55 127.0.0.1:55876 127.0.0.1:8999
> 2018-07-11 23:29:56 127.0.0.1:55876 127.0.0.1:8999
> 2018-07-11 23:29:57 127.0.0.1:55876 127.0.0.1:8999
> 2018-07-11 23:29:58 127.0.0.1:55876 127.0.0.1:8999
...
```

You can see that the client's port number remains the same, and each time `gtcp.NewConn("127.0.0.1:8999")` is called, it retrieves the same `gtcp.Conn` object. Moreover, when `conn.Close()` is called, it does not truly close the connection but instead returns the object to the connection pool for reuse.

## Example 2: Connection Disconnection Handling

This example demonstrates the validity of the connection object after the server closes the connection.

```go
package main

import (
    "fmt"
    "time"
    "github.com/gogf/gf/v2/net/gtcp"
    "github.com/gogf/gf/v2/os/glog"
    "github.com/gogf/gf/v2/os/gtime"
)

func main() {
    // Server
    go gtcp.NewServer("127.0.0.1:8999", func(conn *gtcp.Conn) {
        defer conn.Close()
        for {
            data, err := conn.Recv(-1)
            if len(data) > 0 {
                if err := conn.Send(append([]byte("> "), data...)); err != nil {
                    fmt.Println(err)
                }
            }
            if err != nil {
                break
            }
            return
        }
    }).Run()

    time.Sleep(time.Second)

    // Client
    for {
       if conn, err := gtcp.NewPoolConn("127.0.0.1:8999"); err == nil {
           if b, err := conn.SendRecv([]byte(gtime.Datetime()), -1); err == nil {
               fmt.Println(string(b), conn.LocalAddr(), conn.RemoteAddr())
           } else {
               fmt.Println(err)
           }
           conn.Close()
       } else {
           glog.Error(err)
       }
       time.Sleep(time.Second)
    }
}
```

The output will be as follows:

```bash
> 2018-07-20 12:56:15 127.0.0.1:59368 127.0.0.1:8999
EOF
> 2018-07-20 12:56:17 127.0.0.1:59376 127.0.0.1:8999
EOF
> 2018-07-20 12:56:19 127.0.0.1:59378 127.0.0.1:8999
EOF
...
```

In this example, the server closes the connection after handling each request. After the client sends the first request, due to the IO multiplexing feature of the connection pool, it will get the same connection object next time. Since the server has actively closed the connection, the second request writes successfully (although it does not actually reach the server and can only be detected during the next read operation), but the read fails (`EOF` indicates the target connection is closed). Therefore, when the client executes `Close`, it will destroy the connection object instead of further reusing it. The next time the client gets a connection object through `gtcp.NewPoolConn`, it will create a new connection with the server for data communication. That's why you see the client's port number changing constantly, indicating that the `gtcp.Conn` object is a new connection, and the previous connection object has been destroyed.

The IO multiplexing of connection objects involves subtle issues with connection state changes. Since point-to-point network communication is inherently complex, and the state of connection objects can change passively at any time, it is important to note the connection object reconstruction mechanism when communication errors occur. Once an error occurs, immediately discard (Close) the object (`gtcp.PoolConn`) and reconstruct (use `gtcp.NewPoolConn`) it.
