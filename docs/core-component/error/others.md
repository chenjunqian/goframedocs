# Error | Others

## `NewOption`

By `NewOption` method, we can customize the error object.

```go
NewOption(option Option) error
```

Example:

```go
func ExampleNewOption() {
    err := gerror.NewOption(gerror.Option{
        Text: "this feature is disabled in this storage",
        Code: gcode.CodeNotSupported,
   })
}
```

## `fmt` Format

We can use `%+v` format to print the `error` stack information, and `gerror.Error` support below formats:

- `%v`,`%s`: Print all hirarchy error messages, multiple levels are concatenated with ":".

- `%-v`, `%-s`: Print current hirarchy error messages, return error string

- `%+s`: Print the `error` stack information

- `%+v`: Print all hirarchy error messages, return error string, same as `%s\n%+s`

Example:

```go
package main

import (
    "errors"
    "fmt"
    "github.com/gogf/gf/v2/errors/gerror"
)

func main() {
    var err error
    err = errors.New("sql error")
    err = gerror.Wrap(err, "adding failed")
    err = gerror.Wrap(err, "api calling failed")
    fmt.Printf(" %%s: %s\n", err)
    fmt.Printf("%%-s: %-s\n", err)
    fmt.Println("%+s: ")
    fmt.Printf("%+s\n", err)
}

// Output:
//  %s: api calling failed: adding failed: sql error
// %-s: api calling failed
// %+s:
// 1. api calling failed
//     1).  main.main
//         /Users/john/Workspace/Go/GOPATH/src/github.com/gogf/gf/.example/other/test.go:14
// 2. adding failed
//     1).  main.main
//         /Users/john/Workspace/Go/GOPATH/src/github.com/gogf/gf/.example/other/test.go:13
// 3. sql error
```

## Print

`glog` component support `Print` method to print error messages and stack information. This support is not tightly coupled, but is supported through the `fmt` formatting and printing interface.

Example:

```go
package main

import (
    "errors"
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/errors/gerror"
)

func main() {
    var err error
    err = errors.New("sql error")
    err = gerror.Wrap(err, "adding failed")
    err = gerror.Wrap(err, "api calling failed")
    g.Log().Printf("%+v", err)
}

// Output:
// 2020-10-17 15:22:26.793 api calling failed: adding failed: sql error
// 1. api calling failed
//     1).  main.main
//         /Users/john/Workspace/Go/GOPATH/src/github.com/gogf/gf/.example/other/test.go:14
// 2. adding failed
//     1).  main.main
//         /Users/john/Workspace/Go/GOPATH/src/github.com/gogf/gf/.example/other/test.go:13
// 3. sql error
```

## Stack Print

This feature has been available since version `v2.6.0` of the framework.

The error component supports specifying the stack trace printing mode through environment variables (`GF_GERROR_STACK_MODE`) or command line startup arguments (`gf.gerror.stack.mode`) when printing stack information:

- `brief`: By default, the `goframe` framework related stack information is not printed.

- `detail`: This will print the `goframe` framework related stack information.

In the detailed mode (`detail`), the complete framework stack information in the error object will be printed. In fact, most of the framework stack information is not very meaningful.

```bash
2022-10-08 21:07:00.751 [ERRO] {328d1204e2191c179a09086890c857b8} request done, cost: 3 ms, code: -1, message: "", detail: <nil>, error: GetParams failed: {ResourceId:tdxxxx-a2c378bd Component: Version:0}: rpc error: code = NotFound desc = cluster.khaos.tencent.com "tdxxxx-a2c378bd" not found
1. GetParams failed: {ResourceId:tdxxxx-a2c378bd Component: Version:0}
   1).  github.com/khaos/eros/app/khaos-oss/internal/logic/params.(*sParams).doGetParamsJson
     /root/workspace/khaos/eros/app/khaos-oss/internal/logic/params/params.go:66
   2).  github.com/khaos/eros/app/khaos-oss/internal/logic/params.(*sParams).GetParams
     /root/workspace/khaos/eros/app/khaos-oss/internal/logic/params/params.go:36
   3).  github.com/khaos/eros/app/khaos-oss/internal/controller.(*cParams).GetOne
     /root/workspace/khaos/eros/app/khaos-oss/internal/controller/params.go:21
   4).  github.com/gogf/gf/v2/net/ghttp.(*middleware).callHandlerFunc.func1
     /root/go/pkg/mod/github.com/gogf/gf/v2@v2.1.4/net/ghttp/ghttp_request_middleware.go:152
   5).  github.com/gogf/gf/v2/net/ghttp.niceCallFunc
     /root/go/pkg/mod/github.com/gogf/gf/v2@v2.1.4/net/ghttp/ghttp_func.go:55
   6).  github.com/gogf/gf/v2/net/ghttp.(*middleware).callHandlerFunc
     /root/go/pkg/mod/github.com/gogf/gf/v2@v2.1.4/net/ghttp/ghttp_request_middleware.go:129
   7).  github.com/gogf/gf/v2/net/ghttp.(*middleware).Next.func1
     /root/go/pkg/mod/github.com/gogf/gf/v2@v2.1.4/net/ghttp/ghttp_request_middleware.go:75
   8).  github.com/gogf/gf/v2/util/gutil.TryCatch
     /root/go/pkg/mod/github.com/gogf/gf/v2@v2.1.4/util/gutil/gutil.go:56
   9).  github.com/gogf/gf/v2/net/ghttp.(*middleware).Next
     /root/go/pkg/mod/github.com/gogf/gf/v2@v2.1.4/net/ghttp/ghttp_request_middleware.go:49
   10). github.com/khaos/eros/app/khaos-oss/internal/logic/middleware.(*sMiddleware).CheckLimit
     /root/workspace/khaos/eros/app/khaos-oss/internal/logic/middleware/middleware.go:27
   11). github.com/gogf/gf/v2/net/ghttp.(*middleware).Next.func1.5
     /root/go/pkg/mod/github.com/gogf/gf/v2@v2.1.4/net/ghttp/ghttp_request_middleware.go:96
   12). github.com/gogf/gf/v2/net/ghttp.niceCallFunc
     /root/go/pkg/mod/github.com/gogf/gf/v2@v2.1.4/net/ghttp/ghttp_func.go:55
   13). github.com/gogf/gf/v2/net/ghttp.(*middleware).Next.func1
     /root/go/pkg/mod/github.com/gogf/gf/v2@v2.1.4/net/ghttp/ghttp_request_middleware.go:95
   14). github.com/gogf/gf/v2/util/gutil.TryCatch
     /root/go/pkg/mod/github.com/gogf/gf/v2@v2.1.4/util/gutil/gutil.go:56
   15). github.com/gogf/gf/v2/net/ghttp.(*middleware).Next
     /root/go/pkg/mod/github.com/gogf/gf/v2@v2.1.4/net/ghttp/ghttp_request_middleware.go:49
   16). github.com/khaos/eros/utility/server.MiddlewareCommonResponse
     /root/workspace/khaos/eros/utility/server/server_common.go:14
   17). github.com/gogf/gf/v2/net/ghttp.(*middleware).Next.func1.5
     /root/go/pkg/mod/github.com/gogf/gf/v2@v2.1.4/net/ghttp/ghttp_request_middleware.go:96
   18). github.com/gogf/gf/v2/net/ghttp.niceCallFunc
     /root/go/pkg/mod/github.com/gogf/gf/v2@v2.1.4/net/ghttp/ghttp_func.go:55
   19). github.com/gogf/gf/v2/net/ghttp.(*middleware).Next.func1
     /root/go/pkg/mod/github.com/gogf/gf/v2@v2.1.4/net/ghttp/ghttp_request_middleware.go:95
   20). github.com/gogf/gf/v2/util/gutil.TryCatch
     /root/go/pkg/mod/github.com/gogf/gf/v2@v2.1.4/util/gutil/gutil.go:56
   21). github.com/gogf/gf/v2/net/ghttp.(*middleware).Next
     /root/go/pkg/mod/github.com/gogf/gf/v2@v2.1.4/net/ghttp/ghttp_request_middleware.go:49
   22). github.com/khaos/eros/utility/server.MiddlewareLogging
     /root/workspace/khaos/eros/utility/server/server.go:46
   23). github.com/gogf/gf/v2/net/ghttp.(*middleware).Next.func1.5
     /root/go/pkg/mod/github.com/gogf/gf/v2@v2.1.4/net/ghttp/ghttp_request_middleware.go:96
   24). github.com/gogf/gf/v2/net/ghttp.niceCallFunc
     /root/go/pkg/mod/github.com/gogf/gf/v2@v2.1.4/net/ghttp/ghttp_func.go:55
   25). github.com/gogf/gf/v2/net/ghttp.(*middleware).Next.func1
     /root/go/pkg/mod/github.com/gogf/gf/v2@v2.1.4/net/ghttp/ghttp_request_middleware.go:95
   26). github.com/gogf/gf/v2/util/gutil.TryCatch
     /root/go/pkg/mod/github.com/gogf/gf/v2@v2.1.4/util/gutil/gutil.go:56
   27). github.com/gogf/gf/v2/net/ghttp.(*middleware).Next
     /root/go/pkg/mod/github.com/gogf/gf/v2@v2.1.4/net/ghttp/ghttp_request_middleware.go:49
   28). github.com/gogf/gf/v2/net/ghttp.MiddlewareCORS
     /root/go/pkg/mod/github.com/gogf/gf/v2@v2.1.4/net/ghttp/ghttp_middleware_cors.go:12
   29). github.com/gogf/gf/v2/net/ghttp.(*middleware).Next.func1.5
     /root/go/pkg/mod/github.com/gogf/gf/v2@v2.1.4/net/ghttp/ghttp_request_middleware.go:96
   30). github.com/gogf/gf/v2/net/ghttp.niceCallFunc
     /root/go/pkg/mod/github.com/gogf/gf/v2@v2.1.4/net/ghttp/ghttp_func.go:55
2. rpc error: code = NotFound desc = cluster.khaos.tencent.com "tdxxxx-a2c378bd" not found
```

In `brief` mode:

```bash
2022-10-08 21:07:00.751 [ERRO] {328d1204e2191c179a09086890c857b8} request done, cost: 3 ms, code: -1, message: "", detail: <nil>, error: GetParams failed: {ResourceId:tdxxxx-a2c378bd Component: Version:0}: rpc error: code = NotFound desc = cluster.khaos.tencent.com "tdxxxx-a2c378bd" not found
1. GetParams failed: {ResourceId:tdxxxx-a2c378bd Component: Version:0}
   1).  github.com/khaos/eros/app/khaos-oss/internal/logic/params.(*sParams).doGetParamsJson
     /root/workspace/khaos/eros/app/khaos-oss/internal/logic/params/params.go:66
   2).  github.com/khaos/eros/app/khaos-oss/internal/logic/params.(*sParams).GetParams
     /root/workspace/khaos/eros/app/khaos-oss/internal/logic/params/params.go:36
   3).  github.com/khaos/eros/app/khaos-oss/internal/controller.(*cParams).GetOne
     /root/workspace/khaos/eros/app/khaos-oss/internal/controller/params.go:21
2. rpc error: code = NotFound desc = cluster.khaos.tencent.com "tdxxxx-a2c378bd" not found
```
