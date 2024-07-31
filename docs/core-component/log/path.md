# Log - Path

## File Name Format

By defaul log file named with current date with format `YYY-MM-DD.log`, we can use `SetFile` method to change it.

```go
package main

import (
    "context"

    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/os/gfile"
    "github.com/gogf/gf/v2/os/glog"
)

// set log level
func main() {
    ctx := context.TODO()
    path := "./glog"
    glog.SetPath(path)
    glog.SetStdoutPrint(false)
    // use default log file format
    glog.Print(ctx, "Standard log file name format, current date")
    // By SetFile method change log file format
    glog.SetFile("stdout.log")
    glog.Print(ctx, "set log file output to stdout.log")
    // chain operations set log file name format
    glog.File("stderr.log").Print(ctx, "Support chain operations")
    glog.File("error-{Ymd}.log").Print(ctx, "Support gtime date format")
    glog.File("access-{Ymd}.log").Print(ctx, "Support gtime date format")

    list, err := gfile.ScanDir(path, "*")
    g.Dump(err)
    g.Dump(list)
}
```

Output:

```bash
<nil>
[
    "/home/goframe/test/glog/2024-07-31.log",
    "/home/goframe/test/glog/access-20240731.log",
    "/home/goframe/test/glog/error-20240731.log",
    "/home/goframe/test/glog/stderr.log",
    "/home/goframe/test/glog/stdout.log",
]
```

## Log Path

By default, `glog` will output log content to the standard output (use `SetStdoutPrint(false)` to disable standard output). We can set the log output directory path through the `SetPath` method, so that the log content will be written into log files. Moreover, due to the internal use of `gfpool` for file pointer pooling, the efficiency of file writing is quite excellent. Simple example:

```go
package main

import (
    "context"

    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/os/gfile"
    "github.com/gogf/gf/v2/os/glog"
)

func main() {
    ctx := context.TODO()
    path := "./glog"
    glog.SetPath(path)
    glog.Print(ctx, "log content")
    list, err := gfile.ScanDir(path, "*")
    g.Dump(err)
    g.Dump(list)
}
```

Output:

```bash
2024-07-31 11:32:16.742 log content
<nil>
[
    "/home/goframe/test/glog/2024-07-31.log",
]
```

When use `SetPath` to set the log output path, and the path is not an existing directory, it will be automatically created.
