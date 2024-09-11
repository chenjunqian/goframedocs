# ORM - Overview

## Introduction of Database Drivers

To decouple the database drivers from the main framework repository, starting from version v2.1, all database drivers must be manually imported through community packages.

For details on installing and importing database drivers, please refer to: [GoFrame Database Drivers](https://github.com/gogf/gf/tree/master/contrib/drivers)

## Basic Introduction

The ORM functionality of the GoFrame framework is implemented by the `gdb` module, which is used for ORM operations on commonly used relational databases.

The `gdb` database engine uses a connection pool design at its core, which automatically closes connections when they are no longer in use. Therefore, there is no need to explicitly use the `Close` method to close the database connection when the connection object is no longer needed.

**Note:** To enhance database operation security, it is not recommended to directly concatenate parameters into an SQL string for execution in ORM operations. Instead, it is advisable to use prepared statements (making full use of `?` placeholders) to pass SQL parameters. The underlying implementation of `gdb` uses prepared statements to handle parameters passed by the developer, ensuring the security of database operations.

For the interface documentation, visit: [GoFrame gdb Interface Documentation](https://pkg.go.dev/github.com/gogf/gf/v2/database/gdb)

## Component Features

The GoFrame ORM component has the following notable features:

- Fully automated support for nested transactions.
- Interface-oriented design, easy to use and extend.
- Built-in support for mainstream database types and easy extension.
- Powerful configuration management using the framework's unified configuration component.
- Support for obtaining a single instance of a database object for the same group configuration.
- Support for both native SQL method operations and ORM chain operations.
- Supports OpenTelemetry observability: tracing, logging, and metrics reporting.
- Automatic recognition of `Map`/`Struct` to receive query results through the `Scan` method, automating query result initialization and struct type conversion.
- Automatically identifies `nil` as empty results without needing to use `sql.ErrNoRows` to detect empty query data.
- Fully automated struct field-to-column mapping without the need to explicitly define struct tags to maintain the field-to-column mapping relationship.
- Automatic identification and filtering of fields in given `Map`/`Struct`/`Slice` parameter types, greatly improving query condition input and result reception.
- Perfect support for DAO (Data Access Object) design at the GoFrame framework level, with fully automated Model/DAO code generation to significantly improve development efficiency.
- Supports debugging mode, logging output, DryRun, custom handlers, automatic type conversion, custom interface conversions, and many other advanced features.
- Supports query caching, soft deletion, automated time updates, model associations, database cluster configuration (software master-slave mode), and other practical features.

## Operation Object

There are three ways to obtain a database operation object:

1. Using the `g.DB` method (recommended).
2. Using the native `gdb.New` method.
3. Using the native singleton method `gdb.Instance`.

The recommended approach is the first one. Here are the differences among these three methods:

- **`g.DB`**: This method uses a singleton object management approach, integrates configuration file management, and supports hot updates to configuration files.
- **`gdb.New`**: This method creates a new database object (non-singleton) based on the given database node configuration, and it does not support configuration files.
- **`gdb.Instance`**: This method is a native singleton management method in the package and should be used in conjunction with the configuration method to obtain the corresponding configured database singleton object by group name (not required).

The reason for having so many object acquisition methods is that GoFrame is a modular design framework, and each module can be used independently.

### Database Object Creation

```go
db, err := gdb.New(gdb.ConfigNode{
 Link: "mysql:root:12345678@tcp(127.0.0.1:3306)/test",
})
```

### Obtaining Database Singleton Object

```go
// Get the database object with the default configuration (configuration name is "default")
db := g.DB()

// Get the database object for the configuration group named "user"
db := g.DB("user")

// Use the native singleton management method to get the database singleton object
db, err := gdb.Instance()
db, err := gdb.Instance("user")
```
