# Log - Writer

`Writer` interface is the most basic `IO` write interface. If you need to customize the log content printing for your business, it is recommended to use the `Handler` feature. For details, refer to the section: [Log - Handler](https://temperory.net).

## Customize Writer

`glog` module implements the printing of log content for standard output and file output. We can also implement custom log content output through the custom `io.Writer` interface. The `io.Writer` is a content output interface provided by the standard library, and its definition is as follows:

```go
type Writer interface {
    Write(p []byte) (n int, err error)
}
```

We can implement custom `Writer` output through the `SetWriter` method or the chained method `To`. We can implement defined operations in this `Writer` and can also integrate other module functions within it.

In addition, the `glog.Logger` has implemented the `io.Writer` interface, making it very convenient for us to integrate glog into other modules.

## Implement

In this case, we define a custom `Writer`: `MyWriter`, and if the error content `PANI` or `FATA`, it will make a `http` call to notify the `Monitor` service. The log will also be printed to the standard output and log file.

```go
package main

import (
    "context"
    "fmt"

    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/net/ghttp"
    "github.com/gogf/gf/v2/os/glog"
    "github.com/gogf/gf/v2/text/gregex"
)

type MyWriter struct {
    logger *glog.Logger
}

func (w *MyWriter) Write(p []byte) (n int, err error) {
    var (
        s   = string(p)
        ctx = context.Background()
    )
    if gregex.IsMatchString(`PANI|FATA`, s) {
        fmt.Println("SERIOUS ISSUE OCCURRED!! I'd better tell monitor in first time!")
        g.Client().PostContent(ctx, "http://monitor.mydomain.com", s)
    }
    return w.logger.Write(p)
}

func main() {
    var ctx = context.Background()
    glog.SetWriter(&MyWriter{
        logger: glog.New(),
    })
    glog.Fatal(ctx, "FATAL ERROR")
}
```

Output:

```bash
SERIOUS ISSUE OCCURRED!! I'd better tell monitor in first time!
2019-05-23 20:14:49.374 [FATA] FATAL ERROR
Stack:
1. /Users/goframe/Workspace/Go/GOPATH/src/github.com/gogf/gf/v2/geg/os/glog/glog_writer_hook.go:27
```

## `Graylog` Example

If we need to print the log to standard output and log file, and also need to output to the `Graylog` server, we can implement the following `Writer`:

```go
package main

import (
    "context"

    "github.com/gogf/gf/v2/os/glog"
    "github.com/robertkowalski/graylog-golang"
)

type MyGrayLogWriter struct {
    gelf    *gelf.Gelf
    logger  *glog.Logger
}

func (w *MyGrayLogWriter) Write(p []byte) (n int, err error) {
    w.gelf.Send(p)
    return w.logger.Write(p)
}

func main() {
    var ctx = context.Background()
    glog.SetWriter(&MyGrayLogWriter{
        logger : glog.New(),
        gelf   : gelf.New(gelf.Config{
            GraylogPort     : 80,
            GraylogHostname : "graylog-host.com",
            Connection      : "wan",
            MaxChunkSizeWan : 42,
            MaxChunkSizeLan : 1337,
        }),
    })
    glog.Println(ctx, "test log")
}
```
