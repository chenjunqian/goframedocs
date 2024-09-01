# ORM Chain Operation - Query - Subquery Features

The ORM component currently supports three common types of subquery syntax: `Where` subquery, `Having` subquery, and `From` subquery.

## Where Subquery

You can use subqueries in the `Where` clause. Example:

```go
g.Model("orders").Where("amount > ?", g.Model("orders").Fields("AVG(amount)")).Scan(&orders)
// SELECT * FROM "orders" WHERE amount > (SELECT AVG(amount) FROM "orders")
```

## Having Subquery

You can use subqueries in the `Having` clause. Example:

```go
subQuery := g.Model("users").Fields("AVG(age)").WhereLike("name", "name%")
g.Model("users").Fields("AVG(age) as avgage").Group("name").Having("AVG(age) > ?", subQuery).Scan(&results)
// SELECT AVG(age) as avgage FROM `users` GROUP BY `name` HAVING AVG(age) > (SELECT AVG(age) FROM `users` WHERE name LIKE "name%")
```

## From Subquery

You can use subqueries when creating models with the `Model` method. Examples:

***Example 1***

```go
g.Model("? as u", g.Model("users").Fields("name", "age")).Where("age", 18).Scan(&users)
// SELECT * FROM (SELECT `name`,`age` FROM `users`) as u WHERE `age` = 18
```

***Example 2***

```go
subQuery1 := g.Model("users").Fields("name")
subQuery2 := g.Model("pets").Fields("name")
g.Model("? as u, ? as p", subQuery1, subQuery2).Scan(&users)
// SELECT * FROM (SELECT `name` FROM `users`) as u, (SELECT `name` FROM `pets`) as p
```
