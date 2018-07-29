<h1 align="center">scripts</h1>

A set of scripts I've written (and used provably only once) to do tasks like
finding all ocurrences of different methods of a library in a project.

## Scripts

### `ramda-usage.js`

Count all Ramda methods used in a project (only the ones of the form `R.*`).

```
$ node scripts/ramda-usage --help
$ node scripts/ramda-usage -h
```

### `trim.js`

Trims all whitespace at the end of every line in a file.

```
$ node scripts/trim --help
$ node scripts/trim -h
```

_NOTE_: sed is better for this ¯\\\_(ツ)\_/¯

```
$ sed -i 's/ *$//' [file]
```

### `center-md-titles`

Center Markdown titles (using html elements).

```
$ node scripts/center-md-titles --help
$ node scripts/center-md-titles -h
```

_NOTE_: does not transform other MD in the title to HTML, i.e. won't work if the
title is, for example, in _italics_.
