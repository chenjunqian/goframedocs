# CLI - Basic Concept

## Arguments

Program command lines are passed in order, and data without a name identifier is called an `argument`. The input of arguments has sequentiality.

## Options

Controlling the program logic with additional input and having a name identifier is called an `Option`. `Option` names are prefixed with - or --, and options are unordered, which means they can be placed at any position in the command line. Options can carry data or be without data. In other similar third-party functional components, the function of options is similar to that of a `flag`.

In addition, according to traditional command-line management habits, options can be set with abbreviated aliases (`Short`) to simplify the input of command-line arguments. Abbreviated aliases are often set to a single letter.

## Options Position and `=` Sign

The `gcmd` component supports the arbitrary position of options in the command line, which means the following command line option inputs actually have the same meaning:

```bash
gf build main.go -a amd64 -o linux -n app -yes
gf -a amd64 -o linux build main.go -yes -n app
gf -yes -n app build -o linux -a amd64 main.go
```

- `gf`/`build`/`main.go` are arguments with indexes `0`, `1`, and `2`, respectively, because arguments are sequential, no matter how the command line is modified, the order of these three cannot be changed.

- `a`/`o`/`n` are options with data; since they are order-independent, data is retrieved by option names, so they can be placed arbitrarily.

- `yes` is an option without data and can also be placed arbitrarily.

Options and data in the command line can be connected by a space or by an equals sign `=`, for example:

```bash
gf build main.go -a=amd64 -o=linux -n=app -yes
```

## Default Parse Rules

Due to the `gcmd` module providing some functions for obtaining the default command-line parsing rules, arguments and options will be automatically recognized under the default rules.

### Command-Line Arguments with `=` Sign

```bash
gf build main.go -a=amd64 -o=linux -n=app -yes
```

Default rules:

- `gf`/`build`/`main.go` are arguments with indexes `0`, `1`, and `2`

- `a`/`o`/`n`/`yes` are options, and `yes` is an option without data

### Command-Line Arguments without `=` Sign

```bash
gf build main.go -a amd64 -o linux -n app -yes
```

Default rules:

- `gf`/`build`/`main.go` are arguments with indexes `0`, `1`, and `2`

- `a`/`o`/`n`/`yes` are options, and `yes` is an option without data
