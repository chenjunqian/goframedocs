# Create Application

## Start from project template

This command creates a project scaffold directory named "demo", where the `-u` flag allows the user to specify whether to update the GoFrame framework used in the project to the latest version.

```bash
gf init demo -u
```

The project structrue could refer to: [Project Structrue Design](https://github.com/gogf/gf/tree/master/docs/quick-start)

The project structrue suit for web application, command-line tool and microservice development. By default, it generates a template project for an HTTP Web Server. After understanding the purpose of the directories, if there are any unnecessary ones, they can be deleted at your discretion.

```text
demo (root component)
├─ api
│  └─ v1
├─ hack
│  └─ config.yaml
├─ internal
│  ├─ cmd
│  ├─ consts
│  ├─ controller
│  ├─ dao
│  ├─ logic
│  ├─ model
│  ├─ packed
│  └─ service
├─ manifest
│   ├─ config
│   ├─ deploy
│   └─ docker
├─ resource
│   ├─ i18n
│   ├─ public
│   └─ template
├─ utility
├─ .gitattributes
├─ .gitignore
├─ go.mod
├─ go.sum
├─ main.go
├─ Makefile
└─ README.md
```

## Run the project

To run the project, execute the following command:

```bash
cd demo && gf run main.go
```

You can also run the project with `go run` command.

After running the command, terminal should output below:

```bash
$ cd demo && gf run main.go
build: main.go
go build -o ./main  main.go
./main
build running pid: 76159
2022-08-22 12:20:59.058 [INFO] swagger ui is serving at address: http://127.0.0.1:8000/swagger/
2022-08-22 12:20:59.058 [INFO] openapi specification is serving at address: http://127.0.0.1:8000/api.json
2022-08-22 12:20:59.059 [INFO] pid[76159]: http server started listening on [:8000]

  ADDRESS | METHOD |   ROUTE    |                             HANDLER                             |           MIDDLEWARE
----------|--------|------------|-----------------------------------------------------------------|----------------------------------
  :8000   | ALL    | /*         | github.com/gogf/gf/v2/net/ghttp.internalMiddlewareServerTracing | GLOBAL MIDDLEWARE
----------|--------|------------|-----------------------------------------------------------------|----------------------------------
  :8000   | ALL    | /api.json  | github.com/gogf/gf/v2/net/ghttp.(*Server).openapiSpec           |
----------|--------|------------|-----------------------------------------------------------------|----------------------------------
  :8000   | GET    | /hello     | demo/internal/controller.(*cHello).Hello                        | ghttp.MiddlewareHandlerResponse
----------|--------|------------|-----------------------------------------------------------------|----------------------------------
  :8000   | ALL    | /swagger/* | github.com/gogf/gf/v2/net/ghttp.(*Server).swaggerUI             | HOOK_BEFORE_SERVE
----------|--------|------------|-----------------------------------------------------------------|----------------------------------
```

By defaul the project will start at port `8000`, enable `OpenAPI` documentation and displays the Swagger ducomentation page. By default, all route information is printed to the terminal. This project template adds a single route: `/hello`.

### Upgrade Goframe Version

Excute `gf up -a` under the folder which contains the `go.mod` file to upgrade the GoFrame framework.
