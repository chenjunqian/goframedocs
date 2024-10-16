# Data Specification - gen dao

The `gen dao` command is a key command frequently used in the `CLI` and is crucial for accurately implementing the engineering standards designed by the framework. This command is used to generate `Go` code files for `dao` data access objects, `do` data transformation models, and `entity` instance data models. Due to the numerous parameters and options for this command, we recommend managing generation rules using a configuration file.

> For an introduction to the framework's project engineering standards, please refer to the section on [Project Package Design](/docs/framework-design/project-package-design).

## Usage

In most scenarios, you can simply execute `gf gen dao` in the project root directory. Below is the command line help information.

```shell
$ gf gen dao -h
USAGE
    gf gen dao [OPTION]

OPTION
    -p, --path                  directory path for generated files
    -l, --link                  database configuration, the same as the ORM configuration of GoFrame
    -t, --tables                generate models only for given tables, multiple table names separated with ','
    -x, --tablesEx              generate models excluding given tables, multiple table names separated with ','
    -g, --group                 specifying the configuration group name of database for generated ORM instance,
                                it's not necessary and the default value is "default"
    -f, --prefix                add prefix for all table of specified link/database tables
    -r, --removePrefix          remove specified prefix of the table, multiple prefix separated with ','
    -rf, --removeFieldPrefix    remove specified prefix of the field, multiple prefix separated with ','
    -j, --jsonCase              generated json tag case for model struct, cases are as follows:
                                | Case            | Example            |
                                |---------------- |--------------------|
                                | Camel           | AnyKindOfString    |
                                | CamelLower      | anyKindOfString    | default
                                | Snake           | any_kind_of_string |
                                | SnakeScreaming  | ANY_KIND_OF_STRING |
                                | SnakeFirstUpper | rgb_code_md5       |
                                | Kebab           | any-kind-of-string |
                                | KebabScreaming  | ANY-KIND-OF-STRING |
    -i, --importPrefix          custom import prefix for generated go files
    -d, --daoPath               directory path for storing generated dao files under path
    -o, --doPath                directory path for storing generated do files under path
    -e, --entityPath            directory path for storing generated entity files under path
    -t1, --tplDaoIndexPath      template file path for dao index file
    -t2, --tplDaoInternalPath   template file path for dao internal file
    -t3, --tplDaoDoPath         template file path for dao do file
    -t4, --tplDaoEntityPath     template file path for dao entity file
    -s, --stdTime               use time.Time from stdlib instead of gtime.Time for generated time/date fields of tables
    -w, --withTime              add created time for auto produced go files
    -n, --gJsonSupport          use gJsonSupport to use *gjson.Json instead of string for generated json fields of
                                tables
    -v, --overwriteDao          overwrite all dao files both inside/outside internal folder
    -c, --descriptionTag        add comment to description tag for each field
    -k, --noJsonTag             no json tag will be added for each field
    -m, --noModelComment        no model comment will be added for each field
    -a, --clear                 delete all generated go files that do not exist in database
    -y, --typeMapping           custom local type mapping for generated struct attributes relevant to fields of table
    -h, --help                  more information about this command

EXAMPLE
    gf gen dao
    gf gen dao -l "mysql:root:12345678@tcp(127.0.0.1:3306)/test"
    gf gen dao -p ./model -g user-center -t user,user_detail,user_login
    gf gen dao -r user_

CONFIGURATION SUPPORT
    Options are also supported by configuration file.
    It's suggested using configuration file instead of command line arguments making producing.
    The configuration node name is "gfcli.gen.dao", which also supports multiple databases, for example (config.yaml):
```yaml
gfcli:
  gen:
    dao:
    - link:     "mysql:root:12345678@tcp(127.0.0.1:3306)/test"
      tables:   "order,products"
      jsonCase: "CamelLower"
    - link:   "mysql:root:12345678@tcp(127.0.0.1:3306)/primary"
      path:   "./my-app"
      prefix: "primary_"
      tables: "user, userDetail"
      typeMapping:
        decimal:
          type:   decimal.Decimal
          import: github.com/shopspring/decimal
```

> If using the project engineering scaffold recommended by the framework, and the system has the `make` tool installed, you can also use the `make dao` shortcut command.

## Configuration Example

```yaml
/hack/config.yaml

gfcli:
  gen:
    dao:
    - link:     "mysql:root:12345678@tcp(127.0.0.1:3306)/test"
      tables:   "order,products"
      jsonCase: "CamelLower"

    - link:   "mysql:root:12345678@tcp(127.0.0.1:3306)/primary"
      path:   "./my-app"
      prefix: "primary_"
      tables: "user, userDetail"
```

## Parameter Explanation

***gfcli.gen.da***o

The `dao` code generation configuration item can consist of multiple configuration items forming an array, supporting the generation of multiple databases. Different databases can have different generation rules, for example, they can be generated to different locations or files.

***lin***k

A required parameter that is divided into two parts: the first part indicates the type of database you are connecting to, such as mysql, postgresql, etc. The second part is the DSN information for connecting to the database. For details, please refer to the section on ORM usage configuration.

***pat***h

The directory path where the generated `dao` and `model` files are stored.

- Default: `internal`

***grou***p

The group name of the database in the database configuration. Only one name can be configured. The group name of the database in the configuration file is often determined and not changed afterwards.

- Default: `default`

***prefi***x

A prefix for the generated database objects and files to distinguish between different databases or the same table names in different databases, preventing data table name conflicts.

- Example: `order_`, `user_`

***removePrefi***x

Remove the specified prefix name of the data table. Multiple prefixes are separated by commas.

- Example: `gf_`

***removeFieldPrefi***x

Remove the specified prefix name of the field name. Multiple prefixes are separated by commas.

- Example: `f_`

***table***s

Specify the data tables in the current database for which code generation is to be performed. If left empty, all tables in the database will be generated.

- Example: `user, user_detail`

***tablesEx***

Tables Excluding, specify the data tables in the current database that are to be excluded from code generation.

- Example: `product, order`

***jsonCas***e

Specify the naming rule for the json tags in the generated data entity objects in the model. The parameter is not case-sensitive and can be one of: Camel, CamelLower, Snake, SnakeScreaming, SnakeFirstUpper, Kebab, KebabScreaming. For details, please refer to the naming examples in the help documentation.

- Default: `CamelLower`

***stdTime***

When the data table field type is a time type, use the standard library's `time.Time` instead of the framework's `*gtime.Time` type for the generated property type.

- Default: `false`

***withTim***e

Add a creation time comment for each automatically generated code file.

- Default: `false`

***gJsonSuppor***t

When the data table field type is JSON, use the `*gjson.Json` type for the generated property type.

- Default: `false`

***overwriteDa***o

Whether to regenerate and overwrite files outside the `dao/internal` directory every time `dao` code is generated. Note that files outside the `dao/internal` directory may have been custom-extended by developers, and overwriting may pose risks.

- Default: `false`

***importPrefi***x

Used to specify the import path prefix for generated Go files. This is especially necessary when using the `gen dao` command not in the project root directory or when wanting to generate code files into custom directories.

- Detected automatically via `go.mod`

***descriptionTa***g

Specify whether to add a description tag for the data model structure property, with content as the corresponding data table field comments.

- Default: `false`

***noJsonTa***g

Generate data models where fields do not have json tags.

- Default: `false`

***noModelCommen***t

Specify whether to disable the automatic generation of comments for data model structure property comments, which are the comments for the corresponding data table fields.

- Default: `false`

***clea***r

Automatically delete local `dao`, `do`, `entity` code files that do not have corresponding data tables in the database. Please use this parameter with caution!

- Default: `false`

***typeMappin***g

Supported from version v2.5.

Used to customize the mapping from data table field types to the corresponding property types in the generated Go files. This configuration supports the introduction of third-party packages through the `import` configuration.

```yaml
decimal:
  type: float64
money:
  type: float64
numeric:
  type: float64
smallmoney:
  type: float64
```

Example with third-party package:

```yaml
decimal:
  type:   decimal.Decimal
  import: github.com/shopspring/decimal
```

***daoPath***

The directory where the generated `DAO` files are stored.

- Default: `dao`

***doPath***

The directory where the generated `DO` (Data Object) files are stored.

- Default: `model/do`

***entityPath***

The directory where the generated `Entity` files are stored.

- Default: `model/entity`

***tplDaoIndexPath***

Custom `DAO Index` code generation template file path. Refer to the source code when using this parameter.

***tplDaoInternalPath***

Custom `DAO Internal` code generation template file path. Refer to the source code when using this parameter.

***tplDaoDoPath***

Custom `DO` code generation template file path. Refer to the source code when using this parameter.

***tplDaoEntityPath***

Custom `Entity` code generation template file path. Refer to the source code when using this parameter.

## Usage Example

Repository address: [https://github.com/gogf/focus-single](https://github.com/gogf/focus-single)

The following three directories contain files generated by the `dao` command:

***/internal/dao***

**Data Operation Objects**: These objects provide access to the underlying data source through an object-oriented approach, implemented based on the `ORM` component. They are often used in conjunction with `entity` and `do` for general use. Developers can extend and modify the files in this directory, but it is usually not necessary.

***/internal/model/do***

**Data Transformation Models**: These models are used for transforming business models into data models. They are maintained by the tool and cannot be modified by users. Each time the tool generates code files, it will overwrite the contents of this directory.

***/internal/model/entity***

**Data Models**: These models are maintained by the tool and cannot be modified by users. Each time the tool generates code files, it will overwrite the contents of this directory.

## Models in model

Models in `model` are divided into two categories: Data Models and Business Models.

### Data Models

Data models are automatically generated by the CLI tool in the `model/entity` directory. All database tables are generated into this directory, and the files in this directory correspond to data models. Data models are data structures that correspond one-to-one with data tables. Developers typically do not need to, and should not, modify them. Data models are automatically updated by the CLI tool only when the data table structure changes. Data models are generated and uniformly maintained by the CLI tool.

### Business Models

Business models are data structures related to business needs, defined as required. For example, they can include input and output data structure definitions for `services`, internal data structure definitions, etc. Business models are defined and maintained by developers according to business needs and are defined under the `model` directory.

## dao File

Files in `dao` are named according to the data table names, with one file per table and its corresponding `DAO` object. Operating on data tables is achieved through `DAO` objects and related operational methods. `DAO` operations are designed in a standardized way, requiring the transmission of a `ctx` parameter, and in the generated code, objects must be created using the `Ctx` or `Transaction` method for chain operations on data tables.

## Precautions

### Database Types Requiring Manual Compilation

The `gen dao` command, when generating data access-related code, supports several commonly used database types by default. If you need support for `Oracle` databases, developers must modify the source code files themselves and then manually compile and generate the `CLI` tool locally for installation. This is because the drivers for these databases require `CGO` support, which cannot be pre-compiled for direct use.

### Regarding bool Type Corresponding Data Table Fields

Since most database types do not have a bool type for data table fields, we recommend using `bit(1)` as a substitute for bool types. The `gen dao` command will automatically recognize `bit(1)` data table fields and generate properties of type bool. Additionally, we do not recommend using `tinyint(1)` as a bool type.
