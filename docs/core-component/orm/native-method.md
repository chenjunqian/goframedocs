# ORM - Native Methods

## Overview

Native methods are used to execute raw `SQL` queries and are considered more low-level compared to `ORM` chain operations. They are suitable for handling complex `SQL` operations that cannot be achieved with ORM chain operations.

### API Documentation

For detailed information, please refer to the [API Documentation](https://pkg.go.dev/github.com/gogf/gf/v2/database/gdb).

## Common Methods

The list of methods provided in this document may lag behind the actual code. For the most up-to-date methods, please refer to the API documentation. Below are some common methods:

```go
// SQL operation methods, return native sql objects
Query(ctx context.Context, query string, args ...interface{}) (*sql.Rows, error)
Exec(ctx context.Context, query string, args ...interface{}) (sql.Result, error)
Prepare(ctx context.Context, query string) (*sql.Stmt, error)

// Data table record queries:
// Query single or multiple records, get record objects, query single field values (similar to chain operations)
GetAll(ctx context.Context, sql string, args ...interface{}) (Result, error)
GetOne(ctx context.Context, sql string, args ...interface{}) (Record, error)
GetValue(ctx context.Context, sql string, args ...interface{}) (Value, error)
GetArray(ctx context.Context, sql string, args ...interface{}) ([]Value, error)
GetCount(ctx context.Context, sql string, args ...interface{}) (int, error)
GetScan(ctx context.Context, objPointer interface{}, sql string, args ...interface{}) error

// Single data operations
Insert(ctx context.Context, table string, data interface{}, batch ...int) (sql.Result, error)
Replace(ctx context.Context, table string, data interface{}, batch ...int) (sql.Result, error)
Save(ctx context.Context, table string, data interface{}, batch ...int) (sql.Result, error)

// Data modification/deletion
Update(ctx context.Context, table string, data interface{}, condition interface{}, args ...interface{}) (sql.Result, error)
Delete(ctx context.Context, table string, condition interface{}, args ...interface{}) (sql.Result, error)
```

## Brief Explanation

- **`Query` Method**: The basic method for data queries that returns a native SQL result set object, which needs to be parsed manually. It is recommended to use the `Get*` methods for automatic result parsing.
- **`Exec` Method**: Used for SQL operations like insertions and updates.
- **`Get*` Methods**: Recommended for data queries.
- **`Insert` / `Replace` / `Save` Methods**: The `data` parameter supports types like `string`, `map`, `slice`, `struct`, or `*struct`. If a `slice` is provided, it is recognized as a batch operation, and the `batch` parameter becomes effective.

## Usage Examples

### ORM Objects

```go
// Get the database object with the default configuration (configuration name is "default")
db := g.DB()

// Get the database object with the configuration group name "user-center"
db := g.DB("user-center")

// Use the native singleton management method to get the database object instance
db, err := gdb.Instance()
db, err := gdb.Instance("user-center")

// Note: There is no need to call the Close method to close the database connection when not in use.
// The underlying database engine uses a connection pool design, and connections will be closed automatically when no longer needed.
```

### Inserting Data

```go
r, err := db.Insert(ctx, "user", gdb.Map {
    "name": "john",
})
```

### Querying List Data

```go
list, err := db.GetAll(ctx, "select * from user limit 2")
list, err := db.GetAll(ctx, "select * from user where age > ? and name like ?", g.Slice{18, "%john%"})
list, err := db.GetAll(ctx, "select * from user where status=?", g.Slice{1})
```

### Querying Single Data

```go
one, err := db.GetOne(ctx, "select * from user limit 2")
one, err := db.GetOne(ctx, "select * from user where uid=1000")
one, err := db.GetOne(ctx, "select * from user where uid=?", 1000)
one, err := db.GetOne(ctx, "select * from user where uid=?", g.Slice{1000})
```

### Saving Data

```go
r, err := db.Save(ctx, "user", gdb.Map {
    "uid"  :  1,
    "name" : "john",
})
```

### Batch Operations

The `batch` parameter specifies the number of records to write in each batch (default is 10).

```go
_, err := db.Insert(ctx, "user", gdb.List {
    {"name": "john_1"},
    {"name": "john_2"},
    {"name": "john_3"},
    {"name": "john_4"},
}, 10)
```

### Updating and Deleting Data

```go
// db.Update/db.Delete works similarly
// UPDATE `user` SET `name`='john' WHERE `uid`=10000
r, err := db.Update(ctx, "user", gdb.Map {"name": "john"}, "uid=?", 10000)

// UPDATE `user` SET `name`='john' WHERE `uid`=10000
r, err := db.Update(ctx, "user", "name='john'", "uid=10000")

// UPDATE `user` SET `name`='john' WHERE `uid`=10000
r, err := db.Update(ctx, "user", "name=?", "uid=?", "john", 10000)
```

**Note:** It is recommended to use prepared statements (using `?` as placeholders) to avoid SQL injection risks.
