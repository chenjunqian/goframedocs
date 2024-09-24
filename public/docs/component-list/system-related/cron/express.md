# Cron - Expressions

The scheduled task system in Goframe adopts a cron expression format similar to Linux Crontab, allowing developers to quickly learn and master the techniques of creating cron expressions. However, please note that because the scheduled task module operates at the code level, it offers finer control, with a minimum granularity of one second. This format is divided into **6 fields**. On the other hand, Linux Crontab operates at the program level, with a minimum granularity of one minute, divided into **5 fields**.

## Basic Overview

A cron expression represents a set of times, divided into 6 fields separated by spaces:

```bash
Seconds  Minutes  Hours  Day  Month  Week
```

In other words: **Seconds**  **Minutes**  **Hours**  **Day**  **Month**  **Week**

***Meaning of Each Field***

```markdown
| Field Name | Allowed Values         | Allowed Special Characters |
| ---------- | ---------------------- | -------------------------- |
| Seconds    | 0-59                   | `* / , - #`                |
| Minutes    | 0-59                   | `* / , -`                  |
| Hours      | 0-23                   | `* / , -`                  |
| Day        | 1-31                   | `* / , - ?`                |
| Month      | 1-12 or JAN-DEC        | `* / , -`                  |
| Week       | 0-6 or SUN-SAT         | `* / , - ?`                |
```

**Note:** The values in the Month and Week fields are case-insensitive. For example, `SUN`, `Sun`, and `sun` are all accepted.

## Special Characters

- **Asterisk (`*`)**:  
  The asterisk means that the cron expression will match **all possible values** for that field. For example, an asterisk in the fifth field (Month) means every month.

- **Slash (`/`)**:  
  The slash is used to describe an increment within a range. For example, `3-59/15` in the second field means every 15 minutes starting from the 3rd minute to the 59th minute of every hour.

- **Comma (`,`)**:  
  Commas are used to separate a list of values. For example, `MON,WED,FRI` in the fifth field specifies that the task will run on Mondays, Wednesdays, and Fridays.

- **Dash (`-`)**:  
  The dash is used to define a range. For example, `9-17` in the third field means from 9 AM to 5 PM, inclusive.

- **Hash (`#`)**:  
  The hash allows the cron expression to ignore the value of the field. This symbol is currently only supported in the Seconds field, and is used to convert the 6-field cron pattern to a 5-field Linux crontab pattern seamlessly.

- **Question mark (`?`)**:  
  The question mark can be used in place of `*` to indicate that the Day or Week field should remain empty.

***Predefined Formats***

Several predefined time formats can be used instead of a full cron expression:

```markdown
| Entry                    | Description                                    | Equivalent To         |
| -----------------------  | ---------------------------------------------- | --------------------- |
| `@yearly` or `@annually` | Runs once a year, at midnight on Jan. 1st      | `0 0 0 1 1 *`         |
| `@monthly`               | Runs once a month, at midnight on the 1st day  | `0 0 0 1 * *`         |
| `@weekly`                | Runs once a week, at midnight between Sat/Sun  | `0 0 0 * * 0`         |
| `@daily` or `@midnight`  | Runs once a day, at midnight                   | `0 0 0 * * *`         |
| `@hourly`                | Runs once an hour, at the start of each hour   | `0 0 * * * *`         |
```

***Intervals***

You can also define tasks that run at fixed intervals starting from the time they are added. This is supported by formatting the cron specification as follows:

```bash
@every <duration>
```

Where `duration` is a string accepted by Go's [`time.ParseDuration`](https://golang.org/pkg/time/#ParseDuration).

For example, `@every 1h30m10s` means the task will run every **1 hour, 30 minutes, and 10 seconds** after the task is added.

The interval does not consider the task's execution overhead. For instance, if a task takes 3 minutes to complete and is scheduled to run every 5 minutes, there will only be 2 minutes of idle time between each execution.

## Expression Examples

Here are some common cron expression examples:

- `* * * * * *`: Runs **every second**
- `* * * * *`: Runs **every minute**, with at least a 60-second gap between executions
- `2 * * * * *`: Runs at the **2nd second of every minute**
- `*/5 * * * * *`: Runs every **5 seconds**
- `*/30 * * * *`: Runs every **30 minutes**
- `0 2 * * *`: Runs **daily at 2 AM**
- `*/30 9-18 * * *`: Runs every **30 minutes between 9 AM and 6 PM** every day
- `0 9 * * MON,FRI`: Runs at **9 AM every Monday and Friday**

## Important Notes

All language-level `6-field` `cron pattern` designs have practical limitations due to the inaccuracy of underlying timers. Since `cron pattern` are accurate to the second, any delays reaching the second-level could result in task loss. When the `Go` scheduling engine is slow, delays can easily reach the second-level, potentially causing logic issues.

In most cases, such precise control over scheduled task granularity is unnecessary. Therefore, starting from **Goframe v2.7**, we introduced the **# ignore symbol** for the Seconds field to convert `6-field` `cron pattern` into the more stable `5-field` Linux crontab patterns.

If second-level granularity is needed for your scheduled tasks, consider using the **gtimer** timer. However, be aware that **no timer is perfectly accurate**, and system time should not be fully relied upon for precision.
