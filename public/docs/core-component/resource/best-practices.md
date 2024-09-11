# Resource - Best Practices

One of the primary goals of resource management design is to avoid affecting the development and management of static files during the development phase. Resource packaging should only be done at the time of release, and temporary files should be cleaned up after packaging. This process only impacts the generated binary executable file, making it seamless and convenient for developers.

## Preparing the Project

It is recommended to use the project directory structure provided by `GoFrame` and to create your project using the `CLI` tool. This is because the framework's engineering concepts and examples are based on a standardized project directory structure, which facilitates learning and using the framework, thereby improving development efficiency. Notably, the project directory includes a `packed` directory, used to store the packaged content related to the resource management component. By default, this directory contains an empty `Go` file that does nothing.

```txt
/
├── api
├── hack
├── internal
│   ├── cmd
│   ├── consts
│   ├── controller
│   ├── dao
│   ├── logic
│   ├── model
│   ├── packed (used to store the packaged content)
│   └── service
├── manifest
├── resource
├── utility
├── go.mod
└── main.go
```

## Development Phase

During the development phase, developers generally do not need to worry about resource management. Static files should be placed in the `resource` directory as recommended. Access to static files during development is directly handled through the file system.

## Preparing for Release

When development is complete and you want to package static files, template files, and configuration files into the binary executable file for release, the resource component's capabilities come into play. You need to configure cross-compilation settings; for detailed information, refer to the [Dev Tool - cross-compilation](/docs/dev-tool/cross-compilation). The CLI tool is used to compile the executable file, and the compilation configuration should be managed using a configuration file (placed in `hack/config.yaml`). Below is a sample configuration:

```yaml
gfcli:
  build:
    name:      "my-app"
    arch:      "amd64"
    system:    "linux"
    mod:       "none"
    cgo:       0
    packSrc:   "manifest/config,manifest/i18n,resource/public,resource/template"
    version:   ""
    output:    "./bin"
    extra:     ""
```

Note the `pack` configuration, which specifies the directories to be automatically packaged into the binary executable file during compilation. Then, execute the build command from the root directory of the project:

```bash
gf build
```

This command automatically packages the specified directories from the configuration file into a temporary `Go` file during compilation, compiles the executable, and cleans up the temporary `Go` file after completion.

> In most cases, configuration files may not need to be packaged into the binary executable file, depending on your specific business scenario.

## Deployment and Execution

Simply release and execute the binary file to deploy.
