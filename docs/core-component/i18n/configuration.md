# I18N - Configuration

As one of the core components of the framework, the I18N internationalization component inherits the convenient design philosophy of Goframe, making configuration management very straightforward.

## File Formats

The gi18n internationalization component supports five common configuration file formats used by the framework: `xml, ini, yaml, toml, json, and properties`. For a more detailed list of supported file formats, refer to the Configuration Management section. Similar to the Configuration Management module, the framework recommends using the toml file format.

## Reading Paths

By default, gi18n will automatically search for and read the following directories under the root directory of the current project source code (or the current working directory):

- `manifest/i18n`
- `i18n`

The directories found will be used as the storage directories for internationalization translation files. Developers can also customize the storage path for i18n files using the `SetPath` method.

## File Storage

In the `i18n` directory, files can be named directly according to the internationalization name, such as `en.toml`, `ja.toml`, `zh-CN.toml`. Alternatively, developers can specify directories for internationalization names and customize configuration files within those directories, such as `en/editor.toml`, `en/user.toml`, `zh-CN/editor.toml`, `zh-CN/user.toml`. Whether you use pure file management or add an additional directory level for management, gi18n can intelligently recognize and load them.

> The names of internationalization files/directories are defined and maintained by the developers and are mainly used for settings and usage in the program. It is recommended to name them according to standardized international language codes. For more details, refer to the [WIKI](https://zh.wikipedia.org/wiki/ISO_639-1).

***Example Directory Structures and File Formats***

Differentiating Languages by Separate i18n Files

```txt
└── i18n
    ├── en.toml
    ├── ja.toml
    ├── ru.toml
    ├── zh-CN.toml
    └── zh-TW.toml
```

Differentiating Languages by Different Directory Names

```txt
└── i18n
    ├── en
    │   ├── hello.toml
    │   └── world.toml
    ├── ja
    │   ├── hello.yaml
    │   └── world.yaml
    ├── ru
    │   ├── hello.ini
    │   └── world.ini
    ├── zh-CN
    │   ├── hello.json
    │   └── world.json
    └── zh-TW
        ├── hello.xml
        └── world.xml
```

Different Languages with Different File Formats

```txt
└── i18n
    ├── en.toml
    ├── ja.yaml
    ├── ru.ini
    ├── zh-CN.json
    └── zh-TW.xml
```

## Resource Manager

By default, gi18n supports the Resource Manager (for more details, refer to the [Resource Management](/docs/core-component/resource) section). It will search for `manifest/i18n` and `i18n` directories in the gres configuration manager, or the i18n directory path set by the developer.
