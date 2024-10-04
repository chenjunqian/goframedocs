# Request Input - Default Value Binding

Starting from `version v1.15`, the Request object supports binding default values to the properties of input objects through `struct tags`. The `struct tag` name for default values is `d` (which can also be referred to as `default`).

Let's look at an example to better understand this feature.

## Parameter Object Definition

```go
type GetListReq struct {
    g.Meta `path:"/" method:"get"`
    Type   string `v:"required#Please select content model" dc:"Content model"`
    Page   int    `v:"min:0#Page number error"      dc:"Page number" d:"1"`
    Size   int    `v:"max:50#Maximum of 50 items per page" dc:"Page size, maximum of 50" d:"10"`
    Sort   int    `v:"in:0,1,2#Invalid sort type" dc:"Sort type (0: Newest, default. 1: Active, 2: Popular)"`
}
type GetListRes struct {
    Items []Item `dc:"Content list"`
}

type Item struct {
    Id    int64  `dc:"Content ID"`
    Title string `dc:"Content title"`
}

type Controller struct{}
```

This is a parameter reception object for querying a content list, where we use the `d` tag to specify default values for properties `Page` and `Size`. When these two parameters are not passed, they default to `1` and `10`, respectively, indicating that pagination starts from the `first` page with `10` items per page.

## Parameter Object Usage

```go
package main

import (
    "context"

    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/net/ghttp"
)

type GetListReq struct {
    g.Meta `path:"/" method:"get"`
    Type   string `v:"required#Please select content model" dc:"Content model"`
    Page   int    `v:"min:0#Page number error"      dc:"Page number" d:"1"`
    Size   int    `v:"max:50#Maximum of 50 items per page" dc:"Page size, maximum of 50" d:"10"`
    Sort   int    `v:"in:0,1,2#Invalid sort type" dc:"Sort type (0: Newest, default. 1: Active, 2: Popular)"`
}
type GetListRes struct {
    Items []Item `dc:"Content list"`
}

type Item struct {
    Id    int64  `dc:"Content ID"`
    Title string `dc:"Content title"`
}

type Controller struct{}

func (Controller) GetList(ctx context.Context, req *GetListReq) (res *GetListRes, err error) {
    g.Log().Info(ctx, req)
    return
}

func main() {
    s := g.Server()
    s.Group("/content", func(group *ghttp.RouterGroup) {
        group.Middleware(ghttp.MiddlewareHandlerResponse)
        group.Bind(&Controller{})
    })
    s.SetPort(8199)
    s.Run()
}
```

We access the following addresses and observe the server terminal output results:

```bash
http://127.0.0.1:8199/content?type=ask
2023-03-21 21:58:23.058 [INFO] {2883f9c2dc734e170a35c73ea3560b4b} {"Type":"ask","Page":1,"Size":10,"Sort":0}

http://127.0.0.1:8199/content?type=ask&page= 
2023-03-21 21:58:32.555 [INFO] {b86e22f9de734e170b35c73edf07859d} {"Type":"ask","Page":1,"Size":10,"Sort":0}

http://127.0.0.1:8199/content?type=ask&page=2 
2023-03-21 22:01:02.907 [INFO] {a016c8fa01744e170f35c73e99082f53} {"Type":"ask","Page":2,"Size":10,"Sort":0}
```

It can be seen that when the caller does not pass or passes an empty `page` parameter, the server will use the defined default values. However, when the caller passes a specific `page` parameter, the default value will not take effect.

## Notes

Default value parameter binding is identified by whether the client has submitted the parameter. If the client has submitted the parameter, even if the parameter value is an ***empty string***, it will be considered as the client having passed a specific value. In this case, the default value tag on the server data structure will not take effect.
