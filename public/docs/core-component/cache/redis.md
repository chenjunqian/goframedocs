# Cache - Redis Cache

The GoFrame caching component provides a Redis cache adapter through `gcache`, which is particularly useful in scenarios requiring cache data consistency across multiple nodes, such as session sharing and database query caching.

## Usage Example

```go
func ExampleCache_SetAdapter() {
    var (
        err         error
        ctx         = gctx.New()
        cache       = gcache.New()
        redisConfig = &gredis.Config{
            Address: "127.0.0.1:6379",  // Redis server address
            Db:      9,                 // Redis database index
        }
        cacheKey   = `key`    // Cache key
        cacheValue = `value`  // Cache value
    )
    
    // Create a Redis client object.
    redis, err := gredis.New(redisConfig)
    if err != nil {
        panic(err)
    }

    // Create a Redis cache adapter and set it to the cache object.
    cache.SetAdapter(gcache.NewAdapterRedis(redis))

    // Set a value in the cache and retrieve it using the cache object.
    err = cache.Set(ctx, cacheKey, cacheValue, time.Second)
    if err != nil {
        panic(err)
    }
    fmt.Println(cache.MustGet(ctx, cacheKey).String())

    // Retrieve the value using the Redis client directly.
    fmt.Println(redis.MustDo(ctx, "GET", cacheKey).String())

    // Output:
    // value
    // value
}
```

## Notes

It is crucial to understand how operations like `Clear` and `Size` function when using Redis as the cache backend.

- **Redis Database Connection:**  
  The same `gredis.Config` always connects to the same Redis database (`db`). However, Redis lacks a built-in feature for data grouping. As a result, when multiple `gcache.Cache` objects connect to the same Redis database, they share the entire database. This means that operations like `Clear` and `Size` will affect the entire Redis database, not just the content associated with the specific `gcache.Cache` instance. This behavior may seem counterintuitive, so it's essential to use these operations cautiously.

- **Recommendation for Business Cache Segregation:**  
  To avoid potential conflicts and ensure proper data management, it's recommended to configure and use different Redis databases (`db`) for different types of business cache. Avoid sharing the same Redis database with other business data.
