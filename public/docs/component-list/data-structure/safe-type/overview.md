# Safe Type - gtype

## Introduction

A basic type for concurrency safety.

### Usage Scenarios

The `gtype` package is frequently used in any scenario requiring concurrency safety.

In typical concurrency safety scenarios, a basic type variable, especially a `struct` containing several attributes, is often managed with a mutex (read/write) lock or multiple (read/write) locks. However, in such usage, the performance of operations on variables, structs, or attributes can be quite low, and the mutex mechanism often makes the operations complex and requires careful maintenance to ensure concurrency safety of the variables/attributes (especially with (RW)Mutex).

The `gtype` package provides corresponding concurrency-safe data types for the most commonly used basic data types, making it easier to maintain the concurrency safety of variables/attributes in concurrent environments. Developers no longer need to create and maintain complex (RW)Mutex in structs. Since `gtype` maintains the concurrency safety of basic types, it mainly uses atomic operations internally to maintain concurrency safety, which is often tens of times more efficient than using (RW)Mutex locks.

### Usage

```go
import "github.com/gogf/gf/v2/container/gtype"
```

### API Documentation

[API Documentation for gtype](https://pkg.go.dev/github.com/gogf/gf/v2/container/gtype)
