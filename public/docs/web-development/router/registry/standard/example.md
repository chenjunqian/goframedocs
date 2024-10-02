# Standard Routing - Basic Example

## Configuration File

Here we use a YAML configuration file: `config.yaml`

```yaml
server:
  address:     ":8199"
  openapiPath: "/api.json"
  swaggerPath: "/swagger"
```

## Example Code

Let's start with a simple Hello example:

```go
package main

import (
    "context"
    "fmt"

    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/net/ghttp"
)

type HelloReq struct {
    g.Meta `path:"/hello" method:"get"`
    Name   string `v:"required" dc:"Your name"`
}
type HelloRes struct {
    Reply string `dc:"Reply content"`
}

type Hello struct{}

func (Hello) Say(ctx context.Context, req *HelloReq) (res *HelloRes, err error) {
    g.Log().Debugf(ctx, `receive say: %+v`, req)
    res = &HelloRes{
        Reply: fmt.Sprintf(`Hi %s`, req.Name),
    }
    return
}

func main() {
    s := g.Server()
    s.Use(ghttp.MiddlewareHandlerResponse)
    s.Group("/", func(group *ghttp.RouterGroup) {
        group.Bind(
            new(Hello),
        )
    })
    s.Run()
}
```

Copy this code and run it, then the terminal outputs the following information:

```bash
2021-11-19 23:31:35.277 25580: http server started listening on [:8199]

  SERVER  | DOMAIN  | ADDRESS | METHOD |   ROUTE    |                          HANDLER                          |    MIDDLEWARE      
----------|---------|---------|--------|------------|-----------------------------------------------------------|--------------------
  default | default | :8199   | ALL    | /*         | github.com/gogf/gf/v2/net/ghttp.MiddlewareHandlerResponse | GLOBAL MIDDLEWARE  
----------|---------|---------|--------|------------|-----------------------------------------------------------|--------------------
  default | default | :8199   | ALL    | /api.json  | github.com/gogf/gf/v2/net/ghttp.(*Server).openapiSpec-fm  |                    
----------|---------|---------|--------|------------|-----------------------------------------------------------|--------------------
  default | default | :8199   | GET    | /hello     | main.(*Hello).Say                                         |                    
----------|---------|---------|--------|------------|-----------------------------------------------------------|--------------------
  default | default | :8199   | ALL    | /swagger/* | github.com/gogf/gf/v2/net/ghttp.(*Server).swaggerUI-fm    | HOOK_BEFORE_SERVE  
----------|---------|---------|--------|------------|-----------------------------------------------------------|--------------------
```

You can see that in addition to our business route, the `Server` automatically registered two routes for us: `/api.json` and `/swagger/*`. The former is an automatically generated interface document based on the standard `OpenAPIv3` protocol, and the latter is an automatically generated `SwaggerUI` page for developers to view and debug. These two features are turned off by default, and developers can enable them through the `openapiPath` and `swaggerPath` configuration items shown in the previous example.

## Interface Documentation

The interface documentation is generated through the `OpenAPIv3` protocol and is typically viewed with the corresponding `UI` tools at: [http://127.0.0.1:8199/api.json](http://127.0.0.1:8199/api.json)

Due to network issues, the parsing of the above web page was not successful. If you need the parsing content of this web page, please check the legitimacy of the web page link and try again. If the link is correct and the issue persists, it may be related to network problems. You can try accessing the link later or from a different network environment.

> Since the `OpenAPIv3` protocol is a standardized interface definition protocol, developers can do many things based on the protocol content, such as custom UI display, client code generation, protocol conversion, and more.
