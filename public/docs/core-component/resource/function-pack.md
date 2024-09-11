# Resource - Function Packaging

> This section demonstrates the packaging/unpacking process and includes an example of data encryption/decryption. Most business projects do not require encryption/decryption, so it is recommended to use the tool packaging method directly.

In the previous section, we introduced how to use the `gf` toolchain to package files/directories and generate Go files to compile into executable files. In this section, we explain the methods related to resource management and demonstrate custom packaging/unpacking functionalities through an example of packaging/unpacking binary resource files. Additionally, we show how to use custom encryption and decryption to protect the content of resource files.

## Interface Documentation

Refer to the [official documentation](https://pkg.go.dev/github.com/gogf/gf/v2/os/gres) for more information.

## Brief Introduction

The `Pack*` and `Unpack*` methods can be used to package/unpack any files into binary files or Go code files.

- **Resource Management** is implemented by the `Resource` object, which can add packaged content, search for files, traverse directories, etc.
- **Resource Files** are managed by the `File` object, which is similar to the `os.File` object and implements the `http.File` interface.
- **ScanDir** is used to search for files/directories in a specific directory and supports recursive search.
- **ScanDirFile** is used to search for files in a specific directory and supports recursive search.
- The `Dump` method prints the list of all files in a `Resource` object to the terminal. The file separator in the resource manager is consistently `/`.
- Additionally, the `gres` resource management module provides a default `Resource` object and offers package-level methods to operate on this default object.

## Custom Packaging Example

We will package the `public` and `config` directories from the project's root directory into a binary file named `data.bin` and encrypt the generated binary content using the `gaes` encryption algorithm.

```go
package main

import (
    "github.com/gogf/gf/v2/crypto/gaes"
    "github.com/gogf/gf/v2/os/gfile"
    "github.com/gogf/gf/v2/os/gres"
)

var (
    CryptoKey = []byte("x76cgqt36i9c863bzmotuf8626dxiwu0")
)

func main() {
    binContent, err := gres.Pack("public,config")
    if err != nil {
        panic(err)
    }
    binContent, err = gaes.Encrypt(binContent, CryptoKey)
    if err != nil {
        panic(err)
    }
    if err := gfile.PutBytes("data.bin", binContent); err != nil {
        panic(err)
    }
}
```

## Custom Unpacking Example

To unpack the previously packaged `data.bin`, we need to perform both decryption and unpacking operations.

```go
package main

import (
    "github.com/gogf/gf/v2/crypto/gaes"
    "github.com/gogf/gf/v2/os/gfile"
    "github.com/gogf/gf/v2/os/gres"
)

var (
    CryptoKey = []byte("x76cgqt36i9c863bzmotuf8626dxiwu0")
)

func main() {
    binContent := gfile.GetBytes("data.bin")
    binContent, err := gaes.Decrypt(binContent, CryptoKey)
    if err != nil {
        panic(err)
    }
    if err := gres.Add(binContent); err != nil {
        panic(err)
    }
    gres.Dump()
}
```

Finally, we use `gres.Dump()` to print the list of files that were successfully added, allowing us to verify whether the resource files were added successfully.
