# Development Tools

The `GoFrame` framework provides a powerful command-line development auxiliary tool called `gf`, which is an important part of the framework's development. The tool's repository can be found at:

[https://github.com/gogf/gf/tree/master/cmd/gf](https://github.com/gogf/gf/tree/master/cmd/gf)

For tool installation, please refer to the repository page. After successful installation, you can view all supported commands by running `gf` or `gf -h`. For more detailed usage information on complex commands, you can use `gf COMMAND -h`, for example: `gf gen -h`.

## Tool Responsibilities

- Simplify engineering development and improve development efficiency.
- Support the accurate implementation of framework engineering design specifications.

## Precautions

- Some commands require you to have a `Golang` basic development environment installed.
- The latest version of the `CLI` tool will be released alongside the latest framework version.

## Configuration Support

***All commands of the tool support both command-line and configuration file parameters to improve usability. When command-line parameters are provided, they are prioritized. If command-line parameters do not exist, the corresponding parameter names in the configuration file are automatically read***.

The configuration file path first searches for the `hack` directory in the current directory (`hack/config.yaml`), and then searches for the configuration file according to the framework's default configuration path. For the framework's default configuration file search path, please refer to the section: [Configuration Management - File Configuration](/docs/core-component/configuration/config-file).

***Example Configuration File***

```yaml
# GoFrame CLI tool configuration.
gfcli:
  gen:
    dao:
    - link: "mysql:root:12345678@tcp(127.0.0.1:3306)/test"
      tables: "user"
      removePrefix: "gf_"
      descriptionTag: true
      noModelComment: true

  docker:
    build: "-a amd64 -s linux -p temp"
    tagPrefixes:
    - ccr.ccs.tencentyun.com/xxx
    - hkccr.ccs.tencentyun.com/xxx
    - sgccr.ccs.tencentyun.com/xxx
```

Please note that the above configuration example is for reference only, and specific configuration items should be referred to the specific command help.

## Tool Debugging

When encountering problems with the tool, you can try enabling the tool's debug mode to obtain more detailed execution log information. The tool debug mode can be enabled through the `debug` command-line option, for example:

```shell
gf build main.go --debug
```

> Since the `gf` tool is also developed using the GoFrame framework, the way to enable debug information is consistent with the framework's method. For more detailed information, please refer to the framework documentation: [Debugging Mode](/docs/core-component/debug-mode).

## Command Overview

This help document is a simple introduction based on the `gf cli v2.0.0` version. For detailed information, please check the command-line help information. The content of this chapter may be outdated; for the latest detailed introduction, please refer to the tool's help information.

```shell
$ gf
USAGE
   gf COMMAND [OPTION]

COMMAND
   env        show current Golang environment variables
   run        running go codes with hot-compiled-like feature
   gen        automatically generate go files for dao/dto/entity/pb/pbentity...
   init       create and initialize an empty GoFrame project
   pack       packing any file/directory to a resource file, or a go file
   build      cross-building go project for lots of platforms
   docker     build docker image for current GoFrame project
   install    install gf binary to system (might need root/admin permission)
   version    show version information of current binary

OPTION
   -y, --yes        all yes for all command without prompt ask
   -v, --version    show version information of current binary
   -d, --debug      show internal detailed debugging information
   -h, --help       more information about this command

ADDITIONAL
    Use "gf COMMAND -h" for details about a command.
```
