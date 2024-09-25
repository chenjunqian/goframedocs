# Process Management - gproc

Process management and inter-process communication are implemented through the `gproc` module. Inter-process communication uses the local socket communication mechanism.

## Usage

```go
import "github.com/gogf/gf/v2/os/gproc"
```

## Interface Documentation

[https://pkg.go.dev/github.com/gogf/gf/v2/os/gproc](https://pkg.go.dev/github.com/gogf/gf/v2/os/gproc)

## Brief Description

- **Manager**: The `Manager` object is the process management object, which can manage multiple child processes simultaneously (the currently executing process is the parent process).
- **Process**: The `Process` object represents a specific process resource that is either being executed or retrieved.

### Executing Shell Commands

We can execute Shell commands using the following functions:

- **Shell**: Represents a native shell command execution method with custom input and output control.
- **ShellExec**: Executes the command and returns the output content as a result.
- **ShellRun**: Executes the command and directly outputs the result to the standard output.

### Asynchronous Execution

We can use `goroutine` to implement asynchronous execution, for example:

```go
go ShellRun(...)
```
