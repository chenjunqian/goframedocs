# UDP Component - Overview

`UDP (User Datagram Protocol)` is a connectionless transport layer protocol that provides a simple, unreliable message transfer service for transaction-oriented applications. The `UDP` server is implemented through `gudp.Server`, while the client is implemented through `gudp.Conn` objects or utility methods.

## Usage

```go
import "github.com/gogf/gf/v2/net/gudp"
```

For more details, refer to the [gudp package documentation](https://pkg.go.dev/github.com/gogf/gf/v2/net/gudp).

## Server Type

```go
type Server
    func GetServer(name ...interface{}) *Server
    func NewServer(address string, handler func(*Conn), names ...string) *Server
    func (s *Server) Close() error
    func (s *Server) Run() error
    func (s *Server) SetAddress(address string)
    func (s *Server) SetHandler(handler func(*Conn))
```

`GetServer` uses a singleton pattern to get or create a `Server` with a unique name. Subsequent properties of the `Server` can be dynamically modified using `SetAddress` and `SetHandler` methods. `NewServer` directly creates a `Server` object based on the given parameters.

## Example

```go
package main

import (
    "fmt"
    "github.com/gogf/gf/v2/net/gudp"
)

func main() {
    gudp.NewServer("127.0.0.1:8999", func(conn *gudp.Conn) {
        defer conn.Close()
        for {
            if data, _ := conn.Recv(-1); len(data) > 0 {
                fmt.Println(string(data))
            }
        }
    }).Run()
}
```

The `UDPServer` runs synchronously; users can handle the content read in a custom callback function concurrently.

In `Linux`, you can use the following command to send `UDP` data to the server for testing and then check if the server has output:

```sh
echo "hello" > /dev/udp/127.0.0.1/8999
