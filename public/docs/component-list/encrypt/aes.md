# AES Algorithm - gaes

## Usage Example

To use the AES algorithm in your project, import the following package:

```go
import "github.com/gogf/gf/v2/crypto/gaes"
```

## API Documentation

You can refer to the official API documentation for detailed information on available methods and functions:  
[https://pkg.go.dev/github.com/gogf/gf/v2/crypto/gaes](https://pkg.go.dev/github.com/gogf/gf/v2/crypto/gaes)

## Tips

- If the data you want to decrypt is encoded (e.g., Base64), you must first **decode** the data before decrypting it.
  
  For example:
  
  ```go
  decodedData := base64.decode(encryptedData)
  ```
  
- Similarly, after encrypting data, you can encode it if needed, like using Base64 encoding.

  For example:
  
  ```go
  encodedData := base64.encode(encryptedData)
  ```
