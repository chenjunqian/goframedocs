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
