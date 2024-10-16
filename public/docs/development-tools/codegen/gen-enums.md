# Enum Maintenance - gen enums

> This feature is experimental and has been available since version `v2.4`.

## Basic Introduction

This command is used to analyze the source code in the specified code directory and generate enumeration value information and Go code files according to specifications, mainly for improving the maintenance of enumeration values in `OpenAPIv3` documentation.

## Pain Points

### Description

- There is a problem with `API` documentation where the enumeration value types do not display the available options for enumeration values.
- There is difficulty in maintaining enumeration values in `API` documentation, and the issue of code and documentation being decoupled, which reduces collaboration efficiency with the calling end, especially front-end and back-end.

### Solution

By using a tool to parse the source code, enumeration values are generated into the startup package `Go` files, which are automatically loaded when the service runs. This reduces manual maintenance costs and avoids the problem of omitted maintenance of enumeration values.

## Command Usage

```bash
$ gf gen enums -h
USAGE
    gf gen enums [OPTION]

OPTION
    -s, --src        source folder path to be parsed
    -p, --path       output go file path storing enums content
    -x, --prefixes   only exports packages that start with specified prefixes
    -h, --help       more information about this command

EXAMPLE
    gf gen enums
    gf gen enums -p internal/boot/boot_enums.go
    gf gen enums -p internal/boot/boot_enums.go -s .
    gf gen enums -x github.com/gogf
```

### Parameter Description

- **src**: Optional. The path to the source code directory to be analyzed, default is the current project root directory.
- **path**: Optional. The path to the Go code file where the generated enumeration values will be stored, default is `internal/boot/boot_enums.go`.
- **prefixes**: Optional. Only generates enumeration values for package names that start with the specified keywords, supports multiple prefix configurations.

## Usage of Generated Files

After executing the `gf gen enums` command to generate the enumeration analysis file `internal/boot/boot_enums.go`, you need to anonymously import it in the project's entry file:

```go
import (
    _ "project-module-name/internal/boot"
)
```

## How to Define Enumeration Values

Please refer to the section: [Golang Enum Value Management](/docs/framework-design/enum-management).

## How to Validate Enumeration Values

If you have defined enumeration values in a standardized way and generated the enumeration value maintenance file through the command, you can use the `enums` rule to validate the enumeration value fields in parameter validation. For more information on the specific rules, please refer to the section: [Data Validation - Validation Rules](/docs/core-component/data-valid/rule).
