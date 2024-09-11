# Log - Overview

`glog` is a universal high-performance log management module that implements powerful and easy-to-use log management function. It is one of the core components of the `Goframe`.

## Introduction

Usage:

```go
import "github.com/gogf/gf/v2/os/glog"
```

Go docs: <https://pkg.go.dev/github.com/gogf/gf/v2/os/glog>

### Brief

1. The `glog` module has a fixed log file name format of `*.log`, which means it always uses `.log` as the suffix for log file names.

2. The `glog` supports a variety of rich features such as file output, log level, log categorization, debug management, call tracking, chain operations, and rolling splitting.

3. Using the `glog.New` method to create a `glog.Logger` object for custom log printing, and it is also recommended to use the package methods provided by `glog` for printing logs.

4. When modifying the module configuration with package methods, `note` that any `glog.Set*` setting method will take effect globally.

5. The default log content format is `Time [Level] Content New Line`, where Time is precise to the millisecond level, `Level` is an optional output, `Content` is the parameter input from the caller, and `New Line` is an optional output (some methods automatically add a newline character to the log content). An example of log content is: `2018-10-10 12:00:01.568 [ERRO] Error occurred`.

6. The `Print*/Debug*/Info*` methods output log content to the standard output (`stdout`). To prevent log disorder, the `Notice*/Warning*/Error*/Critical*/Panic*/Fatal*` methods also output log content to the standard output (`stdout`).

7. The `Panic*` methods will cause a `panic` error method after outputting log information.

8. The `Fatal*` methods will stop the process and return a process status code of `1` (the normal program exit status code is `0`) after outputting log information.

## Component Feature

The `glog` component has the following notable features:

- Easy to use and powerful

- Supports configuration management with a unified configuration component

- Supports log levels

- Supports colored printing

- Supports chain operations

- Supports specifying output log files/directories

- Supports link tracking

- Supports asynchronous output

- Supports stack trace printing

- Supports debugging information toggle

- Supports custom `Writer` output interface

- Supports custom log `Handler` processing

- Supports custom log `CtxKeys` values

- Supports `JSON` format printing

- Supports `Flags` features

- Supports `Rotate` rolling splitting feature

## Single Object

The logging component supports the singleton pattern. You can obtain different singleton log management objects with `g.Log(instanceName)`. The purpose of providing singleton objects is to use log management objects with different configurations for different business scenarios. We recommend using the `g.Log()` method to get the singleton object for log operations. This method will automatically read the configuration file and initialize the singleton object internally, and this initialization will only be executed once.

### Difference Between `glog` and `g.Log()`

- The `glog` is the package name of the logging component, and `g.Log()` is a singleton object of the logging component.

- The `g.Log()` singleton object is maintained by the object management component package `g`, and it automatically reads the log configuration when it is created, making it easy to use. It is recommended to use this method to work with the logging component in most scenarios.

- `glog` is used as an independent component, and by default, it outputs logs directly to the terminal. You can also set global configurations through the configuration management method, or create an independent log object using `New`.

**Why there are two way to print logs? Which one should I use?**

Since every component of the framework is designed to be **decoupled**, the framework can be used as a **standalone toolkit**. For example, if a project only needs to use the logging component, you can directly use the methods of the `glog` package without importing other components. However, using the toolkit in a project can be complicated, often involving configuration and component initialization (which usually leads to secondary encapsulation). Therefore, the framework also provides a **coupling** package called the `g` package, which by default loads some commonly used components. `g.Log()` is the logging component within this package, it automatically reads and initializes the configuration object according to engineering standards, quickly initializes the log object with singleton management, and simplifies the use of logs in project.
