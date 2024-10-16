# Code Generation - Overview

> Starting from version `v2`, the latest `CLI` tool version features are compiled alongside the latest version of the `GoFrame` framework. If there is a compatibility issue between the automatically generated code by the local `CLI` tool and the project's `GoFrame` framework version, it is recommended to upgrade the project framework version or install an older version of the CLI tool. For installation methods of older `CLI` tools, please refer to the repository's homepage introduction: [https://github.com/gogf/gf-cli](https://github.com/gogf/gf-cli).

## Important Note

- The code generation functionality provided by the `CLI` tool aims to ***standardize project code writing, simplify project development complexity, and allow developers to focus on business logic itself***.

- There will be a certain upfront learning and understanding cost for the `CLI` tool itself (it is best to understand why), but once proficient, everyone's development work will become much more efficient.

- The code generation feature of the `CLI` tool will be highly beneficial for enterprise-level projects and multi-member team projects. However, for single-person small projects, developers can assess whether to use it based on personal preference. The `GoFrame` framework itself only provides basic components and adopts a flexible component design without strict requirements on project code; but the `CLI` tool will have certain restrictions to ensure that every member of the team is consistent in pace and style, preventing developers from writing code too casually.

## Usage

```shell
$ gf gen -h
USAGE
    gf gen COMMAND [OPTION]

COMMAND
    ctrl        parse api definitions to generate controller/sdk go files
    dao         automatically generate go files for dao/do/entity
    enums       parse go files in current project and generate enums go file
    pb          parse proto files and generate protobuf go files
    pbentity    generate entity message files in protobuf3 format
    service     parse struct and associated functions from packages to generate service go file

DESCRIPTION
    The "gen" command is designed for multiple generating purposes.
    It's currently supporting generating go files for ORM models, protobuf, and protobuf entity files.
    Please use "gf gen dao -h" for specified type help.
```
