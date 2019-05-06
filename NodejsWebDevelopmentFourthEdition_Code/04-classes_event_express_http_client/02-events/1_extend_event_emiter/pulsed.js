
const Pulser = require('./pulser');

// Instantiate 1_understand_async Pulser object
const pulser = new Pulser();

// Handler function
pulser.on('pulse', () => {
    console.log(`${new Date().toISOString()} pulse received`);
});

// Start it pulsing
pulser.start(); 
