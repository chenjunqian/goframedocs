# ORM - Nested Transactions

GoFrame ORM supports nested transactions, which are widely used in business projects, especially in cases where different business modules need to interact while ensuring that all their database operations are within a single transaction. The mechanism behind this is the implicit passing and association of the same transaction object through a `context` parameter. It is important to note that most database services do not natively support nested transactions; instead, they are implemented at the ORM layer using the transaction savepoint feature. We recommend using the `Transaction` closure method to handle nested transactions. To maintain the completeness of the documentation, we will start with a basic transaction operation method before introducing nested transaction operations.

## Example SQL

Here is a simple SQL example that contains two fields: `id` and `name`:

```sql
CREATE TABLE `user` (
  `id` int(10) unsigned NOT NULL COMMENT 'User ID',
  `name` varchar(45) NOT NULL COMMENT 'User Name',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

## Regular Operation (Not Recommended)

```go
db := g.DB()

tx, err := db.Begin()
if err != nil {
    panic(err)
}
if err = tx.Begin(); err != nil {
    panic(err)
}
_, err = tx.Model(table).Data(g.Map{"id": 1, "name": "john"}).Insert()
if err = tx.Rollback(); err != nil {
    panic(err)
}
_, err = tx.Model(table).Data(g.Map{"id": 2, "name": "smith"}).Insert()
if err = tx.Commit(); err != nil {
    panic(err)
}
```

### db.Begin vs tx.Begin

In our nested transaction example, we have both `db.Begin` and `tx.Begin`. What’s the difference between them?

- `db.Begin` actually starts a new transaction at the database service level and returns a transaction object `tx`. All subsequent transaction operations are managed through this `tx` object.
- `tx.Begin` starts a nested transaction within the current transaction. By default, it automatically names the savepoints in the format `transactionN`, where `N` represents the level of nesting. If you see `SAVEPOINT transaction1` in the logs, it indicates the current nesting level is 2 (starting from 0).

### Detailed Logs

GoFrame’s ORM provides a comprehensive logging mechanism. If you enable SQL logs, you will see the following information detailing the entire execution process of database requests:

```plaintext
2021-05-22 21:12:10.776 [DEBU] [  4 ms] [default] [txid:1] BEGIN
2021-05-22 21:12:10.776 [DEBU] [  0 ms] [default] [txid:1] SAVEPOINT `transaction0`
2021-05-22 21:12:10.789 [DEBU] [ 13 ms] [default] [txid:1] SHOW FULL COLUMNS FROM `user`
2021-05-22 21:12:10.790 [DEBU] [  1 ms] [default] [txid:1] INSERT INTO `user`(`id`,`name`) VALUES(1,'john') 
2021-05-22 21:12:10.791 [DEBU] [  1 ms] [default] [txid:1] ROLLBACK TO SAVEPOINT `transaction0`
2021-05-22 21:12:10.791 [DEBU] [  0 ms] [default] [txid:1] INSERT INTO `user`(`id`,`name`) VALUES(2,'smith') 
2021-05-22 21:12:10.792 [DEBU] [  1 ms] [default] [txid:1] COMMIT
```

Here, `[txid:1]` represents the transaction ID recorded by the ORM component. When multiple real transactions operate concurrently, each transaction will have a different ID. For nested transactions within the same real transaction, the transaction ID remains the same.

***Result of Database Query***

```sql
mysql> select * from `user`;
+----+-------+
| id | name  |
+----+-------+
|  2 | smith |
+----+-------+
1 row in set (0.00 sec)
```

As shown above, the first operation is successfully rolled back, and only the second operation is executed and committed successfully.

## Closure Operation (Recommended)

We can also use the closure operation to implement nested transactions using the `Transaction` method.

```go
db.Transaction(ctx, func(ctx context.Context, tx gdb.Tx) error {
    // Nested transaction 1.
    if err := tx.Transaction(ctx, func(ctx context.Context, tx gdb.Tx) error {
    _, err := tx.Model(table).Ctx(ctx).Data(g.Map{"id": 1, "name": "john"}).Insert()
        return err
    }); err != nil {
        return err
    }
    // Nested transaction 2, panic.
    if err := tx.Transaction(ctx, func(ctx context.Context, tx gdb.Tx) error {
    _, err := tx.Model(table).Ctx(ctx).Data(g.Map{"id": 2, "name": "smith"}).Insert()
        // Create a panic that can make this transaction rollback automatically.
        panic("error")
        return err
    }); err != nil {
        return err
    }
    return nil
})
```

In this example, it is also possible to use the `db` object or `dao` package directly within the nested transactions, which is more common. Especially when calling method levels, developers do not need to worry about passing the `tx` object or whether the current transaction needs to be nested. The component automatically handles everything, significantly reducing the developer's cognitive burden. However, make sure to pass the `ctx` context parameter at every level. For example:

```go
db.Transaction(ctx, func(ctx context.Context, tx gdb.Tx) error {
    // Nested transaction 1.
    if err := db.Transaction(ctx, func(ctx context.Context, tx gdb.Tx) error {
    _, err := db.Model(table).Ctx(ctx).Data(g.Map{"id": 1, "name": "john"}).Insert()
        return err
    }); err != nil {
        return err
    }
    // Nested transaction 2, panic.
    if err := db.Transaction(ctx, func(ctx context.Context, tx gdb.Tx) error {
    _, err := db.Model(table).Ctx(ctx).Data(g.Map{"id": 2, "name": "smith"}).Insert()
        // Create a panic that can make this transaction rollback automatically.
        panic("error")
        return err
    }); err != nil {
        return err
    }
    return nil
})
```

If you enable `SQL` logging, you'll see the following log information showing the detailed execution process of the database request:

```plaintext
2021-05-22 21:29:38.841 [DEBU] [  3 ms] [default] [txid:1] BEGIN
2021-05-22 21:29:38.842 [DEBU] [  1 ms] [default] [txid:1] SAVEPOINT `transaction0`
2021-05-22 21:29:38.843 [DEBU] [  1 ms] [default] [txid:1] SHOW FULL COLUMNS FROM `user`
2021-05-22 21:29:38.845 [DEBU] [  2 ms] [default] [txid:1] INSERT INTO `user`(`id`,`name`) VALUES(1,'john') 
2021-05-22 21:29:38.845 [DEBU] [  0 ms] [default] [txid:1] RELEASE SAVEPOINT `transaction0`
2021-05-22 21:29:38.846 [DEBU] [  1 ms] [default] [txid:1] SAVEPOINT `transaction0`
2021-05-22 21:29:38.847 [DEBU] [  1 ms] [default] INSERT INTO `user`(`id`,`name`) VALUES(2,'smith') 
2021-05-22 21:29:38.848 [DEBU] [  0 ms] [default] [txid:1] ROLLBACK TO SAVEPOINT `transaction0`
2021-05-22 21:29:38.848 [DEBU] [  0 ms] [default] [txid:1] ROLLBACK
```

## SavePoint and RollbackTo

Developers can flexibly use the Transaction Save Point feature, allowing custom SavePoint names and specifying Point rollback operations.

```go
tx, err := db.Begin()
if err != nil {
    panic(err)
}
defer func() {
    if err := recover(); err != nil {
        _ = tx.Rollback()
    }
}()
if _, err = tx.Model(table).Data(g.Map{"id": 1, "name": "john"}).Insert(); err != nil {
    panic(err)
}
if err = tx.SavePoint("MyPoint"); err != nil {
    panic(err)
}
if _, err = tx.Model(table).Data(g.Map{"id": 2, "name": "smith"}).Insert(); err != nil {
    panic(err)
}
if _, err = tx.Model(table).Data(g.Map{"id": 3, "name": "green"}).Insert(); err != nil {
    panic(err)
}
if err = tx.RollbackTo("MyPoint"); err != nil {
    panic(err)
}
if err = tx.Commit(); err != nil {
    panic(err)
}
```

If you enable `SQL` logging, you'll see the following log information showing the detailed execution process of the database request:

```bash
2021-05-22 21:38:51.992 [DEBU] [  3 ms] [default] [txid:1] BEGIN
2021-05-22 21:38:52.002 [DEBU] [  9 ms] [default] [txid:1] SHOW FULL COLUMNS FROM `user`
2021-05-22 21:38:52.002 [DEBU] [  0 ms] [default] [txid:1] INSERT INTO `user`(`id`,`name`) VALUES(1,'john') 
2021-05-22 21:38:52.003 [DEBU] [  1 ms] [default] [txid:1] SAVEPOINT `MyPoint`
2021-05-22 21:38:52.004 [DEBU] [  1 ms] [default] [txid:1] INSERT INTO `user`(`id`,`name`) VALUES(2,'smith') 
2021-05-22 21:38:52.005 [DEBU] [  1 ms] [default] [txid:1] INSERT INTO `user`(`id`,`name`) VALUES(3,'green') 
2021-05-22 21:38:52.006 [DEBU] [  0 ms] [default] [txid:1] ROLLBACK TO SAVEPOINT `MyPoint`
2021-05-22 21:38:52.006 [DEBU] [  0 ms] [default] [txid:1] COMMIT
```

After execution, querying the database results in:

```sql
mysql> select * from `user`;
+----+------+
| id | name |
+----+------+
|  1 | john |
+----+------+
1 row in set (0.00 sec)
```

As shown, by saving a SavePoint named `MyPoint` after the first `Insert` operation, subsequent operations were rolled back using `RollbackTo`, so only the first `Insert` operation was successfully committed.

## Nested Transactions Example

To simplify the example, we'll use user-related examples, such as user registration, where transaction operations save basic user information (user) and detailed information (user_detail) into two tables. If any table operation fails, the entire registration operation will fail. To demonstrate nested transactions, we divide user basic information management and user detailed information management into two DAO objects.

Assuming our project follows the Goframe standard project structure with three layers: api-service-dao, our nested transaction operations might look like this.

### Controller

```go
// User registration HTTP interface
func (*cUser) Signup(r *ghttp.Request) {
    // ....
    service.User().Signup(r.Context(), userServiceSignupReq)
    // ...
}
```

This handles the HTTP request and passes the `Context` variable to subsequent processes.

### Service

```go
// User registration business logic handling
func (*userService) Signup(ctx context.Context, r *model.UserServiceSignupReq) {
    // ....
    dao.User.Transaction(ctx, func(ctx context.Context, tx gdb.Tx) error {
        err := dao.User.Ctx(ctx).Save(r.UserInfo)
        if err != nil {
            return err
        }
        err := dao.UserDetail.Ctx(ctx).Save(r.UserDetail)
        if err != nil {
            return err
        }
        return nil
    })
    // ...
}
```

Here, the `user` table and `user_detail` table use nested transactions for unified transaction operations. Note that within the closure, the context variable should be passed to the next level using the `Ctx` method. If there are calls to other service objects within the closure, the `ctx` variable should be passed along, for example:

```go
func (*userService) Signup(ctx context.Context, r *model.UserServiceSignupReq) {
    // ....
    dao.User.Transaction(ctx, func(ctx context.Context, tx gdb.Tx) (err error) {
        if err = dao.User.Ctx(ctx).Save(r.UserInfo); err != nil {
            return err
        }
        if err = dao.UserDetail.Ctx(ctx).Save(r.UserDetail); err != nil {
            return err
        }
        if err = service.XXXA().Call(ctx, ...); err != nil {
            return err
        }
        if err = service.XXXB().Call(ctx, ...); err != nil {
            return err
        }
        if err = service.XXXC().Call(ctx, ...); err != nil {
            return err
        }
        // ...
        return nil
    })
    // ...
}
```

### DAO

`DAO` layer code is automatically generated and maintained by the `Goframe CLI` tool.
