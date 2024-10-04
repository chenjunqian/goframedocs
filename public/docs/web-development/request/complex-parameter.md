# Request Input - Complex Parameters

> This section addresses complex parameters traditionally passed via `Query` or `Form` parameters. Since these methods are not elegant for managing complex parameter passing, we recommend using `JSON` data encoding for managing complex parameter scenarios whenever possible.

## Complex Parameters

The `ghttp.Request` object supports intelligent parameter type parsing (regardless of the request submission method and type). Below are examples of submitted parameters and the corresponding variable types parsed on the server side:

- `k=m&k=n` -> `map[k:n]`
- `k1=m&k2=n` -> `map[k1:m k2:n]`
- `k[]=m&k[]=n` -> `map[k:[m n]]`
- `k[a][]=m&k[a][]=n` -> `map[k:map[a:[m n]]]`
- `k[a]=m&k[b]=n` -> `map[k:map[a:m b:n]]`
- `k[a][a]=m&k[a][b]=n` -> `map[k:map[a:map[a:m b:n]]]`
- `k=m&k[a]=n` -> `error` (This is not a valid format and will result in an error.)

## Same Name Parameters

When submitting parameters with the same name, such as `k=v1&k=v2`, the subsequent variable value will override the previous one.

***Example Code***

```go
package main

import (
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gv2/net/ghttp"
)

func main() {
    s := g.Server()
    s.BindHandler("/", func(r *ghttp.Request) {
        r.Response.Write(r.Get("name"))
    })
    s.SetPort(8199)
    s.Run()
}
```

After execution, visiting `http://127.0.0.1:8199/?name=john&name=smith` will return the value `smith`.

> Note: The `HTTP Server` in the framework handles this logic similarly to `PHP`, which differs from the processing logic of the `Go` standard library. In the `Go` standard library's `net/http` package, submitted same-name parameters are converted into a string array.

## Array Parameters

Array parameters are submitted in the format `k[]=v1&k[]=v2`, using empty square brackets `[]` to denote array parameters.

***Example Code***

```go
package main

import (
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/net/ghttp"
)

func main() {
    s := g.Server()
    s.BindHandler("/", func(r *ghttp.Request) {
        r.Response.Write(r.Get("array"))
    })
    s.SetPort(8199)
    s.Run()
}
```

After execution, visiting `http://127.0.0.1:8199/?array[]=john&array[]=smith` will return the value `["john","smith"]`.

Note: If the parameter passed includes brackets and index numbers, such as `array[0]=john&array[1]=smith`, it will be converted to a map according to the complex parameter conversion rules introduced earlier, resulting in `map{"0":"john","1":"smith"}`.

## Map Parameters

Map parameters are submitted in the format `k[a]=m&k[b]=n` and support multi-level maps, for example: `k[a][a]=m&k[a][b]=n`.

***Example Code***

```go
package main

import (
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/net/ghttp"
)

func main() {
    s := g.Server()
    s.BindHandler("/", func(r *ghttp.Request) {
        r.Response.Write(r.Get("map"))
    })
    s.SetPort(8199)
    s.Run()
}
```

After execution, visiting `http://127.0.0.1:8199/?map[id]=1&map[name]=john` will return the value `{"id":"1","name":"john"}`.

Let's try multi-level maps by manually accessing the following address:

`http://127.0.0.1:8199/?map[user1][id]=1&map[user1][name]=john&map[user2][id]=2&map[user2][name]=smith`

This will return the value `{"user1":{"id":"1","name":"john"},"user2":{"id":"2","name":"smith"}}`.
