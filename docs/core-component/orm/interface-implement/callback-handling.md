# ORM Interface Implementation - Callback

## Introduction

Custom callback processing is the most common implementation method in interface development. During development, you only need to replace and modify some methods in the interface and inject custom logic into the default implementation logic of the driver. Referring to the interface relationship diagram [ORM Interface Development](/docs/core-component/orm/interface-implement/#orm-relations), we know that all `SQL` statement executions must go through either the `DoQuery`, `DoExec`, or `DoFilter` interfaces. Depending on the requirements, you can implement and override the relevant interface methods in the custom driver to achieve the desired functionality.

One of the most common use cases is implementing unified operations, such as `SQL` logging or authentication checks, at the `ORM` layer.

## Example of Usage

Let's look at an example of custom callback processing. Here, we need to log all executed SQL statements into a `monitor` table to facilitate SQL auditing. Implementing this through a custom driver and then overriding the underlying interface methods of the ORM is the simplest approach. For simplicity, the following code provides a custom MySQL driver that inherits from the `mysql` module's already implemented driver.

```go
package driver

import (
    "context"

    "github.com/gogf/gf/contrib/drivers/mysql/v2"
    "github.com/gogf/gf/v2/database/gdb"
    "github.com/gogf/gf/v2/os/gtime"
)

// MyDriver is a custom database driver, which is used for testing only.
// For simplifying the unit testing case purpose, MyDriver struct inherits the mysql driver
// gdb.Driver and overwrites its functions DoQuery and DoExec.
// So if there's any SQL execution, it goes through MyDriver.DoQuery/MyDriver.DoExec firstly
// and then gdb.Driver.DoQuery/gdb.Driver.DoExec.
// You can call it sql "HOOK" or "HiJack" as you will.
type MyDriver struct {
    *mysql.Driver
}

var (
    // customDriverName is my driver name, which is used for registering.
    customDriverName = "MyDriver"
)

func init() {
    // It registers my custom driver in the package initialization function "init".
    // You can later use this type in the database configuration.
    if err := gdb.Register(customDriverName, &MyDriver{}); err != nil {
        panic(err)
    }
}

// New creates and returns a database object for MySQL.
// It implements the interface of gdb.Driver for extra database driver installation.
func (d *MyDriver) New(core *gdb.Core, node *gdb.ConfigNode) (gdb.DB, error) {
    return &MyDriver{
        &mysql.Driver{
            Core: core,
        },
    }, nil
}

// DoCommit commits the current SQL and arguments to the underlying SQL driver.
func (d *MyDriver) DoCommit(ctx context.Context, in gdb.DoCommitInput) (out gdb.DoCommitOutput, err error) {
    tsMilliStart := gtime.TimestampMilli()
    out, err = d.Core.DoCommit(ctx, in)
    tsMilliFinished := gtime.TimestampMilli()
    _, _ = in.Link.ExecContext(ctx,
        "INSERT INTO `monitor`(`sql`,`cost`,`time`,`error`) VALUES(?,?,?,?)",
        gdb.FormatSqlWithArgs(in.Sql, in.Args),
        tsMilliFinished-tsMilliStart,
        gtime.Now(),
        err,
    )
    return
}
```

In this example, we register a custom driver named `MyDriver` using `gdb.Register("MyDriver", &MyDriver{})` in the package initialization function `init`. We can also use `gdb.Register("mysql", &MyDriver{})` to replace the existing `MySQL` driver of the framework with our custom driver.

> The driver name `mysql` is the default name for the `DriverMysql` driver in the framework.

Since we are using a new driver name, `MyDriver`, you need to specify this driver name when configuring the database type in the `gdb` configuration. Here is an example configuration:

```yaml
database:
  default:
  - link: "MyDriver:root:12345678@tcp(127.0.0.1:3306)/user"
```

## Notes

When implementing interface methods, use the `Link` input parameter of the interface to operate on the database. Using the `g.DB` method to obtain the database object for operations may cause deadlock issues.
