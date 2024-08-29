# Template Engine - Layout

The `gview` template engine supports two types of layout template configurations:

1. Define and Template
2. Include Template Embedding

Both of these methods support passing template variables.

## Define and Template

Since `gview` uses the `ParseFiles` method to parse multiple template files at once, you can define template content blocks using the `define` tag and then include them in any other template file using the `template` tag. The `template` tag supports cross-template references, meaning that the content block defined by the `define` tag can be located in another template file, and the `template` tag can include it freely.

***Notes***

>
> - When passing template variables to nested sub-templates, use the syntax: `{{template "xxx" .}}`.
> - The file extension of the template files must be consistent with the file extension of the `define` template file.

***Directory Structure***:

```text
template/
  └── main/
      ├── main1.html
      ├── main2.html
      ├── footer.html
      ├── header.html
      └── layout.html
main.go
```

***Code Example***:

```go
package main

import (
    "github.com/gogf/gf/g"
    "github.com/gogf/gf/g/net/ghttp"
)

func main() {
    s := g.Server()
    s.BindHandler("/main1", func(r *ghttp.Request) {
        r.Response.WriteTpl("layout.html", g.Map{
            "mainTpl": "main/main1.html",
        })
    })

    s.BindHandler("/main2", func(r *ghttp.Request) {
        r.Response.WriteTpl("layout.html", g.Map{
            "mainTpl": "main/main2.html",
        })
    })

    s.View().SetPath("template")
    s.SetPort(8199)
    s.Run()
}
```

***layout.html***

```html
<!DOCTYPE html>
<html>
<head>
    <title>GoFrame Layout</title>
    {{template "header" .}}
</head>
<body>
    <div class="container">
    {{template "container" .}}
    </div>
    <div class="footer">
    {{template "footer" .}}
    </div>
</body>
</html>
```

***header.html***

```html
{{define "header"}}
    <h1>{{.header}}</h1>
{{end}}
```

***container.html***

```html
{{define "container"}}
<h1>{{.container}}</h1>
{{end}}
```

***footer.html***

```html
{{define "footer"}}
<h1>{{.footer}}</h1>
{{end}}
```

***main.go***

```go
package main

import (
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/net/ghttp"
)

func main() {
    s := g.Server()
    s.BindHandler("/", func(r *ghttp.Request) {
        r.Response.WriteTpl("layout.html", g.Map{
            "header":    "This is header",
            "container": "This is container",
            "footer":    "This is footer",
        })
    })
    s.SetPort(8199)
    s.Run()
}
```

After executing the code, visit [http://127.0.0.1:8199](http://127.0.0.1:8199) to see the result:

## Include Template Embedding

Alternatively, you can use the `include` tag to implement page layouts.

**Note**: When passing template variables to nested sub-templates, use the syntax: `{{include "xxx" .}}`.

***layout.go***

```html
{{include "header.html" .}}
{{include .mainTpl .}}
{{include "footer.html" .}}
```

***header.html***

```html
<h1>HEADER</h1>
```

***footer.html***

```html
<h1>FOOTER</h1>
```

***main1.html***

```html
<h1>MAIN1</h1>
```

***main2.html***

```html
<h1>MAIN2</h1>
```

***main.go***

```go
package main

import (
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/net/ghttp"
)

func main() {
    s := g.Server()
    s.BindHandler("/main1", func(r *ghttp.Request) {
        r.Response.WriteTpl("layout.html", g.Map{
            "mainTpl": "main/main1.html",
        })
    })
    s.BindHandler("/main2", func(r *ghttp.Request) {
        r.Response.WriteTpl("layout.html", g.Map{
            "mainTpl": "main/main2.html",
        })
    })
    s.SetPort(8199)
    s.Run()
}
```

After executing the code, visit different routes to see different results:

- [http://127.0.0.1:8199/main1](http://127.0.0.1:8199/main1)
- [http://127.0.0.1:8199/main2](http://127.0.0.1:8199/main2)
