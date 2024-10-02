# Routing - Rule

The `GoFrame` framework has built-in very powerful routing capabilities, offering superior routing features compared to any similar framework. It supports popular named matching rules, fuzzy matching rules, and field matching rules, and provides an excellent priority management mechanism.

## Example

Before diving into the core content of this chapter, let's look at a simple example of dynamic routing:

```go
package main

import (
    "github.com/gogf/gf/v2/net/ghttp"
    "github.com/gogf/gf/v2/frame/g"
)

func main() {
    s := g.Server()
    s.BindHandler("/:name", func(r *ghttp.Request){
       r.Response.Writeln(r.Router.Uri)
    })
    s.BindHandler("/:name/update", func(r *ghttp.Request){
        r.Response.Writeln(r.Router.Uri)
    })
    s.BindHandler("/:name/:action", func(r *ghttp.Request){
        r.Response.Writeln(r.Router.Uri)
    })
    s.BindHandler("/:name/*any", func(r *ghttp.Request){
       r.Response.Writeln(r.Router.Uri)
    })
    s.BindHandler("/user/list/{field}.html", func(r *ghttp.Request){
        r.Response.Writeln(r.Router.Uri)
    })
    s.SetPort(8199)
    s.Run()
}
```

In the above example, three types of fuzzy matching routing rules supported by the `GoFrame` framework are demonstrated: `:name`, `*any`, and `{field}`, which represent named matching rules, fuzzy matching rules, and field matching rules, respectively. Different rules use the `/` symbol to divide levels, and route searching adopts a `depth-first algorithm`, with deeper level rules having higher priority. Let's run the above example and visit several `URLs` to see the effect:

```markdown
| URL                                        | Result                                     |
|--------------------------------------------|--------------------------------------------|
| <http://127.0.0.1:8199/user/list/2.html>   | /user/list/{field}.html                    |
| <http://127.0.0.1:8199/user/update>        | /:name/update                              |
| <http://127.0.0.1:8199/user/info>          | /:name/:action                             |
| <http://127.0.0.1:8199/user>               | /:name/*any                                |
```

In this example, we can also see that due to priority restrictions, the routing rule `/:name` will be overridden by the `/:name/*any` rule and will not be matched. Therefore, when assigning routing rules, it is necessary to plan and manage them uniformly to avoid such situations.

## Registration Rules

## Routing Registration Parameters

The most basic method of route binding is the `BindHandler` method. Let's take a look at the prototype of `BindHandler` that we have been using:

```go
func (s *Server) BindHandler(pattern string, handler interface{})
```

### Pattern Parameter

The `pattern` is a string of routing registration rules, which will also be used in other routing registration methods. The parameter format is as follows:

`[HTTPMethod:]RouteRule[@Domain]`
Where `HTTPMethod` (GET/PUT/POST/DELETE/PATCH/HEAD/CONNECT/OPTIONS/TRACE) and `@Domain` are optional parameters. In most scenarios, you can directly give the routing rule parameter, and `BindHandler` will automatically bind all request methods. If `HTTPMethod` is specified, the routing rule will only be valid for that request method. `@Domain` can specify the domain name for which the rule is effective, and the routing rule will only be valid under that domain.

`BindHandler` is the most primitive method of route registration. In most scenarios, we usually use group routing to manage reasons, which will be introduced in the following sections: Routing Registration - Group Routing.

### Handler Parameter

The `handler` parameter is usually used to specify the routing function. Our most basic examples use functions to register routes. A routing function needs to meet the following definition, that is, as long as it can receive the request object `ghttp.Request`:

```go
func(r *ghttp.Request) {
    // ...
}
```

Let's look at an example:

```go
package main

import (
    "github.com/gogf/gf/v2/net/ghttp"
    "github.com/gogf/gf/v2/frame/g"
)

func main() {
    s := g.Server()
    // This routing rule is only valid for GET requests
    s.BindHandler("GET:/{table}/list/{page}.html", func(r *ghttp.Request){
        r.Response.WriteJson(r.Router)
    })
    // This routing rule is only valid for GET requests and the localhost domain
    s.BindHandler("GET:/order/info/{order_id}@localhost", func(r *ghttp.Request){
        r.Response.WriteJson(r.Router)
    })
    // This routing rule is only valid for DELETE requests
    s.BindHandler("DELETE:/comment/{id}", func(r *ghttp.Request){
        r.Response.WriteJson(r.Router)
    })
    s.SetPort(8199)
    s.Run()
}
```

The returned parameter `r.Router` is the information of the current matched routing rule. When this method is accessed, the server will output the current matched routing rule information. After execution, we can test it in the terminal using the `curl` command:

```bash
$ curl -XGET http://127.0.0.1:8199/order/list/1.html 
{"Domain":"default","Method":"GET","Priority":3,"Uri":"/{table}/list/{page}.html"}

$ curl -XGET http://127.0.0.1:8199/order/info/1 
Not Found

$ curl -XGET http://localhost:8199/order/info/1
{"Domain":"localhost","Method":"GET","Priority":3,"Uri":"/order/info/{order_id}"}

$ curl -XDELETE http://127.0.0.1:8199/comment/1000 
{"Domain":"default","Method":"DELETE","Priority":2,"Uri":"/comment/{id}"}

$ curl -XGET http://127.0.0.1:8199/comment/1000 
Not Found
```

## Precise Matching Rules

Precise matching rules refer to rules that do not use any dynamic rules, such as `user`, `order`, `info`, and other such definite name rules. In most scenarios, precise matching rules are used together with dynamic rules for route registration (for example: `/:name/list`, where level 1 `:name` is a named matching rule, and level 2 `list` is a precise matching rule).

## Dynamic Routing Rules

Dynamic routing rules are divided into three types: named matching rules, fuzzy matching rules, and field matching rules. The underlying data structure of dynamic routing is a routing tree built by a hierarchical hash table and a doubly linked list. The hierarchical hash table facilitates efficient hierarchical matching of URIs; the data linked list is used for priority control, and routing rules at the same level are sorted according to priority, with higher priority rules at the head of the linked list. The underlying routing rules and request URI matching calculations use regular expressions and make full use of caching mechanisms, making the execution efficiency very high.

All matched parameters will be passed to the business layer in the form of Router parameters and can be obtained through the following methods of the `ghttp.Request` object:

```go
func (r *Request) GetRouter(key string, def ...interface{}) *gvar.Var
```

You can also use the `ghttp.Request.Get` method to obtain the matched routing parameters.

### Named Matching Rules

Use the `:name` method for matching (where `name` is a custom match name), which performs named matching on the specified level of URI parameters (similar to the regular expression `([^/]+)`, this URI level must have a value), and the corresponding matched parameters will be parsed as Router parameters and passed to the registered service interface for use.

Matching Example 1:

```bash
rule: /user/:user

/user/john                match
/user/you                 match
/user/john/profile        no match
/user/                    no match
```

Matching Example 2:

```bash
rule: /:name/action

/john/name                no match
/john/action              match
/smith/info               no match
/smith/info/age           no match
/smith/action             match
```

Matching Example 3:

```bash
rule: /:name/:action

/john/name                match
/john/info                match
/smith/info               match
/smith/info/age           no match
/smith/action/del         no match
```

### Fuzzy Matching Rules

Use the `*any` method for matching (where `any` is a custom match name), which performs fuzzy matching on the parameters after the specified position of the URI (similar to the regular expression `(.*)`, this URI level can be empty), and the matched parameters will be parsed as Router parameters and passed to the registered service interface for use.

Matching Example 1:

```bash
rule: /src/*path

/src/                     match
/src/somefile.go          match
/src/subdir/somefile.go   match
/user/                    no match
/user/john                no match
```

Matching Example 2:

```bash
rule: /src/*path/:action

/src/                     no match
/src/somefile.go          match
/src/somefile.go/del      match
/src/subdir/file.go/del   match
```

Matching Example 3:

```bash
rule: /src/*path/show

/src/                     no match
/src/somefile.go          no match
/src/somefile.go/del      no match
/src/somefile.go/show     match
/src/subdir/file.go/show  match
/src/show                 match
```

### Field Matching Rules

Use the `{field}` method for matching (where `field` is a custom match name), which can capture and match parameters at any position in the URI (similar to the regular expression `([\w\.\-]+)`, this URI level must have a value, and multiple field matches can be performed at the same level), and the matched parameters will be parsed as Router parameters and passed to the registered service interface for use.

Matching Example 1:

```bash
rule: /order/list/{page}.php

/order/list/1.php          match
/order/list/666.php        match
/order/list/2.php5         no match
/order/list/1              no match
/order/list                no match
```

Matching Example 2:

```bash
rule: /db-{table}/{id}

/db-user/1                     match
/db-user/2                     match
/db/user/1                     no match
/db-order/100                  match
/database-order/100            no match
```

Matching Example 3:

```bash
rule: /{obj}-{act}/*param

/user-delete/10                match
/order-update/20               match
/log-list                      match
/log/list/1                    no match
/comment/delete/10             no match
```

### Dynamic Routing Example

```go
package main

import (
    "github.com/gogf/gf/v2/net/ghttp"
    "github.com/gogf/gf/v2/frame/g"
)

func main() {
    s := g.Server()
    // A simple pagination routing example
    s.BindHandler("/user/list/{page}.html", func(r *ghttp.Request){
        r.Response.Writeln(r.Get("page"))
    })
    // Mixing {xxx} rules with :xxx rules
    s.BindHandler("/{object}/:attr/{act}.php", func(r *ghttp.Request){
        r.Response.Writeln(r.Get("object"))
        r.Response.Writeln(r.Get("attr"))
        r.Response.Writeln(r.Get("act"))
    })
    // Mixing multiple fuzzy matching rules
    s.BindHandler("/{class}-{course}/:name/*act", func(r *ghttp.Request){
        r.Response.Writeln(r.Get("class"))
        r.Response.Writeln(r.Get("course"))
        r.Response.Writeln(r.Get("name"))
        r.Response.Writeln(r.Get("act"))
    })
    s.SetPort(8199)
    s.Run()
}
```

After execution, we can test it through `curl` commands or browser access. The following are the test results:

```bash
$ curl -XGET http://127.0.0.1:8199/user/list/1.html 
1

$ curl -XGET http://127.0.0.1:8199/user/info/save.php 
user
info
save

$ curl -XGET http://127.0.0.1:8199/class3-math/john/score 
class3
math
john
score
```

## Priority Control

Priority control follows a depth-first strategy, with a brief calculation strategy:

- The deeper the level, the higher the priority;
- At the same level, precise matching has higher priority than fuzzy matching;
- At the same level, the priority of fuzzy matching is: Field Matching > Named Matching > Fuzzy Matching;

Let's look at an example (the rule on the left has higher priority than the one on the right):

```bash
/:name                   >            /*any
/user/name               >            /user/:action
/:name/info              >            /:name/:action
/:name/:action           >            /:name/*action
/:name/{action}          >            /:name/:action
/src/path/del            >            /src/path
/src/path/del            >            /src/path/:action
/src/path/*any           >            /src/path
```
