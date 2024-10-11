# TCP Component - Communication Development

## Advanced Development

For short connections, where data is sent and received in each instance followed by the closure of the connection, the logic is relatively straightforward, but the communication efficiency is also low. In most TCP communication scenarios, long connections are used with an asynchronous full-duplex TCP communication model, meaning all communications are entirely asynchronous. In this scenario, the `gtcp.Conn` connection object may be involved in multiple read and write operations simultaneously (the data read and write operations of `gtcp.Conn` objects are concurrency-safe). Therefore, the `SendRecv` operation would logically be ineffective because after sending data in the same logical operation, immediately getting data might result in the outcome of other write operations.

Both the server and client need to encapsulate the use of `Recv*` methods to get data and handle it with `switch...case...` in an independent asynchronous loop (only one goroutine is fully responsible for reading data). The business logic is then forwarded based on the request data.

> That is, `Send*/Recv*` methods are concurrency-safe, but data should be sent in one go. Since asynchronous concurrent writing is supported, the `gtcp.Conn` object does not implement any buffering.

## Usage Example

Let's illustrate how to implement asynchronous full-duplex communication in a program with a complete example. The complete example code can be found at: [gtcp common operations example](https://github.com/gogf/gf/v2/tree/master/.example/net/gtcp/pkg_operations/common).

### types/types.go

Define the communication data format, after which we can use `SendPkg/RecvPkg` methods for communication.

To simplify the complexity of the test code, `JSON` data format is used to transmit data. In scenarios where message packet sizes are strictly controlled, the `data` field can be customarily encapsulated and parsed according to binary design. Additionally, it's worth noting that even when using `JSON` data format, the `Act` field is often defined with constants, and in most cases, a `uint8` type is sufficient to reduce the message packet size. For demonstration purposes, this example will be somewhat lazy and use strings directly.

```go
package types

type Msg struct {
    Act  string // Action
    Data string // Data
}
```

### funcs/funcs.go

Define custom data format sending and receiving for easy data structure encoding/decoding.

```go
package funcs

import (
    "encoding/json"
    "fmt"
    "github.com/gogf/gf/v2/net/gtcp"
    "github.com/gogf/gf/.example/net/gtcp/pkg_operations/common/types"
)

// Custom format sending message package
func SendPkg(conn *gtcp.Conn, act string, data ...string) error {
    s := ""
    if len(data) > 0 {
        s = data[0]
    }
    msg, err := json.Marshal(types.Msg{
        Act  : act,
        Data : s,
    })
    if err != nil {
        panic(err)
    }
    return conn.SendPkg(msg)
}

// Custom format receiving message package
func RecvPkg(conn *gtcp.Conn) (msg *types.Msg, err error) {
    if data, err := conn.RecvPkg(); err != nil {
        return nil, err
    } else {
        msg = &types.Msg{}
        err = json.Unmarshal(data, msg)
        if err != nil {
            return nil, fmt.Errorf("invalid package structure: %s", err.Error())
        }
        return msg, err
    }
}
```

### gtcp_common_server.go

The communication server. In this example, the server does not actively disconnect but sends a `doexit` message to the client after `10 seconds`, notifying the client to actively disconnect and end the example.

```go
package main

import (
    "github.com/gogf/gf/v2/net/gtcp"
    "github.com/gogf/gf/v2/os/glog"
    "github.com/gogf/gf/v2/os/gtimer"
    "github.com/gogf/gf/.example/net/gtcp/pkg_operations/common/funcs"
    "github.com/gogf/gf/.example/net/gtcp/pkg_operations/common/types"
    "time"
)

func main() {
    gtcp.NewServer("127.0.0.1:8999", func(conn *gtcp.Conn) {
        defer conn.Close()
        // Test message, let the client exit actively after 10 seconds
        gtimer.SetTimeout(10*time.Second, func() {
            funcs.SendPkg(conn, "doexit")
        })
        for {
            msg, err := funcs.RecvPkg(conn)
            if err != nil {
                if err.Error() == "EOF" {
                    glog.Println("client closed")
                }
                break
            }
            switch msg.Act {
                case "hello":     onClientHello(conn, msg)
                case "heartbeat": onClientHeartBeat(conn, msg)
                default:
                    glog.Errorf("invalid message: %v", msg)
                    break
            }
        }
    }).Run()
}

func onClientHello(conn *gtcp.Conn, msg *types.Msg) {
    glog.Printf("hello message from [%s]: %s", conn.RemoteAddr().String(), msg.Data)
    funcs.SendPkg(conn, msg.Act, "Nice to meet you!")
}

func onClientHeartBeat(conn *gtcp.Conn, msg *types.Msg) {
    glog.Printf("heartbeat from [%s]", conn.RemoteAddr().String())
}
```

### gtcp_common_client.go

The communication client. You can see that the code structure is similar to the server. Data acquisition is independently placed in a for loop, and each business logic sends a message package directly using the `SendPkg` method.

Heartbeat messages are commonly implemented using `gtimer` timers. In this example, the client sends a heartbeat message to the server every second and sends a `hello` test message after 3 seconds. All of these are implemented with `gtimer` timers, which are quite common in TCP communication.

After the client is connected for 10 seconds, the server sends a `doexit` message to the client, which then actively disconnects, ending the long connection.

```go
package main

import (
    "github.com/gogf/gf/v2/net/gtcp"
    "github.com/gogf/gf/v2/os/glog"
    "github.com/gogf/gf/v2/os/gtimer"
    "github.com/gogf/gf/.example/net/gtcp/pkg_operations/common/funcs"
    "github.com/gogf/gf/.example/net/gtcp/pkg_operations/common/types"
    "time"
)

func main() {
    conn, err := gtcp.NewConn("127.0.0.1:8999")
    if err != nil {
        panic(err)
    }
    defer conn.Close()
    // Heartbeat message
    gtimer.SetInterval(time.Second, func() {
        if err := funcs.SendPkg(conn, "heartbeat"); err != nil {
            panic(err)
        }
    })
    // Test message, send hello message to the server after 3 seconds
    gtimer.SetTimeout(3*time.Second, func() {
        if err := funcs.SendPkg(conn, "hello", "My name's John!"); err != nil {
            panic(err)
        }
    })
    for {
        msg, err := funcs.RecvPkg(conn)
        if err != nil {
            if err.Error() == "EOF" {
                glog.Println("server closed")
            }
            break
        }
        switch msg.Act {
            case "hello":     onServerHello(conn, msg)
            case "doexit":    onServerDoExit(conn, msg)
            case "heartbeat": onServerHeartBeat(conn, msg)
            default:
                glog.Errorf("invalid message: %v", msg)
                break
        }
    }
}

func onServerHello(conn *gtcp.Conn, msg *types.Msg) {
    glog.Printf("hello response message from [%s]: %s", conn.RemoteAddr().String(), msg.Data)
}

func onServerHeartBeat(conn *gtcp.Conn, msg *types.Msg) {
    glog.Printf("heartbeat from [%s]", conn.RemoteAddr().String())
}

func onServerDoExit(conn *gtcp.Conn, msg *types.Msg) {
    glog.Printf("exit command from [%s]", conn.RemoteAddr().String())
    conn.Close()
}
```

### Execution Results

#### Server Output

```bash
2019-05-03 14:59:13.732 heartbeat from [127.0.0.1:51220]
2019-05-03 14:59:14.732 heartbeat from [127.0.0.1:51220]
2019-05-03 14:59:15.733 heartbeat from [127.0.0.1:51220]
2019-05-03 14:59:15.733 hello message from [127.0.0.1:51220]: My name's John!
2019-05-03 14:59:16.731 heartbeat from [127.0.0.1:51220]
2019-05-03 14:59:17.733 heartbeat from [127.0.0.1:51220]
2019-05-03 14:59:18.731 heartbeat from [127.0.0.1:51220]
2019-05-03 14:59:19.730 heartbeat from [127.0.0.1:51220]
2019-05-03 14:59:20.732 heartbeat from [127.0.0.1:51220]
2019-05-03 14:59:21.732 heartbeat from [127.0.0.1:51220]
2019-05-03 14:59:22.698 client closed
```

#### Client Output

```bash
2019-05-03 14:59:15.733 hello response message from [127.0.0.1:8999]: Nice to meet you!
2019-05-03 14:59:22.698 exit command from [127.0.0.1:8999]
```
