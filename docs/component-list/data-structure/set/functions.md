# Set Type - Functions

> The following is a list of commonly used Functions. The documentation may lag behind the latest features in the code. For more Functions and examples, please refer to the code documentation at [Goframe gset Documentation](https://pkg.go.dev/github.com/gogf/gf/v2/container/gset).

This guide introduces Functions for the `StrSet` type. Functions for other collection types are similar and will not be repeated here.

## NewStrSet

**Description:** `NewStrSet` creates and returns an empty set containing non-duplicate strings. The `safe` parameter specifies whether to use concurrency safety; the default is `false`.

**Signature:**

```go
func NewStrSet(safe ...bool) *StrSet
```

**Example:**

```go
func ExampleNewStrSet() {
    strSet := gset.NewStrSet(true)
    strSet.Add([]string{"str1", "str2", "str3"}...)
    fmt.Println(strSet.Slice())

    // May Output:
    // [str3 str1 str2]
}
```

## NewStrSetFrom

**Description:** `NewStrSetFrom` creates a set from the given array. The `safe` parameter specifies whether to use concurrency safety; the default is `false`.

**Signature:**

```go
func NewStrSetFrom(items []string, safe ...bool) *StrSet
```

**Example:**

```go
func ExampleNewStrSetFrom() {
    strSet := gset.NewStrSetFrom([]string{"str1", "str2", "str3"}, true)
    fmt.Println(strSet.Slice())

    // May Output:
    // [str1 str2 str3]
}
```

## Add

**Description:** `Add` adds one or more elements to the set.

**Signature:**

```go
func (set *StrSet) Add(item ...string)
```

**Example:**

```go
func ExampleStrSet_Add() {
    strSet := gset.NewStrSetFrom([]string{"str1", "str2", "str3"}, true)
    strSet.Add("str")
    fmt.Println(strSet.Slice())
    fmt.Println(strSet.AddIfNotExist("str"))

    // May Output:
    // [str str1 str2 str3]
    // false
}
```

## AddIfNotExist

**Description:** `AddIfNotExist` checks if the item exists in the set. If not, it adds the item and returns `true`; otherwise, it does nothing and returns `false`.

**Signature:**

```go
func (set *StrSet) AddIfNotExist(item string) bool
```

**Example:**

```go
func ExampleStrSet_AddIfNotExist() {
    strSet := gset.NewStrSetFrom([]string{"str1", "str2", "str3"}, true)
    strSet.Add("str")
    fmt.Println(strSet.Slice())
    fmt.Println(strSet.AddIfNotExist("str"))

    // May Output:
    // [str str1 str2 str3]
    // false
}
```

## AddIfNotExistFunc

**Description:** `AddIfNotExistFunc` checks if the item exists in the set. If not, and the function `f` returns `true`, it adds the item and returns `true`; otherwise, it does nothing and returns `false`.

**Signature:**

```go
func (set *StrSet) AddIfNotExistFunc(item string, f func() bool) bool
```

**Example:**

```go
func ExampleStrSet_AddIfNotExistFunc() {
    strSet := gset.NewStrSetFrom([]string{"str1", "str2", "str3"}, true)
    strSet.Add("str")
    fmt.Println(strSet.Slice())
    fmt.Println(strSet.AddIfNotExistFunc("str5", func() bool {
        return true
    }))

    // May Output:
    // [str1 str2 str3 str]
    // true
}
```

## AddIfNotExistFuncLock

**Description:** `AddIfNotExistFuncLock` is similar to `AddIfNotExistFunc`, but uses a concurrency-safe locking mechanism to ensure that only one goroutine executes the function at a time. This method is only effective if the `safe` parameter was set to `true` when creating the set; otherwise, it behaves the same as `AddIfNotExistFunc`.

**Signature:**

```go
func (set *StrSet) AddIfNotExistFuncLock(item string, f func() bool) bool
```

**Example:**

```go
func ExampleStrSet_AddIfNotExistFuncLock() {
    strSet := gset.NewStrSetFrom([]string{"str1", "str2", "str3"}, true)
    strSet.Add("str")
    fmt.Println(strSet.Slice())
    fmt.Println(strSet.AddIfNotExistFuncLock("str4", func() bool {
        return true
    }))

    // May Output:
    // [str1 str2 str3 str]
    // true
}
```

## Clear

**Description:** `Clear` removes all elements from the set.

**Signature:**

```go
func (set *StrSet) Clear()
```

**Example:**

```go
func ExampleStrSet_Clear() {
    strSet := gset.NewStrSetFrom([]string{"str1", "str2", "str3"}, true)
    fmt.Println(strSet.Size())
    strSet.Clear()
    fmt.Println(strSet.Size())

    // Output:
    // 3
    // 0
}
```

## Intersect

**Description:** `Intersect` performs an intersection of the set with others and returns a new set `newSet` containing elements that are present in both the set and others.

**Signature:**

```go
func (set *StrSet) Intersect(others ...*StrSet) (newSet *StrSet)
```

**Example:**

```go
func ExampleStrSet_Intersect() {
    s1 := gset.NewStrSet(true)
    s1.Add([]string{"a", "b", "c"}...)
    var s2 gset.StrSet
    s2.Add([]string{"a", "b", "c", "d"}...)
    fmt.Println(s2.Intersect(s1).Slice())

    // May Output:
    // [c a b]
}
```

## Diff

**Description:** `Diff` performs a difference operation between the set and others and returns a new set `newSet` containing elements that are in the set but not in others. Note that `others` can specify multiple sets.

**Signature:**

```go
func (set *StrSet) Diff(others ...*StrSet) (newSet *StrSet)
```

**Example:**

```go
func ExampleStrSet_Diff() {
    s1 := gset.NewStrSetFrom([]string{"a", "b", "c"}, true)
    s2 := gset.NewStrSetFrom([]string{"a", "b", "c", "d"}, true)
    fmt.Println(s2.Diff(s1).Slice())

    // Output:
    // [d]
}
```

## Union

**Description:** `Union` performs a union operation between the set and others and returns a new set `newSet`.

**Signature:**

```go
func (set *StrSet) Union(others ...*StrSet) (newSet *StrSet)
```

**Example:**

```go
func ExampleStrSet_Union() {
    s1 := gset.NewStrSet(true)
    s1.Add([]string{"a", "b", "c", "d"}...)
    s2 := gset.NewStrSet(true)
    s2.Add([]string{"a", "b", "d"}...)
    fmt.Println(s1.Union(s2).Slice())

    // May Output:
    // [a b c d]
}
```

## Complement

**Description:** `Complement` performs a complement operation between the set and full set and returns a new set `newSet`.

**Signature:**

```go
func (set *StrSet) Complement(full *StrSet) (newSet *StrSet)
```

**Example:**

```go
func ExampleStrSet_Complement() {
    strSet := gset.NewStrSetFrom([]string{"str1", "str2", "str3", "str4", "str5"}, true)
    s := gset.NewStrSetFrom([]string{"str1", "str2", "str3"}, true)
    fmt.Println(s.Complement(strSet).Slice())

    // May Output:
    // [str4 str5]
}
```

## Contains

**Description:** `Contains` checks if the set contains the item.

**Signature:**

```go
func (set *StrSet) Contains(item string) bool
```

**Example:**

```go
func ExampleStrSet_Contains() {
    var set gset.StrSet
    set.Add("a")
    fmt.Println(set.Contains("a"))
    fmt.Println(set.Contains("A"))

    // Output:
    // true
    // false
}
```

## ContainsI

**Description:** `ContainsI` is similar to `Contains`, but it performs a case-insensitive comparison.

**Signature:**

```go
func (set *StrSet) ContainsI(item string) bool
```

**Example:**

```go
func ExampleStrSet_ContainsI() {
    var set gset.StrSet
    set.Add("a")
    fmt.Println(set.ContainsI("a"))
    fmt.Println(set.ContainsI("A"))

    // Output:
    // true
    // true
}
```

## Equal

**Description:** `Equal` checks if two sets are exactly equal (including size and elements).

**Signature:**

```go
func (set *StrSet) Equal(other *StrSet) bool


```

**Example:**

```go
func ExampleStrSet_Equal() {
    s1 := gset.NewStrSetFrom([]string{"a", "b", "c"}, true)
    s2 := gset.NewStrSetFrom([]string{"a", "b", "c", "d"}, true)
    fmt.Println(s2.Equal(s1))

    s3 := gset.NewStrSetFrom([]string{"a", "b", "c"}, true)
    s4 := gset.NewStrSetFrom([]string{"a", "b", "c"}, true)
    fmt.Println(s3.Equal(s4))

    // Output:
    // false
    // true
}
```

## IsSubsetOf

**Description:** `IsSubsetOf` checks if the current set is a subset of the specified set `other`.

**Signature:**

```go
func (set *StrSet) IsSubsetOf(other *StrSet) bool
```

**Example:**

```go
func ExampleStrSet_IsSubsetOf() {
    s1 := gset.NewStrSet(true)
    s1.Add([]string{"a", "b", "c", "d"}...)
    var s2 gset.StrSet
    s2.Add([]string{"a", "b", "d"}...)
    fmt.Println(s2.IsSubsetOf(s1))

    // Output:
    // true
}
```

## Iterator

**Description:** `Iterator` traverses the current set randomly using the given callback function `f`. If `f` returns `true`, it continues; otherwise, it stops.

**Signature:**

```go
func (set *StrSet) Iterator(f func(v string) bool)
```

**Example:**

```go
func ExampleStrSet_Iterator() {
    s1 := gset.NewStrSet(true)
    s1.Add([]string{"a", "b", "c", "d"}...)
    s1.Iterator(func(v string) bool {
        fmt.Println("Iterator", v)
        return true
    })

    // May Output:
    // Iterator a
    // Iterator b
    // Iterator c
    // Iterator d
}
```

## Join

**Description:** `Join` concatenates the elements of the set into a new string separated by the `glue` string.

**Signature:**

```go
func (set *StrSet) Join(glue string) string
```

**Example:**

```go
func ExampleStrSet_Join() {
    s1 := gset.NewStrSet(true)
    s1.Add([]string{"a", "b", "c", "d"}...)
    fmt.Println(s1.Join(","))

    // May Output:
    // b,c,d,a
}
```

## LockFunc

**Description:** `LockFunc` is useful only in concurrent safety scenarios. It locks the set with a write lock and executes the callback function `f`.

**Signature:**

```go
func (set *StrSet) LockFunc(f func(m map[string]struct{}))
```

**Example:**

```go
func ExampleStrSet_LockFunc() {
    s1 := gset.NewStrSet(true)
    s1.Add([]string{"1", "2"}...)
    s1.LockFunc(func(m map[string]struct{}) {
        m["3"] = struct{}{}
    })
    fmt.Println(s1.Slice())

    // May Output
    // [2 3 1]
}
```

## RLockFunc

**Description:** `RLockFunc` is useful only in concurrent safety scenarios. It locks the set with a read lock and executes the callback function `f`.

**Signature:**

```go
func (set *StrSet) RLockFunc(f func(m map[string]struct{}))
```

**Example:**

```go
func ExampleStrSet_RLockFunc() {
    s1 := gset.NewStrSet(true)
    s1.Add([]string{"a", "b", "c", "d"}...)
    s1.RLockFunc(func(m map[string]struct{}) {
        fmt.Println(m)
    })

    // Output:
    // map[a:{} b:{} c:{} d:{}]
}
```

## Merge

**Description:** `Merge` merges all elements from the `others` sets into the current set.

**Signature:**

```go
func (set *StrSet) Merge(others ...*StrSet) *StrSet
```

**Example:**

```go
func ExampleStrSet_Merge() {
    s1 := gset.NewStrSet(true)
    s1.Add([]string{"a", "b", "c", "d"}...)

    s2 := gset.NewStrSet(true)
    fmt.Println(s1.Merge(s2).Slice())

    // May Output:
    // [d a b c]
}
```

## Pop

**Description:** `Pop` randomly removes and returns one element from the set. If the set is empty, it will return an empty string.

**Signature:**

```go
func (set *StrSet) Pop() string
```

**Example:**

```go
func ExampleStrSet_Pop() {
 s1 := gset.NewStrSet(true)
 s1.Add([]string{"a", "b", "c", "d"}...)
 fmt.Println(s1.Pop())

 // May Output:
 // a
}
```

## Pops

**Description:** `Pops` randomly removes and returns `size` number of elements from the set. If `size` is `-1`, it returns all elements in the set.

**Signature:**

```go
func (set *StrSet) Pops(size int) []string
```

**Example:**

```go
func ExampleStrSet_Pops() {
 s1 := gset.NewStrSet(true)
 s1.Add([]string{"a", "b", "c", "d"}...)
 for _, v := range s1.Pops(2) {
  fmt.Println(v)
 }

 // May Output:
 // a
 // b
}
```

## Remove

**Description:** `Remove` deletes the specified item from the set. If the item does not exist, the set remains unchanged.

**Signature:**

```go
func (set *StrSet) Remove(item string)
```

**Example:**

```go
func ExampleStrSet_Remove() {
 s1 := gset.NewStrSet(true)
 s1.Add([]string{"a", "b", "c", "d"}...)
 s1.Remove("a")
 fmt.Println(s1.Slice())

 // May Output:
 // [b c d]
}
```

## Size

**Description:** `Size` returns the number of elements in the set.

**Signature:**

```go
func (set *StrSet) Size() int
```

**Example:**

```go
func ExampleStrSet_Size() {
 s1 := gset.NewStrSet(true)
 s1.Add([]string{"a", "b", "c", "d"}...)
 fmt.Println(s1.Size())

 // Output:
 // 4
}
```

## Slice

**Description:** `Slice` returns the elements of the set as a slice of strings.

**Signature:**

```go
func (set *StrSet) Slice() []string
```

**Example:**

```go
func ExampleStrSet_Slice() {
 s1 := gset.NewStrSet(true)
 s1.Add([]string{"a", "b", "c", "d"}...)
 fmt.Println(s1.Slice())

 // May Output:
 // [a b c d]
}
```

## String

**Description:** `String` returns the elements of the set as a string, with elements separated by commas and enclosed in quotes.

**Signature:**

```go
func (set *StrSet) String() string
```

**Example:**

```go
func ExampleStrSet_String() {
 s1 := gset.NewStrSet(true)
 s1.Add([]string{"a", "b", "c", "d"}...)
 fmt.Println(s1.String())

 // May Output:
 // "a","b","c","d"
}
```

## Sum

**Description:** `Sum` computes the sum of the elements in the set, but only works if all elements are numeric. If non-numeric elements are present, the result may be unexpected.

**Signature:**

```go
func (set *StrSet) Sum() (sum int)
```

**Example:**

```go
func ExampleStrSet_Sum() {
 s1 := gset.NewStrSet(true)
 s1.Add([]string{"1", "2", "3", "4"}...)
 fmt.Println(s1.Sum())

 // Output:
 // 10
}
```

## Walk

**Description:** `Walk` applies the callback function `f` to each element in the set, and updates the set with the return values of `f`. In concurrent scenarios, it uses a write lock to ensure safety.

**Signature:**

```go
func (set *StrSet) Walk(f func(item string) string) *StrSet
```

**Example:**

```go
func ExampleStrSet_Walk() {
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

## MarshalJSON

**Description:** `MarshalJSON` implements the `json.Marshaler` interface for converting the set to JSON format.

**Signature:**

```go
func (set *StrSet) MarshalJSON() ([]byte, error)
```

**Example:**

```go
func ExampleStrSet_MarshalJSON() {
 type Student struct {
  Id     int
  Name   string
  Scores *gset.StrSet
 }
 s := Student{
  Id:     1,
  Name:   "john",
  Scores: gset.NewStrSetFrom([]string{"100", "99", "98"}, true),
 }
 b, _ := json.Marshal(s)
 fmt.Println(string(b))

 // May Output:
 // {"Id":1,"Name":"john","Scores":["100","99","98"]}
}
```

## UnmarshalJSON

**Description:** `UnmarshalJSON` implements the `json.Unmarshaler` interface for parsing JSON data into the set.

**Signature:**

```go
func (set *StrSet) UnmarshalJSON(b []byte) error
```

**Example:**

```go
func ExampleStrSet_UnmarshalJSON() {
 b := []byte(`{"Id":1,"Name":"john","Scores":["100","99","98"]}`)
 type Student struct {
  Id     int
  Name   string
  Scores *gset.StrSet
 }
 s := Student{}
 json.Unmarshal(b, &s)
 fmt.Println(s)

 // May Output:
 // {1 john "99","98","100"}
}
```

## UnmarshalValue

**Description:** `UnmarshalValue` implements a unified interface for setting values in the `goframe` framework. It initializes the set based on the provided `interface{}` parameter.

**Signature:**

```go
func (set *StrSet) UnmarshalValue(value interface{}) (err error)
```

**Example:**

```go
func ExampleStrSet_UnmarshalValue() {
 b := []byte(`{"Id":1,"Name":"john","Scores":["100","99","98"]}`)
 type Student struct {
  Id     int
  Name   string
  Scores *gset.StrSet
 }
 s := Student{}
 json.Unmarshal(b, &s)
 fmt.Println(s)

 // May Output:
 // {1 john "99","98","100"}
}
```
