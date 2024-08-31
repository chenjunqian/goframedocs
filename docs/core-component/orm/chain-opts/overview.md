# ORM - Overview

## Basic Introduction

The gdb chain operation method is simple and flexible, and it is the recommended database operation method for the GoFrame framework. Chain operations can be performed using the `db.Model` method of the database object or the `tx.Model` method of the transaction object. These methods return a chainable operation object `*Model` based on the specified data table. This object can execute various methods. Note that the current list of methods may be outdated compared to the source code. For a detailed list of methods, please refer to the API documentation: [https://pkg.go.dev/github.com/gogf/gf/v2/database/gdb#Model](https://pkg.go.dev/github.com/gogf/gf/v2/database/gdb#Model)

## Unsupported Operations

The following table shows the support status for different operations in the latest version.

```markdown
| Database   | Replace       | Save          | InsertIgnore   | InsertGetId   | LastInsertId  | Transaction   | RowsAffected  |
|------------|---------------|---------------|----------------|---------------|---------------|---------------|---------------|
| MySQL      | Supported     | Supported     | Supported      | Supported     | Supported     | Supported     | Supported     |
| MariaDB    | Supported     | Supported     | Supported      | Supported     | Supported     | Supported     | Supported     |
| TiDB       | Supported     | Supported     | Supported      | Supported     | Supported     | Supported     | Supported     |
| PostgreSQL | Not Supported | Supported     | Not Supported  | Supported     | Supported     | Supported     | Supported     |
| MSSQL      | Not Supported | Supported     | Supported      | Supported     | Not Supported | Supported     | Supported     |
| SQLite     | Not Supported | Supported     | Supported      | Supported     | Supported     | Supported     | Supported     |
| Oracle     | Not Supported | Supported     | Supported      | Supported     | Not Supported | Supported     | Supported     |
| DM         | Not Supported | Supported     | Supported      | Supported     | Supported     | Supported     | Supported     |
| ClickHouse | Not Supported | Not Supported | Not Supported  | Not Supported | Supported     | Not Supported | Not Supported |
```
