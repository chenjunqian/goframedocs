# TCP Components

The `gtcp` module implements a simple, easy-to-use, lightweight TCP server.

## Usage

To use the `gtcp` module, import it with the following statement:

```go
import "github.com/gogf/gf/v2/net/gtcp"
```

For detailed API documentation, visit: [gtcp Package](https://pkg.go.dev/github.com/gogf/gf/v2/net/gtcp)

```go
type Server
    func GetServer(name ...interface{}) *Server
    func NewServer(address string, handler func(*Conn), name ...string) *Server
    func NewServerKeyCrt(address, crtFile, keyFile string, handler func(*Conn), name ...string) *Server
    func NewServerTLS(address string, tlsConfig *tls.Config, handler func(*Conn), name ...string) *Server
    func (s *Server) Close() error
    func (s *Server) Run() (err error)
    func (s *Server) SetAddress(address string)
    func (s *Server) SetHandler(handler func(*Conn))
    func (s *Server) SetTLSConfig(tlsConfig *tls.Config)
    func (s *Server) SetTLSKeyCrt(crtFile, keyFile string) error
```

## Example: Simple Echo Server

Here's an example of how to implement a simple echo server using `gtcp`:

```go
package main

import (
    "fmt"
    "github.com/gogf/gf/v2/net/gtcp"
)

func main() {
    gtcp.NewServer("127.0.0.1:8999", func(conn *gtcp.Conn) {
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
}
```

In this example, we use `Send` and `Recv` to send and receive data. The `Recv` method receives data in a blocking manner until the client "sends a complete piece of data" (performs a `Send`, with the underlying socket communication being unbuffered) or closes the connection.

## Testing with Telnet

After running the server, you can test it using the `telnet` tool:

```bash
john@home:~$ telnet 127.0.0.1 8999
Trying 127.0.0.1...
Connected to 127.0.0.1.
Escape character is '^]'.
hello
> hello
hi there
> hi there
```

Each TCP connection initiated by a client is handled by creating a new goroutine in the TCP server, which continues until the TCP connection is closed. Since goroutines are relatively lightweight, this allows the server to support a high level of concurrency.
