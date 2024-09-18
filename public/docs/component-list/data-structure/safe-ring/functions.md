# Safe Ring - Method Introduction

Below is a list of common methods for the `gring` package. Please note that the documentation may lag behind new features in the code. For more methods and examples, refer to the official code documentation: [gring API Documentation](https://pkg.go.dev/github.com/gogf/gf/v2/container/gring).

## New

**Description**: `New` creates and returns a ring structure with `cap` elements. An optional parameter `safe` specifies whether to use the structure in a concurrent-safe environment. By default, `safe` is set to `false`.

**Signature**:

```go
New(cap int, safe ...bool) *Ring
```

**Example**:

```go
func ExampleNew() {
    // Non-concurrent safety
    gring.New(10)

    // Concurrent safety
    gring.New(10, true)

    // Output:
}
```

## Val

**Description**: `Val` returns the value at the current position.

**Signature**:

```go
Val() interface{}
```

**Example**:

```go
func ExampleRing_Val() {
    r := gring.New(10)
    r.Set(1)
    fmt.Println("Val:", r.Val())

    r.Next().Set("GoFrame")
    fmt.Println("Val:", r.Val())

    // Output:
    // Val: 1
    // Val: GoFrame
}
```

## Len

**Description**: `Len` returns the size of the ring.

**Signature**:

```go
Len() int
```

**Example**:

```go
func ExampleRing_Len() {
    r1 := gring.New(10)
    for i := 0; i < 5; i++ {
        r1.Set(i).Next()
    }
    fmt.Println("Len:", r1.Len())

    r2 := gring.New(10, true)
    for i := 0; i < 10; i++ {
        r2.Set(i).Next()
    }
    fmt.Println("Len:", r2.Len())

    // Output:
    // Len: 5
    // Len: 10
}
```

## Cap

**Description**: `Cap` returns the capacity of the ring.

**Signature**:

```go
Cap() int
```

**Example**:

```go
func ExampleRing_Cap() {
    r1 := gring.New(10)
    for i := 0; i < 5; i++ {
        r1.Set(i).Next()
    }
    fmt.Println("Cap:", r1.Cap())

    r2 := gring.New(10, true)
    for i := 0; i < 10; i++ {
        r2.Set(i).Next()
    }
    fmt.Println("Cap:", r2.Cap())

    // Output:
    // Cap: 10
    // Cap: 10
}
```

## Set

**Description**: `Set` sets the value for the current position in the ring.

**Signature**:

```go
Set(value interface{}) *Ring
```

**Example**:

```go
func ExampleRing_Set() {
    r := gring.New(10)
    r.Set(1)
    fmt.Println("Val:", r.Val())

    r.Next().Set("GoFrame")
    fmt.Println("Val:", r.Val())

    // Output:
    // Val: 1
    // Val: GoFrame
}
```

## Put

**Description**: `Put` sets the value for the current position in the ring and then moves the ring to the next position.

**Signature**:

```go
Put(value interface{}) *Ring
```

**Example**:

```go
func ExampleRing_Put() {
    r := gring.New(10)
    r.Put(1)
    fmt.Println("Val:", r.Val())
    fmt.Println("Val:", r.Prev().Val())

    // Output:
    // Val: <nil>
    // Val: 1
}
```

## Move

**Description**: Moves `n % r.Len()` nodes either forward or backward in the ring, returning the position after the move. If `n >= 0`, it moves forward; if `n < 0`, it moves backward.

**Signature**:

```go
Move(n int) *Ring
```

**Example**:

```go
func ExampleRing_Move() {
    r := gring.New(10)
    for i := 0; i < 10; i++ {
        r.Set(i).Next()
    }
    // Ring at position 0
    fmt.Println("CurVal:", r.Val())

    r.Move(5)

    // Ring at position 5
    fmt.Println("CurVal:", r.Val())

    // Output:
    // CurVal: 0
    // CurVal: 5
}
```

## Prev

**Description**: `Prev` returns the element at the previous position in the ring.

**Signature**:

```go
Prev() *Ring
```

**Example**:

```go
func ExampleRing_Prev() {
    r := gring.New(10)
    for i := 0; i < 5; i++ {
        r.Set(i).Next()
    }

    fmt.Println("Prev:", r.Prev().Val())
    fmt.Println("Prev:", r.Prev().Val())

    // Output:
    // Prev: 4
    // Prev: 3
}
```

## Next

**Description**: `Next` returns the element at the next position in the ring.

**Signature**:

```go
Next() *Ring
```

**Example**:

```go
func ExampleRing_Next() {
    r := gring.New(10)
    for i := 5; i > 0; i-- {
        r.Set(i).Prev()
    }

    fmt.Println("Next:", r.Next().Val())
    fmt.Println("Next:", r.Next().Val())

    // Output:
    // Next: 1
    // Next: 2
}
```

## Link

**Description**:

1. `Link` connects ring `r` to ring `s`, making `r.Next()` point to `s` and returns the original value of `r.Next()`. `r` cannot be `nil`. After linking, the size and capacity of the new ring `r` will be the sum of the sizes and capacities of `r` and `s`.
2. If `r` and `s` point to the same ring, connecting them will remove the elements between `r` and `s` in the ring. The removed elements will form a subring, which is returned as a reference.
3. If `r` and `s` point to different rings, connecting them will insert the elements of `s` after `r`.

**Signature**:

```go
(r *Ring) Link(s *Ring) *Ring
```

**Example (Linking two different rings)**:

```go
func ExampleRing_Link_Common() {
    r := gring.New(10)
    for i := 0; i < 5; i++ {
        r.Set(i).Next()
    }

    s := gring.New(10)
    for i := 0; i < 10; i++ {
        val := i + 5
        s.Set(val).Next()
    }

    r.Link(s) // Link Ring s to Ring r

    fmt.Println("Len:", r.Len())
    fmt.Println("Cap:", r.Cap())
    fmt.Println(r.SlicePrev())
    fmt.Println(r.SliceNext())

    // Output:
    // Len: 15
    // Cap: 20
    // [4 3 2 1 0]
    // [5 6 7 8 9 10 11 12 13 14]
}
```

**Example (Linking the same ring)**:

```go
func ExampleRing_Link_SameRing() {
    r := gring.New(10)
    for i := 0; i < 5; i++ {
        r.Set(i).Next()
    }

    same_r := r.Link(r.Prev())

    fmt.Println("Len:", same_r.Len())
    fmt.Println("Cap:", same_r.Cap())
    fmt.Println(same_r.SlicePrev())
    fmt.Println(same_r.SliceNext())

    // Output:
    // Len: 1
    // Cap: 1
    // [4]
    // [4]
}
```

## Unlink

**Description**: `Unlink` removes `n % r.Len()` elements from the ring, starting from `r.Next()`. If `n % r.Len() == 0`, the ring remains unchanged. The removed elements are returned as a subring.

**Signature**:

```go
Unlink(n int) *Ring
```

**Example**:

```go
func ExampleRing_Unlink() {
    r := gring.New(10)
    for i := 0; i < 10; i++ {
        r.Set(i).Next()
    }

    fmt.Println("Before Unlink, Len:", r.Len())
    fmt.Println("Before Unlink, Cap:", r.Cap())
    fmt.Println("Before Unlink, ", r.SlicePrev())
    fmt.Println("Before Unlink, ", r.SliceNext())

    r.Unlink(7)

    fmt.Println("After Unlink, Len:", r.Len())
    fmt.Println("After Unlink, Cap:", r.Cap())
    fmt.Println("After Unlink, ", r.SlicePrev())
    fmt.Println("After Unlink, ", r.SliceNext())

    // Output:
    // Before Unlink, Len: 10
    // Before Unlink, Cap: 10
    // Before Unlink,  [0 9 8 7 6 5 4 3 2 1]
    // Before Unlink,  [0 1 2 3 4 5 6 7 8 9]
    // After Unlink, Len: 7
    // After Unlink, Cap: 7
    // After Unlink,  [1 7 6 5 4 3 2]
    // After Unlink,  [1 2 3 4 5 6 7]
}
```

## RLockIteratorNext

**Description**: `RLockIteratorNext` iterates over the ring with a read lock (`RWMutex.RLock`), calling the provided function `f` for each element in forward order. If `f` returns `true`, iteration continues; if `f` returns `false`, iteration stops.

**Signature**:

```go
RLockIteratorNext(f func(value interface{}) bool)
```

**Example**:

```go
func ExampleRing_RLockIteratorNext() {
    r := gring.New(10)
    for i := 0; i < 10; i++ {
        r.Set(i).Next()
    }

    r.RLockIteratorNext(func(value interface{}) bool {
        if value.(int) < 5 {
            fmt.Println("IteratorNext Success, Value:", value)
            return true
        }

        return false
    })

    // Output:
    // IteratorNext Success, Value: 0
    // IteratorNext Success, Value: 1
    // IteratorNext Success, Value: 2
    // IteratorNext Success, Value: 3
    // IteratorNext Success, Value: 4
}
```

## RLockIteratorPrev

**Description**: `RLockIteratorPrev` iterates over the ring with a read lock (`RWMutex.RLock`), calling the provided function `f` for each element in reverse order. If `f` returns `true`, iteration continues; if `f` returns `false`, iteration stops.

**Signature**:

```go
RLockIteratorPrev(f func(value interface{}) bool)
```

**Example**:

```go
func ExampleRing_RLockIteratorPrev() {
    r := gring.New(10)
    for i := 0; i < 10; i++ {
        r.Set(i).Next()
    }

    // move r to pos 9
    r.Prev()

    r.RLockIteratorPrev(func(value interface{}) bool {
        if value.(int) >= 5 {
            fmt.Println("IteratorPrev Success, Value:", value)
            return true
        }

        return false
    })

    // Output:
    // IteratorPrev Success, Value: 9
    // IteratorPrev Success, Value: 8
    // IteratorPrev Success, Value: 7
    // IteratorPrev Success, Value: 6
    // IteratorPrev Success, Value: 5
}
```

## SliceNext

**Description**: `SliceNext` returns a slice containing copies of all elements starting from the current position and moving forward in the ring.

**Signature**:

```go
SliceNext() []interface{}
```

**Example**:

```go
func ExampleRing_SliceNext() {
    r := gring.New(10)
    for i := 0; i < 10; i++ {
        r.Set(i).Next()
    }

    fmt.Println(r.SliceNext())

    // Output:
    // [0 1 2 3 4 5 6 7 8 9]
}
```

## SlicePrev

**Description**: `SlicePrev` returns a slice containing copies of all elements starting from the current position and moving backward in the ring.

**Signature**:

```go
SlicePrev() []interface{}
```

**Example**:

```go
func ExampleRing_SlicePrev() {
    r := gring.New(10)
    for i := 0; i < 10; i++ {
        r.Set(i).Next()
    }

    fmt.Println(r.SlicePrev())

    // Output:
    // [0 9 8 7 6

 5 4 3 2 1]
}
```
