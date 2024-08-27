# Template Engine - Overview

The template engine in Goframe offers several features:

- Simple, easy to use, and powerful.
- Supports multiple template directory searches.
- Supports layout templates.
- Supports singleton pattern for template view objects.
- Integrates natively with the configuration management module for ease of use.
- Uses a two-level caching design for efficient performance.
- Includes new template tags and a large number of built-in template variables and functions.
- Supports automatic cache updates when template files are modified, making development easier.
- `define/template` tags support cross-template calls (within the same template path including subdirectories).
- `include` tags support including template files from any path.

## General View Management

General view management uses the native `gview` module of the template engine for template management, including reading and displaying templates and rendering template variables. You can use the `gview.Instance` method to get a singleton view object and retrieve it by its singleton object name. Alternatively, you can use the `g.View()` object manager to get the default singleton `gview` object.

**API Documentation:**

[https://pkg.go.dev/github.com/gogf/gf/v2/os/gview](https://pkg.go.dev/github.com/gogf/gf/v2/os/gview)

**Brief Description:**

- `gview.Get` retrieves the singleton template engine object for a given template directory path.
- `gview.New` creates a new template engine object for a given template directory path without singleton management.
- `SetPath/AddPath` sets/adds the template directory paths for the current template engine object. `SetPath` will override all template directory settings; `AddPath` is recommended.
- `Assign/Assigns` sets template variables, which can be used in all templates parsed by this template engine.
- `BindFunc` binds template functions; refer to subsequent examples for usage.
- `Parse/ParseContent` parses template files/contents, with temporary template variables and functions provided during parsing.
- `SetDelimiters` sets the delimiters for the template engine object; default is `{{ }}` (which conflicts with the Vue.js frontend framework).
- Note: Starting from Goframe v1.16, all template parsing methods have an additional first input parameter for passing `Context` variables.

## Examples

### Parsing Template Files

**index.tpl**

```html
id:{{.id}}, name:{{.name}}
```

**main.go**

```go
package main

import (
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/net/ghttp"
)

func main() {
    s := g.Server()
    s.BindHandler("/template", func(r *ghttp.Request) {
    r.Response.WriteTpl("index.tpl", g.Map{
        "id":   123,
        "name": "john",
        })
    })
    s.SetPort(8199)
    s.Run()
}
```

After execution, visiting [http://127.0.0.1:8199/template](http://127.0.0.1:8199/template) will show: `id:123, name:john`.

### Parsing Template Content

**main.go**

```go
package main

import (
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/net/ghttp"
)

func main() {
    s := g.Server()
    s.BindHandler("/template", func(r *ghttp.Request){
    tplContent := `id:{{.id}}, name:{{.name}}`
    r.Response.WriteTplContent(tplContent, g.Map{
        "id"   : 123,
        "name" : "john",
        })
    })
    s.SetPort(8199)
    s.Run()
}
```

After execution, visiting [http://127.0.0.1:8199/template](http://127.0.0.1:8199/template) will show: `id:123, name:john`.

### Custom Template Delimiters

In projects, conflicts can occur between Go's default template delimiters and Vue's delimiters (both use `{{ }}`). Use `SetDelimiters` to customize the global Go template delimiters:

**main.go**

```go
package main

import (
    "context"
    "fmt"
    "github.com/gogf/gf/v2/frame/g"
)

func main() {
    v := g.View()
    v.SetDelimiters("${", "}")
    b, err := v.Parse(
        context.TODO(),
        "gview_delimiters.tpl",
        map[string]interface{}{
            "k": "v",
        }
    )
    fmt.Println(err)
    fmt.Println(b)
}
```

**gview_delimiters.tpl**

```html
test.tpl content, vars: ${.}
```

After execution, the output will be:

```text
<nil>
test.tpl content, vars: map[k:v]
```

## Directory Configuration

The GoFrame framework's template engine supports flexible multi-directory automatic search. Use `SetPath` to modify the template directory to a single directory path. Use `AddPath` to add multiple search directories. The template engine will search in the order directories are added until a matching file path is found. If no template file is found in all search directories, it will return a failure.

**Default Directory Configuration:**

When initializing the `gview` view object, the following template file search directories are automatically added:

- Current working directory and its `template` subdirectory: For example, if the current working directory is `/home/www`, it will add `/home/www` and `/home/www/template`.
- Directory of the executable file and its `template` subdirectory: For example, if the binary file is in `/tmp`, it will add `/tmp` and `/tmp/template`.
- Directory of the `main` source code package and its `template` subdirectory (only in the source code development environment): For example, if the `main` package is in `/home/john/workspace/gf-app`, it will add `/home/john/workspace/gf-app` and `/home/john/workspace/gf-app/template`.

**Modifying Template**

You can modify the template file search directory for the view object as follows, making the view object only perform configuration file searches in the specified directory:

- **Recommended:** Get the global `View` object in singleton mode and manually modify it using `SetPath`.
- Modify command line startup parameters: `gf.gview.path`.
- Modify the specified environment variable: `GF_GVIEW_PATH`.

For example, if your executable file is named `main`, you can modify the template engine's template directory (on Linux) as follows:

**Recommended**: Using Singleton Mode

```go
g.View().SetPath("/opt/template")
```

**Command Line Parameters**

```sh
./main --gf.gview.path=/opt/template/
```

**Environment Variables**

Set environment variable before starting:

```sh
GF_GVIEW_PATH=/opt/config/; ./main
```

Or use the `genv` module to set environment variables:

```go
genv.Set("GF_GVIEW_PATH", "/opt/template")
```

## Automatic Update Detection

The template engine uses a well-designed caching mechanism. When a template file is first read, it is cached in memory. After it is retrieved directly from the cache to improve efficiency. Additionally, the template engine provides an automatic update detection mechanism that can monitor and refresh the cache when the template file is modified externally.
