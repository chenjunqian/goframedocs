# ORM Query - Union/UnionAll

The GoFrame ORM component supports `Union` and `UnionAll` operations. The `Union` and `UnionAll` operators are used to combine the results of two or more `SELECT` statements into a single result set. For more information about `Union` and `UnionAll` combined queries, please refer to the official MySQL documentation: [MySQL Union Documentation](https://dev.mysql.com/doc/refman/8.0/en/union.html).

We can implement `Union`/`UnionAll` operations through either chained operations or method calls.

## Method Definitions

```go
// Union does "(SELECT xxx FROM xxx) UNION (SELECT xxx FROM xxx) ..." statement.
func (c *Core) Union(unions ...*Model) *Model

// UnionAll does "(SELECT xxx FROM xxx) UNION ALL (SELECT xxx FROM xxx) ..." statement.
func (c *Core) UnionAll(unions ...*Model) *Model
```

## Union

When using the `Union` operator, multiple `SELECT` statements will remove duplicate data.

***Example***

```go
// Get the default configured database object (configuration name is "default").
db := g.DB()

db.Union(
    db.Model("user").Where("id", 1),
    db.Model("user").Where("id", 2),
    db.Model("user").WhereIn("id", g.Slice{1, 2, 3}),
).OrderDesc("id").All()
// (SELECT * FROM `user` WHERE `id`=1) 
// UNION 
// (SELECT * FROM `user` WHERE `id`=2) 
// UNION 
// (SELECT * FROM `user` WHERE `id` IN (1,2,3) 
// ORDER BY `id` DESC) ORDER BY `id` DESC 
```

You can also implement this using DAO chained operations:

```go
dao.User.Union(
    dao.User.Where(dao.User.Columns.Id, 1),
    dao.User.Where(dao.User.Columns.Id, 2),
    dao.User.WhereIn(dao.User.Columns.Id, g.Slice{1, 2, 3}),
).OrderDesc(dao.User.Columns.Id).All()
// (SELECT * FROM `user` WHERE `id`=1) 
// UNION 
// (SELECT * FROM `user` WHERE `id`=2) 
// UNION 
// (SELECT * FROM `user` WHERE `id` IN (1,2,3) 
// ORDER BY `id` DESC) ORDER BY `id` DESC 
```

## UnionAll

When using the `UnionAll` operator, multiple `SELECT` statements will not remove duplicate data.

***Example***

```go
db.UnionAll(
    db.Model("user").Where("id", 1),
    db.Model("user").Where("id", 2),
    db.Model(table).WhereIn("id", g.Slice{1, 2, 3}),
).OrderDesc("id").All()
// (SELECT * FROM `user` WHERE `id`=1) 
// UNION ALL 
// (SELECT * FROM `user` WHERE `id`=2) 
// UNION ALL 
// (SELECT * FROM `user` WHERE `id` IN (1,2,3) 
// ORDER BY `id` DESC) ORDER BY `id` DESC 
```

You can also implement this using DAO chained operations:

```go
dao.User.UnionAll(
    dao.User.Where(dao.User.Columns.Id, 1),
    dao.User.Where(dao.User.Columns.Id, 2),
    dao.User.WhereIn(dao.User.Columns.Id, g.Slice{1, 2, 3}),
).OrderDesc(dao.User.Columns.Id).All()
// (SELECT * FROM `user` WHERE `id`=1) 
// UNION ALL 
// (SELECT * FROM `user` WHERE `id`=2) 
// UNION ALL 
// (SELECT * FROM `user` WHERE `id` IN (1,2,3) 
// ORDER BY `id` DESC) ORDER BY `id` DESC 
```
