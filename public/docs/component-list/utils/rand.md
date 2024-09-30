# Random Numbers - grand

The `grand` module provides encapsulation and improvements for random number operations, offering extremely high random number generation performance. It also provides a variety of useful methods related to random numbers.

## Usage

```go
import "github.com/gogf/gf/v2/util/grand"
```

**API Documentation**:  
[https://pkg.go.dev/github.com/gogf/gf/v2/util/grand](https://pkg.go.dev/github.com/gogf/gf/v2/util/grand)

## Common Methods

- `func N(min, max int) int`  
  Returns a random integer between `min` and `max`, inclusive.

- `func B(n int) []byte`  
  Returns a byte array of random values of length `n`.

- `func S(n int, symbols ...bool) string`  
  Returns a random string of length `n`, with the option to include special symbols based on the `symbols` parameter.

- `func Str(s string, n int) string`  
  Returns a random string of length `n` from the given string `s`.

- `func Intn(max int) int`  
  Returns a random integer between `0` and `max` (exclusive).

- `func Digits(n int) string`  
  Returns a random numeric string of length `n`.

- `func Letters(n int) string`  
  Returns a random string of English letters (both lowercase and uppercase) of length `n`.

- `func Meet(num, total int) bool`  
  Calculates whether the random probability meets the condition of `num/total`.

- `func MeetProb(prob float32) bool`  
  Calculates whether a random event occurs based on the given probability `prob`.

- `func Perm(n int) []int`  
  Returns a random permutation of numbers from `0` to `n-1`.

- `func Symbols(n int) string`  
  Returns a random string of special characters of length `n`.

## Character Sets

```markdown
| Character Type | Character Set                                          |
| -------------- | ------------------------------------------------------ |
| Numeric        | `0123456789`                                           |
| Alphabetic     | `abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ` |
| Special        | `!"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~`                    |
```

## Random Integers

The `Intn` method returns a random integer greater than or equal to `0` and less than `max`, i.e., `[0, max)`.

The `N` method returns a random integer between `min` and `max`, including the boundaries and supporting negative values, i.e., `[min, max]`.

## Random Strings

- **Binary Data**:  
  The `B` method returns a binary `[]byte` array of random values with the specified length.

- **Numeric and Alphabetic Strings**:  
  The `S` method returns a random string of the specified length containing numeric and alphabetic characters. If the `symbols` parameter is `true`, the returned string may also include special characters.

- **Custom Character String**:  
  The `Str` method is more advanced. It allows you to specify a string of characters from which the method will randomly select a specified number of characters. This supports Unicode characters, such as Chinese. For example, `Str("中文123abc", 3)` may return a random string like `1a文`.

- **Random Numeric String**:  
  The `Digits` method returns a random numeric string of the specified length.

- **Random Alphabetic String**:  
  The `Letters` method returns a random string of English alphabetic characters of the specified length.

- **Random Special Character String**:  
  The `Symbols` method returns a random string of special characters of the specified length.

## Probability Calculations

- **Meet**:  
  The `Meet` method allows you to specify two numbers: `num` and `total` (typically `num <= total`). It calculates whether a random event happens based on the probability `num/total`. For example, `Meet(1, 100)` will randomly determine whether a 1% chance event occurs.

- **MeetProb**:  
  The `MeetProb` method takes a floating-point probability `prob` (typically `prob <= 1.0`) and calculates whether a random event occurs based on that probability. For example, `MeetProb(0.005)` will calculate whether a 0.5% chance event occurs.
