# Environment - genv

The `genv` component is used for environment variable management.

## Usage

```go
import "github.com/gogf/gf/v2/os/genv"
```

You can view the API documentation [here](https://pkg.go.dev/github.com/gogf/gf/v2/os/genv).

## SetMap

```go
func SetMap(m map[string]string) error
```

This method is used to batch set environment variables.

**Example:**

```go
genv.SetMap(g.MapStrStr{
    "APPID":     "order",
    "THREAD":    "16",
    "ENDPOINTS": "127.0.0.1:6379",
})
```

## GetWithCmd

```go
func GetWithCmd(key string, def ...interface{}) *gvar.Var
```

This method retrieves the value of a specific environment variable. If the environment variable does not exist, it attempts to read the corresponding value from the command line options. However, note that the naming conventions between the environment variables and command-line options differ.

For example: `genv.GetWithCmd("gf.debug")` will first try to get the value of the `GF_DEBUG` environment variable. If it doesn't exist, it will then attempt to get the value from the command line option `gf.debug`.

***Naming Conversion Rules***

- Environment variables will convert names to uppercase, and any `.` characters will be converted to `_`.
- Command line options will convert names to lowercase, and any `_` characters will be converted to `.`.

## All

```go
func All() []string
```

This method returns all environment variables as a slice of strings in the format `key=value`.

## Map

```go
func Map() map[string]string
```

This method returns all environment variables as a map, where the keys are the environment variable names, and the values are the corresponding variable values.

## Get

```go
func Get(key string, def ...interface{}) *gvar.Var
```

This method retrieves an environment variable as a generic type. If the specified key does not exist, it returns a default value of the generic type.

## Set

```go
func Set(key, value string) error
```

This method sets an environment variable with the given key and value. If an error occurs, it returns an error of type `Error`.

## Contains

```go
func Contains(key string) bool
```

This method checks if a specific environment variable exists.

## Remove

```go
func Remove(key ...string) error
```

This method deletes one or more environment variables.

## Build

```go
func Build(m map[string]string) []string
```

This method constructs and returns an array from a map of environment variables, where each element is in the form `key=value`.
