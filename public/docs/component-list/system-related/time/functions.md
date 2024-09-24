# Time - Functions

The following is a list of commonly used methods. The documentation may lag behind the new features of the code. For more methods and examples, please refer to the [code documentation](https://pkg.go.dev/github.com/gogf/gf/v2/os/gtime).

## New

**Description**: `New` creates and returns a `Time` object with the given parameters.  
**Syntax**:

```go
func New(param ...interface{}) *Time
```

**Example**: Creating a `Time` object.

```go
func ExampleNew() {
    t1 := gtime.New(time.Now())
    t2 := gtime.New("2018-08-08 08:08:08")
    t3 := gtime.New(1533686888)

    fmt.Println(t1)
    fmt.Println(t2)
    fmt.Println(t3)

    // Output:
    // 2021-11-18 14:18:27 
    // 2018-08-08 08:08:08
    // 2018-08-08 08:08:08
}
```

## Now

**Description**: `Now` creates and returns a `Time` object representing the current time.  
**Syntax**:

```go
func Now() *Time
```

**Example**: Retrieving the current time object.

```go
func ExampleNow() {
    t := gtime.Now()
    fmt.Println(t)

    // Output:
    // 2021-11-06 13:41:08
}
```

## Format

**Description**: Format the time for output.  
**Syntax**:

```go
func (t *Time) Format(format string) string
```

**Example**: Formatting time output. For a complete list of time formats, refer to the "Time Management - Time Formats" documentation.

```go
func ExampleTime_Format() {
    gt1 := gtime.New("2018-08-08 08:08:08")

    fmt.Println(gt1.Format("Y-m-d"))
    fmt.Println(gt1.Format("l"))
    fmt.Println(gt1.Format("F j, Y, g:i a"))
    fmt.Println(gt1.Format("j, n, Y"))
    fmt.Println(gt1.Format("h-i-s, j-m-y, it is w Day z"))
    fmt.Println(gt1.Format("D M j G:i:s T Y"))

    // Output:
    // 2018-08-08
    // Wednesday
    // August 8, 2018, 8:08 am
    // 8, 8, 2018
    // 08-08-08, 8-08-18, 0831 0808 3 Wedam18 219
    // Wed Aug 8 8:08:08 CST 2018
}
```

## String

**Description**: Output the time as a string.  
**Syntax**:

```go
func (t *Time) String() string
```

**Example**: Outputting time as a string type.

```go
func ExampleTime_String() {
    gt := gtime.New("2018-08-08 08:08:08")
    t1 := gt.String()

    fmt.Println(t1)
    fmt.Println(reflect.TypeOf(t1))

    // Output:
    // 2018-08-08 08:08:08
    // string
}
```

## Timestamp

**Description**: Get the current object's timestamp in seconds. There are also `TimestampMicro`, `TimestampMilli`, and `TimestampNano` for microseconds, milliseconds, and nanoseconds, respectively.  
**Syntax**:

```go
func (t *Time) Timestamp() int64
func Timestamp() int64
```

**Example**: Getting the current object's timestamp in seconds.

```go
func ExampleTime_Timestamp() {
    t := gtime.Now()

    fmt.Println(t.Timestamp())
    fmt.Println(gtime.Timestamp())
    fmt.Println(t.TimestampMicro())
    fmt.Println(t.TimestampMilli())
    fmt.Println(t.TimestampNano())

    // Output:
    // 1533686888
    // 1533686888
    // 1533686888000
    // 1533686888000000
    // 1533686888000000000
}
```

## ToZone

**Description**: Set the time zone.  
**Syntax**:

```go
func (t *Time) ToZone(zone string) (*Time, error)
```

**Example**: Setting the time zone.

```go
func ExampleTime_ToZone() {
    gt1 := gtime.Now()
    gt2, _ := gt1.ToZone("Asia/Shanghai")
    gt3, _ := gt1.ToZone("Asia/Tokyo")

    fmt.Println(gt2)
    fmt.Println(gt3)

    // May Output:
    // 2021-11-11 17:10:10
    // 2021-11-11 18:10:10
}
```

## SetTimeZone

**Description**: Set the global time zone.  
**Syntax**:

```go
func SetTimeZone(zone string) error
```

**Example**: Setting the global time zone.

```go
func ExampleSetTimeZone() {
    gtime.SetTimeZone("Asia/Shanghai")
    fmt.Println(gtime.Datetime())

    gtime.SetTimeZone("Asia/Tokyo")
    fmt.Println(gtime.Datetime())
    
    // May Output:
    // 2018-08-08 08:08:08
    // 2018-08-08 09:08:08
}
```

Here is the next batch of translated content from the documentation, with Markdown formatting for improved readability.

```markdown
# Time Management - Additional Methods



## StrToTime

**Description**: Converts a time string into a `Time` object.  
**Syntax**:

```go
func StrToTime(str string, format ...string) (*Time, error)
```

**Example**: Converting a time string to a `Time` object.

```go
func ExampleStrToTime() {
    res, _ := gtime.StrToTime("2006-01-02T15:04:05-07:00", "Y-m-d H:i:s")
    fmt.Println(res)

    // May Output:
    // 2006-01-02 15:04:05
}
```

## Add

**Description**: Adds a duration to the current `Time` object.  
**Syntax**:

```go
func (t *Time) Add(d time.Duration) *Time
```

**Example**: Adding time to the current `Time` object.

```go
func ExampleTime_Add() {
    gt := gtime.New("2018-08-08 08:08:08")
    gt1 := gt.Add(time.Duration(10) * time.Second)

    fmt.Println(gt1)

    // Output:
    // 2018-08-08 08:08:18
}
```

## StartOfDay

**Description**: Returns a `Time` object representing the start of the current day. Similar methods include `StartOfHalf`, `StartOfHour`, `StartOfMonth`, `StartOfMinute`, `StartOfQuarter`, etc.  
**Syntax**:

```go
func (t *Time) StartOfDay() *Time
```

**Example**: Returning the start time of the current day.

```go
func ExampleTime_StartOfDay() {
    gt1 := gtime.New("2018-08-08 08:08:08")

    fmt.Println(gt1.StartOfDay())

    // Output:
    // 2018-08-08 00:00:00
}
```

## EndOfDay

**Description**: Returns a `Time` object representing the end of the current day. Similar methods include `EndOfHalf`, `EndOfHour`, `EndOfMonth`, `EndOfMinute`, `EndOfQuarter`, etc.  
**Syntax**:

```go
func (t *Time) EndOfDay() *Time
```

**Example**: Returning the end time of the current day.

```go
func ExampleTime_EndOfDay() {
    gt1 := gtime.New("2018-08-08 08:08:08")

    fmt.Println(gt1.EndOfDay())

    // Output:
    // 2018-08-08 23:59:59
}
```

## Month

**Description**: Returns the index number of the month within the year. For example, January corresponds to 1.  
**Syntax**:

```go
func (t *Time) Month() int
```

**Example**: Returning the index number of the current month.

```go
func ExampleTime_Month() {
    gt := gtime.New("2018-08-08 08:08:08")
    t1 := gt.Month()

    fmt.Println(t1)

    // Output:
    // 8
}
```

## Second

**Description**: Returns the current second within the minute. For example, if the time is 10:10:08, it will return 8.  
**Syntax**:

```go
func (t *Time) Second() int
```

**Example**: Returning the current second.

```go
func ExampleTime_Second() {
    gt := gtime.New("2018-08-08 08:08:08")
    t1 := gt.Second()

    fmt.Println(t1)

    // Output:
    // 8
}
```

## IsZero

**Description**: Checks if the time is equal to `0001-01-01 00:00:00`. Note that this does not mean a timestamp of zero, as a zero timestamp represents `1970-01-01 08:00:00`.  
**Syntax**:

```go
func (t *Time) IsZero() bool
```

**Example**: Checking if the time is zero.

```go
func ExampleTime_IsZero() {
    gt := gtime.New("0-0-0")

    fmt.Println(gt.IsZero())

    // Output:
    // true
}
```

Here is the next batch of translated content from the documentation, with Markdown formatting for improved readability:

```markdown
# Time Management - Additional Methods (Part 2)



## AddDate

**Description**: Adds the specified number of years, months, and days to the current `Time` object.  
**Syntax**:

```go
func (t *Time) AddDate(years int, months int, days int) *Time
```

**Example**: Adding the specified number of years, months, and days to the `Time` object.

```go
func ExampleTime_AddDate() {
    var (
        year  = 1
        month = 2
        day   = 3
    )
    gt := gtime.New("2018-08-08 08:08:08")
    gt = gt.AddDate(year, month, day)

    fmt.Println(gt)

    // Output:
    // 2019-10-11 08:08:08
}
```

## Equal

**Description**: Checks if two `Time` objects are equal.  
**Syntax**:

```go
func (t *Time) Equal(u *Time) bool
```

**Example**: Checking if two `Time` objects are equal.

```go
func ExampleTime_Equal() {
    gt1 := gtime.New("2018-08-08 08:08:08")
    gt2 := gtime.New("2018-08-08 08:08:08")

    fmt.Println(gt1.Equal(gt2))

    // Output:
    // true
}
```

## Before

**Description**: Checks if one `Time` object is before another.  
**Syntax**:

```go
func (t *Time) Before(u *Time) bool
```

**Example**: Checking if one `Time` object is before another.

```go
func ExampleTime_Before() {
    gt1 := gtime.New("2018-08-07 08:08:08")
    gt2 := gtime.New("2018-08-08 08:08:08")

    fmt.Println(gt1.Before(gt2))

    // Output:
    // true
}
```

## After

**Description**: Checks if one `Time` object is after another.  
**Syntax**:

```go
func (t *Time) After(u *Time) bool
```

**Example**: Checking if one `Time` object is after another.

```go
func ExampleTime_After() {
    gt1 := gtime.New("2018-08-07 08:08:08")
    gt2 := gtime.New("2018-08-08 08:08:08")

    fmt.Println(gt1.After(gt2))

    // Output:
    // false
}
```

## Layout

**Description**: Formats the time into a specified layout.  
**Syntax**:

```go
func (t *Time) Layout(layout string) string
```

**Example**: Formatting time into the specified layout.

```go
func ExampleTime_Layout() {
    gt1 := gtime.New("2018-08-08 08:08:08")

    fmt.Println(gt1.Layout("2006-01-02"))

    // Output:
    // 2018-08-08
}
```

## IsLeapYear

**Description**: Checks if the current year is a leap year.  
**Syntax**:

```go
func (t *Time) IsLeapYear() bool
```

**Example**: Checking if the current year is a leap year.

```go
func ExampleTime_IsLeapYear() {
    gt1 := gtime.New("2018-08-08 08:08:08")

    fmt.Println(gt1.IsLeapYear())

    // Output:
    // false
}
```

## Date

**Description**: Gets the current date.  
**Syntax**:

```go
func Date() string
```

**Example**: Getting the current date.

```go
func ExampleDate() {
    fmt.Println(gtime.Date())

    // May Output:
    // 2006-01-02
}
```

## Datetime

**Description**: Gets the current date and time.  
**Syntax**:

```go
func Datetime() string
```

**Example**: Getting the current date and time.

```go
func ExampleDatetime() {
    fmt.Println(gtime.Datetime())

    // May Output:
    // 2006-01-02 15:04:05
}
```

Here is the translated section from the technical guide, formatted in Markdown for readability and future editing:

```markdown
# Time Formatting and JSON Handling - Methods (Part 3)



## ISO8601

**Description**: Returns the current time in the ISO8601 format.  
**Syntax**:

```go
func ISO8601() string
```

**Example**:

```go
func ExampleISO8601() {
    fmt.Println(gtime.ISO8601())

    // May Output:
    // 2006-01-02T15:04:05-07:00
}
```

## RFC822

**Description**: Returns the current time in the RFC822 format.  
**Syntax**:

```go
func RFC822() string
```

**Example**:

```go
func ExampleRFC822() {
    fmt.Println(gtime.RFC822())

    // May Output:
    // Mon, 02 Jan 06 15:04 MST
}
```

## StrToTimeFormat

**Description**: Converts a time string into a `Time` object based on the provided format.  
**Syntax**:

```go
func StrToTimeFormat(str string, format string) (*Time, error)
```

**Example**:

```go
func ExampleStrToTimeFormat() {
    res, _ := gtime.StrToTimeFormat("2006-01-02 15:04:05", "Y-m-d H:i:s")
    fmt.Println(res)

    // Output:
    // 2006-01-02 15:04:05
}
```

## StrToTimeLayout

**Description**: Converts a time string into a `Time` object based on the provided layout.  
**Syntax**:

```go
func StrToTimeLayout(str string, layout string) (*Time, error)
```

**Example**:

```go
func ExampleStrToTimeLayout() {
    res, _ := gtime.StrToTimeLayout("2018-08-08", "2006-01-02")
    fmt.Println(res)

    // Output:
    // 2018-08-08 00:00:00
}
```

## MarshalJSON

**Description**: Overloads the `json.Marshal` method for `Time` objects, allowing them to be converted into JSON.  
**Syntax**:

```go
func (t *Time) MarshalJSON() ([]byte, error)
```

**Example**:

```go
func ExampleTime_MarshalJSON() {
    type Person struct {
        Name     string     `json:"name"`
        Birthday *gtime.Time `json:"birthday"`
    }
    p := new(Person)
    p.Name = "goframe"
    p.Birthday = gtime.New("2018-08-08 08:08:08")
    j, _ := json.Marshal(p)
    fmt.Println(string(j))

    // Output:
    // {"name":"goframe","birthday":"2018-08-08 08:08:08"}
}
```

## UnmarshalJSON

**Description**: Overloads the `json.Unmarshal` method for `Time` objects, allowing JSON data to be converted into `Time` objects.  
**Syntax**:

```go
func (t *Time) UnmarshalJSON() ([]byte, error)
```

**Example**:

```go
func ExampleTime_UnmarshalJSON() {
    type Person struct {
        Name     string     `json:"name"`
        Birthday *gtime.Time `json:"birthday"`
    }
    p := new(Person)
    p.Name = "goframe"
    p.Birthday = gtime.New("2018-08-08 08:08:08")
    j, _ := json.Marshal(p)
    fmt.Println(string(j))

    // Output:
    // {"name":"goframe","birthday":"2018-08-08 08:08:08"}
}
```

## WeekOfYear

**Description**: Returns the current week of the year (starting from 1).  
Similar methods: `DayOfYear`, `DaysInMonth`.  
**Syntax**:

```go
func (t *Time) WeeksOfYear() int
```

**Example**:

```go
func ExampleTime_WeeksOfYear() {
    gt1 := gtime.New("2018-01-08 08:08:08")

    fmt.Println(gt1.WeeksOfYear())

    // Output:
    // 2
}
```
