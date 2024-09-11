# Command - Function

The `gcmd` component provides commonly used basic package methods, which can directly obtain command line arguments and options according to the default parsing rules.

Common Methods
For more component methods, please refer to the interface documentation: <https://pkg.go.dev/github.com/gogf/v2/os/gcmd>

```go
func Init(args ...string)

func GetArg(index int, def ...string) *gvar.Var
func GetArgAll() []string

func GetOpt(name string, def ...string) *gvar.Var
func GetOptAll() map[string]string
```

## Init Customization

By default, `gcmd` read and parse argument from `os.Args`. We can use `Init` to customize the argument.

```go
func ExampleInit() {
    gcmd.Init("gf", "build", "main.go", "-o=gf.exe", "-y")
    fmt.Printf(`%#v`, gcmd.GetArgAll())

    // Output:
    // []string{"gf", "build", "main.go"}
}
```

## GetArg Get Arguments

Parameter retrieval can be done through the following two methods:

- The `GetArg` method is used to obtain command line arguments that are parsed by default. Arguments are retrieved by their input index position, which starts from `0`. However, often we need to retrieve arguments starting from `1`, because the argument at index `0` is the program name.

- The `GetArgAll` method is used to retrieve all command line arguments.

Usage example:

```go
func ExampleGetArg() {
    gcmd.Init("gf", "build", "main.go", "-o=gf.exe", "-y")
    fmt.Printf(
        `Arg[0]: "%v", Arg[1]: "%v", Arg[2]: "%v", Arg[3]: "%v"`,
        gcmd.GetArg(0), gcmd.GetArg(1), gcmd.GetArg(2), gcmd.GetArg(3),
    )

    // Output:
    // Arg[0]: "gf", Arg[1]: "build", Arg[2]: "main.go", Arg[3]: ""
}

func ExampleGetArgAll() {
    gcmd.Init("gf", "build", "main.go", "-o=gf.exe", "-y")
    fmt.Printf(`%#v`, gcmd.GetArgAll())

    // Output:
    // []string{"gf", "build", "main.go"}
}
```

## GetOpt Get Options

Option retrieval can be done through the following two methods:

- The `GetOpt` method is used to obtain command line options that are parsed by default. Options are retrieved by their name and can be placed in any position in the command line. If the option data with the specified name does not exist, it returns `nil`. Note that when checking for the existence of an option without data, you can use the method `GetOpt(name) != nil`.

- The `GetOptAll` method is used to retrieve all options.

Usage example:

```go
func ExampleGetOpt() {
    gcmd.Init("gf", "build", "main.go", "-o=gf.exe", "-y")
    fmt.Printf(
        `Opt["o"]: "%v", Opt["y"]: "%v", Opt["d"]: "%v"`,
        gcmd.GetOpt("o"), gcmd.GetOpt("y"), gcmd.GetOpt("d", "default value"),
    )

    // Output:
    // Opt["o"]: "gf.exe", Opt["y"]: "", Opt["d"]: "default value"
}

func ExampleGetOptAll() {
    gcmd.Init("gf", "build", "main.go", "-o=gf.exe", "-y")
    fmt.Printf(`%#v`, gcmd.GetOptAll())

    // May Output:
    // map[string]string{"o":"gf.exe", "y":""}
}
```

## GetOptWithEnv Featrue

```go
func GetOptWithEnv(key string, def ...interface{}) *gvar.Var
```

This method is used to retrieve the value of a specified option from the command line. If the option does not exist, it reads from the environment variable. However, the naming rules for the two are different. For example: `gcmd.GetOptWithEnv("gf.debug")` will first try to read the command line option `gf.debug`, and if it does not exist, it will read the `GF_DEBUG` environment variable.

It is important to note the naming conversion rules:

- Environment variables will convert the name to uppercase, and the `.` character in the name is converted to the `_` character.

- In the command line, the name will be converted to lowercase, and the `_` character in the name is converted to the `.` character.

Usage example:

```go
func ExampleGetOptWithEnv() {
    fmt.Printf("Opt[gf.test]:%s\n", gcmd.GetOptWithEnv("gf.test"))
    _ = genv.Set("GF_TEST", "YES")
    fmt.Printf("Opt[gf.test]:%s\n", gcmd.GetOptWithEnv("gf.test"))

    // Output:
    // Opt[gf.test]:
    // Opt[gf.test]:YES
}
```
