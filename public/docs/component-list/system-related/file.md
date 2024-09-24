# File - gfile

## Overview

The `gfile` file management component provides more advanced file and directory operation capabilities.

### Usage

```go
import "github.com/gogf/gf/v2/os/gfile"
```

### API Documentation

You can find the API documentation at the following link:  
[https://pkg.go.dev/github.com/gogf/gf/v2/os/gfile](https://pkg.go.dev/github.com/gogf/gf/v2/os/gfile)

The following is a list of commonly used methods. This document might lag behind the latest features in the code. For more methods and examples, please refer to the code documentation:  
[https://pkg.go.dev/github.com/gogf/gf/v2/os/gfile](https://pkg.go.dev/github.com/gogf/gf/v2/os/gfile)

## Content Management

### GetContents

- **Description**: Reads the contents of the specified file path and returns it as a string.
- **Signature**:

```go
func GetContents(path string) string
```

- **Example**:

```go
func ExampleGetContents() {
    var (
        fileName = "gfile_example.txt"
        tempDir  = gfile.TempDir("gfile_example_content")
        tempFile = gfile.Join(tempDir, fileName)
    )

    // Write contents to the file
    gfile.PutContents(tempFile, "goframe example content")

    // Read and return the file content as a string.
    // If reading fails (e.g., due to permission or IO errors), it returns an empty string.
    fmt.Println(gfile.GetContents(tempFile))

    // Output:
    // goframe example content
}
```

### GetContentsWithCache

- **Description**: Retrieves the file content with caching. You can set a cache expiration time, and the cache will be cleared automatically if the file changes.
- **Signature**:

```go
func GetContentsWithCache(path string, duration ...time.Duration) string
```

- **Example**:

```go
func ExampleGetContentsWithCache() {
    var (
        fileName = "gfile_example.txt"
        tempDir  = gfile.TempDir("gfile_example_cache")
        tempFile = gfile.Join(tempDir, fileName)
    )

    // Write contents to the file
    gfile.PutContents(tempFile, "goframe example content")

    // Reads the file content with a cache duration of one minute,
    // meaning it reads from cache for subsequent reads within one minute, without any IO operations.
    fmt.Println(gfile.GetContentsWithCache(tempFile, time.Minute))

    // Writing new content will clear the cache.
    gfile.PutContents(tempFile, "new goframe example content")

    // Cache clearing may have a slight delay after the file content changes.
    time.Sleep(time.Second * 1)

    // Read the updated content
    fmt.Println(gfile.GetContentsWithCache(tempFile))

    // Output might be:
    // goframe example content
    // new goframe example content
}
```

### GetBytesWithCache

- **Description**: Retrieves the file content with caching, similar to `GetContentsWithCache`, but returns the content as a byte slice (`[]byte`). You can also set cache expiration time, and the cache will be cleared automatically if the file changes.
- **Signature**:

```go
func GetBytesWithCache(path string, duration ...time.Duration) []byte
```

- **Example**:

```go
func ExampleGetBytesWithCache() {
    var (
        fileName = "gfile_example.txt"
        tempDir  = gfile.TempDir("gfile_example_cache")
        tempFile = gfile.Join(tempDir, fileName)
    )

    // Write contents to the file
    gfile.PutContents(tempFile, "goframe example content")

    // Read the file content with a cache duration of one minute.
    fmt.Println(gfile.GetBytesWithCache(tempFile, time.Minute))

    // Writing new content will clear the cache.
    gfile.PutContents(tempFile, "new goframe example content")

    // Cache clearing may have a slight delay after file content changes.
    time.Sleep(time.Second * 1)

    // Read the updated content
    fmt.Println(gfile.GetBytesWithCache(tempFile))

    // Output:
    // [103 111 102 114 97 109 101 32 101 120 97 109 112 108 101 32 99 111 110 116 101 110 116]
    // [110 101 119 32 103 111 102 114 97 109 101 32 101 120 97 109 112 108 101 32 99 111 110 116 101 110 116]
}
```

### GetBytes

- **Description**: Reads the contents of the specified file path and returns it as a byte slice (`[]byte`).
- **Signature**:

```go
func GetBytes(path string) []byte
```

- **Example**:

```go
func ExampleGetBytes() {
    var (
        fileName = "gfile_example.txt"
        tempDir  = gfile.TempDir("gfile_example_content")
        tempFile = gfile.Join(tempDir, fileName)
    )

    // Write contents to the file
    gfile.PutContents(tempFile, "goframe example content")

    // Read and return the file content as a byte slice (`[]byte`).
    // Returns nil if reading fails (e.g., due to permission or IO errors).
    fmt.Println(gfile.GetBytes(tempFile))

    // Output:
    // [103 111 102 114 97 109 101 32 101 120 97 109 112 108 101 32 99 111 110 116 101 110 116]
}
```

### GetBytesTilChar

- **Description**: Retrieves file content as a byte slice until the specified character is found, starting from a given position.
- **Signature**:

```go
func GetBytesTilChar(reader io.ReaderAt, char byte, start int64) ([]byte, int64)
```

- **Example**:

```go
func ExampleGetBytesTilChar() {
    var (
        fileName = "gfile_example.txt"
        tempDir  = gfile.TempDir("gfile_example_content")
        tempFile = gfile.Join(tempDir, fileName)
    )

    // Write contents to the file
    gfile.PutContents(tempFile, "goframe example content")

    f, _ := gfile.OpenWithFlagPerm(tempFile, os.O_RDONLY, gfile.DefaultPermOpen)

    // `GetBytesTilChar` retrieves the content of the file as a byte slice (`[]byte`)
    // until the next occurrence of the specified byte `char`.
    char, i := gfile.GetBytesTilChar(f, 'f', 0)
    fmt.Println(char)
    fmt.Println(i)

    // Output:
    // [103 111 102]
    // 2
}
```

### GetBytesByTwoOffsets

- **Description**: Reads file content between two specified byte offsets.
- **Signature**:

```go
func GetBytesByTwoOffsets(reader io.ReaderAt, start int64, end int64) []byte
```

- **Example**:

```go
func ExampleGetBytesByTwoOffsets() {
    var (
        fileName = "gfile_example.txt"
        tempDir  = gfile.TempDir("gfile_example_content")
        tempFile = gfile.Join(tempDir, fileName)
    )

    // Write contents to the file
    gfile.PutContents(tempFile, "goframe example content")

    f, _ := gfile.OpenWithFlagPerm(tempFile, os.O_RDONLY, gfile.DefaultPermOpen)

    // `GetBytesByTwoOffsets` retrieves the content between two specified byte positions.
    char := gfile.GetBytesByTwoOffsets(f, 0, 3)
    fmt.Println(char)

    // Output:
    // [103 111 102]
}
```

### PutContents

**Description**: Adds string content to the specified file path. If the file does not exist, it will automatically create it recursively.

**Signature**:

```go
func PutContents(path string, data []byte, flag int, perm os.FileMode) error
```

### Example

```go
func ExamplePutContents() {
    // Initialization
    var (
        fileName = "gfile_example.txt"
        tempDir  = gfile.TempDir("gfile_example_content")
        tempFile = gfile.Join(tempDir, fileName)
    )

    // It creates the file and writes the string content into the specified file path.
    // It automatically creates directories recursively if they do not exist.
    gfile.PutContents(tempFile, "goframe example content")

    // Reading the content
    fmt.Println(gfile.GetContents(tempFile))

    // Output:
    // goframe example content
}
```

### PutBytes

**Description**: Writes byte content to the specified file. If the file does not exist, it will automatically create it recursively.

**Signature**:

```go
func PutBytes(path string, content []byte) error
```

***Example***

```go
func ExamplePutBytes() {
    // Initialization
    var (
        fileName = "gfile_example.txt"
        tempDir  = gfile.TempDir("gfile_example_content")
        tempFile = gfile.Join(tempDir, fileName)
    )

    // Write byte content to the file
    gfile.PutBytes(tempFile, []byte("goframe example content"))

    // Reading the content
    fmt.Println(gfile.GetContents(tempFile))

    // Output:
    // goframe example content
}
```

### PutContentsAppend

**Description**: Appends string content to the specified file. If the file does not exist, it will automatically create it recursively.

**Signature**:

```go
func PutContentsAppend(path string, content string) error
```

***Example***

```go
func ExamplePutContentsAppend() {
    // Initialization
    var (
        fileName = "gfile_example.txt"
        tempDir  = gfile.TempDir("gfile_example_content")
        tempFile = gfile.Join(tempDir, fileName)
    )

    // Write content to the file
    gfile.PutContents(tempFile, "goframe example content")

    // Reading the content
    fmt.Println(gfile.GetContents(tempFile))

    // Append content to the file
    // Automatically creates directories recursively if they do not exist.
    gfile.PutContentsAppend(tempFile, " append content")

    // Reading the appended content
    fmt.Println(gfile.GetContents(tempFile))

    // Output:
    // goframe example content
    // goframe example content append content
}
```

### PutBytesAppend

**Description**: Appends byte content to the specified file. If the file does not exist, it will automatically create it recursively.

**Signature**:

```go
func PutBytesAppend(path string, content []byte) error
```

***Example***

```go
func ExamplePutBytesAppend() {
    // Initialization
    var (
        fileName = "gfile_example.txt"
        tempDir  = gfile.TempDir("gfile_example_content")
        tempFile = gfile.Join(tempDir, fileName)
    )

    // Write content to the file
    gfile.PutContents(tempFile, "goframe example content")

    // Reading the content
    fmt.Println(gfile.GetContents(tempFile))

    // Append byte content to the file
    gfile.PutBytesAppend(tempFile, []byte(" append"))

    // Reading the appended content
    fmt.Println(gfile.GetContents(tempFile))

    // Output:
    // goframe example content
    // goframe example content append
}
```

### GetNextCharOffset

**Description**: From a given offset, finds the position of the specified character in the file.

**Signature**:

```go
func GetNextCharOffset(reader io.ReaderAt, char byte, start int64) int64
```

***Example***

```go
func ExampleGetNextCharOffset() {
    // Initialization
    var (
        fileName = "gfile_example.txt"
        tempDir  = gfile.TempDir("gfile_example_content")
        tempFile = gfile.Join(tempDir, fileName)
    )

    // Write content to the file
    gfile.PutContents(tempFile, "goframe example content")

    f, err := gfile.OpenWithFlagPerm(tempFile, os.O_RDONLY, DefaultPermOpen)
    defer f.Close()

    // Read content and find the offset of character 'f'
    index := gfile.GetNextCharOffset(f, 'f', 0)
    fmt.Println(index)

    // Output:
    // 2
}
```

### GetNextCharOffsetByPath

**Description**: From a given offset, finds the position of the specified character in the file using the file path.

**Signature**:

```go
func GetNextCharOffsetByPath(path string, char byte, start int64) int64
```

***Example***

```go
func ExampleGetNextCharOffsetByPath() {
    // Initialization
    var (
        fileName = "gfile_example.txt"
        tempDir  = gfile.TempDir("gfile_example_content")
        tempFile = gfile.Join(tempDir, fileName)
    )

    // Write content to the file
    gfile.PutContents(tempFile, "goframe example content")

    // Read content and find the offset of character 'f'
    index := gfile.GetNextCharOffsetByPath(tempFile, 'f', 0)
    fmt.Println(index)

    // Output:
    // 2
}
```

### GetBytesTilCharByPath

**Description**: Retrieves a section of the file's content in byte format, stopping when the specified character is encountered, starting from a given offset.

**Signature**:

```go
func GetBytesTilCharByPath(path string, char byte, start int64) ([]byte, int64)
```

***Example***

```go
func ExampleGetBytesTilCharByPath() {
    // Initialization
    var (
        fileName = "gfile_example.txt"
        tempDir  = gfile.TempDir("gfile_example_content")
        tempFile = gfile.Join(tempDir, fileName)
    )

    // Write content to the file
    gfile.PutContents(tempFile, "goframe example content")

    // Read content up to the specified character 'f'
    fmt.Println(gfile.GetBytesTilCharByPath(tempFile, 'f', 0))

    // Output:
    // [103 111 102] 2
}
```

### GetBytesByTwoOffsetsByPath

**Description**: Retrieves the content of a specified file as bytes between two given offsets.  
**Syntax**:

```go
func GetBytesByTwoOffsetsByPath(path string, start int64, end int64) []byte
```

**Example**:

```go
func ExampleGetBytesByTwoOffsetsByPath() {
    // Initialize variables
    var (
        fileName = "gfile_example.txt"
        tempDir  = gfile.TempDir("gfile_example_content")
        tempFile = gfile.Join(tempDir, fileName)
    )

    // Write content to the file
    gfile.PutContents(tempFile, "goframe example content")

    // Read the content from the file between the offsets 0 and 7
    fmt.Println(gfile.GetBytesByTwoOffsetsByPath(tempFile, 0, 7))

    // Output:
    // [103 111 102 114 97 109 101] // These bytes represent the string "goframe"
}
```

### ReadLines

**Description**: Reads the contents of a file line by line as a string.  
**Syntax**:

```go
func ReadLines(file string, callback func(text string) error) error
```

**Example**:

```go
func ExampleReadLines() {
    // Initialize variables
    var (
        fileName = "gfile_example.txt"
        tempDir  = gfile.TempDir("gfile_example_content")
        tempFile = gfile.Join(tempDir, fileName)
    )

    // Write multiple lines to the file
    gfile.PutContents(tempFile, "L1 goframe example content\nL2 goframe example content")

    // Read each line from the file and process it
    gfile.ReadLines(tempFile, func(text string) error {
        // Print each line
        fmt.Println(text)
        return nil
    })

    // Output:
    // L1 goframe example content
    // L2 goframe example content
}
```

### ReadLinesBytes

**Description**: Reads the contents of a file line by line in the form of bytes.  
**Syntax**:

```go
func ReadLinesBytes(file string, callback func(bytes []byte) error) error
```

**Example**:

```go
func ExampleReadLinesBytes() {
    // Initialize variables
    var (
        fileName = "gfile_example.txt"
        tempDir  = gfile.TempDir("gfile_example_content")
        tempFile = gfile.Join(tempDir, fileName)
    )

    // Write multiple lines to the file
    gfile.PutContents(tempFile, "L1 goframe example content\nL2 goframe example content")

    // Read each line from the file as bytes and process it
    gfile.ReadLinesBytes(tempFile, func(bytes []byte) error {
        // Print each line as bytes
        fmt.Println(bytes)
        return nil
    })

    // Output:
    // [76 49 32 103 111 102 114 97 109 101 32 101 120 97 109 112 108 101 32 99 111 110 116 101 110 116]
    // [76 50 32 103 111 102 114 97 109 101 32 101 120 97 109 112 108 101 32 99 111 110 116 101 110 116]
}
```

### Truncate

**Description**: Truncates a file to a specified size.  
**Note**: If the specified file path is a symbolic link (symlink), the operation will modify the original file.  
**Syntax**:

```go
func Truncate(path string, size int) error
```

**Example**:

```go
func ExampleTruncate(){
    // Initialize variables
    var (
        path = gfile.Join(gfile.TempDir("gfile_example_basic_dir"), "file1")
    )

    // Check the initial size of the file
    stat, _ := gfile.Stat(path)
    fmt.Println(stat.Size())

    // Truncate the file to 0 bytes
    gfile.Truncate(path, 0)

    // Check the size of the file after truncation
    stat, _ = gfile.Stat(path)
    fmt.Println(stat.Size())

    // Output:
    // 13  // Initial size of the file in bytes
    // 0   // Size after truncation
}
```

## Content Replace

### ReplaceFile

***Description***: Replaces specific content in a specified file with new content.

***Syntax***

```go
func ReplaceFile(search, replace, path string) error
```

***Example***

```go
func ExampleReplaceFile() {
    // init
    var (
        fileName = "gfile_example.txt"
        tempDir  = gfile.TempDir("gfile_example_replace")
        tempFile = gfile.Join(tempDir, fileName)
    )

    // write contents
    gfile.PutContents(tempFile, "goframe example content")

    // read contents
    fmt.Println(gfile.GetContents(tempFile))

    // It replaces content directly by file path.
    gfile.ReplaceFile("content", "replace word", tempFile)

    fmt.Println(gfile.GetContents(tempFile))

    // Output:
    // goframe example content
    // goframe example replace word
}
```

### ReplaceFileFunc

***Description***: Uses a custom function to replace the content of a specified file.

***Syntax***

```go
func ReplaceFileFunc(f func(path, content string) string, path string) error
```

***Example***

```go
func ExampleReplaceFileFunc() {
    // init
    var (
        fileName = "gfile_example.txt"
        tempDir  = gfile.TempDir("gfile_example_replace")
        tempFile = gfile.Join(tempDir, fileName)
    )

    // write contents
    gfile.PutContents(tempFile, "goframe example 123")

    // read contents
    fmt.Println(gfile.GetContents(tempFile))

    // It replaces content directly by file path and callback function.
    gfile.ReplaceFileFunc(func(path, content string) string {
        // Replace with regular match
        reg, _ := regexp.Compile(`\d{3}`)
        return reg.ReplaceAllString(content, "[num]")
    }, tempFile)

    fmt.Println(gfile.GetContents(tempFile))

    // Output:
    // goframe example 123
    // goframe example [num]
}
```

### ReplaceDir

***Description***: Scans the specified directory and replaces the specified content of files that meet the criteria with new content.

### Syntax

```go
func ReplaceDir(search, replace, path, pattern string, recursive ...bool) error
```

***Example***

```go
func ExampleReplaceDir() {
    // init
    var (
        fileName = "gfile_example.txt"
        tempDir  = gfile.TempDir("gfile_example_replace")
        tempFile = gfile.Join(tempDir, fileName)
    )

    // write contents
    gfile.PutContents(tempFile, "goframe example content")

    // read contents
    fmt.Println(gfile.GetContents(tempFile))

    // It replaces content of all files under specified directory recursively.
    gfile.ReplaceDir("content", "replace word", tempDir, "gfile_example.txt", true)

    // read contents
    fmt.Println(gfile.GetContents(tempFile))

    // Output:
    // goframe example content
    // goframe example replace word
}
```

### ReplaceDirFunc

***Description***: Scans the specified directory and uses a custom function to replace the specified content of files that meet the criteria with new content.

***Syntax***

```go
func ReplaceDirFunc(f func(path, content string) string, path, pattern string, recursive ...bool) error
```

***Example***

```go
func ExampleReplaceDirFunc() {
    // init
    var (
        fileName = "gfile_example.txt"
        tempDir  = gfile.TempDir("gfile_example_replace")
        tempFile = gfile.Join(tempDir, fileName)
    )

    // write contents
    gfile.PutContents(tempFile, "goframe example 123")

    // read contents
    fmt.Println(gfile.GetContents(tempFile))

    // It replaces content of all files under specified directory with custom callback function recursively.
    gfile.ReplaceDirFunc(func(path, content string) string {
        // Replace with regular match
        reg, _ := regexp.Compile(`\d{3}`)
        return reg.ReplaceAllString(content, "[num]")
    }, tempDir, "gfile_example.txt", true)

    fmt.Println(gfile.GetContents(tempFile))

    // Output:
    // goframe example 123
    // goframe example [num]
}
```

## File Time

### MTime

**Description**: This function retrieves the modification time of a specified file path.

**Syntax**:

```go
func MTime(path string) time.Time
```

***Example***

```go
func ExampleMTime() {
    t := gfile.MTime(gfile.TempDir())
    fmt.Println(t)

    // May Output:
    // 2021-11-02 15:18:43.901141 +0800 CST
}
```

### MTimestamp

**Description**: This function retrieves the modification timestamp (in seconds) of a specified file path.

**Syntax**:

```go
func MTimestamp(path string) int64
```

***Example***

```go
func ExampleMTimestamp() {
    t := gfile.MTimestamp(gfile.TempDir())
    fmt.Println(t)

    // May Output:
    // 1635838398
}
```

### MTimestampMilli

**Description**: This function retrieves the modification timestamp (in milliseconds) of a specified file path.

**Syntax**:

```go
func MTimestampMilli(path string) int64
```

***Example***

```go
func ExampleMTimestampMilli() {
    t := gfile.MTimestampMilli(gfile.TempDir())
    fmt.Println(t)

    // May Output:
    // 1635838529330
}
```

## File Size

### Size

**Description**: This function retrieves the size of a file or directory (in bytes) without formatting.

**Syntax**:

```go
func Size(path string) int64
```

***Example***

```go
func ExampleSize() {
    // Initialize variables
    var (
        fileName = "gfile_example.txt"
        tempDir  = gfile.TempDir("gfile_example_size")
        tempFile = gfile.Join(tempDir, fileName)
    )

    // Write contents to the file
    gfile.PutContents(tempFile, "0123456789")
    fmt.Println(gfile.Size(tempFile))

    // Output:
    // 10
}
```

### SizeFormat

**Description**: This function retrieves the size of a file or directory and formats it as a human-readable disk capacity string.

**Syntax**:

```go
func SizeFormat(path string) string
```

***Example***

```go
func ExampleSizeFormat() {
    // Initialize variables
    var (
        fileName = "gfile_example.txt"
        tempDir  = gfile.TempDir("gfile_example_size")
        tempFile = gfile.Join(tempDir, fileName)
    )

    // Write contents to the file
    gfile.PutContents(tempFile, "0123456789")
    fmt.Println(gfile.SizeFormat(tempFile))

    // Output:
    // 10.00B
}
```

### ReadableSize

**Description**: This function retrieves the size of a file or directory and formats it into a human-readable disk size format (e.g., KB, MB).

**Syntax**:

```go
func ReadableSize(path string) string
```

***Example***

```go
func ExampleReadableSize() {
    // Initialize variables
    var (
        fileName = "gfile_example.txt"
        tempDir  = gfile.TempDir("gfile_example_size")
        tempFile = gfile.Join(tempDir, fileName)
    )

    // Write contents to the file
    gfile.PutContents(tempFile, "01234567899876543210")
    fmt.Println(gfile.ReadableSize(tempFile))

    // Output:
    // 20.00B
}
```

### StrToSize

**Description**: This function converts a disk capacity string (e.g., "100MB") into its corresponding size in bytes.

**Syntax**:

```go
func StrToSize(sizeStr string) int64
```

***Example***

```go
func ExampleStrToSize() {
    size := gfile.StrToSize("100MB")
    fmt.Println(size)

    // Output:
    // 104857600
}
```

### FormatSize

**Description**: This function converts a size in bytes into a human-readable disk capacity string (e.g., "K", "M", "G", "T").

**Syntax**:

```go
func FormatSize(raw int64) string
```

***Example***

```go
func ExampleFormatSize() {
    sizeStr := gfile.FormatSize(104857600)
    fmt.Println(sizeStr)
    sizeStr0 := gfile.FormatSize(1024)
    fmt.Println(sizeStr0)
    sizeStr1 := gfile.FormatSize(999999999999999999)
    fmt.Println(sizeStr1)

    // Output:
    // 100.00M
    // 1.00K
    // 888.18P
}
```

## File Sorting

### SortFiles

**Description**: This function sorts an array of file paths in alphabetical order, giving priority to numeric values.

**Syntax**:

```go
func SortFiles(files []string) []string
```

***Example***

```go
func ExampleSortFiles() {
    files := []string{
        "/aaa/bbb/ccc.txt",
        "/aaa/bbb/",
        "/aaa/",
        "/aaa",
        "/aaa/ccc/ddd.txt",
        "/bbb",
        "/0123",
        "/ddd",
        "/ccc",
    }
    sortOut := gfile.SortFiles(files)
    fmt.Println(sortOut)

    // Output:
    // [/0123 /aaa /aaa/ /aaa/bbb/ /aaa/bbb/ccc.txt /aaa/ccc/ddd.txt /bbb /ccc /ddd]
}
```

## File Search

### Search

**Description**: This function searches for a file within the specified directory (by default, it includes the current directory, the runtime directory, and the main function's directory) and returns the real file path. It does not recurse into subdirectories.

**Syntax**:

```go
func Search(name string, prioritySearchPaths ...string) (realPath string, err error)
```

***Example***

```go
func ExampleSearch() {
    // Initialize variables
    var (
        fileName = "gfile_example.txt"
        tempDir  = gfile.TempDir("gfile_example_search")
        tempFile = gfile.Join(tempDir, fileName)
    )

    // Write contents to the file
    gfile.PutContents(tempFile, "goframe example content")

    // Search for the file
    realPath, _ := gfile.Search(fileName, tempDir)
    fmt.Println(gfile.Basename(realPath))

    // Output:
    // gfile_example.txt
}
```

### ScanDir

**Description**: This function scans the specified directory for files or directories. It supports recursive scanning if specified.

**Syntax**:

```go
func ScanDir(path string, pattern string, recursive ...bool) ([]string, error)
```

***Example***

```go
func ExampleScanDir() {
    // Initialize variables
    var (
        fileName = "gfile_example.txt"
        tempDir  = gfile.TempDir("gfile_example_scan_dir")
        tempFile = gfile.Join(tempDir, fileName)

        tempSubDir  = gfile.Join(tempDir, "sub_dir")
        tempSubFile = gfile.Join(tempSubDir, fileName)
    )

    // Write contents to the files
    gfile.PutContents(tempFile, "goframe example content")
    gfile.PutContents(tempSubFile, "goframe example content")

    // Scan the directory recursively
    list, _ := gfile.ScanDir(tempDir, "*", true)
    for _, v := range list {
        fmt.Println(gfile.Basename(v))
    }

    // Output:
    // gfile_example.txt
    // sub_dir
    // gfile_example.txt
}
```

### ScanDirFile

**Description**: This function scans the specified directory for files (excluding directories). It supports recursive scanning.

**Syntax**:

```go
func ScanDirFile(path string, pattern string, recursive ...bool) ([]string, error)
```

***Example***

```go
func ExampleScanDirFile() {
    // Initialize variables
    var (
        fileName = "gfile_example.txt"
        tempDir  = gfile.TempDir("gfile_example_scan_dir_file")
        tempFile = gfile.Join(tempDir, fileName)

        tempSubDir  = gfile.Join(tempDir, "sub_dir")
        tempSubFile = gfile.Join(tempSubDir, fileName)
    )

    // Write contents to the files
    gfile.PutContents(tempFile, "goframe example content")
    gfile.PutContents(tempSubFile, "goframe example content")

    // Scan the directory recursively for files only
    list, _ := gfile.ScanDirFile(tempDir, "*.txt", true)
    for _, v := range list {
        fmt.Println(gfile.Basename(v))
    }

    // Output:
    // gfile_example.txt
    // gfile_example.txt
}
```

### ScanDirFunc

**Description**: This function scans the specified directory (supports recursive scanning) and applies a custom filtering function to the results. It scans both files and directories.

**Syntax**:

```go
func ScanDirFunc(path string, pattern string, recursive bool, handler func(path string) string) ([]string, error)
```

***Example***

```go
func ExampleScanDirFunc() {
    // Initialize variables
    var (
        fileName = "gfile_example.txt"
        tempDir  = gfile.TempDir("gfile_example_scan_dir_func")
        tempFile = gfile.Join(tempDir, fileName)

        tempSubDir  = gfile.Join(tempDir, "sub_dir")
        tempSubFile = gfile.Join(tempSubDir, fileName)
    )

    // Write contents to the files
    gfile.PutContents(tempFile, "goframe example content")
    gfile.PutContents(tempSubFile, "goframe example content")

    // Scan the directory recursively, ignoring specific files
    list, _ := gfile.ScanDirFunc(tempDir, "*", true, func(path string) string {
        // Ignore files named "gfile_example.txt"
        if gfile.Basename(path) == "gfile_example.txt" {
            return ""
        }
        return path
    })
    for _, v := range list {
        fmt.Println(gfile.Basename(v))
    }

    // Output:
    // sub_dir
}
```

### ScanDirFileFunc

**Description**: This function scans the specified directory for files only (excluding directories). It supports recursive scanning and applies a custom filtering function.

**Syntax**:

```go
func ScanDirFileFunc(path string, pattern string, recursive bool, handler func(path string) string) ([]string, error)
```

***Example***

```go
func ExampleScanDirFileFunc() {
    // Initialize variables
    var (
        fileName = "gfile_example.txt"
        tempDir  = gfile.TempDir("gfile_example_scan_dir_file_func")
        tempFile = gfile.Join(tempDir, fileName)

        fileName1 = "gfile_example_ignores.txt"
        tempFile1 = gfile.Join(tempDir, fileName1)

        tempSubDir  = gfile.Join(tempDir, "sub_dir")
        tempSubFile = gfile.Join(tempSubDir, fileName)
    )

    // Write contents to the files
    gfile.PutContents(tempFile, "goframe example content")
    gfile.PutContents(tempFile1, "goframe example content")
    gfile.PutContents(tempSubFile, "goframe example content")

    // Scan the directory recursively for files only, ignoring some files
    list, _ := gfile.ScanDirFileFunc(tempDir, "*.txt", true, func(path string) string {
        // Ignore the file named "gfile_example_ignores.txt"
        if gfile.Basename(path) == "gfile_example_ignores.txt" {
            return ""
        }
        return path
    })
    for _, v := range list {
        fmt.Println(gfile.Basename(v))
    }

    // Output:
    // gfile_example.txt
    // gfile_example.txt
}
```

## Common Directory

### Pwd

**Description**: This function retrieves the current working directory.

**Syntax**:

```go
func Pwd() string
```

***Example***

```go
func ExamplePwd() {
 // Get the absolute path of the current working directory.
 fmt.Println(gfile.Pwd())

 // Possible Output:
 // xxx/gf/os/gfile
}
```

### Home

**Description**: This function retrieves the home directory of the user running the application.

**Syntax**:

```go
func Home(names ...string) (string, error)
```

***Example***

```go
func ExampleHome() {
 // Get the user's home directory.
 homePath, _ := gfile.Home()
 fmt.Println(homePath)

 // Possible Output:
 // C:\Users\hailaz
}
```

### Temp

**Description**: This function returns an absolute path that is concatenated with the system's temporary directory.

**Syntax**:

```go
func Temp(names ...string) string
```

***Example***

```go
func ExampleTempDir() {
 // Initialize variable
 var (
  fileName = "gfile_example_basic_dir"
 )

 // Fetch the absolute path by appending to the system's temp directory.
 path := gfile.Temp(fileName)

 fmt.Println(path)

 // Output:
 // /tmp/gfile_example_basic_dir
}
```

### SelfPath

**Description**: This function retrieves the absolute path of the currently running program.

**Syntax**:

```go
func SelfPath() string
```

***Example***

```go
func ExampleSelfPath() {
 // Get the absolute file path of the current running process.
 fmt.Println(gfile.SelfPath())

 // Possible Output:
 // xxx/___github_com_gogf_gf_v2_os_gfile__ExampleSelfPath
}
```

## Type Checking

### IsDir

**Description**: This function checks whether the given path is a directory.

**Syntax**:

```go
func IsDir(path string) bool
```

***Example***

```go
func ExampleIsDir() {
 // Initialize variables
 var (
  path     = gfile.TempDir("gfile_example_basic_dir")
  filePath = gfile.Join(gfile.TempDir("gfile_example_basic_dir"), "file1")
 )
 // Check if the given `path` is a directory.
 fmt.Println(gfile.IsDir(path))
 fmt.Println(gfile.IsDir(filePath))

 // Output:
 // true
 // false
}
```

### IsFile

**Description**: This function checks whether the given path is a file.

**Syntax**:

```go
func IsFile(path string) bool
```

***Example***

```go
func ExampleIsFile() {
 // Initialize variables
 var (
  filePath = gfile.Join(gfile.TempDir("gfile_example_basic_dir"), "file1")
  dirPath  = gfile.TempDir("gfile_example_basic_dir")
 )
 // Check if the given `path` is a file (i.e., not a directory).
 fmt.Println(gfile.IsFile(filePath))
 fmt.Println(gfile.IsFile(dirPath))

 // Output:
 // true
 // false
}
```

## Permission Operations

### IsReadable

**Description**: This function checks whether the given path is readable.

**Syntax**:

```go
func IsReadable(path string) bool
```

***Example***

```go
func ExampleIsReadable() {
    // Initialize the path
    var (
        path = gfile.Pwd() + gfile.Separator + "testdata/readline/file.log"
    )

    // Check whether the given path is readable
    fmt.Println(gfile.IsReadable(path))

    // Output:
    // true
}
```

### IsWritable

**Description**: This function checks whether the specified path is writable. If the path is a directory, it will create a temporary file to check. If the path is a file, it checks whether the file can be opened for writing.

**Syntax**:

```go
func IsWritable(path string) bool
```

***Example***

```go
func ExampleIsWritable() {
    // Initialize the path
    var (
        path = gfile.Pwd() + gfile.Separator + "testdata/readline/file.log"
    )

    // Check whether the given path is writable
    fmt.Println(gfile.IsWritable(path))

    // Output:
    // true
}
```

### Chmod

**Description**: This function changes the file permissions for the specified path using the provided permissions.

**Syntax**:

```go
func Chmod(path string, mode os.FileMode) error
```

***Example***

```go
func ExampleChmod() {
    // Initialize the path
    var (
        path = gfile.Join(gfile.TempDir("gfile_example_basic_dir"), "file1")
    )

    // Get the file information, including permissions
    stat, err := gfile.Stat(path)
    if err != nil {
        fmt.Println(err.Error())
    }

    // Display the original file mode
    fmt.Println(stat.Mode())

    // Change the file mode to default permissions
    gfile.Chmod(path, gfile.DefaultPermCopy)

    // Get the file information again
    stat, _ = gfile.Stat(path)

    // Display the modified file mode
    fmt.Println(stat.Mode())

    // Output:
    // -rw-r--r--
    // -rwxrwxrwx
}
```

## File and Directory Operations

### Mkdir

**Description**: This function creates a folder, supporting recursive creation (it is recommended to use absolute paths). The permissions for the created folder will be `drwxr-xr-x`.

**Syntax**:

```go
func Mkdir(path string) error
```

***Example***

```go
func ExampleMkdir() {
    // Initialize the path
    var (
        path = gfile.TempDir("gfile_example_basic_dir")
    )

    // Create the directory
    gfile.Mkdir(path)

    // Check if the directory exists
    fmt.Println(gfile.IsDir(path))

    // Output:
    // true
}
```

### Create

**Description**: This function creates a file or folder. If any folder in the given path does not exist, it will automatically create the folder and the file. The created file will have permissions of `-rw-r–r–`.

**Note**: If the file already exists, this function will clear its contents!

**Syntax**:

```go
func Create(path string) (*os.File, error)
```

***Example***

```go
func ExampleCreate() {
    // Initialize the path and data buffer
    var (
        path     = gfile.Join(gfile.TempDir("gfile_example_basic_dir"), "file1")
        dataByte = make([]byte, 50)
    )

    // Check whether the file exists
    isFile := gfile.IsFile(path)

    fmt.Println(isFile)

    // Create the file with the given path
    fileHandle, _ := gfile.Create(path)
    defer fileHandle.Close()

    // Write some content to the file
    n, _ := fileHandle.WriteString("hello goframe")

    // Check whether the file exists
    isFile = gfile.IsFile(path)

    fmt.Println(isFile)
    
    // Reset file pointer
    unix.Seek(int(fileHandle.Fd()), 0, 0)

    // Read bytes from the file
    fileHandle.Read(dataByte)

    fmt.Println(string(dataByte[:n]))

    // Output:
    // false
    // true
    // hello goframe
}
```

### Open

**Description**: This function opens a file or folder in read-only mode.

**Syntax**:

```go
func Open(path string) (*os.File, error)
```

***Example***

```go
func ExampleOpen() {
    // Initialize the path and data buffer
    var (
        path     = gfile.Join(gfile.TempDir("gfile_example_basic_dir"), "file1")
        dataByte = make([]byte, 4096)
    )

    // Open file or directory in read-only mode
    file, _ := gfile.Open(path)
    defer file.Close()

    // Read data
    n, _ := file.Read(dataByte)

    fmt.Println(string(dataByte[:n]))

    // Output:
    // hello goframe
}
```

### OpenFile

**Description**: This function opens a file or folder with specified flags and permissions.

**Syntax**:

```go
func OpenFile(path string, flag int, perm os.FileMode) (*os.File, error)
```

***Example***

```go
func ExampleOpenFile() {
    // Initialize the path and data buffer
    var (
        path     = gfile.Join(gfile.TempDir("gfile_example_basic_dir"), "file1")
        dataByte = make([]byte, 4096)
    )

    // Open file/directory with custom flags and permissions
    // Create if the file does not exist; it is created in a readable and writable mode, permission 0777
    openFile, _ := gfile.OpenFile(path, os.O_CREATE|os.O_RDWR, gfile.DefaultPermCopy)
    defer openFile.Close()

    // Write some content to the file
    writeLength, _ := openFile.WriteString("hello goframe test open file")

    fmt.Println(writeLength)

    // Read data
    unix.Seek(int(openFile.Fd()), 0, 0)
    n, _ := openFile.Read(dataByte)

    fmt.Println(string(dataByte[:n]))

    // Output:
    // 28
    // hello goframe test open file
}
```

### OpenWithFlag

**Description**: This function opens a file or folder with specified flags.

**Syntax**:

```go
func OpenWithFlag(path string, flag int) (*os.File, error)
```

***Example***

```go
func ExampleOpenWithFlag() {
    // Initialize the path and data buffer
    var (
        path     = gfile.Join(gfile.TempDir("gfile_example_basic_dir"), "file1")
        dataByte = make([]byte, 4096)
    )

    // Open file/directory with custom flags
    // Create if the file does not exist; it is created in a readable and writable mode with default permission 0666
    openFile, _ := gfile.OpenWithFlag(path, os.O_CREATE|os.O_RDWR)
    defer openFile.Close()

    // Write some content to the file
    writeLength, _ := openFile.WriteString("hello goframe test open file with flag")

    fmt.Println(writeLength)

    // Read data
    unix.Seek(int(openFile.Fd()), 0, 0)
    n, _ := openFile.Read(dataByte)

    fmt.Println(string(dataByte[:n]))

    // Output:
    // 38
    // hello goframe test open file with flag
}
```

### OpenWithFlagPerm

**Description**: This function opens a file or folder with specified flags and permissions.

**Syntax**:

```go
func OpenWithFlagPerm(path string, flag int, perm os.FileMode) (*os.File, error)
```

***Example***

```go
func ExampleOpenWithFlagPerm() {
    // Initialize the path and data buffer
    var (
        path     = gfile.Join(gfile.TempDir("gfile_example_basic_dir"), "file1")
        dataByte = make([]byte, 4096)
    )

    // Open file/directory with custom flags and permissions
    // Create if the file does not exist; it is created in a readable and writable mode with permission 0777
    openFile, _ := gfile.OpenWithFlagPerm(path, os.O_CREATE|os.O_RDWR, gfile.DefaultPermCopy)
    defer openFile.Close()

    // Write some content to the file
    writeLength, _ := openFile.WriteString("hello goframe test open file with flag and perm")

    fmt.Println(writeLength)

    // Read data
    unix.Seek(int(openFile.Fd()), 0, 0)
    n, _ := openFile.Read(dataByte)

    fmt.Println(string(dataByte[:n]))

    // Output:
    // 38
    // hello goframe test open file with flag and perm
}
```

### Stat

**Description**: This function retrieves details about the file at the given path.

**Syntax**:

```go
func Stat(path string) (os.FileInfo, error)
```

***Example***

```go
func ExampleStat() {
    // Initialize the path
    var (
        path = gfile.Join(gfile.TempDir("gfile_example_basic_dir"), "file1")
    )

    // Get file information
    stat, _ := gfile.Stat(path)

    fmt.Println(stat.Name())
    fmt.Println(stat.IsDir())
    fmt.Println(stat.Mode())
    fmt.Println(stat.ModTime())
    fmt.Println(stat.Size())
    fmt.Println(stat.Sys())

    // May Output:
    // file1
    // false
    // -rwxr-xr-x
    // 2021-12-02 11:01:27.261441694 +0800 CST
    // &{16777220 33261 1 8597857090 501 20 0 [0 0 0 0] {1638414088 192363490} {1638414087 261441694} {1638414087 261441694} {1638413480 485068275} 38 8 4096 0 0 0 [0 0]}
}
```

### Copy

**Description**: This function supports copying files or directories.

**Syntax**:

```go
func Copy(src string, dst string) error
```

***Example***

```go
func ExampleCopy() {
    // Initialize file and directory names
    var (
        srcFileName = "gfile_example.txt"
        srcTempDir  = gfile.TempDir("gfile_example_copy_src")
        srcTempFile = gfile.Join(srcTempDir, srcFileName)

        // Copy file destination
        dstFileName = "gfile_example_copy.txt"
        dstTempFile = gfile.Join(srcTempDir, dstFileName)

        // Copy directory destination
        dstTempDir = gfile.TempDir("gfile_example_copy_dst")
    )

    // Write contents to the source file
    gfile.PutContents(srcTempFile, "goframe example copy")

    // Copy the file
    gfile.Copy(srcTempFile, dstTempFile)

    // Read contents after copying the file
    fmt.Println(gfile.GetContents(dstTempFile))

    // Copy the directory
    gfile.Copy(srcTempDir, dstTempDir)

    // List files in the copied directory
    fList, _ := gfile.ScanDir(dstTempDir, "*", false)
    for _, v := range fList {
        fmt.Println(gfile.Basename(v))
    }

    // Output:
    // goframe example copy
    // gfile_example.txt
    // gfile_example_copy.txt


}
```

### CopyFile

**Description**: Copies a file from the source path to the destination path.

**Format**:

```go
func CopyFile(src, dst string) (err error)
```

***Example***

```go
func ExampleCopyFile() {
    // Initialize variables
    var (
        srcFileName = "gfile_example.txt"
        srcTempDir  = gfile.TempDir("gfile_example_copy_src")
        srcTempFile = gfile.Join(srcTempDir, srcFileName)

        // Destination file
        dstFileName = "gfile_example_copy.txt"
        dstTempFile = gfile.Join(srcTempDir, dstFileName)
    )

    // Write contents to the source file
    gfile.PutContents(srcTempFile, "goframe example copy")

    // Copy the file
    gfile.CopyFile(srcTempFile, dstTempFile)

    // Read contents from the destination file after copying
    fmt.Println(gfile.GetContents(dstTempFile))

    // Output:
    // goframe example copy
}
```

### CopyDir

**Description**: Supports copying files or directories.

**Format**:

```go
func CopyDir(src string, dst string) error 
```

***Example***

```go
func ExampleCopyDir() {
    // Initialize variables
    var (
        srcTempDir  = gfile.TempDir("gfile_example_copy_src")
        
        // Destination file
        dstFileName = "gfile_example_copy.txt"
        dstTempFile = gfile.Join(srcTempDir, dstFileName)

        // Destination directory
        dstTempDir = gfile.TempDir("gfile_example_copy_dst")
    )

    // Read contents from the destination file before copying
    fmt.Println(gfile.GetContents(dstTempFile))

    // Copy the directory
    gfile.CopyDir(srcTempDir, dstTempDir)

    // List files in the copied directory
    fList, _ := gfile.ScanDir(dstTempDir, "*", false)
    for _, v := range fList {
        fmt.Println(gfile.Basename(v))
    }

    // Output:
    // gfile_example.txt
    // gfile_example_copy.txt
}
```

### Move

**Description**: Renames the source file or directory to the destination path.

**Note**: If the destination already exists and is a file, it will be replaced, resulting in data loss!

**Format**:

```go
func Move(src string, dst string) error 
```

***Example***

```go
func ExampleMove() {
    // Initialize variables
    var (
        srcPath = gfile.Join(gfile.TempDir("gfile_example_basic_dir"), "file1")
        dstPath = gfile.Join(gfile.TempDir("gfile_example_basic_dir"), "file2")
    )

    // Check if the destination path is a file
    fmt.Println(gfile.IsFile(dstPath))

    // Move `src` to `dst` path.
    // If `dst` already exists and is not a directory, it'll be replaced.
    gfile.Move(srcPath, dstPath)

    fmt.Println(gfile.IsFile(srcPath))
    fmt.Println(gfile.IsFile(dstPath))

    // Output:
    // false
    // false
    // true
}
```

### Rename

**Description**: An alias for `Move`, renames the source file or directory to the destination path.

**Note**: If the destination already exists and is a file, it will be replaced, resulting in data loss!

**Format**:

```go
func Rename(src string, dst string) error
```

***Example***

```go
func ExampleRename() {
    // Initialize variables
    var (
        srcPath = gfile.Join(gfile.TempDir("gfile_example_basic_dir"), "file2")
        dstPath = gfile.Join(gfile.TempDir("gfile_example_basic_dir"), "file1")
    )

    // Check if the destination path is a file
    fmt.Println(gfile.IsFile(dstPath))

    // Renames (moves) `src` to `dst` path.
    // If `dst` already exists and is not a directory, it'll be replaced.
    gfile.Rename(srcPath, dstPath)

    fmt.Println(gfile.IsFile(srcPath))
    fmt.Println(gfile.IsFile(dstPath))

    // Output:
    // false
    // false
    // true
}
```

### Remove

**Description**: Deletes the file or directory at the given path.

**Format**:

```go
func Remove(path string) error
```

***Example***

```go
func ExampleRemove() {
    // Initialize variables
    var (
        path = gfile.Join(gfile.TempDir("gfile_example_basic_dir"), "file1")
    )

    // Checks whether the given `path` is a file, which means it's not a directory.
    fmt.Println(gfile.IsFile(path))

    // Deletes all files/directories with the `path` parameter.
    gfile.Remove(path)

    // Check again if the path is a file
    fmt.Println(gfile.IsFile(path))

    // Output:
    // true
    // false
}
```

### IsEmpty

**Description**: Checks the given path. If it is a directory, it checks if it contains files. If it is a file, it checks if its size is zero.

**Format**:

```go
func IsEmpty(path string) bool 
```

***Example***

```go
func ExampleIsEmpty() {
    // Initialize variables
    var (
        path = gfile.Join(gfile.TempDir("gfile_example_basic_dir"), "file1")
    )

    // Check whether the `path` is empty
    fmt.Println(gfile.IsEmpty(path))

    // Truncate file to make it empty
    gfile.Truncate(path, 0)

    // Check whether the `path` is empty again
    fmt.Println(gfile.IsEmpty(path))

    // Output:
    // false
    // true
}
```

### DirNames

**Description**: Retrieves a list of file names in the given directory, returning a slice of strings.

**Format**:

```go
func DirNames(path string) ([]string, error)
```

***Example***

```go
func ExampleDirNames() {
    // Initialize variables
    var (
        path = gfile.TempDir("gfile_example_basic_dir")
    )

    // Get sub-file names of the given directory `path`.
    dirNames, _ := gfile.DirNames(path)

    fmt.Println(dirNames)

    // May Output:
    // [file1]
}
```

### Glob

**Description**: Performs a fuzzy search for files matching a given pattern in a specified path. Supports regular expressions. The second parameter controls whether to return absolute paths.

**Format**:

```go
func Glob(pattern string, onlyNames ...bool) ([]string, error)
```

***Example***

```go
func ExampleGlob() {
    // Initialize variables
    var (
        path = gfile.Pwd() + gfile.Separator + "*_example_basic_test.go"
    )

    // Get sub-file names of the given directory `path`.
    // Only show file names
    matchNames, _ := gfile.Glob(path, true)
    fmt.Println(matchNames)

    // Show full paths of the files
    matchNames, _ = gfile.Glob(path, false)
    fmt.Println(matchNames)

    // May Output:
    // [gfile_z_example_basic_test.go]
    // [xxx/gf/os/gfile/gfile_z_example_basic_test.go]
}
```

### Exists

**Description**: Checks whether the given path exists.

**Format**:

```go
func Exists(path string) bool
```

***Example***

```go
func ExampleExists() {
    // Initialize variables
    var (
        path = gfile.Join(gfile.TempDir("gfile_example_basic_dir"), "file1")
    )

    // Checks whether the given `path` exists.
    fmt.Println(gfile.Exists(path))

    // Output:
    // true
}
```

### Chdir

**Description**: Changes the current working directory to the specified path.

**Format**:

```go
func Chdir(dir string) error
```

***Example***

```go
func ExampleChdir() {
    // Initialize variables
    var (
        path = gfile.Join(gfile.TempDir("gfile_example_basic_dir"), "file1")
    )

    // Get the current working directory
    fmt.Println(gfile.Pwd())

    // Changes the current working directory to the specified directory.
    gfile.Chdir(path)

    // Get the current working directory
    fmt.Println(gfile.Pwd())

    // May Output:
    // xxx/gf/os/gfile
    // /tmp/gfile_example_basic_dir/file1
}
```

## Path Operations

### Join

**Description**: Joins multiple string paths using the `/` separator.

**Format**:

```go
func Join(paths ...string) string
```

***Example***

```go
func ExampleJoin() {
    // Initialize variables
    var (
        dirPath  = gfile.TempDir("gfile_example_basic_dir")
        filePath = "file1"
    )

    // Joins string array paths with the file separator of the current system.
    joinString := gfile.Join(dirPath, filePath)

    fmt.Println(joinString)

    // Output:
    // /tmp/gfile_example_basic_dir/file1
}
```

---

### Abs

**Description**: Returns the absolute path of a given path.

**Format**:

```go
func Abs(path string) string
```

***Example***

```go
func ExampleAbs() {
    // Initialize variables
    var (
        path = gfile.Join(gfile.TempDir("gfile_example_basic_dir"), "file1")
    )

    // Get an absolute representation of the path.
    fmt.Println(gfile.Abs(path))

    // Output:
    // /tmp/gfile_example_basic_dir/file1
}
```

---

### RealPath

**Description**: Retrieves the absolute path of a given path.

**Note**: Returns an empty string if the file does not exist.

**Format**:

```go
func RealPath(path string) string
```

***Example***

```go
func ExampleRealPath() {
    // Initialize variables
    var (
        realPath  = gfile.Join(gfile.TempDir("gfile_example_basic_dir"), "file1")
        worryPath = gfile.Join(gfile.TempDir("gfile_example_basic_dir"), "worryFile")
    )

    // Fetch an absolute representation of the path.
    fmt.Println(gfile.RealPath(realPath))
    fmt.Println(gfile.RealPath(worryPath))

    // Output:
    // /tmp/gfile_example_basic_dir/file1
    //
}
```

---

### SelfName

**Description**: Gets the name of the currently running program.

**Format**:

```go
func SelfName() string
```

***Example***

```go
func ExampleSelfName() {
    // Get the file name of the current running process
    fmt.Println(gfile.SelfName())

    // May Output:
    // ___github_com_gogf_gf_v2_os_gfile__ExampleSelfName
}
```

---

### Basename

**Description**: Retrieves the last element from the given path, including the file extension.

**Format**:

```go
func Basename(path string) string
```

***Example***

```go
func ExampleBasename() {
    // Initialize variables
    var (
        path = gfile.Pwd() + gfile.Separator + "testdata/readline/file.log"
    )

    // Get the last element of the path, which contains the file extension.
    fmt.Println(gfile.Basename(path))

    // Output:
    // file.log
}
```

---

### Name

**Description**: Retrieves the last element from the given path, excluding the file extension.

**Format**:

```go
func Name(path string) string
```

***Example***

```go
func ExampleName() {
    // Initialize variables
    var (
        path = gfile.Pwd() + gfile.Separator + "testdata/readline/file.log"
    )

    // Get the last element of the path without the file extension.
    fmt.Println(gfile.Name(path))

    // Output:
    // file
}
```

---

### Dir

**Description**: Retrieves the directory portion of a given path, excluding the last element.

**Format**:

```go
func Dir(path string) string
```

***Exampl***e

```go
func ExampleDir() {
    // Initialize variables
    var (
        path = gfile.Join(gfile.TempDir("gfile_example_basic_dir"), "file1")
    )

    // Get all but the last element of the path, typically the path's directory.
    fmt.Println(gfile.Dir(path))

    // Output:
    // /tmp/gfile_example_basic_dir
}
```

---

### Ext

**Description**: Retrieves the file extension of a given path, including the `.`.

**Format**:

```go
func Ext(path string) string
```

***Example***

```go
func ExampleExt() {
 // Initialize variables
 var (
  path = gfile.Pwd() + gfile.Separator + "testdata/readline/file.log"
 )

 // Get the file name extension used by the path.
 fmt.Println(gfile.Ext(path))

 // Output:
 // .log
}
```

---

### ExtName

**Description**: Retrieves the file extension of a given path, excluding the `.`.

**Format**:

```go
func ExtName(path string) string
```

***Example***

```go
func ExampleExtName() {
 // Initialize variables
 var (
  path = gfile.Pwd() + gfile.Separator + "testdata/readline/file.log"
 )

 // Get the file name extension used by the path but the result does not contain the symbol `.`.
 fmt.Println(gfile.ExtName(path))

 // Output:
 // log
}
```

---

### MainPkgPath

**Description**: Retrieves the absolute path where the main file (entry point) is located.

**Note**:

- This method is only available in the development environment and is effective only in the source code development environment. After building the binary, it will display the path of the source code.
- The first call to this method from within an asynchronous goroutine may not return the path of the main package.

**Format**:

```go
func MainPkgPath() string
```

***Example***

```go
func Test() {
    fmt.Println("main pkg path on main:", gfile.MainPkgPath())
    char := make(chan int, 1)
    go func() {
        fmt.Println("main pkg path on goroutine:", gfile.MainPkgPath())
        char <- 1
    }()
    select {
        case <-char:
    }
    // Output:
    // /xxx/xx/xxx/xx
    // /xxx/xx/xxx/xx
}
// Binary package
$ ./testDemo 
main pkg path on main: /xxx/xx/xxx/xx
main pkg path on goroutine: /xxx/xx/xxx/xx
```
