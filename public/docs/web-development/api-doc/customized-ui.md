# API Documentation - Custom UI

## Basic Introduction

The default `OpenAPI` interface documentation UI that comes with `GoFrame`'s Server is the [redoc](https://redocly.com/redoc) open-source component, which does not support the `Try It Out` functionality on the page. Many users have asked if it's possible to use `SwaggerUI` to display the `OpenAPI` interface documentation. Some enterprises do not support connecting to certain external resources internally; can the internal interface documentation UI be replaced with an internally accessible resource?

For those who are familiar with `OpenAPI`, it's a common knowledge that `OpenAPI` is just a general interface definition specification, and the UI for displaying interface documentation can be easily replaced. There are also many such UI interfaces and platforms! It's very simple to switch the interface documentation UI page using the `GoFrame Server` or to connect the interface documentation to a third-party interface documentation platform. For details, see the example: [gf/example/httpserver/swagger-set-template/main.go at master · gogf/gf](https://github.com/gogf/gf/blob/master/example/httpserver/swagger-set-template/main.go).

## Usage Example

Let's demonstrate through code how to quickly switch the interface documentation UI to SwaggerUI. The related links for SwaggerUI are:

- [SwaggerUI GitHub Repository](https://github.com/swagger-api/swagger-ui)
- [SwaggerUI Installation Guide](https://github.com/swagger-api/swagger-ui/blob/master/docs/usage/installation.md)

`main.go`

```go
package main

import (
    "context"
    "fmt"

    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/net/ghttp"
)

// HelloReq defines the request structure for the hello endpoint.
type HelloReq struct {
    g.Meta `path:"/hello" method:"get" sort:"1"`
    Name   string `v:"required" dc:"Your name"`
}

// HelloRes defines the response structure for the hello endpoint.
type HelloRes struct {
    Reply string `dc:"Reply content"`
}

// Hello is a controller structure.
type Hello struct{}

// Say is an action that returns a greeting message.
func (c *Hello) Say(ctx context.Context, req *HelloReq) (res *HelloRes, err error) {
    g.Log().Debugf(ctx, `received say request: %+v`, req)
    res = &HelloRes{
        Reply: fmt.Sprintf("Hi %s", req.Name),
    }
    return
}

const (
    MySwaggerUITemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
 <meta charset="utf-8" />
 <meta name="viewport" content="width=device-width, initial-scale=1" />
 <meta name="description" content="SwaggerUI"/>
 <title>SwaggerUI</title>
 <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.10.5/swagger-ui.min.css" />
</head>
<body>
<div id="swagger-ui"></div>
<script src="https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.10.5/swagger-ui-bundle.js" crossorigin></script>
<script>
 window.onload = () => {
  window.ui = SwaggerUIBundle({
   url:    '{SwaggerUIDocUrl}',
   dom_id: '#swagger-ui',
  });
 };
</script>
</body>
</html>
`
)

func main() {
    s := g.Server()
    s.Use(ghttp.MiddlewareHandlerResponse)
    s.Group("/", func(group *ghttp.RouterGroup) {
        group.Bind(
            new(Hello),
        )
    })
    s.SetSwaggerUITemplate(MySwaggerUITemplate)
    s.Run()
}
```

`config.yaml`

```yaml
server:
  address:     ":8199"
  openapiPath: "/api.json"
  swaggerPath: "/swagger"
```

We have defined only one endpoint, `Hello`. As you can see, we display the `SwaggerUI` `HTML` page through an interface and define the OpenAPI interface file path as `/api.json`, without enabling the `Server`'s built-in UI page. After execution, the terminal output is:

```bash
2022-05-18 20:41:09.160 [INFO] openapi specification is serving at address: http://127.0.0.1:8199/api.json
2022-05-18 20:41:09.161 [INFO] pid[57888]: http server started listening on [:8199]

  ADDRESS | METHOD |   ROUTE   |                             HANDLER                             |    MIDDLEWARE      
----------|--------|-----------|-----------------------------------------------------------------|--------------------
  :8199   | ALL    | /*        | github.com/gogf/gf/v2/net/ghttp.internalMiddlewareServerTracing | GLOBAL MIDDLEWARE  
----------|--------|-----------|-----------------------------------------------------------------|--------------------
  :8199   | ALL    | /api.json | github.com/gogf/gf/v2/net/ghttp.(*Server).openapiSpec           |                    
----------|--------|-----------|-----------------------------------------------------------------|--------------------
  :8199   | GET    | /hello    | main.(*Hello).Say                                               |                    
----------|--------|-----------|-----------------------------------------------------------------|--------------------
  :8199   | GET    | /swagger  | main.main.func1.1                                               |                    
----------|--------|-----------|-----------------------------------------------------------------|--------------------
```

You can access the SwaggerUI by clicking this link: [http://127.0.0.1:8199/swagger/](http://127.0.0.1:8199/swagger/)

## Common UI Templates

### swagger-ui

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="description" content="SwaggerUI"/>
    <title>SwaggerUI</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.10.5/swagger-ui.min.css" />
</head>
<body>
<div id="swagger-ui"></div>
<script src="https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.10.5/swagger-ui-bundle.js" crossorigin></script>
<script>
    window.onload = () => {
        window.ui = SwaggerUIBundle({
            url:    '{SwaggerUIDocUrl}',
            dom_id: '#swagger-ui',
        });
    };
</script>
</body>
</html>
```

### openapi-ui

```html
<!doctype html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <title>openAPI UI</title>
    </head>
    <body>
        <div id="openapi-ui-container" spec-url="{SwaggerUIDocUrl}" theme="light"></div>
        <script src="https://cdn.jsdelivr.net/npm/openapi-ui-dist@latest/lib/openapi-ui.umd.js"></script> 
    </body>
</html>
```
