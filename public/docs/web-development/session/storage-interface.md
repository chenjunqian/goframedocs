# Session-Storage Interface Development

In most scenarios, the common `Storage` implementations provided by the `gsession` component are sufficient to meet the needs. However, if there are special scenarios that require a customized `Storage` implementation, this is also supported because all features of `gsession` are designed with an interface-based approach.

## Storage Definition

For detailed interface documentation, please refer to: [gsession_storage.go](https://github.com/gogf/gf/v2/blob/master/os/gsession/gsession_storage.go)

```go
// Storage is the interface definition for session storage.
type Storage interface {
    // New creates a custom session id.
    // This function can be used for custom session creation.
    New(ctx context.Context, ttl time.Duration) (id string, err error)

    // Get retrieves and returns session value with given key.
    // It returns nil if the key does not exist in the session.
    Get(ctx context.Context, id string, key string) (value interface{}, err error)

    // GetMap retrieves all key-value pairs as map from storage.
    GetMap(ctx context.Context, id string) (data map[string]interface{}, err error)

    // GetSize retrieves and returns the size of key-value pairs from storage.
    GetSize(ctx context.Context, id string) (size int, err error)

    // Set sets one key-value session pair to the storage.
    // The parameter `ttl` specifies the TTL for the session id.
    Set(ctx context.Context, id string, key string, value interface{}, ttl time.Duration) error

    // SetMap batch sets key-value session pairs as map to the storage.
    // The parameter `ttl` specifies the TTL for the session id.
    // Note that the `ttl` parameter specifies the TTL for the session id, not for individual key-value pairs.
    SetMap(ctx context.Context, id string, data map[string]interface{}, ttl time.Duration) error

    // Remove deletes key with its value from storage.
    Remove(ctx context.Context, id string, key string) error

    // RemoveAll deletes all key-value pairs from storage.
    RemoveAll(ctx context.Context, id string) error

    // GetSession returns the session data as `*gmap.StrAnyMap` for given session id from storage.
    // The parameter `ttl` specifies the TTL for this session.
    // The parameter `data` is the current old session data stored in memory,
    // and for some storage it might be nil if memory storage is disabled.
    // This function is called every time a session starts. It returns nil if the TTL is exceeded.
    GetSession(ctx context.Context, id string, ttl time.Duration, data *gmap.StrAnyMap) (*gmap.StrAnyMap, error)

    // SetSession updates the data for specified session id.
    // This function is called every time a session, which has been changed and marked as dirty, is closed.
    // This copies all session data map from memory to storage.
    SetSession(ctx context.Context, id string, data *gmap.StrAnyMap, ttl time.Duration) error

    // UpdateTTL updates the TTL for specified session id.
    // This function is called every time a session, which is not dirty, is closed.
    UpdateTTL(ctx context.Context, id string, ttl time.Duration) error
}
```

Each method's timing of invocation is detailed in the comments. Developers can fully refer to the built-in `Storage` implementations when developing their own custom `Storage`.

## Notes

- Not all interface methods in the `Storage` interface need to be implemented; developers only need to implement some interfaces based on specific business needs and the timing of their invocations.
- To improve the performance of Session operations, the interface uses the `gmap.StrAnyMap` container type. For more information on using this container, you can refer to the section on dictionary types: [gmap](/docs/component-list/data-structure/dict/).
