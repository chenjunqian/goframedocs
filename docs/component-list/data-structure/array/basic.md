# Array Type - Basic Usage

## Regular Array

```go
package main

import (
    "fmt"
    "github.com/gogf/gf/v2/container/garray"
)

func main() {
    // Create a concurrent-safe array of int type
    a := garray.NewIntArray(true)

    // Add elements to the array
    for i := 0; i < 10; i++ {
        a.Append(i)
    }

    // Get the current length of the array
    fmt.Println(a.Len())

    // Get the current list of array elements
    fmt.Println(a.Slice())

    // Get the element at the specified index
    fmt.Println(a.Get(6))

    // Insert an element after the specified index
    a.InsertAfter(9, 11)

    // Insert an element before the specified index
    a.InsertBefore(10, 10)
    fmt.Println(a.Slice())

    // Modify the element at the specified index
    a.Set(0, 100)
    fmt.Println(a.Slice())

    // Search for an element, returning the index position if found
    fmt.Println(a.Search(5))

    // Remove the element at the specified index
    a.Remove(0)
    fmt.Println(a.Slice())

    // Concurrent-safe write lock operation
    a.LockFunc(func(array []int) {
        // Modify the last element to 100
        array[len(array) - 1] = 100
    })

    // Concurrent-safe read lock operation
    a.RLockFunc(func(array []int) {
        fmt.Println(array[len(array) - 1])
    })

    // Clear the array
    fmt.Println(a.Slice())
    a.Clear()
    fmt.Println(a.Slice())
}
```

**Output:**

```bash
10
[0 1 2 3 4 5 6 7 8 9]
6 true
[0 1 2 3 4 5 6 7 8 9 10 11]
[100 1 2 3 4 5 6 7 8 9 10 11]
5
[1 2 3 4 5 6 7 8 9 10 11]
100
[1 2 3 4 5 6 7 8 9 10 100]
[]
```

## Sorted Array

The sorted array functions similarly to a regular array but includes automatic sorting and uniqueness filtering.

```go
package main

import (
    "fmt"
    "github.com/gogf/gf/v2/container/garray"
)

func main() {
    // Define a custom sorted array, sorted in descending order 
    // (SortedIntArray is managed in ascending order by default)
    a := garray.NewSortedArray(func(v1, v2 interface{}) int {
        if v1.(int) < v2.(int) {
            return 1
        }
        if v1.(int) > v2.(int) {
            return -1
        }
        return 0
    })

    // Add elements to the array
    a.Add(2)
    a.Add(3)
    a.Add(1)
    fmt.Println(a.Slice())

    // Add duplicate elements
    a.Add(3)
    fmt.Println(a.Slice())

    // Search for an element; returns the last compared index and result
    // Result: 0 = match; <0 = parameter less than compared value; >0 = parameter greater than compared value
    fmt.Println(a.Search(1))

    // Set the array to be unique
    a.SetUnique(true)
    fmt.Println(a.Slice())
    a.Add(1)
    fmt.Println(a.Slice())
}
```

**Output:**

```bash
[3 2 1]
[3 3 2 1]
3 0
[3 2 1]
[3 2 1]
```

## Array Iteration

```go
package main

import (
    "fmt"
    "github.com/gogf/gf/v2/container/garray"
    "github.com/gogf/gf/v2/frame/g"
)

func main() {
    array := garray.NewStrArrayFrom(g.SliceStr{"a", "b", "c"})
    // `Iterator` is an alias for `IteratorAsc`, which iterates the array in ascending order.
    array.Iterator(func(k int, v string) bool {
        fmt.Println(k, v)
        return true
    })
    // `IteratorDesc` iterates the array in descending order.
    array.IteratorDesc(func(k int, v string) bool {
        fmt.Println(k, v)
        return true
    })

    // Output:
    // 0 a
    // 1 b
    // 2 c
    // 2 c
    // 1 b
    // 0 a
}
```

## Pop Array Items

```go
package main

import (
    "fmt"
    "github.com/gogf/gf/v2/container/garray"
)

func main() {
    array := garray.NewFrom([]interface{}{1, 2, 3, 4, 5, 6, 7, 8, 9})

    // `Pop*` functions remove and return the item from the array.
    fmt.Println(array.PopLeft())
    fmt.Println(array.PopLefts(2))
    fmt.Println(array.PopRight())
    fmt.Println(array.PopRights(2))

    // Output:
    // 1 true
    // [2 3]
    // 9 true
    // [7 8]
}
```

## Random Access or Removal of Array Items

```go
package main

    import (
    "fmt"
    "github.com/gogf/gf/v2/container/garray"
    "github.com/gogf/gf/v2/frame/g"
)

func main() {
    array := garray.NewFrom(g.Slice{1, 2, 3, 4, 5, 6, 7, 8, 9})

    // Randomly retrieve and return 2 items from the array without deleting them.
    fmt.Println(array.Rands(2))

    // Randomly pick and return one item from the array, removing it.
    fmt.Println(array.PopRand())
}
```

## Contains Check

```go
package main

import (
    "fmt"
    "github.com/gogf/gf/v2/container/garray"
)

func main() {
    var array garray.StrArray
    array.Append("a")
    fmt.Println(array.Contains("a"))
    fmt.Println(array.Contains("A"))
    fmt.Println(array.ContainsI("A"))

    // Output:
    // true
    // false
    // true
}
```

## Filter Nil or Empty Values

```go
package main

import (
    "fmt"
    "github.com/gogf/gf/v2/container/garray"
    "github.com/gogf/gf/v2/frame/g"
)

func main() {
    array1 := garray.NewFrom(g.Slice{0, 1, 2, nil, "", g.Slice{}, "john"})
    array2 := garray.NewFrom(g.Slice{0, 1, 2, nil, "", g.Slice{}, "john"})
    fmt.Printf("%#v\n", array1.FilterNil().Slice())
    fmt.Printf("%#v\n", array2.FilterEmpty().Slice())

    // Output:
    // []interface {}{0, 1, 2, "", []interface {}{}, "john"}
    // []interface {}{1, 2, "john"}
}
```

## Reverse Array

```go
package main

import (
    "fmt"
    "github.com/gogf/gf/v2/container/garray"
    "github.com/gogf/gf/v2/frame/g"
)

func main() {
    array := garray.NewFrom(g.Slice{1, 2, 3, 4, 5, 6, 7, 8, 9})

    // Reverse the array elements.
    fmt.Println(array.Reverse().Slice())

    // Output:
    // [9 8 7 6 5 4 3 2 1]
}
```

## Shuffle Array

```go
package main

import (
    "fmt"
    "github.com/gogf/gf/v2/container/garray"
    "github.com/gogf/gf/v2/frame/g"
)

func main() {
    array := garray.NewFrom(g.Slice{1, 2, 3, 4, 5, 6, 7, 8, 9})

    // Randomly shuffle the array.
    fmt.Println(array.Shuffle().Slice())
}
```

## Walk Array Modification

```go
package main

import (
    "fmt"
    "github.com/gogf/gf/v2/container/garray"
    "github.com/gogf/gf/v2/frame/g"
)

func main() {
    var array garray.StrArray
    tables := g.SliceStr{"user", "user_detail"}
    prefix := "gf_"
    array.Append(tables...)
    // Add prefix for given table names.
    array.Walk(func(value string) string {
        return prefix + value
    })
    fmt.Println(array.Slice())

    // Output:
    // [gf_user gf_user_detail]
}
```

This example demonstrates how to modify each element of an array using the `Walk` function. Here, we are adding a prefix `"gf_"` to each table name in the array.

## Join Array Elements

```go
package main

import (
    "fmt"
    "github.com/gogf/gf/v2/container/garray"
    "github.com/gogf/gf/v2/frame/g"
)

func main() {
    array := garray.NewFrom(g.Slice{"a", "b", "c", "d"})
    fmt.Println(array.Join(","))

    // Output:
    // a,b,c,d
}
```

## Chunk Array Splitting

```go
package main

import (
    "fmt"
    "github.com/gogf/gf/v2/container/garray"
    "github.com/gogf/gf/v2/frame/g"
)

func main() {
    array := garray.NewFrom(g.Slice{1, 2, 3, 4, 5, 6, 7, 8, 9})

    // Chunk splits an array into multiple arrays,
    // the size of each array is determined by <size>.
    // The last chunk may contain less than size elements.
    fmt.Println(array.Chunk(2))

    // Output:
    // [[1 2] [3 4] [5 6] [7 8] [9]]
}
```

## Merge Arrays

```go
package main

import (
    "fmt"
    "github.com/gogf/gf/v2/container/garray"
    "github.com/gogf/gf/v2/frame/g"
)

func main() {
    array1 := garray.NewFrom(g.Slice{1, 2})
    array2 := garray.NewFrom(g.Slice{3, 4})
    slice1 := g.Slice{5, 6}
    slice2 := []int{7, 8}
    slice3 := []string{"9", "0"}
    fmt.Println(array1.Slice())
    array1.Merge(array1)
    array1.Merge(array2)
    array1.Merge(slice1)
    array1.Merge(slice2)
    array1.Merge(slice3)
    fmt.Println(array1.Slice())

    // Output:
    // [1 2]
    // [1 2 1 2 3 4 5 6 7 8 9 0]
}
```

## JSON Serialization/Deserialization

The `garray` module implements the JSON serialization and deserialization interface for all its container types.

## Marshal

```go
package main

import (
    "encoding/json"
    "fmt"
    "github.com/gogf/gf/v2/container/garray"
)

func main() {
    type Student struct {
        Id     int
        Name   string
        Scores *garray.IntArray
    }
    s := Student{
        Id:     1,
        Name:   "john",
        Scores: garray.NewIntArrayFrom([]int{100, 99, 98}),
    }
    b, _ := json.Marshal(s)
    fmt.Println(string(b))
}
```

After execution, the output is:

```json
{"Id":1,"Name":"john","Scores":[100,99,98]}
```

## Unmarshal

```go
package main

import (
    "encoding/json"
    "fmt"
    "github.com/gogf/gf/v2/container/garray"
)

func main() {
    b := []byte(`{"Id":1,"Name":"john","Scores":[100,99,98]}`)
    type Student struct {
        Id     int
        Name   string
        Scores *garray.IntArray
    }
    s := Student{}
    json.Unmarshal(b, &s)
    fmt.Println(s)
}
```

After execution, the output is:

```bash
{1 john [100,99,98]}
```
