# ORM Advanced Features - RawSQL

To ensure security, all input parameters in the ORM are executed using a prepared statement mode at the underlying level, which prevents common SQL injection risks. However, in certain scenarios, we may want to embed custom SQL statements within the generated SQL commands. This can be achieved using the `RawSQL` feature of ORM, utilizing the `gdb.Raw` type. Let's look at a few examples.

## Using RawSQL in Insert

`gdb.Raw` is a string type, and any parameter of this type will be directly embedded as a SQL fragment in the underlying SQL statement without being automatically converted to a string parameter type or treated as a prepared statement parameter. For example:

**Before Using `gdb.Raw`:**

```go
// INSERT INTO `user`(`id`,`passport`,`password`,`nickname`,`create_time`) VALUES('id+2','john','123456','now()')
g.Model("user").Data(g.Map{
 "id":          "id+2",
 "passport":    "john",
 "password":    "123456",
 "nickname":    "JohnGuo",
 "create_time": "now()",
}).Insert()
// Error: Error Code: 1136. Column count doesn't match value count at row 1
```

**After Using `gdb.Raw`:**

```go
// INSERT INTO `user`(`id`,`passport`,`password`,`nickname`,`create_time`) VALUES(id+2,'john','123456',now())
g.Model("user").Data(g.Map{
 "id":          gdb.Raw("id+2"),
 "passport":    "john",
 "password":    "123456",
 "nickname":    "JohnGuo",
 "create_time": gdb.Raw("now()"),
}).Insert()
```

## Using RawSQL in Update

**Before Using `gdb.Raw`:**

```go
// UPDATE `user` SET login_count='login_count+1',update_time='now()' WHERE id=1
g.Model("user").Data(g.Map{
    "login_count": "login_count+1",
    "update_time": "now()",
}).Where("id", 1).Update()
// Error: Error Code: 1136. Column count doesn't match value count at row 1
```

**After Using `gdb.Raw`:**

```go
// UPDATE `user` SET login_count=login_count+1,update_time=now() WHERE id=1
g.Model("user").Data(g.Map{
    "login_count": gdb.Raw("login_count+1"),
    "update_time": gdb.Raw("now()"),
}).Where("id", 1).Update()
```

## Using RawSQL in Select

The time function `now()` will be converted into a string and executed as an SQL parameter:

**Before Using `gdb.Raw`:**

```go
// SELECT * FROM `user` WHERE `created_at`<'now()'
g.Model("user").WhereLT("created_at", "now()").All()
```

**After Using `gdb.Raw`:**

```go
// SELECT * FROM `user` WHERE `created_at`<now()
g.Model("user").WhereLT("created_at", gdb.Raw("now()")).All()
```

By using `gdb.Raw`, you can embed raw SQL expressions directly into your queries, providing more flexibility for custom SQL operations.
