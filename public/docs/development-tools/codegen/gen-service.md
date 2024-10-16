# Module Specification - gen service

> This feature is experimental. Developers are advised to focus on module division under the `logic` directory, clarify inter-module relationships, avoid circular dependencies, and make full use of the `Go` compiler's circular dependency detection features to write higher quality project code.

This feature has been available since version `v2.1`.

## Basic Introduction

### Design Background

In business project practice, the encapsulation of business logic is often the most complex part. At the same time, the dependencies between business modules are very complex and have vague boundaries, making it difficult to use `Go` package management. How to effectively manage the business logic encapsulation part in the project is a problem that every `Go`-developed project will inevitably encounter.

In the standard software design process, the dependencies between modules are first clearly defined by interfaces, and then implemented through code during the software development process. However, in most fast-paced internet projects, there is no rigorous software design process, and even the quality levels of developers are uneven. Most developers first care about how to implement the functional logic corresponding to the demand scenarios and try to improve development efficiency as much as possible.

### Design Objectives

To provide a code management method that can directly generate module interface definitions and module registration code through specific module implementations.
Simplify the implementation of business logic and interface separation, reduce the repetitive operations of module methods and interface definitions, and improve the transparency and convenience of calls between modules.

## Design Implementation

- Add a `logic` category directory, migrate all business `logic` code to the `logic` category directory, and manage business modules using package management.
- The dependencies between business modules are decoupled through interfaces, and the original `service` category is adjusted to an interface directory. In this way, each business module will maintain itself and be more flexible.
- You can follow certain coding standards to generate `service` interface definition code from `logic` business `logic` code. At the same time, it is also allowed to manually maintain this part of the `service` interface.

### Precautions

> Please note again that generating `service` interfaces through `logic` implementation is not a standardized practice in code management. It only provides another convenient code management method that can be chosen. This management method has both advantages and disadvantages. The advantage is that it is convenient for automatically generating interfaces for business modules in microservice scenarios; the disadvantage is that it cannot recognize syntax inheritance relationships, cannot generate methods for parent-level nested types, and abandons the `Go` compiler's feature of detecting circular dependencies at compile time.

***The framework's project management also supports the standard interface code management method***, which is to define `service` interfaces first and then code logic specific implementations. It should be noted that the source code of this `service` should not contain top tool comment information (the tool relies on this comment to determine whether the file can be overwritten). Many students retain the file header comments when copying and pasting, which will cause the manual maintenance of interface files to fail.

## Command Usage

This command analyzes the code under the given logic business logic module directory and automatically generates service directory interface code.

>Note:
>
> - Since the command generates `service` interfaces based on business modules, it will only parse the `Go` code files in the second-level directory and will not recursively analyze code files indefinitely. Taking the `logic` directory as an example, the command will only parse `logic/xxx/*.go`files. Therefore, the `logic` layer code structure must meet certain specifications.
> - The names of structures defined in different business modules may overlap when generating `service` interface names, so it is necessary to ensure that the names do not conflict when designing business modules.

For the example project of this command, please refer to: [https://github.com/gogf/gf-demo-user](https://github.com/gogf/gf-demo-user) (Note: Due to network issues, the content of the above link could not be parsed successfully. Please check the legality of the web page link and try again if necessary.)

### Manual Mode

If you are executing the command line manually, simply execute `gf gen service` directly in the project root directory.

```bash
$ gf gen service -h
USAGE
    gf gen service [OPTION]

OPTION
    -s, --srcFolder         source folder path to be parsed. default: internal/logic
    -d, --dstFolder         destination folder path storing automatically generated go files. default: internal/service
    -f, --dstFileNameCase   destination file name storing automatically generated go files, cases are as follows:
                            | Case            | Example            |
                            |---------------- |--------------------|
                            | Lower           | anykindofstring    |
                            | Camel           | AnyKindOfString    |
                            | CamelLower      | anyKindOfString    |
                            | Snake           | any_kind_of_string | default
                            | SnakeScreaming  | ANY_KIND_OF_STRING |
                            | SnakeFirstUpper | rgb_code_md5       |
                            | Kebab           | any-kind-of-string |
                            | KebabScreaming  | ANY-KIND-OF-STRING |
    -w, --watchFile         used in file watcher, it re-generates all service go files only if given file is under
                            srcFolder
    -a, --stPattern         regular expression matching struct name for generating service. default: ^s([A-Z]\\w+)$
    -p, --packages          produce go files only for given source packages
    -i, --importPrefix      custom import prefix to calculate import path for generated importing go file of logic
    -l, --clear             delete all generated go files that are not used any further
    -h, --help              more information about this command

EXAMPLE
    gf gen service
    gf gen service -f Snake
```

> If you use the project engineering scaffold recommended by the framework, and the system has installed the make tool, you can also use the `make service` shortcut command.

### Parameter Description

- **srcFolder**: The path to the logic code directory, default is `internal/logic`.
- **dstFolder**: The path to the directory where the generated interface files are stored, default is `internal/service`.
- **dstFileNameCase**: The format of the generated file name, default is `Snake`.
- **stPattern**: Use regular expressions to specify the format of business module structure definitions, which facilitates the parsing of business interface definition names. Under the default regular expression, all structures that start with a lowercase 's' followed by an uppercase letter will be treated as business module interface names. For example:
  - `sUser` becomes `User`
  - `sMetaData` becomes `MetaData`
- **watchFile**: Used in file watching, representing the path of the current changed code file.
- **packages**: Generate interface files only for specified package names, given as a string array. If passed through the command line, a JSON string is provided, and the command line component automatically converts the data type.
- **importPrefix**: Specify the prefix for the import path in the generated business reference files.
- **overwrite**: Whether to overwrite existing files when generating code files, default is `true`.
- **clear**: Automatically delete interface files in logic that no longer exist (only delete automatically maintained files), default is `false`.

### Automatic Mode

***Goland/Idea***

If you are using GolandIDE, you can utilize the configuration file we provide: `watchers.xml` to automatically generate interface files when code modifications are detected.

`watchers.xml`

```xml
<TaskOptions>
  <TaskOptions>
    <option name="arguments" value="fmt $FilePath$" />
    <option name="checkSyntaxErrors" value="true" />
    <option name="description" />
    <option name="exitCodeBehavior" value="ERROR" />
    <option name="fileExtension" value="go" />
    <option name="immediateSync" value="false" />
    <option name="name" value="go fmt" />
    <option name="output" value="$FilePath$" />
    <option name="outputFilters">
      <array />
    </option>
    <option name="outputFromStdout" value="false" />
    <option name="program" value="$GoExecPath$" />
    <option name="runOnExternalChanges" value="false" />
    <option name="scopeName" value="Project Files" />
    <option name="trackOnlyRoot" value="true" />
    <option name="workingDir" value="$ProjectFileDir$" />
    <envs>
      <env name="GOROOT" value="$GOROOT$" />
      <env name="GOPATH" value="$GOPATH$" />
      <env name="PATH" value="$GoBinDirs$" />
    </envs>
  </TaskOptions>
  <TaskOptions>
    <option name="arguments" value="gen service -w $FilePath$" />
    <option name="checkSyntaxErrors" value="true" />
    <option name="description" />
    <option name="exitCodeBehavior" value="ERROR" />
    <option name="fileExtension" value="go" />
    <option name="immediateSync" value="false" />
    <option name="name" value="gf gen service" />
    <option name="output" value="$ProjectFileDir$" />
    <option name="outputFilters">
      <array />
    </option>
    <option name="outputFromStdout" value="false" />
    <option name="program" value="gf" />
    <option name="runOnExternalChanges" value="false" />
    <option name="scopeName" value="Project Files" />
    <option name="trackOnlyRoot" value="true" />
    <option name="workingDir" value="$ProjectFileDir$" />
    <envs>
      <env name="GOROOT" value="$GOROOT$" />
      <env name="GOPATH" value="$GOPATH$" />
      <env name="PATH" value="$GoBinDirs$" />
    </envs>
  </TaskOptions>
</TaskOptions>
```

***Visual Studio Code***

If you are using Visual Studio Code, you can install the plugin [RunOnSave](https://marketplace.visualstudio.com/items?itemName=emeraldwalk.RunOnSave) and then configure the plugin as follows:

```json
"emeraldwalk.runonsave": {
    "commands": [
        {
            "match": ".*logic.*go",
            "isAsync": true,
            "cmd": "gf gen service"
        }
    ]
}
```

This configuration will run the `gf gen service` command every time a file with a `.go` extension within the `logic` directory is saved. Ensure that the plugin is properly installed and the configuration is added to your `settings.json` file in Visual Studio Code.

For more details on how to install and configure the `RunOnSave` plugin, refer to the plugin's official documentation or seek support from the Visual Studio Code community.
