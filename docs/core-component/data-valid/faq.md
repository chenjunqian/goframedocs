# Data Validation - FAQ

## Impact of Struct Default Values on the required Validation Rule

Default values of `struct` properties can sometimes cause the `required` validation rule to fail. For example:

```go
type User struct {
    Name string `v:"required"`
    Age  uint   `v:"required"`
}
```

In the validation of this struct, the `required` validation for the `Age` property will not work as expected because `Age` will default to `0` even if it is not provided.

There are 3 solutions to this issue:

1. **Change Property to Pointer Type**: Alter the property to a pointer type, such as `*int`, `*float64`, `*g.Var`, etc. The default value of a pointer is `nil`, which helps to circumvent this problem.

2. **Use Composite Validation Rules**: Compensate for the impact of default values on the `required` rule by using a composite validation rule. For instance, in the example above, changing the validation rule for the `Age` property to `required|min:1` will achieve the desired business validation effect.

3. **Use the Assoc Method for Struct Validation**: Employ the `Assoc` method for `struct` validation to set associated validation parameters. When validating struct-type parameters, the parameter values will be based on those provided in the `Assoc` method. If using the framework's Server with structured API input and output (e.g., `XxxReq/XxxRes`), the Server will automatically call `Assoc` for validation, so developers do not need to worry about the impact of default values. For more information, see the [Data Validation - Types](/docs/core-component/data-valid/types#struct-association).
