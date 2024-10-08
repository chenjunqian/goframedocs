# Exception Handling

Since this question is frequently asked, a dedicated section has been written for everyone.

## Basic Introduction

Currently, most third-party `WebServer` libraries in `Golang` do not have default exception handling for errors generated during the `HTTP` request process. At best, this results in errors that cannot be logged, making it difficult to troubleshoot. At worst, exceptions can cause the process to crash directly, making the service unavailable.

When you choose `Goframe`, you are fortunate. As an enterprise-level basic development framework, `panics` generated during execution are automatically captured by the `Server` by default. When a panic occurs, the current execution process will be immediately terminated, but it will never affect the process to crash directly.

## Obtaining Exception Errors

When a `panic` exception occurs in the `HTTP` execution process, the default handling is to log it to the `Server`'s log file. Of course, developers can also manually capture it by registering middleware and then customize the related error handling. This operation is also introduced in the middleware section example, and we will explain it carefully here.

### Relevant Methods

We capture exceptions through the GetError method in the Request object.

> Developers cannot use the `recover` method to capture exceptions because the `Goframe` framework's `Server` has already done the capturing. To ensure that exceptions do not cause the process to crash by default, it will not throw the exception again.

```go
// GetError returns the error occurs in the procedure of the request.
// It returns nil if there's no error.
func (r *Request) GetError() error
```

This method is often used in flow control components, such as post middleware or `HOOK` methods.

### Usage Example

Here, we use a global post middleware to capture exceptions. When an exception occurs, it is captured and written to a specified log file, and a fixed friendly message is returned to avoid exposing sensitive error information to the caller.

> It should be noted that:
>
> - Even if developers have their own logs for capturing and recording exceptions, the Server will still print to its own error log file. Logs output by developers through the log interface method belong to business logs (related to business), while logs managed by the Server itself belong to service logs (similar to nginx's error.log).
> - Since most of the underlying errors in the Goframe framework include stack information when an error occurs, if you are interested in the specific stack information of the error (specific call chain, error file path, source code line number, etc.), you can use gerror to obtain it. For details, please refer to the section on error handling - stack features. If the exception includes stack information, it will be printed to the Server's error log file by default.

```go
package main

import (
  "github.com/gogf/gf/v2/frame/g"
  "github.com/gogf/gf/v2/net/ghttp"
)

func MiddlewareErrorHandler(r *ghttp.Request) {
    r.Middleware.Next()
    if err := r.GetError(); err != nil {
        // Log to custom error log file
        g.Log("exception").Error(err)
        // Return fixed friendly message
        r.Response.ClearBuffer()
        r.Response.Writeln("The server is taking a nap, please try again later!")
    }
}

func main() {
  s := g.Server()
  s.Use(MiddlewareErrorHandler)
  s.Group("/api.v2", func(group *ghttp.RouterGroup) {
      group.ALL("/user/list", func(r *ghttp.Request) {
      panic("db error: sql is xxxxxxx")
      })
  })
  s.SetPort(8199)
  s.Run()
}
```

After execution, let's try it with the `curl` tool:

```bash
$ curl -v "http://127.0.0.1:8199/api.v2/user/list" 
> GET /api.v2/user/list HTTP/1.1
> Host: 127.0.0.1:8199
> User-Agent: curl/7.61.1
> Accept: */*
>
< HTTP/1.1 500 Internal Server Error
< Server: GF HTTP Server
< Date: Sun, 19 Jul 2020 07:44:30 GMT
< Content-Length: 52
< Content-Type: text/plain; charset=utf-8
<
The server is taking a nap, please try again later!
```

## Obtaining Exception Stack

### Exception Stack Information

When the `WebServer` captures an `exception`, if the thrown `exception` information does not contain stack content, then the `WebServer` will automatically obtain the stack at the point where the exception was thrown (i.e., the position of the `panic`) and create a new error object that includes this stack information. Let's look at an example.

```go
package main

import (
  "github.com/gogf/gf/v2/frame/g"
  "github.com/gogf/gf/v2/net/ghttp"
)

func MiddlewareErrorHandler(r *ghttp.Request) {
  r.Middleware.Next()
  if err := r.GetError(); err != nil {
      r.Response.ClearBuffer()
      r.Response.Writef("%+v", err)
  }
}

func main() {
  s := g.Server()
  s.Use(MiddlewareErrorHandler)
  s.Group("/api.v2", func(group *ghttp.RouterGroup) {
      group.ALL("/user/list", func(r *ghttp.Request) {
        panic("db error: sql is xxxxxxx")
      })
  })
  s.SetPort(8199)
  s.Run()
}
```

You can see that we use formatted printing with `%+v` to obtain the stack information in the exception error. For the specific principle, please refer to the section: [Error Handling - Stack Features](/docs/core-component/error/stack). After execution, let's test it with the curl tool:

```bash
$ curl "http://127.0.0.1:8199/api.v2/user/list" 
db error: sql is xxxxxxx
1. db error: sql is xxxxxxx
   1).  main.main.func1.1
     /Users/john/Workspace/Go/GOPATH/src/github.com/gogf/gf/.example/other/test.go:25
   2).  github.com/gogf/gf/v2/net/ghttp.(*middleware).Next.func1.8
     /Users/john/Workspace/Go/GOPATH/src/github.com/gogf/gf/v2/net/ghttp/ghttp_request_middleware.go:111
   3).  github.com/gogf/gf/v2/net/ghttp.niceCallFunc
     /Users/john/Workspace/Go/GOPATH/src/github.com/gogf/gf/v2/net/ghttp/ghttp_func.go:46
   4).  github.com/gogf/gf/v2/net/ghttp.(*middleware).Next.func1
     /Users/john/Workspace/Go/GOPATH/src/github.com/gogf/gf/v2/net/ghttp/ghttp_request_middleware.go:110
   5).  github.com/gogf/gf/v2/util/gutil.TryCatch
     /Users/john/Workspace/Go/GOPATH/src/github.com/gogf/gf/v2/util/gutil/gutil.go:46
   6).  github.com/gogf/gf/v2/net/ghttp.(*middleware).Next
     /Users/john/Workspace/Go/GOPATH/src/github.com/gogf/gf/v2/net/ghttp/ghttp_request_middleware.go:47
   7).  main.MiddlewareErrorHandler
     /Users/john/Workspace/Go/GOPATH/src/github.com/gogf/gf/.example/other/test.go:10
   8).  github.com/gogf/gf/v2/net/ghttp.(*middleware).Next.func1.9
     /Users/john/Workspace/Go/GOPATH/src/github.com/gogf/gf/v2/net/ghttp/ghttp_request_middleware.go:117
   9).  github.com/gogf/gf/v2/net/ghttp.niceCallFunc
     /Users/john/Workspace/Go/GOPATH/src/github.com/gogf/gf/v2/net/ghttp/ghttp_func.go:46
   10). github.com/gogf/gf/v2/net/ghttp.(*middleware).Next.func1
     /Users/john/Workspace/Go/GOPATH/src/github.com/gogf/gf/v2/net/ghttp/ghttp_request_middleware.go:116
   11). github.com/gogf/gf/v2/util/gutil.TryCatch
     /Users/john/Workspace/Go/GOPATH/src/github.com/gogf/gf/v2/util/gutil/gutil.go:46
   12). github.com/gogf/gf/v2/net/ghttp.(*middleware).Next
     /Users/john/Workspace/Go/GOPATH/src/github.com/gogf/gf/v2/net/ghttp/ghttp_request_middleware.go:47
   13). github.com/gogf/gf/v2/net/ghttp.(*Server).ServeHTTP
     /Users/john/Workspace/Go/GOPATH/src/github.com/gogf/gf/v2/net/ghttp/ghttp_server_handler.go:122
```

### Error Stack Information

If the thrown exception is an error object through the `gerror` component, or an error object that implements the stack printing interface, since the error object of the exception already contains detailed stack information, the `WebServer` will directly return the error object without automatically creating an error object. Let's look at an example.

```go
package main

import (
  "github.com/gogf/gf/v2/errors/gerror"
  "github.com/gogf/gf/v2/frame/g"
  "github.com/gogf/gf/v2/net/ghttp"
)

func MiddlewareErrorHandler(r *ghttp.Request) {
  r.Middleware.Next()
  if err := r.GetError(); err != nil {
      r.Response.ClearBuffer()
      r.Response.Writef("%+v", err)
  }
}

func DbOperation() error {
  // ...
  return gerror.New("DbOperation error: sql is xxxxxxx")
}

func UpdateData() {
  err := DbOperation()
  if err != nil {
      panic(gerror.Wrap(err, "UpdateData error"))
  }
}

func main() {
  s := g.Server()
  s.Use(MiddlewareErrorHandler)
  s.Group("/api.v2", func(group *ghttp.RouterGroup) {
      group.ALL("/user/list", func(r *ghttp.Request) {
        UpdateData()
      })
  })
  s.SetPort(8199)
  s.Run()
}
```

After execution, let's test it with the `curl` tool:

```bash
$ curl "http://127.0.0.1:8199/api.v2/user/list" 
UpdateData error: DbOperation error: sql is xxxxxxx
1. UpdateData error
   1).  main.UpdateData
     /Users/john/Workspace/Go/GOPATH/src/github.com/gogf/gf/.example/other/test.go:25
   2).  main.main.func1.1
     /Users/john/Workspace/Go/GOPATH/src/github.com/gogf/gf/.example/other/test.go:34
   3).  github.com/gogf/gf/v2/net/ghttp.(*middleware).Next.func1.8
     /Users/john/Workspace/Go/GOPATH/src/github.com/gogf/gf/v2/net/ghttp/ghttp_request_middleware.go:111
   4).  github.com/gogf/gf/v2/net/ghttp.niceCallFunc
     /Users/john/Workspace/Go/GOPATH/src/github.com/gogf/gf/v2/net/ghttp/ghttp_func.go:46
   5).  github.com/gogf/gf/v2/net/ghttp.(*middleware).Next.func1
     /Users/john/Workspace/Go/GOPATH/src/github.com/gogf/gf/v2/net/ghttp/ghttp_request_middleware.go:110
   6).  github.com/gogf/gf/v2/util/gutil.TryCatch
     /Users/john/Workspace/Go/GOPATH/src/github.com/gogf/gf/v2/util/gutil/gutil.go:46
   7).  github.com/gogf/gf/v2/net/ghttp.(*middleware).Next
     /Users/john/Workspace/Go/GOPATH/src/github.com/gogf/gf/v2/net/ghttp/ghttp_request_middleware.go:47
   8).  main.MiddlewareErrorHandler
     /Users/john/Workspace/Go/GOPATH/src/github.com/gogf/gf/.example/other/test.go:10
   9).  github.com/gogf/gf/v2/net/ghttp.(*middleware).Next.func1.9
     /Users/john/Workspace/Go/GOPATH/src/github.com/gogf/gf/v2/net/ghttp/ghttp_request_middleware.go:117
   10). github.com/gogf/gf/v2/net/ghttp.niceCallFunc
     /Users/john/Workspace/Go/GOPATH/src/github.com/gogf/gf/v2/net/ghttp/ghttp_func.go:46
   11). github.com/gogf/gf/v2/net/ghttp.(*middleware).Next.func1
     /Users/john/Workspace/Go/GOPATH/src/github.com/gogf/gf/v2/net/ghttp/ghttp_request_middleware.go:116
   12). github.com/gogf/gf/v2/util/gutil.TryCatch
     /Users/john/Workspace/Go/GOPATH/src/github.com/gogf/gf/v2/util/gutil/gutil.go:46
   13). github.com/gogf/gf/v2/net/ghttp.(*middleware).Next
     /Users/john/Workspace/Go/GOPATH/src/github.com/gogf/gf/v2/net/ghttp/ghttp_request_middleware.go:47
   14). github.com/gogf/gf/v2/net/ghttp.(*Server).ServeHTTP
     /Users/john/Workspace/Go/GOPATH/src/github.com/gogf/gf/v2/net/ghttp/ghttp_server_handler.go:122
2. DbOperation error: sql is xxxxxxx
   1).  main.DbOperation
     /Users/john/Workspace/Go/GOPATH/src/github.com/gogf/gf/.example/other/test.go:19
   2).  main.UpdateData
     /Users/john/Workspace/Go/GOPATH/src/github.com/gogf/gf/.example/other/test.go:23
   3).  main.main.func1.1
     /Users/john/Workspace/Go/GOPATH/src/github.com/gogf/gf/.example/other/test.go:34
   4).  github.com/gogf/gf/v2/net/ghttp.(*middleware).Next.func1.8
     /Users/john/Workspace/Go/GOPATH/src/github.com/gogf/gf/v2/net/ghttp/ghttp_request_middleware.go:111
   5).  github.com/gogf/gf/v2/net/ghttp.niceCallFunc
     /Users/john/Workspace/Go/GOPATH/src/github.com/gogf/gf/v2/net/ghttp/ghttp_func.go:46
   6).  github.com/gogf/gf/v2/net/ghttp.(*middleware).Next.func1
     /Users/john/Workspace/Go/GOPATH/src/github.com/gogf/gf/v2/net/ghttp/ghttp_request_middleware.go:110
   7).  github.com/gogf/gf/v2/util/gutil.TryCatch
     /Users/john/Workspace/Go/GOPATH/src/github.com/gogf/gf/v2/util/gutil/gutil.go:46
   8).  github.com/gogf/gf/v2/net/ghttp.(*middleware).Next
     /Users/john/Workspace/Go/GOPATH/src/github.com/gogf/gf/v2/net/ghttp/ghttp_request_middleware.go:47
   9).  main.MiddlewareErrorHandler
     /Users/john/Workspace/Go/GOPATH/src/github.com/gogf/gf/.example/other/test.go:10
   10). github.com/gogf/gf/v2/net/ghttp.(*middleware).Next.func1.9
     /Users/john/Workspace/Go/GOPATH/src/github.com/gogf/gf/v2/net/ghttp/ghttp_request_middleware.go:117
   11). github.com/gogf/gf/v2/net/ghttp.niceCallFunc
     /Users/john/Workspace/Go/GOPATH/src/github.com/gogf/gf/v2/net/ghttp/ghttp_func.go:46
   12). github.com/gogf/gf/v2/net/ghttp.(*middleware).Next.func1
     /Users/john/Workspace/Go/GOPATH/src/github.com/gogf/gf/v2/net/ghttp/ghttp_request_middleware.go:116
   13). github.com/gogf/gf/v2/util/gutil.TryCatch
     /Users/john/Workspace/Go/GOPATH/src/github.com/gogf/gf/v2/util/gutil/gutil.go:46
   14). github.com/gogf/gf/v2/net/ghttp.(*middleware).Next
     /Users/john/Workspace/Go/GOPATH/src/github.com/gogf/gf/v2/net/ghttp/ghttp_request_middleware.go:47
   15). github.com/gogf/gf/v2/net/ghttp.(*Server).ServeHTTP
     /Users/john/Workspace/Go/GOPATH/src/github.com/gogf/gf/v2/net/ghttp/ghttp_server_handler.go:122
```
