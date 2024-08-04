# Log - Async

For content that does not require immediate log output, logs can be output asynchronously. Asynchronous output allows the log printing call to return immediately, thus improving efficiency. `glog`, of course, supports asynchronous output features and uses a `goroutine` pool internally to manage asynchronous log printing tasks, which can fully reduce the occupation of resources.

Use `SetAsync`/`SetFlags` methods of the log object, or the chained operation method `Async` to enable asynchronous output. However, it should be noted that if asynchronous output is set through the object setting method, all subsequent log outputs will be asynchronous; if it is output through chained operation, only the current log output will be asynchronous.

If both synchronous and asynchronous printing are used for the same file log output, be aware that the content of the log file may appear out of order, and this situation should be avoided.

## `SetAsync`

Enable asynchronous output.

```go
package main

import (
    "context"
    "time"

    "github.com/gogf/gf/v2/frame/g"
)

func main() {
    ctx := context.TODO()
    g.Log().SetAsync(true)
    for i := 0; i < 10; i++ {
        g.Log().Print(ctx, "async log", i)
    }
    time.Sleep(time.Second)
}
```

Output:

```bash
2019-06-02 15:44:21.399 async log 0
2019-06-02 15:44:21.399 async log 1
2019-06-02 15:44:21.399 async log 2
2019-06-02 15:44:21.399 async log 3
2019-06-02 15:44:21.399 async log 4
2019-06-02 15:44:21.399 async log 5
2019-06-02 15:44:21.399 async log 6
2019-06-02 15:44:21.399 async log 7
2019-06-02 15:44:21.399 async log 8
2019-06-02 15:44:21.399 async log 9
```

## `Async` Chain Operation

```go
package main

import (
    "context"
    "time"

    "github.com/gogf/gf/v2/frame/g"
)

func main() {
    ctx := context.TODO()
    for i := 0; i < 10; i++ {
        g.Log().Async().Print(ctx, "async log", i)
    }
    g.Log().Print(ctx, "normal log")
    g.Log().Print(ctx, "normal log")
    g.Log().Print(ctx, "normal log")
    time.Sleep(time.Second)
}
```

Output:

```bash
2022-01-05 15:00:44.101 normal log
2022-01-05 15:00:44.101 async log 0
2022-01-05 15:00:44.101 async log 1
2022-01-05 15:00:44.101 async log 2
2022-01-05 15:00:44.101 async log 3
2022-01-05 15:00:44.101 async log 4
2022-01-05 15:00:44.101 async log 5
2022-01-05 15:00:44.101 async log 6
2022-01-05 15:00:44.101 async log 7
2022-01-05 15:00:44.101 async log 8
2022-01-05 15:00:44.101 async log 9
2022-01-05 15:00:44.101 normal log
2022-01-05 15:00:44.103 normal log
```
