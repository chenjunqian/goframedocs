# Redis - Overview

## Basic Introduction

The Redis client is implemented using the `gredis` component, and it uses a connection pool design at its core.

To ensure both generality and extensibility, the `gredis` component executes Redis operations through a command channel. If you're unsure how to pass parameters to the command channel, you can refer to how parameters are passed in terminal command lines. In other words, all operations follow the same rules as command line parameter passing.

### Usage

***Installation***

```bash
go get -u github.com/gogf/gf/contrib/nosql/redis/v2
```

***Usage***

```go
import (
 _ "github.com/gogf/gf/contrib/nosql/redis/v2"
 // other imported packages.
)
```

***API Documentation***

- <https://pkg.go.dev/github.com/gogf/gf/v2/database/gredis>
- <https://github.com/gogf/gf/tree/master/contrib/nosql/redis>

### Brief Overview

`gredis` uses a connection pool to manage Redis connections. You can manage the connection pool’s properties through the `Config` object or various `Set*` methods. The `Stats` method allows you to get statistical information about the connection pool. `gredis` adopts an interface-based design to decouple its dependency on the Redis backend. Through community contributions, it has implemented over 100 commonly used methods, and it provides grouping mechanisms for managing interfaces.

The `gredis.Redis` client object offers a `Close` method, which is used to close the Redis client (and its connection pool), not just the connection object. Most developers will rarely use this method; it’s not recommended for general users unless you are an advanced user.

## Component Features

`gredis` has the following notable features:

- Easy to use, yet powerful
- Unified configuration for setting up the component
- Provides over 100 commonly used methods, implemented by community contributions
- Supports both single instance and clustered operations
- Supports all Redis features
- Supports OpenTelemetry observability
- Supports both singleton objects and dynamic object creation
- Interface-based design, providing high flexibility and extensibility
