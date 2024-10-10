# Pagination Management - Static Pagination

Static pagination refers to the scenario where the pagination parameters are passed through route parameters. In this case, the pagination object is highly coupled with the `server`'s route definition. The route definition needs to provide a route parameter named `page`, which can use fuzzy matching route `*page`, named matching route `:page`, or field matching route `{page}`.

## Example 1: Using Fuzzy Matching Route

```go
package main

import (
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/net/ghttp"
    "github.com/gogf/gf/v2/os/gview"
)

func main() {
    s := g.Server()
    s.BindHandler("/page/static/*page", func(r *ghttp.Request) {
        page := r.GetPage(100, 10)
        buffer, _ := gview.ParseContent(`
        <html>
            <head>
                <style>
                    a,span {padding:8px; font-size:16px;}
                    div{margin:5px 5px 20px 5px}
                </style>
            </head>
            <body>
                <div>{{.page1}}</div>
                <div>{{.page2}}</div>
                <div>{{.page3}}</div>
                <div>{{.page4}}</div>
            </body>
        </html>
        `, g.Map{
            "page1": page.GetContent(1),
            "page2": page.GetContent(2),
            "page3": page.GetContent(3),
            "page4": page.GetContent(4),
        })
        r.Response.Write(buffer)
    })
    s.SetPort(8199)
    s.Run()
}
```

After execution, manually visit `http://127.0.0.1:8199/page/static/6` to see the page results.

## Example 2: Using Field Matching Route

```go
package main

import (
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/net/ghttp"
    "github.com/gogf/gf/v2/os/gview"
)

func main() {
    s := g.Server()
    s.BindHandler("/:obj/*action/{page}.html", func(r *ghttp.Request) {
    page := r.GetPage(100, 10)
    buffer, _ := gview.ParseContent(`
        <html>
            <head>
                <style>
                    a,span {padding:8px; font-size:16px;}
                    div{margin:5px 5px 20px 5px}
                </style>
            </head>
            <body>
                <div>{{.page1}}</div>
                <div>{{.page2}}</div>
                <div>{{.page3}}</div>
                <div>{{.page4}}</div>
            </body>
        </html>
        `, g.Map{
            "page1": page.GetContent(1),
            "page2": page.GetContent(2),
            "page3": page.GetContent(3),
            "page4": page.GetContent(4),
        })
    r.Response.Write(buffer)
    })
    s.SetPort(8199)
    s.Run()
}
```

This example's route rule is more flexible, using the `{page}` field matching rule to obtain the current pagination page number information.
