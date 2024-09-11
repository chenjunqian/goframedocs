# Set Type - Basic Usage

## Basic Usage

```go
package main

import (
    "github.com/gogf/gf/v2/container/gset"
    "fmt"
)

func main() {
    // Create a concurrency-safe set object
    s := gset.New(true)

    // Add a single item
    s.Add(1)

    // Add multiple items
    s.Add([]interface{}{1, 2, 3}...)

    // Size of the set
    fmt.Println(s.Size())

    // Check if an item exists in the set
    fmt.Println(s.Contains(2))

    // Return items as a slice
    fmt.Println(s.Slice())

    // Remove an item
    s.Remove(3)

    // Iterate over items
    s.Iterator(func(v interface{}) bool {
    fmt.Println("Iterator:", v)
    return true
    })

    // Convert set to string
    fmt.Println(s.String())

    // Concurrency-safe write lock operation
    s.LockFunc(func(m map[interface{}]struct{}) {
    m[4] = struct{}{}
    })

    // Concurrency-safe read lock operation
    s.RLockFunc(func(m map[interface{}]struct{}) {
    fmt.Println(m)
    })

    // Clear the set
    s.Clear()
    fmt.Println(s.Size())
}
```

**Output:**

```bash
3
true
[1 2 3]
Iterator: 1
Iterator: 2
[1 2]
map[1:{} 2:{} 4:{}]
0
```

## Intersection Difference Union and Complement

We can use the following methods to perform intersection, difference, union, and complement operations, returning a new result set:

```go
func (set *Set) Intersect(others ...*Set) (newSet *Set)
func (set *Set) Diff(others ...*Set) (newSet *Set)
func (set *Set) Union(others ...*Set) (newSet *Set)
func (set *Set) Complement(full *Set) (newSet *Set)
```

- **Intersect**: Returns a set of elements that are in `set` and in `others`.
- **Diff**: Returns a set of elements that are in `set` but not in `others`.
- **Union**: Returns a set of elements that are in `set` or in `others`.
- **Complement**: Returns a set of elements that are in the universal set `full` but not in `set`. If `full` is not the universal set for `set`, it returns the difference between `full` and `set`.

The set methods support multiple sets as parameters. Below is a simplified example with only one parameter set.

```go
package main

import (
    "fmt"
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/container/gset"
)

func main() {
    s1 := gset.NewFrom(g.Slice{1, 2, 3})
    s2 := gset.NewFrom(g.Slice{4, 5, 6})
    s3 := gset.NewFrom(g.Slice{1, 2, 3, 4, 5, 6, 7})

    // Intersection
    fmt.Println(s3.Intersect(s1).Slice())
    // Difference
    fmt.Println(s3.Diff(s1).Slice())
    // Union
    fmt.Println(s1.Union(s2).Slice())
    // Complement
    fmt.Println(s1.Complement(s3).Slice())
}
```

**Output:**

```bash
[1 2 3]
[4 5 6 7]
[1 2 3 4 5 6]
[7 4 5 6]
```

## Contains and ContainsI

```go
package main

import (
    "fmt"
    "github.com/gogf/gf/v2/container/gset"
)

func main() {
    var set gset.StrSet
    set.Add("a")
    fmt.Println(set.Contains("a"))
    fmt.Println(set.Contains("A"))
    fmt.Println(set.ContainsI("A"))

    // Output:
    // true
    // false
    // true
}
```

## Pop and Pops

```go
package main

import (
    "fmt"
    "github.com/gogf/gf/v2/container/gset"
)

func main() {
    var set gset.Set
    set.Add(1, 2, 3, 4)
    fmt.Println(set.Pop())
    fmt.Println(set.Pops(2))
    fmt.Println(set.Size())

    // May Output:
    // 1
    // [2 3]
    // 1
}
```

## Join

```go
package main

import (
    "fmt"
    "github.com/gogf/gf/v2/container/gset"
)

func main() {
    var set gset.Set
    set.Add("a", "b", "c", "d")
    fmt.Println(set.Join(","))

    // May Output:
    // a,b,c,d
}
```

## IsSubsetOf

```go
package main

import (
    "fmt"
    "github.com/gogf/gf/v2/container/gset"
    "github.com/gogf/gf/v2/frame/g"
)

func main() {
    var s1, s2 gset.Set
    s1.Add(g.Slice{1, 2, 3}...)
    s2.Add(g.Slice{2, 3}...)
    fmt.Println(s1.IsSubsetOf(&s2))
    fmt.Println(s2.IsSubsetOf(&s1))

    // Output:
    // false
    // true
}
```

## AddIfNotExist

Conditional adding means that if the specified item does not exist, it will be added, and the method will return `true`; otherwise, it will ignore the addition and return `false`. Relevant methods include:

- `AddIfNotExist`
- `AddIfNotExistFunc`
- `AddIfNotExistFuncLock`

For detailed descriptions, refer to the API documentation or source code comments.

```go
package main

import (
    "fmt"
    "github.com/gogf/gf/v2/container/gset"
)

func main() {
    var set gset.Set
    fmt.Println(set.AddIfNotExist(1))
    fmt.Println(set.AddIfNotExist(1))
    fmt.Println(set.Slice())

    // Output:
    // true
    // false
    // [1]
}
```

## Walk

```go
package main

import (
    "fmt"
    "github.com/gogf/gf/v2/container/gset"
    "github.com/gogf/gf/v2/frame/g"
)

func main() {
    var (
        set    gset.StrSet
        names  = g.SliceStr{"user", "user_detail"}
        prefix = "gf_"
    )
    set.Add(names...)
    // Add prefix for given table names.
    set.Walk(func(item string) string {
        return prefix + item
    })
    fmt.Println(set.Slice())

    // May Output:
    // [gf_user gf_user_detail]
}
```

## JSON Serialization and Deserialization

All container types under the `gset` module implement JSON serialization/deserialization interfaces.

***Marshal***

```go
package main

import (
    "encoding/json"
    "fmt"
    "github.com/gogf/gf/v2/container/gset"
)

func main() {
    type Student struct {
        Id     int
        Name   string
        Scores *gset.IntSet
    }
    s := Student{
        Id:     1,
        Name:   "john",
        Scores: gset.NewIntSetFrom([]int{100, 99, 98}),
    }
    b, _ := json.Marshal(s)
    fmt.Println(string(b))
}
```

**Output:**

```bash
{"Id":1,"Name":"john","Scores":[100,99,98]}
```

***Unmarshal***

```go
package main

import (
    "encoding/json"
    "fmt"
    "github.com/gogf/gf/v2/container/gset"
)

func main() {
    b := []byte(`{"Id":1,"Name":"john","Scores":[100,99,98]}`)
    type Student struct {
        Id     int
        Name   string
        Scores *gset.IntSet
    }
    s := Student{}
    json.Unmarshal(b, &s)
    fmt.Println(s)
}
```

**Output:**

```basg
{1 john [100,99,98]}
```
