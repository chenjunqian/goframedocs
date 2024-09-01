# ORM - Transaction Handling

The `Model` object can also be created through the `TX` transaction interface. A `Model` object created through a transaction object functions the same as a `Model` object created through a `DB` database object, except that all operations of the former are based on transactions. After a transaction is committed or rolled back, the corresponding `Model` object can no longer be used; otherwise, an error will be returned. Since the `TX` interface cannot be reused, one transaction object corresponds to one transaction process only, which ends after `Commit` or `Rollback`.

This section provides a brief introduction to the transaction processing methods involved in chain operations. For a more detailed introduction, please refer to the section on [ORM Transaction](/docs/core-component/orm/transaction).

## Using Transaction

To facilitate transaction operations, `gdb` provides a closure operation for transactions, implemented through the `Transaction` method. The method is defined as follows:

```go
func (db DB) Transaction(ctx context.Context, f func(ctx context.Context, tx TX) error) (err error)
```

If the closure function returns `nil` for the `error`, the current transaction automatically executes a `Commit` after the closure is finished; otherwise, it automatically executes a `Rollback`.

If a `panic` occurs within the closure, the transaction will also be rolled back.

**Example:**

```go
func Register() error {
    return g.DB().Transaction(ctx, func(ctx context.Context, tx gdb.TX) error {
        var (
            result sql.Result
            err    error
        )
        // Insert basic user data
        result, err = tx.Table("user").Insert(g.Map{
            "name":  "john",
            "score": 100,
            //...
        })
        if err != nil {
            return err
        }
        // Insert user detail data, requires the user `uid` from the previous insert
        result, err = tx.Table("user_detail").Insert(g.Map{
            "uid":   result.LastInsertId(),
            "phone": "18010576258",
            //...
        })
        return err
    })
}
```

## Using TX in Chain Operations

We can also switch the bound transaction object through the `TX` method in chain operations. Multiple chain operations can be bound to the same transaction object and executed within that transaction.

**Example:**

```go
func Register() error {
    var (
        uid int64
        err error
    )
    tx, err := g.DB().Begin()
    if err != nil {
        return err
    }
    // Check the return value when the function exits.
    // If successful, execute `tx.Commit()`.
    // Otherwise, execute `tx.Rollback()`.
    defer func() {
        if err != nil {
            tx.Rollback()
        } else {
            tx.Commit()
        }
    }()
    // Insert basic user data
    uid, err = AddUserInfo(tx, g.Map{
        "name":  "john",
        "score": 100,
        //...
    })
    if err != nil {
        return err
    }
    // Insert user detail data, requires the user `uid` from the previous insert
    err = AddUserDetail(tx, g.Map{
        "uid":   uid,
        "phone": "18010576259",
        //...
    })
    return err
}

func AddUserInfo(tx gdb.TX, data g.Map) (int64, error) {
    result, err := g.Model("user").TX(tx).Data(data).Insert()
    if err != nil {
        return 0, err
    }
    uid, err := result.LastInsertId()
    if err != nil {
        return 0, err
    }
    return uid, nil
}

func AddUserDetail(tx gdb.TX, data g.Map) error {
    _, err := g.Model("user_detail").TX(tx).Data(data).Insert()
    return err
}
```
