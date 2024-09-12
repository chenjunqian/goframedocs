# Linked List Type - Basic Usage

## Basic Usage

```go
package main

import (
    "fmt"
    "github.com/gogf/gf/v2/container/glist"
)

func main() {
    // Not concurrent-safe by default.
    l := glist.New()
    
    // Push
    l.PushBack(1) // Insert value from the back
    l.PushBack(2) // Insert value from the back
    e := l.PushFront(0) // Insert value from the front

    // Insert
    l.InsertBefore(e, -1) // Insert value before 0
    l.InsertAfter(e, "a") // Insert value after 0
    fmt.Println(l)

    // Pop - After popping, the item is removed from the list
    fmt.Println(l.PopFront()) // Pop from the front, return the popped value
    fmt.Println(l.PopBack()) // Pop from the back
    fmt.Println(l)

    // All
    fmt.Println(l.FrontAll()) // Return a copy in ascending order
    fmt.Println(l.BackAll())  // Return a copy in descending order

    // Output:
    // [-1, 0, "a", 1, 2]
    // -1
    // 2
    // [0, "a", 1]
    // [0 "a" 1]
    // [1 "a" 0]
}
```

## Linked List Iteration

In this example, we will iterate through a concurrent-safe linked list using read and write locks, implemented by `RLockFunc` and `LockFunc`. The output after execution is:

```go
package main

import (
    "container/list"
    "fmt"
    "github.com/gogf/gf/v2/container/garray"
    "github.com/gogf/gf/v2/container/glist"
)

func main() {
    // Concurrent-safe list.
    l := glist.NewFrom(garray.NewArrayRange(1, 9, 1).Slice(), true)
    fmt.Println(l)
    
    // Iterate reading from the head.
    l.RLockFunc(func(list *list.List) {
        length := list.Len()
        if length > 0 {
            for i, e := 0, list.Front(); i < length; i, e = i+1, e.Next() {
                fmt.Print(e.Value)
            }
        }
    })
    fmt.Println()
    
    // Iterate reading from the tail.
    l.RLockFunc(func(list *list.List) {
        length := list.Len()
        if length > 0 {
            for i, e := 0, list.Back(); i < length; i, e = i+1, e.Prev() {
                fmt.Print(e.Value)
            }
        }
    })
    fmt.Println()
    
    // Iterate reading from the head using IteratorAsc.
    l.IteratorAsc(func(e *glist.Element) bool {
        fmt.Print(e.Value)
        return true
    })
    fmt.Println()
    
    // Iterate reading from the tail using IteratorDesc.
    l.IteratorDesc(func(e *glist.Element) bool {
        fmt.Print(e.Value)
        return true
    })
    fmt.Println()

    // Iterate writing from the head.
    l.LockFunc(func(list *list.List) {
    length := list.Len()
        if length > 0 {
        for i, e := 0, list.Front(); i < length; i, e = i+1, e.Next() {
            if e.Value == 6 {
                e.Value = "M"
                break
            }
        }
    }
    })
    fmt.Println(l)

    // Output:
    // [1, 2, 3, 4, 5, 6, 7, 8, 9]
    // 123456789
    // 987654321
    // 123456789
    // 987654321
    // [1, 2, 3, 4, 5, M, 7, 8, 9]
}
```

## Push Elements

```go
package main

import (
    "fmt"
    "github.com/gogf/gf/v2/container/glist"
    "github.com/gogf/gf/v2/frame/g"
)

func main() {
    l := glist.NewFrom(g.Slice{1, 2, 3, 4, 5})

    l.PushBack(6)
    fmt.Println(l)

    l.PushFront(0)
    fmt.Println(l)
    
    // Positive numbers push from the right
    l.PushBacks(g.Slice{7, 8})
    fmt.Println(l)

    // Negative numbers push from the left
    l.PushFronts(g.Slice{-1, -2})
    fmt.Println(l)

    l.PushFrontList(glist.NewFrom(g.Slice{"a", "b", "c"}))
    l.PushBackList(glist.NewFrom(g.Slice{"d", "e", "f"}))
    fmt.Println(l)

    // Output:
    // [1, 2, 3, 4, 5, 6]
    // [0, 1, 2, 3, 4, 5, 6]
    // [0, 1, 2, 3, 4, 5, 6, 7, 8]
    // [-2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8]
    // ["a", "b", "c", -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, "d", "e", "f"]
}
```

## Pop Elements

```go
package main

import (
    "fmt"
    "github.com/gogf/gf/v2/container/glist"
    "github.com/gogf/gf/v2/frame/g"
)

func main() {
    l := glist.NewFrom(g.Slice{1, 2, 3, 4, 5, 6, 7, 8, 9})

    fmt.Println(l.PopBack())
    fmt.Println(l.PopBacks(2))
    fmt.Println(l.PopFront())
    fmt.Println(l.PopFronts(2))
    
    fmt.Println(glist.NewFrom(g.Slice{"a", "b", "c", "d"}).PopFrontAll())
    fmt.Println(glist.NewFrom(g.Slice{"a", "b", "c", "d"}).PopBackAll())

    // Output:
    // 9
    // [8 7]
    // 1
    // [2 3]
    // [4, 5, 6]
    // [a b c d]
    // [d c b a]
}
```

## Move or Insert Elements

```go
package main

import (
    "fmt"
    "github.com/gogf/gf/v2/container/glist"
    "github.com/gogf/gf/v2/frame/g"
)

func main() {
    l := glist.NewFrom(g.Slice{1, 2, 3, 4, 5, 6, 7, 8, 9})

    l.MoveToBack(l.Front()) // Move the first element (1) to the far right [2, 3, 4, 5, 6, 7, 8, 9, 1]
    l.MoveToFront(l.Back().Prev()) // Move the second last element (9) to the far left [9, 2, 3, 4, 5, 6, 7, 8, 1]
    fmt.Println(l)

    // Move 2 before the front element
    l.MoveBefore(l.Front().Next(), l.Front())
    // Move 8 after the back element
    l.MoveAfter(l.Back().Prev(), l.Back())
    fmt.Println(l)

    // Insert a new element before the back element
    l.InsertBefore(l.Back(), "a")
    // Insert a new element after the front element
    l.InsertAfter(l.Front(), "b")

    // Output:
    // [9, 2, 3, 4, 5, 6, 7, 8, 1]
    // [2, 9, 3, 4, 5, 6, 7, 1, 8]
    // [2, "b", 9, 3, 4, 5, 6, 7, 1, "a", 8]
}
```

## Join Elements

```go
package main

import (
    "fmt"
    "github.com/gogf/gf/v2/container/glist"
    "github.com/gogf/gf/v2/frame/g"
)

func main() {
    var l glist.List
    l.PushBacks(g.Slice{"a", "b", "c", "d"})

    fmt.Println(l.Join(","))

    // Output:
    // a,b,c,d
}
```

## Remove Elements

```go
package main

import (
    "fmt"
    "github.com/gogf/gf/v2/container/glist"
    "github.com/gogf/gf/v2/frame/g"
)

func main() {  
    l := glist.NewFrom(g.Slice{0, 1, 2, 3, 4, 5, 6, 7, 8, 9})
    fmt.Println(l)
    
    fmt.Println(l.Remove(l.Front()))
    fmt.Println(l)

    l.Removes([]*glist.Element{l.Front(), l.Front().Next()})
    fmt.Println(l)

    l.RemoveAll

    ()
    fmt.Println(l)

    // Output:
    // [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
    // 0
    // [1, 2, 3, 4, 5, 6, 7, 8, 9]
    // [3, 4, 5, 6, 7, 8, 9]
    // []
}
```

## JSON Serialization and Deserialization

The `glist` container implements the standard library JSON data format for serialization/deserialization.

### Marshal

```go
package main

import (
    "encoding/json"
    "fmt"
    "github.com/gogf/gf/v2/container/glist"
    "github.com/gogf/gf/v2/frame/g"
)

func main() {
    type Student struct {
        Id     int
        Name   string
        Scores *glist.List
    }
    s := Student{
        Id:     1,
        Name:   "john",
        Scores: glist.NewFrom(g.Slice{100, 99, 98}),
    }
    b, _ := json.Marshal(s)
    fmt.Println(string(b))

    // Output:
    // {"Id":1,"Name":"john","Scores":[100,99,98]}
}
```

### Unmarshal

```go
package main

import (
    "encoding/json"
    "fmt"
    "github.com/gogf/gf/v2/container/glist"
)

func main() {
    b := []byte(`{"Id":1,"Name":"john","Scores":[100,99,98]}`)
    type Student struct {
        Id     int
        Name   string
        Scores *glist.List
    }
    s := Student{}
    json.Unmarshal(b, &s)
    fmt.Println(s)

    // Output:
    // {1 john [100,99,98]}
}
```
