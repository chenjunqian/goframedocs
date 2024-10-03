# Example Project

Example is the best documentation, this is a simple `Http API Service` project to introduce the basic usage of `Goframe` and `CLI`.

Project Github Link: <https://github.com/gogf/gf-demo-user>

```bash
git clone https://github.com/gogf/gf-demo-user
```

## Project Introduction

This project is a simple user management API service, register, login and logout, stroe and query users from databse.

### 1. API Schema

Http Request schema struct define under `api/` package, the properties of the API structure contain some tags. The `v` tag on the structure property is for validation rules, and the request parameters will be automatically validated after entering the HTTP Server (the framework has data validation component, for a more detailed introduction, please refer to the section: [Data Validation](https://temperory.net)).

```go
package v1

import "github.com/gogf/gf/v2/frame/g"

type SignInReq struct {
    g.Meta   `path:"/user/sign-in" method:"post" tags:"UserService" summary:"Sign in with exist account"`
    Passport string `v:"required"`
    Password string `v:"required"`
}
type SignInRes struct{}
```

### 2. Router

Routers are registered in the `internal/cmd` package, in this project use group router as example. Part of the router with auth middleware, for more detail you can check the source code. About more detail of the middleware, please refer to [Router Management - Interceptor](/docs/web-development/router/interceptor/))

```go
package cmd

import (
    "context"

    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/net/ghttp"
    "github.com/gogf/gf/v2/os/gcmd"

    "github.com/gogf/gf-demo-user/v2/internal/consts"
    "github.com/gogf/gf-demo-user/v2/internal/controller/user"
    "github.com/gogf/gf-demo-user/v2/internal/service"
)

var (
    // the main command.
    Main = gcmd.Command{
    Name:  "main",
    Usage: "main",
    Brief: "start http server of simple goframe demos",
    Func: func(ctx context.Context, parser *gcmd.Parser) (err error) {
        s := g.Server()
        s.Use(ghttp.MiddlewareHandlerResponse)
        s.Group("/", func(group *ghttp.RouterGroup) {
            // Group middlewares.
            group.Middleware(
            service.Middleware().Ctx,
                ghttp.MiddlewareCORS,
            )
            // Register route handlers.
            var (
                userCtrl = user.NewV1()
            )
            group.Bind(
                userCtrl,
            )
            // Special handler that needs authentication.
            group.Group("/", func(group *ghttp.RouterGroup) {
            group.Middleware(service.Middleware().Auth)
            group.ALLMap(g.Map{
                "/user/profile": userCtrl.Profile,
            })
            })
        })
        // Just run the server.
        s.Run()
        return nil
        },
    }
)
```

### 3. Constants

The constants are defined in the `internal/consts` package, which can be accessed from all package, global constants are distinguished by different files and prefixing the names to differentiate various business modules.

```go
// const_user.go
package consts

const (
    UserSessionKey = "UserSessionKey"
)
```

```go
// const_openapi.go
package consts

const (
    OpenAPITitle       = `GoFrame Demos`
    OpenAPIDescription = `This is a simple demos HTTP server project that is using GoFrame. Enjoy 💖 `
)
```

### 4. Controller

The controller is defined in the `internal/controller` package, `controller` only contain the input and output of API interface data structures, and some services implementations.

```go
// internal/controller/user/user_v1_sign_up.go
package user

import (
    "context"

    "github.com/gogf/gf-demo-user/v2/api/user/v1"
    "github.com/gogf/gf-demo-user/v2/internal/model"
    "github.com/gogf/gf-demo-user/v2/internal/service"
)

func (c *ControllerV1) SignUp(ctx context.Context, req *v1.SignUpReq) (res *v1.SignUpRes, err error) {
    err = service.User().Create(ctx, model.UserCreateInput{
        Passport: req.Passport,
        Password: req.Password,
        Nickname: req.Nickname,
    })
    return
}
```

### 5. Database

#### Database Driver

First of all, the database drive should be imported in the `main.go`, here we use `mysql` as example.

About supported database types, please refer to <https://github.com/gogf/gf/tree/master/contrib/drivers>

```go
package main

import (
    // the mysql driver
    _ "github.com/gogf/gf/contrib/drivers/mysql/v2"
    ...
)

func main() {
    cmd.Main.Run(gctx.New())
}
```

#### Database Configuration

More about database configuration, please refer to [ORM Configuration](https://temperory.net)

```yaml
# Database.
database:
  logger:
    level: "all"
    stdout: true

  default:
    link: "mysql:root:12345678@tcp(127.0.0.1:3306)/test"
    debug: true
```

#### DAO Codegen

We recommand using `dao` `do` `entity` to operating the database, all these files are generated and maintained by `gf cli` automatically.

```go
// =================================================================================
// This is auto-generated by GoFrame CLI tool only once. Fill this file as you wish.
// =================================================================================

package dao

import (
    "github.com/gogf/gf-demo-user/v2/internal/dao/internal"
)

// internalUserDao is internal type for wrapping internal DAO implements.
type internalUserDao = *internal.UserDao

// userDao is the data access object for table user.
// You can define custom methods on it to extend its functionality as you wish.
type userDao struct {
    internalUserDao
}

var (
    // User is globally public accessible object for table user operations.
    User = userDao{
        internal.NewUserDao(),
    }
)

// Fill with you ideas below.
```

Using `make dao` or `gf gen dao` command under project root folder to generate the `dao` `do` `entity` code base on the database schema.

About the codegen for ORM, please refer to [Gen DAO](https://temperory.net)

### 6. Model Layer

For business data transaction, we recommend using the `model` package, which is defined in the `internal/model` package.

```go
package model

type UserCreateInput struct {
    Passport string
    Password string
    Nickname string
}

type UserSignInInput struct {
    Passport string
    Password string
}
```

### 7. Codegen

The purpose of the framework is to allow developers to focus the business. In the development of business projects, non-business-related redundant code can all be generated through `gf` tools, such as the following hierarchical codes:

1. `controller`

2. `dao` `do` `entity`

3. `service`

For more about the code generation, please refer to [Gen Code](https://temperory.net)

### 8. More Examples

Here is another more detail example project, if you are interested, you can check the source code. <https://github.com/gogf/focus-single>
