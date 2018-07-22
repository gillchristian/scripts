<h1 align="center">scripts</h1>

A set of scripts I've written (and used provably only once) to do tasks like
finding all ocurrences of different methods of a library in a project.

## Scripts

### `ramda-usage.js`

Count all Ramda methods used in a project (only the ones of the form `R.*`).

```
$ node ramda-usage --help
$ node ramda-usage -h
```

### `trim.js`

Trims all whitespace at the end of every line in a file.

```
$ node trim --help
$ node trim -h
```

_NOTE_: sed is better for this ¯\\\_(ツ)\_/¯

```
$ sed -i 's/ *$//' [file]
```
