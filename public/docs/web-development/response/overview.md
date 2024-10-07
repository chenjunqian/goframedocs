# Response - Overview

The data return of the `HTTP Server` is implemented through the `ghttp.Response` object, which implements the standard library's `http.ResponseWriter` interface. Data output is achieved using the `Write*` related methods and adopts a Buffer mechanism, making the data processing efficient. At any time, you can use the `OutputBuffer` method to output the buffer data to the client and clear the buffer.

## Common Methods

For a more detailed list of interfaces, please refer to [ghttp.Response](https://pkg.go.dev/github.com/gogf/gf/v2/net/ghttp#Response).

```go
func (r *Response) Write(content ...interface{})
func (r *Response) WriteExit(content ...interface{})
func (r *Response) WriteJson(content interface{}) error
func (r *Response) WriteJsonExit(content interface{}) error
func (r *Response) WriteJsonP(content interface{}) error
func (r *Response) WriteJsonPExit(content interface{}) error
func (r *Response) WriteOver(content ...interface{})
func (r *Response) WriteOverExit(content ...interface{})
func (r *Response) WriteStatus(status int, content ...interface{})
func (r *Response) WriteStatusExit(status int, content ...interface{})
func (r *Response) WriteTpl(tpl string, params ...gview.Params) error
func (r *Response) WriteTplContent(content string, params ...gview.Params) error
func (r *Response) WriteTplDefault(params ...gview.Params) error
func (r *Response) WriteXml(content interface{}, rootTag ...string) error
func (r *Response) WriteXmlExit(content interface{}, rootTag ...string) error
func (r *Response) Writef(format string, params ...interface{})
func (r *Response) WritefExit(format string, params ...interface{})
func (r *Response) Writefln(format string, params ...interface{})
func (r *Response) WriteflnExit(format string, params ...interface{})
func (r *Response) Writeln(content ...interface{})
func (r *Response) WritelnExit(content ...interface{})
```

## Brief Explanation

- `Write*` methods are used to append data to the return data buffer. Parameters can be any data format, and the internal assertion automatically analyzes the parameters.
- `Write*Exit` methods are used to append data to the return data buffer and then exit the current HTTP Handler method, which can be used as an alternative to the return statement.
- `WriteOver*` methods are used for overwrite buffer writing, where the original buffer data will be replaced with the newly written data.
- `WriteStatus*` methods are used to set the status code returned for the current request execution.
- `WriteJson*`/`WriteXml` methods are convenient methods for specific data format outputs.
- `WriteTpl*` methods are used for template output, parsing and outputting template files, or directly parsing and outputting given template content.
- For more methods, see the interface documentation.

Additionally, it's worth mentioning that `Header` operations can be implemented using standard library methods, for example:

```go
Response.Header().Set("Content-Type", "text/plain; charset=utf-8")
```
