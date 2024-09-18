# Safe Ring - gring

## Basic Introduction

The `gring` package provides a `ring` structure that supports a `thread-safe` toggle, utilizing a circular doubly linked list.

***Usage Scenarios***

The `ring` data structure is often used in lower-level development scenarios, such as:

- Concurrency lock control
- Buffer control

The key characteristic of a `ring` is that it has a fixed size. When continuously appending data to the `ring`, if the size of the data exceeds the capacity of the `ring`, new values will overwrite the old ones.

***How to Use***

To use `gring` in your Go project, first import the package:

```go
import "github.com/gogf/gf/v2/container/gring"
```

## API Documentation

For the full API documentation, please visit the following link:

[gring API Documentation](https://pkg.go.dev/github.com/gogf/gf/v2/container/gring)

The `gring` package supports chained operations for easier manipulation and code readability.
