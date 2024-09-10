# Array Type - Functions

Below is a list of common Functions. Note that the documentation may lag behind the latest features in the code. For more Functions and examples, please refer to the code documentation: [Goframe GArray Documentation](https://pkg.go.dev/github.com/gogf/gf/v2/container/garray).

## Append

**Description:** Appends data to the end of the array. You can add any number of strings. The `Append` method is an alias for `PushRight`.

**Format:**

```go
Append(value ...string) *StrArray
```

**Example:** Create an empty array, set the data, and then append new data to the end of the array.

```go
func ExampleStrArray_Append() {
    s := garray.NewStrArray()
    s.SetArray(g.SliceStr{"We", "are", "GF", "fans"})
    s.Append("a", "b", "c")
    fmt.Println(s)

    // Output:
    // ["We","are","GF","fans","a","b","c"]
}
```

## At

**Description:** Returns the data at the specified index of the array.

**Format:**

```go
At(index int) (value string)
```

**Example:** Create an array and find the data at index 2.

```go
func ExampleStrArray_At() {
    s := garray.NewStrArrayFrom(g.SliceStr{"We", "are", "GF", "fans", "!"})
    sAt := s.At(2)
    fmt.Println(sAt)

    // Output:
    // GF
}
```

## Chunk

**Description:** Splits the array into multiple arrays of a specified size. Returns `[][]string`. The last array may contain fewer elements than the specified size.

**Format:**

```go
Chunk(size int) [][]string
```

**Example:** Create an array and split it into chunks of size 3.

```go
func ExampleStrArray_Chunk() {
    s := garray.NewStrArrayFrom(g.SliceStr{"a", "b", "c", "d", "e", "f", "g", "h"})
    r := s.Chunk(3)
    fmt.Println(r)

    // Output:
    // [[a b c] [d e f] [g h]]
}
```

## Clear

**Description:** Removes all data from the current array.

**Format:**

```go
Clear() *StrArray
```

**Example:** Create an empty array, assign values, and then clear the data.

```go
func ExampleStrArray_Clear() {
    s := garray.NewStrArray()
    s.SetArray(g.SliceStr{"a", "b", "c", "d", "e", "f", "g", "h"})
    fmt.Println(s)
    fmt.Println(s.Clear())
    fmt.Println(s)

    // Output:
    // ["a","b","c","d","e","f","g","h"]
    // []
    // []
}
```

## Clone

**Description:** Clones the current array. Returns a copy that is identical to the current array.

**Format:**

```go
Clone() (newArray *StrArray)
```

**Example:** Create an empty array, assign values, and clone it.

```go
func ExampleStrArray_Clone() {
    s := garray.NewStrArray()
    s.SetArray(g.SliceStr{"a", "b", "c", "d", "e", "f", "g", "h"})
    r := s.Clone()
    fmt.Println(r)
    fmt.Println(s)

    // Output:
    // ["a","b","c","d","e","f","g","h"]
    // ["a","b","c","d","e","f","g","h"]
}
```

## Contains

**Description:** Checks if the array contains the specified string value. The check is case-sensitive. Returns a boolean value.

**Format:**

```go
Contains(value string) bool
```

**Example:** Create an empty array, set data, and check if it contains the specified values `e` and `z`.

```go
func ExampleStrArray_Contains() {
    s := garray.NewStrArray()
    s.SetArray(g.SliceStr{"a", "b", "c", "d", "e", "f", "g", "h"})
    fmt.Println(s.Contains("e"))
    fmt.Println(s.Contains("z"))

    // Output:
    // true
    // false
}
```

## ContainsI

**Description:** Checks if the array contains the specified string value, ignoring case. Returns a boolean value.

**Format:**

```go
ContainsI(value string) bool
```

**Example:** Create an empty array, set data, and check if it contains the specified values `E` and `z`.

```go
func ExampleStrArray_ContainsI() {
    s := garray.NewStrArray()
    s.SetArray(g.SliceStr{"a", "b", "c", "d", "e", "f", "g", "h"})
    fmt.Println(s.ContainsI("E"))
    fmt.Println(s.ContainsI("z"))

    // Output:
    // true
    // false
}
```

## CountValues

**Description:** Counts the number of occurrences of each value in the array. Returns a `map[string]int`.

**Format:**

```go
CountValues() map[string]int
```

**Example:** Create an array and count the number of occurrences of each string.

```go
func ExampleStrArray_CountValues() {
    s := garray.NewStrArrayFrom(g.SliceStr{"a", "b", "c", "c", "c", "d", "d"})
    fmt.Println(s.CountValues())

    // Output:
    // map[a:1 b:1 c:3 d:2]
}
```

## Fill

**Description:** Fills the array from the specified `startIndex` with the given `value` for a certain number of times. Returns an error if the operation fails.

**Format:**

```go
Fill(startIndex int, num int, value string) error
```

**Example:** Create an array and fill it with the string `here` starting from index 2, three times.

```go
func ExampleStrArray_Fill() {
    s := garray.NewStrArrayFrom(g.SliceStr{"a", "b", "c", "d", "e", "f", "g", "h"})
    s.Fill(2, 3, "here")
    fmt.Println(s)

    // Output:
    // ["a","b","here","here","here","f","g","h"]
}
```

## FilterEmpty

**Description:** Filters out empty strings from the array.

**Format:**

```go
FilterEmpty() *StrArray
```

**Example:** Create an array, assign values, and filter out the empty strings.

```go
func ExampleStrArray_FilterEmpty() {
    s := garray.NewStrArrayFrom(g.SliceStr{"a", "b", "", "c", "", "", "d"})
    fmt.Println(s.FilterEmpty())

    // Output:
    // ["a","b","c","d"]
}
```

## Get

**Description:** Returns the value at the specified `index` of the array. Returns two parameters: `value` and `found` (a boolean indicating if the value was found).

**Format:**

```go
Get(index int) (value string, found bool)
```

**Example:** Create an array, assign values, and get the value at index 3.

```go
func ExampleStrArray_Get() {
    s := garray.NewStrArrayFrom(g.SliceStr{"We", "are", "GF", "fans", "!"})
    sGet, sBool := s.Get(3)
    fmt.Println(sGet, sBool)

    // Output:
    // fans true
}
```

## InsertAfter

Description: Inserts a `value` after the specified index in the array. Returns an `error`.

**Format**:

```go
InsertAfter(index int, value string) error
```

**Example**: Create an array and insert the string "here" after the `value` at `index` 1.

```go
func ExampleStrArray_InsertAfter() {
    s := garray.NewStrArray()
    s.SetArray(g.SliceStr{"a", "b", "c", "d"})
    s.InsertAfter(1, "here")
    fmt.Println(s.Slice())

    // Output:
    // [a b here c d]
}
```

## InsertBefore

Description: Inserts a `value` before the specified `index` in the array. Returns an `error`.

**Format**:

```go
InsertBefore(index int, value string) error
```

**Example**: Create an array and insert the string "here" before the `value` at index 1.

```go
func ExampleStrArray_InsertBefore() {
    s := garray.NewStrArray()
    s.SetArray(g.SliceStr{"a", "b", "c", "d"})
    s.InsertBefore(1, "here")
    fmt.Println(s.Slice())

    // Output:
    // [a here b c d]
}
```

## Interfaces

Description: Returns the current array as a `[]interface{}`.

**Format**:

```go
Interfaces() []interface{}
```

**Example**: Create an array, initialize it, and print the contents as `[]interface{}`.

```go
func ExampleStrArray_Interfaces() {
    s := garray.NewStrArray()
    s.SetArray(g.SliceStr{"a", "b", "c", "d", "e", "f", "g", "h"})
    r := s.Interfaces()
    fmt.Println(r)

    // Output:
    // [a b c d e f g h]
}
```

## IsEmpty

Description: Checks whether the current array is empty. Returns `true` if empty, otherwise `false`.

**Format**:

```go
IsEmpty() bool
```

**Example**: Create two arrays and check whether they are empty.

```go
func ExampleStrArray_IsEmpty() {
    s := garray.NewStrArrayFrom(g.SliceStr{"a", "b", "", "c", "", "", "d"})
    fmt.Println(s.IsEmpty())
    s1 := garray.NewStrArray()
    fmt.Println(s1.IsEmpty())

    // Output:
    // false
    // true
}
```

## Iterator

Description: Iterates over the array.

**Format**:

```go
Iterator(f func(k int, v string) bool)
```

**Example**: Create an array and iterate over it.

```go
func ExampleStrArray_Iterator() {
    s := garray.NewStrArrayFrom(g.SliceStr{"a", "b", "c"})
    s.Iterator(func(k int, v string) bool {
        fmt.Println(k, v)
        return true
    })

    // Output:
    // 0 a
    // 1 b
    // 2 c
}
```

## IteratorAsc

Description: Iterates over the array in ascending order based on the given callback function `f`. If `f` returns `true`, continue iteration; otherwise, stop.

**Format**:

```go
IteratorAsc(f func(k int, v string) bool)
```

**Example**: Create an array and iterate over it in ascending order using a custom function.

```go
func ExampleStrArray_IteratorAsc() {
    s := garray.NewStrArrayFrom(g.SliceStr{"a", "b", "c"})
    s.IteratorAsc(func(k int, v string) bool {
        fmt.Println(k, v)
        return true
    })

    // Output:
    // 0 a
    // 1 b
    // 2 c
}
```

## IteratorDesc

Description: Iterates over the array in descending order based on the given callback function `f`. If `f` returns `true`, continue iteration; otherwise, stop.

**Format**:

```go
IteratorDesc(f func(k int, v string) bool)
```

**Example**: Create an array and iterate over it in descending order using a custom function.

```go
func ExampleStrArray_IteratorDesc() {
    s := garray.NewStrArrayFrom(g.SliceStr{"a", "b", "c"})
    s.IteratorDesc(func(k int, v string) bool {
        fmt.Println(k, v)
        return true
    })

    // Output:
    // 2 c
    // 1 b
    // 0 a
}
```

## Join

Description: Joins the elements of the array into a single string, using the given separator `glue`.

**Format**:

```go
Join(glue string) string
```

**Example**: Given the separator `,`, join the strings in the array.

```go
func ExampleStrArray_Join() {
    s := garray.NewStrArrayFrom(g.SliceStr{"a", "b", "c"})
    fmt.Println(s.Join(","))

    // Output:
    // a,b,c
}
```

## Len

Description: Returns the length of the array.

**Format**:

```go
Len() int
```

**Example**: Create a new array, initialize it, and get the length.

```go
func ExampleStrArray_Len() {
    s := garray.NewStrArray()
    s.SetArray(g.SliceStr{"a", "b", "c", "d", "e", "f", "g", "h"})
    fmt.Println(s.Len())

    // Output:
    // 8
}
```

## LockFunc

Description: Locks the array for writing using the callback function `f`.

**Format**:

```go
LockFunc(f func(array []string)) *StrArray 
```

**Example**: Create a new array and modify the last element under write-lock.

```go
func ExampleStrArray_LockFunc() {
    s := garray.NewStrArrayFrom(g.SliceStr{"a", "b", "c"})
    s.LockFunc(func(array []string) {
        array[len(array)-1] = "GF fans"
    })
    fmt.Println(s)

    // Output:
    // ["a","b","GF fans"]
}
```

## MarshalJSON

Description: Implements the JSON serialization interface for `json.Marshal`.

**Format**:

```go
MarshalJSON() ([]byte, error)
```

**Example**: Create a new JSON format data, serialize it, and print the corresponding result.

```go
func ExampleStrArray_MarshalJSON() {
    type Student struct {
        Id      int
        Name    string
        Lessons []string
    }
    s := Student{
        Id:      1,
        Name:    "john",
        Lessons: []string{"Math", "English", "Music"},
    }
    b, _ := json.Marshal(s)
    fmt.Println(string(b))

    // Output:
    // {"Id":1,"Name":"john","Lessons":["Math","English","Music"]}
}
```

## Merge

Description: Merges the contents of the specified array into the current array. The `array` parameter can be of any `garray` or slice type. The main difference between `Merge` and `Append` is that `Append` only supports slice types, while `Merge` supports more parameter types.

**Format**:

```go
Merge(array interface{}) *StrArray
```

**Example**: Create two new arrays `s1` and `s2`, and merge the contents of `s2` into `s1`.

```go
func ExampleStrArray_Merge() {
    s1 := garray.NewStrArray()
    s2 := garray.NewStrArray()
    s1.SetArray(g.SliceStr{"a", "b", "c"})
    s2.SetArray(g.SliceStr{"d", "e", "f"})
    s1.Merge(s2)
    fmt.Println(s1)

    // Output:
    // ["a","b","c","d","e","f"]
}
```

## NewStrArray

**Description:** Creates a new array. The `safe` parameter is optional and is a boolean indicating whether the array should be thread-safe. The default value is `False`.

**Format:**

```go
NewStrArray(safe ...bool) *StrArray
```

**Example:** Create an empty array and add data. Since the `safe` parameter is not specified, it defaults to non-thread-safe.

```go
func ExampleNewStrArray() {
    s := garray.NewStrArray()
    s.Append("We")
    s.Append("are")
    s.Append("GF")
    s.Append("Fans")
    fmt.Println(s.Slice())
    
    // Output:
    // [We are GF Fans]
}
```

## NewStrArrayFrom

**Description:** Creates a new array based on the given array content. The `safe` parameter is optional and is a boolean indicating whether the array should be thread-safe. The default value is `False`.

**Format:**

```go
NewStrArrayFrom(array []string, safe ...bool) *StrArray
```

**Example:** Create an array from the specified content. Since the `safe` parameter is not specified, it defaults to non-thread-safe.

```go
func ExampleNewStrArrayFrom() {
    s := garray.NewStrArrayFrom(g.SliceStr{"We", "are", "GF", "fans", "!"})
    fmt.Println(s.Slice(), s.Len(), cap(s.Slice()))

    // Output:
    // [We are GF fans !] 5 5
}
```

## NewStrArrayFromCopy

**Description:** Creates a new array from a copy of the given array content. The `safe` parameter is optional and is a boolean indicating whether the array should be thread-safe. The default value is `False`.

**Format:**

```go
NewStrArrayFromCopy(array []string, safe ...bool) *StrArray
```

**Example:** Create an array from the specified content. Since the `safe` parameter is not specified, it defaults to non-thread-safe.

```go
func ExampleNewStrArrayFromCopy() {
    s := garray.NewStrArrayFromCopy(g.SliceStr{"We", "are", "GF", "fans", "!"})
    fmt.Println(s.Slice(), s.Len(), cap(s.Slice()))

    // Output:
    // [We are GF fans !] 5 5
}
```

## NewStrArraySize

**Description:** Creates a new array with the given size and capacity. The `safe` parameter is optional and is a boolean indicating whether the array should be thread-safe. The default value is `False`.

**Format:**

```go
NewStrArraySize(size int, cap int, safe ...bool) *StrArray
```

**Example:** Create an empty array with a size of 3 and capacity of 5, then add data. Since the `safe` parameter is not specified, it defaults to non-thread-safe.

```go
func ExampleNewStrArraySize() {
    s := garray.NewStrArraySize(3, 5)
    s.Set(0, "We")
    s.Set(1, "are")
    s.Set(2, "GF")
    s.Set(3, "fans")
    fmt.Println(s.Slice(), s.Len(), cap(s.Slice()))

    // Output:
    // [We are GF] 3 5
}
```

## Pad

**Description:** Pads the array to the specified size with the given value. If `size` is positive, it pads from the right. If `size` is negative, it pads from the left. If `size` equals the array length, no padding is done.

**Format:**

```go
Pad(size int, value string) *StrArray
```

**Example:** Create a new array, pad it from the left with the string "here" to a size of 7, then pad it to a size of 10 from the right with the string "there".

```go
func ExampleStrArray_Pad() {
    s := garray.NewStrArrayFrom(g.SliceStr{"a", "b", "c"})
    s.Pad(7, "here")
    fmt.Println(s)
    s.Pad(-10, "there")
    fmt.Println(s)

    // Output:
    // ["a","b","c","here","here","here","here"]
    // ["there","there","there","a","b","c","here","here","here","here"]
}
```

## PopLeft

**Description:** Pops a string data from the left side of the array and returns the value. The updated array contains the remaining data. When the array is empty, `found` will be `false`.

**Format:**

```go
PopLeft() (value string, found bool)
```

**Example:** Create a new array, pop the leftmost data, and print the remaining data.

```go
func ExampleStrArray_PopLeft() {
    s := garray.NewStrArray()
    s.SetArray(g.SliceStr{"a", "b", "c", "d"})
    s.PopLeft()
    fmt.Println(s.Slice())

    // Output:
    // [b c d]
}
```

## PopLefts

**Description:** Pops multiple string data from the left side of the array. Returns the data as a slice. If `size` is greater than the array size, all data in the array is returned. If `size <= 0` or empty, it returns `nil`.

**Format:**

```go
PopLefts(size int) []string
```

**Example:** Create a new array, pop the leftmost 2 data items, and print the popped data and remaining data.

```go
func ExampleStrArray_PopLefts() {
    s := garray.NewStrArray()
    s.SetArray(g.SliceStr{"a", "b", "c", "d", "e", "f", "g", "h"})
    r := s.PopLefts(2)
    fmt.Println(r)
    fmt.Println(s)

    // Output:
    // [a b]
    // ["c","d","e","f","g","h"]
}
```

## PopRand

**Description:** Pops a random data item from the array and returns it. If the array is empty, `found` will be `false`.

**Format:**

```go
PopRand() (value string, found bool)
```

**Example:** Create a new array, pop a random data item, and print the popped data.

```go
func ExampleStrArray_PopRand() {
    s := garray.NewStrArray()
    s.SetArray(g.SliceStr{"a", "b", "c", "d", "e", "f", "g", "h"})
    r, _ := s.PopRand()
    fmt.Println(r)

    // May Output:
    // e
}
```

## PopRands

**Description:** Pops `size` random data items from the array and returns them as a slice. If `size <= 0` or empty, it returns `nil`.

**Format:**

```go
PopRands(size int) []string
```

**Example:** Create a new array, pop 2 random data items, and print the popped data.

```go
func ExampleStrArray_PopRands() {
    s := garray.NewStrArray()
    s.SetArray(g.SliceStr{"a", "b", "c", "d", "e", "f", "g", "h"})
    r := s.PopRands(2)
    fmt.Println(r)

    // May Output:
    // [e c]
}
```

## PopRight

**Description:** Pops a string data item from the right side of the array and returns the value. The updated array contains the remaining data. When the array is empty, `found` will be `false`.

**Format:**

```go
PopRight() (value string, found bool)
```

**Example:** Create a new array, pop the rightmost data, and print the remaining data.

```go
func ExampleStrArray_PopRight() {
    s := garray.NewStrArray()
    s.SetArray(g.SliceStr{"a", "b", "c", "d"})
    s.PopRight()
    fmt.Println(s.Slice())

    // Output:
    // [a b c]
}
```

## PopRights

**Description:** Pops multiple string data items from the right side of the array. Returns the data as a slice. If `size` is greater than the array size, all data in the array is returned. If `size <= 0` or empty, it returns `nil`.

**Format:**

```go
PopRights(size int) []string
```

**Example:** Create a new array, pop the rightmost 2 data items, and print the popped data and remaining data.

```go
func ExampleStrArray_PopRights() {
    s := garray.NewStrArray()
    s.SetArray(g.SliceStr{"a", "b", "c", "d", "e", "f", "g", "h"})
    r := s.PopRights(2)
    fmt.Println(r)
    fmt.Println(s)

    // Output:
    // [g h]
    // ["a","b","c","d","e","f"]
}
```

## PushLeft

**Description:** Pushes one or more strings onto the left side of the array.

**Format:**

```go
PushLeft(value ...string

) *StrArray
```

**Example:** Create a new array, push multiple strings onto the left side, and print the updated array.

```go
func ExampleStrArray_PushLeft() {
    s := garray.NewStrArray()
    s.SetArray(g.SliceStr{"a", "b", "c", "d"})
    s.PushLeft("We", "are", "GF", "fans")
    fmt.Println(s.Slice())

    // Output:
    // [We are GF fans a b c d]
}
```

## PushRight

**Description:** Pushes one or more strings onto the right side of the array.

**Format:**

```go
PushRight(value ...string) *StrArray
```

**Example:** Create a new array, push multiple strings onto the right side, and print the updated array.

```go
func ExampleStrArray_PushRight() {
    s := garray.NewStrArray()
    s.SetArray(g.SliceStr{"a", "b", "c", "d"})
    s.PushRight("We", "are", "GF", "fans")
    fmt.Println(s.Slice())

    // Output:
    // [a b c d We are GF fans]
}
```

## Rand

**Description:** Randomly selects one string from the array (non-destructive).

**Format:**

```go
Rand() (value string, found bool)
```

**Example:** Create a new array and randomly select one string.

```go
func ExampleStrArray_Rand() {
 s := garray.NewStrArrayFrom(g.SliceStr{"a", "b", "c", "d", "e", "f", "g", "h"})
 fmt.Println(s.Rand())

 // May Output:
 // c true
}
```

## Rands

**Description:** Randomly selects `size` number of strings from the array (non-destructive).

**Format:**

```go
Rands(size int) []string
```

**Example:** Create a new array and randomly select 3 strings.

```go
func ExampleStrArray_Rands() {
 s := garray.NewStrArrayFrom(g.SliceStr{"a", "b", "c", "d", "e", "f", "g", "h"})
 fmt.Println(s.Rands(3))

 // May Output:
 // [e h e]
}
```

## Range

**Description:** Retrieves data within a specified range from the array. In concurrent-safe mode, this method returns a slice copy.

**Format:**

```go
Range(start int, end ...int) []string
```

**Example:** Create a new array and get the data from index 2 to 5.

```go
func ExampleStrArray_Range() {
 s := garray.NewStrArray()
 s.SetArray(g.SliceStr{"a", "b", "c", "d", "e", "f", "g", "h"})
 r := s.Range(2, 5)
 fmt.Println(r)

 // Output:
 // [c d e]
}
```

## Remove

**Description:** Removes data at the specified `index` from the array. If the index exceeds the array boundary, `found` returns `false`.

**Format:**

```go
Remove(index int) (value string, found bool)
```

**Example:** Create a new array and remove the data at index 1.

```go
func ExampleStrArray_Remove() {
 s := garray.NewStrArray()
 s.SetArray(g.SliceStr{"a", "b", "c", "d"})
 s.Remove(1)
 fmt.Println(s.Slice())

 // Output:
 // [a c d]
}
```

## RemoveValue

**Description:** Removes the specified `value` from the array. If the value is found in the array, `found` returns `true`, otherwise `found` returns `false`.

**Format:**

```go
RemoveValue(value string) bool
```

**Example:** Create a new array and remove the value `b`.

```go
func ExampleStrArray_RemoveValue() {
 s := garray.NewStrArray()
 s.SetArray(g.SliceStr{"a", "b", "c", "d"})
 s.RemoveValue("b")
 fmt.Println(s.Slice())

 // Output:
 // [a c d]
}
```

## Replace

**Description:** Replaces the original string array with the specified string array, starting from the head of the original array.

**Format:**

```go
Replace(array []string) *StrArray
```

**Example:** Create a new array and replace it with the specified string array.

```go
func ExampleStrArray_Replace() {
 s := garray.NewStrArray()
 s.SetArray(g.SliceStr{"We", "are", "GF", "fans", "!"})
 fmt.Println(s.Slice())
 s.Replace(g.SliceStr{"Happy", "coding"})
 fmt.Println(s.Slice())

 // Output:
 // [We are GF fans !]
 // [Happy coding GF fans !]
}
```

## Reverse

**Description:** Reverses the order of all elements in the array.

**Format:**

```go
Reverse() *StrArray
```

**Example:** Create a new array, initialize it, reverse the order, and print the result.

```go
func ExampleStrArray_Reverse() {
 s := garray.NewStrArrayFrom(g.SliceStr{"a", "b", "c", "d", "e", "f", "g", "h"})
 fmt.Println(s.Reverse())

 // Output:
 // ["h","g","f","e","d","c","b","a"]
}
```

## RLockFunc

**Description:** Applies a read lock to the array with a custom callback function `f`.

**Format:**

```go
RLockFunc(f func(array []string)) *StrArray
```

**Example:** Create a new array, iterate through it in the callback function `f`, and print the elements.

```go
func ExampleStrArray_RLockFunc() {
 s := garray.NewStrArrayFrom(g.SliceStr{"a", "b", "c", "d", "e"})
 s.RLockFunc(func(array []string) {
  for i := 0; i < len(array); i++ {
   fmt.Println(array[i])
  }
 })

 // Output:
 // a
 // b
 // c
 // d
 // e
}
```

## Search

**Description:** Searches for a specified string in the array and returns its index. If not found, returns -1.

**Format:**

```go
Search(value string) int
```

**Example:** Create a new array and search for the strings `e` and `z`.

```go
func ExampleStrArray_Search() {
 s := garray.NewStrArray()
 s.SetArray(g.SliceStr{"a", "b", "c", "d", "e", "f", "g", "h"})
 fmt.Println(s.Search("e"))
 fmt.Println(s.Search("z"))

 // Output:
 // 4
 // -1
}
```

## Set

**Description:** Sets the value `value` at the specified `index` in the array. If `index` < 0 or exceeds the array boundary, returns an error.

**Format:**

```go
Set(index int, value string) error
```

**Example:** Create a new array with a length of 3, set values, and print the result.

```go
func ExampleStrArray_Set() {
 s := garray.NewStrArraySize(3, 5)
 s.Set(0, "We")
 s.Set(1, "are")
 s.Set(2, "GF")
 s.Set(3, "fans")
 fmt.Println(s.Slice())

 // Output:
 // [We are GF]
}
```

## SetArray

**Description:** Assigns values to the array from the given slice.

**Format:**

```go
SetArray(array []string) *StrArray
```

**Example:** Create a new array, assign values, and print the result.

```go
func ExampleStrArray_SetArray() {
 s := garray.NewStrArray()
 s.SetArray(g.SliceStr{"We", "are", "GF", "fans", "!"})
 fmt.Println(s.Slice())

 // Output:
 // [We are GF fans !]
}
```

## Shuffle

**Description:** Shuffles the content of the array.

**Format:**

```go
Shuffle() *StrArray
```

**Example:** Create a new array, shuffle it, and print the result.

```go
func ExampleStrArray_Shuffle() {
 s := garray.NewStrArrayFrom(g.SliceStr{"a", "b", "c", "d", "e", "f", "g", "h"})
 fmt.Println(s.Shuffle())

 // May Output:
 // ["a","c","e","d","b","g","f","h"]
}
```

## Slice

**Description:** Retrieves the slice data of the array. In concurrent-safe mode, returns a copy of the data; otherwise, returns a pointer to the data.

**Format:**

```go
Slice() []string
```

**Example:** Create a new array, assign values, and print the slice data.

```go
func ExampleStrArray_Slice() {
 s := garray.NewStrArray()
 s.SetArray(g.SliceStr{"a", "b", "c", "d", "e", "f", "g", "h"})
 fmt.Println(s.Slice())

 // Output:
 // [a b c d e f g h]
}
```

## Sort

**Description:** Sorts the contents of the array in ascending order. The `reverse` parameter controls the sorting direction: `true` for ascending (default) and `false` for descending.

**Format:**

```go
Sort(reverse ...bool) *StrArray
```

**Example:** Create a new array, assign values, and sort them in ascending order.

```go
func ExampleStrArray_Sort() {
 s := garray.NewStrArray()
 s.SetArray(g.SliceStr{"b", "d", "a", "c"})
 a := s.Sort()
 fmt.Println(a)

 // Output:
 // ["a","b","c","d"]
}
```

## SortFunc

**Description:** Sorts the array contents using a custom `less` function.

**Format:**

```go
SortFunc(less func(v1, v2 string) bool) *StrArray
```

**Example:** Create a new array, assign values, sort it in descending order using a custom function, and then sort it in ascending order using another custom function.

```go
func ExampleStrArray_SortFunc() {
 s := garray.NewStrArrayFrom(g.SliceStr{"b", "c", "a"})
 fmt.Println(s)
 s.SortFunc(func(v1, v2 string) bool {
  return gstr.Compare(v1, v2) > 0
 })
 fmt.Println(s)
 s.SortFunc(func(v1, v2 string) bool {
  return gstr.Compare(v1, v2) < 0
 })
 fmt.Println(s)

 // Output:
 // ["b","c","a"]
 // ["c","b","a"]
 // ["a","b","c"]
}
```

## String

**Description:** Converts the current array to a string.

**Format:**

```go
String() string
```

**Example:** Create a new array, assign values, convert it to a string, and print the result.

```go
func ExampleStrArray_String() {
 s := garray.NewStrArrayFrom(g.SliceStr{"a", "b", "c"})
 fmt.Println(s.String())

 // Output:
 // ["a","b","c"]
}
```

## Subslice

**Description:** Retrieves a slice of the array based on the given `offset` and `length` parameters. If `offset` is non-negative, slicing starts from the beginning; otherwise, it starts from the end. Returns a copy of the data in concurrent-safe mode or a pointer to the data otherwise.

**Format:**

```go
SubSlice(offset int, length ...int) []string
```

**Example:** Create a new array, assign values, and get a slice from offset 3 with length 4.

```go
func ExampleStrArray_SubSlice() {
 s := garray.NewStrArray()
 s.SetArray(g.SliceStr{"a", "b", "c", "d", "e", "f", "g", "h"})
 r := s.SubSlice(3, 4)
 fmt.Println(r)

 // Output:
 // [d e f g]
}
```

## Sum

**Description:** Calculates the sum of integer values in the array.

**Format:**

```go
Sum() (sum int)
```

**Example:** Create a new array, assign integer values, and compute the sum.

```go
func ExampleStrArray_Sum() {
 s := garray.NewStrArray()
 s.SetArray(g.SliceStr{"3", "5", "10"})
 a := s.Sum()
 fmt.Println(a)

 // Output:
 // 18
}
```

## Unique

**Description:** Removes duplicate values from the array.

**Format:**

```go
Unique() *StrArray
```

**Example:** Create a new array, assign values with duplicates, and remove the duplicates.

```go
func ExampleStrArray_Unique() {
 s := garray.NewStrArray()
 s.SetArray(g.SliceStr{"a", "b", "c", "c", "c", "d", "d"})
 fmt.Println(s.Unique())

 // Output:
 // ["a","b","c","d"]
}
```

## UnmarshalJSON

**Description:** Implements the `json.Unmarshal` interface.

**Format:**

```go
UnmarshalJSON(data []byte) error
```

**Example:** Create a byte slice, assign it to a struct, perform deserialization, and print the result.

```go
func ExampleStrArray_UnmarshalJSON() {
 b := []byte(`{"Id":1,"Name":"john","Lessons":["Math","English","Sport"]}`)
 type Student struct {
  Id      int
  Name    string
  Lessons *garray.StrArray
 }
 s := Student{}
 json.Unmarshal(b, &s)
 fmt.Println(s)

 // Output:
 // {1 john ["Math","English","Sport"]}
}
```

## UnmarshalValue

**Description:** Deserializes any type of value.

**Format:**

```go
UnmarshalValue(value interface{}) error
```

**Example:** Create a struct, deserialize values into it, and print the result.

```go
func ExampleStrArray_UnmarshalValue() {
 type Student struct {
  Name    string
  Lessons *garray.StrArray
 }
 var s *Student
 gconv.Struct(g.Map{
  "name":    "john",
  "lessons": []byte(`["Math","English","Sport"]`),
 }, &s)
 fmt.Println(s)

 var s1 *Student
 gconv.Struct(g.Map{
  "name":    "john",
  "lessons": g.SliceStr{"Math", "English", "Sport"},
 }, &s1)
 fmt.Println(s1)

 // Output:
 // &{john ["Math","English","Sport"]}
 // &{john ["Math","English","Sport"]}
}
```

## Walk

**Description:** Applies a custom function `f` to modify the array contents.

**Format:**

```go
Walk(f func(value string) string) *StrArray
```

**Example:** Create an array, apply a prefix to each string, and print the result.

```go
func ExampleStrArray_Walk() {
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
