# Time - Formats

## Important Notes

The `gtime.Time` object uses the `Format` method to implement custom date and time conversions. However, this method conflicts with the `Format` method of the standard library's `time.Time`. In the `gtime.Time` object, the `Layout` method is used to implement the formatting syntax of the standard library's `time.Time`. For example:

```go
t.Layout("2006-01-02 15:04:05")
```

Below is a list of the supported time format syntax for the `gtime` module:

## Day

```markdown
| Format            | Description                                                   | Range/Examples                     |
|-------------------|---------------------------------------------------------------|------------------------------------|
| d                 | Day of the month, with leading zeros (2 digits)               | 01 to 31                           |
| D                 | Day of the week, textual, 3 letters                           | Mon to Sun                         |
| N                 | ISO-8601 numeric representation of the day of the week        | 1 (for Monday) to 7 (for Sunday)   |
| j                 | Day of the month without leading zeros                        | 1 to 31                            |
| l (lowercase "L") | Full textual representation of the day of the week            | Sunday to Saturday                 |
| S                 | English suffix for the day of the month, 2 characters         | st, nd, rd, or th (used with `j`)  |
| w                 | Numeric representation of the day of the week                 | 0 (for Sunday) to 6 (for Saturday) |
| z                 | Day of the year                                               | 0 to 365                           |
```

## Week

```markdown
| Format | Description                                              | Range/Examples                       |
|--------|----------------------------------------------------------|--------------------------------------|
| W      | ISO-8601 week number of the year (week starts on Monday) | e.g., 42 (the 42nd week of the year) |
```

## Month

```markdown
| Format | Description                                                | Range/Examples      |
|--------|------------------------------------------------------------|---------------------|
| F      | Full textual representation of the month                   | January to December |
| m      | Numeric representation of the month, with leading zeros    | 01 to 12            |
| M      | Short textual representation of the month, 3 letters       | Jan to Dec          |
| n      | Numeric representation of the month, without leading zeros | 1 to 12             |
| t      | Number of days in the given month                          | 28 to 31            |
```

## Year

```markdown
| Format | Description                                      | Range/Examples     |
|--------|--------------------------------------------------|--------------------|
| Y      | Full numeric representation of a year (4 digits) | e.g., 1999 or 2003 |
| y      | Two-digit representation of a year               | e.g., 99 or 03     |
```

## Time

```markdown
| Format | Description                                         | Range/Examples      |
|--------|-----------------------------------------------------|---------------------|
| a      | Lowercase Ante meridiem (am) and Post meridiem (pm) | am or pm            |
| A      | Uppercase Ante meridiem (AM) and Post meridiem (PM) | AM or PM            |
| g      | Hour in 12-hour format, no leading zeros            | 1 to 12             |
| G      | Hour in 24-hour format, no leading zeros            | 0 to 23             |
| h      | Hour in 12-hour format, with leading zeros          | 01 to 12            |
| H      | Hour in 24-hour format, with leading zeros          | 00 to 23            |
| i      | Minutes, with leading zeros                         | 00 to 59            |
| s      | Seconds, with leading zeros                         | 00 to 59            |
| u      | Milliseconds (3 digits)                             | e.g., 000, 123, 239 |
| U      | UNIX timestamp (in seconds)                         | e.g., 1559648183    |
```

## Time Zone

```markdown
| Format | Description                                            | Range/Examples      |
|--------|--------------------------------------------------------|---------------------|
| O      | Difference to UTC in hours                             | e.g., +0200         |
| P      | Difference to UTC with colon between hours and minutes | e.g., +02:00        |
| T      | Time zone abbreviation                                 | e.g., UTC, GMT, CST |
```

## Date

```markdown
| Format | Description            | Range/Examples                        |
|--------|------------------------|---------------------------------------|
| c      | ISO 8601 date format   | e.g., 2004-02-12T15:19:21+00:00       |
| r      | RFC 822 formatted date | e.g., Thu, 21 Dec 2000 16:01:07 +0200 |
```
