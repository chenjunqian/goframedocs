# Unique ID - guid

The `guid` module provides an easy-to-use and high-performance function for generating globally unique identifiers (UIDs). The generated UID string contains only numbers and lowercase English letters.

## Advantages

- **High performance**: Efficient UID generation.
- **Ease of use**: Simple API design.

## Disadvantages

- **Limited character range**: Only numbers and lowercase English letters.
- **Fixed length**: The UID has a fixed length of 32 bytes.

The purpose of the `guid` module is to provide a simpler and more efficient method for generating UIDs that can satisfy most business scenarios. The design of `guid` is straightforward, and you can refer to the implementation source code for more details.

## Character Set

```markdown
| Character Type | Character Set                |
| -------------- | -----------------------------|
| Numeric        | `0123456789`                 |
| Alphabetic     | `abcdefghijklmnopqrstuvwxyz` |
```

## Usage

```go
import "github.com/gogf/gf/v2/util/guid"
```

**API Documentation**:  
[https://pkg.go.dev/github.com/gogf/gf/v2/util/guid](https://pkg.go.dev/github.com/gogf/gf/v2/util/guid)

## Basic Introduction

The `guid` module generates a 32-byte unique identifier using the `S` method. The method is defined as follows:

```go
func S(data ...[]byte) string
```

### Without Custom Parameters

If no parameters are provided, the generated UID will be structured as follows:

```bash
MACHash(7) + PID(4) + TimestampNano(12) + Sequence(3) + RandomString(6)
```

Where:

- **MAC**: The hash value of the MAC address of the current machine, consisting of 7 bytes.
- **PID**: The process ID of the current machine, consisting of 4 bytes.
- **TimestampNano**: The current nanosecond timestamp, consisting of 12 bytes.
- **Sequence**: A concurrency-safe sequence number for the current process, consisting of 3 bytes.
- **RandomString**: A random string, consisting of 6 bytes.

### With Custom Parameters

If custom parameters are provided, the generated UID will be structured as follows:

```bash
DataHash(7/14) + TimestampNano(12) + Sequence(3) + RandomString(3/10)
```

Where:

- **Data**: The custom parameters, which should be of type `[]byte`. Up to 2 parameters can be input, and they will make up 7 or 14 bytes.
  
  **Important note**: The input custom parameters should have unique identifying properties within your business logic to make the generated UID more valuable.

- **DataHash**: Regardless of the length of each `[]byte` parameter, a 7-byte hash value will be generated.
- **TimestampNano**: The current nanosecond timestamp, consisting of 12 bytes.
- **Sequence**: A concurrency-safe sequence number for the current process, consisting of 3 bytes.
- **RandomString**: A random string, either 3 or 10 bytes long, depending on the number of custom parameters:
  - If 1 custom parameter is provided, the remaining bytes will be filled with random values, making a total of 10 bytes.
  - If 2 custom parameters are provided, the remaining bytes will be filled with random values, making a total of 3 bytes.

## Benchmark

Below is a performance benchmark of the `guid` module on a specific machine configuration:

```plaintext
goos: darwin
goarch: amd64
pkg: github.com/gogf/gf/v2/util/guid
cpu: Intel(R) Core(TM) i7-9750H CPU @ 2.60GHz
Benchmark_S
Benchmark_S-12             2665587        423.8 ns/op
Benchmark_S_Data_1
Benchmark_S_Data_1-12      2027568        568.2 ns/op
Benchmark_S_Data_2
Benchmark_S_Data_2-12      4352824        275.5 ns/op
PASS
```

## Example 1: Basic Usage

```go
package main

import (
    "fmt"
    "github.com/gogf/gf/v2/util/guid"
)

func main() {
    fmt.Printf("TraceId: %s", guid.S())
}
```

After running, the output will be:

```bash
TraceId: oa9sdw03dk0c35q9bdwcnz42p00trwfr
```

## Example 2: Custom Parameters

In some cases, such as generating a Session ID, we may require a UID with stronger uniqueness to prevent collisions. We can achieve this by using custom parameters:

```go
func CreateSessionId(r *ghttp.Request) string {
    var (
        address = request.RemoteAddr
        header  = fmt.Sprintf("%v", request.Header)
    )
    return guid.S([]byte(address), []byte(header))
}
```

In this example, the `SessionId` is generated using two custom input parameters: `RemoteAddr` and `Header`. These parameters are unique enough within the business logic, making the generated UID highly random and unique. This satisfies business needs and ensures security.
