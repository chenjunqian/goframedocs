# Queue Type gqueue

## Introduction

A dynamically-sized concurrency-safe queue. The `gqueue` package also supports a fixed queue size, where its performance is equivalent to that of the standard library's channel.

### Usage Scenarios

This queue is concurrency-safe and is commonly used in scenarios where multiple goroutines communicate with each other and where dynamic queue sizing is required.

### Usage

```go
import "github.com/gogf/gf/v2/container/gqueue"
```

### API Documentation

[API Documentation for gqueue](https://pkg.go.dev/github.com/gogf/gf/v2/container/gqueue)
