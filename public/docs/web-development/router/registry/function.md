# Routing Registration - Function Registration

## Function Registration

Function registration is the simplest and most flexible way to register routes. The registered route `handler` can be the method address of an instantiated object or a package method address. The related method is:

```go
func (s *Server) BindHandler(pattern string, handler interface{})
```

### Usage Example

***Hello World***

Let's look at a simple example:

```go
package main

import (
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/net/ghttp"
)

func main() {
    s := g.Server()
    s.BindHandler("/", func(r *ghttp.Request) {
        r.Response.Write("Hello World in Chinese: 哈喽世界！")
    })
    s.SetPort(8199)
    s.Run()
}
```

After execution, if you visit `http://127.0.0.1:8199`, you will see the familiar content.

### Package Method Registration

The route registration function `handler` parameter can be a package method, for example:

```go
package main

import (
    "github.com/gogf/gf/v2/container/gtype"
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/net/ghttp"
)

var (
    total = gtype.NewInt()
)

func Total(r *ghttp.Request) {
    r.Response.Write("total:", total.Add(1))
}

func main() {
    s := g.Server()
    s.BindHandler("/total", Total)
    s.SetPort(8199)
    s.Run()
}
```

In this example, we register the route through a package method. This method returns the total number of visits. Since it involves concurrent safety, the `total` variable uses the `gtype.Int` concurrent safe type. After execution, when we continuously visit `http://127.0.0.1:8199/total`, we can see the returned value keeps increasing.

### Object Method Registration

The route registration function `handler` parameter can be a method of an object, for example:

```go
package main

import (
    "github.com/gogf/gf/v2/container/gtype"
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/net/ghttp"
)

type Controller struct {
    total *gtype.Int
}

func (c *Controller) Total(r *ghttp.Request) {
    r.Response.Write("total:", c.total.Add(1))
}

func main() {
    s := g.Server()
    c := &Controller{
        total: gtype.NewInt(),
    }
    s.BindHandler("/total", c.Total)
    s.SetPort(8199)
    s.Run()
}
```

This example achieves the same effect as Example 1, but we use an object to encapsulate the variables needed for business logic and flexibly register the corresponding object methods with route function registration.
