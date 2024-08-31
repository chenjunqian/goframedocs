# ORM Query - LeftJoin/RightJoin/InnerJoin

## LeftJoin/RightJoin/InnerJoin

- **LeftJoin**: Performs a left join query.
- **RightJoin**: Performs a right join query.
- **InnerJoin**: Performs an inner join query.

It is generally not recommended to use `Join` queries, especially in scenarios where there is a large amount of data or high concurrency, as it may lead to performance issues and increased maintenance complexity. It is suggested to use joins only when necessary. Additionally, you can refer to the [ORM - Model Association](/docs/core-component/orm/chain-opts/model-association) chapter. The database should only handle data storage and simple single-table operations, while data aggregation can be achieved at the code level using the ORM's features.

### Usage Examples

- **Query a Single Record That Meets the Condition (First Record)**

```go
// SELECT u.*,ud.site FROM user u LEFT JOIN user_detail ud ON u.uid=ud.uid WHERE u.uid=1 LIMIT 1
g.Model("user u").LeftJoin("user_detail ud", "u.uid=ud.uid").Fields("u.*,ud.site").Where("u.uid", 1).One()
```

- **Query Specific Field Values**

```go
// SELECT ud.site FROM user u RIGHT JOIN user_detail ud ON u.uid=ud.uid WHERE u.uid=1 LIMIT 1
g.Model("user u").RightJoin("user_detail ud", "u.uid=ud.uid").Fields("ud.site").Where("u.uid", 1).Value()
```

- **Grouping and Sorting**

```go
// SELECT u.*,ud.city FROM user u INNER JOIN user_detail ud ON u.uid=ud.uid GROUP BY city ORDER BY register_time asc
g.Model("user u").InnerJoin("user_detail ud", "u.uid=ud.uid").Fields("u.*,ud.city").Group("city").Order("register_time asc").All()
```

- **Table Join Query Without Using `Join`**

```go
// SELECT u.*,ud.city FROM user u,user_detail ud WHERE u.uid=ud.uid
g.Model("user u,user_detail ud").Where("u.uid=ud.uid").Fields("u.*,ud.city").All()
```

### Table Aliases

```go
// SELECT * FROM `user` AS u LEFT JOIN `user_detail` AS ud ON(ud.id=u.id) WHERE u.id=1 LIMIT 1
g.Model("user", "u").LeftJoin("user_detail", "ud", "ud.id=u.id").Where("u.id", 1).One()
g.Model("user").As("u").LeftJoin("user_detail", "ud", "ud.id=u.id").Where("u.id", 1).One()
```

### OnFields

The `LeftJoinOnFields`, `RightJoinOnFields`, and `InnerJoinOnFields` methods allow you to specify fields and operators for join queries.

- **Query a Single Record That Meets the Condition (First Record)**

```go
// SELECT user.*,user_detail.address FROM user LEFT JOIN user_detail ON (user.id = user_detail.uid) WHERE user.id=1 LIMIT 1
g.Model("user").LeftJoinOnFields("user_detail", "id", "=", "uid").Fields("user.*,user_detail.address").Where("id", 1).One()
```

- **Query Multiple Records**

```go
// SELECT user.*,user_detail.address FROM user RIGHT JOIN user_detail ON (user.id = user_detail.uid)
g.Model("user").RightJoinOnFields("user_detail", "id", "=", "uid").Fields("user.*,user_detail.address").All()
```

### Example with `dao` Usage

```go
// SELECT resource_task_schedule.id,...,time_window.time_window 
// FROM `resource_task_schedule` 
// LEFT JOIN `time_window` ON (`resource_task_schedule`.`resource_id`=`time_window`.`resource_id`) 
// WHERE (time_window.`status`="valid") AND (`time_window`.`start_time` <= 3600)
var (
 orm                = dao.ResourceTaskSchedule.Ctx(ctx)
 tsTable            = dao.ResourceTaskSchedule.Table()
 tsCls              = dao.ResourceTaskSchedule.Columns()
 twTable            = dao.TimeWindow.Table()
 twCls              = dao.TimeWindow.Columns()
 scheduleItems      []scheduleItem
)
orm = orm.FieldsPrefix(tsTable, tsCls)
orm = orm.FieldsPrefix(twTable, twCls.TimeWindow)
orm = orm.LeftJoinOnField(twTable, twCls.ResourceId)
orm = orm.WherePrefix(twTable, twCls.Status, "valid")
orm = orm.WherePrefixLTE(twTable, twCls.StartTime, 3600)
err = orm.Scan(&scheduleItems)
```

```go
// SELECT DISTINCT resource_info.* FROM `resource_info` 
// LEFT JOIN `resource_network` ON (`resource_info`.`resource_id`=`resource_network`.`resource_id`) 
// WHERE (`resource_info`.`resource_id` like '%10.0.1.3%') 
// or (`resource_info`.`resource_name` like '%10.0.1.3%') 
// or (`resource_network`.`vip`like '%10.0.1.3%')  
// ORDER BY `id` Desc LIMIT 0,2
var (
    orm    = dao.ResourceInfo.Ctx(ctx).OmitEmpty()
    rTable = dao.ResourceInfo.Table()
    rCls   = dao.ResourceInfo.Columns()
    nTable = dao.ResourceNetwork.Table()
    nCls   = dao.ResourceNetwork.Columns()
)
orm = orm.LeftJoinOnField(nTable, rCls.ResourceId)
orm = orm.WherePrefix(rTable, do.ResourceInfo{
    AppId:        req.AppIds,
    ResourceId:   req.ResourceIds,
    Region:       req.Regions,
    Zone:         req.Zones,
    ResourceName: req.ResourceNames,
    Status:       req.Statuses,
    BusinessType: req.Products,
    Engine:       req.Engines,
    Version:      req.Versions,
})
orm = orm.WherePrefix(nTable, do.ResourceNetwork{
    Vip:      req.Vips,
    VpcId:    req.VpcIds,
    SubnetId: req.SubnetIds,
})
// Fuzzy like querying.
if req.Key != "" {
    var (
        keyLike = "%" + req.Key + "%"
    )
    whereFormat := fmt.Sprintf(
        "(`%s`.`%s` like ?) or (`%s`.`%s` like ?) or (`%s`.`%s`like ?) ",
        rTable, rCls.ResourceId,
        rTable, rCls.ResourceName,
        nTable, nCls.Vip,
    )
    orm = orm.Where(whereFormat, keyLike, keyLike, keyLike)
}
// Resource items.
err = orm.Distinct().FieldsPrefix(rTable, "*").Order(req.Order, req.OrderDirection).Limit(req.Offset, req.Limit).Scan(&res.Items)
```
