# Response - Template Parsing

## Related Method

```go
func (r *Response) WriteTpl(tpl string, params ...gview.Params) error
func (r *Response) WriteTplContent(content string, params ...gview.Params) error
func (r *Response) WriteTplDefault(params ...gview.Params) error
func (r *Response) ParseTpl(tpl string, params ...gview.Params) (string, error)
func (r *Response) ParseTplContent(content string, params ...gview.Params) (string, error)
func (r *Response) ParseTplDefault(params ...gview.Params) (string, error)
```

The `Response` object supports the parsing and output of template files/content, or the parsing and return of template files/content. Unlike directly using the template object to parse templates, the `Response` parsing supports some built-in variables related to the request. Template parsing includes the following methods:

- `WriteTpl*` methods are used for template output, parsing and outputting template files, or directly parsing and outputting given template content.
- `ParseTpl*` methods are used for template parsing, parsing template files or template content, and returning the parsed content.
When parsing templates, the underlying component will automatically obtain the current chain's Context variables through the `Request` object and pass them to the template engine, so developers do not need to explicitly pass the Context variables to the template engine.

## Built-in Variables

- **Config**: Accesses the default configuration management (`config.toml`) object configuration items.
  - Usage: `{{.Config.value}}`

- **Cookie**: Accesses the current request's `Cookie` object parameter values.
  - Usage: `{{.Cookie.keyname}}`

- **Session**: Accesses the current request's `Session` object parameter values.
  - Usage: `{{.Session.keyname}}`

- **Query**: Accesses the current `Query` String request parameter values.
  - Usage: `{{.Query.keyname}}`

- **Form**: Accesses the current form request parameter values.
  - Usage: `{{.Form.keyname}}`

- **Request**: Accesses the current request parameter values (regardless of the parameter submission method).
  - Usage: `{{.Request.keyname}}`

## Example Usage

```go
package main

import (
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/net/ghttp"
)

func main() {
    s := g.Server()
    s.BindHandler("/", func(r *ghttp.Request){
        r.Cookie.Set("theme", "default")
        r.Session.Set("name", "john")
        content := `Config:{{.Config.redis.cache}}, Cookie:{{.Cookie.theme}}, Session:{{.Session.name}}, Query:{{.Query.name}}`
        r.Response.WriteTplContent(content, nil)
    })
    s.SetPort(8199)
    s.Run()
}
```

The content of `config.toml` is:

```toml
# Redis database configuration
[redis]
    disk  = "127.0.0.1:6379,0"
    cache = "127.0.0.1:6379,1"
```

After execution, visiting `http://127.0.0.1:8199/?name=john` will output the result:

```bash
Config:127.0.0.1:6379,1, Cookie:default, Session:john, Query:john
```
