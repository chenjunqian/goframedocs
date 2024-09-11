# Cache - Interface

The caching component in `Goframe` is designed with an interface-based approach, offering an `Adapter` interface. Any object that implements the `Adapter` interface can be registered with the cache management object, allowing developers to flexibly customize and extend the cache management implementation.

## Definition

The `Adapter` interface is defined as follows:  
[Adapter Interface Definition](https://pkg.go.dev/github.com/gogf/gf/v2/os/gcache#Adapter)

## Registering Adapter

To apply a custom adapter implementation to a `Cache` object, use the following method:

```go
// SetAdapter changes the adapter for this cache.
// Be very note that, this setting function is not concurrent-safe, which means you should not call
// this setting function concurrently in multiple goroutines.
func (c *Cache) SetAdapter(adapter Adapter)
```

For detailed examples, please refer to the [Cache - Redis Cache](/docs/core-component/cache/redis-cache).

## Retrieving Adapter

To retrieve the currently registered adapter implementation for a `Cache` object, use the following method:

```go
// GetAdapter returns the adapter that is set in current Cache.
func (c *Cache) GetAdapter() Adapter
```

For detailed examples, please refer to the [Cache - Redis Cache](/docs/core-component/cache/redis-cache).
