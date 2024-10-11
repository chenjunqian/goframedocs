# Frequently Asked Questions

Created by Guo Qiang, last modified on January 05, 2024

## Server Frequently Reports Context Cancel Error

When ***a client actively cancels a request*** (for example, by actively canceling it or because the request exceeds the timeout set by the client), especially when accessing through a browser and directly canceling the request, the server may encounter a `context canceled` error. This is a normal phenomenon, as designed by the `Golang` standard library's `HTTP server`. When the client no longer needs the result of the request, it cancels the request, and it makes no sense for the server to continue executing. If you mind this error, you can use a custom middleware to add `NeverDoneCtx` handling logic. In this case, the server will ignore the client's canceled request and continue execution.

```go
// MiddlewareNeverDoneCtx sets the context never done for current process.
func MiddlewareNeverDoneCtx(r *Request) {
    r.SetCtx(r.GetNeverDoneCtx())
    r.Middleware.Next()
}
```
