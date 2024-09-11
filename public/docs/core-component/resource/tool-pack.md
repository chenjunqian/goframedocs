# Resource - Tool Packaging

We can use the `gf` command-line tool to package any files or directories with the `pack` command. For more details on installing and using the `gf` command-line tool, please refer to the section on [Dev Tool - Pack](/docs/dev-tool/pack). Since packaging via the command line is simple and efficient, it is the recommended packaging method.

## Packaging Go Files with gf pack

A recommended approach is to generate Go files directly into the `boot` startup directory and set the package name of the generated Go file to `boot`. This way, the resource file will be automatically included in the project. For example, to package the `config`, `public`, and `template` directories of the project into a Go file, use the following packaging command:

```sh
gf pack config,public,template packed/data.go -n packed
```

The generated Go file will look like this:

```go
package packed

import "github.com/gogf/gf/v2/os/gres"

func init() {
    if err := gres.Add("H4sIAAAAAAAC/5y8c5Bl0Zbuu9O2bVaq0rZZ6Urbtm3bNnfatipto9"); err != nil {
        panic(err)
    }
}
```

As shown, the generated `Go` file uses the `gres.Add` method to add the binary content of the resource files to the default resource manager. The parameter of this method is a compressed BASE64 string, which will be decompressed when the program starts, creating an in-memory file tree object for quick file operations during runtime.

## Using the Packaged Go Files

***Import the Packaged Resource Package in the Boot Package***

In the `boot` program's startup settings package, automatically import the `packed` resource package, making it the first package to be imported. This ensures that other packages can use the resource content during their initialization (`init` method). For example, if the `module` name is `my-app`:

```go
import (
    _ "my-app/packed"

    // Other packages
)
```

It is recommended to add a blank line between the `packed` package and other packages to differentiate them. Note that some IDEs like Goland will not automatically sort imported packages.

***Import the Boot Package in the Main Package***

Since the main entry point of the project will import the `boot` package, it should also be the first package to be imported:

```go
import (
    _ "my-app/boot"

    // Other packages
)
```

Again, it is recommended to add a blank line between the `boot` package and other packages for clarity, especially since IDEs like Goland will not automatically sort the imported packages.

After setting this up, the `gres` module can be used anywhere in the project to access the packaged resource files.

> If you use the recommended project directory structure from `GoFrame`, a `boot` directory will be present (corresponding to the `boot` package), which is used for program startup settings. Therefore, if Go files are generated in the `boot` directory, they will be automatically compiled into the executable file.

## Printing the Resource Manager File List

You can use the `gres.Dump()` method to print out all the files currently managed by the resource manager. The output will look something like this:

```bash
2019-09-15T13:36:28+00:00   0.00B config
2019-07-27T07:26:12+00:00   1.34K config/config.toml
2019-09-15T13:36:28+00:00   0.00B public
2019-06-25T17:03:56+00:00   0.00B public/resource
2018-12-04T12:50:16+00:00   0.00B public/resource/css
2018-12-17T12:54:26+00:00   0.00B public/resource/css/document
2018-12-17T12:54:26+00:00   4.20K public/resource/css/document/style.css
2018-08-24T01:46:58+00:00  32.00B public/resource/css/index.css
2019-05-23T03:51:24+00:00   0.00B public/resource/image
2018-08-20T05:02:08+00:00  24.01K public/resource/image/cover.png
2019-05-23T03:51:24+00:00   4.19K public/resource/image/favicon.ico
2018-08-23T01:44:50+00:00   4.19K public/resource/image/gf.ico
2018-12-04T13:04:34+00:00   0.00B public/resource/js
2019-06-27T11:06:12+00:00   0.00B public/resource/js/document
2019-06-27T11:06:12+00:00  11.67K public/resource/js/document/index.js
2019-09-15T13:36:28+00:00   0.00B template
2019-02-02T09:08:56+00:00   0.00B template/document
2018-12-04T12:49:08+00:00   0.00B template/document/include
2018-12-04T12:49:08+00:00 329.00B template/document/include/404.html
2019-03-06T01:52:56+00:00   3.42K template/document/index.html
...
```

Note that when using resource files from the resource manager, you need to strictly follow their paths for retrieval.
