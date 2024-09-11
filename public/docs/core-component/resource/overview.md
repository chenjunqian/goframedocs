# Resource - Overview

## Introduction

Resource management allows packaging any files or directories into Go source files and compiling them into an executable file, which can then be distributed together.

When the program starts, the resource files will automatically decompress and load into memory for read-only access, effectively acting as an in-memory file manager. The resource management feature of GoFrame also supports packaging files or directories as standalone binary resource files. Since resource files operate in memory during program execution, they avoid disk I/O overhead, resulting in very high file operation efficiency.

### Usage

```go
import "github.com/gogf/gf/v2/os/gres"
```

For more details, please refer to the [API documentation](https://pkg.go.dev/github.com/gogf/gf/v2/os/gres).

## Component Features

The `gres` resource management component has the following notable features:

- Ability to package any files or directories as `Go` files, with support for custom encryption and decryption.
- Automatically compresses packaged `Go` files or resource files, achieving a compression rate of 50-90% for common files such as `CSS/JS`.
- Supports easy export of packaged resource content to the local file system.
- Resource manager contents are entirely memory-based and read-only, preventing dynamic modifications.
- Resource manager is integrated by default with `WebServer`, configuration management, and template engine modules.
- Any files, such as website static files or configuration files, can be compiled into a binary file or into the published executable.
- Developers can compile and release a single executable file, simplifying software distribution and providing a potential way to protect intellectual property.

## Comparison with embed.FS

Since `Golang v1.16`, the `embed.FS` feature has been provided for embedding static files. The underlying design of `embed.FS` is similar to the `gres` component, with comparable compression ratios and execution efficiency. However, there are significant differences in usage design and engineering management.

The `GoFrame` resource management component offers richer features. The core components of the framework are fully integrated with the `gres` resource management component, allowing developers to use resource management features transparently under `GoFrame`'s standard engineering management practices. For more details, refer to the section on [Resource - Best Practices](/docs/core-component/resource/best-practices).

`GoFrame`'s core framework does not plan to natively support `embed.FS`. Both `embed.FS` and the `gres` component can be used independently without affecting each other.
