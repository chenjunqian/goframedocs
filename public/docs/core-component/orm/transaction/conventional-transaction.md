# ORM Transaction - Conventional Operation

## Overview

The conventional methods for handling transactions include `Begin`, `Commit`, and `Rollback`, each specifying a particular transaction operation. To start a transaction, use the `db.Begin` method, which returns a transaction interface (`gdb.Tx`). You can use this object to perform subsequent database operations and either commit the changes with `tx.Commit` or roll back the changes with `tx.Rollback`.

### Important Notes

- After starting a transaction, ensure to close it using `Commit` or `Rollback` when it is no longer needed. It is highly recommended to use the `defer` method for this purpose.
- Failing to close the transaction can lead to a continuous increase in goroutine leaks on the application side, and the database may run out of transaction threads, causing subsequent transaction requests to time out.
- Whenever possible, use the **Transaction Closure Method** for safer transaction operations.

## Example Usage

### Starting a Transaction

To begin a transaction:

```go
db := g.DB()

if tx, err := db.Begin(ctx); err == nil {
    fmt.Println("Transaction started")
}
```

The transaction object (`tx`) can perform all methods available to the `db` object. Refer to the [API Documentation](https://pkg.go.dev/github.com/gogf/gf/v2/database/gdb) for details.

### Rolling Back a Transaction

To roll back a transaction in case of an error:

```go
if tx, err := db.Begin(ctx); err == nil {
    r, err := tx.Save("user", g.Map{
        "id"   :  1,
        "name" : "john",
    })
    if err != nil {
        tx.Rollback()  // Rollback transaction on error
    }
    fmt.Println(r)
}
```

### Committing a Transaction

To commit a transaction after successful execution:

```go
if tx, err := db.Begin(ctx); err == nil {
    r, err := tx.Save("user", g.Map{
        "id"   :  1,
        "name" : "john",
    })
    if err == nil {
        tx.Commit()  // Commit transaction if no error
    }
    fmt.Println(r)
}
```

### Chained Operations in a Transaction

The transaction object (`tx`) can also perform chained operations using `tx.Model`. The returned object is similar to the one returned by `db.Model`, but all operations are executed within the transaction and can be either committed or rolled back:

```go
if tx, err := db.Begin(ctx); err == nil {
    r, err := tx.Model("user").Data(g.Map{"id": 1, "name": "john_1"}).Save()
    if err == nil {
        tx.Commit()  // Commit transaction after chained operation
    }
    fmt.Println(r)
}
```

For more details on chained operations, refer to the [ORM - Chained Operations](/docs/core-component/orm/chain-opts/) section.
