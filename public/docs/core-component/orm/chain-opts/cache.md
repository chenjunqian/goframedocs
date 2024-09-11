# ORM Chain Operation - Caching

## Query Caching

`gdb` supports caching of query results, which is commonly used in scenarios with frequent reads and infrequent writes. It also supports manual cache clearing. Note that query caching is only available for chain operations and cannot be used during transactions.

***Related Methods***

```go
type CacheOption struct {
 // Duration is the TTL for the cache.
 // If the parameter `Duration` < 0, it clears the cache with the given `Name`.
 // If the parameter `Duration` = 0, it never expires.
 // If the parameter `Duration` > 0, it expires after `Duration`.
 Duration time.Duration

 // Name is an optional unique name for the cache.
 // The Name is used to bind a name to the cache, allowing later control of the cache,
 // such as changing the `duration` or clearing the cache with a specified Name.
 Name string

 // Force caches the query result regardless of whether the result is nil or not.
 // It is used to avoid Cache Penetration.
 Force bool
}

// Cache sets the cache feature for the model. It caches the result of the SQL query, meaning
// if there is another identical SQL request, it reads and returns the result from the cache
// rather than executing it against the database.
//
// Note that the cache feature is disabled if the model is performing a select statement
// within a transaction.
func (m *Model) Cache(option CacheOption) *Model
```

## Cache Management

### Cache Object

By default, the ORM provides a cache management object of type `*gcache.Cache`, which also supports all features of `*gcache.Cache`. You can obtain this cache object using the `GetCache() *gcache.Cache` interface method, and perform custom cache operations using the returned object, for example: `g.DB().GetCache().Keys()`.

### Cache Adapter

***Redis as an example***

By default, the `*gcache.Cache` object of the ORM provides single-process memory caching, which is very efficient but can only be used within a single process. If the service is deployed across multiple nodes, there may be inconsistencies between caches on different nodes. Therefore, in most scenarios, we use a Redis server to cache database query data. The `*gcache.Cache` object uses an adapter design pattern, making it easy to switch from single-process memory caching to distributed Redis caching. Here is an example:

```go
redisCache := gcache.NewAdapterRedis(g.Redis())
g.DB().GetCache().SetAdapter(redisCache)
```

For more information, refer to: [Cache - Redis Cache](/docs/core-component/cache/redis).

### Management Methods

To simplify database query cache management, two cache management methods have been provided since version v2.2.0:

```go
// ClearCache removes cached SQL results for a specific table.
func (c *Core) ClearCache(ctx context.Context, table string) (err error)

// ClearCacheAll removes all cached SQL results from the cache.
func (c *Core) ClearCacheAll(ctx context.Context) (err error)
```

As described in the comments, these two methods are mounted on the `Core` object, which is exposed via the `DB` interface, so we can get the `Core` object like this:

```go
g.DB().GetCore()
```

## Usage Example

### Database Table Structure

```sql
CREATE TABLE `user` (
  `uid` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(30) NOT NULL DEFAULT '' COMMENT 'Nickname',
  `site` varchar(255) NOT NULL DEFAULT '' COMMENT 'Homepage',
  PRIMARY KEY (`uid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;
```

### Example Code

```go
package main

import (
 "time"

 "github.com/gogf/gf/v2/database/gdb"
 "github.com/gogf/gf/v2/frame/g"
 "github.com/gogf/gf/v2/os/gctx"
)

func main() {
    var (
        db  = g.DB()
        ctx = gctx.New()
    )

    // Enable debug mode to log all executed SQL statements
    db.SetDebug(true)

    // Insert test data
    _, err := g.Model("user").Ctx(ctx).Data(g.Map{
        "name": "john",
        "site": "https://goframe.org",
    }).Insert()

    // Execute the query twice and cache the result for 1 hour with an optional cache name
    for i := 0; i < 2; i++ {
    r, _ := g.Model("user").Ctx(ctx).Cache(gdb.CacheOption{
            Duration: time.Hour,
            Name:     "vip-user",
            Force:    false,
        }).Where("uid", 1).One()
        g.Log().Debug(ctx, r.Map())
    }

    // Perform an update and clear the cache for the specified name
    _, err = g.Model("user").Ctx(ctx).Cache(gdb.CacheOption{
        Duration: -1,
        Name:     "vip-user",
        Force:    false,
    }).Data(gdb.Map{"name": "smith"}).Where("uid", 1).Update()
        if err != nil {
        g.Log().Fatal(ctx, err)
    }

    // Execute the query again with caching enabled
    r, _ := g.Model("user").Ctx(ctx).Cache(gdb.CacheOption{
        Duration: time.Hour,
        Name:     "vip-user",
        Force:    false,
    }).Where("uid", 1).One()
    g.Log().Debug(ctx, r.Map())
}
```

***Execution Result***

After execution, the output will be (the data structure of the test table is for reference only):

```bash
2022-02-08 17:36:19.817 [DEBU] {c0424c75f1c5d116d0df0f7197379412} {"name":"john","site":"https://goframe.org","uid":1} 
2022-02-08 17:36:19.817 [DEBU] {c0424c75f1c5d116d0df0f7197379412} {"name":"john","site":"https://goframe.org","uid":1} 
2022-02-08 17:36:19.817 [DEBU] {c0424c75f1c5d116d0df0f7197379412} [  0 ms] [default] [rows:1  ] UPDATE `user` SET `name`='smith' WHERE `uid`=1 
2022-02-08 17:36:19.818 [DEBU] {c0424c75f1c5d116d0df0f7197379412} [  1 ms] [default] [rows:1  ] SELECT * FROM `user` WHERE `uid`=1 LIMIT 1 
2022-02-08 17:36:19.818 [DEBU] {c0424c75f1c5d116d0df0f7197379412} {"name":"smith","site":"https://goframe.org","uid":1}
```

***Notes***

- For demonstration purposes, debugging is enabled to output all SQL operations to the terminal.
- Two `One` method queries are performed. The first executes the SQL query, and the second uses the cached result. Therefore, only one SQL query is logged, and both queries return the same result.
- A custom cache name `vip-user` is set for the query cache to facilitate later cache clearing. If no cache clearing is required, you do not need to set a cache name.
- During the `Update` operation, the cache with the specified name is cleared.
- When the `One` method is executed again, the new data is cached.
