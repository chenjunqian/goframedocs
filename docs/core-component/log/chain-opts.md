# Log - Chain Operations

More defail please refer: <https://pkg.go.dev/github.com/gogf/gf/v2/os/glog>

`glog` supports easy chain operations.

```go
// Redirect Log Output Interface
func To(writer io.Writer) *Logger

// Log Content Output to Directory
func Path(path string) *Logger

// Set Log File Category
func Cat(category string) *Logger

// Set Log File Format
func File(file string) *Logger

// Set Log Print Level
func Level(level int) *Logger

// Set Log Print Level (String)
func LevelStr(levelStr string) *Logger

// Set File Backtrace Value
func Skip(skip int) *Logger

// Enable Trace Print
func Stack(enabled bool) *Logger

// Enable Trace Print with Filter
func StackWithFilter(filter string) *Logger

// Enable Terminal Output
func Stdout(enabled...bool) *Logger

// Output Log Header Information
func Header(enabled...bool) *Logger

// Output Log Call Line Number Information
func Line(long...bool) *Logger

// Asynchronous Log Output
func Async(enabled...bool) *Logger
```

## Basic Usage

```go
package main

import (
    "context"

    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/os/gfile"
)

func main() {
    ctx := context.TODO()
    path := "/tmp/glog-cat"
    g.Log().SetPath(path)
    g.Log().Stdout(false).Cat("cat1").Cat("cat2").Print(ctx, "test")
    list, err := gfile.ScanDir(path, "*", true)
    g.Dump(err)
    g.Dump(list)
}
```

Output:

```bash
null
[
    "/tmp/glog-cat/cat1",
    "/tmp/glog-cat/cat1/cat2",
    "/tmp/glog-cat/cat1/cat2/2024-07-31.log",
]
```

## Print Line Number

```go
package main

import (
    "context"

    "github.com/gogf/gf/v2/frame/g"
)

func main() {
    ctx := context.TODO()
    g.Log().Line().Print(ctx, "this is the short file name with its line number")
    g.Log().Line(true).Print(ctx, "lone file name with line number")
}
```

Output:

```bash
2019-05-23 09:22:58.141 glog_line.go:8: this is the short file name with its line number
2019-05-23 09:22:58.142 /Users/john/Workspace/Go/GOPATH/src/github.com/gogf/gf/.example/os/glog/glog_line.go:9: lone file name with line number
```

## File Backtrace `Skip`

Sometimes we encapsulate the `glog` module to print logs, such as wrapping a `logger` through `logger.Print` to print logs. At this time, the printed calling file line number is always the same location because, for `glog`, its caller is always the `logger.Print` method. In this case, we can set the backtrace value to skip the number of files to backtrace, using `SetStackSkip` or the chained method `Skip` to achieve this.

The setting of the file backtrace value also affects the result of the `Stack` call backtrace print.

```go
package main

import (
    "context"

    "github.com/gogf/gf/v2/frame/g"
)

func PrintLog(ctx context.Context, content string) {
    g.Log().Skip(1).Line().Print(ctx, "line number with skip:", content)
    g.Log().Line().Print(ctx, "line number without skip:", content)
}

func main() {
    ctx := context.TODO()
    PrintLog(ctx, "just test")
}
```

Output:

```bash
2019-05-23 19:30:10.984 glog_line2.go:13: line number with skip: just test
2019-05-23 19:30:10.984 glog_line2.go:9: line number without skip: just test
```
