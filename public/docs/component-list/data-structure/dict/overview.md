# Dictionary Type - gmap

## Overview

The `gmap` module provides a map container with concurrency-safe options and is one of the most commonly used data structures. This module includes several map container types: `HashMap`, `ListMap`, and `TreeMap`.

- **HashMap**: Hash table with O(1) complexity, no ordering, high-performance read and write operations, and high memory usage. Supports random traversal.
- **ListMap**: Hash table combined with a doubly linked list, O(2) complexity, supports traversal in the order of insertion, and has high memory usage.
- **TreeMap**: Red-Black Tree with O(log N) complexity, supports key name sorting and ordered traversal, and has compact memory usage.

Additionally, the `gmap` module supports several common types of maps based on hash tables, including:

- `IntIntMap`
- `IntStrMap`
- `IntAnyMap`
- `StrIntMap`
- `StrStrMap`
- `StrAnyMap`

## Use Cases

Suitable for any scenario involving `maps/hash` `tables/associative arrays`, especially in concurrency-safe situations.

## Usage

To use the `gmap` module, import it with the following statement:

```go
import "github.com/gogf/gf/v2/container/gmap"
```

## API Documentation

For more details, refer to the official API documentation at [pkg.go.dev](https://pkg.go.dev/github.com/gogf/gf/v2/container/gmap).
