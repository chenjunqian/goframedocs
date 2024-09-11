# ORM Chain Operation - Query - ScanAndCount

## Basic Introduction

In pagination scenarios, it is common to first call the `Scan` method combined with `Limit`/`Page` chain operation methods to query the list, and then remove the `Limit`/`Page` chain operation methods to query the total count. This process can be quite cumbersome. Therefore, starting from version v2.5.0, the framework provides the `ScanAndCount` method to simplify pagination queries.

## Usage Example

The example code below is derived from a business project case and is for reference only; it cannot run independently.

### Pagination Query

```go
// GetList retrieves a list of users for an instance.
func (s sUserInfo) GetList(ctx context.Context, in model.UserInfoGetListInput) (items []entity.UserInfo, total int, err error) {
    items = make([]entity.UserInfo, 0)
    orm := dao.UserInfo.Ctx(ctx).OmitEmpty().Where(do.UserInfo{
        ResourceId: in.ResourceId,
        Status:     in.Statuses,
    })
    err = orm.Order(in.OrderBy, in.OrderDirection).Limit(in.Offset, in.Limit).Scan(&items)
    if err != nil {
        return
    }
    total, err = orm.Count()
    return
}
```

### Pagination Query With ScanAndCount

```go
// GetList retrieves a list of users for an instance.
func (s sUserInfo) GetList(ctx context.Context, in model.UserInfoGetListInput) (items []entity.UserInfo, total int, err error) {
    items = make([]entity.UserInfo, 0)
    err = dao.UserInfo.Ctx(ctx).OmitEmpty().
        Where(do.UserInfo{
            ResourceId: in.ResourceId,
            Status:     in.Statuses,
    }).
    Order(in.OrderBy, in.OrderDirection).
    Limit(in.Offset, in.Limit).
    ScanAndCount(&items, &total, true)
    return
}
```

## Notes

- The `ScanAndCount` method is designed for scenarios where both data and total count need to be queried, typically in pagination scenarios.
- The third parameter of `ScanAndCount`, `useFieldForCount`, indicates whether to use the `Fields` as the `Count` parameter during the `Count` operation. It is usually set to `true`. Passing `false` will execute a `COUNT(1)` query to get the total count.
