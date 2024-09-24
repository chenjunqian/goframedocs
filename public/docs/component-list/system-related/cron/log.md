# Cron - Log

`gcron` supports logging functionality, allowing you to set the output file and log levels. By default, only logs with levels `LEVEL_WARN`, `LEVEL_ERROR`, and `LEVEL_CRIT` are output (including logs for scheduled task errors), while runtime logs are recorded at `LEVEL_DEBUG`, which means they are not logged by default. The gcron component uses the unified logging component of the Goframe framework, allowing you to reuse all features of the logging component. Relevant methods include:

```go
func SetLogger(logger glog.ILogger)
func GetLogger() glog.ILogger
```

For features of the logging component, please refer to the **Logging Component** section.

## Usage Example

Here is a simple example demonstrating how to set up logging with gcron:

```go
package main

import (
    "context"
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/os/gcron"
    "github.com/gogf/gf/v2/os/gctx"
    "github.com/gogf/gf/v2/os/glog"
    "time"
)

func main() {
    var (
        err    error
        ctx    = gctx.New()
        logger = glog.New()
    )
    logger.SetLevel(glog.LEVEL_ALL)
    gcron.SetLogger(logger)
    _, err = gcron.Add(ctx, "* * * * * ?", func(ctx context.Context) {
        g.Log().Info(ctx, "test")
    })
    if err != nil {
        panic(err)
    }
    time.Sleep(3 * time.Second)
}
```

***Output***

After executing the code, the terminal output will be:

```bash
2021-11-14 12:22:50.347 [INFO] {189cwi9nsr0cfp7s2n7cixs100os5qxj} test
2021-11-14 12:22:50.347 [DEBU] {189cwi9nsr0cfp7s2n7cixs100os5qxj} [gcron] * * * * * * ? main.main.func1 end
2021-11-14 12:22:51.344 [DEBU] {189cwi9nsr0cfp7s2n7cixs100os5qxj} [gcron] * * * * * * ? main.main.func1 start
2021-11-14 12:22:51.344 [INFO] {189cwi9nsr0cfp7s2n7cixs100os5qxj} test
2021-11-14 12:22:52.347 [DEBU] {189cwi9nsr0cfp7s2n7cixs100os5qxj} [gcron] * * * * * * ? main.main.func1 end
2021-11-14 12:22:52.347 [INFO] {189cwi9nsr0cfp7s2n7cixs100os5qxj} test
2021-11-14 12:22:52.347 [DEBU] {189cwi9nsr0cfp7s2n7cixs100os5qxj} [gcron] * * * * * * ? main.main.func1 end
```
