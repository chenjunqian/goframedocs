# ORM Chain Operation - Lock

## Pessimistic Lock

**Pessimistic Lock** assumes that conflicts or modifications to the data are likely to happen. Therefore, whenever data is accessed, a lock is placed on it. This means other processes or transactions must wait until the lock is released. Traditional relational databases often use mechanisms like row locks, table locks, read locks, and write locks to achieve this.

## Optimistic Lock

**Optimistic Lock** assumes that conflicts or modifications to the data are unlikely to happen. When accessing data, no lock is placed, but when updating, the system checks if any modifications have been made to the data in the meantime. This can be achieved using mechanisms like version numbers. Optimistic locks are suitable for applications with a high read-to-write ratio, as they can improve throughput.

## Usage of Pessimistic Lock

**Relevant Methods:**

- `func (m *Model) LockUpdate() *Model`
- `func (m *Model) LockShared() *Model`

The `gdb` module provides two methods, `LockShared` and `LockUpdate`, to help implement pessimistic locks in SQL statements.

### LockShared

The `LockShared` method is used to place a "shared lock" on selected rows during a query, which prevents them from being modified until the transaction is committed:

```go
g.Model("users").Ctx(ctx).Where("votes>?", 100).LockShared().All()
```

This query is equivalent to the following SQL statement:

```sql
SELECT * FROM `users` WHERE `votes` > 100 LOCK IN SHARE MODE
```

### LockUpdate

The `LockUpdate` method creates a `FOR UPDATE` lock, which prevents the selected rows from being modified or deleted by other transactions:

```go
g.Model("users").Ctx(ctx).Where("votes>?", 100).LockUpdate().All()
```

This query is equivalent to the following SQL statement:

```sql
SELECT * FROM `users` WHERE `votes` > 100 FOR UPDATE
```

Both `FOR UPDATE` and `LOCK IN SHARE MODE` ensure that the selected records cannot be updated by other transactions. The difference between the two is:

- **LOCK IN SHARE MODE** allows other transactions to read the locked rows, but prevents them from modifying or deleting the rows.
- **FOR UPDATE** blocks other locking reads on the locked rows until the transaction is complete, but non-locking reads are still allowed.

To illustrate, consider an example where you read a value and then update it in another statement.

- Using `LOCK IN SHARE MODE`, two transactions can read the same initial value. Therefore, after executing two transactions, the final counter value is incremented by 1.
- Using `FOR UPDATE`, the second transaction is blocked from reading the value until the first transaction is completed. This ensures the final result is incremented by 2.

## Usage of Optimistic Lock

**Optimistic Lock** is usually implemented based on a `version` control mechanism. In the database, this is typically achieved by adding a `version` field to the table.

When data is read, the `version` number is also read. During an update, the `version` number is incremented. When the update is submitted, the `version` number of the submitted data is compared with the current `version` number in the database:

- If the submitted `version` number is greater than the current `version` number in the database, the update is performed.
- Otherwise, the data is considered outdated.

## Summary of Lock Mechanisms

Both pessimistic and optimistic locks have their advantages and disadvantages. It is not correct to say one is better than the other:

- **Optimistic Lock** is suitable for scenarios where write operations are infrequent and conflicts are rare. It eliminates the overhead of locking, thus increasing overall system throughput.
- **Pessimistic Lock** is better suited for scenarios where conflicts are frequent, as retrying operations in the application layer can degrade performance. In such cases, using a pessimistic lock is more appropriate.
