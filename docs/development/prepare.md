# Preparation

This series of chapters is not related to the Goframe, but mainly introduces some preparatory work that needs to be done before Golang development, such as environment installation, IDE configuration, package management instructions, and other basic knowledge. If you are an experienced Golang developer, please ignore.

## Environment Installation

1. Install Golang

    Refer to official website: <https://golang.org/doc/install>

2. IDE Development Environment Installation

Currently, there are two popular IDEs for Go: one is `VSCode` with Plugins (free), and the other is `JetBrains`' `GoLand` (paid). Since `JetBrains` is also a sponsor of the Goframe, we recommend using GoLand as the development IDE. For downloads and registration, please refer to online tutorials.

The official website of JetBrains is: <https://www.jetbrains.com>

The official website of VSCode is: <https://code.visualstudio.com>

Go in VSCode: <https://code.visualstudio.com/docs/languages/go>

## Go Module

`Go Module` is the official package management tool provided by Go since version `1.11.1`. It is used to manage packages and dependencies for Go projects, similar to PHP's `composer` or Node.js's `npm`. This section will introduce some commonly used practical commands and settings for `Go Module`. For more detailed information, please refer to the official documentation: [Modules](https://github.com/golang/go/wiki/Modules).

## About go.mod

The `go.mod` file is the dependency description file for a Go project. It is primarily used to describe two things:

1. What is the current project name (`module`)? Each project should have a set name, and the packages within the project can use this name to call each other.

2. What are the names of the third-party packages that the current project depends on? When the project runs, it automatically analyzes the code dependencies to generate a `go.sum` file for dependency analysis. Then, the Go compiler will download these third-party packages and then compile and run them.

We can make some changes to the previous "hello world" project by adding a go.mod file (you can also use the command `go mod init project-name` in the project root directory to initialize the project and generate this file). The content is as follows:

```go
module my-hello
```

Here, `my-hello` is the name of the current project and can be set freely.

That's it, the project's module initialization is completed simply.

In general, the `go.sum` dependency analysis file should be added to version control and committed along with the `go.mod` file.

## Go Environment Variables

For convenient development, three environment variables are often set in the development environment:

- `$GOROOT`: The installation directory of `Go`, which should not change after configuration.

- `$GOPATH`: The root path of the `Go` project in the local development environment (for project compilation, `go build`, `go install`). This environment variable can differ across projects during compilation.

- `$PATH` (Important): The `bin` directory of `Go` needs to be added to the system `$PATH` to facilitate the use of Go-related commands. Once configured, it should not change.

Go's environment variables are also detailed in the official documentation. For more information, please refer to the link: [Install Go from source](https://golang.org/doc/install/source).

> The `$GOOS` and `$GOARCH` environment variables in Go are quite practical for cross-compilation on different platforms. You just need to set these two variables before `go build`, which is one of the advantages of the Go language: it can compile into executables that run across platforms. It feels more efficient and lightweight than QT, although the resulting executable file is a bit larger, it is still within an acceptable range. For example, to compile a `Windows x86` executable on a `Linux amd64` architecture, you can use the following command:

```sh
CGO_ENABLED=0 GOOS=windows GOARCH=386 go build hello.go
```

> Regrettably, cross-compilation does not currently support the cgo method, so you need to set the environment variable `$CGO_ENABLED` to 0. After execution, an executable file named `hello.exe` for Windows x86 architecture will be generated in the current directory.

## Dependency Management

### Version Selection Algorithm

When there is a dependency on the same third-party package within a project, and the dependency versions are inconsistent, `Go Modules` uses the "minimal version selection algorithm" (`The minimal version selection algorithm`: <https://github.com/golang/go/wiki/Modules#version-selection>).

For example, if your module depends on module A which `requires D v1.0.0`, and your module also depends on module B which requires D v1.1.1, the minimal version selection will choose `version D v1.1.1` for building (using the highest version).

> Please do not ask why this algorithm is named the "minimal version selection algorithm," yet the content is about selecting the "highest version." If there is someone who are entangled in this issue, welcome to raise an issue with the official team: <https://github.com/golang/go/issues>

### Private Dependency Management

If you can perfectly manage the current project package dependencies through `go.mod`, you can ignore this section. If you encounter problems in managing the project's package dependencies, it is recommended to continue reading this section to find inspiration for solving the problem.

In the previous chapters, we introduced in detail with the basic development environment `installation`/`configuration`, and the `installation` and use of `Go Modules`. In actual project development, you will find more problems, common ones include:

1. Although `Goframe` is powerful enough, most of the time the dependent packages are not only `Goframe` but also some additional third-party packages, especially those from `golang.org`

2. Some self-host third-party packages, especially some business-dependent packages, are not allowed to be downloaded publicly (private libraries), and the version repository may also not support the `HTTPS` protocol, so they cannot be downloaded and managed using `go get` or `go.mod`;

If you encounter the above-mentioned problems, our recommended solution is to set the effective domain names for private packages through the `GOPRIVATE` method.

For example, the following command line method:

```sh
export GOPROXY=https://goproxy.cn
export GOPRIVATE=git.xxx.com
CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o main main.go
```

This feature requires support from Go v1.13 or above.
