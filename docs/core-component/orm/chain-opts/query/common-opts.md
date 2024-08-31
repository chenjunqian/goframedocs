# ORM Query - Common Operation Examples

## IN Query

Use string or slice parameter types. When using the slice parameter type, only one `?` placeholder is needed.

```go
// SELECT * FROM user WHERE uid IN(100,10000,90000)
g.Model("user").Where("uid IN(?,?,?)", 100, 10000, 90000).All()
g.Model("user").Where("uid", g.Slice{100, 10000, 90000}).All()

// SELECT * FROM user WHERE gender=1 AND uid IN(100,10000,90000)
g.Model("user").Where("gender=? AND uid IN(?)", 1, g.Slice{100, 10000, 90000}).All()

// SELECT COUNT(*) FROM user WHERE age in(18,50)
g.Model("user").Where("age IN(?,?)", 18, 50).Count()
g.Model("user").Where("age", g.Slice{18, 50}).Count()
```

Using any `map` parameter type:

```go
// SELECT * FROM user WHERE gender=1 AND uid IN(100,10000,90000)
g.Model("user").Where(g.Map{
    "gender": 1,
    "uid":    g.Slice{100,10000,90000},
}).All()
```

Using struct parameter type, note that the order of query conditions depends on the order of the struct's field definitions.

```go
type User struct {
    Id     []int  `orm:"uid"`
    Gender int    `orm:"gender"`
}
// SELECT * FROM `user` WHERE uid IN(100,10000,90000) AND gender=1
g.Model("user").Where(User{
    Gender: 1,
    Id:     []int{100, 10000, 90000},
}).All()
```

To improve usability, if the passed slice parameter is empty or `nil`, the query will not throw an error but will be converted to a false condition.

```go
// SELECT * FROM `user` WHERE 0=1 
g.Model("user").Where("uid", g.Slice{}).All()
// SELECT * FROM `user` WHERE `uid` IS NULL
g.Model("user").Where("uid", nil).All()
```

The ORM also provides common condition methods `WhereIn`, `WhereNotIn`, `WhereOrIn`, and `WhereOrNotIn` for common `IN` query filtering. Method definitions are as follows:

```go
func (m *Model) WhereIn(column string, in interface{}) *Model
func (m *Model) WhereNotIn(column string, in interface{}) *Model
func (m *Model) WhereOrIn(column string, in interface{}) *Model
func (m *Model) WhereOrNotIn(column string, in interface{}) *Model
```

***Usage Examples***

```go
// SELECT * FROM `user` WHERE (`gender`=1) AND (`type` IN(1,2,3))
g.Model("user").Where("gender", 1).WhereIn("type", g.Slice{1,2,3}).All()

// SELECT * FROM `user` WHERE (`gender`=1) AND (`type` NOT IN(1,2,3))
g.Model("user").Where("gender", 1).WhereNotIn("type", g.Slice{1,2,3}).All()

// SELECT * FROM `user` WHERE (`gender`=1) OR (`type` IN(1,2,3))
g.Model("user").Where("gender", 1).WhereOrIn("type", g.Slice{1,2,3}).All()

// SELECT * FROM `user` WHERE (`gender`=1) OR (`type` NOT IN(1,2,3))
g.Model("user").Where("gender", 1).WhereOrNotIn("type", g.Slice{1,2,3}).All()
```

## LIKE Query

```go
// SELECT * FROM `user` WHERE name like '%john%'
g.Model("user").Where("name like ?", "%john%").All()
// SELECT * FROM `user` WHERE birthday like '1990-%'
g.Model("user").Where("birthday like ?", "1990-%").All()
```

From GoFrame v1.16, the ORM also provides common condition methods `WhereLike`, `WhereNotLike`, `WhereOrLike`, and `WhereOrNotLike` for `LIKE` query filtering. Method definitions are as follows:

```go
func (m *Model) WhereLike(column string, like interface{}) *Model
func (m *Model) WhereNotLike(column string, like interface{}) *Model
func (m *Model) WhereOrLike(column string, like interface{}) *Model
func (m *Model) WhereOrNotLike(column string, like interface{}) *Model
```

***Usage Examples***

```go
// SELECT * FROM `user` WHERE (`gender`=1) AND (`name` LIKE 'john%')
g.Model("user").Where("gender", 1).WhereLike("name", "john%").All()

// SELECT * FROM `user` WHERE (`gender`=1) AND (`name` NOT LIKE 'john%')
g.Model("user").Where("gender", 1).WhereNotLike("name", "john%").All()

// SELECT * FROM `user` WHERE (`gender`=1) OR (`name` LIKE 'john%')
g.Model("user").Where("gender", 1).WhereOrLike("name", "john%").All()

// SELECT * FROM `user` WHERE (`gender`=1) OR (`name` NOT LIKE 'john%')
g.Model("user").Where("gender", 1).WhereOrNotLike("name", "john%").All()
```

## MIN MAX AVG SUM

We directly use the statistical methods with the `Fields` method, for example:

```go
// SELECT MIN(score) FROM `user` WHERE `uid`=1 LIMIT 1 
g.Model("user").Fields("MIN(score)").Where("uid", 1).Value()

// SELECT MAX(score) FROM `user` WHERE `uid`=1 LIMIT 1 
g.Model("user").Fields("MAX(score)").Where("uid", 1).Value()

// SELECT AVG(score) FROM `user` WHERE `uid`=1 LIMIT 1 
g.Model("user").Fields("AVG(score)").Where("uid", 1).Value()

// SELECT SUM(score) FROM `user` WHERE `uid`=1 LIMIT 1 
g.Model("user").Fields("SUM(score)").Where("uid", 1).Value()
```

From GoFrame v1.16, the ORM also provides common statistical methods `Min`, `Max`, `Avg`, and `Sum` for field statistics. Method definitions are as follows:

```go
func (m *Model) Min(column string) (float64, error)
func (m *Model) Max(column string) (float64, error)
func (m *Model) Avg(column string) (float64, error)
func (m *Model) Sum(column string) (float64, error)
```

***Refactored Example Using Shortcut Methods***

```go
// SELECT MIN(`score`) FROM `user` WHERE `uid`=1 LIMIT 1
g.Model("user").Where("uid", 1).Min("score")

// SELECT MAX(`score`) FROM `user` WHERE `uid`=1 LIMIT 1  
g.Model("user").Where("uid", 1).Max("score")

// SELECT AVG(`score`) FROM `user` WHERE `uid`=1 LIMIT 1  
g.Model("user").Where("uid", 1).Avg("score")

// SELECT SUM(`score`) FROM `user` WHERE `uid`=1 LIMIT 1  
g.Model("user").Where("uid", 1).Sum("score")
```

## COUNT Query

```go
// SELECT COUNT(1) FROM `user` WHERE `birthday`='1990-10-01'
g.Model("user").Where("birthday", "1990-10-01").Count()
// SELECT COUNT(uid) FROM `user` WHERE `birthday`='1990-10-01'
g.Model("user").Fields("uid").Where("birthday", "1990-10-01").Count()
```

From GoFrame v1.16, the ORM also provides a common method `CountColumn` to count by fields. Method definition is as follows:

```go
func (m *Model) CountColumn(column string) (int, error)
```

***Usage Example***

```go
g.Model("user").Where("birthday", "1990-10-01").CountColumn("uid")
```

## DISTINCT Query

```go
// SELECT DISTINCT uid,name FROM `user`
g.Model("user").Fields("DISTINCT uid,name").All()
// SELECT COUNT(DISTINCT uid,name) FROM `user`
g.Model("user").Fields("DISTINCT uid,name").Count()
```

From GoFrame v1.16, the ORM also provides a field uniqueness filtering method `Distinct`. Method definition is as follows:

```go
func (m *Model) Distinct() *Model
```

***Usage Example***

```go
// SELECT COUNT(DISTINCT `name`) FROM `user`
g.Model("user").Distinct

().Count("name")
// SELECT DISTINCT `name` FROM `user`
g.Model("user").Distinct().Fields("name").All()
```

## BETWEEN Query

To perform a `BETWEEN` query, you can use the following syntax:

```go
// SELECT * FROM `user` WHERE age BETWEEN 18 AND 20
g.Model("user").Where("age BETWEEN ? AND ?", 18, 20).All()
```

From GoFrame v1.16, the ORM provides common condition methods `WhereBetween`, `WhereNotBetween`, `WhereOrBetween`, and `WhereOrNotBetween` for filtering queries with the `BETWEEN` condition. The method definitions are as follows:

```go
func (m *Model) WhereBetween(column string, min, max interface{}) *Model
func (m *Model) WhereNotBetween(column string, min, max interface{}) *Model
func (m *Model) WhereOrBetween(column string, min, max interface{}) *Model
func (m *Model) WhereOrNotBetween(column string, min, max interface{}) *Model
```

***Usage Examples***

```go
// SELECT * FROM `user` WHERE (`gender`=0) AND (`age` BETWEEN 16 AND 20)
g.Model("user").Where("gender", 0).WhereBetween("age", 16, 20).All()

// SELECT * FROM `user` WHERE (`gender`=0) AND (`age` NOT BETWEEN 16 AND 20)
g.Model("user").Where("gender", 0).WhereNotBetween("age", 16, 20).All()

// SELECT * FROM `user` WHERE (`gender`=0) OR (`age` BETWEEN 16 AND 20)
g.Model("user").Where("gender", 0).WhereOrBetween("age", 16, 20).All()

// SELECT * FROM `user` WHERE (`gender`=0) OR (`age` NOT BETWEEN 16 AND 20)
g.Model("user").Where("gender", 0).WhereOrNotBetween("age", 16, 20).All()
```

## NULL Query

The ORM provides common condition methods `WhereNull`, `WhereNotNull`, `WhereOrNull`, and `WhereOrNotNull` for filtering queries with `NULL` conditions. The method definitions are as follows:

```go
func (m *Model) WhereNull(columns ...string) *Model
func (m *Model) WhereNotNull(columns ...string) *Model
func (m *Model) WhereOrNull(columns ...string) *Model
func (m *Model) WhereOrNotNull(columns ...string) *Model
```

***Usage Examples***

```go
// SELECT * FROM `user` WHERE (`created_at`>'2021-05-01 00:00:00') AND (`inviter` IS NULL)
g.Model("user").Where("created_at>?", gtime.New("2021-05-01")).WhereNull("inviter").All()

// SELECT * FROM `user` WHERE (`created_at`>'2021-05-01 00:00:00') AND (`inviter` IS NOT NULL)
g.Model("user").Where("created_at>?", gtime.New("2021-05-01")).WhereNotNull("inviter").All()

// SELECT * FROM `user` WHERE (`created_at`>'2021-05-01 00:00:00') OR (`inviter` IS NULL)
g.Model("user").Where("created_at>?", gtime.New("2021-05-01")).WhereOrNull("inviter").All()

// SELECT * FROM `user` WHERE (`created_at`>'2021-05-01 00:00:00') OR (`inviter` IS NOT NULL)
g.Model("user").Where("created_at>?", gtime.New("2021-05-01")).WhereOrNotNull("inviter").All()
```

Additionally, these methods support multiple field inputs as parameters. For example:

```go
// SELECT * FROM `user` WHERE (`created_at`>'2021-05-01 00:00:00') AND (`inviter` IS NULL) AND (`creator` IS NULL)
g.Model("user").Where("created_at>?", gtime.New("2021-05-01")).WhereNull("inviter", "creator").All()
```
