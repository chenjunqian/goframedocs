# Template Engine - Others

## I18N Support

The template engine in GoFrame supports `I18N` (internationalization), allowing different requests or pages to be rendered in different languages by injecting a specific `I18N` language into the context. For example:

```go
package main

import (
    "context"
    "fmt"
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/i18n/gi18n"
)

func main() {
    var (
        ctxCN   = gi18n.WithLanguage(context.TODO(), "zh-CN")
        ctxJa   = gi18n.WithLanguage(context.TODO(), "ja")
        content = `{{.name}} says "{#hello}{#world}!"`
    )

    result1, _ := g.View().ParseContent(ctxCN, content, g.Map{
        "name": "john",
    })
    fmt.Println(result1)

    result2, _ := g.View().ParseContent(ctxJa, content, g.Map{
        "name": "john",
    })
    fmt.Println(result2)
}
```

Output:

After execution, the output will be as follows (ensure that the current directory has I18N translation configuration files):

```bash
john says "你好世界!"
john says "こんにちは世界!"
```

## HTTP Object View

The GoFrame framework's WebServer provides basic template parsing methods in the response object:

```go
func (r *Response) WriteTpl(tpl string, params map[string]interface{}, funcMap ...map[string]interface{}) error
func (r *Response) WriteTplContent(content string, params map[string]interface{}, funcMap ...map[string]interface{}) error
```

- `WriteTpl` is used to output a template file.
- `WriteTplContent` is used to directly parse and output template content.

Example:

```go
package main

import (
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/net/ghttp"
)

func main() {
    s := g.Server()
    s.BindHandler("/", func(r *ghttp.Request) {
        r.Cookie.Set("theme", "default")
        r.Session.Set("name", "john")
        r.Response.WriteTplContent(`Cookie:{{.Cookie.theme}}, Session:{{.Session.name}}`, nil)
    })
    s.SetPort(8199)
    s.Run()
}
```

Output:

```bash
Cookie:default, Session:john
```

## Controller View Management

GoFrame provides good template engine support for routing controllers, managed by the `gmvc.View` view object, which offers good data isolation. The controller view is designed to be thread-safe, allowing asynchronous operations in multithreaded environments.

Controller registration is similar to the PHP execution process, which is relatively inefficient. Therefore, it is not recommended to use controller registration in the future.

```go
func (view *View) Assign(key string, value interface{})
func (view *View) Assigns(data gview.Params)

func (view *View) Parse(file string) ([]byte, error)
func (view *View) ParseContent(content string) ([]byte, error)

func (view *View) Display(files ...string) error
func (view *View) DisplayContent(content string) error

func (view *View) LockFunc(f func(vars map[string]interface{}))
func (view *View) RLockFunc(f func(vars map[string]interface{}))
```

Example:

```go
package main

import (
    "github.com/gogf/gf/v2/net/ghttp"
    "github.com/gogf/gf/v2/frame/gmvc"
)

type ControllerTemplate struct {
    gmvc.Controller
}

func (c *ControllerTemplate) Info() {
    c.View.Assign("name", "john")
    c.View.Assigns(map[string]interface{}{
        "age"   : 18,
        "score" : 100,
    })
    c.View.Display("index.tpl")
}

func main() {
    s := ghttp.GetServer()
    s.BindController("/template", new(ControllerTemplate))
    s.SetPort(8199)
    s.Run()
}
```

`index.tpl` Content

```html
<html>
    <head>
        <title>gf template engine</title>
    </head>
    <body>
        <p>Name: {{.name}}</p>
        <p>Age:  {{.age}}</p>
        <p>Score:{{.score}}</p>
    </body>
</html>
```

After execution, visit [http://127.0.0.1:8199/template/info](http://127.0.0.1:8199/template/info) to see the template rendered on the page. If the page shows an error indicating that the template file cannot be found, it's okay because the template directory has not been set here. By default, it is the current executable file's directory (in Linux & Mac, it is the `/tmp` directory; in Windows, it is `C:\Documents and Settings\Username\Local Settings\Temp`).

The given template file parameter `file` should include the full file name suffix, such as `index.tpl`, `index.html`, etc. The template engine has no requirements for template file suffixes; users can fully customize them. In addition, the template file parameter also supports the absolute path of the file (the complete file path).

Direct Template Content Parsing:

```go
package main

import (
    "github.com/gogf/gf/v2/net/ghttp"
    "github.com/gogf/gf/v2/frame/gmvc"
)

type ControllerTemplate struct {
    gmvc.Controller
}

func (c *ControllerTemplate) Info() {
    c.View.Assign("name", "john")
    c.View.Assigns(map[string]interface{}{
        "age"   : 18,
        "score" : 100,
    })
    c.View.DisplayContent(`
        <html>
            <head>
                <title>gf template engine</title>
            </head>
            <body>
                <p>Name: {{.name}}</p>
                <p>Age:  {{.age}}</p>
                <p>Score:{{.score}}</p>
            </body>
        </html>
    `)
}

func main() {
    s := ghttp.GetServer()
    s.BindController("/template", new(ControllerTemplate{}))
    s.SetPort(8199)
    s.Run()
}
```

Output:

After execution, visit [http://127.0.0.1:8199/template/info](http://127.0.0.1:8199/template/info) to see the parsed content:

```html
<html>
    <head>
        <title>gf template engine</title>
    </head>
    <body>
        <p>Name: john</p>
        <p>Age:  18</p>
        <p>Score:100</p>
    </body>
</html>
```
