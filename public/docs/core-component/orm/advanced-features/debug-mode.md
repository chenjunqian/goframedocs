# ORM Advanced Features - Debug Mode

## Overview of Debug Mode

To facilitate debugging during development, the `GoFrame ORM` supports a debug mode. This mode can be enabled either by using the `Debug` configuration in the configuration file or through the `SetDebug` method. Once enabled, all `SQL` operations will be output to the terminal or log file by the built-in logging object at the `DEBUG` level.

## Enabling Debug Mode

You can enable debug mode by setting the `debug` option to `true` in the configuration file, as shown below:

```yaml
database:
  default:
  - link: "mysql:root:12345678@tcp(127.0.0.1:3306)/user"
    debug: true
```

## Example of Debug Log Output

Once debug mode is enabled, you will see detailed logs of all SQL operations. Here is an example of the log output:

```bash
2021-05-22 21:12:10.776 [DEBU] {38d45cbf2743db16f1062074f7473e5c} [  4 ms] [default] [rows:0  ] [txid:1] BEGIN
2021-05-22 21:12:10.776 [DEBU] {38d45cbf2743db16f1062074f7473e5c} [  0 ms] [default] [rows:0  ] [txid:1] SAVEPOINT `transaction0`
2021-05-22 21:12:10.789 [DEBU] {38d45cbf2743db16f1062074f7473e5c} [ 13 ms] [default] [rows:8  ] [txid:1] SHOW FULL COLUMNS FROM `user`
2021-05-22 21:12:10.790 [DEBU] {38d45cbf2743db16f1062074f7473e5c} [  1 ms] [default] [rows:1  ] [txid:1] INSERT INTO `user`(`id`,`name`) VALUES(1,'john') 
2021-05-22 21:12:10.791 [DEBU] {38d45cbf2743db16f1062074f7473e5c} [  1 ms] [default] [rows:0  ] [txid:1] ROLLBACK TO SAVEPOINT `transaction0`
2021-05-22 21:12:10.791 [DEBU] {38d45cbf2743db16f1062074f7473e5c} [  0 ms] [default] [rows:1  ] [txid:1] INSERT INTO `user`(`id`,`name`) VALUES(2,'smith') 
2021-05-22 21:12:10.792 [DEBU] {38d45cbf2743db16f1062074f7473e5c} [  1 ms] [default] [rows:0  ] [txid:1] COMMIT 
```
