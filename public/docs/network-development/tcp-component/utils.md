# TCP Component - Utility Methods

The `gtcp` module also provides several commonly used utility methods.

## Usage

```go
import "github.com/gogf/gf/v2/net/gtcp"
```

For more details, refer to the [gtcp package documentation](https://pkg.go.dev/github.com/gogf/gf/v2/net/gtcp).

## Utility Methods

```go
func LoadKeyCrt(crtFile, keyFile string) (*tls.Config, error)
func NewNetConn(addr string, timeout ...int) (net.Conn, error)
func NewNetConnKeyCrt(addr, crtFile, keyFile string) (net.Conn, error)
func NewNetConnTLS(addr string, tlsConfig *tls.Config) (net.Conn, error)
func Send(addr string, data []byte, retry ...Retry) error
func SendPkg(addr string, data []byte, option ...PkgOption) error
func SendPkgWithTimeout(addr string, data []byte, timeout time.Duration, option ...PkgOption) error
func SendRecv(addr string, data []byte, receive int, retry ...Retry) ([]byte, error)
func SendRecvPkg(addr string, data []byte, option ...PkgOption) ([]byte, error)
func SendRecvPkgWithTimeout(addr string, data []byte, timeout time.Duration, option ...PkgOption) ([]byte, error)
func SendRecvWithTimeout(addr string, data []byte, receive int, timeout time.Duration, retry ...Retry) ([]byte, error)
func SendWithTimeout(addr string, data []byte, timeout time.Duration, retry ...Retry) error
```

Sends data to the specified address with a timeout limitation.

Below is a simple example of using these utility methods to access a specified web site:

```go
package main

import (
    "fmt"
    "github.com/gogf/gf/v2/net/gtcp"
)

func main() {
    data, err := gtcp.SendRecv("www.baidu.com:80", []byte("HEAD / HTTP/1.1\n\n"), -1)
    if err != nil {
        panic(err)
    }
    fmt.Println(string(data))
}
```

In this example, we access the Baidu homepage via TCP, simulate an HTTP request header, and obtain the response. After execution, the output will be:

```bash
HTTP/1.1 302 Found
Connection: Keep-Alive
Content-Length: 17931
Content-Type: text/html
Date: Tue, 04 Jun 2019 15:53:09 GMT
Etag: "54d9749e-460b"
Server: bfe/1.0.8.18
```
