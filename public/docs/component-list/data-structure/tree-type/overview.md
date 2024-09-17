# Tree Type gtree

## Overview

`gtree` is a tree-based container that supports an optional concurrent safety switch. The key characteristics of the tree data structure include:

- Support for ordered traversal
- Low memory consumption
- Stable complexity
- Suitable for storing large volumes of data

This module includes several types of tree-based containers:

```bash
| Tree Type       | Full Name            | Complexity | Ordered | Concurrent Safe | Characteristics                    |
|-----------------|----------------------|------------|---------|-----------------|------------------------------------|
| RedBlackTree    | Red-Black Tree       | O(log N)   | Yes     | Yes             | Good write performance             |
| AVLTree         | Height-Balanced Tree | O(log N)   | Yes     | Yes             | Best for search performance        |
| BTree           | B-Tree/B-Tree        | O(log N)   | Yes     | Yes             | Commonly used for external storage |
```

For more details on binary trees, refer to this link: [Binary Tree - Wikipedia](https://en.wikipedia.org/wiki/Binary_tree).

### Use Cases

- Associative arrays
- Sorted key-value pair storage
- Large data volume in-memory CRUD operations

### How to Use

```go
import "github.com/gogf/gf/v2/container/gtree"
```

### API Documentation

You can refer to the official API documentation for `gtree` [here](https://pkg.go.dev/github.com/gogf/gf/v2/container/gtree).

The APIs of these tree-based containers are very similar, with the main difference being the sorting function provided at initialization.

The `gutil` module offers several commonly used comparison methods for basic types, which can be directly used in your program. Example usage will be provided later in the documentation.

Here are some of the common comparison functions:

```go
func ComparatorByte(a, b interface{}) int
func ComparatorFloat32(a, b interface{}) int
func ComparatorFloat64(a, b interface{}) int
func ComparatorInt(a, b interface{}) int
func ComparatorInt16(a, b interface{}) int
func ComparatorInt32(a, b interface{}) int
func ComparatorInt64(a, b interface{}) int
func ComparatorInt8(a, b interface{}) int
func ComparatorRune(a, b interface{}) int
func ComparatorString(a, b interface{}) int
func ComparatorTime(a, b interface{}) int
func ComparatorUint(a, b interface{}) int
func ComparatorUint16(a, b interface{}) int
func ComparatorUint32(a, b interface{}) int
func ComparatorUint64(a, b interface{}) int
func ComparatorUint8(a, b interface{}) int
```
