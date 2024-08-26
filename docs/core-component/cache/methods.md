# Cache - Methods

For the most up-to-date methods and examples, refer to the [official documentation](https://pkg.go.dev/github.com/gogf/gf/v2/os/gcache).

## Set

**Description:** Sets a cache entry with a key-value pair. Both key and value can be of any type.

**Format:**

```go
Set(ctx context.Context, key interface{}, value interface{}, duration time.Duration) error
```

**Example:**

```go
func ExampleCache_Set() {
    c := gcache.New()
    c.Set(ctx, "k1", g.Slice{1, 2, 3, 4, 5, 6, 7, 8, 9}, 0)
    fmt.Println(c.Get(ctx, "k1"))

    // Output:
    // [1,2,3,4,5,6,7,8,9] <nil>
}
```

## SetAdapter

**Description:** Changes the underlying adapter of the cache object. Note that this function is not thread-safe.

**Format:**

```go
SetAdapter(adapter Adapter)
```

**Example:**

```go
func ExampleCache_SetAdapters() { 
    c := gcache.New()
    adapter := gcache.New()
    c.SetAdapter(adapter)
    c.Set(ctx, "k1", g.Slice{1, 2, 3, 4, 5, 6, 7, 8, 9}, 0)
    fmt.Println(c.Get(ctx, "k1"))

    // Output:
    // [1,2,3,4,5,6,7,8,9] <nil>
}
```

## SetIfNotExist

**Description:** Sets the value for a key if the key does not already exist, and returns `true`. Returns `false` if the key already exists.

**Format:**

```go
SetIfNotExist(ctx context.Context, key interface{}, value interface{}, duration time.Duration) (ok bool, err error)
```

**Example:**

```go
func ExampleCache_SetIfNotExist() { 
    c := gcache.New()
    // Write when the key name does not exist, and set the expiration time to 1000 milliseconds
    k1, err := c.SetIfNotExist(ctx, "k1", "v1", 1000*time.Millisecond)
    fmt.Println(k1, err)

    // Returns false when the key name already exists
    k2, err := c.SetIfNotExist(ctx, "k1", "v2", 1000*time.Millisecond)
    fmt.Println(k2, err)

    // Print the current list of key values
    keys1, _ := c.Keys(ctx)
    fmt.Println(keys1)

    // It does not expire if `duration` == 0. It deletes the `key` if `duration` < 0 or given `value` is nil.
    c.SetIfNotExist(ctx, "k1", 0, -10000)

    // Wait 1 second for K1: V1 to expire automatically
    time.Sleep(1200 * time.Millisecond)

    // Print the current key value pair again and find that K1: V1 has expired
    keys2, _ := c.Keys(ctx)
    fmt.Println(keys2)

    // Output:
    // true <nil>
    // false <nil>
    // [k1]
    // [<nil>]
}
```

## SetMap

**Description:** Sets multiple key-value pairs in the cache at once. The input parameter is of type `map[interface{}]interface{}`.

**Format:**

```go
SetMap(ctx context.Context, data map[interface{}]interface{}, duration time.Duration) error
```

**Example:**

```go
func ExampleCache_SetMap() { 
    c := gcache.New()
    data := g.MapAnyAny{
        "k1": "v1",
        "k2": "v2",
        "k3": "v3",
    }
    c.SetMap(ctx, data, 1000*time.Millisecond)

    // Gets the specified key value
    v1, _ := c.Get(ctx, "k1")
    v2, _ := c.Get(ctx, "k2")
    v3, _ := c.Get(ctx, "k3")

    fmt.Println(v1, v2, v3)

    // Output:
    // v1 v2 v3
}
```

## Size

**Description:** Returns the number of items in the cache.

**Format:**

```go
Size(ctx context.Context) (size int, err error)
```

**Example:**

```go
func ExampleCache_Size() {
    c := gcache.New()

    // Add 10 elements without expiration
    for i := 0; i < 10; i++ {
        c.Set(ctx, i, i, 0)
    }

    // Size returns the number of items in the cache.
    n, _ := c.Size(ctx)
    fmt.Println(n)

    // Output:
    // 10
}
```

## Update

**Description:** Updates the value of a key without changing its expiration time and returns the old value. If the key does not exist in the cache, `exist` will be `false`.

**Format:**

```go
Update(ctx context.Context, key interface{}, value interface{}) (oldValue *gvar.Var, exist bool, err error)
```

**Example:**

```go
func ExampleCache_Update() {     
    c := gcache.New()
    c.SetMap(ctx, g.MapAnyAny{"k1": "v1", "k2": "v2", "k3": "v3"}, 0)

    k1, _ := c.Get(ctx, "k1")
    fmt.Println(k1)
    k2, _ := c.Get(ctx, "k2")
    fmt.Println(k2)
    k3, _ := c.Get(ctx, "k3")
    fmt.Println(k3)

    re, exist, _ := c.Update(ctx, "k1", "v11")
    fmt.Println(re, exist)

    re1, exist1, _ := c.Update(ctx, "k4", "v44")
    fmt.Println(re1, exist1)

    kup1, _ := c.Get(ctx, "k1")
    fmt.Println(kup1)
    kup2, _ := c.Get(ctx, "k2")
    fmt.Println(kup2)
    kup3, _ := c.Get(ctx, "k3")
    fmt.Println(kup3)

    // Output:
    // v1
    // v2
    // v3
    // v1 true
    //  false
    // v11
    // v2
    // v3 
}
```

## UpdateExpire

**Description:** Updates the expiration time of a key and returns the old expiration time value. If the key does not exist in the cache, it returns `-1`.

**Format:**

```go
UpdateExpire(ctx context.Context, key interface{}, duration time.Duration) (oldDuration time.Duration, err error)
```

**Example:**

```go
func ExampleCache_UpdateExpire() {     
    c := gcache.New()
    c.Set(ctx, "k1", "v1", 1000*time.Millisecond)
    expire, _ := c.GetExpire(ctx, "k1")
    fmt.Println(expire)

    c.UpdateExpire(ctx, "k1", 500*time.Millisecond)

    expire1, _ := c.GetExpire(ctx, "k1")
    fmt.Println(expire1)

    // Output:
    // 1s
    // 500ms 
}
```

## Values

**Description:** Retrieves all values in the cache and returns them as a slice.

**Format:**

```go
Values(ctx context.Context) (values []interface{}, err error)
```

**Example:**

```go
func ExampleCache_Values() {     
    c := gcache.New()

    c.Set(ctx, "k1", g.Map{"k1": "v1", "k2": "v2"}, 0)

    // Values returns all values in the cache as slice.
    data, _ := c.Values(ctx)
    fmt.Println(data)

    // May Output:
    // [map[k1:v1 k2:v2]]
}
```

## Close

**Description:** Closes the cache, allowing garbage collection of resources. By default, the cache does not need to be closed.

**Format:**

```go
Close(ctx context.Context) error
```

**Example:**

```go
func ExampleCache_Close() {     
    c := gcache.New()

    c.Set(ctx, "k1", "v", 0)
    data, _ := c.Get(ctx, "k1")
    fmt.Println(data)

    // Close closes the cache if necessary.
    c.Close(ctx)

    data1, _ := c.Get(ctx, "k1")

    fmt.Println(data1)

    // Output:
    // v
    // v
}
```

## Contains

**Description:** Returns `true` if the cache contains the specified key, otherwise returns `false`.

**Format:**

```go
Contains(ctx context.Context, key interface{}) (bool, error)
```

**Example:**

```go
func ExampleCache_Contains() {     
    c := gcache.New()

    // Set Cache
    c.Set(ctx, "k", "v", 0)

    data, _ := c.Contains(ctx, "k")
    fmt.Println(data

)

    data1, _ := c.Contains(ctx, "k1")
    fmt.Println(data1)

    // Output:
    // true
    // false
}
```

## GetExpire

**Description:** Retrieves the expiration time of a specified key. Returns `-1` if the key does not exist.

**Format:**

```go
GetExpire(ctx context.Context, key interface{}) (time.Duration, error)
```

**Example:**

```go
func ExampleCache_GetExpire() {     
    c := gcache.New()
    c.Set(ctx, "k1", "v1", 1000*time.Millisecond)
    expire, _ := c.GetExpire(ctx, "k1")
    fmt.Println(expire)
    
    // Output:
    // 1s
}
```

## Keys

**Description:** Retrieves all the keys in the cache and returns them as a slice.

**Format:**

```go
Keys(ctx context.Context) (keys []interface{}, err error)
```

**Example:**

```go
func ExampleCache_Keys() {     
    c := gcache.New()

    c.Set(ctx, "k1", "v1", 0)
    c.Set(ctx, "k2", "v2", 0)
    c.Set(ctx, "k3", "v3", 0)

    keys, _ := c.Keys(ctx)
    fmt.Println(keys)

    // Output:
    // [k1 k2 k3]
}
```

## KeyStrings

**Description:** Returns all keys in the cache as a slice of strings.

**Format:**

```go
func (c *Cache) KeyStrings(ctx context.Context) ([]string, error) {
    keys, err := c.Keys(ctx)
    if err != nil {
        return nil, err
    }
    return gconv.Strings(keys), nil
}
```

**Example:**

```go
func ExampleCache_KeyStrings() {
    c := gcache.New()

    c.SetMap(ctx, g.MapAnyAny{"k1": "v1", "k2": "v2"}, 0)

    // KeyStrings returns all keys in the cache as a slice of strings.
    keys, _ := c.KeyStrings(ctx)
    fmt.Println(keys)

    // May Output:
    // [k1 k2]
}
```

## Remove

**Description:** Removes one or more keys from the cache and returns the value of the last removed key.

**Format:**

```go
Remove(ctx context.Context, keys ...interface{}) (lastValue *gvar.Var, err error)
```

**Example:**

```go
func ExampleCache_Remove() {     
    c := gcache.New()

    c.SetMap(ctx, g.MapAnyAny{"k1": "v1", "k2": "v2"}, 0)

    c.Remove(ctx, "k1")

    data, _ := c.Data(ctx)
    fmt.Println(data)

    // Output:
    // map[k2:v2]
}
```

## Removes

**Description:** Deletes multiple keys from the cache.

**Format:**

```go
func (c *Cache) Removes(ctx context.Context, keys []interface{}) error {
    _, err := c.Remove(ctx, keys...)
    return err
}
```

**Example:**

```go
func ExampleCache_Removes() {     
    c := gcache.New()

    c.SetMap(ctx, g.MapAnyAny{"k1": "v1", "k2": "v2", "k3": "v3", "k4": "v4"}, 0)

    c.Removes(ctx, g.Slice{"k1", "k2", "k3"})

    data, _ := c.Data(ctx)
    fmt.Println(data)

    // Output:
    // map[k4:v4]
}
```

## Clear

**Description:** Clears all items from the cache.

**Format:**

```go
func (c *Cache) Clear(ctx context.Context) error
```

**Example:**

```go
func ExampleCache_Clear() {
    c := gcache.New()

    c.SetMap(ctx, g.MapAnyAny{"k1": "v1", "k2": "v2", "k3": "v3", "k4": "v4"}, 0)

    c.Clear(ctx)

    data, _ := c.Data(ctx)
    fmt.Println(data)

    // Output:
    // map[]
}
```

## MustGet

**Description:** Retrieves and returns the value associated with the given key. If it does not exist, is zero, or has expired, it returns nil. Panics if `err` is not nil.

**Format:**

```go
func (c *Cache) MustGet(ctx context.Context, key interface{}) *gvar.Var {
    v, err := c.Get(ctx, key)
    if err != nil {
        panic(err)
    }
    return v
}
```

**Example:**

```go
func ExampleCache_MustGet() {         
    c := gcache.New()  
    
    c.Set(ctx, "k1", "v1", 0)
    k2 := c.MustGet(ctx, "k2")
    
    k1 := c.MustGet(ctx, "k1")
    fmt.Println(k1)

    fmt.Println(k2)

    // Output:
    // v1
    //
}
```

## MustGetOrSet

**Description:** Retrieves and returns the value for the key, or sets the key-value pair if the key does not exist in the cache. Panics if `err` is not nil.

**Format:**

```go
func (c *Cache) MustGetOrSet(ctx context.Context, key interface{}, value interface{}, duration time.Duration) *gvar.Var {
    v, err := c.GetOrSet(ctx, key, value, duration)
    if err != nil {
        panic(err)
    }
    return v
}
```

**Example:**

```go
func ExampleCache_MustGetOrSet() {

    // Create a cache object,
    // Of course, you can also easily use the gcache package method directly
    c := gcache.New()

    // MustGetOrSet acts like GetOrSet, but it panics if any error occurs.
    k1 := c.MustGetOrSet(ctx, "k1", "v1", 0)
    fmt.Println(k1)

    k2 := c.MustGetOrSet(ctx, "k1", "v2", 0)
    fmt.Println(k2)

    // Output:
    // v1
    // v1

}
```

## MustGetOrSetFunc

**Description:** Retrieves and returns the value for the key. If the key does not exist, it sets the key using the result of the function `func`. Panics if `err` is not nil.

**Format:**

```go
func (c *Cache) MustGetOrSetFunc(ctx context.Context, key interface{}, f func(ctx context.Context) (interface{}, error), duration time.Duration) *gvar.Var {
    v, err := c.GetOrSetFunc(ctx, key, f, duration)
    if err != nil {
        panic(err)
    }
    return v
}
```

**Example:**

```go
func ExampleCache_MustGetOrSetFunc() {
    c := gcache.New()

    c.MustGetOrSetFunc(ctx, 1, func(ctx context.Context) (interface{}, error) {
        return 111, nil
    }, 10000*time.Millisecond)
    v := c.MustGet(ctx, 1)
    fmt.Println(v)

    c.MustGetOrSetFunc(ctx, 2, func(ctx context.Context) (interface{}, error) {
        return nil, nil
    }, 10000*time.Millisecond)
    v1 := c.MustGet(ctx, 2)
    fmt.Println(v1)

    // Output:
    // 111
    //
}
```

## MustGetOrSetFuncLock

**Description:** Similar to `MustGetOrSetFunc`, but prevents duplicate or overwriting registrations. Panics if `err` is not nil.

**Format:**

```go
func (c *Cache) MustGetOrSetFuncLock(ctx context.Context, key interface{}, f func(ctx context.Context) (interface{}, error), duration time.Duration) *gvar.Var {
    v, err := c.GetOrSetFuncLock(ctx, key, f, duration)
    if err != nil {
        panic(err)
    }
    return v
}
```

**Example:**

```go
func ExampleCache_MustGetOrSetFuncLock() {
    c := gcache.New()

    c.MustGetOrSetFuncLock(ctx, "k1", func(ctx context.Context) (interface{}, error) {
        return "v1", nil
    }, 0)
    v := c.MustGet(ctx, "k1")
    fmt.Println(v)

    // Modification failed
    c.MustGetOrSetFuncLock(ctx, "k1", func(ctx context.Context) (interface{}, error) {
        return "update v1", nil
    }, 0)
    v = c.MustGet(ctx, "k1")
    fmt.Println(v)

    // Output:
    // v1
    // v1
}
```

## MustContains

**Description:** Returns `true` if the cache contains the specified key; otherwise returns `false`. Panics if `err` is not nil.

**Format:**

```go
func (c *Cache) MustContains(ctx context.Context, key interface{}) bool {
    v, err := c.Contains(ctx, key)
    if err != nil {
        panic(err)
    }
    return v
}
```

**Example:**

```go
func ExampleCache_MustContains() {
    c := gcache.New()

    // Set Cache
    c.Set(ctx, "k", "v", 0)

    // Contains returns true if `key` exists in the cache, or else returns false.
    // return true
    data := c.MustContains(ctx, "k")
    fmt.Println(data)

    // return false
    data1 := c.MustContains(ctx, "k1")
    fmt.Println(data1)

    // Output:
    // true
    // false

}
```

## MustGetExpire

**Description:** Retrieves and returns the expiration time of a key in the cache. Returns `0` if the key never expires and `-1` if the key does not exist. Panics if `err` is not nil.

**Format:**

```go
func (c *Cache) MustGetExpire(ctx context.Context, key interface{}) time.Duration {
    v, err := c.GetExpire(ctx, key)
    if err != nil {
        panic(err)
    }
    return v
}
```

**Example:**

```go
func ExampleCache_MustGetExpire() {
    c := gcache.New()

    // Set cache without expiration
    c.Set(ctx, "k", "v", 10000*time.Millisecond)

    // MustGetExpire acts like GetExpire, but it panics if any error occurs.
    expire := c.MustGetExpire(ctx, "k")
    fmt.Println(expire)

    // May Output:


    // 10s
}
```

## MustSize

**Description:** Returns the number of items in the cache. Panics if `err` is not nil.

**Format:**

```go
func (c *Cache) MustSize(ctx context.Context) int {
    v, err := c.Size(ctx)
    if err != nil {
        panic(err)
    }
    return v
}
```

**Example:**

```go
func ExampleCache_MustSize() {
    c := gcache.New()

    // Add 10 elements without expiration
    for i := 0; i < 10; i++ {
        c.Set(ctx, i, i, 0)
    }

    // Size returns the number of items in the cache.
    n := c.MustSize(ctx)
    fmt.Println(n)

    // Output:
    // 10
}
```

## MustData

**Description:** Returns a copy of all key-value pairs in the cache as a map. Panics if `err` is not nil.

**Format:**

```go
func (c *Cache) MustData(ctx context.Context) map[interface{}]interface{} {
    v, err := c.Data(ctx)
    if err != nil {
        panic(err)
    }
    return v
}
```

**Example:**

```go
func ExampleCache_MustData() {
    c := gcache.New()

    c.SetMap(ctx, g.MapAnyAny{"k1": "v1"}, 0)

    data := c.MustData(ctx)
    fmt.Println(data)

    // Set Cache
    c.Set(ctx, "k5", "v5", 0)
    data1, _ := c.Get(ctx, "k1")
    fmt.Println(data1)

    // Output:
    // map[k1:v1]
    // v1
}
```

## MustKeys

**Description:** Returns all keys in the cache as a slice. Panics if `err` is not nil.

**Format:**

```go
func (c *Cache) MustKeys(ctx context.Context) []interface{} {
    v, err := c.Keys(ctx)
    if err != nil {
        panic(err)
    }
    return v
}
```

**Example:**

```go
func ExampleCache_MustKeys() {
    c := gcache.New()

    c.SetMap(ctx, g.MapAnyAny{"k1": "v1", "k2": "v2"}, 0)

    // MustKeys acts like Keys, but it panics if any error occurs.
    keys1 := c.MustKeys(ctx)
    fmt.Println(keys1)

    // May Output:
    // [k1 k2]

}
```

## MustKeyStrings

**Description:** Returns all keys in the cache as a slice of strings. Panics if `err` is not nil.

**Format:**

```go
func (c *Cache) MustKeyStrings(ctx context.Context) []string {
    v, err := c.KeyStrings(ctx)
    if err != nil {
        panic(err)
    }
    return v
}
```

**Example:**

```go
func ExampleCache_MustKeyStrings() {
    c := gcache.New()

    c.SetMap(ctx, g.MapAnyAny{"k1": "v1", "k2": "v2"}, 0)

    // MustKeyStrings returns all keys in the cache as a slice of strings.
    // MustKeyStrings acts like KeyStrings, but it panics if any error occurs.
    keys := c.MustKeyStrings(ctx)
    fmt.Println(keys)

    // May Output:
    // [k1 k2]
}
```

## MustValues

**Description:** Returns all values in the cache as a slice. Panics if `err` is not nil.

**Format:**

```go
func (c *Cache) MustValues(ctx context.Context) []interface{} {
    v, err := c.Values(ctx)
    if err != nil {
        panic(err)
    }
    return v
}
```

**Example:**

```go
func ExampleCache_MustValues() {
    c := gcache.New()

    // Write value
    c.Set(ctx, "k1", "v1", 0)

    // Values returns all values in the cache as a slice.
    data := c.MustValues(ctx)
    fmt.Println(data)

    // Output:
    // [v1]
}
```
