const yargs = require('yargs');
const axios = require('axios');

const argv = yargs
  .options({
    a: {
      demand: true,
      alias: 'address',
      describe: 'Address to fetch weather for',
      string: true
    }
  })
  .help()
  .alias('help', 'h')
  .argv;


let encodedAddress = encodeURIComponent(argv.address);
let geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}`;

axios.get(geocodeUrl)
    .then((response) => {
      if (response.data.status === 'ZERO_RESULTS')
        throw new Error('Unable to find that address.');

      let lat = response.data.results[0].geometry.location.lat;
      let lng = response.data.results[0].geometry.location.lng;
      let weatherUrl = `https://api.forecast.io/forecast/4a04d1c42fd9d32c97a2c291a32d5e2d/${lat},${lng}`;

      console.log(response.data.results[0].formatted_address);
      return axios.get(weatherUrl);

    }).then((response) => {
      let temperature = response.data.currently.temperature;
      let apparentTemperature = response.data.currently.apparentTemperature;

      console.log(`It's currently ${temperature}. It feels like ${apparentTemperature}`);

    }).catch((e) => {
      if (e.code === 'ENOTFOUND')
        console.log('Unable to connect to API servers.');
      else
        console.log(e.message);
    });
