# ORM Chain Options - Update and Delete

Created by Guo Qiang, Last Modified on February 28, 2024

To ensure security and prevent accidental operations, the `Update` and `Delete` methods must be used with a `Where` condition to execute successfully. If a `Where` condition is not provided, an error will be returned with a message like: "there should be WHERE condition statement for XXX operation." Goframe is designed as a production-grade framework for enterprises, with a rigorous design and careful handling of details in engineering practices.

## Update Method

The `Update` method is used for data updates and is often used in combination with the `Data` and `Where` methods. The `Data` method specifies the data to be updated, while the `Where` method defines the conditions for the update. The `Update` method also supports directly providing data and condition parameters.

***Usage Examples***

```go
// UPDATE `user` SET `name`='john guo' WHERE name='john'
g.Model("user").Data(g.Map{"name" : "john guo"}).Where("name", "john").Update()
g.Model("user").Data("name='john guo'").Where("name", "john").Update()

// UPDATE `user` SET `status`=1 WHERE `status`=0 ORDER BY `login_time` asc LIMIT 10
g.Model("user").Data("status", 1).Order("login_time asc").Where("status", 0).Limit(10).Update()

// UPDATE `user` SET `status`=1 WHERE 1
g.Model("user").Data("status=1").Where(1).Update()
g.Model("user").Data("status", 1).Where(1).Update()
g.Model("user").Data(g.Map{"status" : 1}).Where(1).Update()
```

You can also pass `data` and `where` parameters directly to the `Update` method:

```go
// UPDATE `user` SET `name`='john guo' WHERE name='john'
g.Model("user").Update(g.Map{"name" : "john guo"}, "name", "john")
g.Model("user").Update("name='john guo'", "name", "john")

// UPDATE `user` SET `status`=1 WHERE 1
g.Model("user").Update("status=1", 1)
g.Model("user").Update(g.Map{"status" : 1}, 1)
```

## Counter Update

You can use the `Counter` type parameter to perform numerical operations on specific fields, such as incrementing or decrementing.

`Counter` data structure definition

```go
// Counter is the type for update count.
type Counter struct {
    Field string
    Value float64
}
```

Example of using `Counter` for field increment

```go
updateData := g.Map{
    "views": &gdb.Counter{ 
        Field: "views", 
        Value: 1,
    },
}
// UPDATE `article` SET `views`=`views`+1 WHERE `id`=1
result, err := db.Update("article", updateData, "id", 1)
```

The `Counter` can also be used to increment fields that are not their own:

```go
updateData := g.Map{
    "views": &gdb.Counter{ 
        Field: "clicks", 
        Value: 1,
    },
}
// UPDATE `article` SET `views`=`clicks`+1 WHERE `id`=1
result, err := db.Update("article", updateData, "id", 1)
```

## Increment and Decrement

You can use the `Increment` and `Decrement` methods to perform common operations of incrementing or decrementing specified fields. The definitions of these methods are as follows:

```go
// Increment increments a column's value by a given amount.
func (m *Model) Increment(column string, amount float64) (sql.Result, error)

// Decrement decrements a column's value by a given amount.
func (m *Model) Decrement(column string, amount float64) (sql.Result, error)
```

***Usage Examples***

```go
// UPDATE `article` SET `views`=`views`+10000 WHERE `id`=1
g.Model("article").Where("id", 1).Increment("views", 10000)
// UPDATE `article` SET `views`=`views`-10000 WHERE `id`=1
g.Model("article").Where("id", 1).Decrement("views", 10000)
```

## Embedding Raw SQL Statements

`gdb.Raw` is a string type, and its parameters will be directly embedded into the SQL statements submitted to the underlying database. They will not be automatically converted into string parameters or treated as prepared parameters. For more detailed information, please refer to the chapter: "ORM Advanced Features - Raw SQL."

***Example***

```go
// UPDATE `user` SET login_count='login_count+1',update_time='now()' WHERE id=1
g.Model("user").Data(g.Map{
    "login_count": "login_count+1",
    "update_time": "now()",
}).Where("id", 1).Update()
// Execution error: Error Code: 1136. Column count doesn't match value count at row 1
```

After modification using `gdb.Raw`:

```go
// UPDATE `user` SET login_count=login_count+1,update_time=now() WHERE id=1
g.Model("user").Data(g.Map{
    "login_count": gdb.Raw("login_count+1"),
    "update_time": gdb.Raw("now()"),
}).Where("id", 1).Update()
```

## Delete Method

The `Delete` method is used for data deletion.

***Usage Examples***

```go
// DELETE FROM `user` WHERE uid=10
g.Model("user").Where("uid", 10).Delete()
// DELETE FROM `user` ORDER BY `login_time` asc LIMIT 10
g.Model("user").Order("login_time asc").Limit(10).Delete()
```

You can also pass `where` parameters directly to the `Delete` method:

```go
// DELETE FROM `user` WHERE `uid`=10
g.Model("user").Delete("uid", 10)
// DELETE FROM `user` WHERE `score`<60
g.Model("user").Delete("score < ", 60)
```

## Soft Delete Feature

For more information on the soft delete feature, please refer to the chapter: [ORM Chained Operations - Time](/docs/core-component/orm/chain-opts/time)
