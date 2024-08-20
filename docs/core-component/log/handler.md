# Log - Handler

Starting from version `v2.0`, the `glog` component offers a highly powerful and customizable log handling feature through `Handler`. The `Handler` is designed using a middleware approach, allowing developers to register multiple processing `Handler` for the log object, and also override the default log component processing logic within the `Handler`.

## Definition

### Handler Definition

```go
// Handler is function handler for custom logging content outputs.
type Handler func(ctx context.Context, in *HandlerInput)
```

You can see that the second parameter is the log information for log processing, and it is of pointer type, which means that any property information of this parameter can be modified within the `Handler`, and the modified content will be passed to the next `Handler`.

### Handler Input Definition

```go
// HandlerInput is the input parameter struct for logging Handler.
type HandlerInput struct {
    Logger      *Logger       // Current Logger object.
    Buffer      *bytes.Buffer // Buffer for logging content outputs.
    Time        time.Time     // Logging time, which is the time that logging triggers.
    TimeFormat  string        // Formatted time string, like "2016-01-09 12:00:00".
    Color       int           // Using color, like COLOR_RED, COLOR_BLUE, etc. Eg: 34
    Level       int           // Using level, like LEVEL_INFO, LEVEL_ERRO, etc. Eg: 256
    LevelFormat string        // Formatted level string, like "DEBU", "ERRO", etc. Eg: ERRO
    CallerFunc  string        // The source function name that calls logging, only available if F_CALLER_FN set.
    CallerPath  string        // The source file path and its line number that calls logging, only available if F_FILE_SHORT or F_FILE_LONG set.
    CtxStr      string        // The retrieved context value string from context, only available if Config.CtxKeys configured.
    TraceId     string        // Trace id, only available if OpenTelemetry is enabled.
    Prefix      string        // Custom prefix string for logging content.
    Content     string        // Content is the main logging content without error stack string produced by logger.
    Values      []any         // The passed un-formatted values array to logger.
    Stack       string        // Stack string produced by logger, only available if Config.StStatus configured.
    IsAsync     bool          // IsAsync marks it is in asynchronous logging.
}
```

Developers have two ways to customize log output content through `Handler`:

- One is to directly modify the property information in `HandlerInput` and then continue to execute in.Next(). The default log output logic will print the properties in `HandlerInput` as a string output.

- The other is to write the log content into the `Buffer` buffer object. The default log output logic will ignore the default log output logic if it finds that the `Buffer` already contains log content.

### Register Handler

```go
// SetHandlers sets the logging handlers for current logger.
func (l *Logger) SetHandlers(handlers ...Handler)
```

## Example

### Output `JSON` Format

```go
package main

import (
    "context"
    "encoding/json"
    "os"

    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/os/glog"
    "github.com/gogf/gf/v2/text/gstr"
)

// JsonOutputsForLogger is for JSON marshaling in sequence.
type JsonOutputsForLogger struct {
    Time    string `json:"time"`
    Level   string `json:"level"`
    Content string `json:"content"`
}

// LoggingJsonHandler is a example handler for logging JSON format content.
var LoggingJsonHandler glog.Handler = func(ctx context.Context, in *glog.HandlerInput) {
    jsonForLogger := JsonOutputsForLogger{
        Time:    in.TimeFormat,
        Level:   gstr.Trim(in.LevelFormat, "[]"),
        Content: gstr.Trim(in.Content),
    }
    jsonBytes, err := json.Marshal(jsonForLogger)
    if err != nil {
        _, _ = os.Stderr.WriteString(err.Error())
        return
    }
    in.Buffer.Write(jsonBytes)
    in.Buffer.WriteString("\n")
    in.Next(ctx)
}

func main() {
    g.Log().SetHandlers(LoggingJsonHandler)
    ctx := context.TODO()
    g.Log().Debug(ctx, "Debugging...")
    g.Log().Warning(ctx, "It is warning info")
    g.Log().Error(ctx, "Error occurs, please have a check")
}
```

We can see that we can control the output log content through the `Buffer` property in the `Handler`. If the `Buffer` content is empty after all the pre-handler middleware `Handler` have processed, then continuing to execute `Next` will proceed with the default `Handler` logic of the log middleware. After executing the code in this example, the terminal output is:

```bash
{"time":"2024-7-31 11:03:25.438","level":"DEBU","content":"Debugging..."}
{"time":"2024-7-31 11:03:25.438","level":"WARN","content":"It is warning info"}
{"time":"2024-7-31 11:03:25.438","level":"ERRO","content":"Error occurs, please have a check \nStack:\n1.  main.main\n    /User/goframe/test/main.go:42"}
```

### Write to third-party log service

In this example, we have adopted a post-middleware design, using a custom `Handler` to output a copy of the log content to a third-party `graylog` log collection service without affecting the original log output processing.

> `Graylog` is a centralized log management solution that can be compared with `ELK`, supporting data collection, search, and visualization of `Dashboard`. In this example, a simple third-party `graylog` client component is used.

```go
package main

import (
    "context"

    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/os/glog"
    gelf "github.com/robertkowalski/graylog-golang"
)

var grayLogClient = gelf.New(gelf.Config{
    GraylogPort:     80,
    GraylogHostname: "graylog-host.com",
    Connection:      "wan",
    MaxChunkSizeWan: 42,
    MaxChunkSizeLan: 1337,
})

// LoggingGrayLogHandler is an example handler for logging content to remote GrayLog service.
var LoggingGrayLogHandler glog.Handler = func(ctx context.Context, in *glog.HandlerInput) {
    in.Next()
    grayLogClient.Log(in.Buffer.String())
}

func main() {
    g.Log().SetHandlers(LoggingGrayLogHandler)
    ctx := context.TODO()
    g.Log().Debug(ctx, "Debugging...")
    g.Log().Warning(ctx, "It is warning info")
    g.Log().Error(ctx, "Error occurs, please have a check")
    glog.Print(ctx, "test log")
}
```

### Default Hanlder

The log object defaults to having no `Handler` set. Starting from version v`2.1`, the framework provides the functionality to set a global default `Handler`. The global default `Handler` will take effect for all uses of the log component that do not have a custom `Handler`, and it will also affect the log printing behavior of the package's methods.

Developers can set and retrieve the global default `Handler` through the following two methods.

```go
// SetDefaultHandler sets default handler for package.
func SetDefaultHandler(handler Handler)

// GetDefaultHandler returns the default handler of package.
func GetDefaultHandler() Handler
```

It should be noted that this method of global package configuration is not concurrency-safe and is often required to be executed at the very top of the project's startup logic.

**Usage example**:

We output all log messages in our project in `JSON` format to ensure that the log content is structured and each log output is a single line, which facilitates log collection by the log collector:

```go
package main

import (
    "context"
    "encoding/json"
    "os"

    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/os/glog"
    "github.com/gogf/gf/v2/text/gstr"
)

// JsonOutputsForLogger is for JSON marshaling in sequence.
type JsonOutputsForLogger struct {
    Time    string `json:"time"`
    Level   string `json:"level"`
    Content string `json:"content"`
}

// LoggingJsonHandler is a example handler for logging JSON format content.
var LoggingJsonHandler glog.Handler = func(ctx context.Context, in *glog.HandlerInput) {
    jsonForLogger := JsonOutputsForLogger{
        Time:    in.TimeFormat,
        Level:   gstr.Trim(in.LevelFormat, "[]"),
        Content: gstr.Trim(in.Content),
    }
    jsonBytes, err := json.Marshal(jsonForLogger)
    if err != nil {
        _, _ = os.Stderr.WriteString(err.Error())
        return
    }
    in.Buffer.Write(jsonBytes)
    in.Buffer.WriteString("\n")
    in.Next(ctx)
}

func main() {
    ctx := context.TODO()
    glog.SetDefaultHandler(LoggingJsonHandler)

    g.Log().Debug(ctx, "Debugging...")
    glog.Warning(ctx, "It is warning info")
    glog.Error(ctx, "Error occurs, please have a check")
}
```

Output:

```bash
{"time":"2022-06-20 10:51:50.235","level":"DEBU","content":"Debugging..."}
{"time":"2022-06-20 10:51:50.235","level":"WARN","content":"It is warning info"}
{"time":"2022-06-20 10:51:50.235","level":"ERRO","content":"Error occurs, please have a check"}
```

### Handler Component

`goframe` also provide some common log `Hanlder`.

**`HandlerJson`**

This `Handler` will convert log content to `JSON` format.

```go
package main

import (
    "context"

    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/os/glog"
)

func main() {
    ctx := context.TODO()
    glog.SetDefaultHandler(glog.HandlerJson)

    g.Log().Debug(ctx, "Debugging...")
    glog.Warning(ctx, "It is warning info")
    glog.Error(ctx, "Error occurs, please have a check")
}
```

Output:

```bash
{"Time":"2022-06-20 20:04:04.725","Level":"DEBU","Content":"Debugging..."}
{"Time":"2022-06-20 20:04:04.725","Level":"WARN","Content":"It is warning info"}
{"Time":"2022-06-20 20:04:04.725","Level":"ERRO","Content":"Error occurs, please have a check","Stack":"1.  main.main\n    /Users/goframe/Workspace/Go/GOPATH/src/github.com/gogf/gf/.test/main.go:16\n"}
```

**`HandlerStructure`**

The `Handler` can convert log content into a structured format for printing, mainly to keep consistent with the `slog` log output of the newer versions of `Golang`. It should be noted that the feature of structured log printing is more meaningful if all log records are output in a structured manner.

**Usage example**:

```go
package main

import (
    "context"
    "net"

    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/os/glog"
)

func main() {
    ctx := context.TODO()
    glog.SetDefaultHandler(glog.HandlerStructure)

    g.Log().Info(ctx, "caution", "name", "admin")
    glog.Error(ctx, "oops", net.ErrClosed, "status", 500)
}
```

Output:

```bash
Time="2023-11-23 21:00:08.671" Level=INFO Content=caution name=admin
Time="2023-11-23 21:00:08.671" Level=ERRO oops="use of closed network connection" status=500 Stack="1.  main.main\n    /Users/goframe/Workspace/gogf/gf/example/.test/main.go:16\n"
```
