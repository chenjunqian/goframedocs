# ORM Chain Operation - Query - All&One&Array&Value&Count

The following five methods are commonly used for data querying in the ORM component:

```go
func (m *Model) All(where ...interface{}) (Result, error)
func (m *Model) One(where ...interface{}) (Record, error)
func (m *Model) Array(fieldsAndWhere ...interface{}) ([]Value, error)
func (m *Model) Value(fieldsAndWhere ...interface{}) (Value, error)
func (m *Model) Count(where ...interface{}) (int, error)
func (m *Model) CountColumn(column string) (int, error)
```

## Brief Explanation

- **All**: Used to query and return multiple records as a list or array.
- **One**: Used to query and return a single record.
- **Array**: Used to query specific field columns and return them as an array.
- **Value**: Used to query and return the value of a single field, often in conjunction with the `Fields` method.
- **Count**: Used to query and return the number of records.

These methods also support direct input of conditional parameters, similar to the `Where` method. However, note that the `Array` and `Value` methods require at least one field parameter to be provided.

## Examples

```go
// SELECT * FROM `user` WHERE `score` > 60
Model("user").Where("score>?", 60).All()

// SELECT * FROM `user` WHERE `score` > 60 LIMIT 1
Model("user").Where("score>?", 60).One()

// SELECT `name` FROM `user` WHERE `score` > 60
Model("user").Fields("name").Where("score>?", 60).Array()

// SELECT `name` FROM `user` WHERE `uid` = 1 LIMIT 1
Model("user").Fields("name").Where("uid", 1).Value()

// SELECT COUNT(1) FROM `user` WHERE `status` IN(1,2,3)
Model("user").Where("status", g.Slice{1,2,3}).Count()
```
