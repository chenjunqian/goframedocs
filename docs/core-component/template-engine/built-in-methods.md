# Template Engine - Built-in Methods

## plus

- Description: Adds two values.
- Syntax: `{{.value1 | plus .value2}}`
- Example: `{{2 | plus 3}} => 5` (equivalent to `3 + 2`)

## minus

- Description: Subtracts the second value from the first.
- Syntax: `{{.value1 | minus .value2}}`
- Example: `{{2 | minus 3}} => 1` (equivalent to `3 - 2`)

## times

- Description: Multiplies two values.
- Syntax: `{{.value1 | times .value2}}`
- Example: `{{2 | times 3}} => 6` (equivalent to `3 * 2`)

## divide

- Description: Divides the first value by the second.
- Syntax: `{{.value1 | divide .value2}}`
- Example: `{{2 | divide 3}} => 1.5` (equivalent to `3 / 2`)

## String Processing Functions

## text

- Description: Removes HTML tags from a variable, only displaying the text content (also removes `<script>` tags).
- Syntax: `{{.value | text}}`
- Example: `{{"<div>Test</div>"|text}}`  
  Output: `Test`

## htmlencode

alias: encode, html

- Description: Encodes a variable's value as HTML.
- Syntax: `{{.value | htmlencode}}`, `{{.value | encode}}`, `{{.value | html}}`
- Example: `{{"<div>Test</div>"|html}}`  
  Output: `&lt;div&gt;Test&lt;/div&gt;`

## htmldecode

alias: decode

- Description: Decodes an HTML-encoded variable's value.
- Syntax: `{{.value | htmldecode}}`, `{{.value | decode}}`
- Example: `{{"&lt;div&gt;Test&lt;/div&gt;" | htmldecode}}`  
  Output: `<div>Test</div>`

## urlencode

alias: url

- Description: Encodes a URL string.
- Syntax: `{{.url | url}}`
- Example: `{{"https://goframe.org" | url}}`  
  Output: `https%3A%2F%2Fgoframe.org`

## urldecode

- Description: Decodes a URL-encoded string.
- Syntax: `{{.url | urldecode}}`
- Example: `{{"https%3A%2F%2Fgoframe.org"|urldecode}}`  
  Output: `https://goframe.org`

## date

- Description: Formats a timestamp variable into a date string, similar to PHP's `date` function. If the timestamp is empty (or 0), the current time is used.
- Syntax: `{{.timestamp | date .format}}`, `{{date .format .timestamp}}`, `{{date .format}}`
- Example:

  ```go
  {{1540822968 | date "Y-m-d"}}
  {{date "Y-m-d H:i:s"}}
  ```

  Outputs:

- `2018-10-29`
- `2018-12-05 10:22:00`

## compare

- Description: Compares two strings and returns:
  - `0`: if the strings are equal
  - `1`: if the first string is greater
  - `-1`: if the first string is less
- Syntax: `{{compare .str1 .str2}}`, `{{.str2 | compare .str1}}`
- Example:

  ```go
  {{compare "A" "B"}} // Output: -1
  {{compare 2 1}}     // Output: 1
  {{compare 1 1}}     // Output: 0
  ```

## replace

- Description: Replaces occurrences of `search` in `str` with `replace`.
- Syntax: `{{.str | replace .search .replace}}`, `{{replace .search .replace .str}}`
- Example: `{{"I'm Chinese" | replace "I'm" "I am"}}`  
  Output: `I am Chinese`

## substr

- Description: Extracts a substring from `str` starting at `start` index for `length` characters.
- Syntax: `{{.str | substr .start .length}}`, `{{substr .start .length .str}}`
- Example:

  ```go
  {{ "I am Chinese" | substr 2 -1 }} // Output: "am Chinese"
  {{ "I am Chinese" | substr 2  2 }} // Output: "am"
  ```

## strlimit

- Description: Truncates `str` to `length` characters and appends `suffix` if the length is exceeded.
- Syntax: `{{.str | strlimit .length .suffix}}`
- Example: `{{"I am Chinese" | strlimit 2  "..."}}`  
  Output: `I ...`

## concat

- Description: Concatenates multiple strings.
- Syntax: `{{concat .str1 .str2 .str3...}}`
- Example: `{{concat "I" "am" "Chinese"}}`  
  Output: `I am Chinese`

## hidestr

- Description: Hides characters in `str` by a specified `percent` from the middle outward, using `hide` as the replacement character. Useful for hiding sensitive information like names, phone numbers, email addresses, etc.
- Syntax: `{{.str | hidestr .percent .hide}}`
- Example:

  ```go
  {{ "LoveGF, LoveLife" | hidestr 20 "*" }}  // Output: "LoveGF*LoveLife"
  {{ "LoveGF, LoveLife" | hidestr 50 "*" }}  // Output: "Love****Life"
  ```

## highlight

- Description: Highlights occurrences of `key` in `str` using the specified `color`.
- Syntax: `{{.str | highlight .key .color}}`
- Example: `{{"LoveGF, LoveLife" | highlight "GF" "red"}}`  
  Output: `Love<span style="color:red;">GF</span>, LoveLife`

## toupper and tolower

- Description: Converts `str` to uppercase (`toupper`) or lowercase (`tolower`).
- Syntax: `{{.str | toupper}}`, `{{.str | tolower}}`
- Example:

  ```go
  {{ "gf" | toupper }} // Output: GF
  {{ "GF" | tolower }} // Output: gf
  ```

## nl2br

- Description: Converts newlines (`\n`) and carriage returns (`\r`) in `str` to `<br />` HTML tags.
- Syntax: `{{.str | nl2br}}`
- Example: `{{"Go\nFrame" | nl2br}}`  
  Output: `Go<br />Frame`

## dump

- Description: Dumps the contents of a variable, similar to the `g.Dump` method, mainly used for debugging.
- Syntax: `{{dump .var}}`
- Example:

  ```go
  gview.Assign("var", g.Map{
      "name" : "john",
  })
  {{dump .var}}
  ```

  Output:

  ```html
  <!--
  {
      name: "john"
  }
  -->
  ```

## map

- Description: Converts a template variable to a `map[string]interface{}` type, useful for `range...end` loops.
- Syntax: `{{map .var}}`

## maps

- Description: Converts a template variable to a `[]map[string]interface{}` type, useful for `range...end` loops.
- Syntax: `{{maps .var}}`

## json/xml/ini/yaml/yamli/toml

- Description: Converts template variables to different formats:
  - `json`: JSON format
  - `xml`: XML format
  - `ini`: INI format
  - `yaml`: YAML format
  - `yamli`: YAML format with custom indentation
  - `toml`: TOML format
- Syntax:

  ```go
  {{json .var}}
  {{xml .var}}
  {{ini .var}}
  {{yaml .var}}
  {{yamli .var .indent}}
  {{toml .var}}
  ```
