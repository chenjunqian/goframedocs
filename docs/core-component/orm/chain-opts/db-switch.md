# ORM Chain Operation - Database Switching

When configuring a database, you can specify a default database. Consequently, the `DB` object and `Model` object are bound to a specific database during initialization. There are several methods for switching databases at runtime (for example, switching between the `user` database for user data and the `order` database for order data):

## By Different Configuration Groups

This method requires configuring different groups in the configuration file. After that, you can use `g.DB("group name")` in the program to obtain the singleton object for a specific database.

## By the `DB.SetSchema` Method

You can switch the singleton object’s database at runtime using the `DB.SetSchema` method. Note that since you are modifying the singleton object's database configuration, the impact is global:

```go
g.DB().SetSchema("user-schema")
g.DB().SetSchema("order-schema")
```

## By the Chain Operation Schema Method

You can create a `Schema` database object through the chain operation `Schema` method, and then create a model object through this database object to execute subsequent chain operations:

```go
g.DB().Schema("user-schema").Model("user").All()
g.DB().Schema("order-schema").Model("order").All()
```

Alternatively, you can set the corresponding database for the current chain operation using the `Model.Schema` method. If the database is not set, the default database connection of `DB` or `TX` is used:

```go
g.Model("user").Schema("user-schema").All()
g.Model("order").Schema("order-schema").All()
```

## Differences Between the Two Methods

1. **First Method**: The `Schema` object creates the `Model` object before performing operations.
2. **Second Method**: The `Model` object’s database name is modified to switch databases.

## Cross-Domain Operations

If the current database user has sufficient permissions, you can directly include the database name in the table name to achieve cross-database operations, including cross-database join queries:

```go
// SELECT * FROM `order`.`order` o LEFT JOIN `user`.`user` u ON (o.uid=u.id) WHERE u.id=1 LIMIT 1
g.Model("order.order o").LeftJoin("user.user u", "o.uid=u.id").Where("u.id", 1).One()
```
