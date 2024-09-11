# Implict and Explicit Initialization

We know that when the program starts, there are some "initialization" logic operations that need to be performed, such as: `Server` configuration, various database (`MySQL`, `Redis`, `Kafka`, etc.) configurations, business object configuration, etc. In most scenarios, we have two ways of initialization: `implicit` initialization and `explicit` initialization.

## Implicit Initialization

Special attention: After the `Golang v1.21` version, the order of execution for `init` has changed, which may cause problems for packages that depend on `init` to perform initialization logic. Therefore, it is not recommended to perform complex initialization logic in `init`. It is recommended to achieve complex module initialization logic through `explicit` calls.

`Implicit` initialization is generally carried out through the package initialization method `init`. It should be noted that if there is a possibility of errors in the initialization logic, since the errors in the `init` method cannot be caught by the upper layer, the program startup is often terminated directly when an initialization error occurs. For example:

```go
func init() {
    if !gfile.Exists(User.avatarUploadPath) {
        if err := gfile.Mkdir(User.avatarUploadPath); err != nil {
            g.Log().Fatal(ctx, err)
        }
    }
}
```

`Implicit` initialization often directly terminates the program startup when errors occur.

The advantage of `implicit` initialization is that it does not require manual calling of initialization methods, hiding the initialization details from developers, thus reducing their mental burden. However, the disadvantage is the same; developers are unaware of the initialization details, and it is difficult to quickly locate the cause of errors when they occur. Therefore, when using `implicit` initialization, it is often necessary to print detailed error and stack information to facilitate error location.

Many modules of the `Goframe` adopt implicit initialization, hiding the initialization details of the modules and reducing the mental burden on developers. For example:

```go
func init() {
    go asyncProducingRandomBufferBytesLoop()
}
```

Modules in `Goframe` commonly feature implicit initialization design.

```go
package main

import (
    _ "github.com/gogf/gf/contrib/drivers/mysql/v2"

    _ "focus-single/internal/packed"

    _ "focus-single/internal/logic"

    "focus-single/internal/cmd"
    "github.com/gogf/gf/v2/os/gctx"
)

func main() {
    cmd.Main.Run(gctx.GetInitCtx())
}
```

## Explicit Initialization

`Explicit` initialization requires developers to call specific methods to perform initialization operations at program startup, such as in the `main` or `boot` module. Generally, the initialization of basic components tends to use `implicit` initialization more often because users are not concerned with the initialization logic of the underlying basic modules. In contrast, the initialization of business modules usually adopts `explicit` initialization. For example:

Explicit initialization in the `boot` module.

```go
func Boot() error {
    var err error
    _, err = InitDefaultConfig()
    if err != nil {
        return gerror.Wrap(err, "init default config failed")
    }

    err = InitLoggers()
    if err != nil {
        return gerror.Wrap(err, "init loggers failed")
    }
    ......
}
```

Explicit initialization in the `main` module.

```go
func main() {
    err := boot.Boot()
    if err != nil {
        g.Log().Fatal(ctx, err)
    }
}
```
