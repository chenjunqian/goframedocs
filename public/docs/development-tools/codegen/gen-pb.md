# Protocol Compilation - gen pb

> This feature has been available since version `v2.4`.

## Basic Introduction

This command is used to compile `proto` files to generate corresponding protobuf Go files and their respective controller files.

## Command Usage

```bash
$ gf gen pb -h
USAGE
    gf gen pb [OPTION]

OPTION
    -p, --path   protobuf file folder path
    -a, --api    output folder path storing generated go files of api
    -c, --ctrl   output folder path storing generated go files of controller
    -h, --help   more information about this command
```

### Examples

```bash
gf gen pb
gf gen pb -p . -a . -c .
```

> If you are using the project engineering scaffold recommended by the framework and have the `make` tool installed on your system, you can also use the `make pb` shortcut command.

### Parameter Description

- **path**: Optional, default is `manifest/protobuf`. Points to the `proto` protocol definition file.
- **api**: Optional, default is `api`. Points to the directory where the generated interface files are stored.
- **ctrl**: Optional, default is `internal/controller`. Points to the directory where the generated controller files are stored.

## Notes

- When generating controller files, it will automatically recognize whether there are already corresponding interface implementation methods. If they exist, it will not regenerate the corresponding interface methods to prevent overwriting.

- If you execute this command in the `proto` directory and the specified `path` directory does not exist, it will automatically compile the local `proto` files. The compiled files will be generated in the current directory, and the generation of controller files will be automatically disabled.
