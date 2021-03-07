const results = [];

module.exports = {
  isEqual,
  finish
};

function isEqual(actual, expected, msg) {
  // unlike strings and numbers, if we construct two identical
  // arrays and compare them, they won't be considered equal
  const pass = actual === expected;
  results.push({ msg, expected, actual, pass });
}

function finish() {
  const fails = results.filter(r => !r.pass);

  results.forEach(r => {
    const icon = r.pass ? "\u{2705}" : "\u{274C}";
    console.log(`${icon}  ${r.msg}`);
  });

  console.log("\n");
  console.log(`${results.length} Tests`);
  console.log(`${results.length - fails.length} Passed`);
  console.log(`${fails.length} Failed`);
  console.log("\n");

  fails.forEach(f => {
    console.log(`\u{274C}  ${f.msg}
      expected:\t${f.expected}
      actual:\t${f.actual}`);
  });

  process.exitCode = fails.length ? 1 : 0;
}
