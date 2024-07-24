# Configuration Overview

## Introduction

`Goframe`'s configuration is implemented by the `gcfg` component, and all methods of the `gcfg` component are concurrency-safe. The `gcfg` component is designed with interface-based, with the default implementation being based on the file system interface.

Usage:

```go
import "github.com/gogf/gf/v2/os/gcfg"
```

Package document:

<https://pkg.go.dev/github.com/gogf/gf/v2/os/gcfg>

## Component Feature

The `gcfg` component has the following features:

- Interface-based design, offering high flexibility and extensibility, with a default file system interface implementation.

- Supports various common configuration file formats: `YAML, TOML, JSON, XML, INI, and properties`.

- Supports reading specified environment variables or command-line arguments for none configuration item situation.

- Supports searching and reading configuration files within the resource management component.

- Supports automatic hot detection of configuration file updates.

- Supports hierarchical access to configuration items.

- Supports a singleton management mode.

## Notes

`Goframe` 's configuration component supports a variety of common data formats, but in the following example codes, the `YAML` data format is used for demo purposes. When using it, feel free to use your preferred data format without being limited to the `YAML` format used in the examples. For instance, the business project template provided is a `config.yaml` configuration file template (as the default template can only offer one type), but you can also directly modify it to `config.toml` or `config.ini`, or other supported data formats; the configuration component can automatically recognize and read based on the file name extension.
