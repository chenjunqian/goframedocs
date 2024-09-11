# ORM Chain Operation - Static Model Association

## Background

Usability and maintainability have always been core focuses of Goframe. These aspects differentiate Goframe significantly from other frameworks and components. Unlike other ORMs that use associations like `BelongsTo`, `HasOne`, `HasMany`, and `ManyToMany`, which involve complex maintenance such as foreign key constraints and additional tag annotations, Goframe simplifies the design to reduce developer overhead. The framework avoids injecting complex tags, associations, or methods into model structs, aiming instead for a more understandable and user-friendly model association and query process.

Previously, we introduced the `ScanList` solution. It is recommended to understand the model association - dynamic association - `ScanList` before diving into the `With` feature.

Through project practice, we found that while `ScanList` maintained model associations from a runtime business logic perspective, it didn't simplify maintenance as much as hoped. Therefore, we introduced the `With` feature to provide a simpler way to manage model associations while enhancing overall framework usability and maintainability. The `With` feature can be seen as an improved combination of `ScanList` and model association maintenance.

> The `With` feature has been available since `Goframe v1.15.7` and is currently experimental.

## Example

Here’s a simple example to help understand the `With` feature, which is an improved version of the previous `ScanList` example.

***Table Definitions***

```sql
CREATE TABLE `user` (
  id int(10) unsigned NOT NULL AUTO_INCREMENT,
  name varchar(45) NOT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
```

```sql
CREATE TABLE `user_detail` (
  uid  int(10) unsigned NOT NULL AUTO_INCREMENT,
  address varchar(45) NOT NULL,
  PRIMARY KEY (uid)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
```

```sql
CREATE TABLE `user_scores` (
  id int(10) unsigned NOT NULL AUTO_INCREMENT,
  uid int(10) unsigned NOT NULL,
  score int(10) unsigned NOT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
```

***Golang Structure***

Based on the table definitions, we know:

- The `user` table and `user_detail` table have a `1:1` relationship.
- The `user` table and `user_scores` table have a `1:N` relationship.
- This example does not demonstrate `N:N` relationships, which are similar to `1:N` but involve one additional association or query.

The `Go` structs for these tables can be defined as follows:

```go
// User Detail
type UserDetail struct {
    gmeta.Meta `orm:"table:user_detail"`
    Uid        int    `json:"uid"`
    Address    string `json:"address"`
}

// User Scores
type UserScores struct {
    gmeta.Meta `orm:"table:user_scores"`
    Id         int `json:"id"`
    Uid        int `json:"uid"`
    Score      int `json:"score"`
}

// User Information
type User struct {
    gmeta.Meta `orm:"table:user"`
    Id         int           `json:"id"`
    Name       string        `json:"name"`
    UserDetail *UserDetail   `orm:"with:uid=id"`
    UserScores []*UserScores `orm:"with:uid=id"`
}
```

### Data Insertion

To simplify the example, we insert 5 user records into the database using a transaction:

- User information with IDs from 1 to 5, names from `name_1` to `name_5`.
- 5 user detail records with addresses from `address_1` to `address_5`.
- 5 score records for each user, scores from 1 to 5.

```go
g.DB().Transaction(ctx, func(ctx context.Context, tx gdb.TX) error {
    for i := 1; i <= 5; i++ {
        // User
        user := User{
            Name: fmt.Sprintf(`name_%d`, i),
        }
        lastInsertId, err := g.Model(user).Data(user).OmitEmpty().InsertAndGetId()
        if err != nil {
            return err
        }
        // Detail
        userDetail := UserDetail{
            Uid:     int(lastInsertId),
            Address: fmt.Sprintf(`address_%d`, lastInsertId),
        }
        _, err = g.Model(userDetail).Data(userDetail).OmitEmpty().Insert()
        if err != nil {
            return err
        }
        // Scores
        for j := 1; j <= 5; j++ {
            userScore := UserScores{
                Uid:   int(lastInsertId),
                Score: j,
            }
            _, err = g.Model(userScore).Data(userScore).OmitEmpty().Insert()
            if err != nil {
                return err
            }
        }
    }
    return nil
})
```

After successful execution, the database data is as follows:

```sql
mysql> show tables;
+----------------+
| Tables_in_test |
+----------------+
| user           |
| user_detail    |
| user_score     |
+----------------+
3 rows in set (0.01 sec)

mysql> select * from `user`;
+----+--------+
| id | name   |
+----+--------+
|  1 | name_1 |
|  2 | name_2 |
|  3 | name_3 |
|  4 | name_4 |
|  5 | name_5 |
+----+--------+
5 rows in set (0.01 sec)

mysql> select * from `user_detail`;
+-----+-----------+
| uid | address   |
+-----+-----------+
|   1 | address_1 |
|   2 | address_2 |
|   3 | address_3 |
|   4 | address_4 |
|   5 | address_5 |
+-----+-----------+
5 rows in set (0.00 sec)

mysql> select * from `user_score`;
+----+-----+-------+
| id | uid | score |
+----+-----+-------+
|  1 |   1 |     1 |
|  2 |   1 |     2 |
|  3 |   1 |     3 |
|  4 |   1 |     4 |
|  5 |   1 |     5 |
|  6 |   2 |     1 |
|  7 |   2 |     2 |
|  8 |   2 |     3 |
|  9 |   2 |     4 |
| 10 |   2 |     5 |
| 11 |   3 |     1 |
| 12 |   3 |     2 |
| 13 |   3 |     3 |
| 14 |   3 |     4 |
| 15 |   3 |     5 |
| 16 |   4 |     1 |
| 17 |   4 |     2 |
| 18 |   4 |     3 |
| 19 |   4 |     4 |
| 20 |   4 |     5 |
| 21 |   5 |     1 |
| 22 |   5 |     2 |
| 23 |   5 |     3 |
| 24 |   5 |     4 |
| 25 |   5 |     5 |
+----+-----+-------+
25 rows in set (0.00 sec)
```

### Data Query

With the new With feature, querying data is straightforward. For example, querying a single record:

```go
// Redefine for clarity
// User Detail
type UserDetail struct {
    gmeta.Meta `orm:"table:user_detail"`
    Uid        int    `json:"uid"`
    Address    string `json:"address"`
}

// User Scores
type UserScores struct {
    gmeta.Meta `orm:"table:user_scores"`
    Id         int `json:"id"`
    Uid        int `json:"uid"`
    Score      int `json:"score"`
}

// User Information
type User struct {
    gmeta.Meta `orm:"table:user"`
    Id         int           `json:"id"`
    Name       string        `json:"name"`
    UserDetail *UserDetail   `orm:"with:uid=id"`
    UserScores []*UserScores `orm:"with:uid=id"`
}

var user *User
// WithAll queries the tables associated with the fields tagged with `with`. In this example, it queries the UserDetail and UserScores tables.
g.Model(tableUser).WithAll().Where("id", 3).Scan(&user)
```

The above statement queries user information, user details, and user scores for ID 3. The following SQL queries are automatically executed:

```sql
2021-05-02 22:29:52.634 [DEBU] [  2 ms] [default] SHOW FULL COLUMNS FROM `user`
2021-05-02 22:29:52.635 [DEBU] [  1 ms] [default] SELECT * FROM `user` WHERE `id`=3 LIMIT 1
2021-05-02 22:29:52.636 [DEBU] [  1 ms] [default] SHOW FULL COLUMNS FROM `user_detail`
2021

-05-02 22:29:52.637 [DEBU] [  1 ms] [default] SELECT `uid`,`address` FROM `user_detail` WHERE `uid`=3 LIMIT 1
2021-05-02 22:29:52.643 [DEBU] [  6 ms] [default] SHOW FULL COLUMNS FROM `user_score`
2021-05-02 22:29:52.644 [DEBU] [  0 ms] [default] SELECT `id`,`uid`,`score` FROM `user_score` WHERE `uid`=3
```

The output printed by `g.Dump(user)` will be:

```json
{
    "Id":         3,
    "Name":       "name_3",
    "UserDetail": {
        "Uid":     3,
        "Address": "address_3"
    },
    "UserScores": [
        {
            "Id":    11,
            "Uid":   3,
            "Score": 1
        },
        {
            "Id":    12,
            "Uid":   3,
            "Score": 2
        },
        {
            "Id":    13,
            "Uid":   3,
            "Score": 3
        },
        {
            "Id":    14,
            "Uid":   3,
            "Score": 4
        },
        {
            "Id":    15,
            "Uid":   3,
            "Score": 5
        }
    ]
}
```

### List Query

Here’s an example of querying a list using the With feature:

```go
var users []*User
// With(UserDetail{}) only queries the table associated with UserDetail in the User struct
g.Model(users).With(UserDetail{}).Where("id>?", 3).Scan(&users)
```

The output printed by `g.Dump(users)` will be:

```json
[
    {
        "Id":         4,
        "Name":       "name_4",
        "UserDetail": {
            "Uid":     4,
            "Address": "address_4"
        },
        "UserScores": []
    },
    {
        "Id":         5,
        "Name":       "name_5",
        "UserDetail": {
            "Uid":     5,
            "Address": "address_5"
        },
        "UserScores": []
    }
]
```

### Conditions and Sorting

When using the With feature, you can specify additional conditions and sorting rules for associations. For example:

```go
type User struct {
    gmeta.Meta `orm:"table:user"`
    Id         int           `json:"id"`
    Name       string        `json:"name"`
    UserDetail *UserDetail   `orm:"with:uid=id, where:uid > 3"`
    UserScores []*UserScores `orm:"with:uid=id, where:score>1 and score<5, order:score desc"`
}
```

Use the `where` and `order` sub-tags in the `orm` tag to specify additional conditions and sorting rules.

## Detailed Explanation

You might be curious about certain aspects mentioned earlier, such as the `gmeta` package, the `WithAll` method, the `with` statement in `orm` tags, and how the `Model` method recognizes table names from struct parameters. Let's delve into these details.

---

### The gmeta Package

In the structures defined earlier, you’ll notice the use of an embedded `gmeta.Meta` structure. For example:

```go
type UserDetail struct {
    gmeta.Meta `orm:"table:user_detail"`
    Uid        int    `json:"uid"`
    Address    string `json:"address"`
}
```

In GoFrame, there are various small packages designed to provide specific functionality. The `gmeta` package is primarily used to embed into user-defined structs. It allows you to use tags (like `orm:"table:user_detail"`) to mark the structure with metadata, which can be dynamically retrieved at runtime using specific methods. For more details, refer to the chapter on [Metadata - gmeta](/docs/component-list/utils/metadata).

The purpose of embedding `gmeta.Meta` here is to specify the name of the data table associated with the struct.

### Specific Model Association

Consider the following struct:

```go
type User struct {
    gmeta.Meta `orm:"table:user"`
    Id         int          `json:"id"`
    Name       string       `json:"name"`
    UserDetail *UserDetail  `orm:"with:uid=id"`
    UserScores []*UserScore `orm:"with:uid=id"`
}
```

Here, the `orm` tag is used to specify the association between the `User` struct and other structs. The `with` statement in the `orm` tag defines how the current struct (table) relates to the target struct (table). The syntax for `with` is:

```plaintext
with:current_field=target_field
```

Field names are case-insensitive and can be matched with special characters. For example, the following are valid associations:

```plaintext
with:UID=ID
with:Uid=Id
with:U_ID=id
```

If the association field names in both tables are the same, you can simply use:

```plaintext
with:uid
```

In this example, the `UserDetail` struct maps to the `user_detail` table, and the `UserScores` struct maps to the `user_score` table. Both are associated with the `user` table using the `uid` field, and the corresponding field in the `user` table is `id`.

### With and WithAll

***Basic Introduction***

By default, even if `orm` tags contain `with` statements, the ORM component does not automatically perform associated queries. You need to use the `With` or `WithAll` methods to enable this feature.

- **With**: Specifies the tables to include in the associated query by providing the property object.
- **WithAll**: Enables associated queries for all properties with `with` statements in the model.

In our example, using the `WithAll` method automatically enables model association queries for all properties in the `User` table. All properties with `with` statements in their `orm` tags will be queried and bound to the model structure. If you want to enable only specific associations, use the `With` method. The `With` method can specify multiple associated models for automatic querying. For example:

```go
var user *User
g.Model(tableUser).With(UserDetail{}, UserScore{}).Where("id", 3).Scan(&user)
```

Alternatively, you can also use:

```go
var user *User
g.Model(tableUser).With(User{}.UserDetail, User{}.UserScore).Where("id", 3).Scan(&user)
```

***Associating Only User Details***

If you only need to query user details and not user scores, you can use the `With` method to enable association queries for the specified object:

```go
var user *User
g.Model(tableUser).With(UserDetail{}).Where("id", 3).Scan(&user)
```

Or:

```go
var user *User
g.Model(tableUser).With(User{}.UserDetail).Where("id", 3).Scan(&user)
```

After execution, the data printed by `g.Dump(user)` will be:

```json
{
    "id": 3,
    "name": "name_3",
    "UserDetail": {
        "uid": 3,
        "address": "address_3"
    },
    "UserScores": null
}
```

***Associating Only User Scores***

Similarly, if you only want to query user scores, use:

```go
var user *User
g.Model(tableUser).With(UserScore{}).Where("id", 3).Scan(&user)
```

Or:

```go
var user *User
g.Model(tableUser).With(User{}.UserScore).Where("id", 3).Scan(&user)
```

The data printed by `g.Dump(user)` will be:

```json
{
    "id": 3,
    "name": "name_3",
    "UserDetail": null,
    "UserScores": [
        {
            "id": 11,
            "uid": 3,
            "score": 1
        },
        {
            "id": 12,
            "uid": 3,
            "score": 2
        },
        {
            "id": 13,
            "uid": 3,
            "score": 3
        },
        {
            "id": 14,
            "uid": 3,
            "score": 4
        },
        {
            "id": 15,
            "uid": 3,
            "score": 5
        }
    ]
}
```

***No Associated Model Query***

If no association queries are needed, the process is simpler:

```go
var user *User
g.Model(tableUser).Where("id", 3).Scan(&user)
```

After execution, the data printed by `g.Dump(user)` will be:

```json
{
    "id": 3,
    "name": "name_3",
    "UserDetail": null,
    "UserScores": null
}
```

## Usage Limitations

### Field Queries and Filtering

In the examples provided earlier, we did not specify the fields to query. However, the `SQL` logs show that the queries are not simple `SELECT *` statements but specific field queries. When using the `With` feature, the `ORM` component automatically queries based on the properties of the associated model objects. The property names are automatically mapped to database fields, and fields that cannot be automatically mapped are filtered out.

Thus, under the `With` feature, you cannot query only specific fields of the properties. To achieve this, it is recommended to create data structures tailored to specific business scenarios rather than using a single data structure for multiple scenarios.

**Example:**

Suppose we have an entity data structure `Content`, a common `CMS` content model, which maps directly to the database table fields:

```go
type Content struct {
    Id             uint        `orm:"id,primary"       json:"id"`               // Auto-increment ID
    Key            string      `orm:"key"              json:"key"`              // Unique key name, used for hard coding, not commonly used
    Type           string      `orm:"type"             json:"type"`             // Content model: topic, ask, article, etc., defined by the program
    CategoryId     uint        `orm:"category_id"      json:"category_id"`      // Category ID
    UserId         uint        `orm:"user_id"          json:"user_id"`          // User ID
    Title          string      `orm:"title"            json:"title"`            // Title
    Content        string      `orm:"content"          json:"content"`          // Content
    Sort           uint        `orm:"sort"             json:"sort"`             // Sorting, lower values are ranked higher, default is the timestamp of creation, can be used for pinning
    Brief          string      `orm:"brief"            json:"brief"`            // Summary
    Thumb          string      `orm:"thumb"            json:"thumb"`            // Thumbnail
    Tags           string      `orm:"tags"             json:"tags"`             // List of tag names stored in JSON
    Referer        string      `orm:"referer"          json:"referer"`          // Content source, e.g., github/gitee
    Status         uint        `orm:"status"           json:"status"`           // Status 0: normal, 1: disabled
    ReplyCount     uint        `orm:"reply_count"      json:"reply_count"`      // Number of replies
    ViewCount      uint        `orm:"view_count"       json:"view_count"`       // Number of views
    ZanCount       uint        `orm:"zan_count"        json:"zan_count"`        // Likes
    CaiCount       uint        `orm:"cai_count"        json:"cai_count"`        // Dislikes
    CreatedAt      *gtime.Time `orm:"created_at"       json:"created_at"`       // Creation time
    UpdatedAt      *gtime.Time `orm:"updated_at"       json:"updated_at"`       // Last modified time
}
```

The content list page does not need to display all these details, especially since the `Content` field is very large. For a list page, you may only need a few fields. Therefore, you can define a separate data structure for listing purposes:

```go
type ContentListItem struct {
    Id         uint        `json:"id"`          // Auto-increment ID
    CategoryId uint        `json:"category_id"` // Category ID
    UserId     uint        `json:"user_id"`     // User ID
    Title      string      `json:"title"`       // Title
    CreatedAt  *gtime.Time `json:"created_at"`  // Creation time
    UpdatedAt  *gtime.Time `json:"updated_at"`  // Last modified time
}
```

#### Required Association Fields

Since the `With` feature works by identifying associations and automatically executing multiple SQL queries, the associated fields must be present as attributes in the object to facilitate automatic retrieval. In simple terms, fields in the `with` tag must exist on the associated object.

## Recursive Associations

If associated model properties also have `with` tags, recursive queries will be executed. The `With` feature supports unlimited levels of recursive associations.

**Example:**

```go
// User details
type UserDetail struct {
    gmeta.Meta `orm:"table:user_detail"`
    Uid        int    `json:"uid"`
    Address    string `json:"address"`
}

// User scores - required courses
type UserScoresRequired struct {
    gmeta.Meta `orm:"table:user_scores"`
    Id         int `json:"id"`
    Uid        int `json:"uid"`
    Score      int `json:"score"`
}

// User scores - elective courses
type UserScoresOptional struct {
    gmeta.Meta `orm:"table:user_scores"`
    Id         int `json:"id"`
    Uid        int `json:"uid"`
    Score      int `json:"score"`
}

// User scores
type UserScores struct {
    gmeta.Meta `orm:"table:user_scores"`
    Id         int                  `json:"id"`
    Uid        int                  `json:"uid"`
    Required   []UserScoresRequired `orm:"with:id, where:type=1"`
    Optional   []UserScoresOptional `orm:"with:id, where:type=2"`
}

// User information
type User struct {
    gmeta.Meta `orm:"table:user"`
    Id         int           `json:"id"`
    Name       string        `json:"name"`
    UserDetail *UserDetail   `orm:"with:uid=id"`
    UserScores []*UserScores `orm:"with:uid=id"`
}
```

## Model Examples

Here are additional examples of model definitions based on current database tables:

### Nested Associated Models

```go
type UserDetail struct {
    gmeta.Meta `orm:"table:user_detail"`
    Uid        int    `json:"uid"`
    Address    string `json:"address"`
}

type UserScores struct {
    gmeta.Meta `orm:"table:user_scores"`
    Id         int `json:"id"`
    Uid        int `json:"uid"`
    Score      int `json:"score"`
}

type User struct {
    gmeta.Meta  `orm:"table:user"`
    *UserDetail `orm:"with:uid=id"`
    Id          int           `json:"id"`
    Name        string        `json:"name"`
    UserScores  []*UserScores `orm:"with:uid=id"`
}
```

Nested models are also supported and automatically populated as long as they are struct embeddings.

**Example:**

```go
type UserDetail struct {
    Uid     int    `json:"uid"`
    Address string `json:"address"`
}

type UserDetailEmbedded struct {
    UserDetail
}

type UserScores struct {
    Id    int `json:"id"`
    Uid   int `json:"uid"`
    Score int `json:"score"`
}

type User struct {
    *UserDetailEmbedded `orm:"with:uid=id"`
    Id                  int           `json:"id"`
    Name                string        `json:"name"`
    UserScores          []*UserScores `orm:"with:uid=id"`
}
```

### Basic Model Nesting

```go
type UserDetail struct {
    gmeta.Meta `orm:"table:user_detail"`
    Uid        int    `json:"uid"`
    Address    string `json:"address"`
}

type UserScores struct {
    gmeta.Meta `orm:"table:user_scores"`
    Id         int `json:"id"`
    Uid        int `json:"uid"`
    Score      int `json:"score"`
}

type UserEmbedded struct {
    Id   int    `json:"id"`
    Name string `json:"name"`
}

type User struct {
    gmeta.Meta `orm:"table:user"`
    UserEmbedded
    *UserDetail `orm:"with:uid=id"`
    UserScores  []*UserScores `orm:"with:uid=id"`
}
```

### Models Without Meta Information

If the `meta` structure is not present, the table names will be automatically derived from the struct names using `CaseSnake` format. For example, `UserDetail` will automatically use the `user_detail` table, and `UserScores` will use the `user_scores` table.

```go
type UserDetail struct {
    Uid     int    `json:"uid"`
    Address string `json:"address"`
}

type UserScores struct {
    Id    int `json:"id"`
    Uid   int `json:"uid"`
    Score int `json:"score"`
}

type User struct {
    *UserDetail `orm:"with:uid=id"`
    Id          int           `json:"id"`
    Name        string        `json:"name"`
    UserScores  []*UserScores `orm:"with:uid=id"`
}
```

---

### Future Improvements

Currently, the `With` feature only supports query operations and does not support write, update, or other operations.
