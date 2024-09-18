# Tree Type - Functions

> Below is a list of commonly used methods. The documentation may lag behind new features in the code. For more methods and examples, please refer to the code documentation: [GoFrame Tree Documentation](https://pkg.go.dev/github.com/gogf/gf/v2/container/gtree).

## NewBTree

Description: `NewBTree` creates a BTree using `m` (the maximum number of child nodes) and a custom comparison method. The `safe` parameter specifies whether to use a thread-safe tree, which defaults to `false`.

Note: The `m` parameter must be greater than or equal to 3, otherwise it will cause a panic.

**Format:**

```go
NewBTree(m int, comparator func(v1, v2 interface{}) int, safe ...bool) *BTree
```

**Example:**

```go
func ExampleNewBTree() {
    bTree := gtree.NewBTree(3, gutil.ComparatorString)
    for i := 0; i < 6; i++ {
        bTree.Set("key" + gconv.String(i), "val" + gconv.String(i))
    }
    fmt.Println(bTree.Map())

    // Output:
    // map[key0:val0 key1:val1 key2:val2 key3:val3 key4:val4 key5:val5]
}
```

## NewBTreeFrom

Description: `NewBTreeFrom` creates a BTree using `m` (the maximum number of child nodes), a custom comparison method, and a data type of `map[interface{}]interface{}`. The `safe` parameter specifies whether to use a thread-safe tree, which defaults to `false`.

Note: The `m` parameter must be greater than or equal to 3, otherwise it will cause a panic.

**Format:**

```go
NewBTreeFrom(m int, comparator func(v1, v2 interface{}) int, data map[interface{}]interface{}, safe ...bool) *BTree
```

**Example:**

```go
func ExampleNewBTreeFrom() {
    bTree := gtree.NewBTree(3, gutil.ComparatorString)
    for i := 0; i < 6; i++ {
        bTree.Set("key" + gconv.String(i), "val" + gconv.String(i))
    }

    otherBTree := gtree.NewBTreeFrom(3, gutil.ComparatorString, bTree.Map())
    fmt.Println(otherBTree.Map())

    // Output:
    // map[key0:val0 key1:val1 key2:val2 key3:val3 key4:val4 key5:val5]
}
```

## Clone

Description: `Clone` returns a copy of the current BTree with the same values.

**Format:**

```go
Clone() *BTree
```

**Example:**

```go
func ExampleBTree_Clone() {
    b := gtree.NewBTree(3, gutil.ComparatorString)
    for i := 0; i < 6; i++ {
        b.Set("key" + gconv.String(i), "val" + gconv.String(i))
    }

    tree := b.Clone()

    fmt.Println(tree.Map())
    fmt.Println(tree.Size())

    // Output:
    // map[key0:val0 key1:val1 key2:val2 key3:val3 key4:val4 key5:val5]
    // 6
}
```

## Set

Description: `Set` sets the key/value for the tree.

**Format:**

```go
Set(key interface{}, value interface{})
```

**Example:**

```go
func ExampleBTree_Set() {
    tree := gtree.NewBTree(3, gutil.ComparatorString)
    for i := 0; i < 6; i++ {
        tree.Set("key" + gconv.String(i), "val" + gconv.String(i))
    }

    fmt.Println(tree.Map())
    fmt.Println(tree.Size())

    // Output:
    // map[key0:val0 key1:val1 key2:val2 key3:val3 key4:val4 key5:val5]
    // 6
}
```

## Sets

Description: `Sets` sets multiple key/value pairs for the tree.

**Format:**

```go
Sets(data map[interface{}]interface{})
```

**Example:**

```go
func ExampleBTree_Sets() {
    tree := gtree.NewBTree(3, gutil.ComparatorString)

    tree.Sets(map[interface{}]interface{}{
        "key1": "val1",
        "key2": "val2",
    })

    fmt.Println(tree.Map())
    fmt.Println(tree.Size())

    // Output:
    // map[key1:val1 key2:val2]
    // 2
}
```

## Get

Description: `Get` returns the value corresponding to the key. If the key does not exist, it returns `Nil`.

**Format:**

```go
Get(key interface{}) (value interface{})
```

**Example:**

```go
func ExampleBTree_Get() {
    tree := gtree.NewBTree(3, gutil.ComparatorString)
    for i := 0; i < 6; i++ {
        tree.Set("key" + gconv.String(i), "val" + gconv.String(i))
    }

    fmt.Println(tree.Get("key1"))
    fmt.Println(tree.Get("key10"))

    // Output:
    // val1
    // <nil>
}
```

## GetOrSet

Description: `GetOrSet` returns the value if the key exists. If the key does not exist, it sets the key and value, then returns the value.

**Format:**

```go
GetOrSet(key interface{}, value interface{}) interface{}
```

**Example:**

```go
func ExampleBTree_GetOrSet() {
    tree := gtree.NewBTree(3, gutil.ComparatorString)
    for i := 0; i < 6; i++ {
        tree.Set("key" + gconv.String(i), "val" + gconv.String(i))
    }

    fmt.Println(tree.GetOrSet("key1", "newVal1"))
    fmt.Println(tree.GetOrSet("key6", "val6"))

    // Output:
    // val1
    // val6
}
```

## GetOrSetFunc

**Description:**  
`GetOrSetFunc` returns the value if the key exists. If the key does not exist, it sets the value using the return value of the provided function `f`, and then returns that value.

**Syntax:**

```go
GetOrSetFunc(key interface{}, f func() interface{}) interface{}
```

**Example:**

```go
func ExampleBTree_GetOrSetFunc() {
    tree := gtree.NewBTree(3, gutil.ComparatorString)
    for i := 0; i < 6; i++ {
        tree.Set("key"+gconv.String(i), "val"+gconv.String(i))
    }

    fmt.Println(tree.GetOrSetFunc("key1", func() interface{} {
        return "newVal1"
    }))
    fmt.Println(tree.GetOrSetFunc("key6", func() interface{} {
        return "val6"
    }))

    // Output:
    // val1
    // val6
}
```

## GetOrSetFuncLock

**Description:**  
`GetOrSetFuncLock` works similarly to `GetOrSetFunc`, but it performs the function `f` within a write-lock.

**Syntax:**

```go
GetOrSetFuncLock(key interface{}, f func() interface{}) interface{}
```

**Example:**

```go
func ExampleBTree_GetOrSetFuncLock() {
    tree := gtree.NewBTree(3, gutil.ComparatorString)
    for i := 0; i < 6; i++ {
        tree.Set("key"+gconv.String(i), "val"+gconv.String(i))
    }

    fmt.Println(tree.GetOrSetFuncLock("key1", func() interface{} {
        return "newVal1"
    }))
    fmt.Println(tree.GetOrSetFuncLock("key6", func() interface{} {
        return "val6"
    }))

    // Output:
    // val1
    // val6
}
```

## GetVar

**Description:**  
`GetVar` retrieves the value associated with the key, returning it as a `*gvar.Var`.

**Note:**  
The returned `gvar.Var` is not concurrency-safe.

**Syntax:**

```go
GetVar(key interface{}) *gvar.Var
```

**Example:**

```go
func ExampleBTree_GetVar() {
    tree := gtree.NewBTree(3, gutil.ComparatorString)
    for i := 0; i < 6; i++ {
        tree.Set("key"+gconv.String(i), "val"+gconv.String(i))
    }

    fmt.Println(tree.GetVar("key1").String())

    // Output:
    // val1
}
```

## GetVarOrSet

**Description:**  
`GetVarOrSet` returns the result of `GetOrSet`, wrapped in a `*gvar.Var`.

**Note:**  
The returned `gvar.Var` is not concurrency-safe.

**Syntax:**

```go
GetVarOrSet(key interface{}, value interface{}) *gvar.Var
```

**Example:**

```go
func ExampleBTree_GetVarOrSet() {
    tree := gtree.NewBTree(3, gutil.ComparatorString)
    for i := 0; i < 6; i++ {
        tree.Set("key"+gconv.String(i), "val"+gconv.String(i))
    }

    fmt.Println(tree.GetVarOrSet("key1", "newVal1"))
    fmt.Println(tree.GetVarOrSet("key6", "val6"))

    // Output:
    // val1
    // val6
}
```

## GetVarOrSetFunc

**Description:**  
`GetVarOrSetFunc` returns the result of `GetOrSetFunc`, wrapped in a `*gvar.Var`.

**Note:**  
The returned `gvar.Var` is not concurrency-safe.

**Syntax:**

```go
GetVarOrSetFunc(key interface{}, f func() interface{}) *gvar.Var
```

**Example:**

```go
func ExampleBTree_GetVarOrSetFunc() {
    tree := gtree.NewBTree(3, gutil.ComparatorString)
    for i := 0; i < 6; i++ {
        tree.Set("key"+gconv.String(i), "val"+gconv.String(i))
    }

    fmt.Println(tree.GetVarOrSetFunc("key1", func() interface{} {
        return "newVal1"
    }))
    fmt.Println(tree.GetVarOrSetFunc("key6", func() interface{} {
        return "val6"
    }))

    // Output:
    // val1
    // val6
}
```

## GetVarOrSetFuncLock

**Description:**  
`GetVarOrSetFuncLock` returns the result of `GetOrSetFuncLock`, wrapped in a `*gvar.Var`.

**Note:**  
The returned `gvar.Var` is not concurrency-safe.

**Syntax:**

```go
GetVarOrSetFuncLock(key interface{}, f func() interface{}) *gvar.Var
```

**Example:**

```go
func ExampleBTree_GetVarOrSetFuncLock() {
    tree := gtree.NewBTree(3, gutil.ComparatorString)
    for i := 0; i < 6; i++ {
        tree.Set("key"+gconv.String(i), "val"+gconv.String(i))
    }

    fmt.Println(tree.GetVarOrSetFuncLock("key1", func() interface{} {
        return "newVal1"
    }))
    fmt.Println(tree.GetVarOrSetFuncLock("key6", func() interface{} {
        return "val6"
    }))

    // Output:
    // val1
    // val6
}
```

## SetIfNotExist

**Description:**  
`SetIfNotExist` sets the key/value pair in the tree if the key does not exist. It returns `true` if the key is new, or `false` if the key already exists (and the value is ignored).

**Syntax:**

```go
SetIfNotExist(key interface{}, value interface{}) bool
```

**Example:**

```go
func ExampleBTree_SetIfNotExist() {
    tree := gtree.NewBTree(3, gutil.ComparatorString)
    for i := 0; i < 6; i++ {
        tree.Set("key"+gconv.String(i), "val"+gconv.String(i))
    }

    fmt.Println(tree.SetIfNotExist("key1", "newVal1"))
    fmt.Println(tree.SetIfNotExist("key6", "val6"))

    // Output:
    // false
    // true
}
```

## SetIfNotExistFunc

**Description:**  
If the key does not exist, `SetIfNotExistFunc` sets the value using the return value of function `f` and returns `true`. If the key exists, it returns `false`, and the value is ignored.

**Syntax:**

```go
SetIfNotExistFunc(key interface{}, f func() interface{}) bool
```

**Example:**

```go
func ExampleBTree_SetIfNotExistFunc() {
    tree := gtree.NewBTree(3, gutil.ComparatorString)
    for i := 0; i < 6; i++ {
        tree.Set("key"+gconv.String(i), "val"+gconv.String(i))
    }

    fmt.Println(tree.SetIfNotExistFunc("key1", func() interface{} {
        return "newVal1"
    }))
    fmt.Println(tree.SetIfNotExistFunc("key6", func() interface{} {
        return "val6"
    }))

    // Output:
    // false
    // true
}
```

## SetIfNotExistFuncLock

**Description:**  
If the key does not exist, `SetIfNotExistFuncLock` sets the value using the return value of function `f` and returns `true`. If the key exists, it returns `false`, and the value is ignored.  
This method differs from `SetIfNotExistFunc` in that it runs the function `f` within a `mutex.Lock`.

**Syntax:**

```go
SetIfNotExistFuncLock(key interface{}, f func() interface{}) bool
```

**Example:**

```go
func ExampleBTree_SetIfNotExistFuncLock() {
    tree := gtree.NewBTree(3, gutil.ComparatorString)
    for i := 0; i < 6; i++ {
        tree.Set("key"+gconv.String(i), "val"+gconv.String(i))
    }

    fmt.Println(tree.SetIfNotExistFuncLock("key1", func() interface{} {
        return "newVal1"
    }))
    fmt.Println(tree.SetIfNotExistFuncLock("key6", func() interface{} {
        return "val6"
    }))

    // Output:
    // false
    // true
}
```

## Contains

**Description:**  
`Contains` checks whether the key exists in the tree. If the key exists, it returns `true`; otherwise, it returns `false`.

**Syntax:**

```go
Contains(key interface{}) bool
```

**Example:**

```go
func ExampleBTree_Contains() {
    tree := gtree.NewBTree(3, gutil.ComparatorString)
    for i := 0; i < 6; i++ {
        tree.Set("key"+gconv.String(i), "val"+gconv.String(i))
    }

    fmt.Println(tree.Contains("key1"))
    fmt.Println(tree.Contains("key6"))

    // Output:
    // true
    // false
}
```

## Remove

**Description:**  
`Remove` deletes the value associated with the given key from the tree and returns the deleted value.

**Syntax:**

```go
Remove(key interface{}) (value interface{})
```

**Example:**

```go
func ExampleBTree_Remove() {
    tree := gtree.NewBTree(3, gutil.ComparatorString)
    for i := 0; i < 6; i++ {
        tree.Set("key"+gconv.String(i), "val"+gconv.String(i))
    }

    fmt.Println(tree.Remove("key1"))
    fmt.Println(tree.Remove("key6"))
    fmt.Println(tree.Map())

    // Output:
    // val1
    // <nil>
    // map[key0:val0 key2:val2 key3:val3 key4:val4 key5:val5]
}
```

## Removes

**Description:**  
`Removes` deletes values associated with multiple keys from the tree.

**Syntax:**

```go
Removes(keys []interface{})
```

**Example:**

```go
func ExampleBTree_Removes() {
    tree := gtree.NewBTree(3, gutil.ComparatorString)
    for i := 0; i < 6; i++ {
        tree.Set("key"+gconv.String(i), "val"+gconv.String(i))
    }

    removeKeys := make([]interface{}, 2)
    removeKeys = append(removeKeys, "key1")
    removeKeys = append(removeKeys, "key6")

    tree.Removes(removeKeys)

    fmt.Println(tree.Map())

    // Output:
    // map[key0:val0 key2:val2 key3:val3 key4:val4 key5:val5]
}
```

## IsEmpty

**Description:**  
`IsEmpty` checks whether the tree is empty. If the tree is empty, it returns `true`; otherwise, it returns `false`.

**Syntax:**

```go
IsEmpty() bool
```

**Example:**

```go
func ExampleBTree_IsEmpty() {
    tree := gtree.NewBTree(3, gutil.ComparatorString)

    fmt.Println(tree.IsEmpty())

    for i := 0; i < 6; i++ {
        tree.Set("key"+gconv.String(i), "val"+gconv.String(i))
    }

    fmt.Println(tree.IsEmpty())

    // Output:
    // true
    // false
}
```

## Size

**Description:**  
`Size` returns the size (number of elements) in the tree.

**Syntax:**

```go
Size() int
```

**Example:**

```go
func ExampleBTree_Size() {
    tree := gtree.NewBTree(3, gutil.ComparatorString)

    fmt.Println(tree.Size())

    for i := 0; i < 6; i++ {
        tree.Set("key"+gconv.String(i), "val"+gconv.String(i))
    }

    fmt.Println(tree.Size())

    // Output:
    // 0
    // 6
}
```

## Keys

**Description:**  
`Keys` returns all keys in ascending order.

**Syntax:**

```go
Keys() []interface{}
```

**Example:**

```go
func ExampleBTree_Keys() {
    tree := gtree.NewBTree(3, gutil.ComparatorString)
    for i := 6; i > 0; i-- {
        tree.Set("key" + gconv.String(i), "val" + gconv.String(i))
    }

    fmt.Println(tree.Keys())

    // Output:
    // [key1 key2 key3 key4 key5 key6]
}
```

## Values

**Description:**  
`Values` returns all values in ascending order of their corresponding keys.

**Syntax:**

```go
Values() []interface{}
```

**Example:**

```go
func ExampleBTree_Values() {
    tree := gtree.NewBTree(3, gutil.ComparatorString)
    for i := 6; i > 0; i-- {
        tree.Set("key" + gconv.String(i), "val" + gconv.String(i))
    }

    fmt.Println(tree.Values())

    // Output:
    // [val1 val2 val3 val4 val5 val6]
}
```

## Map

**Description:**  
`Map` returns all key/value pairs in the form of a map.

**Syntax:**

```go
Map() map[interface{}]interface{}
```

**Example:**

```go
func ExampleBTree_Map() {
    tree := gtree.NewBTree(3, gutil.ComparatorString)
    for i := 0; i < 6; i++ {
        tree.Set("key" + gconv.String(i), "val" + gconv.String(i))
    }

    fmt.Println(tree.Map())

    // Output:
    // map[key0:val0 key1:val1 key2:val2 key3:val3 key4:val4 key5:val5]
}
```

## MapStrAny

**Description:**  
`MapStrAny` returns all key/value pairs in the form of a `map[string]interface{}`.

**Syntax:**

```go
MapStrAny() map[string]interface{}
```

**Example:**

```go
func ExampleBTree_MapStrAny() {
    tree := gtree.NewBTree(3, gutil.ComparatorString)
    for i := 0; i < 6; i++ {
        tree.Set(1000+i, "val" + gconv.String(i))
    }

    fmt.Println(tree.MapStrAny())

    // Output:
    // map[1000:val0 1001:val1 1002:val2 1003:val3 1004:val4 1005:val5]
}
```

## Clear

**Description:**  
`Clear` removes all data from the tree.

**Syntax:**

```go
Clear()
```

**Example:**

```go
func ExampleBTree_Clear() {
    tree := gtree.NewBTree(3, gutil.ComparatorString)
    for i := 0; i < 6; i++ {
        tree.Set(1000+i, "val" + gconv.String(i))
    }
    fmt.Println(tree.Size())

    tree.Clear()
    fmt.Println(tree.Size())

    // Output:
    // 6
    // 0
}
```

## Replace

**Description:**  
`Replace` replaces the tree's key/value pairs with the data from the provided map of type `map[interface{}]interface{}`.

**Syntax:**

```go
Replace(data map[interface{}]interface{})
```

**Example:**

```go
func ExampleBTree_Replace() {
    tree := gtree.NewBTree(3, gutil.ComparatorString)
    for i := 0; i < 6; i++ {
        tree.Set("key" + gconv.String(i), "val" + gconv.String(i))
    }

    fmt.Println(tree.Map())

    data := map[interface{}]interface{}{
        "newKey0": "newVal0",
        "newKey1": "newVal1",
        "newKey2": "newVal2",
    }

    tree.Replace(data)

    fmt.Println(tree.Map())

    // Output:
    // map[key0:val0 key1:val1 key2:val2 key3:val3 key4:val4 key5:val5]
    // map[newKey0:newVal0 newKey1:newVal1 newKey2:newVal2]
}
```

## Height

**Description:**  
`Height` returns the height of the tree.

**Syntax:**

```go
Height() int
```

**Example:**

```go
func ExampleBTree_Height() {
    tree := gtree.NewBTree(3, gutil.ComparatorInt)
    for i := 0; i < 100; i++ {
        tree.Set(i, i)
    }
    fmt.Println(tree.Height())

    // Output:
    // 6
}
```

## Left

**Description**:  
`Left` returns the leftmost (smallest) node of type `*BTreeEntry`. If the tree is empty, it returns `nil`.

**Signature**:

```go
Left() *BTreeEntry
```

**Example**:

```go
func ExampleBTree_Left() {
    tree := gtree.NewBTree(3, gutil.ComparatorInt)
    for i := 1; i < 100; i++ {
        tree.Set(i, i)
    }
    fmt.Println(tree.Left().Key, tree.Left().Value)

    emptyTree := gtree.NewBTree(3, gutil.ComparatorInt)
    fmt.Println(emptyTree.Left())

    // Output:
    // 1 1
    // <nil>
}
```

## Right

**Description**:  
`Right` returns the rightmost (largest) node of type `*BTreeEntry`. If the tree is empty, it returns `nil`.

**Signature**:

```go
Right() *BTreeEntry
```

**Example**:

```go
func ExampleBTree_Right() {
    tree := gtree.NewBTree(3, gutil.ComparatorInt)
    for i := 1; i < 100; i++ {
        tree.Set(i, i)
    }
    fmt.Println(tree.Right().Key, tree.Right().Value)

    emptyTree := gtree.NewBTree(3, gutil.ComparatorInt)
    fmt.Println(emptyTree.Right())

    // Output:
    // 99 99
    // <nil>
}
```

## String

**Description**:  
`String` returns a string representation of the tree’s nodes, useful for debugging purposes.

**Signature**:

```go
String() string
```

**Example**:

```go
func ExampleBTree_String() {
    tree := gtree.NewBTree(3, gutil.ComparatorString)
    for i := 0; i < 6; i++ {
        tree.Set("key"+gconv.String(i), "val"+gconv.String(i))
    }

    fmt.Println(tree.String())

    // Output:
    // key0
    // key1
    //     key2
    // key3
    //     key4
    //     key5
}
```

## Search

**Description**:  
`Search` searches the tree using the provided key. If the key is found, it returns the corresponding value and `found` as `true`; otherwise, it returns `false`.

**Signature**:

```go
Search(key interface{}) (value interface{}, found bool)
```

**Example**:

```go
func ExampleBTree_Search() {
    tree := gtree.NewBTree(3, gutil.ComparatorString)
    for i := 0; i < 6; i++ {
        tree.Set("key"+gconv.String(i), "val"+gconv.String(i))
    }

    fmt.Println(tree.Search("key0"))
    fmt.Println(tree.Search("key6"))

    // Output:
    // val0 true
    // <nil> false
}
```

## Print

**Description**:  
`Print` prints the structure of the tree to the standard output.

**Signature**:

```go
Print()
```

**Example**:

```go
func ExampleBTree_Print() {
    tree := gtree.NewBTree(3, gutil.ComparatorString)
    for i := 0; i < 6; i++ {
        tree.Set("key"+gconv.String(i), "val"+gconv.String(i))
    }

    tree.Print()

    // Output:
    // key0
    // key1
    //     key2
    // key3
    //     key4
    //     key5
}
```

## Iterator

**Description**:  
`Iterator` is equivalent to `IteratorAsc`. It iterates over the elements of the tree.

**Signature**:

```go
Iterator(f func(key, value interface{}) bool)
```

**Example**:

```go
func ExampleBTree_Iterator() {
    tree := gtree.NewBTree(3, gutil.ComparatorString)
    for i := 0; i < 10; i++ {
        tree.Set(i, 10-i)
    }

    var totalKey, totalValue int
    tree.Iterator(func(key, value interface{}) bool {
        totalKey += key.(int)
        totalValue += value.(int)

        return totalValue < 20
    })

    fmt.Println("totalKey:", totalKey)
    fmt.Println("totalValue:", totalValue)

    // Output:
    // totalKey: 3
    // totalValue: 27
}
```

## IteratorFrom

**Description**:  
`IteratorFrom` is equivalent to `IteratorAscFrom`. It starts iteration from a specific key.

**Signature**:

```go
IteratorFrom(key interface{}, match bool, f func(key, value interface{}) bool)
```

**Example**:

```go
func ExampleBTree_IteratorFrom() {
    m := make(map[interface{}]interface{})
    for i := 1; i <= 5; i++ {
        m[i] = i * 10
    }
    tree := gtree.NewBTreeFrom(3, gutil.ComparatorInt, m)

    tree.IteratorFrom(1, true, func(key, value interface{}) bool {
        fmt.Println("key:", key, ", value:", value)
        return true
    })

    // Output:
    // key: 1 , value: 10
    // key: 2 , value: 20
    // key: 3 , value: 30
    // key: 4 , value: 40
    // key: 5 , value: 50
}
```

Here is the Markdown-formatted translation of the provided content:

## IteratorAsc

**Description**:  
`IteratorAsc` iterates over the tree in ascending order using a custom callback function `f`. The iteration is read-only. If `f` returns `true`, the iteration continues; if `false`, the iteration stops.

**Signature**:

```go
IteratorAsc(f func(key, value interface{}) bool)
```

**Example**:

```go
func ExampleBTree_IteratorAsc() {
    tree := gtree.NewBTree(3, gutil.ComparatorString)
    for i := 0; i < 10; i++ {
        tree.Set(i, 10-i)
    }

    tree.IteratorAsc(func(key, value interface{}) bool {
        fmt.Println("key:", key, ", value:", value)
        return true
    })

    // Output:
    // key: 0 , value: 10
    // key: 1 , value: 9
    // key: 2 , value: 8
    // key: 3 , value: 7
    // key: 4 , value: 6
    // key: 5 , value: 5
    // key: 6 , value: 4
    // key: 7 , value: 3
    // key: 8 , value: 2
    // key: 9 , value: 1
}
```

## IteratorAscFrom

**Description**:  
`IteratorAscFrom` iterates over the tree in ascending order from a specified key using a custom callback function `f`. The parameter `key` specifies where to start iterating. If `match` is `true`, it starts iteration from the exact key match; otherwise, it searches for the closest key index. If `f` returns `true`, the iteration continues; if `false`, it stops.

**Signature**:

```go
IteratorAscFrom(key interface{}, match bool, f func(key, value interface{}) bool)
```

**Example**:

```go
func ExampleBTree_IteratorAscFrom_Normal() {
    m := make(map[interface{}]interface{})
    for i := 1; i <= 5; i++ {
        m[i] = i * 10
    }
    tree := gtree.NewBTreeFrom(3, gutil.ComparatorInt, m)

    tree.IteratorAscFrom(1, true, func(key, value interface{}) bool {
        fmt.Println("key:", key, ", value:", value)
        return true
    })

    // Output:
    // key: 1 , value: 10
    // key: 2 , value: 20
    // key: 3 , value: 30
    // key: 4 , value: 40
    // key: 5 , value: 50
}
```

```go
func ExampleBTree_IteratorAscFrom_NoExistKey() {
    m := make(map[interface{}]interface{})
    for i := 1; i <= 5; i++ {
        m[i] = i * 10
    }
    tree := gtree.NewBTreeFrom(3, gutil.ComparatorInt, m)

    tree.IteratorAscFrom(0, true, func(key, value interface{}) bool {
        fmt.Println("key:", key, ", value:", value)
        return true
    })

    // Output:
}
```

```go
func ExampleBTree_IteratorAscFrom_NoExistKeyAndMatchFalse() {
    m := make(map[interface{}]interface{})
    for i := 1; i <= 5; i++ {
        m[i] = i * 10
    }
    tree := gtree.NewBTreeFrom(3, gutil.ComparatorInt, m)

    tree.IteratorAscFrom(0, false, func(key, value interface{}) bool {
        fmt.Println("key:", key, ", value:", value)
        return true
    })

    // Output:
    // key: 1 , value: 10
    // key: 2 , value: 20
    // key: 3 , value: 30
    // key: 4 , value: 40
    // key: 5 , value: 50
}
```

## IteratorDesc

**Description**:  
`IteratorDesc` iterates over the tree in descending order using a custom callback function `f`. The iteration is read-only. If `f` returns `true`, the iteration continues; if `false`, it stops.

**Signature**:

```go
IteratorDesc(f func(key, value interface{}) bool)
```

**Example**:

```go
func ExampleBTree_IteratorDesc() {
    tree := gtree.NewBTree(3, gutil.ComparatorString)
    for i := 0; i < 10; i++ {
        tree.Set(i, 10-i)
    }

    tree.IteratorDesc(func(key, value interface{}) bool {
        fmt.Println("key:", key, ", value:", value)
        return true
    })

    // Output:
    // key: 9 , value: 1
    // key: 8 , value: 2
    // key: 7 , value: 3
    // key: 6 , value: 4
    // key: 5 , value: 5
    // key: 4 , value: 6
    // key: 3 , value: 7
    // key: 2 , value: 8
    // key: 1 , value: 9
    // key: 0 , value: 10
}
```

## IteratorDescFrom

**Description**:  
`IteratorDescFrom` iterates over the tree in descending order from a specified key using a custom callback function `f`. The parameter `key` specifies where to start iterating. If `match` is `true`, it starts iteration from the exact key match; otherwise, it searches for the closest key index. If `f` returns `true`, the iteration continues; if `false`, it stops.

**Signature**:

```go
IteratorDescFrom(key interface{}, match bool, f func(key, value interface{}) bool)
```

**Example**:

```go
func ExampleBTree_IteratorDescFrom() {
    m := make(map[interface{}]interface{})
    for i := 1; i <= 5; i++ {
        m[i] = i * 10
    }
    tree := gtree.NewBTreeFrom(3, gutil.ComparatorInt, m)

    tree.IteratorDescFrom(5, true, func(key, value interface{}) bool {
        fmt.Println("key:", key, ", value:", value)
        return true
    })

    // Output:
    // key: 5 , value: 50
    // key: 4 , value: 40
    // key: 3 , value: 30
    // key: 2 , value: 20
    // key: 1 , value: 10
}
```

## MarshalJSON

**Description**:  
`MarshalJSON` implements the `json.Marshal` interface, allowing the tree to be serialized into JSON format.

**Signature**:

```go
MarshalJSON() ([]byte, error)
```

**Example**:

```go
func ExampleBTree_MarshalJSON() {
    tree := gtree.NewBTree(3, gutil.ComparatorString)
    for i := 0; i < 6; i++ {
        tree.Set("key"+gconv.String(i), "val"+gconv.String(i))
    }

    bytes, err := json.Marshal(tree)
    if err == nil {
        fmt.Println(gconv.String(bytes))
    }

    // Output:
    // {"key0":"val0","key1":"val1","key2":"val2","key3":"val3","key4":"val4","key5":"val5"}
}
```
