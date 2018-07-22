const fs = require('fs');
const { promisify } = require('util');

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

const args = process.argv.slice(2);

const [entry, output] = args[0];

if (args.includes('-h') || args.includes('--help')) {
  showHelp();
} else if (entry) {
  main(entry, output);
} else {
  showHelp();
}

function main(entryFile, outputFile) {
  const shouldWrite = Boolean(outputFile);

  readFile(entryFile, 'utf-8')
    .then(text =>
      text
        .split('\n')
        .map(l => l.match(/R\.[a-zA-Z_]+/g))
        .filter(l => Boolean(l))
        .reduce((acc, cur) => acc.concat(cur), [])
        .reduce((acc, cur) => {
          acc[cur] = (acc[cur] || 0) + 1;
          return acc;
        }, {}),
    )
    .then(withCount => Object.entries(withCount).sort((a, b) => b[1] - a[1]))
    .then(sorted => (shouldWrite ? tableReport(sorted) : textReport(sorted)))
    .then(report => report.replace(/\n$/, ''))
    .then(report => {
      if (shouldWrite) {
        return writeFile(outputFile, report).then(() =>
          console.log(`Report written to "${outputFile}"`),
        );
      }
      console.log(report);
      return Promise.resolve();
    })
    .catch(e => {
      console.error(e);

      process.exit(1);
    });
}

function tableReport(sorted) {
  const reducer = (acc, [key, value]) =>
    `${acc}|[${key}](https://ramdajs.com/docs/#${key.replace(
      'R.',
      '',
    )})|${value}|\n`;

  return sorted.reduce(reducer, '|Function|Times|\n|--------|-----|\n');
}

function findLongest(sorted) {
  return sorted.reduce((acc, [fn]) => (fn.length > acc ? fn.length : acc), 0);
}

function textReport(sorted) {
  const longest = findLongest(sorted);
  const reducer = (acc, [fn, count]) =>
    `${acc}${fn.padEnd(longest, ' ')} ${`${count}`.padStart(3, ' ')}\n`;

  return sorted.reduce(reducer, '');
}

function showHelp() {
  console.log(`
  List all ocurrences of "R.*" in [entry-file] file.
  If \`output-file\` is provided, it will write a MD table
  with the report, otherwise it will write to the terminal.

  USAGE:

    $ node ramda-report.js [entry-file] [output-file]

  PRO TIP: To get all the "R.*" in a file, run the following:

    $ git-grep 'R\\.' <directory-path>`);
}
