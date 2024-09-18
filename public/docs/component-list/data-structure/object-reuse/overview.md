# Object Reuse - gpool

## Introduction

The object reuse pool (concurrent-safe) is a feature that allows object caching and reuse. It supports expiration time, creation methods, and destruction methods.

***Use Cases***

- Any scenario that requires object reuse with timed expiration.

***Usage***

```go
import "github.com/gogf/gf/v2/container/gpool"
```

### API Documentation

[API Documentation](https://pkg.go.dev/github.com/gogf/gf/v2/container/gpool)

### Important Notes

1. The `New` method's expiration time is of type `time.Duration`.
2. The object creation method (`newFunc NewFunc`) returns a value containing an error. If the object creation fails, the error provides the reason.
3. The object destruction method (`expireFunc...ExpireFunc`) is an optional parameter, which allows a custom method to be automatically called to destroy objects when they expire or the pool is closed.

## gpool vs sync.Pool

Both `gpool` and `sync.Pool` achieve object reuse, but their design purposes and use cases differ.

- `sync.Pool` does not support custom expiration times for objects. The reason is that `sync.Pool` is not a cache. The main design of `sync.Pool` is to alleviate GC (Garbage Collection) pressure. Objects in `sync.Pool` are cleared before the GC starts.
- Moreover, `sync.Pool` does not support object creation or destruction methods.
