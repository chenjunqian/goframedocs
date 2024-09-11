# ORM - Closure Operations

## Pain Points

Using conventional transaction methods (`tx.Begin`, `tx.Commit`, `tx.Rollback`) to manage transactions has several drawbacks:

- **Redundant Code**: Frequent repetition of `tx.Commit` and `tx.Rollback` operations leads to verbose code.
- **High Risk of Errors**: It is easy to forget to execute `tx.Commit` or `tx.Rollback` due to code logic bugs, causing transactions to remain open. Many developers have encountered production issues caused by improperly closed transactions. The author updated this section (2023-08-09) due to a recent incident involving a friend who faced a production issue because of improper manual transaction management.
- **Complexity in Nested Transactions**: Handling multiple levels of transactions (nested transactions) requires passing the `tx` object down the call chain, which adds complexity to the code.

## Closure Transaction

To make transaction handling easier and safer, the ORM component provides a closure-based method using the `Transaction` function. The method is defined as follows:

```go
func (db DB) Transaction(ctx context.Context, f func(ctx context.Context, tx TX) error) (err error)
```

- If the closure function (`f`) returns `nil`, the transaction is automatically committed (`Commit`).
- If the closure function returns an error, the transaction is automatically rolled back (`Rollback`).
- The `context.Context` parameter introduced in GoFrame v1.16 is mainly used for trace propagation and nested transaction management. This context parameter is explicitly passed to manage nested transactions effectively.
- If a `panic` occurs within the closure, the transaction is also rolled back to ensure safety.

## Example Usage

Here is an example of using the closure-based transaction handling:

```go
g.DB().Transaction(context.TODO(), func(ctx context.Context, tx gdb.TX) error {
    // Insert into the "user" table
    result, err := tx.Ctx(ctx).Insert("user", g.Map{
        "passport": "john",
        "password": "12345678",
        "nickname": "JohnGuo",
    })
    if err != nil {
        return err  // Automatically rolls back if an error occurs
    }

    // Get the last inserted ID
    id, err := result.LastInsertId()
    if err != nil {
        return err  // Automatically rolls back if an error occurs
    }

    // Insert into the "user_detail" table
    _, err = tx.Ctx(ctx).Insert("user_detail", g.Map{
        "uid":       id,
        "site":      "https://johng.cn",
        "true_name": "GuoQiang",
    })
    if err != nil {
        return err  // Automatically rolls back if an error occurs
    }
    
    return nil  // Automatically commits if no error occurs
})
```

Using the closure method simplifies the code, reduces the risk of errors, and makes nested transaction management transparent to the upper-level business logic. You can read more about this in the next section: [ORM - Nested Transactions](/docs/core-component/orm/transaction/nested-transaction).
