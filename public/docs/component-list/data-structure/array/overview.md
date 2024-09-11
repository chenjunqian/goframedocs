# Array Type - garray

## Basic Introduction

The `garray` package provides a container for arrays, including both regular and sorted arrays. It supports unique value correction and thread safety controls.

**Use Cases**:

- Array manipulation.

**How to Use**:

```go
import "github.com/gogf/gf/v2/container/garray"
```

**Interface Documentation**:

- [garray Interface Documentation](https://pkg.go.dev/github.com/gogf/gf/v2/container/garray)

**Brief Explanation**:

The `garray` module contains various objects and methods. It is recommended to carefully review the interface documentation.  
`garray` supports three common data types: `int`, `string`, and `interface{}`.  
`garray` provides both regular and sorted arrays. The struct names for regular arrays are defined with the suffix `*Array`, while sorted arrays have the prefix `Sorted*Array`. Examples include:

- Regular Arrays: `Array`, `IntArray`, `StrArray`.
- Sorted Arrays: `SortedArray`, `SortedIntArray`, `SortedStrArray`.

The sorted arrays (`SortedArray`) require a custom comparison function. The utility package `gutil` provides several predefined comparison methods, such as `Comparator*`.
