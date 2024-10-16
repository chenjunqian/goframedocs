# Interface Specification - gen ctrl

> This feature has been available since version `v2.5`. The command currently only supports `HTTP` interface development; for `GRPC`, please refer to the `gen pb` command. In the future, we will consider using this command to generate controller and `SDK` source code for both `HTTP` and `GRPC` uniformly.

## Basic Introduction

### Pain Points

When developing a project, it is often necessary to first design `API` interfaces based on business needs and scenarios. Using `proto` or `golang` structs to design the input and output of `APIs`, then creating corresponding controller implementations for the `APIs`, and finally, there may also be a need to provide `SDKs` (also in `Golang`) for internal/external service calls. The following pain points are encountered during the development process:

- ***Repetitive coding work is cumbersome***. After creating input and output definition files in the `API`, it is still necessary to create corresponding files in the controller directory, initialize controller code, and repeatedly copy input and output structure names from the `API` code, which is a tedious repetitive process.
- ***There is no reliable specification constraint between `APIs` and controllers***. Apart from certain naming constraints on APIs, the creation and method naming of controllers are not constrained, and the flexibility is high. It is difficult to constrain the correspondence between the structure names of `APIs` and the method names of controllers, and as the number of interfaces increases, there will be certain maintenance costs.
- ***The probability of code file conflicts in team development and multi-person collaboration is high***. When multiple people develop and collaborate by making changes to the same file, the probability of file conflicts will increase. The effort spent on handling such file conflicts in team collaboration development is meaningless.
- ***There is a lack of automatic generation tools for API HTTP `SDKs`***. After developing `APIs`, they often need to be immediately available for internal or external calls. The lack of convenient SDK generation requires manual maintenance of this part of the SDK code, which is very costly for the calling end.

## Command Features

- Standardizes `API` definition and controller file naming, as well as controller implementation method naming.
- Standardizes the association between `API` definitions and controller code, facilitating rapid location of `API` implementations.
- Automatically generates controller interfaces, controller initialization files, and code based on `API` definitions.
- Automatically generates easy-to-use `HTTP SDK` code based on `API` definitions. This feature is configurable and defaults to off.
- Supports `File Watch` automated generation mode: when a certain `API` structure definition file changes, the corresponding controllers and `SDK` code are automatically incrementally updated.

## Pre-agreed Conventions

### Important Standards

One of the purposes of this command is to standardize the writing of `API` code, so there are some important standards that need to be understood (otherwise, the code will not be generated):

- The path of the `API` interface definition file in the `API` layer should meet `/api/Module/Version/Definition File.go`, for example: `/api/user/v1/user.go`, `/api/user/v1/user_delete.go`, etc.
- The `module` here refers to the division of `API` modules, which can be divided according to different `business` attributes for convenient aggregation and maintenance. You can also consider the module as a specific `business` resource.
- The version here is usually defined in the form of v1/v2... for `API` compatibility version control. When the same `API` requires compatible updates, it needs to be distinguished by different version numbers. The default is to use v1 to manage the first version.
- The definition file here refers to the input and output definition files of the `API`, which usually require a separate go file for each `API` for independent maintenance. Of course, it also supports putting multiple `APIs` into a single go file for unified maintenance.
- The structure name defined in the `API` should meet the naming convention of `Operation+Req` and `Operation+Res`. For example: `GetOneReq/GetOneRes`, `GetListReq/GetListRes`, `DeleteReq/DeleteRes`, etc.
- The operation here is the name of the current `API` module operation, which usually corresponds to CURD: `Create`, `Update`, `GetList/GetOne`, `Delete`.

### Suggested Naming Conventions

We have made some suggested naming conventions for some common interface definitions for your reference:

- Query List: `GetListReq/Res` - Usually for paging query data records from the database.
- Query Details: `GetOneReq/Res` - Usually, the interface needs to pass the primary key condition to query the record details from the database.
- Create Resource: `CreateReq/Re`s - Usually for inserting one or more data records into the data table.
- Update Resource: `UpdateReq/Res` - Usually for modifying one or more data records in the data table according to certain conditions.
- Delete Resource: `DeleteReq/Res` - Usually for deleting one or more data records from the data table according to certain conditions.

## Command Usage

This command analyzes the code in the given API interface definition directory and automatically generates the corresponding controller/`SDK` Go code files.

### Manual Mode

If executing the command manually, simply execute `gf gen ctrl` in the project root directory, which will scan the API interface definition directory completely and generate the corresponding code.

```shell
$ gf gen ctrl -h
USAGE
    gf gen ctrl [OPTION]

OPTION
    -s, --srcFolder       source folder path to be parsed. default: api
    -d, --dstFolder       destination folder path storing automatically generated go files. default: internal/controller
    -w, --watchFile       used in file watcher, it re-generates go files only if given file is under srcFolder
    -k, --sdkPath         also generate SDK go files for api definitions to specified directory
    -v, --sdkStdVersion   use standard version prefix for generated sdk request path
    -n, --sdkNoV1         do not add version suffix for interface module name if version is v1
    -c, --clear           auto delete generated and unimplemented controller go files if api definitions are missing
    -m, --merge           generate all controller files into one go file by name of api definition source go file
    -h, --help            more information about this command

EXAMPLE
    gf gen ctrl
```

》 If using the project engineering scaffold recommended by the framework, and the system has the `make` tool installed, you can also use the `make ctrl` shortcut command.

- **srcFolder**: Optional, default is `api`. Points to the directory address of the `API` interface definition files.
- **dstFolder**: Optional, default is `internal/controller`. Points to the directory where the generated controller files are stored.
- **watchFile**: Optional, used in IDE file monitoring, it automatically executes the generation operation when the file changes.
- **sdkPath**: Optional, if `HTTP SDK` needs to be generated, this parameter is used to specify the directory path where the generated SDK code is stored.
- **sdkStdVersion**: Optional, default is `false`. Whether the generated `HTTP SDK` uses standard version management. Standard version management will automatically add request route prefixes based on API versions. For example, APIs of version v1 will automatically add `/api/v1` request route prefixes.
- **sdkNoV1**: Optional, default is `false`. Whether the interface module name in the generated `HTTP SDK` does not carry the V1 suffix when the version is v1.
- **clear**: Optional, default is `false`. Whether to delete `controller` interface files in the `controller` that do not exist in the `API` layer definition.
- **merge**: Optional, default is `false`. Used to control the generation of ctrl `controller` code files according to the `API` layer files, instead of the default division into different interface implementation files.

### Automatic Mode (Recommended)

If you are using `GolandIDE`, you can use our provided configuration file `watchers.xml` to automatically listen for code file modifications and automatically generate interface files.

## FAQ

### Why is each API interface generated into a separate controller file instead of being merged into one controller file?

Of course, for small projects or individual simple projects, or projects with only a few interfaces in an `API` module, the management method will not be a problem, and you can maintain the code files according to personal preferences. Here, we describe a more complex business project or an enterprise-level project, where there are many interfaces in an API module.

- Firstly, when developing `API` interfaces, it is clearer to find `API` implementations, rather than searching in a code file that is thousands of lines long.

- Secondly, in team collaboration projects, if multiple people modify the same `controller` file at the same time, it is easy to have file conflicts in version management. The maintenance method of one `API` interface corresponding to one `controller` implementation file can minimize the probability of file conflicts during code collaboration, and most developers do not want to spend their precious time over and over again resolving file conflicts.

- Lastly, the `controller` layer's code has its own responsibilities:

  - Validate input parameters: Parameters submitted by the client are not trustworthy and need to be validated in most scenarios.
  - Implement interface logic: Directly implement interface logic in the `controller`, or call one or more `service` interfaces, third-party `service` interfaces to implement interface logic. Note that API interface logic should not be implemented in the `service` layer interfaces because API interfaces are bound to specific business scenarios and cannot be reused. The most common mistake is that the `controller` directly passes the request to the `service` interface to implement the API interface logic, making the `controller` seem dispensable, and the `service` layer implementation becomes heavier and unable to be reused.
  - Generate return data: Organize internal results to generate the return data interface defined by the interface.

These responsibilities also mean that the `controller`'s code is relatively complex, and separate maintenance can reduce the developer's mental burden and easily maintain the API interface implementation logic.

Some suggestions:

If there are too many interface files under an `API` module, it is recommended to further divide the complex `API` module into sub-modules. This can decouple complex `API` modules and maintain `API` interface definitions and controller interface implementation files through multiple directories. The directory structure will be clearer, which is more conducive to team collaboration and version management.

***After reading the above design, if you still want to use a single source code file to manage all interfaces, you can refer to the `merge` parameter.***

### Why is there an empty go file in the generated controller module according to the API module?

For example:

Explanation:

An empty `go` file for the `controller` of each `API` module is generated, and this file is generated only once. Users can fill in the necessary predefined code content inside, such as variables, constants, data structure definitions, or package initialization method definitions used internally by the `controller` module, etc. We advocate good code management habits and try to maintain predefined content统一ly in the `go` file named after the module (`module.go`), instead of scattering it across various `go` files, to better maintain the code.

If there is no custom code content that needs to be filled in the `controller` at this time, just keep the file empty to reserve the ability to expand in the future.
