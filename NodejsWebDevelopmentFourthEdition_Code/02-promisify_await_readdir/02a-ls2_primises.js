const fs = require('fs').promises;

(async () =>
{
  let dir = '.';
  if (process.argv[2])
    dir = process.argv[2];

  const files = await fs.readdir(dir);
  for (let fn of files) {
    console.log(fn);
  }

})().catch(err => {
  console.error(err);
});
