# ORM Advanced Features - Dry Run

## Introduction

The `ORM` dry run feature can be enabled through the `DryRun` configuration option, which is disabled by default. When the dry run feature of the `ORM` is enabled, read operations will be executed normally, but write, update, and delete operations will be ignored. This feature is often used in conjunction with debug mode and log output to verify whether the `SQL` executed by the current program (especially scripts) meets expectations.

## Example

```yaml
database:
  default:
  - link:   "mysql:root:12345678@tcp(127.0.0.1:3306)/user"
    debug:  true
    dryRun: true
```

The dry run feature can also be globally modified via command-line arguments or environment variables:

- **Command-line startup parameter**: `-gf.gdb.dryrun=true`
- **Specified environment variable**: `GF_GDB_DRYRUN=true`

**Example:**

```sh
./app --gf.gdb.dryrun=true
./app --gf.gdb.dryrun true
```
