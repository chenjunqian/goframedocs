# Log - Level

## Log Level

Log levels are used to manage the output of logs. We can turn on or off specific log content by setting specific log levels. The log level setting can be achieved through two methods:

```go
func (l *Logger) SetLevel(level int)
func (l *Logger) SetLevelStr(levelStr string) error
func (l *Logger) SetLevelPrint(enabled bool)
```

## SetLevel

Use `SetLevel` to set the log level of current Logger object, `glog` module supports the following log levels constants:

```text
LEVEL_ALL
LEVEL_DEV
LEVEL_PROD
LEVEL_DEBU
LEVEL_INFO
LEVEL_NOTI
LEVEL_WARN
LEVEL_ERRO
```

We can combine these levels using `bitwise operations`. For example, `LEVEL_ALL` is equivalent to `LEVEL_DEBU | LEVEL_INFO | LEVEL_NOTI | LEVEL_WARN | LEVEL_ERRO | LEVEL_CRIT`. We can also filter out `LEVEL_DEBU/LEVEL_INFO/LEVEL_NOTI` log content using `LEVEL_ALL & ^LEVEL_DEBU & ^LEVEL_INFO & ^LEVEL_NOTI`.

There are other levels in the log module, such as `CRIT/PANI/FATA`, but these levels represent very serious errors and cannot be customarily disabled by developers in the log level settings. For instance, when a severe error occurs, the `PANI/FATA` error level will trigger additional system actions: `panic/exit`.

Example:

```go
package main

import (
    "context"

    "github.com/gogf/gf/v2/os/glog"
)

func main() {
    ctx := context.TODO()
    l := glog.New()
    l.Info(ctx, "info1")
    l.SetLevel(glog.LEVEL_ALL ^ glog.LEVEL_INFO)
    l.Info(ctx, "info2")
}

```

Output:

```bash
2021-12-31 11:16:57.272 [INFO] info1
```

## SetLevelStr

Use `SetLevelStr` to set the log level of current Logger object by string, case-insensitive.

```yaml
"ALL":      LEVEL_DEBU | LEVEL_INFO | LEVEL_NOTI | LEVEL_WARN | LEVEL_ERRO | LEVEL_CRIT,
"DEV":      LEVEL_DEBU | LEVEL_INFO | LEVEL_NOTI | LEVEL_WARN | LEVEL_ERRO | LEVEL_CRIT,
"DEVELOP":  LEVEL_DEBU | LEVEL_INFO | LEVEL_NOTI | LEVEL_WARN | LEVEL_ERRO | LEVEL_CRIT,
"PROD":     LEVEL_WARN | LEVEL_ERRO | LEVEL_CRIT,
"PRODUCT":  LEVEL_WARN | LEVEL_ERRO | LEVEL_CRIT,
"DEBU":     LEVEL_DEBU | LEVEL_INFO | LEVEL_NOTI | LEVEL_WARN | LEVEL_ERRO | LEVEL_CRIT,
"DEBUG":    LEVEL_DEBU | LEVEL_INFO | LEVEL_NOTI | LEVEL_WARN | LEVEL_ERRO | LEVEL_CRIT,
"INFO":     LEVEL_INFO | LEVEL_NOTI | LEVEL_WARN | LEVEL_ERRO | LEVEL_CRIT,
"NOTI":     LEVEL_NOTI | LEVEL_WARN | LEVEL_ERRO | LEVEL_CRIT,
"NOTICE":   LEVEL_NOTI | LEVEL_WARN | LEVEL_ERRO | LEVEL_CRIT,
"WARN":     LEVEL_WARN | LEVEL_ERRO | LEVEL_CRIT,
"WARNING":  LEVEL_WARN | LEVEL_ERRO | LEVEL_CRIT,
"ERRO":     LEVEL_ERRO | LEVEL_CRIT,
"ERROR":    LEVEL_ERRO | LEVEL_CRIT,
"CRIT":     LEVEL_CRIT,
"CRITICAL": LEVEL_CRIT,
```

The level name is base on the log level descending order: `DEBU` < `INFO` < `NOTI` < `WARN` < `ERRO` < `CRIT`, and also support common deployment mode configuration names such as `ALL`, `DEV`, `PROD`.

Example:

```go
package main

import (
    "context"

    "github.com/gogf/gf/v2/os/glog"
)

func main() {
    ctx := context.TODO()
    l := glog.New()
    l.Info(ctx, "info1")
    l.SetLevelStr("notice")
    l.Info(ctx, "info2")
}

```

Output:

```bash
2021-12-31 11:20:15.019 [INFO] info1
```

## SetLevelPrint

Use `SetLevelPrint` to enable or disable the log level print feature.

```go
package main

import (
    "context"

    "github.com/gogf/gf/v2/os/glog"
)

func main() {
    ctx := context.TODO()
    l := glog.New()
    l.Info(ctx, "info1")
    l.SetLevelPrint(false)
    l.Info(ctx, "info2")
}

```

Output:

```bash
2023-03-14 10:28:18.598 [INFO] info1
2023-03-14 10:28:18.631 info1
```

## Level Name

By default the level name will print in the log. The default log level name print in log:

```yaml
LEVEL_DEBU: "DEBU",
LEVEL_INFO: "INFO",
LEVEL_NOTI: "NOTI",
LEVEL_WARN: "WARN",
LEVEL_ERRO: "ERRO",
LEVEL_CRIT: "CRIT",
LEVEL_PANI: "PANI",
LEVEL_FATA: "FATA",
```

For the unified log format, log level is the first 4 characters of the log level name. If you want to change the log level name, you can use following functions:

```go
func (l *Logger) SetLevelPrefix(level int, prefix string)
func (l *Logger) SetLevelPrefixes(prefixes map[int]string)
```

Example:

```go
package main

import (
    "context"

    "github.com/gogf/gf/v2/os/glog"
)

func main() {
    ctx := context.TODO()
    l := glog.New()
    l.SetLevelPrefix(glog.LEVEL_DEBU, "debug")
    l.Debug(ctx, "test")
}

```

Output:

```bash
2021-12-31 11:21:45.754 [debug] test
```
