# ORM Chain Operation - Handler Feature

The `Handler` feature in `GoFrame` allows you to easily reuse common logic across different queries and operations. This can help to simplify the code and avoid repetition, especially when dealing with complex filtering or pagination logic.

## Reusing Query Logic

You can define reusable functions for common filtering logic, and then use the `Handler` method to apply them to a model. Here are some examples:

```go
// Function that filters records with an amount greater than 1000
func AmountGreaterThan1000(m *gdb.Model) *gdb.Model {
    return m.WhereGT("amount", 1000)
}

// Function that filters records paid with a credit card
func PaidWithCreditCard(m *gdb.Model) *gdb.Model {
    return m.Where("pay_mode_sign", "credit_card")
}

// Function that filters records paid with cash on delivery (COD)
func PaidWithCod(m *gdb.Model) *gdb.Model {
    return m.Where("pay_mode_sign", "cod")
}

// Function that filters records by a list of statuses
func OrderStatus(statuses []string) func(m *gdb.Model) *gdb.Model {
    return func(m *gdb.Model) *gdb.Model {
        return m.Where("status", statuses)
    }
}

// Create a new model instance for "product_order"
var (
    m = g.Model("product_order")
)

// Applying handlers to filter orders with amount greater than 1000 and paid with credit card
m.Handler(AmountGreaterThan1000, PaidWithCreditCard).Scan(&orders)
// SQL: SELECT * FROM `product_order` WHERE `amount`>1000 AND `pay_mode_sign`='credit_card'
// Finds all orders with an amount greater than 1000 that were paid with a credit card

// Applying handlers to filter orders with amount greater than 1000 and paid with COD
m.Handler(AmountGreaterThan1000, PaidWithCod).Scan(&orders)
// SQL: SELECT * FROM `product_order` WHERE `amount`>1000 AND `pay_mode_sign`='cod'
// Finds all orders with an amount greater than 1000 that were paid with COD

// Applying handlers to filter orders with amount greater than 1000 and statuses "paid" or "shipped"
m.Handler(AmountGreaterThan1000, OrderStatus([]string{"paid", "shipped"})).Scan(&orders)
// SQL: SELECT * FROM `product_order` WHERE `amount`>1000 AND `status` IN('paid','shipped')
// Finds all orders with an amount greater than 1000 that are either paid or shipped
```

## Pagination

You can also define a reusable function for pagination that reads from an HTTP request and applies pagination settings to a model:

```go
// Function that applies pagination settings from an HTTP request
func Paginate(r *ghttp.Request) func(m *gdb.Model) *gdb.Model {
    return func(m *gdb.Model) *gdb.Model {
        type Pagination struct {
            Page int
            Size int
        }
        var pagination Pagination
        _ = r.Parse(&pagination)
        switch {
        case pagination.Size > 100:
            pagination.Size = 100
        case pagination.Size <= 0:
            pagination.Size = 10
        }
        return m.Page(pagination.Page, pagination.Size)
    }
}

// Applying the Paginate handler to different models
m.Handler(Paginate(r)).Scan(&users)
m.Handler(Paginate(r)).Scan(&articles)
```
