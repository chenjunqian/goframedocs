# Pagination Management - Ajax Pagination

`Ajax` pagination differs from other pagination methods in that the pagination links will use a `JavaScript` method to implement. This `JavaScript` method is the pagination method, and its parameter is fixed as the pagination `URL` address corresponding to that page. After obtaining the pagination content corresponding to the `URL` connection through `Ajax`, this `JavaScript` method renders the content to the page.

Here is a complete example:

```go
package main

import (
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/net/ghttp"
    "github.com/gogf/gf/v2/os/gview"
)

func main() {
    s := g.Server()
    s.BindHandler("/page/ajax", func(r *ghttp.Request) {
        page := r.GetPage(100, 10)
        page.AjaxActionName = "DoAjax"
        buffer, _ := gview.ParseContent(`
        <html>
            <head>
                <style>
                    a,span {padding:8px; font-size:16px;}
                    div{margin:5px 5px 20px 5px}
                </style>
                <script src="https://cdn.bootcss.com/jquery/2.0.3/jquery.min.js"></script> 
                <script>
                function DoAjax(url) {
                    $.get(url, function(data,status) {
                        $("body").html(data);
                    });
                }
                </script>
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

In this example, we define a `DoAjax(url)` method to perform the pagination operation. For demonstration purposes, its logic is simple; it loads the content of the specified pagination page and replaces the pagination content of the current page.

```javascript
function DoAjax(url) {
     $.get(url, function(data,status) {
         $("body").html(data);
     });
}
```
