const path = require('path');
const { readFile, writeFile } = require('fs');

const args = process.argv.slice(2);

const [file, size] = args;

if (args.includes('-h') || args.includes('--help')) {
  showHelp();
} else if (file) {
  main({ file, size });
} else {
  showHelp();
}

function main({ file, size }) {
  const [s, ok] = validateSize(size);
  if (!ok) {
    console.error(
      new Error('Invalid size. Valid ones are: 1, 2, 3, 4, 5 and 6'),
    );
    process.exit(1);
    return;
  }

  const headingMatcher = heading(s);
  const centerTitle = getTitleCenterer(s, headingMatcher);
  const filePath = path.resolve(process.cwd(), file);

  readFile(filePath, 'UTF-8', (err, content) => {
    if (err) {
      console.error(err.message);
      process.exit(1);
      return;
    }

    const updated = content
      .split('\n')
      .map(transformTitles(centerTitle, headingMatcher))
      .join('\n');

    writeFile(filePath, updated, 'UTF-8', err => {
      if (err) {
        console.error(err.message);
        process.exit(1);
      }
    });
  });
}

function showHelp() {
  console.log(`
  Replace headings in a MD file with the centered version (using html elems).

  USAGE:

    $ node scripts/center-md-titles.js [file] [size]
  
  [size] can be 1, 2, 3, 4, 5, 6 (Default 2)`);
}

function heading(size) {
  return new Array(size)
    .fill('#', 0, size)
    .join('')
    .concat(' ');
}

function getTitleCenterer(size, headingMatcher) {
  return l =>
    `<h${size} align="center">${l.replace(headingMatcher, '')}</h${size}>`;
}

function transformTitles(centerTitle, headingMatcher) {
  return l => (l.startsWith(headingMatcher) ? centerTitle(l) : l);
}

function validateSize(size) {
  if (!size) {
    return [2, true];
  }

  return [parseInt(size, 10), ['1', '2', '3', '4', '5', '6'].includes(size)];
}
