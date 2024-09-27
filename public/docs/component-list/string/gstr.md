# String - gstr

Created by Guo Qiang, last modified by Hunk Zhu Hua on February 4, 2024.

`gstr` provides powerful and convenient text processing components, with many built-in commonly used string processing methods. Compared to the Golang standard library, it is more comprehensive and rich, suitable for handling most business scenarios.

***Usage***

```go
import "github.com/gogf/gf/v2/text/gstr"
```

***API Documentation***

You can find the official documentation here: [Goframe API Documentation](https://pkg.go.dev/github.com/gogf/gf/v2/text/gstr).

Below is a list of commonly used methods. Please note that the documentation might lag behind new features in the code. For more methods and examples, refer to the code documentation: [Goframe Text Gstr Documentation](https://pkg.go.dev/github.com/gogf/gf/v2/text/gstr).

## String Checks

### IsNumeric

**Description**: `IsNumeric` checks whether the string `s` is a number.

**Syntax**:

```go
IsNumeric(s string) bool
```

**Example**:

```go
func ExampleIsNumeric() {
    fmt.Println(gstr.IsNumeric("88"))
    fmt.Println(gstr.IsNumeric("3.1415926"))
    fmt.Println(gstr.IsNumeric("abc"))
    // Output:
    // true
    // true
    // false
}
```

## String Length

### LenRune

**Description**: `LenRune` returns the length of a Unicode string.

**Syntax**:

```go
LenRune(str string) int
```

**Example**:

```go
func ExampleLenRune() {
    var (
        str    = `GoFrame框架`
        result = gstr.LenRune(str)
    )
    fmt.Println(result)

    // Output:
    // 9
}
```

## String Creation

### Repeat

**Description**: `Repeat` returns a new string made by repeating the `input` string `multiplier` times.

**Syntax**:

```go
Repeat(input string, multiplier int) string
```

**Example**:

```go
func ExampleRepeat() {
    var (
        input      = `goframe `
        multiplier = 3
        result     = gstr.Repeat(input, multiplier)
    )
    fmt.Println(result)

    // Output:
    // goframe goframe goframe
}
```

## Case Conversion

### ToLower

**Description**: `ToLower` converts all Unicode characters in `s` to lowercase and returns a copy of the string.

**Syntax**:

```go
ToLower(s string) string
```

**Example**:

```go
func ExampleToLower() {
    var (
        s      = `GOFRAME`
        result = gstr.ToLower(s)
    )
    fmt.Println(result)

    // Output:
    // goframe
}
```

### ToUpper

**Description**: `ToUpper` converts all Unicode characters in `s` to uppercase and returns a copy of the string.

**Syntax**:

```go
ToUpper(s string) string
```

**Example**:

```go
func ExampleToUpper() {
    var (
        s      = `goframe`
        result = gstr.ToUpper(s)
    )
    fmt.Println(result)

    // Output:
    // GOFRAME
}
```

### UcFirst

**Description**: `UcFirst` converts the first character of `s` to uppercase and returns a copy of the string.

**Syntax**:

```go
UcFirst(s string) string
```

**Example**:

```go
func ExampleUcFirst() {
    var (
        s      = `hello`
        result = gstr.UcFirst(s)
    )
    fmt.Println(result)

    // Output:
    // Hello
}
```

### LcFirst

**Description**: `LcFirst` converts the first character of `s` to lowercase and returns a copy of the string.

**Syntax**:

```go
LcFirst(s string) string
```

**Example**:

```go
func ExampleLcFirst() {
    var (
        str    = `Goframe`
        result = gstr.LcFirst(str)
    )
    fmt.Println(result)

    // Output:
    // goframe
}
```

### UcWords

**Description**: `UcWords` capitalizes the first character of each word in the string `str`.

**Syntax**:

```go
UcWords(str string) string
```

**Example**:

```go
func ExampleUcWords() {
    var (
        str    = `hello world`
        result = gstr.UcWords(str)
    )
    fmt.Println(result)

    // Output:
    // Hello World
}
```

## Character Checks

### IsLetterLower

**Description**: `IsLetterLower` checks if the given character `b` is a lowercase letter.

**Syntax**:

```go
IsLetterLower(b byte) bool
```

**Example**:

```go
func ExampleIsLetterLower() {
    fmt.Println(gstr.IsLetterLower('a'))
    fmt.Println(gstr.IsLetterLower('A'))

    // Output:
    // true
    // false
}
```

### IsLetterUpper

**Description**: `IsLetterUpper` checks if the given character `b` is an uppercase letter.

**Syntax**:

```go
IsLetterUpper(b byte) bool
```

**Example**:

```go
func ExampleIsLetterUpper() {
    fmt.Println(gstr.IsLetterUpper('A'))
    fmt.Println(gstr.IsLetterUpper('a'))

    // Output:
    // true
    // false
}
```

## String Comparisons

### Compare

**Description**: `Compare` returns an integer comparing two strings lexicographically. If `a == b`, the result is `0`. If `a < b`, the result is `-1`. If `a > b`, the result is `+1`.

**Syntax**:

```go
Compare(a, b string) int
```

**Example**:

```go
func ExampleCompare() {
    fmt.Println(gstr.Compare("c", "c"))
    fmt.Println(gstr.Compare("a", "b"))
    fmt.Println(gstr.Compare("c", "b"))

    // Output:
    // 0
    // -1
    // 1
}
```

### Equal

**Description**: `Equal` checks whether `a` and `b` are equal, ignoring case differences.

**Syntax**:

```go
Equal(a, b string) bool
```

**Example**:

```go
func ExampleEqual() {
    fmt.Println(gstr.Equal(`A`, `a`))
    fmt.Println(gstr.Equal(`A`, `A`))
    fmt.Println(gstr.Equal(`A`, `B`))

    // Output:
    // true
    // true
    // false
}
```

## String Splitting and Joining

### Split

**Description**: `Split` divides the string `str` into a slice of strings (`[]string`), using `delimiter` to separate the parts.

**Syntax**:

```go
Split(str, delimiter string) []string
```

**Example**:

```go
func ExampleSplit() {
    var (
        str       = `a|b|c|d`
        delimiter = `|`
        result    = gstr.Split(str, delimiter)
    )
    fmt.Printf(`%#v`, result)

    // Output:
    // []string{"a", "b", "c", "d"}
}
```

### SplitAndTrim

**Description**: `SplitAndTrim` splits the string `str` into a slice of strings (`[]string`), using `delimiter`, and then trims each element. Empty elements after trimming are ignored.

**Syntax**:

```go
SplitAndTrim(str, delimiter string, characterMask ...string) []string
```

**Example**:

```go
func ExampleSplitAndTrim() {
    var (
        str       = `a|b|||||c|d`
        delimiter = `|`
        result    = gstr.SplitAndTrim(str, delimiter)
    )
    fmt.Printf(`%#v`, result)

    // Output:
    // []string{"a", "b", "c", "d"}
}
```

### Join

**Description**: `Join` combines the elements of `array` into a new string, with `sep` as the separator.

**Syntax**:

```go
Join(array []string, sep string) string
```

**Example**:

```go
func ExampleJoin() {
    var (
        array  = []string{"goframe", "is", "very", "easy", "to", "use"}
        sep    = ` `
        result = gstr.Join(array, sep)
    )
    fmt.Println(result)

    // Output:
    // goframe is very easy to use
}
```

### JoinAny

**Description**: `JoinAny` combines the elements of `array` into a new string. The `sep` parameter specifies the separator between elements. The `array` can be of any type.

**Syntax**:

```go
JoinAny(array interface{}, sep string) string
```

**Example**:

```go
func ExampleJoinAny() {
    var (
        sep    = `,`
        arr2   = []int{99, 73, 85, 66}
        result = gstr.JoinAny(arr2, sep)
    )
    fmt.Println(result)

    // Output:
    // 99,73,85,66
}
```

### Explode

**Description**: `Explode` splits the string `str` into a slice of strings (`[]string`) using the `delimiter`.

**Syntax**:

```go
Explode(delimiter, str string) []string
```

**Example**:

```go
func ExampleExplode() {
    var (
        str       = `Hello World`
        delimiter = " "
        result    = gstr.Explode(delimiter, str)
    )
    fmt.Printf(`%#v`, result)

    // Output:
    // []string{"Hello", "World"}
}
```

### Implode

**Description**: `Implode` combines the elements of the `pieces` array into a single string, using `glue` as the separator.

**Syntax**:

```go
Implode(glue string, pieces []string) string
```

**Example**:

```go
func ExampleImplode() {
    var (
        pieces = []string{"goframe", "is", "very", "easy", "to", "use"}
        glue   = " "
        result = gstr.Implode(glue, pieces)
    )
    fmt.Println(result)

    // Output:
    // goframe is very easy to use
}
```

### ChunkSplit

**Description**: `ChunkSplit` splits the `body` string into smaller chunks of `chunkLen` length, and joins them using `end`.

**Syntax**:

```go
ChunkSplit(body string, chunkLen int, end string) string
```

**Example**:

```go
func ExampleChunkSplit() {
    var (
        body     = `1234567890`
        chunkLen = 2
        end      = "#"
        result   = gstr.ChunkSplit(body, chunkLen, end)
    )
    fmt.Println(result)

    // Output:
    // 12#34#56#78#90#
}
```

### Fields

**Description**: `Fields` returns a slice of strings (`[]string`) where each element is a word from the input string `str`.

**Syntax**:

```go
Fields(str string) []string
```

**Example**:

```go
func ExampleFields() {
    var (
        str    = `Hello World`
        result = gstr.Fields(str)
    )
    fmt.Printf(`%#v`, result)

    // Output:
    // []string{"Hello", "World"}
}
```

## Escape Handling

### AddSlashes

**Description**: `AddSlashes` adds a backslash (`\`) before certain characters in the string.

**Syntax**:

```go
AddSlashes(str string) string
```

**Example**:

```go
func ExampleAddSlashes() {
    var (
        str    = `'aa'"bb"cc\r\n\d\t`
        result = gstr.AddSlashes(str)
    )

    fmt.Println(result)

    // Output:
    // \'aa\'\"bb\"cc\\r\\n\\d\\t
}
```

### StripSlashes

**Description**: `StripSlashes` removes backslashes (`\`) that were used to escape characters in the string.

**Syntax**:

```go
StripSlashes(str string) string
```

**Example**:

```go
func ExampleStripSlashes() {
    var (
        str    = `C:\\windows\\GoFrame\\test`
        result = gstr.StripSlashes(str)
    )
    fmt.Println(result)

    // Output:
    // C:\windows\GoFrame\test
}
```

### QuoteMeta

**Description**: `QuoteMeta` adds a backslash (`\`) before each special character in the string, including `. \ + * ? [ ^ ] ( $ )`.

**Syntax**:

```go
QuoteMeta(str string, chars ...string) string
```

**Example**:

```go
func ExampleQuoteMeta() {
    {
        var (
            str    = `.\+?[^]()`
            result = gstr.QuoteMeta(str)
        )
        fmt.Println(result)
    }
    {
        var (
            str    = `https://goframe.org/pages/viewpage.action?pageId=1114327`
            result = gstr.QuoteMeta(str)
        )
        fmt.Println(result)
    }

    // Output:
    // \.\\\+\?\[\^\]\(\)
    // https://goframe\.org/pages/viewpage\.action\?pageId=1114327
}
```

## Counting

### Count

**Description**: `Count` returns the number of times `substr` appears in the string `s`. If `substr` is not found, it returns 0.

**Syntax**:

```go
Count(s, substr string) int
```

**Example**:

```go
func ExampleCount() {
    var (
        str     = `goframe is very, very easy to use`
        substr1 = "goframe"
        substr2 = "very"
        result1 = gstr.Count(str, substr1)
        result2 = gstr.Count(str, substr2)
    )
    fmt.Println(result1)
    fmt.Println(result2)

    // Output:
    // 1
    // 2
}
```

### CountI

**Description**: `CountI` counts the occurrences of `substr` in `s`, ignoring case. If `substr` is not found, it returns 0.

**Syntax**:

```go
CountI(s, substr string) int
```

**Example**:

```go
func ExampleCountI() {
    var (
        str     = `goframe is very, very easy to use`
        substr1 = "GOFRAME"
        substr2 = "VERY"
        result1 = gstr.CountI(str, substr1)
        result2 = gstr.CountI(str, substr2)
    )
    fmt.Println(result1)
    fmt.Println(result2)

    // Output:
    // 1
    // 2
}
```

### CountWords

**Description**: `CountWords` returns the word count of the string `str` as a `map[string]int`.

**Syntax**:

```go
CountWords(str string) map[string]int
```

**Example**:

```go
func ExampleCountWords() {
    var (
        str    = `goframe is very, very easy to use!`
        result = gstr.CountWords(str)
    )
    fmt.Printf(`%#v`, result)

    // Output:
    // map[string]int{"easy":1, "goframe":1, "is":1, "to":1, "use!":1, "very":1, "very,":1}
}
```

### CountChars

**Description**: `CountChars` returns a `map[string]int` that counts the occurrences of each character in `str`. The `noSpace` parameter controls whether spaces are counted.

**Syntax**:

```go
CountChars(str string, noSpace ...bool) map[string]int
```

**Example**:

```go
func ExampleCountChars() {
    var (
        str    = `goframe`
        result = gstr.CountChars(str)
    )
    fmt.Println(result)

    // May Output:
    // map[a:1 e:1 f:1 g:1 m:1 o:1 r:1]
    }
```

## Array Handling

### SearchArray

**Description**: `SearchArray` searches for the string `s` in the `[]string a` array, case-sensitively. It returns the index of `s` in `a`. If `s` is not found, it returns `-1`.

**Syntax**:

```go
SearchArray(a []string, s string) int
```

**Example**:

```go
func ExampleSearchArray() {
    var (
        array  = []string{"goframe", "is", "very", "nice"}
        str    = `goframe`
        result = gstr.SearchArray(array, str)
    )
    fmt.Println(result)

    // Output:
    // 0
}
```

### InArray

**Description**: `InArray` checks whether the string `s` exists in the `[]string a` array.

**Syntax**:

```go
InArray(a []string, s string) bool
```

**Example**:

```go
func ExampleInArray() {
    var (
        a      = []string{"goframe", "is", "very", "easy", "to", "use"}
        s      = "goframe"
        result = gstr.InArray(a, s)
    )
    fmt.Println(result)

    // Output:
    // true
}
```

### PrefixArray

**Description**: `PrefixArray` adds the prefix `prefix` to every string in the `[]string array`.

**Syntax**:

```go
PrefixArray(array []string, prefix string)
```

**Example**:

```go
func ExamplePrefixArray() {
    var (
        strArray = []string{"tom", "lily", "john"}
    )

    gstr.PrefixArray(strArray, "classA_")

    fmt.Println(strArray)

    // Output:
    // [classA_tom classA_lily classA_john]
}
```

## Naming Conversion

### CaseCamel

**Description**: `CaseCamel` converts the string to camel case, with the first letter capitalized.

**Syntax**:

```go
CaseCamel(s string) string
```

**Example**:

```go
func ExampleCaseCamel() {
    var (
        str    = `hello world`
        result = gstr.CaseCamel(str)
    )
    fmt.Println(result)

    // Output:
    // HelloWorld
}
```

### CaseCamelLower

**Description**: `CaseCamelLower` converts the string to camel case, with the first letter lowercase.

**Syntax**:

```go
CaseCamelLower(s string) string
```

**Example**:

```go
func ExampleCaseCamelLower() {
    var (
        str    = `hello world`
        result = gstr.CaseCamelLower(str)
    )
    fmt.Println(result)

    // Output:
    // helloWorld
}
```

### CaseSnake

**Description**: `CaseSnake` converts symbols (spaces, dots, hyphens) in the string to underscores (`_`) and makes all letters lowercase.

**Syntax**:

```go
CaseSnake(s string) string
```

**Example**:

```go
func ExampleCaseSnake() {
    var (
        str    = `hello world`
        result = gstr.CaseSnake(str)
    )
    fmt.Println(result)

    // Output:
    // hello_world
}
```

### CaseSnakeScreaming

**Description**: `CaseSnakeScreaming` converts symbols (spaces, dots, hyphens) in the string to underscores (`_`) and makes all letters uppercase.

**Syntax**:

```go
CaseSnakeScreaming(s string) string
```

**Example**:

```go
func ExampleCaseSnakeScreaming() {
    var (
        str    = `hello world`
        result = gstr.CaseSnakeScreaming(str)
    )
    fmt.Println(result)

    // Output:
    // HELLO_WORLD
}
```

### CaseSnakeFirstUpper

**Description**: `CaseSnakeFirstUpper` converts uppercase letters in the string to lowercase and adds an underscore (`_`) before each of them, except for the first letter.

**Syntax**:

```go
CaseSnakeFirstUpper(word string, underscore ...string) string
```

**Example**:

```go
func ExampleCaseSnakeFirstUpper() {
    var (
        str    = `RGBCodeMd5`
        result = gstr.CaseSnakeFirstUpper(str)
    )
    fmt.Println(result)

    // Output:
    // rgb_code_md5
}
```

### CaseKebab

**Description**: `CaseKebab` converts symbols (underscores, spaces, dots) in the string to hyphens (`-`) and makes all letters lowercase.

**Syntax**:

```go
CaseKebab(s string) string
```

**Example**:

```go
func ExampleCaseKebab() {
    var (
        str    = `hello world`
        result = gstr.CaseKebab(str)
    )
    fmt.Println(result)

    // Output:
    // hello-world
}
```

### CaseKebabScreaming

**Description**: `CaseKebabScreaming` converts symbols (underscores, spaces, dots) in the string to hyphens (`-`) and makes all letters uppercase.

**Syntax**:

```go
CaseKebabScreaming(s string) string
```

**Example**:

```go
func ExampleCaseKebabScreaming() {
    var (
        str    = `hello world`
        result = gstr.CaseKebabScreaming(str)
    )
    fmt.Println(result)

    // Output:
    // HELLO-WORLD
}
```

### CaseDelimited

**Description**: `CaseDelimited` replaces symbols in the string with a specific delimiter.

**Syntax**:

```go
CaseDelimited(s string, del byte) string
```

**Example**:

```go
func ExampleCaseDelimited() {
    var (
        str    = `hello world`
        del    = byte('-')
        result = gstr.CaseDelimited(str, del)
    )
    fmt.Println(result)

    // Output:
    // hello-world
}
```

### CaseDelimitedScreaming

**Description**: `CaseDelimitedScreaming` replaces symbols (spaces, underscores, dots, hyphens) in the string with a specific delimiter and converts letters to either uppercase or lowercase.

**Syntax**:

```go
CaseDelimitedScreaming(s string, del uint8, screaming bool) string
```

**Example**:

```go
func ExampleCaseDelimitedScreaming() {
    {
        var (
            str    = `hello world`
            del    = byte('-')
            result = gstr.CaseDelimitedScreaming(str, del, true)
        )
        fmt.Println(result)
    }
    {
        var (
            str    = `hello world`
            del    = byte('-')
            result = gstr.CaseDelimitedScreaming(str, del, false)
        )
        fmt.Println(result)
    }

    // Output:
    // HELLO-WORLD
    // hello-world
}
```

## Inclusion Checks

### Contains

**Description**: `Contains` returns whether the string `str` contains the substring `substr`, case-sensitive.

**Syntax**:

```go
Contains(str, substr string) bool
```

**Example**:

```go
func ExampleContains() {
    {
        var (
            str    = `Hello World`
            substr = `Hello`
            result = gstr.Contains(str, substr)
        )
        fmt.Println(result)
    }
    {
        var (
            str    = `Hello World`
            substr = `hello`
            result = gstr.Contains(str, substr)
        )
        fmt.Println(result)
    }

    // Output:
    // true
    // false
}
```

### ContainsI

**Description**: `ContainsI` checks whether `substr` is in `str`, case-insensitive.

**Syntax**:

```go
ContainsI(str, substr string) bool
```

**Example**:

```go
func ExampleContainsI() {
    var (
        str     = `Hello World`
        substr  = "hello"
        result1 = gstr.Contains(str, substr)
        result2 = gstr.ContainsI(str, substr)
    )
    fmt.Println(result1)
    fmt.Println(result2)

    // Output:
    // false
    // true
}
```

### ContainsAny

**Description**: `ContainsAny` checks whether any character in `chars` is found in the string `s`.

**Syntax**:

```go
ContainsAny(s, chars string) bool
```

**Example**:

```go
func ExampleContainsAny() {
    {
        var (
            s      = `goframe`
            chars  = "g"
            result = gstr.ContainsAny(s, chars)
        )
        fmt.Println(result)
    }
    {
        var (
            s      = `goframe`
            chars  = "G"
            result = gstr.ContainsAny(s, chars)
        )
        fmt.Println(result)
    }

    // Output:
    // true
    // false
}
```

## String Conversion

### Chr

**Description**: `Chr` returns the ASCII character corresponding to a number between 0-255.

**Syntax**:

```go
Chr(ascii int) string
```

**Example**:

```go
func ExampleChr() {
    var (
        ascii  = 65 // A
        result = gstr.Chr(ascii)
    )
    fmt.Println(result)

    // Output:
    // A
}
```

### Ord

**Description**: `Ord` converts the first byte of a string into a value between 0-255.

**Syntax**:

```go
Ord(char string) int
```

**Example**:

```go
func ExampleOrd() {
    var (
        str    = `goframe`
        result = gstr.Ord(str)
    )

    fmt.Println(result)

    // Output:
    // 103
}
```

### OctStr

**Description**: `OctStr` converts the octal values in the string `str` back to their original characters.

**Syntax**:

```go
OctStr(str string) string
```

**Example**:

```go
func ExampleOctStr() {
    var (
        str    = `\346\200\241`
        result = gstr.OctStr(str)
    )
    fmt.Println(result)

    // Output:
    // 怡
}
```

### Reverse

**Description**: `Reverse` returns the reverse of the string `str`.

**Syntax**:

```go
Reverse(str string) string
```

**Example**:

```go
func ExampleReverse() {
    var (
        str    = `123456`
        result = gstr.Reverse(str)
    )
    fmt.Println(result)

    // Output:
    // 654321
}
```

### NumberFormat

**Description**: `NumberFormat` formats a number with comma separators, decimal points, and optional settings for number of decimal places, decimal separators, and thousand separators.

**Syntax**:

```go
NumberFormat(number float64, decimals int, decPoint, thousandsSep string) string
```

**Example**:

```go
func ExampleNumberFormat() {
    var (
        number       float64 = 123456
        decimals             = 2
        decPoint             = "."
        thousandsSep         = ","
        result               = gstr.NumberFormat(number, decimals, decPoint, thousandsSep)
    )
    fmt.Println(result)

    // Output:
    // 123,456.00
}
```

### Shuffle

**Description**: `Shuffle` returns a shuffled version of the string `str`.

**Syntax**:

```go
Shuffle(str string) string
```

**Example**:

```go
func ExampleShuffle() {
    var (
        str    = `123456`
        result = gstr.Shuffle(str)
    )
    fmt.Println(result)

    // May Output:
    // 563214
}
```

### HideStr

**Description**: `HideStr` replaces a percentage of the characters in the string `str` with a hidden string (like `*`).

**Syntax**:

```go
HideStr(str string, percent int, hide string) string
```

**Example**:

```go
func ExampleHideStr() {
    var (
        str     = `13800138000`
        percent = 40
        hide    = `*`
        result  = gstr.HideStr(str, percent, hide)
    )
    fmt.Println(result)

    // Output:
    // 138****8000
}
```

### Nl2Br

**Description**: `Nl2Br` replaces all newline characters (`\n\r`, `\r\n`, `\r`, `\n`) in the string with HTML `<br />` tags.

**Syntax**:

```go
Nl2Br(str string, isXhtml ...bool) string
```

**Example**:

```go
func ExampleNl2Br() {
    var (
        str = `goframe
        is
        very
        easy
        to
        use`
        result = gstr.Nl2Br(str)
    )

    fmt.Println(result)

    // Output:
    // goframe<br>is<br>very<br>easy<br>to<br>use
}
```

### WordWrap

**Description**: `WordWrap` wraps the string `str` into lines of a given width without breaking words.

**Syntax**:

```go
WordWrap(str string, width int, br string) string
```

**Example**:

```go
func ExampleWordWrap() {
    {
        var (
            str    = `A very long woooooooooooooooooord. and something`
            width  = 8
            br     = "\n"
            result = gstr.WordWrap(str, width, br)
        )
        fmt.Println(result)
    }
    {
        var (
            str    = `The quick brown fox jumped over the lazy dog.`
            width  = 20
            br     = "<br />\n"
            result = gstr.WordWrap(str, width, br)
        )
        fmt.Printf("%v", result)
    }

    // Output:
    // A very
    // long
    // woooooooooooooooooord.
    // and
    // something
    // The quick brown fox<br />
    // jumped over the lazy<br />
    // dog.
}
```

## Domain Handling

### IsSubDomain

**Description**: `IsSubDomain` checks whether `subDomain` is a subdomain of `mainDomain`. It supports wildcards (`*`) in `mainDomain`.

**Syntax**:

```go
IsSubDomain(subDomain string, mainDomain string) bool
```

**Example**:

```go
func ExampleIsSubDomain() {
    var (
        subDomain  = `s.goframe.org`
        mainDomain = `goframe.org`
        result     = gstr.IsSubDomain(subDomain, mainDomain)
    )
    fmt.Println(result)

    // Output:
    // true
}
```

## Argument Parsing

### Parse

**Description**: `Parse` parses a string and returns it as a `map[string]interface{}`.

**Syntax**:

```go
Parse(s string) (result map[string]interface{}, err error)
```

**Example**:

```go
func ExampleParse() {
    {
        var (
            str       = `v1=m&v2=n`
            result, _ = gstr.Parse(str)
        )
        fmt.Println(result)
    }
    {
        var (
            str       = `v[a][a]=m&v[a][b]=n`
            result, _ = gstr.Parse(str)
        )
        fmt.Println(result)
    }
    {
        // The form of nested Slice is not yet supported.
        var str = `v[][]=m&v[][]=n`
        result, err := gstr.Parse(str)
        if err != nil {
            panic(err)
        }
        fmt.Println(result)
    }
    {
        // This will produce an error.
        var str = `v=m&v[a]=n`
        result, err := gstr.Parse(str)
        if err != nil {
            println(err)
        }
        fmt.Println(result)
    }
    {
        var (
            str       = `a .[[b=c`
            result, _ = gstr.Parse(str)
        )
        fmt.Println(result)
    }

    // May Output:
    // map[v1:m v2:n]
    // map[v:map[a:map[a:m b:n]]]
    // map[v:map[]]
    // Error: expected type 'map[string]interface{}' for key 'v', but got 'string'
    // map[]
    // map[a___[b:c]
}
```

## Position Finding

### Pos

**Description**: `Pos` returns the position of `needle` in `haystack`, case-sensitive. If not found, it returns -1.

**Syntax**:

```go
Pos(haystack, needle string, startOffset ...int) int
```

**Example**:

```go
func ExamplePos() {
    var (
        haystack = `Hello World`
        needle   = `World`
        result   = gstr.Pos(haystack, needle)
    )
    fmt.Println(result)

    // Output:
    // 6
}
```

### PosRune

**Description**: `PosRune` is similar to `Pos`, but it supports Unicode strings.

**Syntax**:

```go
PosRune(haystack, needle string, startOffset ...int) int
```

**Example**:

```go
func ExamplePosRune() {
    var (
        haystack = `GoFrame是一款模块化、高性能、企业级的Go基础开发框架`
        needle   = `Go`
        posI     = gstr.PosRune(haystack, needle)
        posR     = gstr.PosRRune(haystack, needle)
    )
    fmt.Println(posI)
    fmt.Println(posR)

    // Output:
    // 0
    // 22
}
```

### PosI

**Description**: `PosI` returns the position of `needle` in `haystack`, case-insensitive. If not found, it returns -1.

**Syntax**:

```go
PosI(haystack, needle string, startOffset ...int) int
```

**Example**:

```go
func ExamplePosI() {
    var (
        haystack = `goframe is very, very easy to use`
        needle   = `very`
        posI     = gstr.PosI(haystack, needle)
        posR     = gstr.PosR(haystack, needle)
    )
    fmt.Println(posI)
    fmt.Println(posR)

    // Output:
    // 11
    // 17
}
```

### PosRuneI

**Description**: `PosRuneI` is similar to `PosI`, but it supports Unicode strings.

**Syntax**:

```go
PosIRune(haystack, needle string, startOffset ...int) int
```

**Example**:

```go
func ExamplePosIRune() {
    {
        var (
            haystack    = `GoFrame是一款模块化、高性能、企业级的Go基础开发框架`
            needle      = `高性能`
            startOffset = 10
            result      = gstr.PosIRune(haystack, needle, startOffset)
        )
        fmt.Println(result)
    }
    {
        var (
            haystack    = `GoFrame是一款模块化、高性能、企业级的Go基础开发框架`
            needle      = `高性能`
            startOffset = 30
            result      = gstr.PosIRune(haystack, needle, startOffset)
        )
        fmt.Println(result)
    }

    // Output:
    // 14
    // -1
}
```

### PosR

**Description**: `PosR` returns the last occurrence of `needle` in `haystack`, case-sensitive. If not found, it returns -1.

**Syntax**:

```go
PosR(haystack, needle string, startOffset ...int) int
```

**Example**:

```go
func ExamplePosR() {
    var (
        haystack = `goframe is very, very easy to use`
        needle   = `very`
        posI     = gstr.PosI(haystack, needle)
        posR     = gstr.PosR(haystack, needle)
    )
    fmt.Println(posI)
    fmt.Println(posR)

    // Output:
    // 11
    // 17
}
```

### PosRuneR

**Description**: `PosRuneR` is similar to `PosR`, but it supports Unicode strings.

**Syntax**:

```go
PosRRune(haystack, needle string, startOffset ...int) int
```

**Example**:

```go
func ExamplePosRRune() {
    var (
        haystack = `GoFrame是一款模块化、高性能、企业级的Go基础开发框架`
        needle   = `Go`
        posI     = gstr.PosIRune(haystack, needle)
        posR     = gstr.PosRRune(haystack, needle)
    )
    fmt.Println(posI)
    fmt.Println(posR)

    // Output:
    // 0
    // 22
}
```

### PosRI

**Description**: `PosRI` returns the last occurrence of `needle` in `haystack`, case-insensitive. If not found, it returns -1.

**Syntax**:

```go
PosRI(haystack, needle string, startOffset ...int) int
```

**Example**:

```go
func ExamplePosRI() {
    var (
        haystack = `goframe is very, very easy to use`
        needle   = `VERY`
        posI     = gstr.PosI(haystack, needle)
        posR     = gstr.PosRI(haystack, needle)
    )
    fmt.Println(posI)
    fmt.Println(posR)

    // Output:
    // 11
    // 17
}
```

### PosRIRune

**Description**: `PosRIRune` is similar to `PosRI`, but it supports Unicode strings.

**Syntax**:

```go
PosRIRune(haystack, needle string, startOffset ...int) int
```

**Example**:

```go
func ExamplePosRIRune() {
    var (
        haystack = `GoFrame是一款模块化、高性能、企业级的Go基础开发框架`
        needle   = `GO`
        posI     = gstr.PosIRune(haystack, needle)
        posR     = gstr.PosRIRune(haystack, needle)
    )
    fmt.Println(posI)
    fmt.Println(posR)

    // Output:
    // 0
    // 22
}
```

## String Replacement Functions

### Replace

**Description**:  
`Replace` returns a new string where all occurrences of `search` in the `origin` string are replaced with `replace`. This operation is **case-sensitive**.

**Syntax**:

```go
Replace(origin, search, replace string, count ...int) string
```

**Example**:

```go
func ExampleReplace() {
    var (
        origin  = `golang is very nice!`
        search  = `golang`
        replace = `goframe`
        result  = gstr.Replace(origin, search, replace)
    )
    fmt.Println(result)

    // Output:
    // goframe is very nice!
}
```

### ReplaceI

**Description**:  
`ReplaceI` returns a new string where all occurrences of `search` in the `origin` string are replaced with `replace`. This operation is **case-insensitive**.

**Syntax**:

```go
ReplaceI(origin, search, replace string, count ...int) string
```

**Example**:

```go
func ExampleReplaceI() {
    var (
        origin  = `golang is very nice!`
        search  = `GOLANG`
        replace = `goframe`
        result  = gstr.ReplaceI(origin, search, replace)
    )
    fmt.Println(result)

    // Output:
    // goframe is very nice!
}
```

### ReplaceByArray

**Description**:  
`ReplaceByArray` returns a new string where `origin` is replaced by a series of search-replace pairs provided in the `array`, which are arranged as `[search1, replace1, search2, replace2, ...]`. The replacement is **case-sensitive**.

**Syntax**:

```go
ReplaceByArray(origin string, array []string) string
```

**Example**:

```go
func ExampleReplaceByArray() {
    {
        var (
            origin = `golang is very nice`
            array  = []string{"lang", "frame"}
            result = gstr.ReplaceByArray(origin, array)
        )
        fmt.Println(result)
    }
    {
        var (
            origin = `golang is very good`
            array  = []string{"golang", "goframe", "good", "nice"}
            result = gstr.ReplaceByArray(origin, array)
        )
        fmt.Println(result)
    }

    // Output:
    // goframe is very nice
    // goframe is very nice
}
```

### ReplaceIByArray

**Description**:  
`ReplaceIByArray` returns a new string where `origin` is replaced by search-replace pairs in the `array`. This operation is **case-insensitive**.

**Syntax**:

```go
ReplaceIByArray(origin string, array []string) string
```

**Example**:

```go
func ExampleReplaceIByArray() {
    var (
        origin = `golang is very Good`
        array  = []string{"Golang", "goframe", "GOOD", "nice"}
        result = gstr.ReplaceIByArray(origin, array)
    )

    fmt.Println(result)

    // Output:
    // goframe is very nice
}
```

### ReplaceByMap

**Description**:  
`ReplaceByMap` returns a new string where all keys in the `replaces` map are replaced by their corresponding values in `origin`. This operation is **case-sensitive**.

**Syntax**:

```go
ReplaceByMap(origin string, replaces map[string]string) string
```

**Example**:

```go
func ExampleReplaceByMap() {
    {
        var (
            origin   = `golang is very nice`
            replaces = map[string]string{
                "lang": "frame",
            }
            result = gstr.ReplaceByMap(origin, replaces)
        )
        fmt.Println(result)
    }
    {
        var (
            origin   = `golang is very good`
            replaces = map[string]string{
                "golang": "goframe",
                "good":   "nice",
            }
            result = gstr.ReplaceByMap(origin, replaces)
        )
        fmt.Println(result)
    }

    // Output:
    // goframe is very nice
    // goframe is very nice
}
```

### ReplaceIByMap

**Description**:  
`ReplaceIByMap` returns a new string where all keys in the `replaces` map are replaced by their corresponding values in `origin`. This operation is **case-insensitive**.

**Syntax**:

```go
ReplaceIByMap(origin string, replaces map[string]string) string
```

**Example**:

```go
func ExampleReplaceIByMap() {
    var (
        origin   = `golang is very nice`
        replaces = map[string]string{
            "Lang": "frame",
        }
        result = gstr.ReplaceIByMap(origin, replaces)
    )
    fmt.Println(result)

    // Output:
    // goframe is very nice
}
```

## Substring Extraction Functions

### Str

**Description**:  
`Str` returns the substring from the first occurrence of `needle` to the end of the `haystack` string, including `needle` itself.

**Syntax**:

```go
Str(haystack string, needle string) string
```

**Example**:

```go
func ExampleStr() {
    var (
        haystack = `xxx.jpg`
        needle   = `.`
        result   = gstr.Str(haystack, needle)
    )
    fmt.Println(result)

    // Output:
    // .jpg
}
```

### StrEx

**Description**:  
`StrEx` returns the substring from the first occurrence of `needle` to the end of the `haystack` string, excluding `needle` itself.

**Syntax**:

```go
StrEx(haystack string, needle string) string
```

**Example**:

```go
func ExampleStrEx() {
    var (
        haystack = `https://goframe.org/index.html?a=1&b=2`
        needle   = `?`
        result   = gstr.StrEx(haystack, needle)
    )
    fmt.Println(result)

    // Output:
    // a=1&b=2
}
```

### StrTill

**Description**:  
`StrTill` returns the substring from the start of the `haystack` string to the first occurrence of `needle`, including `needle` itself.

**Syntax**:

```go
StrTill(haystack string, needle string) string
```

**Example**:

```go
func ExampleStrTill() {
    var (
        haystack = `https://goframe.org/index.html?test=123456`
        needle   = `?`
        result   = gstr.StrTill(haystack, needle)
    )
    fmt.Println(result)

    // Output:
    // https://goframe.org/index.html?
}
```

### StrTillEx

**Description**:  
`StrTillEx` returns the substring from the start of the `haystack` string to the first occurrence of `needle`, excluding `needle` itself.

**Syntax**:

```go
StrTillEx(haystack string, needle string) string
```

**Example**:

```go
func ExampleStrTillEx() {
    var (
        haystack = `https://goframe.org/index.html?test=123456`
        needle   = `?`
        result   = gstr.StrTillEx(haystack, needle)
    )
    fmt.Println(result)

    // Output:
    // https://goframe.org/index.html
}
```

### SubStr

**Description**:  
`SubStr` returns a substring of `str` starting at `start` index and optionally up to a specified `length`. If `length` is omitted, the entire remaining string is returned.

**Syntax**:

```go
SubStr(str string, start int, length ...int) (substr string)
```

**Example**:

```go
func ExampleSubStr() {
    var (
        str    = `1234567890`
        start  = 0
        length = 4
        subStr = gstr.SubStr(str, start, length)
    )
    fmt.Println(subStr)

    // Output:
    // 1234
}
```

### SubStrRune

**Description**:  
`SubStrRune` returns a substring of `str` starting at `start` index, counting Unicode characters. It can also optionally limit the length of the substring.

**Syntax**:

```go
SubStrRune(str string, start int, length ...int) (substr string)
```

**Example**:

```go
func ExampleSubStrRune() {
    var (
        str    = `GoFrame是一款模块化、高性能、企业级的Go基础开发框架。`
        start  = 14
        length = 3
        subStr = gstr.SubStrRune(str, start, length)
    )
    fmt.Println(subStr)

    // Output:
    // 高性能
}
```

### StrLimit

**Description**:  
`StrLimit` returns a substring from the start of `str` with a length of `length`, followed by a custom `suffix` (like `"..."`).

**Syntax**:

```go
StrLimit(str string, length int, suffix ...string) string
```

**Example**:

```go
func ExampleStrLimit() {
    var (
        str    = `123456789`
        length = 3
        suffix = `...`
        result = gstr.StrLimit(str, length, suffix)
    )
    fmt.Println(result)

    // Output:
    // 123...
}
```

### StrLimitRune

**Description**:  
`StrLimitRune` limits a Unicode string `str` to a given length, and appends a `suffix` to the result.

**Syntax**:

```go
StrLimitRune(str string, length int, suffix ...string) string
```

**Example**:

```go
func ExampleStrLimitRune() {
    var (
        str    = `GoFrame是一款模块化、高性能、企业级的Go基础开发框架。`
        length = 17
        suffix = "..."
        result = gstr.StrLimitRune(str, length, suffix)
    )
    fmt.Println(result)

    // Output:
    // GoFrame是一款模块化、高性能...
}
```

### SubStrFrom

**Description**:  
`SubStrFrom` returns a substring starting from the first occurrence of `need` to the end of `str`, including `need`.

**Syntax**:

```go
SubStrFrom(str string, need string) (substr string)
```

**Example**:

```go
func ExampleSubStrFrom() {
    var (
        str  = "我爱GoFrameGood"
        need = `爱`
    )

    fmt.Println(gstr.SubStrFrom(str, need))

    // Output:
    // 爱GoFrameGood
}
```

### SubStrFromEx

**Description**:  
`SubStrFromEx` returns a substring starting from the first occurrence of `need` to the end of `str`, excluding `need`.

**Syntax**:

```go
SubStrFromEx(str string, need string) (substr string)
```

**Example**:

```go
func ExampleSubStrFromEx() {
    var (
        str  = "我爱GoFrameGood"
        need = `爱`
    )

    fmt.Println(gstr.SubStrFromEx(str, need))

    // Output:
    // GoFrameGood
}
```

### SubStrFromR

**Description**:  
`SubStrFromR` returns a substring from the last occurrence of `need` to the end of `str`, including `need`.

**Syntax**:

```go
SubStrFromR(str string, need string) (substr string)
```

**Example**:

```go
func ExampleSubStrFromR() {
    var (
        str  = "我爱GoFrameGood"
        need = `Go`
    )

    fmt.Println(gstr.SubStrFromR(str, need))

    // Output:
    // Good
}
```

### SubStrFromREx

**Description**:  
`SubStrFromREx` returns a substring from the last occurrence of `need` to the end of `str`, excluding `need`.

**Syntax**:

```go
SubStrFromREx(str string, need string) (substr string)
```

**Example**:

```go
func ExampleSubStrFromREx() {
    var (
        str  = "我爱GoFrameGood"
        need = `Go`
    )

    fmt.Println(gstr.SubStrFromREx(str, need))

    // Output:
    // od
}
```

## Character/Substring Filtering Functions

### Trim

**Description**:  
`Trim` removes whitespace (or other specified characters) from both the beginning and end of a string. The optional `characterMask` argument specifies additional characters to remove.

**Syntax**:

```go
Trim(str string, characterMask ...string) string
```

**Example**:

```go
func ExampleTrim() {
    var (
        str           = `*Hello World*`
        characterMask = "*d"
        result        = gstr.Trim(str, characterMask)
    )
    fmt.Println(result)

    // Output:
    // Hello Worl
}
```

### TrimStr

**Description**:  
`TrimStr` removes all occurrences of the `cut` string from the beginning and end of `str` (does not remove leading/trailing whitespaces).

**Syntax**:

```go
TrimStr(str string, cut string, count ...int) string
```

**Example**:

```go
func ExampleTrimStr() {
    var (
        str    = `Hello World`
        cut    = "World"
        count  = -1
        result = gstr.TrimStr(str, cut, count)
    )
    fmt.Println(result)

    // Output:
    // Hello
}
```

### TrimLeft

**Description**:  
`TrimLeft` removes whitespace (or other specified characters) from the beginning of a string.

**Syntax**:

```go
TrimLeft(str string, characterMask ...string) string
```

**Example**:

```go
func ExampleTrimLeft() {
    var (
        str           = `*Hello World*`
        characterMask = "*"
        result        = gstr.TrimLeft(str, characterMask)
    )
    fmt.Println(result)

    // Output:
    // Hello World*
}
```

### TrimLeftStr

**Description**:  
`TrimLeftStr` removes the specified number of occurrences of the `cut` string from the beginning of `str` (does not remove leading whitespaces).

**Syntax**:

```go
TrimLeftStr(str string, cut string, count ...int) string
```

**Example**:

```go
func ExampleTrimLeftStr() {
    var (
        str    = `**Hello World**`
        cut    = "*"
        count  = 1
        result = gstr.TrimLeftStr(str, cut, count)
    )
    fmt.Println(result)

    // Output:
    // *Hello World**
}
```

### TrimRight

**Description**:  
`TrimRight` removes whitespace (or other specified characters) from the end of a string.

**Syntax**:

```go
TrimRight(str string, characterMask ...string) string
```

**Example**:

```go
func ExampleTrimRight() {
    var (
        str           = `**Hello World**`
        characterMask = "*def" // []byte{"*", "d", "e", "f"}
        result        = gstr.TrimRight(str, characterMask)
    )
    fmt.Println(result)

    // Output:
    // **Hello Worl
}
```

### TrimRightStr

**Description**:  
`TrimRightStr` removes the specified number of occurrences of the `cut` string from the end of `str` (does not remove trailing whitespaces).

**Syntax**:

```go
TrimRightStr(str string, cut string, count ...int) string
```

**Example**:

```go
func ExampleTrimRightStr() {
    var (
        str    = `Hello World!`
        cut    = "!"
        count  = -1
        result = gstr.TrimRightStr(str, cut, count)
    )
    fmt.Println(result)

    // Output:
    // Hello World
}
```

### TrimAll

**Description**:  
`TrimAll` removes all occurrences of whitespaces (or other specified characters) as well as characters from the `characterMask` from the string `str`.

**Syntax**:

```go
TrimAll(str string, characterMask ...string) string
```

**Example**:

```go
func ExampleTrimAll() {
    var (
        str           = `*Hello World*`
        characterMask = "*"
        result        = gstr.TrimAll(str, characterMask)
    )
    fmt.Println(result)

    // Output:
    // HelloWorld
}
```

### HasPrefix

**Description**:  
`HasPrefix` checks if the string `s` starts with the `prefix` string.

**Syntax**:

```go
HasPrefix(s, prefix string) bool
```

**Example**:

```go
func ExampleHasPrefix() {
    var (
        s      = `Hello World`
        prefix = "Hello"
        result = gstr.HasPrefix(s, prefix)
    )
    fmt.Println(result)

    // Output:
    // true
}
```

### HasSuffix

**Description**:  
`HasSuffix` checks if the string `s` ends with the `suffix` string.

**Syntax**:

```go
HasSuffix(s, suffix string) bool
```

**Example**:

```go
func ExampleHasSuffix() {
    var (
        s      = `my best love is goframe`
        suffix = "goframe"
        result = gstr.HasSuffix(s, suffix)
    )
    fmt.Println(result)

    // Output:
    // true
}
```

## Version Comparison Functions

### CompareVersion

**Description**:  
`CompareVersion` compares two version strings `a` and `b` as standard GNU versions.

**Syntax**:

```go
CompareVersion(a, b string) int
```

**Example**:

```go
func ExampleCompareVersion() {
    fmt.Println(gstr.CompareVersion("v2.11.9", "v2.10.8")) // Output: 1
    fmt.Println(gstr.CompareVersion("1.10.8", "1.19.7"))   // Output: -1
    fmt.Println(gstr.CompareVersion("2.8.beta", "2.8"))     // Output: 0
}
```

### CompareVersionGo

**Description**:  
`CompareVersionGo` compares two version strings `a` and `b` as standard Golang versions.

**Syntax**:

```go
CompareVersionGo(a, b string) int
```

**Example**:

```go
func ExampleCompareVersionGo() {
    fmt.Println(gstr.CompareVersionGo("v2.11.9", "v2.10.8")) // Output: 1
    fmt.Println(gstr.CompareVersionGo("v4.20.1", "v4.20.1+incompatible")) // Output: 1
    fmt.Println(gstr.CompareVersionGo(
        "v0.0.2-20180626092158-b2ccc119800e",
        "v1.0.1-20190626092158-b2ccc519800e",
    )) // Output: -1
}
```

## Similarity Calculation Functions

### Levenshtein

**Description**:  
`Levenshtein` computes the Levenshtein distance between two strings, which is the minimum number of single-character edits (insertions, deletions, substitutions) required to change one string into the other.

**Syntax**:

```go
Levenshtein(str1, str2 string, costIns, costRep, costDel int) int
```

**Example**:

```go
func ExampleLevenshtein() {
    var (
        str1    = "Hello World"
        str2    = "hallo World"
        costIns = 1
        costRep = 1
        costDel = 1
        result  = gstr.Levenshtein(str1, str2, costIns, costRep, costDel)
    )
    fmt.Println(result) // Output: 2
}
```

### SimilarText

**Description**:  
`SimilarText` calculates the similarity between two strings and returns the number of matching characters. An optional pointer for the similarity percentage can also be provided.

**Syntax**:

```go
SimilarText(first, second string, percent *float64) int
```

**Example**:

```go
func ExampleSimilarText() {
    var (
        first   = `AaBbCcDd`
        second  = `ad`
        percent  float64 // declare a variable for percentage
        result  = gstr.SimilarText(first, second, &percent)
    )
    fmt.Println(result) // Output: 2
}
```

### Soundex

**Description**:  
`Soundex` computes the Soundex key for a given string, which is a phonetic algorithm for indexing names by sound.

**Syntax**:

```go
Soundex(str string) string
```

**Example**:

```go
func ExampleSoundex() {
    var (
        str1    = `Hello`
        str2    = `Hallo`
        result1 = gstr.Soundex(str1)
        result2 = gstr.Soundex(str2)
    )
    fmt.Println(result1, result2) // Output: H400 H400
}
```
