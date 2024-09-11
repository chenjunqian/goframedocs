# Template Engine - Base Methods

The GoFrame framework has made improvements to some basic functions in the Golang standard library.

## Pipeline Variables

Variables can be passed between functions using the pipeline symbol `|`.

```go
{{.value | Func1 | Func2}}
```

## Using Parentheses

```go
{{printf "nums is %s %d" (printf "%d %d" 1 2) 3}}
```

## and

The `and` function evaluates each argument in order and returns the first empty argument, or the last non-empty argument.

```go
{{and .X .Y .Z}}
```

## call

The `call` function allows you to call a function and pass arguments to it.

```go
{{call .Field.Func .Arg1 .Arg2}}
```

The called function must return either one or two values. If two values are returned, the second value should be an error. If the returned error is not `nil`, execution will stop.

## index

The `index` function supports `map`, `slice`, `array`, and `string` types, and retrieves the value at the specified index.

```go
{{index .Maps "name"}}
```

## len

The `len` function returns the length of the given type, supporting `map`, `slice`, `array`, `string`, and `chan`.

```go
{{printf "The content length is %d" (.Content | len)}}
```

## not

The `not` function returns the negation of the input parameter.

For example, to check if a variable is empty:

```go
{{if not .Var}}
    // Execute if .Var is empty (nil, 0, "", slice/map of length 0)
{{else}}
    // Execute if .Var is not empty
{{end}}
```

## or

The `or` function evaluates each argument in order and returns the first non-empty argument, or the last argument if all are empty.

```go
{{or .X .Y .Z}}
```

## print printf and println

- `print` is equivalent to `fmt.Sprint`.
- `printf` is equivalent to `fmt.Sprintf`.
- `println` is equivalent to `fmt.Sprintln`.

## urlquery

The `urlquery` function encodes a URL string.

```go
{{urlquery "http://johng.cn"}}
```

This will return:

```text
http%3A%2F%2Fjohng.cn
```

## eq ne lt le gt ge

These functions are typically used with `if` statements.

- `eq`: `arg1 == arg2`
- `ne`: `arg1 != arg2`
- `lt`: `arg1 < arg2`
- `le`: `arg1 <= arg2`
- `gt`: `arg1 > arg2`
- `ge`: `arg1 >= arg2`

Unlike other functions, `eq` supports multiple arguments.

```go
{{eq arg1 arg2 arg3 arg4}}
```

This is equivalent to:

```go
arg1 == arg2 || arg1 == arg3 || arg1 == arg4 ...
```

with `if`

```go
{{if eq true .Var1 .Var2 .Var3}}...{{end}}
{{if lt 100 200}}...{{end}}
```

To check if a variable is not empty:

```go
{{if .Var}}
    // Execute if .Var is not empty
{{else}}
    // Execute if .Var is empty (nil, 0, "", slice/map of length 0)
{{end}}
```

## Improvements

The GoFrame template engine has made improvements to the standard library comparison functions (`eq`, `ne`, `lt`, `le`, `gt`, `ge`) to support comparisons between any data types.

In the standard library template, the following comparison:

```go
{{eq 1 "1"}}
```

Will result in an error:

```bash
panic: template: at <eq 1 "1">: error calling eq: incompatible types for comparison
```

This panic error occurs because the two arguments are of different data types.

### Improved Comparison in GoFrame

In the GoFrame framework's template engine, the two arguments are automatically converted to the same data type before comparison. This provides better development experience and flexibility. If both arguments are integers (or integer strings), they are converted to integers for comparison. Otherwise, they are converted to strings (case-sensitive) for comparison.

## Example of Improved Functionality

Here’s an example demonstrating the improved comparison functions in the GoFrame template engine:

```go
package main

import (
    "context"
    "fmt"
    "github.com/gogf/gf/v2/frame/g"
)

func main() {
    tplContent := `
eq:
eq "a" "a": {{eq "a" "a"}}
eq "1" "1": {{eq "1" "1"}}
eq  1  "1": {{eq  1  "1"}}

ne:
ne  1  "1": {{ne  1  "1"}}
ne "a" "a": {{ne "a" "a"}}
ne "a" "b": {{ne "a" "b"}}

lt:
lt  1  "2": {{lt  1  "2"}}
lt  2   2 : {{lt  2   2 }}
lt "a" "b": {{lt "a" "b"}}

le:
le  1  "2": {{le  1  "2"}}
le  2   1 : {{le  2   1 }}
le "a" "a": {{le "a" "a"}}

gt:
gt  1  "2": {{gt  1  "2"}}
gt  2   1 : {{gt  2   1 }}
gt "a" "a": {{gt "a" "a"}}

ge:
ge  1  "2": {{ge  1  "2"}}
ge  2   1 : {{ge  2   1 }}
ge "a" "a": {{ge "a" "a"}}
`
    content, err := g.View().ParseContent(context.TODO(), tplContent, nil)
    if err != nil {
        panic(err)
    }
    fmt.Println(content)
}
```

### Output Result

```text
eq:
eq "a" "a": true
eq "1" "1": true
eq  1  "1": true

ne:
ne  1  "1": false
ne "a" "a": false

ne "a" "b": true

lt:
lt  1  "2": true
lt  2   2 : false
lt "a" "b": true

le:
le  1  "2": true
le  2   1 : false
le "a" "a": true

gt:
gt  1  "2": false
gt  2   1 : true
gt "a" "a": false

ge:
ge  1  "2": false
ge  2   1 : true
ge "a" "a": true
```
