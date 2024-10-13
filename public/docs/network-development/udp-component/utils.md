# UDP Component - Utility Methods

The `gudp` module also provides several commonly used utility methods.

## Usage

```go
import "github.com/gogf/gf/v2/net/gudp"
```

For more details, refer to the [gudp package documentation](https://pkg.go.dev/github.com/gogf/gf/v2/net/gudp).

## Utility Methods

```go
func Checksum(buffer []byte) uint32
func NewNetConn(raddr string, laddr ...string) (*net.UDPConn, error)
func Send(addr string, data []byte, retry ...Retry) error
func SendPkg(addr string, data []byte, retry ...Retry) error
func SendPkgWithTimeout(addr string, data []byte, timeout time.Duration, retry ...Retry) error
func SendRecv(addr string, data []byte, receive int, retry ...Retry) ([]byte, error)
func SendRecvPkg(addr string, data []byte, retry ...Retry) ([]byte, error)
func SendRecvPkgWithTimeout(addr string, data []byte, timeout time.Duration, retry ...Retry) ([]byte, error)
```

The utility methods provided by `gudp` are relatively straightforward.

- Among them, `NewNetConn` is used to create a `net.UDPConn` object for standard library UDP communication.

- `Send` and `SendRecv` are used for direct UDP communication with a UDP server address, for writing and reading data.

- `*Pkg` methods are used for simple packet protocol data transfer.
