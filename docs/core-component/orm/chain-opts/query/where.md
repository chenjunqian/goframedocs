# ORM Query - Update and Delete

The ORM component provides several common methods for conditional queries. These methods support various data types as input parameters.

```go
func (m *Model) Where(where interface{}, args...interface{}) *Model
func (m *Model) Wheref(format string, args ...interface{}) *Model
func (m *Model) WherePri(where interface{}, args ...interface{}) *Model
func (m *Model) WhereBetween(column string, min, max interface{}) *Model
func (m *Model) WhereLike(column string, like interface{}) *Model
func (m *Model) WhereIn(column string, in interface{}) *Model
func (m *Model) WhereNull(columns ...string) *Model
func (m *Model) WhereLT(column string, value interface{}) *Model
func (m *Model) WhereLTE(column string, value interface{}) *Model
func (m *Model) WhereGT(column string, value interface{}) *Model
func (m *Model) WhereGTE(column string, value interface{}) *Model

func (m *Model) WhereNotBetween(column string, min, max interface{}) *Model
func (m *Model) WhereNotLike(column string, like interface{}) *Model
func (m *Model) WhereNotIn(column string, in interface{}) *Model
func (m *Model) WhereNotNull(columns ...string) *Model

func (m *Model) WhereOr(where interface{}, args ...interface{}) *Model
func (m *Model) WhereOrBetween(column string, min, max interface{}) *Model
func (m *Model) WhereOrLike(column string, like interface{}) *Model
func (m *Model) WhereOrIn(column string, in interface{}) *Model
func (m *Model) WhereOrNull(columns ...string) *Model
func (m *Model) WhereOrLT(column string, value interface{}) *Model 
func (m *Model) WhereOrLTE(column string, value interface{}) *Model 
func (m *Model) WhereOrGT(column string, value interface{}) *Model 
func (m *Model) WhereOrGTE(column string, value interface{}) *Model

func (m *Model) WhereOrNotBetween(column string, min, max interface{}) *Model
func (m *Model) WhereOrNotLike(column string, like interface{}) *Model
func (m *Model) WhereOrNotIn(column string, in interface{}) *Model
func (m *Model) WhereOrNotNull(columns ...string) *Model
```

Below, we will introduce some of the commonly used methods. The usage of other conditional query methods is similar.

## Where and WhereOr Conditions

### Overview

These two methods are used to provide query condition parameters. The supported parameters include any `string`, `map`, `slice`, `struct`, or `*struct` types.

- For `Where` condition parameters, it is recommended to use the string type with a placeholder `?` to preprocess values. This is because parameters in `map` or `struct` types cannot guarantee the order of conditions, and the order might affect how the database optimizes query indexes.

- When multiple `Where` methods are used together, the conditions are connected using `AND`. Additionally, multiple conditions will be enclosed in `()` to support grouped query conditions.

***Examples***

```go
// WHERE `uid`=1
Where("uid=1")
Where("uid", 1)
Where("uid=?", 1)
Where(g.Map{"uid": 1})

// WHERE `uid` <= 1000 AND `age` >= 18
Where(g.Map{
    "uid <=": 1000,
    "age >=": 18,
})

// WHERE (`uid` <= 1000) AND (`age` >= 18)
Where("uid <=?", 1000).Where("age >=?", 18)

// WHERE `level`=1 OR `money`>=1000000
Where("level=? OR money >=?", 1, 1000000)

// WHERE (`level`=1) OR (`money`>=1000000)
Where("level", 1).WhereOr("money >=", 1000000)

// WHERE `uid` IN(1,2,3)
Where("uid IN(?)", g.Slice{1,2,3})
```

***Example Using Struct Parameters***

The `orm` tag is used to specify the mapping between struct attributes and table fields:

```go
type Condition struct{
    Sex int `orm:"sex"`
    Age int `orm:"age"`
}
Where(Condition{1, 18})
// WHERE `sex`=1 AND `age`=18
```

**Where + String:** Using string and preprocessed parameters.

```go
// Query multiple records with Limit pagination
// SELECT * FROM user WHERE uid>1 LIMIT 0,10
g.Model("user").Where("uid > ?", 1).Limit(0, 10).All()

// Using Fields to query specific columns
// If Fields is not specified, all columns (*) are queried by default
// SELECT uid,name FROM user WHERE uid>1 LIMIT 0,10
g.Model("user").Fields("uid,name").Where("uid > ?", 1).Limit(0, 10).All()

// Supports various Where parameter types
// SELECT * FROM user WHERE uid=1 LIMIT 1
g.Model("user").Where("uid=1").One()
g.Model("user").Where("uid", 1).One()
g.Model("user").Where("uid=?", 1).One()

// SELECT * FROM user WHERE (uid=1) AND (name='john') LIMIT 1
g.Model("user").Where("uid", 1).Where("name", "john").One()
g.Model("user").Where("uid=?", 1).Where("name=?", "john").One()

// SELECT * FROM user WHERE (uid=1) OR (name='john') LIMIT 1
g.Model("user").Where("uid=?", 1).WhereOr("name=?", "john").One()
```

**Where + Slice:** Directly provide preprocessed parameters using slice.

```go
// SELECT * FROM user WHERE age>18 AND name like '%john%'
g.Model("user").Where("age>? AND name like ?", g.Slice{18, "%john%"}).All()

// SELECT * FROM user WHERE status=1
g.Model("user").Where("status=?", g.Slice{1}).All()
```

**Where + Map:** Use any map type to pass the condition parameters.

```go
// SELECT * FROM user WHERE uid=1 AND name='john' LIMIT 1
g.Model("user").Where(g.Map{"uid": 1, "name": "john"}).One()

// SELECT * FROM user WHERE uid=1 AND age>18 LIMIT 1
g.Model("user").Where(g.Map{"uid": 1, "age>": 18}).One()
```

**Where + Struct:** The struct tag supports `orm/json`, mapping properties to field names.

```go
type User struct {
    Id       int    `json:"uid"`
    UserName string `orm:"name"`
}
// SELECT * FROM user WHERE uid=1 AND name='john' LIMIT 1
g.Model("user").Where(User{Id: 1, UserName: "john"}).One()

// SELECT * FROM user WHERE uid=1 LIMIT 1
g.Model("user").Where(&User{Id: 1}).One()
```

These are relatively simple examples of query conditions. Let's look at a more complex example.

```go
condition := g.Map{
    "title like ?":         "%Jiuzhai%",
    "online":               1,
    "hits between ? and ?": g.Slice{1, 10},
    "exp > 0":              nil,
    "category":             g.Slice{100, 200},
}
// SELECT * FROM article WHERE title like '%Jiuzhai%' AND online=1 AND hits between 1 and 10 AND exp > 0 AND category IN(100,200)
g.Model("article").Where(condition).All()
```

### Wheref

***Formatted Condition String***

In certain scenarios, when inputting conditional statements with strings, `fmt.Sprintf` is often used to format the conditions. To avoid directly formatting variables, a convenient method `Wheref` combines `Where` with `fmt.Sprintf`.

```go
// WHERE score > 100 and status in('succeeded','completed')
Wheref(`score > ? and status in (?)`, 100, g.Slice{"succeeded", "completed"})
```

### WherePri

***Support Primary Keys***

The `WherePri` method functions similarly to `Where`, but it provides intelligent recognition of primary keys in the table, which is often used for convenient data querying by primary keys.

If the primary key of the `user` table is `uid`, let's see the difference between `Where` and `WherePri`:

```go
// WHERE `uid`=1
Where("uid", 1)
WherePri(1)

// WHERE `uid` IN(1,2,3)
Where("uid", g.Slice{1,2,3})
WherePri(g.Slice{1,2,3})
```

As seen, when using the `WherePri` method and the provided parameter is a single basic type or a slice type, it will be recognized as a primary key query condition value.

### WhereBuilder

***Combination of Complex Conditions***

`WhereBuilder` is used to combine and generate complex `Where` conditions.

***Object Creation***:

You can use the `Builder` method of `Model` to create a `WhereBuilder` object.

 Here’s an example:

```go
builder := g.DB().Model("user").Builder()
builder.Where("uid", 1)
builder.WhereOr("name=?", "john")
builder.WhereAnd(g.Map{"status": 1, "age>": 18})
builder.WhereOr("nickname", "john")

// Generating the SQL from the builder
query, args := builder.Build()

// Use the generated SQL and args in the query
g.DB().Model("user").Where(query, args).All()
```

#### Combining Queries

```go
builder := g.DB().Model("user").Builder()
builder.Where("uid", 1)
builder.WhereOr("name=?", "john")
builder.WhereAnd(g.Map{"status": 1, "age>": 18})
builder.WhereOr("nickname", "john")
```

## Notes: `0=1` Condition Triggered by Empty Array Conditions

When using the ORM component, if an array condition provided is an empty array, the generated SQL statement may include an invalid `0=1` condition. Here is an example:

### Example Code

***SQL1: Valid Array Condition***

```go
m := g.Model("auth")
m.Where("status", g.Slice{"permitted", "inherited"}).Where("uid", 1).All()
// Generated SQL: SELECT * FROM `auth` WHERE (`status` IN('permitted','inherited')) AND (`uid`=1)
```

***SQL2: Empty Array Condition***

```go
m := g.Model("auth")
m.Where("status", g.Slice{}).Where("uid", 1).All()
// Generated SQL: SELECT * FROM `auth` WHERE (0=1) AND (`uid`=1)
```

As shown, when the provided array condition is an empty array, the generated SQL statement includes an invalid condition `0=1`. Why does this happen?

### Explanation

If the developer does not explicitly specify filtering of empty array conditions, the ORM will not automatically filter out empty array conditions. This behavior is designed to prevent program logic from bypassing SQL restrictions, which could lead to unpredictable business issues.

### How to Filter Empty Conditions

If the developer confirms that the SQL restrictions can be filtered, they can explicitly call the `OmitEmpty` or `OmitEmptyWhere` methods to filter out empty conditions, as shown below:

```go
m := g.Model("auth")
m.Where("status", g.Slice{}).Where("uid", 1).OmitEmpty().All()
// Generated SQL: SELECT * FROM `auth` WHERE `uid`=1
```

By using the `OmitEmpty` method, the empty array condition is removed, resulting in a valid SQL query.
