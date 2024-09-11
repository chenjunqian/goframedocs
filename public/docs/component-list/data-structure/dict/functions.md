# Dictionary Type - Functions

The following is a list of commonly used functions. The documentation may lag behind new features in the code. For more functions and examples, please refer to the code documentation: [pkg.go.dev](https://pkg.go.dev/github.com/gogf/gf/v2/container/gmap).

## New

Description: `New` creates and returns an empty `AnyAnyMap`. The parameter `safe` specifies whether to use a concurrent-safe map. By default, it is `false`.

Format:

```go
New(safe ...bool) *Map
```

Example:

```go
func ExampleNew() {
    m := gmap.New()

    // Add data.
    m.Set("key1", "val1")

    // Print size.
    fmt.Println(m.Size())

    addMap := make(map[interface{}]interface{})
    addMap["key2"] = "val2"
    addMap["key3"] = "val3"
    addMap[1] = 1

    fmt.Println(m.Values())

    // Batch add data.
    m.Sets(addMap)

    // Gets the value of the corresponding key.
    fmt.Println(m.Get("key3"))

    // Get the value by key, or set it with given key-value if not exist.
    fmt.Println(m.GetOrSet("key4", "val4"))

    // Set key-value if the key does not exist, then return true; or else return false.
    fmt.Println(m.SetIfNotExist("key3", "val3"))

    // Remove key.
    m.Remove("key2")
    fmt.Println(m.Keys())

    // Batch remove keys.
    m.Removes([]interface{}{"key1", 1})
    fmt.Println(m.Keys())

    // Contains checks whether a key exists.
    fmt.Println(m.Contains("key3"))

    // Flip exchanges key-value of the map, changing key-value to value-key.
    m.Flip()
    fmt.Println(m.Map())

    // Clear deletes all data of the map.
    m.Clear()

    fmt.Println(m.Size())

    // Output:
    // 1
    // [val1]
    // val3
    // val4
    // false
    // [key4 key1 key3 1]
    // [key4 key3]
    // true
    // map[val3:key3 val4:key4]
    // 0
}
```

## NewFrom

Description: `NewFrom` creates and returns an `AnyAnyMap` using the given map data.

Note: The input map will be set as the underlying data mapping (without deep copying), so some safety issues may arise if the map is changed externally. The optional parameter `safe` specifies whether to use this structure in a concurrent-safe manner. By default, it is `false`.

Format:

```go
NewFrom(data map[interface{}]interface{}, safe ...bool) *Map
```

Example:

```go
func ExampleNewFrom() {
    m := gmap.New()

    m.Set("key1", "val1")
    fmt.Println(m)

    n := gmap.NewFrom(m.MapCopy(), true)
    fmt.Println(n)

    // Output:
    // {"key1":"val1"}
    // {"key1":"val1"}
}
```

## Iterator

Description: `Iterator` iterates through the hashmap in a read-only manner using the custom callback function `f`. If `f` returns `true`, iteration continues; if `false`, it stops.

Format:

```go
Iterator(f func(k interface{}, v interface{}) bool)
```

Example:

```go
func ExampleAnyAnyMap_Iterator() {
    m := gmap.New()
    for i := 0; i < 10; i++ {
        m.Set(i, i*2)
    }

    var totalKey, totalValue int
    m.Iterator(func(k interface{}, v interface{}) bool {
        totalKey += k.(int)
        totalValue += v.(int)

        return totalKey < 10
    })

    fmt.Println("totalKey:", totalKey)
    fmt.Println("totalValue:", totalValue)

    // Output:
    // totalKey: 11
    // totalValue: 22
}
```

## Clone

Description: `Clone` returns a new `AnyAnyMap` containing a copy of the current map data.

Format:

```go
Clone(safe ...bool) *AnyAnyMap
```

Example:

```go
func ExampleAnyAnyMap_Clone() {
    m := gmap.New()

    m.Set("key1", "val1")
    fmt.Println(m)

    n := m.Clone()
    fmt.Println(n)

    // Output:
    // {"key1":"val1"}
    // {"key1":"val1"}
}
```

## Map

Description: `Map` returns the underlying data map.

Note: If in concurrent safety mode, it will return a copy of the underlying data; otherwise, it returns a pointer to the underlying data.

Format:

```go
Map() map[interface{}]interface{}
```

Example:

```go
func ExampleAnyAnyMap_Map() {
    // Non-concurrent-safety, a pointer to the underlying data.
    m1 := gmap.New()
    m1.Set("key1", "val1")
    fmt.Println("m1:", m1)

    n1 := m1.Map()
    fmt.Println("before n1:", n1)
    m1.Set("key1", "val2")
    fmt.Println("after n1:", n1)

    // Concurrent-safety, copy of underlying data.
    m2 := gmap.New(true)
    m2.Set("key1", "val1")
    fmt.Println("m1:", m2)

    n2 := m2.Map()
    fmt.Println("before n2:", n2)
    m2.Set("key1", "val2")
    fmt.Println("after n2:", n2)

    // Output:
    // m1: {"key1":"val1"}
    // before n1: map[key1:val1]
    // after n1: map[key1:val2]
    // m1: {"key1":"val1"}
    // before n2: map[key1:val1]
    // after n2: map[key1:val1]
}
```

## MapCopy

Description: `MapCopy` returns a copy of the map data.

Format:

```go
MapCopy() map[interface{}]interface{}
```

Example:

```go
func ExampleAnyAnyMap_MapCopy() {
    m := gmap.New()

    m.Set("key1", "val1")
    m.Set("key2", "val2")
    fmt.Println(m)

    n := m.MapCopy()
    fmt.Println(n)

    // Output:
    // {"key1":"val1","key2":"val2"}
    // map[key1:val1 key2:val2]
}
```

## MapStrAny

Description: `MapStrAny` returns a copy of the map data in the form of `map[string]interface{}`.

Format:

```go
MapStrAny() map[string]interface{}
```

Example:

```go
func ExampleAnyAnyMap_MapStrAny() {
    m := gmap.New()
    m.Set(1001, "val1")
    m.Set(1002, "val2")

    n := m.MapStrAny()
    fmt.Println(n)

    // Output:
    // map[1001:val1 1002:val2]
}
```

## FilterEmpty

Description: `FilterEmpty` deletes all key-value pairs with empty values. Values such as `0`, `nil`, `false`, `""`, and `len(slice/map/chan) == 0` are considered empty.

Format:

```go
FilterEmpty()
```

Example:

```go
func ExampleAnyAnyMap_FilterEmpty() {
    m := gmap.NewFrom(g.MapAnyAny{
        "k1": "",
        "k2": nil,
        "k3": 0,
        "k4": 1,
    })
    m.FilterEmpty()
    fmt.Println(m.Map())

    // Output:
    // map[k4:1]
}
```

## FilterNil

Description: `FilterNil` deletes all key-value pairs with `nil` values.

Format:

```go
FilterNil()
```

Example:

```go
func ExampleAnyAnyMap_FilterNil() {
    m := gmap.NewFrom(g.MapAnyAny{
        "k1": "",
        "k2": nil,
        "k3": 0,
        "k4": 1,
    })
    m.FilterNil()
    fmt.Println(m.Map())

    // Output:
    // map[k1: k3:0 k4:1]
}
```

## Set

Description: `Set` sets a key/value for the map.

Format:

```go
Set(key interface{}, value interface{})
```

Example:

```go
func ExampleAnyAnyMap_Set() {
    m := gmap.New()

    m.Set("key1", "val1")
    fmt.Println(m)

    // Output:
    // {"key1":"val1"}
}
```

## Sets

Description: `Sets` sets multiple key/value pairs for the map.

Format:

```go
Sets(data map[interface{}]interface{})
```

Example:

```go
func ExampleAnyAnyMap_Sets() {
    m := gmap.New()

    addMap := make(map[interface{}]interface{})
    addMap["key1"] = "val1"
    addMap["key2"] = "val2"
    addMap["key3"] = "val3"

    m.Sets(addMap)
    fmt.Println(m)

    // Output:
    // {"key1":"val1","key2":"val2","key3":"val3"}
}
```

## Search

Description: `Search` searches for a key in the map. If the key is found, it returns the corresponding value and `found`

 as `true`; otherwise, it returns `nil` and `false`.

Format:

```go
Search(key interface{}) (value interface{}, found bool)
```

Example:

```go
func ExampleAnyAnyMap_Search() {
    m := gmap.New()

    m.Set("key1", "val1")
    fmt.Println(m.Search("key1"))
    fmt.Println(m.Search("key2"))

    // Output:
    // val1 true
    // <nil> false
}
```

## Get

Description: `Get` retrieves the value associated with the given key.

Format:

```go
Get(key interface{}) (value interface{})
```

Example:

```go
func ExampleAnyAnyMap_Get() {
    m := gmap.New()

    m.Set("key1", "val1")
    fmt.Println(m.Get("key1"))
    fmt.Println(m.Get("key2"))

    // Output:
    // val1
    // <nil>
}
```

## Pop

Description: The `Pop` method randomly removes and returns a key-value pair from the map.

Format:

```go
Pop() (key, value interface{})
```

Example:

```go
func ExampleAnyAnyMap_Pop() {
    var m gmap.Map
    m.Sets(g.MapAnyAny{
        "k1": "v1",
        "k2": "v2",
        "k3": "v3",
        "k4": "v4",
    })

    fmt.Println(m.Pop())

    // May Output:
    // k1 v1
}
```

## Pops

Description: The `Pops` method randomly removes and returns `size` number of key-value pairs from the map. If `size == -1`, it removes and returns all key-value pairs.

Format:

```go
Pops(size int) map[interface{}]interface{}
```

Example:

```go
func ExampleAnyAnyMap_Pops() {
    var m gmap.Map
    m.Sets(g.MapAnyAny{
        "k1": "v1",
        "k2": "v2",
        "k3": "v3",
        "k4": "v4",
    })
    fmt.Println(m.Pops(-1))
    fmt.Println("size:", m.Size())

    m.Sets(g.MapAnyAny{
        "k1": "v1",
        "k2": "v2",
        "k3": "v3",
        "k4": "v4",
    })
    fmt.Println(m.Pops(2))
    fmt.Println("size:", m.Size())

    // May Output:
    // map[k1:v1 k2:v2 k3:v3 k4:v4]
    // size: 0
    // map[k1:v1 k2:v2]
    // size: 2
}
```

## GetOrSet

Description: The `GetOrSet` method returns the value if the key exists. If the key does not exist, it sets the key with the specified value and then returns the value.

Format:

```go
GetOrSet(key interface{}, value interface{}) interface{}
```

Example:

```go
func ExampleAnyAnyMap_GetOrSet() {
    m := gmap.New()
    m.Set("key1", "val1")

    fmt.Println(m.GetOrSet("key1", "NotExistValue"))
    fmt.Println(m.GetOrSet("key2", "val2"))

    // Output:
    // val1
    // val2
}
```

## GetOrSetFunc

Description: The `GetOrSetFunc` method returns the value if the key exists. If the key does not exist, it sets the key with the value returned by the function `f` and then returns the value.

Format:

```go
GetOrSetFunc(key interface{}, f func() interface{}) interface{}
```

Example:

```go
func ExampleAnyAnyMap_GetOrSetFunc() {
    m := gmap.New()
    m.Set("key1", "val1")

    fmt.Println(m.GetOrSetFunc("key1", func() interface{} {
        return "NotExistValue"
    }))
    fmt.Println(m.GetOrSetFunc("key2", func() interface{} {
        return "NotExistValue"
    }))

    // Output:
    // val1
    // NotExistValue
}
```

## GetOrSetFuncLock

Description: The `GetOrSetFuncLock` method returns the value if the key exists. If the key does not exist, it sets the key with the value returned by the function `f` and then returns the value.

**Note**: The difference between `GetOrSetFuncLock` and `GetOrSetFunc` is that `GetOrSetFuncLock` executes the function `f` with a write lock.

Format:

```go
GetOrSetFuncLock(key interface{}, f func() interface{}) interface{}
```

Example:

```go
func ExampleAnyAnyMap_GetOrSetFuncLock() {
    m := gmap.New()
    m.Set("key1", "val1")

    fmt.Println(m.GetOrSetFuncLock("key1", func() interface{} {
        return "NotExistValue"
    }))
    fmt.Println(m.GetOrSetFuncLock("key2", func() interface{} {
        return "NotExistValue"
    }))

    // Output:
    // val1
    // NotExistValue
}
```

## Remove

**Description**: Removes the value from the map associated with the given key and returns the removed value.

**Signature**:

```go
Remove(key interface{}) (value interface{})
```

**Example**:

```go
func ExampleAnyAnyMap_Remove() {
    var m gmap.Map
    m.Set("k1", "v1")

    fmt.Println(m.Remove("k1"))
    fmt.Println(m.Remove("k2"))

    // Output:
    // v1
    // <nil>
}
```

## Removes

**Description**: Removes multiple values from the map based on the provided list of keys.

**Signature**:

```go
Removes(keys []interface{})
```

**Example**:

```go
func ExampleAnyAnyMap_Removes() {
    var m gmap.Map
    m.Sets(g.MapAnyAny{
        "k1": "v1",
        "k2": "v2",
        "k3": "v3",
        "k4": "v4",
    })

    removeList := make([]interface{}, 2)
    removeList = append(removeList, "k1")
    removeList = append(removeList, "k2")

    m.Removes(removeList)

    fmt.Println(m.Map())

    // Output:
    // map[k3:v3 k4:v4]
}
```

## Keys

**Description**: Returns all keys in the map as a slice.

**Signature**:

```go
Keys() []interface{}
```

**Example**:

```go
func ExampleAnyAnyMap_Keys() {
    var m gmap.Map
    m.Sets(g.MapAnyAny{
        "k1": "v1",
        "k2": "v2",
        "k3": "v3",
        "k4": "v4",
    })
    fmt.Println(m.Keys())

    // Output:
    // [k1 k2 k3 k4]
}
```

## Values

**Description**: Returns all values in the map as a slice.

**Signature**:

```go
Values() []interface{}
```

**Example**:

```go
func ExampleAnyAnyMap_Values() {
    var m gmap.Map
    m.Sets(g.MapAnyAny{
        "k1": "v1",
        "k2": "v2",
        "k3": "v3",
        "k4": "v4",
    })
    fmt.Println(m.Values())

    // May Output:
    // [v1 v2 v3 v4]
}
```

## Contains

**Description**: Checks if the key exists in the map. Returns `true` if the key exists, otherwise `false`.

**Note**: The key type is `interface{}`, so the match check needs to ensure both type and value are consistent.

**Signature**:

```go
Contains(key interface{}) bool
```

**Example**:

```go
func ExampleAnyAnyMap_Contains() {
    var m gmap.Map
    m.Sets(g.MapAnyAny{
        "k1": "v1",
        "k2": "v2",
        "k3": "v3",
        "k4": "v4",
    })
    fmt.Println(m.Contains("k1"))
    fmt.Println(m.Contains("k5"))

    // Output:
    // true
    // false
}
```

## Size

**Description**: Returns the size of the map.

**Signature**:

```go
Size() int
```

**Example**:

```go
func ExampleAnyAnyMap_Size() {
    var m gmap.Map
    m.Sets(g.MapAnyAny{
        "k1": "v1",
        "k2": "v2",
        "k3": "v3",
        "k4": "v4",
    })

    fmt.Println(m.Size())

    // Output:
    // 4
}
```

## IsEmpty

**Description**: Checks if the map is empty. Returns `true` if empty, otherwise `false`.

**Signature**:

```go
IsEmpty() bool
```

**Example**:

```go
func ExampleAnyAnyMap_IsEmpty() {
    var m gmap.Map
    fmt.Println(m.IsEmpty())

    m.Set("k1", "v1")
    fmt.Println(m.IsEmpty())

    // Output:
    // true
    // false
}
```

## Clear

**Description**: Clears all data in the map.

**Signature**:

```go
Clear()
```

**Example**:

```go
func ExampleAnyAnyMap_Clear() {
    var m gmap.Map
    m.Sets(g.MapAnyAny{
        "k1": "v1",
        "k2": "v2",
        "k3": "v3",
        "k4": "v4",
    })

    m.Clear()

    fmt.Println(m.Map())

    // Output:
    // map[]
}
```

## Replace

**Description**: Replaces the map's values with the given data.

**Signature**:

```go
Replace(data map[interface{}]interface{})
```

**Example**:

```go
func ExampleAnyAnyMap_Replace() {
    var m gmap.Map
    m.Sets(g.MapAnyAny{
        "k1": "v1",
    })

    var n gmap.Map
    n.Sets(g.MapAnyAny{
        "k2": "v2",
    })

    fmt.Println(m.Map())

    m.Replace(n.Map())
    fmt.Println(m.Map())

    n.Set("k2", "v1")
    fmt.Println(m.Map())

    // Output:
    // map[k1:v1]
    // map[k2:v2]
    // map[k2:v1]
}
```

## LockFunc

**Description**: Executes function `f` within a write lock.

**Signature**:

```go
LockFunc(f func(m map[interface{}]interface{}))
```

**Example**:

```go
func ExampleAnyAnyMap_LockFunc() {
    var m gmap.Map
    m.Sets(g.MapAnyAny{
        "k1": 1,
        "k2": 2,
        "k3": 3,
        "k4": 4,
    })

    m.LockFunc(func(m map[interface{}]interface{}) {
        totalValue := 0
        for _, v := range m {
            totalValue += v.(int)
        }
        fmt.Println("totalValue:", totalValue)
    })

    // Output:
    // totalValue: 10
}
```

## RLockFunc

**Description**: Executes function `f` within a read lock.

**Signature**:

```go
RLockFunc(f func(m map[interface{}]interface{}))
```

**Example**:

```go
func ExampleAnyAnyMap_RLockFunc() {
    var m gmap.Map
    m.Sets(g.MapAnyAny{
        "k1": 1,
        "k2": 2,
        "k3": 3,
        "k4": 4,
    })

    m.RLockFunc(func(m map[interface{}]interface{}) {
        totalValue := 0
        for _, v := range m {
            totalValue += v.(int)
        }
        fmt.Println("totalValue:", totalValue)
    })

    // Output:
    // totalValue: 10
}
```

## Flip

**Description**: Flips the keys and values of the map.

**Signature**:

```go
Flip()
```

**Example**:

```go
func ExampleAnyAnyMap_Flip() {
    var m gmap.Map
    m.Sets(g.MapAnyAny{
        "k1": "v1",
    })
    m.Flip()
    fmt.Println(m.Map())

    // Output:
    // map[v1:k1]
}
```

## Merge

**Description**: Merges two `AnyAnyMap`. The input map is merged into the original map.

**Signature**:

```go
Merge(other *AnyAnyMap)
```

**Example**:

```go
func ExampleAnyAnyMap_Merge() {
    var m1, m2 gmap.Map
    m1.Set("key1", "val1")
    m2.Set("key2", "val2")
    m1.Merge(&m2)
    fmt.Println(m1.Map())

    // May Output:
    // map[key1:val1 key2:val2]
}
```

## String

**Description**: Returns the map as a string.

**Signature**:

```go
String() string
```

**Example**:

```go
func ExampleAnyAnyMap_String() {
    var m gmap.Map
    m.Sets(g.MapAnyAny{
        "k1": "v1",
    })

    fmt.Println(m.String())

    // Output:
    // {"k1":"v1"}
}
```

## MarshalJSON

**Description**: Implements the `json.Marshal` interface.

**Signature**:

```go
MarshalJSON() ([]byte, error)
```

**Example**:

```go
func ExampleAnyAnyMap_MarshalJSON() {
    var m gmap.Map
    m.Sets(g.MapAnyAny{
        "k1": "v1",
        "k2": "v2",
        "k3": "v3",
        "k4": "v4",
    })

    bytes, err := m.MarshalJSON()
    if err == nil {
        fmt.Println(gconv.String(bytes))
    }

    // Output:
    // {"k1":"v1","k2":"v2","k3":"v3","k4":"v4"}
}
```

## UnmarshalJSON

Description**: Implements the `json.Unmarshal` interface.

**Signature**:

```go
UnmarshalJSON(b []byte) error
```

**Example**:

```go
func ExampleAnyAnyMap_UnmarshalJSON() {
    var m gmap.Map
    m.Sets(g.MapAnyAny{
        "k1": "v1",
        "k2": "v2",
        "k3": "v3",
        "k4": "v4",
    })

    var n gmap.Map

    err := n.UnmarshalJSON(gconv.Bytes(m.String()))
    if err == nil {
        fmt.Println(n.Map())
    }

    // Output:
    // map[k1:v1 k2:v2 k3:v3 k4:v4]
}
```

## UnmarshalValue

**Description**: Implements an interface to initialize the current map with an arbitrary type of variable.

**Signature**:

```go
UnmarshalValue(value interface{}) (err error)
```

**Example**:

```go
func ExampleAnyAnyMap_UnmarshalValue() {
    var m gmap.Map
    m.Sets(g.MapAnyAny{
        "k1": "v1",
        "k2": "v2",
        "k3": "v3",
        "k4": "v4",
    })

    var n gmap.Map
    err := n.UnmarshalValue(m.String())
    if err == nil {
        fmt.Println(n.Map())
    }
    // Output:
    // map[k1:v1 k2:v2 k3:v3 k4:v4]
}
```
