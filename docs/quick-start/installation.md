# Installation

## Install Goframe CLI tool

Precompiled installation refers to the binary files precompiled by the open-source community for developers to use directly. These binary files are hosted and stored in a GitHub repository.

### Mac OS

```bash
wget -O gf "https://github.com/gogf/gf/releases/latest/download/gf_$(go env GOOS)_$(go env GOARCH)" && chmod +x gf && ./gf install -y && rm ./gf
```

You may have below common issue:

1. If the wget command is not currently installed on your system, please use `brew install wget` to install it and then continue with the execution of the command.

2. If you are using a zsh terminal, there might be an alias conflict with `gf` (the shortcut command for `git fetch`). After installation (at least one execution), please restart the terminal application to continue using it.

### Linux

```bash
wget -O gf "https://github.com/gogf/gf/releases/latest/download/gf_$(go env GOOS)_$(go env GOARCH)" && chmod +x gf && ./gf install -y && rm ./gf
```

If the wget command is not installed:

1. `Ubuntu/Debian`: `apt-get install wget -y`

2. `CentOS/RHEL`: `yum install wget -y`

### Windows

Manually download the binary file and double-click to install following the terminal instructions. If the double-click installation fails, please manual compile and install it yourself.

***Manual Compile & Install***

Clone the source code to local system, compile to the binary file, and install it to system directory.

```bash
git clone https://github.com/gogf/gf && cd gf/cmd/gf && go install
```

## Verify Installation

Excute `gf -v` to check the installation result.

```bash
$ gf -v
GoFrame CLI Tool v2.1.3, https://goframe.org
GoFrame Version: cannot find goframe requirement in go.mod
CLI Installed At: /Users/john/Workspace/Go/GOPATH/bin/gf
CLI Built Detail:
  Go Version:  go1.17.13
  GF Version:  v2.1.3
  Git Commit:  2022-08-22 14:40:48 91d8d71821012aef4a35b5f9e7b4fbfc04f3ffe7
  Build Time:  2022-08-22 14:48:37
```

Please note that the "Go/GF Version" refers to the versions of Golang and the GoFrame framework used to compile the current binary file, while the "Goframe Version" indicates the version of the Goframe framework used in the current project (automatically detected from the `go.mod` file in the current directory).
