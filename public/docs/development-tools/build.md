# Cross Compilation - build

## Usage

For specific parameters, use `gf build -h` to view help.

This command is specifically for cross-compiling projects that use the `GoFrame` framework and supports direct cross-compilation for most common systems.

## Built-in Compilation Variables

The `build` command automatically embeds compilation variables, which can be customized by users and retrieved at runtime through the `gbuild` component. Projects built with `gf build` will default to embedding the following variables (refer to `gf -v`):

- Current `Go` version
- Current `GoFrame` version
- Current `Git Commit` (if it exists)
- Current compilation time

## Compilation configuration file

`build` supports specifying compilation parameters and options from both the command line and configuration files. All components and all ecosystem projects of the `GoFrame` framework use the same configuration management component. For default configuration files and usage, please refer to the section on [Configuration Management](/docs/core-component/configuration/). Below is a simple configuration example for reference:

```yaml
gfcli:
  build:
    name:     "gf"
    arch:     "all"
    system:   "all"
    mod:      "none"
    packSrc:  "resource,manifest"
    version:  "v1.0.0"
    output:   "./bin"
    extra:    ""
```

The meanings of configuration options are the same as their command-line counterparts.

- **name**: The name of the generated executable file, which is the same as the entry `go` file. On the Windows platform, it defaults to adding the `.exe` suffix.
- **arch**: The compilation architecture, separated by commas for multiple, or `all` to compile all supported architectures (e.g., `386,amd64,arm`).
- **system**: The compilation platform, separated by commas for multiple, or `all` to compile all supported platforms (e.g., `linux,darwin,windows`).
- **path**: The directory address where the compiled executable file is stored (e.g., `./bin`).
- **mod**: Same as the `go build -mod` compilation option, not commonly used (`none`).
- **cgo**: Whether to enable `CGO`, which is disabled by default. If enabled, cross-compilation may have issues (`false`).
- **packSrc**: Directories to be packaged, separated by commas, generated into `internal/packed/build_pack_data.go` (e.g., `public,template,manifest`).
- **packDst**: The `Go` file path generated after packaging, usually specified with a relative path to the project directory (`internal/packed/build_pack_data.go`).
- **version**: Program version. If a version is specified, an additional directory with the version name will be created in the program's path (e.g., `v1.0.0`).
- **output**: The path of the output executable file. When this parameter is specified, the `name` and `path` parameters become invalid, commonly used for compiling a single executable file (e.g., `./bin/gf.exe`).
- **extra**: Additional custom compilation parameters that are directly passed to the `go build` command.

- **varMap**: Custom variables to be passed to the `go build` command.

    ```yaml
    gfcli:
    build:
        name:     "gf"
        arch:     "all"
        system:   "all"
        mod:      "none"
        cgo:      0
        varMap:
        k1: v1
        k2: v2
    ```

- **exitWhenError**: Stop subsequent execution and exit the compilation process immediately when an error occurs during compilation (`os.Exit(1)`).
- **dumpEnv**: Print the current compilation environment's environment variable information in the terminal before each compilation.

> Built-in compilation variables at compile time can be retrieved at runtime through the `gbuild` package's [Build Information](/docs/component-list/system-related/build).

## Usage Example

```shell
$ gf build
2020-12-31 00:35:25.562 start building...
2020-12-31 00:35:25.562 go build -o ./bin/darwin_amd64/gf main.go
2020-12-31 00:35:28.381 go build -o ./bin/freebsd_386/gf main.go
2020-12-31 00:35:30.650 go build -o ./bin/freebsd_amd64/gf main.go
2020-12-31 00:35:32.957 go build -o ./bin/freebsd_arm/gf main.go
2020-12-31 00:35:35.824 go build -o ./bin/linux_386/gf main.go
2020-12-31 00:35:38.082 go build -o ./bin/linux_amd64/gf main.go
2020-12-31 00:35:41.076 go build -o ./bin/linux_arm/gf main.go
2020-12-31 00:35:44.369 go build -o ./bin/linux_arm64/gf main.go
2020-12-31 00:35:47.352 go build -o ./bin/linux_ppc64/gf main.go
2020-12-31 00:35:50.293 go build -o ./bin/linux_ppc64le/gf main.go
2020-12-31 00:35:53.166 go build -o ./bin/linux_mips/gf main.go
2020-12-31 00:35:55.840 go build -o ./bin/linux_mipsle/gf main.go
2020-12-31 00:35:58.423 go build -o ./bin/linux_mips64/gf main.go
2020-12-31 00:36:01.062 go build -o ./bin/linux_mips64le/gf main.go
2020-12-31 00:36:03.502 go build -o ./bin/netbsd_386/gf main.go
2020-12-31 00:36:06.280 go build -o ./bin/netbsd_amd64/gf main.go
2020-12-31 00:36:09.332 go build -o ./bin/netbsd_arm/gf main.go
2020-12-31 00:36:11.811 go build -o ./bin/openbsd_386/gf main.go
2020-12-31 00:36:14.140 go build -o ./bin/openbsd_amd64/gf main.go
2020-12-31 00:36:17.859 go build -o ./bin/openbsd_arm/gf main.go
2020-12-31 00:36:20.327 go build -o ./bin/windows_386/gf.exe main.go
2020-12-31 00:36:22.994 go build -o ./bin/windows_amd64/gf.exe main.go
2020-12-31 00:36:25.795 done!
```
