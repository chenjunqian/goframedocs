# Response - File Download

The `Response` object supports file downloads.

## Related Methods

```go
func (r *Response) ServeFile(path string, allowIndex ...bool)
func (r *Response) ServeFileDownload(path string, name ...string)
```

## ServeFile

The `ServeFile` method automatically recognizes the file format through the given file path `path`. If it's a directory or text content, it will directly display the file content. If the `path` parameter is a directory, the second parameter `allowIndex` controls whether to display the list of files in the directory.

***Example Usage***

```go
package main

import (
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/net/ghttp"
)

func main() {
    s := g.Server()
    s.BindHandler("/", func(r *ghttp.Request) {
        r.Response.ServeFile("test.txt")
    })
    s.SetPort(8999)
    s.Run()
}
```

Visiting `http://127.0.0.1:8999` will display the file content on the page.

## ServeFileDownload

`ServeFileDownload` is a frequently used method that directly guides the client to download the file at the specified path and allows you to give a new name to the downloaded file. `ServeFileDownload` uses streaming download control, which occupies less memory.

***Example Usage***

Change the `ServeFile` method in the previous example to `ServeFileDownload`:

```go
package main

import (
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/net/ghttp"
)

func main() {
    s := g.Server()
    s.BindHandler("/", func(r *ghttp.Request) {
        r.Response.ServeFileDownload("test.txt")
    })
    s.SetPort(8999)
    s.Run()
}
```

Visiting `http://127.0.0.1:8999` will prompt the file to be downloaded instead of displaying the page content.
