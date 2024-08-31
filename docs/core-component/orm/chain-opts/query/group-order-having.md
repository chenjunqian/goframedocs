# ORM Query - Group/Order/Having

## Group and Order

The `Group` method is used for query grouping, and the `Order` method is used for query sorting.

***Usage Examples***

- **Group Query Example**

```go
// SELECT COUNT(*) total,age FROM `user` GROUP BY age
g.Model("user").Fields("COUNT(*) total,age").Group("age").All()
```

- **Order Query Example**

```go
// SELECT * FROM `student` ORDER BY class asc,course asc,score desc
g.Model("student").Order("class asc,course asc,score desc").All()
```

### Common Sorting

- **Ascending Order by Specified Field**

```go
func (m *Model) OrderAsc(column string) *Model
```

- **Descending Order by Specified Field**

```go
func (m *Model) OrderDesc(column string) *Model
```

- **Random Order**

```go
func (m *Model) OrderRandom() *Model
```

***Usage Examples for Sorting Methods***

- **Order by Ascending**

```go
// SELECT `id`,`title` FROM `article` ORDER BY `created_at` ASC
g.Model("article").Fields("id,title").OrderAsc("created_at").All()
```

- **Order by Descending**

```go
// SELECT `id`,`title` FROM `article` ORDER BY `views` DESC
g.Model("article").Fields("id,title").OrderDesc("views").All()
```

- **Order by Random**

```go
// SELECT `id`,`title` FROM `article` ORDER BY RAND()
g.Model("article").Fields("id,title").OrderRandom().All()
```

## Having Condition Filtering

The `Having` method is used to filter query results based on conditions.

***Usage Examples***

- **Having with Group Query**

```go
// SELECT COUNT(*) total,age FROM `user` GROUP BY age HAVING total>100
g.Model("user").Fields("COUNT(*) total,age").Group("age").Having("total>100").All()
```

- **Having with Order Query**

```go
// SELECT * FROM `student` ORDER BY class HAVING score>60
g.Model("student").Order("class").Having("score>?", 60).All()
```
