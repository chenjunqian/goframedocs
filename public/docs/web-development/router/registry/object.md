# Routing Registration - Object Registration

Object registration is the process of registering routes through an instantiated object. Subsequent requests are then handled by this object (the same object), which resides in memory and is not released.

***Related Methods***

```go
func (s *Server) BindObject(pattern string, object interface{}, methods ...string) error
func (s *Server) BindObjectMethod(pattern string, object interface{}, method string) error
func (s *Server) BindObjectRest(pattern string, object interface{}) error
```

***Pre-agreement***: The methods to be registered for routing must be public methods and must be defined as follows

```go
func(r *ghttp.Request)
```

Otherwise, registration cannot be completed, and there will be an error提示 during route registration, for example:

```bash
panic: interface conversion: interface {} is xxx, not func(*ghttp.Request)
```

## Object Registration - BindObject

We can complete the registration of the object through the `BindObject` method.

```go
package main

import (
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/net/ghttp"
)

type Controller struct{}

func (c *Controller) Index(r *ghttp.Request) {
    r.Response.Write("index")
}

func (c *Controller) Show(r *ghttp.Request) {
    r.Response.Write("show")
}

func main() {
    s := g.Server()
    c := new(Controller)
    s.BindObject("/object", c)
    s.SetPort(8199)
    s.Run()
}
```

It can be seen that when the object is registered for routing, an object is created (the object is created when the `Server` starts). No matter how many requests enter, the `Server` will hand over the requests to the corresponding methods of the object for processing. After executing this example, the terminal outputs the following route table:

```bash
SERVER  | DOMAIN  | ADDRESS | METHOD |     ROUTE     |         HANDLER          | MIDDLEWARE
|---------|---------|---------|--------|---------------|--------------------------|------------|
  default | default | :8199   | ALL    | /object       | main.(*Controller).Index |
|---------|---------|---------|--------|---------------|--------------------------|------------|
  default | default | :8199   | ALL    | /object/index | main.(*Controller).Index |
|---------|---------|---------|--------|---------------|--------------------------|------------|
  default | default | :8199   | ALL    | /object/show  | main.(*Controller).Show  |
|---------|---------|---------|--------|---------------|--------------------------|------------|
```

You can then view the effect by accessing [http://127.0.0.1:8199/object/show](http://127.0.0.1:8199/object/show).

> The `Index` method in the controller is a special method. For example, when the registered route rule is `/user`, an HTTP request to `/user` will automatically map to the `Index` method of the controller. That is to say, accessing the addresses `/user` and `/user/index` will achieve the same execution effect.

### Route Built-in Variables

When using the `BindObject` method for object registration, two built-in variables can be used in the route rules: `{.struct}` and `{.method}`, the former represents the current object name, and the latter represents the current registered method name. Let's look at an example:

```go
package main

import (
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/net/ghttp"
)

type Order struct{}

func (o *Order) List(r *ghttp.Request) {
    r.Response.Write("list")
}

func main() {
    s := g.Server()
    o := new(Order)
    s.BindObject("/{.struct}-{.method}", o)
    s.SetPort(8199)
    s.Run()
}
```

After execution, the terminal outputs the following route table:

```bash
SERVER  | DOMAIN  | ADDRESS | METHOD |    ROUTE    |      HANDLER       | MIDDLEWARE
|---------|---------|---------|--------|-------------|--------------------|------------|
  default | default | :8199   | ALL    | /order-list | main.(*Order).List |
|---------|---------|---------|--------|-------------|--------------------|------------|
```

We try to access [http://127.0.0.1:8199/order-list](http://127.0.0.1:8199/order-list), and we can see the page output `list`. If the route rule does not use built-in variables, then by default, the method will be appended to the end of the specified route rule.

### Naming Style Rules

When registering routes through objects, the route rules can be automatically generated based on the object and method names. The default route rule is: when the method name contains `multiple` words (distinguished by capital letters), the route controller will automatically use the English hyphen `-` to connect. Therefore, when accessing, the method name needs to be with a hyphen.

For example, if the method name is `UserName`, the generated route will be `user-name`; if the method name is `ShowListItems`, the generated route will be `show-list-items`, and so on.

In addition, we can set the route generation method of the object method name through the `.Server.SetNameToUriType` method. There are currently 4 ways to support, corresponding to 4 constant definitions:

```go
UriTypeDefault  = 0 // (default) All converted to lowercase, words connected with '-' connection symbol
UriTypeFullName = 1 // Do not process the name, build URI with the original name
UriTypeAllLower = 2 // Only convert to lowercase, no connection symbol between words
UriTypeCamel    = 3 // Use camel case naming method
```

Note: This parameter should be set before registering routes through objects. Setting it after route registration will not take effect and will use the default rule.

Let's look at an example:

```go
package main

import (
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/net/ghttp"
)

type User struct{}

func (u *User) ShowList(r *ghttp.Request) {
    r.Response.Write("list")
}

func main() {
    u := new(User)
    s1 := g.Server("UriTypeDefault")
    s2 := g.Server("UriTypeFullName")
    s3 := g.Server("UriTypeAllLower")
    s4 := g.Server("UriTypeCamel")

    s1.SetNameToUriType(ghttp.UriTypeDefault)
    s2.SetNameToUriType(ghttp.UriTypeFullName)
    s3.SetNameToUriType(ghttp.UriTypeAllLower)
    s4.SetNameToUriType(ghttp.UriTypeCamel)

    s1.BindObject("/{.struct}/{.method}", u)
    s2.BindObject("/{.struct}/{.method}", u)
    s3.BindObject("/{.struct}/{.method}", u)
    s4.BindObject("/{.struct}/{.method}", u)

    s1.SetPort(8100)
    s2.SetPort(8200)
    s3.SetPort(8300)
    s4.SetPort(8400)

    s1.Start()
    s2.Start()
    s3.Start()
    s4.Start()

    g.Wait()
}
```

To demonstrate the effect for comparison, this example uses `multiple Server` operation modes, using different name conversion methods with different `Servers` to configure and run. Therefore, we can conveniently access different `Servers` (bound to different ports) within the same program to see different results.

After execution, the terminal outputs the following route table:

```bash
      SERVER     | DOMAIN  | ADDRESS | METHOD |      ROUTE      |        HANDLER        | MIDDLEWARE  
-----------------|---------|---------|--------|-----------------|-----------------------|-------------
  UriTypeDefault | default | :8100   | ALL    | /user/show-list | main.(*User).ShowList |             
-----------------|---------|---------|--------|-----------------|-----------------------|-------------
 
      SERVER      | DOMAIN  | ADDRESS | METHOD |     ROUTE      |        HANDLER        | MIDDLEWARE  
------------------|---------|---------|--------|----------------|-----------------------|-------------
  UriTypeFullName | default | :8200   | ALL    | /User/ShowList | main.(*User).ShowList |             
------------------|---------|---------|--------|----------------|-----------------------|-------------
```

```bash
      SERVER      | DOMAIN  | ADDRESS | METHOD |     ROUTE      |        HANDLER        | MIDDLEWARE  
------------------|---------|---------|--------|----------------|-----------------------|-------------
  UriTypeAllLower | default | :8300   | ALL    | /user/showlist | main.(*User).ShowList |             
------------------|---------|---------|--------|----------------|-----------------------|-------------
 
     SERVER    | DOMAIN  | ADDRESS | METHOD |     ROUTE      |        HANDLER        | MIDDLEWARE  
---------------|---------|---------|--------|----------------|-----------------------|-------------
  UriTypeCamel | default | :8400   | ALL    | /user/showList | main.(*User).ShowList |             
---------------|---------|---------|--------|----------------|-----------------------|-------------
```

You can access the following URL addresses to get the expected results:

- [http://127.0.0.1:8100/user/show-list](http://127.0.0.1:8100/user/show-list)
- [http://127.0.0.1:8200/User/ShowList](http://127.0.0.1:8200/User/ShowList)
- [http://127.0.0.1:8300/user/showlist](http://127.0.0.1:8300/user/showlist)
- [http://127.0.0.1:8400/user/showList](http://127.0.0.1:8400/user/showList)

### Object Method Registration

If there are several public methods in the controller, but I only want to register a few of them, and I don't want the rest to be exposed to the outside, what should I do? We can achieve this by passing the third non-required parameter of `BindObject`, which supports multiple method names separated by commas (the method name parameter is ***case-sensitive***).

### Usage Example

```go
package main

import (
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/net/ghttp"
)

type Controller struct{}

func (c *Controller) Index(r *ghttp.Request) {
    r.Response.Write("index")
}

func (c *Controller) Show(r *ghttp.Request) {
    r.Response.Write("show")
}

func main() {
    s := g.Server()
    c := new(Controller)
    s.BindObject("/object", c, "Show")
    s.SetPort(8199)
    s.Run()
}
```

After execution, the terminal outputs the following route table:

```bash
SERVER  | DOMAIN  | ADDRESS | METHOD |    ROUTE     |         HANDLER         | MIDDLEWARE
|---------|---------|---------|--------|--------------|-------------------------|------------|
  default | default | :8199   | ALL    | /object/show | main.(*Controller).Show |
|---------|---------|---------|--------|--------------|-------------------------|------------|
```

## Binding Route Method - BindObjectMethod

We can bind a specified route to a specified method execution (the method name parameter is case-sensitive) through the `BindObjectMethod` method.

***Differences between BindObjectMethod and BindObject***

- `BindObjectMethod` binds a specified method in the object to a specified route rule. The third `method` parameter can only specify one method name.
- `BindObject` registers all routes as object method names generated according to the rules, and the third `methods` parameter can specify multiple registered method names.

Let's look at an example:

```go
package main

import (
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/net/ghttp"
)

type Controller struct{}

func (c *Controller) Index(r *ghttp.Request) {
    r.Response.Write("index")
}

func (c *Controller) Show(r *ghttp.Request) {
 r.Response.Write("show")
}

func main() {
    s := g.Server()
    c := new(Controller)
    s.BindObjectMethod("/show", c, "Show")
    s.SetPort(8199)
    s.Run()
}
```

After execution, the terminal outputs the following route table:

```bash
SERVER  | DOMAIN  | ADDRESS | METHOD | ROUTE |         HANDLER         | MIDDLEWARE
|---------|---------|---------|--------|-------|-------------------------|------------|
  default | default | :8199   | ALL    | /show | main.(*Controller).Show |
|---------|---------|---------|--------|-------|-------------------------|------------|
```

## RESTful Object Registration - BindObjectRest

Controllers designed in the `RESTful` style are usually used for `API` services. In this mode, `HTTP methods` will be `mapped` to corresponding method names in the controller, for example: the `POST` method will be mapped to the `Post` method in the controller (public method, first letter capitalized), the `DELETE` method will be `mapped` to the `Delete` method in the controller, and so on. Other methods that are not named after `HTTP methods`, even if they are defined as public methods, will not be automatically registered and will not be visible to the application side. Of course, if the controller does not define a method corresponding to the `HTTP method`, a `HTTP Status 404` will be returned under that method request.

`GoFrame`'s `RESTful` object registration method is a strict REST route registration method. We can regard the controller object as a resource in REST, and the `HTTP method` methods are the resource operation methods specified in the REST specification. If you are not familiar with the REST specification, or if you do not want a too strict `RESTful` route design, please ignore this section.

We can complete the registration of REST objects through the `BindObjectRest` method. Here is an example:

```go
package main

import (
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/net/ghttp"
)

type Controller struct{}

// RESTFul - GET
func (c *Controller) Get(r *ghttp.Request) {
    r.Response.Write("GET")
}

// RESTFul - POST
func (c *Controller) Post(r *ghttp.Request) {
    r.Response.Write("POST")
}

// RESTFul - DELETE
func (c *Controller) Delete(r *ghttp.Request) {
    r.Response.Write("DELETE")
}

// This method cannot be mapped and will not be accessible
func (c *Controller) Hello(r *ghttp.Request) {
    r.Response.Write("Hello")
}

func main() {
    s := g.Server()
    c := new(Controller)
    s.BindObjectRest("/object", c)
    s.SetPort(8199)
    s.Run()
}
```

After execution, the terminal outputs the following route table:

```bash
SERVER  | DOMAIN  | ADDRESS | METHOD |  ROUTE  |          HANDLER          | MIDDLEWARE
|---------|---------|---------|--------|---------|---------------------------|------------|
  default | default | :8199   | DELETE | /object | main.(*Controller).Delete |
|---------|---------|---------|--------|---------|---------------------------|------------|
  default | default | :8199   | GET    | /object | main.(*Controller).Get    |
|---------|---------|---------|--------|---------|---------------------------|------------|
  default | default | :8199   | POST   | /object | main.(*Controller).Post   |
|---------|---------|---------|--------|---------|---------------------------|------------|
```

## Constructor Method Init and Destructor Method Shut

The `Init` and `Shut` methods in an object are two special methods that are automatically called by the `Server` during the HTTP request process (similar to the role of `constructors` and `destructors`).

***Init Callback Method***

The initialization method of the object when a request is received, which is called back before the service interface is called.

Method definition:

```go
// "Constructor" object method
func (c *Controller) Init(r *ghttp.Request) {

}
```

***Shut Callback Method***

Automatically called by the `Server` when the request ends, and can be used for the object to perform some final processing operations.

Method definition:

```go
// "Destructor" object method
func (c *Controller) Shut(r *ghttp.Request) {

}
```

Here is an example:

```go
package main

import (
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/net/ghttp"
)

type Controller struct{}

func (c *Controller) Init(r *ghttp.Request) {
    r.Response.Writeln("Init")
}

func (c *Controller) Shut(r *ghttp.Request) {
    r.Response.Writeln("Shut")
}

func (c *Controller) Hello(r *ghttp.Request) {
    r.Response.Writeln("Hello")
}

func main() {
    s := g.Server()
    c := new(Controller)
    s.BindObject("/object", c)
    s.SetPort(8199)
    s.Run()
}
```

After execution, the terminal outputs the following route table:

```bash
  SERVER  | DOMAIN  | ADDRESS | METHOD |     ROUTE     |         HANDLER          | MIDDLEWARE 
|---------|---------|---------|--------|---------------|--------------------------|------------|
  default | default | :8199   | ALL    | /object/hello | main.(*Controller).Hello |            
|---------|---------|---------|--------|---------------|--------------------------|------------|
```

It can be seen that the routes for the `Init` and `Shut` methods are not automatically registered. After accessing [http://127.0.0.1:8199/object/hello](http://127.0.0.1:8199/object/hello), the output result is:

```bash
Init
Hello
Shut
```
