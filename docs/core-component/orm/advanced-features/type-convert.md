# Advanced ORM Features - Type Conversion

## Introduction

The `gdb` data record result (`Value`) supports flexible type conversion and is built with support for converting to dozens of commonly used data types.

The `Value` type is an alias for the `*gvar.Var` type, allowing you to use all conversion methods provided by the `gvar.Var` data type. For more details, see the chapter on [Generic Types - gvar](/docs/component-list/data-structure/gvar).

## Example Usage

First, the table definition is as follows:

```sql
-- Goods Table
CREATE TABLE `goods` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(300) NOT NULL COMMENT 'Product Name',
  `price` decimal(10,2) NOT NULL COMMENT 'Product Price',
  ...
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;
```

Next, the data in the table is as follows:

```bash
| id | title   | price   |
|----|---------|---------|
| 1  | IPhoneX | 5999.99 |
```

Finally, here is the sample code:

```go
if r, err := g.Model("goods").FindOne(1); err == nil {
    fmt.Printf("goods    id: %d\n",   r["id"].Int())
    fmt.Printf("goods title: %s\n",   r["title"].String())
    fmt.Printf("goods price: %.2f\n", r["price"].Float32())
} else {
    g.Log().Error(gctx.New(), err)
}
```

## Execution Result

After execution, the output is:

```bash
goods    id: 1
goods title: IPhoneX
goods price: 5999.99
```
