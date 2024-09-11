# Data Validation - Object

The data validation component provides a data validation object for unified configuration management and chain operations.

Documentation: <https://pkg.go.dev/github.com/gogf/gf/v2/util/gvalid>

```go
type Validator
    func New() *Validator
    func (v *Validator) Assoc(assoc interface{}) *Validator
    func (v *Validator) Bail() *Validator
    func (v *Validator) Ci() *Validator
    func (v *Validator) Clone() *Validator
    func (v *Validator) Data(data interface{}) *Validator
    func (v *Validator) I18n(i18nManager *gi18n.Manager) *Validator
    func (v *Validator) Messages(messages interface{}) *Validator
    func (v *Validator) RuleFunc(rule string, f RuleFunc) *Validator
    func (v *Validator) RuleFuncMap(m map[string]RuleFunc) *Validator
    func (v *Validator) Rules(rules interface{}) *Validator
    func (v *Validator) Run(ctx context.Context) Error
```

***Overview***

1. `New` creates and returns a data validation object.

2. `Assoc` associates data with the data validation object.

3. `Bail` specifies that the validation should not stop on the first error.

4. `Ci` specifies that the validation should be case-insensitive.

5. `Run` runs the validation.

6. `I18n` specifies the i18n manager for the data validation object. By default, the validation componenet is `i18n` object.

7. `Data` specifies the data to be validated, which can be a map or struct.

8. `Rules` specifies the rules that used to pass custom validation rules for current chain operation, normally using `[]string` or `map` type.

9. `Messages` used to pass custom error messages for the current chain operation validation, often using a `map` type for passing.

Since the data validation object is also a very commonly used object, the `g` module defines the `Validator` method to quickly create a validation object. In most scenarios, we recommend using the `g` module's `g.Validator()` method to quickly create a validation object. For an introduction to the `g` module, please refer to the section: [Object Management](/docs/core-component/object-management).

## Examples

### Single Data Validation

```go
var (
    err error
    ctx = gctx.New()
)
err = g.Validator().
    Rules("min:18").
    Data(16).
    Messages("Under age is not allowed").
    Run(ctx)
fmt.Println(err.Error())

// Output:
// Under age is not allowed
```

```go
var (
    err  error
    ctx  = gctx.New()
    data = g.Map{
        "password": "123",
    }
)

err = g.Validator().Data("").Assoc(data).
    Rules("required-with:password").
    Messages("Please input your password").
    Run(ctx)

fmt.Println(err.Error())
```

### Struct Data Validation

```go
type User struct {
    Name string `v:"required#Please input your name"`
    Type int    `v:"required#Please select user type"`
}
var (
    err  error
    ctx  = gctx.New()
    user = User{}
    data = g.Map{
        "name": "john",
    }
)
if err = gconv.Scan(data, &user); err != nil {
    panic(err)
}
err = g.Validator().Assoc(data).Data(user).Run(ctx)
if err != nil {
    fmt.Println(err.(gvalid.Error).Items())
}

// Output:
// [map[Type:map[required:Please select user type]]]
```

### Map Data Validation

```go
params := map[string]interface{}{
    "passport":  "",
    "password":  "123456",
    "password2": "1234567",
}
rules := map[string]string{
    "passport":  "required|length:6,16",
    "password":  "required|length:6,16|same:password2",
    "password2": "required|length:6,16",
}
messages := map[string]interface{}{
    "passport": "account cannot be empty|account length should be between {min} and {max}",
    "password": map[string]string{
        "required": "password cannot be empty",
        "same":     "password verification failed",
    },
}
err := g.Validator().Messages(messages).Rules(rules).Data(params).Run(gctx.New())
if err != nil {
    g.Dump(err.Maps())
}
```

Output:

```bash
{
    "passport": {
        "length": "account length should be between 6 and 16",
        "required": "account cannot be empty"
    },
    "password": {
        "same": "password verification failed"
    }
}
```
