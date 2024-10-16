# Project Creation - init

> Starting from version `v2`, project creation no longer depends on remote retrieval. The repository template has been built into the tool binary through resource management, making project creation extremely fast.

## Usage

```shell
$ gf init -h 
USAGE
    gf init ARGUMENT [OPTION]

ARGUMENT
    NAME    Project name, creates a folder named NAME in the current directory, and the module name is also NAME.

OPTION
    -m, --mono    Initialize a mono-repo
 -a, --monoApp Initialize a mono-repo-app within a mono-repo
 -u, --update  Initialize with the latest framework version
 -g, --module  Customize module
    -h, --help    More help

EXAMPLE
    gf init my-project
    gf init my-mono-repo -m
```

We can use the `init` command to generate a sample `GoFrame` empty framework project in the current directory and provide a project name argument. The generated project directory structure is for reference and can be adjusted according to the specific needs of the business project. For the generated directory structure, please refer to the section on [Project Package Design](/docs/framework-design/project-package-design).

> `GoFrame` framework development recommends using the official `go module` feature for dependency package management, so there is also a `go.mod` file in the root directory of the empty project.

> The engineering directory adopts a universal design, and the actual project can appropriately add or reduce the directories provided by the template as needed. For example, if there is no `Kubernetes` deployment requirement, simply delete the corresponding `deploy` directory.

## Usage Example

Initialize a project in the current directory:

```shell
$ gf init .
initializing...
initialization done!
you can now run 'gf run main.go' to start your journey, enjoy!
```

Create a project with a specified name:

```shell
$ gf init myapp
initializing...
initialization done!
you can now run 'cd myapp && gf run main.go' to start your journey, enjoy!
```

Create a `MonoRepo` project:

By default, a `SingleRepo` project is created. If needed, a `MonoRepo` (large repository) project can also be created by using the `-m` option.

```shell
$ gf init mymono -m
initializing...
initialization done!
For more information on monorepos, please refer to the section: Microservices MonoRepo Management Model
```

Create a `MonoRepoApp` project:

If you need to create a small repository within a `MonoRepo` (large repository), you can do so by using the `-a` option.

```shell
$ gf init app/user -a
initializing...
initialization done!
```
