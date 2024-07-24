# Command - Parser

## Overview

Command line parsing mainly focuses on option parsing. The `gcmd` component provides a `Parse` method for custom parsing of options, including the names of the options and whether each option has a value associated with it. Based on this configuration, all arguments and options can be parsed and categorized.

In most scenarios, we do not need to explicitly create a `Parser` object because we have hierarchical management and object management methods to handle multiple commands. However, the underlying implementation still uses the `Parser`.

Related Methods:

For more `Parser` methods, please refer to the interface documentation: <https://pkg.go.dev/github.com/gogf/gf/v2/os/gcmd#Parser>

```go
func Parse(supportedOptions map[string]bool, option ...ParserOption) (*Parser, error)
func ParseWithArgs(args []string, supportedOptions map[string]bool, option ...ParserOption) (*Parser, error)
func ParserFromCtx(ctx context.Context) *Parser
func (p *Parser) GetArg(index int, def ...string) *gvar.Var
func (p *Parser) GetArgAll() []string
func (p *Parser) GetOpt(name string, def ...interface{}) *gvar.Var
func (p *Parser) GetOptAll() map[string]string
```

`ParserOption`:

```go
// ParserOption manages the parsing options.
type ParserOption struct {
    CaseSensitive bool // Marks options parsing in case-sensitive way.
    Strict        bool // Whether stops parsing and returns error if invalid option passed.
}
```

Parsing example:

```go
parser, err := gcmd.Parse(g.MapStrBool{
    "n,name":    true,
    "v,version": true,
    "a,arch":    true,
    "o,os":      true,
    "p,path":    true,
})
```

The option input argument is a `map` type. The keys are the option names, and different names for the same option can be separated by a comma. For example, in this example, the options `n` and `name` are the same option. When the user inputs `-n john`, both options `n` and `name` will receive the data `john`.

The value is a boolean type, indicating whether the option needs to parse an argument. This option configuration is very important because some options do not need to obtain data, they just serve as a flag. For example, the input `-f force`, in the case where the option needs to parse data, the value of option `f` is `force`, the option data does not need to be parsed, `force` is an argument of the command line, not an option.

## Example

```go
func ExampleParse() {
    os.Args = []string{"gf", "build", "main.go", "-o=gf.exe", "-y"}
    p, err := gcmd.Parse(g.MapStrBool{
    "o,output": true,
    "y,yes":    false,
    })
    if err != nil {
        panic(err)
    }
    fmt.Println(p.GetOpt("o"))
    fmt.Println(p.GetOpt("output"))
    fmt.Println(p.GetOpt("y") != nil)
    fmt.Println(p.GetOpt("yes") != nil)
    fmt.Println(p.GetOpt("none") != nil)

    // Output:
    // gf.exe
    // gf.exe
    // true
    // true
    // false
}
```
