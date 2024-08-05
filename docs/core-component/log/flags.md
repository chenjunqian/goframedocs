# Log - Flags

`flags` is used to controll some log features.

```bash
F_ASYNC      = 1 << iota // Enable asynchronous log output
F_FILE_LONG             // Print the full absolute path of the calling line number, e.g., /a/b/c/d.go:23
F_FILE_SHORT            // Print only the filename of the calling line number, e.g., d.go:23, overrides F_FILE_LONG
F_TIME_DATE             // Print the current date, e.g., 2009-01-23
F_TIME_TIME             // Print the current time, e.g., 01:23:23
F_TIME_MILLI            // Print the current time with milliseconds, e.g., 01:23:23.675
F_TIME_STD = F_TIME_DATE | F_TIME_MILLI // (Default) Print the current date + time with milliseconds, e.g., 2009-01-23 01:23:23.675

```

## Example

```go
package main

import (
    "context"

    "github.com/gogf/gf/v2/os/glog"
)

func main() {
    ctx := context.TODO()
    l := glog.New()
    l.SetFlags(glog.F_TIME_TIME | glog.F_FILE_SHORT)
    l.Print(ctx, "time and short line number")
    l.SetFlags(glog.F_TIME_MILLI | glog.F_FILE_LONG)
    l.Print(ctx, "time with millisecond and long line number")
    l.SetFlags(glog.F_TIME_STD | glog.F_FILE_LONG)
    l.Print(ctx, "standard time format and long line number")
}

```

Output:

```bash
go run ./main.go
16:05:35 main.go:13: time and short line number
16:05:35.108 /User/goframe/test/main.go:15: time with millisecond and long line number
2022-01-05 16:05:35.109 /User/goframe/test/main.go:17: standard time format and long line number
```
