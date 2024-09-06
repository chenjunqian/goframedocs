# ORM - FAQ

## Driver bad connection

If you encounter the error `driver: bad connection` during database execution, it is likely because the local database connection pool's connections have expired. Check if the client's `MaxLifeTime` configuration exceeds the database server's maximum connection timeout setting. For more client configurations, refer to the section on ORM configuration.

## Update and Insert Operations Not Working

If `update` or `insert` operations are not working while using ORM, make sure the following configuration is not present or is set to `0` in your configuration file:

```toml
dryRun = "(optional) ORM dry run (read-only mode)"
```

This configuration will cause `update` and `insert` operations to be ineffective. For more information, refer to the documentation on [ORM - Advanced Features](/docs/core-component/orm/advanced-features/).

## Cannot find database driver

This error occurs when the required database driver is not imported in your code. Note that starting from GoFrame v2.1, community drivers must be manually imported. You can find the necessary drivers and their details [here](https://github.com/gogf/gf/tree/master/contrib/drivers).

## Debug Log Shows WHERE 0=1 in SQL Query

If you find a `WHERE 0=1` condition in your SQL query, it could be because the query contains an array condition with a length of 0. The ORM does not automatically filter out such empty array conditions (as doing so could cause business logic errors). Developers need to explicitly call `OmitEmpty` or `OmitEmptyWhere` to tell the ORM to filter these empty array conditions based on the business context.

## Emoji Display Issue

**Solution:**

Ensure that the `charset` in the `config.toml` file is set to `utf8mb4` (the default is `utf8`).

**Considerations for Storing Emojis in MySQL:**

- The database encoding should be `utf8mb4`.
- The table encoding should be `utf8mb4`.
- The content fields in the table should be `utf8mb4`.

By setting the encoding to `utf8mb4`, MySQL will correctly handle and store emojis, avoiding garbled characters during retrieval and display.
