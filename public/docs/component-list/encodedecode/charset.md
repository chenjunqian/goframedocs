# Character Set Conversion - gcharset

The GoFrame framework provides a powerful character encoding conversion module called `gcharset`, which supports mutual conversion between common character sets.

## Supported Character Sets

```markdown
| Language | Supported Character Sets             |
| -------- | -------------------------------------|
| Chinese  | GBK / GB18030 / GB2312 / Big5        |
| Japanese | EUCJP / ISO2022JP / ShiftJIS         |
| Korean   | EUCKR                                |
| Unicode  | UTF-8 / UTF-16 / UTF-16BE / UTF-16LE |
| Others   | macintosh / IBM*/ Windows* / ISO-*   |
```

## Usage

```go
import "github.com/gogf/gf/v2/encoding/gcharset"
```

## API Documentation

You can find the API documentation for `gcharset` at the following link:

[API Documentation - gcharset](https://pkg.go.dev/github.com/gogf/gf/v2/encoding/gcharset)

## Example Usage

```go
package main

import (
    "fmt"
    "github.com/gogf/gf/v2/encoding/gcharset"
)

func main() {
    var (
        src        = "~{;(<dR;:x>F#,6@WCN^O`GW!#"
        srcCharset = "GB2312"
        dstCharset = "UTF-8"
    )
    str, err := gcharset.Convert(dstCharset, srcCharset, src)
    if err != nil {
        panic(err)
    }
    fmt.Println(str)
}
```

## Output

After executing the above code, the terminal output will be:

```bash
花间一壶酒，独酌无相亲。
```

This means "A pot of wine among the flowers, I drink alone without company."
