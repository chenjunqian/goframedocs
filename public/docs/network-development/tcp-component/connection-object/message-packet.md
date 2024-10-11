# TCP Component - Message Packet Handling

The `gtcp` module provides many convenient methods for native operations on connection data. However, in the majority of application scenarios, developers need to design their own data structures and handle packet encapsulation/decapsulation. Due to the lack of message boundary protection in TCP messaging protocols, complex network communication environments can easily lead to packet sticking issues. Therefore, `gtcp` also offers a simple data protocol to facilitate message packet interaction, sparing developers from worrying about the details of packet handling, including encapsulation/decapsulation—gtcp has already taken care of these complex logics for you.

## Simple Protocol

The `gtcp` module provides a lightweight and efficient data interaction protocol. The protocol format is as follows:

```bash
Data Length (16 bits) | Data Field (variable length)
```

- Data Length: Defaults to `16 bits` (`2 bytes`), used to indicate the length of the message body in bytes, excluding its own 2 bytes.
- Data Field: Variable length. As indicated by the data length, the maximum data size cannot exceed `0xFFFF = 65535 bytes = 64 KB`.

The simple protocol is encapsulated and implemented by `gtcp`. If both the client and server in a communication use the `gtcp` module, there is no need to concern oneself with the protocol implementation; one can focus solely on the encapsulation and parsing of the `data` fields. In cases of interfacing with other development languages, it is necessary to implement the protocol accordingly. Due to the simplicity and lightweight nature of the simple protocol, the cost of interfacing is very low.

> The data field can also be empty, meaning there is no length.

For more details, refer to the [gtcp package documentation](https://pkg.go.dev/github.com/gogf/gf/v2/net/gtcp).

## Methods

```go
type Conn
    func (c *Conn) SendPkg(data []byte, option ...PkgOption) error
    func (c *Conn) SendPkgWithTimeout(data []byte, timeout time.Duration, option ...PkgOption) error
    func (c *Conn) SendRecvPkg(data []byte, option ...PkgOption) ([]byte, error)
    func (c *Conn) SendRecvPkgWithTimeout(data []byte, timeout time.Duration, option ...PkgOption) ([]byte, error)
    func (c *Conn) RecvPkg(option ...PkgOption) (result []byte, err error)
    func (c *Conn) RecvPkgWithTimeout(timeout time.Duration, option ...PkgOption) ([]byte, error)
```

The message packet methods are named with the `Pkg` keyword added to the original basic connection operation methods for easy distinction.

The `PkgOption` structure is used to define message packet reception strategies:

```go
// Data reading options
type PkgOption struct {
    HeaderSize  int   // Custom header size (default is 2 bytes, maximum cannot exceed 4 bytes)
    MaxDataSize int   // (byte) Maximum packet size for data reading, default maximum cannot exceed 2 bytes (65535 byte)
    Retry       Retry // Retry policy on failure
}
```

## Usage Examples

### Example 1: Basic Usage

```go
package main

import (
    "fmt"
    "github.com/gogf/gf/v2/net/gtcp"
    "github.com/gogf/gf/v2/os/glog"
    "github.com/gogf/gf/v2/util/gconv"
    "time"
)

func main() {
    // Server
    go gtcp.NewServer("127.0.0.1:8999", func(conn *gtcp.Conn) {
        defer conn.Close()
        for {
            data, err := conn.RecvPkg()
            if err != nil {
                fmt.Println(err)
                break
            }
            fmt.Println("receive:", data)
        }
    }).Run()

    time.Sleep(time.Second)

    // Client
    conn, err := gtcp.NewConn("127.0.0.1:8999")
    if err != nil {
        panic(err)
    }
    defer conn.Close()
    for i := 0; i < 10000; i++ {
        if err := conn.SendPkg([]byte(gconv.String(i))); err != nil {
        glog.Error(err)
        }
        time.Sleep(1 * time.Second)
    }
}
```

This example is quite simple. After execution, the output will be:

```bash
receive: [48]
receive: [49]
receive: [50]
receive: [51]
...
```

### Example 2: Custom Data Structure

In most scenarios, we need to define custom data structures for the messages we send. Developers can use the data field to pass any message content they wish.

Below is a simple example of a custom data structure used for a client to report the current host node's memory and CPU usage. In this example, the data field uses JSON format for customization, facilitating the encoding/decoding of data.

In practical applications, developers often need to define their own packet parsing protocols or use more common protocols like protobuf binary packages for encapsulation/parsing.

***types/types.go***

Data structure definition.

```go
package types

import "github.com/gogf/gf/v2/frame/g"

type NodeInfo struct {
    Cpu       float32 // CPU percentage (%)
    Host      string  // Hostname
    Ip        g.Map   // IP address information (potentially multiple)
    MemUsed   int     // Memory used (in bytes)
    MemTotal  int     // Total memory (in bytes)
    Time      int     // Reporting time (timestamp)
}
```

***gtcp_monitor_server.go***

Server side.

```go
package main

import (
    "encoding/json"
    "github.com/gogf/gf/v2/net/gtcp"
    "github.com/gogf/gf/v2/os/glog"
    "github.com/gogf/gf/.example/net/gtcp/pkg_operations/monitor/types"
)

func main() {
    // Server, receives client data and formats it into a specified data structure, then prints it
    gtcp.NewServer("127.0.0.1:8999", func(conn *gtcp.Conn) {
        defer conn.Close()
        for {
            data, err := conn.RecvPkg()
            if err != nil {
                if err.Error() == "EOF" {
                    glog.Println("client closed")
                }
                break
            }
            info := &types.NodeInfo{}
            if err := json.Unmarshal(data, info); err != nil {
                glog.Errorf("invalid package structure: %s", err.Error())
            } else {
                glog.Println(info)
                conn.SendPkg([]byte("ok"))
            }
        }
    }).Run()
}
```

***gtcp_monitor_client.go***

Client side.

```go
package main

import (
    "encoding/json"
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/net/gtcp"
    "github.com/gogf/gf/v2/os/glog"
    "github.com/gogf/gf/v2/os/gtime"
    "github.com/gogf/gf/.example/net/gtcp/pkg_operations/monitor/types"
)

func main() {
    // Data reporting client
    conn, err := gtcp.NewConn("127.0.0.1:8999")
    if err != nil {
        panic(err)
    }
    defer conn.Close()
    // Using JSON to format the data field
    info, err := json.Marshal(types.NodeInfo{
        Cpu       : float32(66.66),
        Host      : "localhost",
        Ip        : g.Map {
            "etho" : "192.168.1.100",
            "eth1" : "114.114.10.11",
        },
        MemUsed   : 15560320,
        MemTotal  : 16333788,
        Time      : int(gtime.Timestamp()),
    })
    if err != nil {
        panic(err)
    }
    // Using SendRecvPkg to send message packets and receive responses
    if result, err := conn.SendRecvPkg(info); err != nil {
        if err.Error() == "EOF" {
            glog.Println("server closed")
        }
    } else {
        glog.Println(string(result))
    }
}
```

After execution:

The client output will be:

```bash
2019-05-03 13:33:25.710 ok
```

The server output will be:

```bash
2019-05-03 13:33:25.710 &{66.66 localhost map[eth1:114.114.10.11 etho:192.168.1.100] 15560320 16333788 1556861605}
2019-05-03 13:33:25.710 client closed
```
