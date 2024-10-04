# Request Input 🔥

The request input relies on the `ghttp.Request` object, which inherits the underlying `http.Request` object. The `ghttp.Request` object includes a corresponding response output object `Response` for data return processing.

Related methods: [ghttp.Request](https://pkg.go.dev/github.com/gogf/gf/v2/net/ghttp#Request)

## Basic Introduction

As you can see, the Request object has a very rich set of parameter retrieval methods. Commonly used methods are as follows:

- **Get**: A common method that simplifies parameter retrieval, an alias for `GetRequest`.
- **GetQuery**: Retrieves parameters passed through the GET method, including Query String and Body parameter parsing.
- **GetForm**: Retrieves parameters passed through the form method. The Content-Type for form submission is often `application/x-www-form-urlencoded`, `application/form-data`, `multipart/form-data`, `multipart/mixed`, etc.
- **GetRequest**: Retrieves all parameters submitted by the client, covering according to parameter priority regardless of the submission method.
- **Get*Struct**: Binds all request parameters of a specified submission type to a specified struct object. Note that the given parameter is an object pointer. In most scenarios, the `Parse` method is used to convert request data into a request object, which is detailed in later sections.
- **GetBody/GetBodyString**: Retrieves the original data submitted by the client, which is the original data written into the body by the client, regardless of the HTTP method. For example, when the client submits JSON/XML data format, this method can be used to retrieve the original submission data.
- **GetJson**: Automatically parses the original request information into a `gjson.Json` object pointer. The `gjson.Json` object is specifically introduced in the "Common Encoding and Decoding - gjson" section.
- **Exit***: Used for request process exit control, detailed in the following explanation of this chapter.

## Submission Methods

In the `GoFrame` framework, parameter retrieval is not distinguished by `HTTP Method` but by parameter submission type. For example, form parameters are submitted through `HTTP Methods`: `POST`, `INPUT`, `DELETE`. On the server side, parameters are not retrieved through `GetPost/GetInput/GetDelete` but uniformly through the `GetForm` method for form parameters. The same applies to other `HTTP Methods`.

In the `GoFrame` framework, there are several submission types:

- **Router**: Route parameters. Derived from route rule matching.
- **Query**: Query parameters. URL Query String parameter parsing, e.g., `http://127.0.0.1/index?id=1&name=john` with `id=1&name=john`.
- **Form**: Form parameters. The most common submission method, often with a Content-Type of `application/x-www-form-urlencoded`, `multipart/form-data`, `multipart/mixed`.
- **Body**: Content parameters. Parameters obtained and parsed from the Body, often used for JSON/XML request submissions.
- **Custom**: Custom parameters, often managed by `SetParam/GetParam` methods in the server-side middleware or service functions.

## Parameter Types

The parameter retrieval method can ***automatically convert*** data of a specified key name. For example: `http://127.0.0.1:8199/?amount=19.66`, through `Get(xxx).String()` will return the string type of `19.66`, `Get(xxx).Float32()`/`Get(xxx).Float64()` will return the float32 and float64 types of the value `19.66`. However, `Get(xxx).Int()`/`Get(xxx).Uint()` will return `19` (if the parameter is a float-type string, it will be converted to an integer type by rounding down).

> You must have noticed that the retrieved parameters are `generic variables`. Based on these `generic variables`, you can call the corresponding methods to convert them into the corresponding data types as needed.

## Usage Example

```go
package main

import (
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/net/ghttp"
)

func main() {
    s := g.Server()
    s.BindHandler("/", func(r *ghttp.Request) {
        r.Response.Writeln(r.Get("amount").String())
        r.Response.Writeln(r.Get("amount").Int())
        r.Response.Writeln(r.Get("amount").Float32())
    })
    s.SetPort(8199)
    s.Run()
}
```

After execution, when we access the address `http://127.0.0.1:8199/?amount=19.66`, the page output is:

```bash
19.66
19
19.66
```

## Parameter Priority

Consider a scenario where the same parameter name exists in different submission methods. In the `GoFrame` framework, according to different retrieval methods, parameters will be obtained according to different priorities, and parameters submitted by methods with higher priority will override other methods with the same parameter name. The priority rules are as follows:

- **Get and GetRequest methods**: `Router < Query < Body < Form < Custom`, which means custom parameters have the highest priority, followed by Form form parameters, then Body submission parameters, and so on. For example, if both Query and Form submit a parameter with the same name `id`, with parameter values `1` and `2`, then `Get("id")`/`GetForm("id")` will return `2`, while `GetQuery("id")` will return `1`.
- **GetQuery method**: `Query > Body`, which means query string parameters will override Body parameters with the same name. For example, if both Query and Body submit a parameter with the same name `id`, with parameter values `1` and `2`, then `Get("id")` will return `2`, while `GetQuery("id")` will return `1`.
- **GetForm method**: Since this type of method is only used to obtain Form form parameters, there is not much difference in priority.

***Usage Example***

```go
package main

import (
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/net/ghttp"
)

func main() {
    s := g.Server()
    s.BindHandler("/input", func(r *ghttp.Request) {
        r.Response.Writeln(r.Get("amount"))
    })
    s.BindHandler("/query", func(r *ghttp.Request) {
        r.Response.Writeln(r.GetQuery("amount"))
    })
    s.SetPort(8199)
    s.Run()
}
```

After execution, we test with the curl tool:

```bash
$ curl -d "amount=1" -X POST "http://127.0.0.1:8199/input?amount=100"
1
$ curl -d "amount=1" -X POST "http://127.0.0.1:8199/query?amount=100"
100
```

It can be seen that when we access the `/input` route, the route method uses the `Get` method to obtain the `amount` parameter. According to the same name priority rule, it returns `1`, which is the parameter passed in the body. When we access through the `/query` route, the route method internally uses the `GetQuery` method to obtain the `amount` parameter, so it gets the amount value in the query string parameter, returning `100`.

## Case Sensitivity

Please note that parameter names are case-sensitive. For example, the parameters `name` and `Name` submitted by the client are two parameters. Since the server-side retrieval is done through string names, case sensitivity does not cause any issues. However, if the server-side receives an API object, some attention may be needed. Let's look at an example.

Server-side:

```go
package main

import (
    "context"

    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/net/ghttp"
)

type Controller struct{}

type PathReq struct {
    g.Meta `path:"/api/v1/*path" method:"post"`
    Path   string
}

type PathRes struct {
    Path string
}

func (c *Controller) Path(ctx context.Context, req *PathReq) (res *PathRes, err error) {
    return &PathRes{Path: req.Path}, nil
}

func main() {
    s := g.Server()
    s.SetPort(8199)
    s.Use(ghttp.MiddlewareHandlerResponse)
    s.Group("/", func(group *ghttp.RouterGroup) {
        group.Bind(&Controller{})
    })
    s.Run()
}
```

The original intention of the server-side interface design is to define a route parameter `path` and receive it through the `Path` attribute of the API object.

Client-side:

```go
package main

import (
    "fmt"

    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/os/gctx"
)

func main() {
    var (
        ctx    = gctx.New()
        client = g.Client()
    )
    client.SetPrefix("http://127.0.0.1:8199")
    for i := 0; i < 10; i++ {
        fmt.Println(client.PostContent(ctx, "/api/v1/user/info", `{"Path":"user/profile"}`))
    }
}
```

According to our understanding, after the client submits, the server should receive the route parameter `path` with the value `user/info`. However, it's strange that due to a program bug, the client also submits a JSON in the Body with the parameter name `Path` and the parameter value `user/profile`. So, which value will the `Path` attribute in the server-side API object be?

We execute the client repeatedly and find that the output results are all:

```json
{"code":0,"message":"","data":{"Path":"user/profile"}}
{"code":0,"message":"","data":{"Path":"user/profile"}}
{"code":0,"message":"","data":{"Path":"user/profile"}}
{"code":0,"message":"","data":{"Path":"user/profile"}}
{"code":0,"message":"","data":{"Path":"user/profile"}}
{"code":0,"message":"","data":{"Path":"user/profile"}}
{"code":0,"message":"","data":{"Path":"user/profile"}}
{"code":0,"message":"","data":{"Path":"user/profile"}}
{"code":0,"message":"","data":{"Path":"user/profile"}}
{"code":0,"message":"","data":{"Path":"user/profile"}}
```

That is, the parameters are all the values submitted in the Body, not the values in the route parameters. In fact, due to the case sensitivity of parameters, the server receives two parameters at this time, one is the route parameter `path`, and the other is the `Path` submitted by the Body JSON. When the server converts the API parameter object, since the attribute `Path` matches the `Path` submitted in the Body JSON more closely, it uses the value of `Path` from the Body JSON.
