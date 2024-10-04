# Request Input - JSON/XML

Starting from `GoFrame version v1.11`, the `Request` object provides native support for `JSON/XML` data formats submitted by clients, offering developers more convenient data retrieval features to further improve development efficiency.

## Example 1: Simple Example

```go
package main

import (
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/net/ghttp"
)

func main() {
    s := g.Server()
    s.BindHandler("/", func(r *ghttp.Request) {
        r.Response.Writef("name: %v, pass: %v", r.Get("name"), r.Get("pass"))
    })
    s.SetPort(8199)
    s.Run()
}
```

After execution, we can test it by submitting data with the `curl` tool:

***Query Data Format***

```bash
$ curl "http://127.0.0.1:8199/?name=john&pass=123"
name: john, pass: 123
```

***Form Submission***

```bash
$ curl -d "name=john&pass=123" "http://127.0.0.1:8199/"
name: john, pass: 123
```

***JSON Data Format***

```bash
$ curl -d '{"name":"john","pass":"123"}' "http://127.0.0.1:8199/"
name: john, pass: 123
```

***XML Data Format***

```bash
$ curl -d '<?xml version="1.0" encoding="UTF-8"?><doc><name>john</name><pass>123</pass></doc>' "http://127.0.0.1:8199/"
name: john, pass: 123
```

```bash
$ curl -d '<doc><name>john</name><pass>123</pass></doc>' "http://127.0.0.1:8199/"
name: john, pass: 123
```

## Example 2: Object Conversion and Validation

```go
package main

import (
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/net/ghttp"
    "github.com/gogf/gf/v2/util/gvalid"
)

type RegisterReq struct {
    Name  string `p:"username"  v:"required|length:6,30#Please enter your account|Account length should be between {min} and {max} characters"`
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
    s.BindHandler("/register", func(r *ghttp.Request) {
        var req *RegisterReq
        if err := r.Parse(&req); err != nil {
            // Validation error.
            if v, ok := err.(gvalid.Error); ok {
                r.Response.WriteJsonExit(RegisterRes{
                    Code:  1,
                    Error: v.FirstString(),
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
    s.SetPort(8199)
    s.Run()
}
```

After execution, we can test it by submitting data with the `curl` tool:

***JSON Data Format***

```bash
$ curl -d '{"username":"johngcn","password1":"123456","password2":"123456"}' "http://127.0.0.1:8199/register"
{"code":0,"error":"","data":{"Name":"johngcn","Pass":"123456","Pass2":"123456"}}
```

```bash
$ curl -d '{"username":"johngcn","password1":"123456","password2":"1234567"}' "http://127.0.0.1:8199/register"
{"code":1,"error":"Passwords do not match","data":null}
```

It can be seen that the `JSON` content we submitted has also been intelligently converted into a struct object by the `Parse` method.

***XML Data Format***

```bash
$ curl -d '<?xml version="1.0" encoding="UTF-8"?><doc><username>johngcn</username><password1>123456</password1><password2>123456</password2></doc>' "http://127.0.0.1:8199/register"
{"code":0,"error":"","data":{"Name":"johngcn","Pass":"123456","Pass2":"123456"}}
```

```bash
$ curl -d '<?xml version="1.0" encoding="UTF-8"?><doc><username>johngcn</username><password1>123456</password1><password2>1234567</password2></doc>' "http://127.0.0.1:8199/register"
{"code":1,"error":"Passwords do not match","data":null}
```

It can be seen that the XML content we submitted has also been intelligently converted into a struct object by the `Parse` method.
