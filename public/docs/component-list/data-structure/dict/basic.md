# Dictionary Type - Basic Usage

## Concurrency Safety

The `gmap` module supports a concurrency-safe option switch. By default, it is `not concurrency-safe`, but developers can enable this feature by passing the `safe` parameter as `true` during initialization. This must be set at the time of initialization and cannot be changed dynamically during runtime. For example:

```go
m := gmap.New(true)
```

This concurrency-safe feature switch is supported not only in the `gmap` module but also in other concurrent-safe data structures of the `GoFrame` framework.

## Usage Examples

### Basic Usage

```go
package main

import (
    "fmt"
    "github.com/gogf/gf/v2/container/gmap"
)

func main() {
    // Create a default gmap object,
    // By default, this gmap object does not support concurrency safety.
    // You can enable concurrency safety by passing `true` during initialization.
    m := gmap.New()

    // Set key-value pairs
    for i := 0; i < 10; i++ {
        m.Set(i, i)
    }

    // Get the size of the map
    fmt.Println(m.Size())

    // Set multiple key-value pairs
    m.Sets(map[interface{}]interface{}{
        10: 10,
        11: 11,
    })
    fmt.Println(m.Size())

    // Check if a key exists
    fmt.Println(m.Contains(1))

    // Get a value by key
    fmt.Println(m.Get(1))

    // Remove a key-value pair
    m.Remove(9)
    fmt.Println(m.Size())

    // Remove multiple keys
    m.Removes([]interface{}{10, 11})
    fmt.Println(m.Size())

    // Get the list of keys (random order)
    fmt.Println(m.Keys())

    // Get the list of values (random order)
    fmt.Println(m.Values())

    // Get a value by key, set a default value if the key does not exist
    fmt.Println(m.GetOrSet(100, 100))

    // Remove a key-value pair and return the value
    fmt.Println(m.Remove(100))

    // Iterate through the map
    m.Iterator(func(k interface{}, v interface{}) bool {
        fmt.Printf("%v:%v ", k, v)
        return true
    })

    // Custom write lock operation
    m.LockFunc(func(m map[interface{}]interface{}) {
        m[99] = 99
    })

    // Custom read lock operation
    m.RLockFunc(func(m map[interface{}]interface{}) {
        fmt.Println(m[99])
    })

    // Clear the map
    m.Clear()

    // Check if the map is empty
    fmt.Println(m.IsEmpty())
}
```

***Output***

```bash
10
12
true
1
11
9
[0 1 2 4 6 7 3 5 8]
[3 5 8 0 1 2 4 6 7]
100
100
3:3 5:5 8:8 7:7 0:0 1:1 2:2 4:4 6:6 99
true
```

## Ordered Traversal

Below are examples of ordered traversal for three different types of `map`:

```go
package main

import (
    "fmt"
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/container/gmap"
    "github.com/gogf/gf/v2/util/gutil"
)

func main() {
    array   := g.Slice{2, 3, 1, 5, 4, 6, 8, 7, 9}
    hashMap := gmap.New(true)
    listMap := gmap.NewListMap(true)
    treeMap := gmap.NewTreeMap(gutil.ComparatorInt, true)
    
    for _, v := range array {
        hashMap.Set(v, v)
    }
    for _, v := range array {
        listMap.Set(v, v)
    }
    for _, v := range array {
        treeMap.Set(v, v)
    }
    
    fmt.Println("HashMap Keys:", hashMap.Keys())
    fmt.Println("HashMap Values:", hashMap.Values())
    fmt.Println("ListMap Keys:", listMap.Keys())
    fmt.Println("ListMap Values:", listMap.Values())
    fmt.Println("TreeMap Keys:", treeMap.Keys())
    fmt.Println("TreeMap Values:", treeMap.Values())
}
```

***Output***

```bash
HashMap Keys: [4 6 8 7 9 2 3 1 5]
HashMap Values: [6 8 4 3 1 5 7 9 2]
ListMap Keys: [2 3 1 5 4 6 8 7 9]
ListMap Values: [2 3 1 5 4 6 8 7 9]
TreeMap Keys: [1 2 3 4 5 6 7 8 9]
TreeMap Values: [1 2 3 4 5 6 7 8 9]
```

## FilterEmpty and FilterNil

The `FilterEmpty` and `FilterNil` functions filter out empty or nil values in a map.

```go
package main

import (
    "fmt"
    "github.com/gogf/gf/v2/container/gmap"
    "github.com/gogf/gf/v2/frame/g"
)

func main() {
    m1 := gmap.NewFrom(g.MapAnyAny{
        "k1": "",
        "k2": nil,
        "k3": 0,
        "k4": 1,
    })
    m2 := gmap.NewFrom(g.MapAnyAny{
        "k1": "",
        "k2": nil,
        "k3": 0,
        "k4": 1,
    })
    m1.FilterEmpty()
    m2.FilterNil()
    fmt.Println(m1.Map())
    fmt.Println(m2.Map())
}
```

***Output***

```bash
map[k4:1]
map[k1: k3:0 k4:1]
```

## Flip KeyValue Pairs

```go
package main

import (
    "fmt"
    "github.com/gogf/gf/v2/container/gmap"
    "github.com/gogf/gf/v2/frame/g"
)

func main() {
    var m gmap.Map
    m.Sets(g.MapAnyAny{
        "k1": "v1",
        "k2": "v2",
    })
    m.Flip()
    fmt.Println(m.Map())
}
```

***Output***

```bash
map[v1:k1 v2:k2]
```

## Keys Values

```go
package main

import (
    "fmt"
    "github.com/gogf/gf/v2/container/gmap"
    "github.com/gogf/gf/v2/frame/g"
)

func main() {
    var m gmap.Map
    m.Sets(g.MapAnyAny{
        "k1": "v1",
        "k2": "v2",
        "k3": "v3",
        "k4": "v4",
    })
    fmt.Println(m.Keys())
    fmt.Println(m.Values())
}
```

***Output***

```bash
[k1 k2 k3 k4]
[v2 v3 v4 v1]
```
