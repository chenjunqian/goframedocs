# Data Validation

## Overview

The `Goframe` framework provides a powerful, convenient, and easily extendable `data/form` validation component, implemented by the gvalid component. The `gvalid` component implements robust data validation functionality, with built-in dozens of commonly used validation rules. It supports single data multi-rule validation, multi-data multi-rule batch validation, custom error messages, custom regular expression validation, custom validation rule registration, support for `i18n` internationalization processing, and support for `struct tag` rule and prompt message binding, and other features. It is currently the most powerful `Go` data validation module.

Data validation design is inspired by the classic `PHP Laravel` framework: <https://laravel.com/docs/8.x/validation>. Thank you, Laravel.

## Usage

```go
import "github.com/gogf/gf/v2/util/gvalid"
```

Package documentation: <https://pkg.go.dev/github.com/gogf/gf/v2/util/gvalid>

## Component Feature

The `gvalid` component has the following features:

- Built-in dozens of common data validation rules, supporting most business scenarios

- Supports automated validation for `Server` layer and `command-line` components

- Supports validation of basic types and complex object types

- Supports sequential validation and flexible handling of validation results

- Supports custom validation error messages

- Supports recursive validation of struct attributes

- Supports custom validation rules

- Supports `I18n` internationalization features
