# Tool Installation

> This command is specifically for installing pre-compiled binary downloads. If you install the tool via the `go install` command, there is no need to manually use the `install` command to install the `gf` tool.

## Download and Installation

***Latest Version Download***

For `Mac` & `Linux`, use the following command to quickly download and install:

```shell
wget -O gf https://github.com/gogf/gf/releases/latest/download/gf_$(go env GOOS)_$(go env GOARCH) && chmod +x gf && ./gf install -y && rm ./gf
```

For `Windows`, you need to download it manually.

Check your system information by running:

```shell
go env GOOS
go env GOARCH
```

Download link: [Releases · gogf/gf](https://github.com/gogf/gf/releases)

### Installation via go install

```shell
go install github.com/gogf/gf/cmd/gf/v2@latest # For the latest version
go install github.com/gogf/gf/cmd/gf/v2@v2.5.5 # For a specific version (version needs to be >= v2.5.5)
```

### Other Version Downloads

#### v2 Version

- Pre-compiled binary download: [Releases · gogf/gf](https://github.com/gogf/gf/releases)
- Source code: `gf/cmd/gf`

#### v1 Version

- Pre-compiled binary download: [Releases · gogf/gf-cli](https://github.com/gogf/gf-cli/releases)
- Source code: `gogf/gf-cli`

## Usage

Project address: [https://github.com/gogf/gf/tree/master/cmd/gf](https://github.com/gogf/gf/tree/master/cmd/gf)

Usage: `./gf install`

This command is typically executed after the `gf` command-line tool is downloaded to the local machine (note the execution permission). It is used to install the `gf` command to the directory path supported by the system environment variables, making it easy to use the `gf` tool directly from anywhere in the system.

> Some systems may require administrator privileges.
>
> For `macOS` users who use `zsh`, you might encounter alias conflicts. You can resolve this by running `alias gf=gf`. After running it once, the `gf` tool will automatically modify the alias settings in your `profile`. Users will need to log in again (or reopen the terminal).

## Usage Example

```shell
$ ./gf_darwin_amd64 install
I found some installable paths for you (from $PATH):
  Id | Writable | Installed | Path
   0 |     true |      true | /usr/local/bin
   1 |     true |     false | /Users/john/Workspace/Go/GOPATH/bin
   2 |     true |     false | /Users/john/.gvm/bin
   4 |     true |     false | /Users/john/.ft
please choose one installation destination [default 0]:
gf binary is successfully installed to: /usr/local/bin
```
