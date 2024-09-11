# Resource - Usage Example

This example demonstrates the usage of resource management in a `WebServer` for static service, configuration management, and template engine.

## Resource Files

- Source code for resource files: [example files](https://github.com/gogf/gf/tree/master/os/gres/testdata/example/files)
- Resource file packaging: [boot files](https://github.com/gogf/gf/tree/master/os/gres/testdata/example/boot)

***Resource File List***

```bash
| Date                         | Size   | Path                     |
|------------------------------|--------|--------------------------|
| 2020-03-28T13:04:10+00:00    | 0.00B  | config                   |
| 2020-03-28T13:03:06+00:00    | 135.00B| config/config.toml       |
| 2020-03-28T13:04:10+00:00    | 0.00B  | public                   |
| 2020-03-28T12:57:54+00:00    | 6.00B  | public/index.html        |
| 2020-03-28T13:04:10+00:00    | 0.00B  | template                 |
| 2020-03-28T13:03:17+00:00    | 15.00B | template/index.tpl       |
| **Total Files:**             | 6      |                          |
```

***Contents of the Three Files***

`config.toml`

```toml
[server]
    Address    = ":8888"
    ServerRoot = "public"

[viewer]
    DefaultFile = "index.tpl"
    Delimiters  = ["${", "}"]
```

This file serves as the application's configuration file.

`index.html`

```html
Hello!
```

This file is used for static resource requests.

`index.tpl`

```tpl
Hello ${.name}!
```

This file is used for template file parsing and display.

## Creating Application

```go
package main

import (
    _ "github.com/gogf/gf/v2/os/gres/testdata/example/boot"

    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/net/ghttp"
)

func main() {
    s := g.Server()
    s.Group("/", func(group *ghttp.RouterGroup) {
        group.GET("/template", func(r *ghttp.Request) {
            r.Response.WriteTplDefault(g.Map{
                "name": "GoFrame",
            })
        })
    })
    s.Run()
}
```

As shown in the code, apart from the additional import statement `import _ "github.com/gogf/gf/v2/os/gres/testdata/example/boot"`, there are no other specific settings. This illustrates the convenience of resource management in the GoFrame framework; it does not require any special configurations during the development phase. Instead, the resource files are packaged before application deployment, and the import statement is used to include the resource files.

***Output After Running***

```bash
2020-03-28 21:36:19.828 75892: http server started listening on [:8888]

  SERVER  | DOMAIN  | ADDRESS | METHOD |   ROUTE   |      HANDLER      | MIDDLEWARE
|---------|---------|---------|--------|-----------|-------------------|------------|
  default | default | :8888   | GET    | /template | main.main.func1.1 |
|---------|---------|---------|--------|-----------|-------------------|------------|
```

The configuration file is automatically read and applied to the WebServer.

***Testing Static Files and Template Engine Access***

You can test the access to static files and the template engine using the `curl` command:

```bash
$ curl http://127.0.0.1:8888/
Hello!

$ curl http://127.0.0.1:8888/template
Hello GoFrame!
```

As you can see, both the `index.html` static file and the `index.tpl` template file were successfully accessed.
