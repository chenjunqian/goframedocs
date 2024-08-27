# Template Engine - Tags

The GoFrame template engine uses `{{` and `}}` as the default delimiters for templates. Developers can customize the template delimiters using the `gview.SetDelimiters` method.

## Accessing Values

- Use `.` to access the current object's value (local template variables).
- Use `$` to reference the global context of the current template (global template variables).
- Use `$var` to access specific template variables.

## Supported Go Symbols in Templates

- `{{"string"}}` — General string
- `{{`raw string`}}` — Raw string
- `{{'c'}}` — Byte
- `{{print nil}}` — `nil` is also supported

## Template Pipelines

Pipelines can be used to output context variables or return values passed through functions:

```go
{{. | FuncA | FuncB | FuncC}}
```

If the pipeline value is:

- `false` or `0`
- `nil` pointer or `interface`
- An array, slice, map, or string with length 0

Then, this pipeline is considered empty.

**Note:** In the GoFrame template engine, if a specified variable in the template does not exist, it will be displayed as empty (unlike the standard library template engine, which displays `<no value>`).

## Conditional Statements

### if else end

```go
{{if pipeline}}...{{end}}
```

When `pipeline` is empty, it is equivalent to `false`.

### Nested Conditions

```go
{{if .condition}}
    ...
{{else}}
    {{if .condition2}}
        ...
    {{end}}
{{end}}
```

You can also use `else if`:

```go
{{if .condition}}
    ...
{{else if .condition2}}
    ...
{{else}}
    ...
{{end}}
```

## Range end

```go
{{range pipeline}} {{.}} {{end}}
```

Supported types for `pipeline` include slice, map, and channel.

**Note:** Inside a `range` loop, the `.` symbol is overridden to represent elements of the above types (local variables). To access external (global) variables in the loop, use the `$` symbol, e.g., `{{$.Session.Name}}`.

If the corresponding value's length is 0, the `range` loop will not execute, and `.` will not change.

### Iterating Over a Map

```go
{{range $key, $value := .MapContent}}
    {{$key}}: {{$value}}
{{end}}
```

### Iterating Over a Slice

```go
{{range $index, $elem := .SliceContent}}
    {{range $key, $value := $elem}}
        {{$key}}: {{$value}}
    {{end}}
{{end}}
```

## with end

```go
{{with pipeline}}...{{end}}
```

`with` is used to redirect the `pipeline`:

```go
{{with .Field.NestField.SubField}}
    {{.Var}}
{{end}}
```

## define

`define` is used to define a block of template content with a name, allowing for module definition and template nesting (used in the `template` tag).

```go
{{define "loop"}}
    <li>{{.Name}}</li>
{{end}}
```

Here, `loop` is the name of the template block. You can use the `template` tag to call this template:

```go
<ul>
    {{range .Items}}
        {{template "loop" .}}
    {{end}}
</ul>
```

The `define` tag must be used with the `template` tag and supports cross-template usage (valid within the same template directory/subdirectories, as it uses the `ParseFiles` method to parse template files).

## template

```go
{{template "templateName" pipeline}}
```

Pass the context `pipeline` to the template for usage within it.

**Note:** The `template` tag parameter is the template name, not the template file path. The `template` tag does not support template file paths.

## include

This tag is newly added to the GoFrame framework's template engine:

```go
{{include "templateFileName.ext" pipeline}}
```

Use the `include` tag to load other templates (from any path). Template filenames support relative paths as well as absolute system paths. To pass the current template's variables to a sub-template (nested template), you can do:

```go
{{include "templateFileName.ext" .}}
```

**Difference from `template` tag:** `include` only supports file paths and does not support template names; `template` tag only supports template names and does not support file paths.

## Comments

Multi-line text comments are allowed, but nesting is not supported.

```go
{{/*
comment content
support new line
*/}}
```

## Removing Whitespace

To remove whitespace, use:

- `{{-` to trim whitespace from the left side of the template content
- `-}}` to trim whitespace from the right side of the template content

**Note:** The `-` should be directly next to `{{` and `}}`, and there should be a space between `-` and the template value.

```go
{{- .Name -}}

{{- range $key, $value := .list}}
  "{{$value}}"
{{- end}}
```

## Additional Resources

- [template package - html/template - Go Packages](https://pkg.go.dev/pkg/html/template)
- [template package - text/template - Go Packages](https://pkg.go.dev/pkg/text/template)
