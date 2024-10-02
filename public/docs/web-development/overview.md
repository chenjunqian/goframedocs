# Overview

`GoFrame` is a modular framework with well-established infrastructure. The `WebServer` module is one of the core modules, and we will use `web` service development as an entry point into the framework to make it easier for everyone to learn and understand.

`GoFrame` provides a powerful `WebServer` implemented by the `ghttp` module. It features a rich set of components, such as: `Router, Cookie, Session, Route Registration, Configuration Management, Template Engine, Cache Control`, etc. It supports features like hot restart, hot updates, multi-domain, multi-port, multi-instance, HTTPS, URL rewriting, PProf, and more.

***API Documentation Address***

[https://pkg.go.dev/github.com/gogf/gf/v2/net/ghttp](https://pkg.go.dev/github.com/gogf/gf/v2/net/ghttp)

## Hello World

As usual, let's start with a Hello World example:

```go
package main

import (
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/net/ghttp"
)

func main() {
    s := g.Server()
    s.BindHandler("/", func(r *ghttp.Request) {
        r.Response.Write("Hello World!")
    })
    s.Run()
}
```

This is the simplest service. By default, it does not support static file handling and only has one feature: when accessing `http://127.0.0.1/`, it will return "Hello World!".

At any time, you can obtain a default Server object through the `g.Server()` method. This method is designed with a singleton pattern, meaning that multiple calls to this method return the same Server object. The `Run()` method starts the server listening on port 80 by default, without any additional settings.

We will introduce route registration in the following sections. Now, let's look at how to create a server that supports static files.

## Static Services

Create and run a `WebServer` that supports static files:

```go
package main

import (
    "github.com/gogf/gf/v2/frame/g"
)

func main() {
    s := g.Server()
    s.SetIndexFolder(true)
    s.SetServerRoot("/home/www/")
    s.Run()
}
```

After creating the `Server` object, you can use the `Set*` methods to set the properties of the `Server`. In our example, we involved two property setting methods:

- `SetIndexFolder`: This method sets whether to allow listing the files in the `server`'s main directory (default is false).
- `SetServerRoot`: This method sets the main directory of the `server` (similar to the `root` configuration in Nginx, default is empty).

By default, the `server` has no main directory settings, and only when the main directory is set does it support accessing static files within that directory.

## Multi-Port Listening

The `Server` also supports multi-port listening. You can set multiple port numbers in the `SetPort` parameter (similarly, for HTTPS services, we can use `SetHTTPSPort` to bind and support multiple port numbers. For a detailed introduction to HTTPS services, please refer to the corresponding chapters later).

Let's look at an example:

```go
package main

import (
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/net/ghttp"
)

func main() {
    s := g.Server()
    s.BindHandler("/", func(r *ghttp.Request) {
        r.Response.Writeln("GoFrame!")
    })
    s.SetPort(8100, 8200, 8300)
    s.Run()
}
```

After executing the above example, accessing the following URLs will yield the same expected result:

- `http://127.0.0.1:8100/`
- `http://127.0.0.1:8200/`
- `http://127.0.0.1:8300/`

## Multi-Instance Support

The Server supports running multiple instances within the same process. Below is an example:

```go
package main

import (
    "github.com/gogf/gf/v2/frame/g"
)

func main() {
    s1 := g.Server("s1")
    s1.SetPort(8080)
    s1.SetIndexFolder(true)
    s1.SetServerRoot("/home/www/static1")
    s1.Start()

    s2 := g.Server("s2")
    s2.SetPort(8088)
    s2.SetIndexFolder(true)
    s2.SetServerRoot("/home/www/static2")
    s2.Start()

    g.Wait()
}
```

In this example, we passed different singleton name parameters to the `g.Server` method, which identifies different `server` instances. Therefore, these names must be unique. If you need to access the same `server` instance, simply pass the same name. This applies in scenarios like multiple `goroutines` or different modules where you can access the same `Server` instance using `g.Server`.

## Domain Binding

The Server supports multi-domain binding, allowing different domains to bind to different services.

Let's look at a simple example:

```go
package main

import (
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/net/ghttp"
)

func Hello1(r *ghttp.Request) {
    r.Response.Write("127.0.0.1: Hello1!")
}

func Hello2(r *ghttp.Request) {
    r.Response.Write("localhost: Hello2!")
}

func main() {
    s := g.Server()
    s.Domain("127.0.0.1").BindHandler("/", Hello1)
    s.Domain("localhost").BindHandler("/", Hello2)
    s.Run()
}
```

When we access `http://127.0.0.1/` and `http://localhost/`, we can see different outputs.

Additionally, the `Domain` method supports multiple domain parameters separated by commas, for example:

```go
s.Domain("localhost1,localhost2,localhost3").BindHandler("/", Hello2)
```

This statement registers the `Hello2` method to the specified three domains (localhost1~3) and makes it invisible to others.

**Note:** The parameters for the `Domain` method must be ***accurate*** domain names; ***wildcard domain*** forms like `*.goframe.org` or `.goframe.org` are not supported. Only `api.goframe.org` or `goframe.org` are considered valid domain parameters.

## Routing Features

The `Server` provides excellent routing features. Let’s first look at a simple example:

```go
package main

import (
    "github.com/gogf/gf/v2/net/ghttp"
    "github.com/gogf/gf/v2/frame/g"
)

func main() {
    s := g.Server()
    s.BindHandler("/{class}-{course}/:name/*act", func(r *ghttp.Request) {
        r.Response.Writef(
            "%v %v %v %v",
            r.Get("class"),
            r.Get("course"),
            r.Get("name"),
            r.Get("act"),
        )
    })
    s.SetPort(8199)
    s.Run()
}
```

This is a mixed routing rule example used to display a class, a subject, a student, and the corresponding action. After running, we can test it with a URL like `http://127.0.0.1:8199/class3-math/john/score` to see the results. The corresponding routing rules will be parsed and displayed on the page, allowing the business layer to handle logic based on the parsed parameters. For a detailed introduction to route registration management, please refer to the later chapter on [Routing Management - Routing Rule](/docs/web-development/router/rule).

## Configuration Management

`GoFrame`'s core components implement convenient configuration management features, allowing component functionality to be configured simply by modifying configuration files. In most scenarios, we recommend managing component configurations using configuration files. For `server` configuration, please refer to the chapter on [Service Configuration](/docs/web-development/server/config).

## Smooth Restart

The `Server` supports smooth restart features. For more details, please refer to the chapter on [Smooth Restart Features](/docs/web-development/advanced/smooth-restart).

## HTTPS Support

The `Server` supports HTTPS services and can simultaneously provide both HTTP and HTTPS services in a single process. For more details on HTTPS, please refer to the chapter on [HTTPS & TLS](/docs/web-development/advanced/https-tls).

## More Features

For more functionalities and features, please continue reading the following chapters.
