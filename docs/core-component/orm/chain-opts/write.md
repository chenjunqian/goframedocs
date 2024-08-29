# ORM Chain Operation - Write

## Common Methods

### Insert Replace Save

These methods are used for data writing and support both single and batch data writing. Here are their distinctions:

#### Insert

Uses the `INSERT INTO` statement for database writing. If the data contains a primary key or unique index, the operation fails; otherwise, a new record is inserted.

#### Replace

Uses the `REPLACE INTO` statement for database writing. If the data contains a primary key or unique index, the existing record is deleted, and a new record is inserted.

#### Save

Uses the `INSERT INTO` statement for database writing. If the data contains a primary key or unique index, the existing record is updated; otherwise, a new record is inserted. For some databases like PgSQL, SQL Server, and Oracle, you can use the `OnConflict` method to specify the conflict key.

```go
db.Model(table).Data(g.Map{
 "id":          1,
 "passport":    "p1",
 "password":    "pw1",
}).OnConflict("id").Save()
```

Note that some database types do not support the `Replace`/`Save` methods. Please refer to the section on chain operations for details.

These methods should be used with the `Data` method, which is used to pass data parameters for data writing/updating operations.

### InsertIgnore

This method is used to ignore errors and continue with the write operation if the data contains a primary key or unique index. The method is defined as follows:

```go
func (m *Model) InsertIgnore(data ...interface{}) (result sql.Result, err error)
```

### InsertAndGetId

This method is used to write data and directly return the ID of the auto-increment field. The method is defined as follows:

```go
func (m *Model) InsertAndGetId(data ...interface{}) (lastInsertId int64, err error)
```

### OnDuplicate/OnDuplicateEx

The `OnDuplicate`/`OnDuplicateEx` methods are used with the `Save` method to specify which fields to update or not update. Parameters can be strings, string arrays, or maps. For example:

```go
OnDuplicate("nickname, age")
OnDuplicate("nickname", "age")
OnDuplicate(g.Map{
    "nickname": gdb.Raw("CONCAT('name_', VALUES(`nickname`))"),
})
OnDuplicate(g.Map{
    "nickname": "passport",
})
```

`OnDuplicateEx` is used to exclude specific fields from being updated. The fields to be excluded must be in the data set.

## Usage Examples

### Basic Usage

Data writing/saving methods should be used with the `Data` method. The parameter type can be a `Map`, `Struct`, or `Slice`:

```go
// INSERT INTO `user`(`name`) VALUES('john')
g.Model("user").Data(g.Map{"name": "john"}).Insert()

// INSERT IGNORE INTO `user`(`uid`,`name`) VALUES(10000,'john')
g.Model("user").Data(g.Map{"uid": 10000, "name": "john"}).InsertIgnore()

// REPLACE INTO `user`(`uid`,`name`) VALUES(10000,'john')
g.Model("user").Data(g.Map{"uid": 10000, "name": "john"}).Replace()

// INSERT INTO `user`(`uid`,`name`) VALUES(10001,'john') ON DUPLICATE KEY UPDATE `uid`=VALUES(`uid`),`name`=VALUES(`name`)
g.Model("user").Data(g.Map{"uid": 10001, "name": "john"}).Save()
```

You can also pass data parameters directly to the write/save methods without using `Data`:

```go
g.Model("user").Insert(g.Map{"name": "john"})
g.Model("user").Replace(g.Map{"uid": 10000, "name": "john"})
g.Model("user").Save(g.Map{"uid": 10001, "name": "john"})
```

Data parameters can also use `struct` types. For example, when the table fields are `uid/name/site`:

```go
type User struct {
    Uid  int    `orm:"uid"`
    Name string `orm:"name"`
    Site string `orm:"site"`
}

user := &User{
    Uid:  1,
    Name: "john",
    Site: "https://goframe.org",
}

// INSERT INTO `user`(`uid`,`name`,`site`) VALUES(1,'john','https://goframe.org')
g.Model("user").Data(user).Insert()
```

### Batch Data Writing

Use a `Slice` array type for batch writing. Array elements should be `Map` or `Struct` types to allow the database component to automatically obtain field information and generate batch SQL operations.

```go
// INSERT INTO `user`(`name`) VALUES('john_1'),('john_2'),('john_3')
g.Model("user").Data(g.List{
    {"name": "john_1"},
    {"name": "john_2"},
    {"name": "john_3"},
}).Insert()
```

You can use the `Batch` method to specify the number of records per batch (default is 10). The following example will be split into two write requests:

```go
// INSERT INTO `user`(`name`) VALUES('john_1'),('john_2')
// INSERT INTO `user`(`name`) VALUES('john_3')
g.Model("user").Data(g.List{
    {"name": "john_1"},
    {"name": "john_2"},
    {"name": "john_3"},
}).Batch(2).Insert()
```

### Batch Data Saving

Batch saving operates similarly to single record saving. If the data contains a primary key or unique index, existing records are updated; otherwise, new records are inserted.

Note: Oracle, DM, and MSSQL do not support batch saving.

```go
// INSERT INTO `user`(`uid`,`name`) VALUES(10000,'john_1'),(10001,'john_2'),(10002,'john_3')
// ON DUPLICATE KEY UPDATE `uid`=VALUES(`uid`),`name`=VALUES(`name`)
g.Model("user").Data(g.List{
    {"uid":10000, "name": "john_1"},
    {"uid":10001, "name": "john_2"},
    {"uid":10002, "name": "john_3"},
}).Save()
```

## RawSQL Embedding

`gdb.Raw` is a string type that embeds SQL fragments directly into the SQL statements submitted to the underlying database. It is not automatically converted to a string parameter type or treated as a prepared statement parameter. For more details, refer to the "ORM Advanced Features - RawSQL" section.

```go
// INSERT INTO `user`(`id`,`passport`,`password`,`nickname`,`create_time`) VALUES('id+2','john','123456','now()')
g.Model("user").Data(g.Map{
 "id":          "id+2",
 "passport":    "john",
 "password":    "123456",
 "nickname":    "JohnGuo",
 "create_time": "now()",
}).Insert()
// Execution error: Error Code: 1136. Column count doesn't match value count at row 1
```

After modification with `gdb.Raw`:

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
