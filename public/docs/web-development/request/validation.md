# Request Input - Request Validation

The `Request` object supports very robust request validation capabilities by binding `v` tags to struct attributes. Since the underlying validation functionality is implemented through the `gvalid` module, for more detailed validation rules and introductions, please refer to the [Data Validation - Struct Validation](/docs/core-component/data-valid/types) chapter.

> The following example code's approach to converting request parameters to structs is suitable for the framework's `v1` version. Starting from version `v2`, it is recommended to implement automated parameter struct conversion and validation through standardized routing: [Route Registration - Standard Routing](/docs/web-development/router/registry/standard).

## Example 1: Basic Usage

We will adjust the previous example to add `v` validation tags.

```go
package main

import (
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/net/ghttp"
)

// RegisterReq is the data structure for registration requests.
type RegisterReq struct {
    Name  string `p:"username"  v:"required|length:4,30#Please enter your account|Account length should be between {min} and {max} characters"`
    Pass  string `p:"password1" v:"required|length:6,30#Please enter your password|Password is too short"`
    Pass2 string `p:"password2" v:"required|length:6,30|same:password1#Please confirm your password|Password is too short|Passwords do not match"`
}

// RegisterRes is the data structure for registration responses.
type RegisterRes struct {
    Code  int         `json:"code"`
    Error string      `json:"error"`
    Data  interface{} `json:"data"`
}

func main() {
    s := g.Server()
    s.Group("/", func(group *ghttp.RouterGroup) {
        group.ALL("/register", func(r *ghttp.Request) {
            var req *RegisterReq
            if err := r.Parse(&req); err != nil {
                r.Response.WriteJsonExit(RegisterRes{
                    Code:  1,
                    Error: err.Error(),
                })
            }
            // ...
            r.Response.WriteJsonExit(RegisterRes{
                Data: req,
            })
        })
    })
    s.SetPort(8199)
    s.Run()
}
```

In this example, we define two structs: `RegisterReq` for receiving parameters and `RegisterRes` for returning data. Since the interface returns `JSON` data structures, only the returning struct has `json` tags, while the receiving struct only has `p` tags. Because `RegisterReq` is only used for receiving parameters, there is no need to set return `json` tags.

> The `p` tag is optional. By default, it will perform attribute name matching and conversion according to the rules of ignoring special characters and being case-insensitive, which meets most business scenarios.

To demonstrate the test effect, we return the `RegisterReq` object in the normal result `Data` property. Since this object does not have `json` tags bound, the returned `JSON` fields will be its attribute names.

After execution, we test with the `curl` tool:

```bash
$ curl "http://127.0.0.1:8199/register?name=john&password1=123456&password2=123456"
{"code":0,"error":"","data":{"Name":"john","Pass":"123456","Pass2":"123456"}}

$ curl "http://127.0.0.1:8199/register?name=john&password1=123456&password2=12345"
{"code":1,"error":"Password is too short","data":null}

$ curl "http://127.0.0.1:8199/register"
{"code":1,"error":"Please enter your account","data":null}
```

## Example 2: Validation Error Handling

> The latest version only returns the ***first error***.

It can be seen in the above example that when the request validation fails, all validation errors are returned, which is not very user-friendly. When an error occurs, we can convert the validation error into a `gvalid.Error` interface object, and then control the error return through flexible methods.

```go
package main

import (
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/net/ghttp"
    "github.com/gogf/gf/v2/util/gvalid"
)

type RegisterReq struct {
    Name  string `p:"username"  v:"required|length:4,30#Please enter your account|Account length should be between {min} and {max} characters"`
    Pass  string `p:"password1" v:"required|length:6,30#Please enter your password|Password is too short"`
    Pass2 string `p:"password2" v:"required|length:6,30|same:password1#Please confirm your password|Password is too short|Passwords do not match"`
}

type RegisterRes struct {
    Code  int         `json:"code"`
    Error string      `json:"error"`
    Data  interface{} `json:"data"`
}

func main() {
    s := g.Server()
    s.Group("/", func(group *ghttp.RouterGroup) {
        group.ALL("/register", func(r *ghttp.Request) {
            var req *RegisterReq
            if err := r.Parse(&req); err != nil {
                // Validation error.
                if v, ok := err.(gvalid.Error); ok {
                    r.Response.WriteJsonExit(RegisterRes{
                        Code:  1,
                        Error: v.FirstError().Error(),
                    })
                }
                // Other errors.
                r.Response.WriteJsonExit(RegisterRes{
                    Code:  1,
                    Error: err.Error(),
                })
            }
            // ...
            r.Response.WriteJsonExit(RegisterRes{
                Data: req,
            })
        })
    })
    s.SetPort(8199)
    s.Run()
}
```

It can be seen that after an error occurs, we can determine whether the error is a validation error through `err.(gvalid.Error)` assertion, and if so, return the first validation error instead of all of them. For more detailed error control methods, please refer to the [Data Validation - Validation Results](/docs/core-component/data-valid/result).

Additionally, we can use `gerror.Current` to obtain the first error message instead of using assertion judgment. For example:

```go
var req *RegisterReq
if err := r.Parse(&req); err != nil {
    r.Response.WriteJsonExit(RegisterRes{
        Code:  1,
        Error: gerror.Current(err).Error(),
    })
}
```

After execution, we test with the `curl` tool:

```bash
$ curl "http://127.0.0.1:8199/register"
{"code":1,"error":"Please enter your account","data":null}

$ curl "http://127.0.0.1:8199/register?name=john&password1=123456&password2=1234567"
{"code":1,"error":"Passwords do not match","data":null}
```
