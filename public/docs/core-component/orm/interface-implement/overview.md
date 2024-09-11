# ORM - Interface Development

The `gdb` module in the GoFrame framework utilizes a highly flexible and extensible interface design. This design allows developers to easily customize and replace any method defined in the interface.

## DB Interface

- **Interface Documentation**: [DB Interface Documentation](https://pkg.go.dev/github.com/gogf/gf/v2/database/gdb#DB)

The `DB` interface is the core interface for database operations and is the most commonly used interface when working with an ORM (Object-Relational Mapping) to interact with a database. Below are some important methods of this interface:

- **Open Method**:  
  The `Open` method is used to create a specific database connection object. It returns a generic database object, `*sql.DB`, from the standard library.

- **Do Series Methods**:  
  The first parameter `link` in the `Do*` series methods is an object of the `Link` interface. In a master-slave configuration, this could either be a master node or a slave node. Therefore, when using the `link` parameter in the implementation of inherited driver objects, it's crucial to consider the current operating mode. In most master-slave database configurations, the slave node is often read-only and not writable.

- **HandleSqlBeforeCommit Method**:  
  The `HandleSqlBeforeCommit` method is called each time before an SQL query is sent to the database server for execution. This method allows for pre-commit callback processing.

For additional methods, refer to the [interface documentation](https://pkg.go.dev/github.com/gogf/gf/v2/database/gdb#DB) or the source code files.

## ORM Relations

![orm relations](https://goframe.org/download/attachments/1114701/image2021-12-27_21-0-8.png?version=1&modificationDate=1640609880734&api=v2)

## Driver Interface

- **Interface Documentation**: [Driver Interface Documentation](https://pkg.go.dev/github.com/gogf/gf/v2/database/gdb#Driver)

Developers creating custom drivers need to implement the following interface:

```go
// Driver is the interface for integrating SQL drivers into package gdb.
type Driver interface {
    // New creates and returns a database object for the specified database server.
    New(core *Core, node *ConfigNode) (DB, error)
}
```

- **New Method**:  
  The `New` method is used to create a database operation object corresponding to the driver based on the `Core` database base object and the `ConfigNode` configuration object. It is important to note that the returned database object must implement the `DB` interface. Since the base database object `Core` has already implemented the `DB` interface, developers only need to "inherit" the `Core` object and then override the corresponding interface methods as needed.
