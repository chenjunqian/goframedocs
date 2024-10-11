# TCP Component - Connection Object

The `gtcp` module provides a simple and easy-to-use `gtcp.Conn` connection operation object.

Usage:

```go
import "github.com/gogf/gf/v2/net/gtcp"
```

Interface Documentation:

<https://pkg.go.dev/github.com/gogf/gf/v2/net/gtcp>

```go
type Conn
    func NewConn(addr string, timeout ...int) (*Conn, error)
    func NewConnByNetConn(conn net.Conn) *Conn
    func NewConnKeyCrt(addr, crtFile, keyFile string) (*Conn, error)
    func NewConnTLS(addr string, tlsConfig *tls.Config) (*Conn, error)
    func (c *Conn) Close() error
    func (c *Conn) LocalAddr() net.Addr
    func (c *Conn) Recv(length int, retry ...Retry) ([]byte, error)
    func (c *Conn) RecvLine(retry ...Retry) ([]byte, error)
    func (c *Conn) RecvWithTimeout(length int, timeout time.Duration, retry ...Retry) ([]byte, error)
    func (c *Conn) RemoteAddr() net.Addr
    func (c *Conn) Send(data []byte, retry ...Retry) error
    func (c *Conn) SendRecv(data []byte, receive int, retry ...Retry) ([]byte, error)
    func (c *Conn) SendRecvWithTimeout(data []byte, receive int, timeout time.Duration, retry ...Retry) ([]byte, error)
    func (c *Conn) SendWithTimeout(data []byte, timeout time.Duration, retry ...Retry) error
    func (c *Conn) SetDeadline(t time.Time) error
    func (c *Conn) SetRecvBufferWait(bufferWaitDuration time.Duration)
    func (c *Conn) SetRecvDeadline(t time.Time) error
    func (c *Conn) SetSendDeadline(t time.Time) error
```

## Write Operations

The TCP communication write operation is implemented by the `Send` method, which also provides a mechanism for error retries, provided by the second optional parameter retry. It is important to note that the `Send` method does not have any buffering mechanism, meaning that each call to the `Send` method will immediately invoke the underlying TCP Write method to write data (buffering is implemented at the system level). Therefore, if you want to control the output buffer, it should be handled at the business layer.

When writing to `TCP`, in a reliable communication scenario, it is often a one-write-one-read pattern, that is, after `Send` is successful, Recv is immediately called to get the feedback result from the target. Therefore, `gtcp.Conn` also provides a convenient `SendRecv` method.

## Read Operations

The TCP communication read operation is implemented by the `Recv` method, which also provides a mechanism for error retries, provided by the second optional parameter `retry`. The `Recv` method has built-in read buffer control, allowing you to specify the length of data to be read (specified by the `length` parameter). When the specified length of data is read, it will return immediately. If `length < 0`, all readable data in the buffer will be read and returned. When `length = 0`, it means to get the data from the buffer once and return immediately.

If you use `Recv(-1)`, you can read all readable data in the buffer (the length is unknown, and if the sent data packet is too long, it may be truncated), but you need to pay attention to the packet parsing issue, which can easily lead to incomplete packets. At this time, the business layer needs to handle the integrity of the packet according to the established data packet structure. It is recommended to use the `simple protocol` introduced later to send and receive message packets through `SendPkg/RecvPkg`, please refer to the following chapters for details.

## Timeout Handling

`gtcp.Conn` provides timeout handling for data writing and reading during TCP communication, specified by the `timeout` parameter in the method, which is relatively simple and does not need further elaboration.

Let's look at how to use the `gtcp.Conn` object through a few examples.

## Usage Examples

### Example 1 Simple Use

```go
package main

import (
    "fmt"
    "time"
    "github.com/gogf/gf/v2/net/gtcp"
    "github.com/gogf/gf/v2/os/glog"
    "github.com/gogf/gf/v2/util/gconv"
)

func main() {
    // Server
    go gtcp.NewServer("127.0.0.1:8999", func(conn *gtcp.Conn) {
        defer conn.Close()
        for {
            data, err := conn.Recv(-1)
            if len(data) > 0 {
                  fmt.Println(string(data))
            }
            if err != nil {
                break
            }
        }
    }).Run()

    time.Sleep(time.Second)

    // Client
    conn, err := gtcp.NewConn("127.0.0.1:8999")
    if err != nil {
        panic(err)
    }
    for i := 0; i < 10000; i++ {
        if err := conn.Send([]byte(gconv.String(i))); err != nil {
            glog.Error(err)
        }
        time.Sleep(time.Second)
    }
}
```

- `Server` side, immediately prints the received data from the client to the terminal.
- `Client` side, uses the same connection object, sending the current increasing number to the server every second in a loop. At the same time, this function can also demonstrate that the underlying Socket communication does not use buffering, that is, executing `Send` once immediately sends data to the server. Therefore, the client needs to manage the buffer data to be sent locally.
- After execution, the following information is output on the server terminal:

```bash
2018-07-11 22:11:08.650 0
2018-07-11 22:11:09.651 1
2018-07-11 22:11:10.651 2
2018-07-11 22:11:11.651 3
2018-07-11 22:11:12.651 4
2018-07-11 22:11:13.651 5
2018-07-11 22:11:14.652 6
2018-07-11 22:11:15.652 7
2018-07-11 22:11:16.652 8
2018-07-11 22:11:17.652 9
2018-07-11 22:11:18.652 10
2018-07-11 22:11:19.653 11
...
```

### Example 2 Echo Service

Let's improve the previous echo service:

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
       if conn, err := gtcp.NewConn("127.0.0.1:8999"); err == nil {
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

In this example, the `Client` sends the current time information to the `Server` every second, the `Server` returns the original data information after receiving it, and the `Client` immediately prints the information returned from the `Server` side to the terminal.

After execution, the output result is:

```bash
> 2018-07-19 23:25:43 127.0.0.1:34306 127.0.0.1:8999
> 2018-07-19 23:25:44 127.0.0.1:34308 127.0.0.1:8999
> 2018-07-19 23:25:45 127.0.0.1:34312 127.0.0.1:8999
> 2018-07-19 23:25:46 127.0.0.1:34314 127.0.0.1:8999
```

### Example 3 HTTP Client

In this example, we use the gtcp package to implement a simple HTTP client, read and print out the `header` and `content` of the Baidu homepage.

```go
package main

import (
    "fmt"
    "bytes"
    "github.com/gogf/gf/v2/net/gtcp"
    "github.com/gogf/gf/v2/util/gconv"
)

func main() {
    conn, err := gtcp.NewConn("www.baidu.com:80")
    if err != nil {
        panic(err)
    }
    defer conn.Close()

    if err := conn.Send([]byte("GET / HTTP/1.1\r\n\r\n")); err != nil {
        panic(err)
    }

    header        := make([]byte, 0)
    content       := make([]byte, 0)
    contentLength := 0
    for {
        data, err := conn.RecvLine()
        // read header get text length
        if len(data) > 0 {
            array := bytes.Split(data, []byte(": "))
            // get page content length
            if contentLength == 0 && len(array) == 2 && bytes.EqualFold([]byte("Content-Length"), array[0]) {
                contentLength = gconv.Int(string(array[1][:len(array[1])-1]))
           }
            header = append(header, data...)
            header = append(header, '\n')
        }
        // read header done, read content
        if contentLength > 0 && len(data) == 1 {
            content, _ = conn.Recv(contentLength)
            break
        }
        if err != nil {
            fmt.Errorf("ERROR: %s\n", err.Error())
            break
        }
    }

    if len(header) > 0 {
        fmt.Println(string(header))
    }
    if len(content) > 0 {
        fmt.Println(string(content))
    }
}
```

After execution, the output result is:

```bash
HTTP/1.1 200 OK
Accept-Ranges: bytes
Cache-Control: no-cache
Connection: Keep-Alive
Content-Length: 14615
Content-Type: text/html
Date: Sat, 21 Jul 2018 04:21:03 GMT
Etag: "5b3c3650-3917"
Last-Modified: Wed, 04 Jul 2018 02:52:00 GMT
P3p: CP=" OTI DSP COR IVA OUR IND COM "
Pragma: no-cache
Server: BWS/1.1
...
```
