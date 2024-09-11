# Log - Debug Info

`Debug/Debugf` are very useful methods for recording debugging information, commonly used in development and testing environments. After the application goes live, it can be conveniently enabled or disabled using `SetDebug` or through configuration files.

```go
package main

import (
    "context"
    "time"

    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/os/gtime"
    "github.com/gogf/gf/v2/os/gtimer"
)

func main() {
    ctx := context.TODO()
    gtimer.SetTimeout(ctx, 3*time.Second, func(ctx context.Context) {
        g.Log().SetDebug(false)
    })
    for {
        g.Log().Debug(ctx, gtime.Datetime())
        g.Log().Info(ctx, gtime.Datetime())
        time.Sleep(time.Second)
    }
}
```

Output:

```bash
2022-01-05 15:59:05.674 [DEBU] 2022-01-05 15:59:05
2022-01-05 15:59:05.675 [INFO] 2022-01-05 15:59:05
2022-01-05 15:59:06.684 [DEBU] 2022-01-05 15:59:06
2022-01-05 15:59:06.684 [INFO] 2022-01-05 15:59:06
2022-01-05 15:59:07.692 [DEBU] 2022-01-05 15:59:07
2022-01-05 15:59:07.692 [INFO] 2022-01-05 15:59:07
2022-01-05 15:59:08.708 [INFO] 2022-01-05 15:59:08
2022-01-05 15:59:09.717 [INFO] 2022-01-05 15:59:09
2022-01-05 15:59:10.728 [INFO] 2022-01-05 15:59:10
2022-01-05 15:59:11.733 [INFO] 2022-01-05 15:59:11
```

We can also disable the debug log by using system environment variable or command line arguments.

- Disable debug log by command line startup argument: `gf.glog.debug=false`

- Disable debug log by environment variable: `GF_LOG_DEBUG=false`
