# Request Input - Object Handling

## Object Conversion

Object conversion is very common in request processing. We recommend defining inputs and outputs as `struct` objects to facilitate structured parameter input and output maintenance. The GoFrame framework supports very convenient object conversion, allowing client-side submitted parameters such as `Query` parameters, form parameters, content parameters, `JSON/XML`, etc., to be easily converted into specified `struct` objects, and supports the maintenance of submission parameter and `struct` attribute mapping relationships.

Object conversion methods use the `Parse` method or `Get*Struct` methods of the `Request` object. For specific method definitions, please refer to the API documentation: [ghttp.Request](https://pkg.go.dev/github.com/gogf/gf/v2/net/ghttp#Request).

## Parameter Mapping

### Default Rules

If client-side submitted parameters need to be mapped to struct properties defined on the server side, the default mapping relationship can be used, which is very convenient. The default conversion rules are as follows:

- The properties to be matched in the `struct` must be `public properties` (first letter capitalized).
- Parameter names will automatically match `struct` properties in a `case-insensitive` manner and ignore `-/_/space` symbols.
- If a match is successful, the key-value is assigned to the property; if not, the key-value is ignored.

Here are several matching examples:

```markdown
| Map Key Name  | Struct Property| Match |
|---------------|----------------|-------|
| name          | Name           | match |
| Email         | Email          | match |
| nickname      | NickName       | match |
| NICKNAME      | NickName       | match |
| Nick-Name     | NickName       | match |
| nick_name     | NickName       | match |
| nick name     | NickName       | match |
```

> Since the underlying object conversion implementation uses the `gconv` module, it also supports `c/gconv/json` tags. For more detailed rules, you can refer to the [Type Conversion - Struct Conversion](/docs/core-component/type-convert/struct).

### Custom Rules

Please use custom mapping rules in business scenarios where the object property and parameter names differ greatly; otherwise, use the default parameter mapping rules. This is because a large number of custom rule tags can increase code maintenance costs.

Custom parameter mapping rules can be implemented by binding tags to struct properties, with tag names being p/param/params. For example:

```go
type User struct {
    Id    int
    Name  string
    Pass1 string `p:"password1"`
    Pass2 string `p:"password2"`
}
```

Here, we use the `p` tag to specify the parameter name bound to the property. The `password1` parameter will be mapped to the `Pass1` property, and `password2` will be mapped to the `Pass2` property. Other properties can use the default conversion rules and do not need to set `tags`.

## Parse Conversion

We can also use the `Parse` method to achieve `struct` conversion. This method is a convenient method that automatically performs conversion and data validation internally. However, if the `struct` does not have validation `tags`, the validation logic will not be executed.

> Starting from `GoFrame version 2`, we recommend using a structured approach to define route methods, managing input and output data structures and their instance objects more conveniently. For details, please refer to: [Route Registration - Standard Routing](/docs/web-development/router/registry/standard).

***Usage Example***

```go
package main

import (
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/net/ghttp"
)

type RegisterReq struct {
    Name  string
    Pass  string `p:"password1"`
    Pass2 string `p:"password2"`
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

In this example, we define two structures: `RegisterReq` for parameter reception and `RegisterRes` for data return.

We use `r.Parse(&req)` to convert the parameters submitted by the client into the `RegisterReq` object. When the conversion is successful, the `req` variable will be initialized and assigned values (default is nil); otherwise, this method returns `err` and the `req` variable is nil. The return data structure is defined by `RegisterRes`, and the return format is JSON, implemented by `r.Response.WriteJsonExit`. This method converts `RegisterRes` into JSON format according to its internal json tags and exits the current service method, no longer executing the subsequent logic of this service method.

To demonstrate the test effect, we return the `RegisterReq` object in the normal return result `Data` property. Since this object does not have `json` tags bound, the returned `JSON` fields will be the names of its properties.

After execution, we test with the `curl` tool:

```bash
$ curl "http://127.0.0.1:8199/register?name=john&password1=123&password2=456"
{"code":0,"error":"","data":{"Name":"john","Pass":"123","Pass2":"456"}}
```

```bash
$ curl -d "name=john&password1=123&password2=456" -X POST "http://127.0.0.1:8199/register"
{"code":0,"error":"","data":{"Name":"john","Pass":"123","Pass2":"456"}}
```

We used both `GET` and `POST` methods for testing and can see that the server can perfectly obtain the submitted parameters and complete the object conversion.
