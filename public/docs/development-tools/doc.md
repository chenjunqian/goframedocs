# Local Documentation - doc

> This command has been available since version `v2.7.2` of the framework.

## Usage Scenarios

In situations where network conditions prevent smooth access to goframe.org or pages.goframe.org, this command allows you to download the documentation from pages.goframe.org to your local machine and run it.

## Usage

```bash
$ gf doc -h
USAGE
    gf doc [OPTION]

OPTION
    -p, --path     download docs directory path, default is "%temp%/goframe"
    -o, --port     http server port, default is 8080
    -u, --update   clean docs directory and update docs
    -c, --clean    clean docs directory
    -x, --proxy    proxy for download, such as https://hub.gitmirror.com/;https://ghproxy.com/;https://ghproxy.net/; 
                   https://ghps.cc/
    -h, --help     more information about this command
```

If you have poor network connectivity, you can use the `-x` parameter. For example: `gf doc -x=https://hub.gitmirror.com/`

By default, the documentation will be downloaded to the system's temporary directory, which can be customized using the `-p` parameter. However, this parameter must be specified the next time you start up as well; otherwise, the documentation will be downloaded again.
