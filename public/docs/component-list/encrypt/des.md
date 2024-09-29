# DES Algorithm - gdes

## Usage Example

To use the DES algorithm in your project, import the following package:

```go
import "github.com/gogf/gf/v2/crypto/gdes"
```

## API Documentation

You can refer to the official API documentation for more information on available methods and functions:  
[https://pkg.go.dev/github.com/gogf/gf/v2/crypto/gdes](https://pkg.go.dev/github.com/gogf/gf/v2/crypto/gdes)

## Padding Methods

In the `gdes` package, two padding methods are supported:

- **PKCS5PADDING**
- **NOPADDING**

When using the **NOPADDING** method, you will need to implement a custom padding method as it does not provide padding by default.

For the **Triple DES algorithm**, when the key length is 16 bytes, the third key (`key3`) is considered equal to the first key (`key1`).
