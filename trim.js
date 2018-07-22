const { readFile, writeFile } = require('fs');

const args = process.argv.slice(2);

const [file, target] = args;

if (args.includes('-h') || args.includes('--help')) {
  showHelp();
} else if (file) {
  main({ file, target });
} else {
  showHelp();
}

function main({ file, target }) {
  const targetFile = target || file;

  readFile(file, 'utf-8', (err, data) => {
    if (err) {
      console.log(err.message);
      process.exit(1);
      return;
    }

    const updated = data
      .split('\n')
      .map(l => l.trimRight())
      .join('\n');

    if (updated === data) {
      console.log('Nothing to trim!');
      process.exit(0);
      return;
    }

    writeFile(targetFile, updated, err => {
      if (err) {
        console.log(err.message);
        process.exit(1);
        return;
      }

      if (file === targetFile) {
        console.log(`${file} trimmed and saved!`);
      } else {
        console.log(`${file} trimmed and saved to ${targetFile}!`);
      }
    });
  });
}

function showHelp() {
  console.log(`
  Trim whitespace at the end of every line in file [file].
  If [target-file] is provided content will be written there,
  otherwise [file] will be overridden.

  USAGE:

    $ node trim.js [file] [target-file]
  
  PRO TIP: The same can bi achieved with sed

    $ sed -i 's/ *$//' [file]
    $ sed -i.bak 's/ *$//' [file] # saves a backup in [file].bak`);
}
