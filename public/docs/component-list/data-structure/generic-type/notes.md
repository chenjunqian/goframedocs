# Generic Type- Notes

## Important Notes

Although the framework provides generic types to significantly improve development simplicity, they should be used with caution for business models and not be overused. This is because generic types can obscure the real data types, which can be more detrimental than beneficial for the long-term maintenance of business projects, especially complex ones. The data types of business models should be as explicit, meaningful, and immutable as possible to leverage the advantages of a compiled language for type checking and optimization during the compilation phase and to facilitate long-term business maintenance.

## Example

Below is a real-world business model case provided by a community member:

```go
type MiDispatchData struct {
    Status      *g.Var `json:"status"`
    BrandId     *g.Var `json:"brand_id"`
    AreaId      *g.Var `json:"area_id"`
    Year        *g.Var `json:"year"`
    Month       *g.Var `json:"month"`
    Day         *g.Var `json:"day"`
    Hour        *g.Var `json:"hour"`
    RequestTime *g.Var `json:"request_time"`
    Source      *g.Var `json:"source"`
    BikeId      *g.Var `json:"bike_id"`
    BikeType    *g.Var `json:"bike_type"`
    Lon         *g.Var `json:"lon"`
    Lat         *g.Var `json:"lat"`
    SiteId      *g.Var `json:"site_id"`
    BikeMac     *g.Var `json:"bike_mac"`
}
```

While this approach allows the program to run correctly and covers the business scenarios, it loses the advantages of a compiled language’s compiler (similar to how PHP handles variables). In later stages of project maintenance, it becomes difficult to determine the data types of fields.

## Usage Recommendations

- Generic types are frequently used in basic components and middleware projects.
- If a field has multiple meanings or types in business scenarios, generics can be used instead of types like `interface{}`.
