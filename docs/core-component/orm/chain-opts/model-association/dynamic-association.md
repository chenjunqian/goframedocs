# ORM - Dynamic Model Associations

Unlike other ORMs that commonly use `BelongsTo`, `HasOne`, `HasMany`, and `ManyToMany` for model associations, `GoFrame`'s `ORM` does not follow this design. Such associations can be cumbersome due to foreign key constraints, additional tag comments, and can add cognitive load for developers. GoFrame, therefore, avoids injecting complex tag content, association properties, or methods into the model structure, aiming to simplify the design and make model associations as easy to understand and use as possible.

> `GoFrame` `ORM` provides a model association implementation starting from `GF v1.13.6`, which is currently an experimental feature.

## Data Structures

To simplify the example, the tables are designed with minimal fields to demonstrate the associations:

```sql
-- User Table
CREATE TABLE `user` (
  uid INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(45) NOT NULL,
  PRIMARY KEY (uid)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- User Details Table
CREATE TABLE `user_detail` (
  uid INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  address VARCHAR(45) NOT NULL,
  PRIMARY KEY (uid)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- User Scores Table
CREATE TABLE `user_scores` (
  id INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  uid INT(10) UNSIGNED NOT NULL,
  score INT(10) UNSIGNED NOT NULL,
  course VARCHAR(45) NOT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
```

## Data Models

Based on the table definitions:

- The user table and user details table have a 1:1.
- The user table and user scores table have a 1:N.

The following Go models can be defined:

```go
// User Table
type EntityUser struct {
    Uid  int    `orm:"uid"`
    Name string `orm:"name"`
}

// User Details
type EntityUserDetail struct {
    Uid     int    `orm:"uid"`
    Address string `orm:"address"`
}

// User Scores
type EntityUserScores struct {
    Id     int    `orm:"id"`
    Uid    int    `orm:"uid"`
    Score  int    `orm:"score"`
    Course string `orm:"course"`
}

// Composite Model: User Information
type Entity struct {
    User       *EntityUser
    UserDetail *EntityUserDetail
    UserScores []*EntityUserScores
}
```

`EntityUser`, `EntityUserDetail`, and `EntityUserScores` correspond to the user, user details, and user scores tables, respectively. `Entity` is a composite model representing all detailed information of a user.

## Data Insertion

Data insertion involves a simple database transaction:

```go
err := g.DB().Transaction(ctx, func(ctx context.Context, tx gdb.TX) error {
    r, err := tx.Model("user").Save(EntityUser{
        Name: "john",
    })
    if err != nil {
        return err
    }
    uid, err := r.LastInsertId()
    if err != nil {
        return err
    }
    _, err = tx.Model("user_detail").Save(EntityUserDetail{
        Uid:     int(uid),
        Address: "Beijing DongZhiMen #66",
    })
    if err != nil {
        return err
    }
    _, err = tx.Model("user_scores").Save(g.Slice{
        EntityUserScores{Uid: int(uid), Score: 100, Course: "math"},
        EntityUserScores{Uid: int(uid), Score: 99, Course: "physics"},
    })
    return err
})
```

## Data Query

### Querying a Single Record

To query a single model record, use the `Scan` method. This method automatically binds the query result to a single object property or an array object property. For example:

```go
// Define the user list
var user Entity

// Query user basic data
// SELECT * FROM `user` WHERE `name`='john'
err := g.Model("user").Scan(&user.User, "name", "john")
if err != nil {
    return err
}

// Query user details data
// SELECT * FROM `user_detail` WHERE `uid`=1
err = g.Model("user_detail").Scan(&user.UserDetail, "uid", user.User.Uid)

// Query user scores data
// SELECT * FROM `user_scores` WHERE `uid`=1
err = g.Model("user_scores").Scan(&user.UserScores, "uid", user.User.Uid)
```

### Querying Multiple Records

To query multiple records and bind data to a model array, use the `ScanList` method. This method requires you to specify the relationship between the result fields and model properties. The method then iterates over the array and automatically performs data binding. For example:

```go
// Define the user list
var users []Entity

// Query user basic data
// SELECT * FROM `user`
err := g.Model("user").ScanList(&users, "User")

// Query user details data
// SELECT * FROM `user_detail` WHERE `uid` IN(1,2)
err = g.Model("user_detail").
       Where("uid", gdb.ListItemValuesUnique(users, "User", "Uid")).
       ScanList(&users, "UserDetail", "User", "uid:Uid")

// Query user scores data
// SELECT * FROM `user_scores` WHERE `uid` IN(1,2)
err = g.Model("user_scores").
       Where("uid", gdb.ListItemValuesUnique(users, "User", "Uid")).
       ScanList(&users, "UserScores", "User", "uid:Uid")
```

### Key Methods

#### 1. `ScanList`

The `ScanList` method binds query results to a specified list, for example:

```go
// Example Usage
ScanList(&users, "User")
ScanList(&users, "UserDetail", "User", "uid:Uid")
ScanList(&users, "UserScores", "User", "uid:Uid")
```

This method allows you to bind query results to specific attributes of a list:

- `ScanList(&users, "User")` binds the queried user information array to the `User` attribute of each item in the `users` list.
- `ScanList(&users, "UserDetail", "User", "uid:Uid")` binds the queried user detail array to the `UserDetail` attribute of each item in the `users` list and associates it with another `User` object attribute through `uid:Uid`.
- `ScanList(&users, "UserScores", "User", "uid:Uid")` binds the queried user scores array to the `UserScores` attribute of each item in the `users` list. The method automatically recognizes that the relationship between `User` and `UserScores` is 1:N and completes the data binding accordingly.

If the associated attribute data does not exist, the attribute will not be initialized and will remain `nil`.

#### 2. `ListItemValues` / `ListItemValuesUnique`

The `ListItemValues` and `ListItemValuesUnique` methods retrieve the elements of all item structs/maps with a given key.

- `gdb.ListItemValuesUnique(users, "Uid")` retrieves the `Uid` attribute from each item in the `users` array and returns a `[]interface{}` array.
- `gdb.ListItemValuesUnique(users, "User", "Uid")` retrieves the `Uid` attribute from the `User` property of each item in the `users` array.

`ListItemValuesUnique` filters out duplicate return values, ensuring that the returned list contains no duplicates.
