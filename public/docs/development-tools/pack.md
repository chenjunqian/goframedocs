# Resource Packing - pack

## Usage

```bash
$ gf pack -h
USAGE
    gf pack SRC DST

ARGUMENT
    SRC    source path for packing, which can be multiple source paths.
    DST    destination file path for packed file. if extension of the filename is ".go" and "-n" option is given,
           it enables packing SRC to go file, or else it packs SRC into a binary file.

OPTION
    -n, --name       package name for output go file, it's set as its directory name if no name passed
    -p, --prefix     prefix for each file packed into the resource file
    -k, --keepPath   keep the source path from system to resource file, usually for relative path
    -h, --help       more information about this command

EXAMPLE
    gf pack public data.bin
    gf pack public,template data.bin
    gf pack public,template packed/data.go
    gf pack public,template,config packed/data.go
    gf pack public,template,config packed/data.go -n=packed -p=/var/www/my-app
    gf pack /var/www/public packed/data.go -n=packed
```

This command is used to pack any files into a resource file or a Go code file, allowing any files to be packed and published along with the executable file. Additionally, the `build` command supports packing and compiling in one step. For more details, please refer to the help information for the `build` command. For an introduction to resource management, please refer to the section on [Resource Management](/docs/core-component/resource).

## Usage Example

```bash
$ gf pack public,template packed/data.go
done!
$ ll packed                             
total 184
-rw-r--r--  1 john  staff    89K Dec 31 00:44 data.go
```

## Further Reading

[Resource Management - Best Practices](/docs/core-component/resource/best-practices)
