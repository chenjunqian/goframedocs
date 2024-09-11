# ORM Advanced Features - Log Output

> The output of `ORM` logs involves formatting and displaying the template of chain operations or SQL statements along with their execution parameters before they are submitted to the underlying database `driver`. This is meant for manual reading and debugging. Since the underlying driver may perform a secondary conversion of the submitted parameters, the log output here is only for reference and does not represent the actual `SQL` statements executed by the underlying layer.

Log output often involves printing debugging information or `SQL` statements. The log object can be configured using the `SetLogger` or `GetLogger` methods, or through a configuration file. For more details on log configuration, please refer to the [ORM Configuration](/docs/core-component/orm/config) section. Below is an example of enabling log output in a configuration file:

```yaml
database:
  logger:
  - path:   "/var/log/gf-app/sql"
    level:  "all"
    stdout: true
  default:
  - link:  "mysql:root:12345678@tcp(127.0.0.1:3306)/user"
    debug: true 
```

> Note that the keyword `logger` is used as the configuration name for ORM logs, so you cannot use this name as a database configuration group.

The log output from the ORM component is quite detailed. Let's look at an example:

```bash
2021-05-22 21:12:10.776 [DEBU] {38d45cbf2743db16f1062074f7473e5c} [  4 ms] [default] [rows:0  ] [txid:1] BEGIN
2021-05-22 21:12:10.776 [DEBU] {38d45cbf2743db16f1062074f7473e5c} [  0 ms] [default] [rows:0  ] [txid:1] SAVEPOINT `transaction0`
2021-05-22 21:12:10.789 [DEBU] {38d45cbf2743db16f1062074f7473e5c} [ 13 ms] [default] [rows:8  ] [txid:1] SHOW FULL COLUMNS FROM `user`
2021-05-22 21:12:10.790 [DEBU] {38d45cbf2743db16f1062074f7473e5c} [  1 ms] [default] [rows:1  ] [txid:1] INSERT INTO `user`(`id`,`name`) VALUES(1,'john') 
2021-05-22 21:12:10.791 [DEBU] {38d45cbf2743db16f1062074f7473e5c} [  1 ms] [default] [rows:0  ] [txid:1] ROLLBACK TO SAVEPOINT `transaction0`
2021-05-22 21:12:10.791 [DEBU] {38d45cbf2743db16f1062074f7473e5c} [  0 ms] [default] [rows:1  ] [txid:1] INSERT INTO `user`(`id`,`name`) VALUES(2,'smith') 
2021-05-22 21:12:10.792 [DEBU] {38d45cbf2743db16f1062074f7473e5c} [  1 ms] [default] [rows:0  ] [txid:1] COMMIT 
```

The log contains the following parts:

- **Date and Time**: Accurate to the millisecond.
- **Log Level**: Fixed at DEBUG level, as `SQL` logs are mainly used for debugging or troubleshooting. It's recommended to disable it in production environments.
- **SQL Execution Time**: The time taken from the client request to receiving data, in milliseconds. If the execution time is less than 1 millisecond, it is shown as 0 milliseconds.
- **Database Configuration Group**: Indicates the current `SQL`'s configuration group, default is `default`. For more details on configuration groups, refer to the [ORM Configuration](/docs/core-component/orm/config) section.
- **Transaction ID**: The transaction ID associated with the current `SQL`. This field is not present if the SQL does not belong to a transaction operation. For more on transaction IDs, refer to the [ORM Transaction](/docs/core-component/orm/transaction) section.
- **Executed SQL Statement**: Note that since `SQL` preprocessing is used at the underlying level, the `SQL` statements here are the results of automatic assembly by the component and are for reference only.
