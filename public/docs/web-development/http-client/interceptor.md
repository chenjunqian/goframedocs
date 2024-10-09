# HTTPClient - Interceptors

## Basic Introduction

`HTTPClient` supports powerful `interceptors/middleware` features, which enable global request interception and injection for the client. This includes `modifying/injecting` submission parameters, modifying/injecting return parameters, and client-based parameter validation, among other things. Middleware injection is implemented through the following method:

```go
func (c *Client) Use(handlers ...HandlerFunc) *Client
```

In the middleware, the `Next` method is used to execute the next step in the process. The `Next` method is defined as follows:

```go
func (c *Client) Next(req *http.Request) (*Response, error)
```

## Middleware Types

`HTTPClient` middleware functions similarly to `HTTPServer` middleware, also divided into two types: pre-middleware and post-middleware.

### Pre-Middleware

The processing logic is before the `Next` method and is formatted as follows:

```go
c := g.Client()
c.Use(func(c *gclient.Client, r *http.Request) (resp *gclient.Response, err error) {
    // Custom processing logic
    resp, err = c.Next(r)
    return resp, err  
})
```

### Post-Middleware

The processing logic is after the `Next` method and is formatted as follows:

```go
c := g.Client()
c.Use(func(c *gclient.Client, r *http.Request) (resp *gclient.Response, err error) {
    resp, err = c.Next(r)
    // Custom processing logic
    return resp, err
})
```

## Usage Example

Let's look at a code example to better introduce the usage. This example adds an interceptor to the client to inject custom additional parameters into the submitted JSON data. These additional parameters implement volume signature-related parameters for the submitted parameters, which is a simple version of interface parameter security verification.

### Server Side

The server-side logic is simple: it parses the `JSON` parameters submitted by the client as a map and then constructs a `JSON` string to return to the client.

> Often, the server side also needs to perform signature verification through middleware. I took a shortcut here and directly returned the data submitted by the client. Please understand the difficulties of document maintenance authors.

```go
package main

import (
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/net/ghttp"
)

func main() {
    s := g.Server()
    s.Group("/", func(group *ghttp.RouterGroup) {
        group.ALL("/", func(r *ghttp.Request) {
            r.Response.Write(r.GetMap())
        })
    })
    s.SetPort(8199)
    s.Run()
}
```

### Client Side

The client-side logic implements basic client parameter submission, interceptor injection, signature-related parameter injection, and signature parameter generation.

```go
package main

import (
    "bytes"
    "fmt"
    "io/ioutil"
    "net/http"

    "github.com/gogf/gf/v2/container/garray"
    "github.com/gogf/gf/v2/crypto/gmd5"
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/internal/json"
    "github.com/gogf/gf/v2/net/gclient"
    "github.com/gogf/gf/v2/os/gctx"
    "github.com/gogf/gf/v2/os/gtime"
    "github.com/gogf/gf/v2/util/gconv"
    "github.com/gogf/gf/v2/util/guid"
    "github.com/gogf/gf/v2/util/gutil"
)

const (
    appId     = "123"
    appSecret = "456"
)

// Inject unified interface signature parameters
func injectSignature(jsonContent []byte) []byte {
    var m map[string]interface{}
    _ = json.Unmarshal(jsonContent, &m)
    if len(m) > 0 {
        m["appid"] = appId
        m["nonce"] = guid.S()
        m["timestamp"] = gtime.Timestamp()
        var (
            keyArray   = garray.NewSortedStrArrayFrom(gutil.Keys(m))
            sigContent string
        )
        keyArray.Iterator(func(k int, v string) bool {
            sigContent += v
            sigContent += gconv.String(m[v])
            return true
        })
        m["signature"] = gmd5.MustEncryptString(gmd5.MustEncryptString(sigContent) + appSecret)
        jsonContent, _ = json.Marshal(m)
    }
    return jsonContent
}

func main() {
    c := g.Client()
    c.Use(func(c *gclient.Client, r *http.Request) (resp *gclient.Response, err error) {
        bodyBytes, _ := ioutil.ReadAll(r.Body)
        if len(bodyBytes) > 0 {
            // Inject signature-related parameters and modify the original submission parameters of Request
            bodyBytes = injectSignature(bodyBytes)
            r.Body = ioutil.NopCloser(bytes.NewBuffer(bodyBytes))
            r.ContentLength = int64(len(bodyBytes))
        }
        return c.Next(r)
    })
    content := c.ContentJson().PostContent(gctx.New(), "http://127.0.0.1:8199/", g.Map{
        "name": "goframe",
        "site": "https://goframe.org",
    })
    fmt.Println(content)
}
```

### Running Tests

First, run the server:

```bash
go run server.go 
```

Then, run the client:

```bash
go run client.go 
```

You can see that the parameters received by the server have several additional items, including `appid`, `nonce`, `timestamp`, `signature`. These parameters are often needed for signature verification algorithms.
