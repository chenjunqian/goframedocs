# ORM Interface Development - Driver Development

## Introduction

The purpose of developing drivers for the framework's database component is to ensure that various methods for database operations used by upper-layer business logic remain unchanged. Users can switch to a new database simply by modifying the database type in the configuration.

By leveraging the interface design of the database component, you can:  

- Add support for third-party databases not natively supported by the framework.
- Customize existing supported drivers.

Driver development does not involve fully implementing the protocol code for a type of database; instead, it involves using an existing third-party database driver and implementing the framework's database component interface to integrate that driver. This ensures consistency in upper-layer operations.

## Driver Registration

As mentioned earlier, after implementing the `Driver` interface, you can register a custom driver with the `gdb` module using the following method:

```go
// Register registers a custom database driver to gdb.
func Register(name string, driver Driver) error
```

The driver name `name` can be an existing driver name, such as `mysql`, `mssql`, `pgsql`, etc. If a driver with the same name is registered, the new driver will override the existing driver.

## Driver Implementation

Developing and registering a custom driver with the `gdb` module is straightforward. You can refer to the code examples of the database types that have already been integrated in the `gdb` module's source code: [goframe drivers](https://github.com/gogf/gf/tree/master/contrib/drivers).

Typically, the most common way to develop or modify a driver is to directly inherit from the existing `*Core` type since the `Driver` interface passes an object of this type, for example:

```go
// DriverMysql is the driver for the MySQL database.
type DriverMysql struct {
    *Core
}

// New creates and returns a database object for MySQL.
// It implements the interface of gdb.Driver for extra database driver installation.
func (d *DriverMysql) New(core *Core, node *ConfigNode) (DB, error) {
    return &DriverMysql{
        Core: core,
    }, nil
}
```

## Notes

A new driver should at least implement the following interface methods:

- **Open**: Used to create a database connection.
- **GetChars**: Used to obtain the escape characters of the database.
- **Tables**: Returns the list of data tables in the current or specified database.
- **TableFields**: Returns the field list information of a specified data table.
