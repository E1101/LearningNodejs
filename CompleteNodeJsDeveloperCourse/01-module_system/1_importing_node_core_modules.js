const fs = require('fs');

fs.appendFileSync('note.txt',
    'Hey, My name is Payam.'
    + '\r\n'
    + 'I\'m about to change my career and becoming a NodeJS Developer.'
);
