# Tree Type - Basic Usage

## Basic Usage

```go
package main

import (
    "fmt"
    "github.com/gogf/gf/v2/container/gtree"
    "github.com/gogf/gf/v2/util/gutil"
)

func main() {
    m := gtree.NewRedBlackTree(gutil.ComparatorInt)

    // Set key-value pairs
    for i := 0; i < 10; i++ {
        m.Set(i, i*10)
    }

    // Check the size of the tree
    fmt.Println(m.Size())

    // Set multiple key-value pairs (different data types use different parameters)
    m.Sets(map[interface{}]interface{}{
        10: 10,
        11: 11,
    })
    fmt.Println(m.Size())

    // Check if a key exists
    fmt.Println(m.Contains(1))

    // Get value for a key
    fmt.Println(m.Get(1))

    // Remove an item
    m.Remove(9)
    fmt.Println(m.Size())

    // Remove multiple items
    m.Removes([]interface{}{10, 11})
    fmt.Println(m.Size())

    // Get the list of keys (random order)
    fmt.Println(m.Keys())

    // Get the list of values (random order)
    fmt.Println(m.Values())

    // Get the value for a key or set a default value if the key doesn't exist
    fmt.Println(m.GetOrSet(100, 100))

    // Remove a key-value pair and return the value
    fmt.Println(m.Remove(100))

    // Iterate through the map
    m.IteratorAsc(func(k interface{}, v interface{}) bool {
        fmt.Printf("%v:%v ", k, v)
        return true
    })
    fmt.Println()

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
10
11
9
[0 1 2 3 4 5 6 7 8]
[0 10 20 30 40 50 60 70 80]
100
100
0:0 1:10 2:20 3:30 4:40 5:50 6:60 7:70 8:80
true
```

---

## Pre-order and Post-order Traversal

```go
package main

import (
    "fmt"
    "github.com/gogf/gf/v2/container/gtree"
    "github.com/gogf/gf/v2/util/gutil"
)

func main() {
    tree := gtree.NewAVLTree(gutil.ComparatorInt)

    for i := 0; i < 10; i++ {
        tree.Set(i, i*10)
    }

    // Print the tree structure
    tree.Print()

    // Pre-order traversal (ascending order)
    fmt.Println("ASC:")
    tree.IteratorAsc(func(key, value interface{}) bool {
        fmt.Println(key, value)
        return true
    })

    // Post-order traversal (descending order)
    fmt.Println("DESC:")
    tree.IteratorDesc(func(key, value interface{}) bool {
        fmt.Println(key, value)
        return true
    })
}
```

***Output***

```bash
AVLTree
│           ┌── 9
│       ┌── 8
│   ┌── 7
│   │   │   ┌── 6
│   │   └── 5
│   │       └── 4
└── 3
    │   ┌── 2
    └── 1
        └── 0

ASC:
0 0
1 10
2 20
3 30
4 40
5 50
6 60
7 70
8 80
9 90

DESC:
9 90
8 80
7 70
6 60
5 50
4 40
3 30
2 20
1 10
0 0
```
