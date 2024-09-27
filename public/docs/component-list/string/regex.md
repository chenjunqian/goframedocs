# Regular Expressions - gregex

## Basic Introduction

`gregex` provides support for regular expressions. It is built on top of the standard library's `regexp`, greatly simplifying the usage of regular expressions. Additionally, it utilizes a parsing cache design to improve execution efficiency.

## Usage

To use `gregex`, you need to import it into your Go application:

```go
import "github.com/gogf/gf/v2/text/gregex"
```

## API Documentation

For detailed information about the API, you can visit the official documentation at [GoDoc - gregex](https://pkg.go.dev/github.com/gogf/gf/v2/text/gregex).
Here’s the translation and Markdown formatting for the provided example code snippet and its explanation:

## Basic Usage

Here is a simple example of how to use `gregex` in a Go application:

```go
package main

import (
    "fmt"
    "github.com/gogf/gf/v2/text/gregex"
)

func main() {
    match, _ := gregex.MatchString(`(\w+).+\-\-\s*(.+)`, `GoFrame is best! -- John`)
    fmt.Printf(`%s says "%s" is the one he loves!`, match[2], match[1])
}
```

***Execution Output***

After running the code, the output will be:

```bash
John says "GoFrame" is the one he loves!
```

## Functions

The following is a list of commonly used methods. Please note that the documentation may lag behind the latest code features. For more methods and examples, please refer to the code documentation: [Goframe Documentation](https://pkg.go.dev/github.com/gogf/gf/v2/text/gregex).

When a function name contains "All," it will continue to search for non-overlapping subsequent matches and return a slice.

When a function name contains "String," both parameters and return values are strings; otherwise, they are []byte.

### IsMatch and IsMatchString

**Description:** The `IsMatch()` method can test a string to determine if it matches the pattern of a regular expression. If a match is found, this method returns `true`; otherwise, it returns `false`.

**Format:**

```go
IsMatch(pattern string, src []byte) bool
IsMatchString(pattern string, src string) bool
```

**Tip:** The `regexp` package has already processed and cached the Regex objects at a lower level, significantly improving execution efficiency. No need to explicitly recreate them each time.

**Example:**

```go
func ExampleIsMatch() {
    patternStr := `\d+`
    g.Dump(gregex.IsMatch(patternStr, []byte("hello 2022! hello GoFrame!")))
    g.Dump(gregex.IsMatch(patternStr, nil))
    g.Dump(gregex.IsMatch(patternStr, []byte("hello GoFrame!")))

    // Output:
    // true
    // false
    // false
}
```

### Match and MatchString

**Description:** Used to match substrings. `Match` only returns the first match result. Unlike the native regex methods, `gregex` wraps `FindSubmatch`, directly returning the first slice that includes the sub-pattern results.

**Format:**

```go
Match(pattern string, src []byte) ([][]byte, error)
MatchString(pattern string, src string) ([]string, error)
```

**Example:** Match parameters in a URL.

```go
func ExampleMatch() {
    patternStr := `(\w+)=(\w+)`
    matchStr := "https://goframe.org/pages/viewpage.action?pageId=1114219&searchId=8QC5D1D2E!"
    // This method looks for the first match index
    result, err := gregex.Match(patternStr, []byte(matchStr))
    g.Dump(result)
    g.Dump(err)

    // Output:
    // [
    //     "pageId=1114219",
    //     "pageId",
    //     "1114219",
    // ]
    // <nil>
}
```

### MatchAll and MatchAllString

**Description:** Used to match substrings. `MatchAll` returns all results. Unlike the native regex methods, `gregex`’s `MatchAll` wraps `FindAllSubmatch`, returning a slice of all result sets, including results of sub-patterns.

**Format:**

```go
MatchAllString(pattern string, src string) ([][]string, error)
MatchAll(pattern string, src []byte) ([][][]byte, error)
```

**Example:** Match parameters in a URL.

```go
func ExampleMatchAll() {
    patternStr := `(\w+)=(\w+)`
    matchStr := "https://goframe.org/pages/viewpage.action?pageId=1114219&searchId=8QC5D1D2E!"
    result, err := gregex.MatchAll(patternStr, []byte(matchStr))
    g.Dump(result)
    g.Dump(err)

    // Output:
    //  [
    //     [
    //         "pageId=1114219",
    //         "pageId",
    //         "1114219",
    //     ],
    //     [
    //         "searchId=8QC5D1D2E",
    //         "searchId",
    //         "8QC5D1D2E",
    //     ],
    // ]
    // <nil>
}

func ExampleMatchAllString() {
    patternStr := `(\w+)=(\w+)`
    matchStr := "https://goframe.org/pages/viewpage.action?pageId=1114219&searchId=8QC5D1D2E!"
    result, err := gregex.MatchAllString(patternStr, matchStr)
    g.Dump(result)
    g.Dump(err)

    // Output:
    // [
    //     [
    //         "pageId=1114219",
    //         "pageId",
    //         "1114219",
    //     ],
    //     [
    //         "searchId=8QC5D1D2E",
    //         "searchId",
    //         "8QC5D1D2E",
    //     ],
    // ]
    // <nil>
}
```

### Quote

**Description:** Escapes specific symbols in the specified regular expression.

**Format:**

```go
Quote(s string) string
```

**Example:**

```go
func ExampleQuote() {
    result := gregex.Quote(`[1-9]\d+`)
    g.Dump(result)

    // Output:
    // "\[1-9\]\\d\+"
}
```

### Replace and ReplaceString

**Description:** Replaces all matching strings and returns a copy of the source string.

**Format:**

```go
Replace(pattern string, replace, src []byte) ([]byte, error)
ReplaceString(pattern, replace, src string) (string, error)
```

**Example:**

```go
func ExampleReplace() {
    var (
        patternStr  = `\d+`
        str         = "hello GoFrame 2020!"
        repStr      = "2021"
        result, err = gregex.Replace(patternStr, []byte(repStr), []byte(str))
    )
    g.Dump(err)
    g.Dump(result)

    // Output:
    // <nil>
    // "hello GoFrame 2021!"
}
```

### ReplaceFunc and ReplaceStringFunc

**Description:** Replaces all matching strings and returns a copy of the source string. Unlike the `Replace` method, this method allows for additional checks or processing in a closure rather than a simple replacement.

**Format:**

```go
ReplaceFunc(pattern string, src []byte, replaceFunc func(b []byte) []byte) ([]byte, error)
ReplaceStringFunc(pattern string, src string, replaceFunc func(s string) string) (string, error)
```

**Example:**

```go
func ExampleReplaceFunc() {  
    var (
        patternStr = `(\d+)~(\d+)`
        str        = "hello GoFrame 2018~2020!"
    )
    // In contrast to [ExampleReplace]
    result, err := gregex.ReplaceFunc(patternStr, []byte(str), func(match []byte) []byte {
        g.Dump(match)
        return bytes.Replace(match, []byte("2020"), []byte("2023"), -1)
    })
    g.Dump(result)
    g.Dump(err)

    // ReplaceStringFunc
    resultStr, _ := gregex.ReplaceStringFunc(patternStr, str, func(match string) string {
        g.Dump(match)
        return strings.Replace(match, "2020", "2023", -1)
    })
    g.Dump(resultStr)
    g.Dump(err)

    // Output:
    // "2018~2020"
    // "hello gf 2018~2023!" // ReplaceFunc result
    // <nil>
    // "2018~2020"
    // "hello gf 2018-2023!" // ReplaceStringFunc result
    // <nil> 
}
```

### ReplaceFuncMatch and ReplaceStringFuncMatch

**Description:** `ReplaceFuncMatch` returns a copy of the source string, where all matches of the regular expression have been replaced by the return values of a function that processes matching byte slices. The replacement directly substitutes the original matches.

**Format:**

```go
ReplaceFuncMatch(pattern string, src []byte, replaceFunc func(match [][]byte) []byte) ([]byte, error)
ReplaceStringFuncMatch(pattern string, src string, replaceFunc func(match []string) string) (string, error)
```

**Example:**

```go
func ExampleReplaceStringFuncMatch() {
    var (
        patternStr = `([A-Z])\w+`
        str        = "hello Golang 2018~2021!"
    )
    // In contrast to [ExampleReplaceFunc]
    result, err := gregex.ReplaceFuncMatch(patternStr, []byte(str), func(match [][]byte) []byte {
        g.Dump(match)
        return []byte("GoFrame")
    })
    g.Dump(result)
    g.Dump(err)

    // ReplaceStringFuncMatch
    resultStr, err := gregex.ReplaceStringFuncMatch(patternStr, str, func(match []string) string {
        g.Dump(match)
        match[0] = "Gf"
        return match[0]
    })
    g.Dump(resultStr)
    g.Dump(err)

    // Output:
    // [
    //  "Golang",
    //  "G",
    // ]
    // "hello GoFrame 2018~2021!" // ReplaceFuncMatch result
    // <nil>
    // [
    //  "Golang",
    //  "G",
    // ]
    // "hello Gf 201

8~2021!" // ReplaceStringFuncMatch result
    // <nil> 
}
```

### Split

**Description:** Splits the text content based on the specified regular expression. It does not include metacharacters, equivalent to `strings.SplitN`.

**Format:**

```go
Split(pattern string, src string) []string
```

**Example:**

```go
func ExampleSplit() {
    patternStr := `\d+`
    str := "hello2020GoFrame"
    result := gregex.Split(patternStr, str)
    g.Dump(result)

    // Output:
    // [
    //     "hello",
    //     "GoFrame",
    // ]
}
```

### Validate

**Description:** A wrapper around the native method `compile`, checks if the given regular expression is valid.

**Format:**

```go
Validate(pattern string) error
```

**Example:**

```go
func ExampleValidate() {
    // Valid match statement
    g.Dump(gregex.Validate(`\d+`))
    // Mismatched statement
    g.Dump(gregex.Validate(`[a-9]\d+`))

    // Output:
    // <nil>
    // {
    //     Code: "invalid character class range",
    //     Expr: "a-9",
    // }
}
```
