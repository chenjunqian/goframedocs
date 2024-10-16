# Compatibility Fixes - fix

> This command has been available since version `v2.3` of the framework.

## Usage Scenarios

When the official framework version is upgraded, every effort is made to ensure backward compatibility. However, there may be scenarios where it is extremely difficult to guarantee full backward compatibility, especially when dealing with minor compatibility issues. Considering the high cost of introducing a new major version, the official framework provides this command to automatically correct compatibility issues. The official framework also ensures that this command can be executed repeatedly without side effects.

## Usage

```bash
$ gf fix -h
USAGE
    gf fix

OPTION
    -/--path     directory path, it uses the current working directory by default
    -h, --help   more information about this command
```

This command is used to automatically update local code for compatibility changes when upgrading from a lower version (the version of `GoFrame` in your current `go.mod`) to a higher version (the version of `GoFrame` used by the current `CLI`).

## Precautions

Please commit your local modifications to `git` or back up your directory before executing the command.
