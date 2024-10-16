# Version Check - version

## Usage

```shell
gf -v
gf version
```

This command is used to view the version information of the current `gf` command-line tool at compile time.

## Output Details

- **First Line**: The version number of the tool.
- **Env Detail**: Environment information, including the Go version number and the current project's dependency on GoFrame.
- **CLI Detail / CLI Built Detail**: Detailed information about the tool, including the installation directory, the Go version used during build, the GoFrame version used during build, and more detailed precompiled build information.
- **Others Detail**: Other detailed information, including the documentation address and the current system time.

## Usage Example

For versions **>= v2.5.7**:

```shell
$ gf version
v2.7.2
Welcome to GoFrame!
Env Detail:
  Go Version: go1.22.2 linux/amd64
  GF Version(go.mod): 
    github.com/gogf/gf/contrib/drivers/mysql/v2@v2.7.2
    github.com/gogf/gf/v2@v2.7.2
CLI Detail:
  Installed At: /data/home/v_hlaghuang/go/bin/gf
  Built Go Version: go1.20.8
  Built GF Version: v2.7.2
  Git Commit: 2024-06-26 10:08:04 b11caba5b03ed54fbb1415151f7d62b6d913179d
  Built Time: 2024-06-26 10:09:50
Others Detail:
  Docs: [https://goframe.org](https://goframe.org) 
  Now : 2024-07-17T15:48:57+08:00 
```

For versions **< v2.5.6**:

```shell
$ gf version
GoFrame CLI Tool v2.0.0, [https://goframe.org](https://goframe.org)  
GoFrame Version: v2.0.0-beta.0.20211214160159-19c9f0a48845 in current go.mod 
CLI Installed At: /Users/john/Workspace/Go/GOPATH/src/github.com/gogf/gf-cli/main 
CLI Built Detail:
  Go Version:  go1.16.3
  GF Version:  v2.0.0-beta
  Git Commit:  2021-12-15 22:43:12 7884058b5df346d34ebab035224e415afb556c19
  Build Time:  2021-12-15 23:00:43 
```

## Notes

- The version information printed will automatically detect the version of `GoFrame` used in the current project (`go.mod`) and print it as `GoFrame Version` information.
- The `CLI Built Detail` information displays the various Golang versions and GoFrame version information used during the compilation of the current binary, the `Git` commit version at the time of compilation, and the compilation time of the current binary file.

>Please do not confuse `GoFrame Version` with `GF Version` in `CLI Built Detail`.
