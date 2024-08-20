# Error - Compare

## Equal Compare

Error object support comparison, `Equal` method is used to check if two error objects are equal.

```go
// Equal reports whether current error `err` equals to error `target`.
// Please note that, in default comparison for `Error`,
// the errors are considered the same if both the `code` and `text` of them are the same.
func Equal(err, target error) bool
```

### Equal Interface Definition

Implement below interface to customize the `error` comparison.

```go
Equal(target error) bool
```

Through the `Goframe` error component, the created error objects have implemented this interface, with the component defaulting to logical comparison based on error codes and error messages.

It should be noted that if two errors do not carry error codes and have identical error messages, the component considers the two errors to be equal.

Example:

```go
func ExampleEqual() {
    err1 := errors.New("permission denied")
    err2 := gerror.New("permission denied")
    err3 := gerror.NewCode(gcode.CodeNotAuthorized, "permission denied")
    fmt.Println(gerror.Equal(err1, err2))
    fmt.Println(gerror.Equal(err2, err3))

    // Output:
    // true
    // false
}
```

## Is Compare

The `Is` method is used to check if a given `error` is within a specified `error` chain (if the `error` has a stack, it will recursively check it).

```go
// Is reports whether current error `err` has error `target` in its chaining errors.
// It is just for implements for stdlib errors.Unwrap from Go version 1.17.
func Is(err, target error) bool
```

### Is Interface Definition

```go
Is(target error) bool
```

`goframe` error component has already implemented this interface.

Note that error objects created through the `errors` standard library are the most primitive error objects, carrying only error strings and not implementing the `Is` interface, they do not support `Is` determination.

```go
func ExampleIs() {
    err1 := errors.New("permission denied")
    err2 := gerror.Wrap(err1, "operation failed")
    fmt.Println(gerror.Is(err1, err1))
    fmt.Println(gerror.Is(err2, err2))
    fmt.Println(gerror.Is(err2, err1))
    fmt.Println(gerror.Is(err1, err2))

    // Output:
    // false
    // true
    // true
    // false
}
```
