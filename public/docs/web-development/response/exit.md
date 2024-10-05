# Response - Exit Control

## Exit ExitAll and ExitHook

- **Exit**: Exits only the current logic method being executed, without exiting the subsequent request process. It can be used as an alternative to `return`.
- **ExitAll**: Forcibly interrupts the current execution process, and the subsequent logic of the current method as well as all subsequent logical methods will no longer be executed. It is commonly used for access control.
- **ExitHook**: When multiple HOOK methods are matched for a route, they are executed in the order of route matching priority by default. When the `ExitHook` method is called within a `HOOK` method, subsequent `HOOK` methods will not be executed. Its function is similar to overriding `HOOK` methods.
- These three exit functions are only valid within service functions and `HOOK` event callback functions and cannot control the execution process of middleware.

Since `ExitAll` and `ExitHook` are less commonly used in the application layer, this section will only introduce the use of the `Exit` method.

> The underlying mechanism for the `Exit` process exit feature is implemented using the `panic...recover...` mechanism, with CPU execution overhead of about tens of nanoseconds (`ns`), achieving usability with minimal runtime overhead.

## Exit Return Method

```go
package main

import (
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/net/ghttp"
)

func main() {
    s := g.Server()
    s.BindHandler("/", func(r *ghttp.Request) {
        if r.Get("type").Int() == 1 {
            r.Response.Writeln("john")
        }
        r.Response.Writeln("smith")
    })
    s.SetPort(8199)
    s.Run()
}
```

After execution, when we visit `http://127.0.0.1:8199/?type=1`, we can see the page output:

```bash
john
smith
```

Let's slightly adjust the above code:

```go
package main

import (
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/net/ghttp"
)

func main() {
    s := g.Server()
    s.BindHandler("/", func(r *ghttp.Request) {
        if r.Get("type").Int() == 1 {
            r.Response.Writeln("john")
            r.Exit()
        }
        r.Response.Writeln("smith")
    })
    s.SetPort(8199)
    s.Run()
}
```

After execution, when we visit `http://127.0.0.1:8199/?type=1` again, we can see the page output:

```bash
john
```

Additionally, the `Response` object provides many `Write*Exit` methods, which indicate that the content is output and then the `Exit` method is immediately called to exit the current service method.
