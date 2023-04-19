/* eslint-disable no-console *//* eslint-disable prettier/prettier */
const Binance = require('node-binance-api');
const https = require('https');
// binance
const autoBinance = new Binance().options({
  APIKEY: 'TC5R07Eye0JZmDeDzinPPWoU17eoR0LdQaD6KQXyO96zhsffZCeHiDhXk6BWUb7X',
  APISECRET: 'zFqAPcJsSjvr8QkvS7Fu73d1jmDywHdOYlYtB97pcY4uaI3Gsxe3OmJL0dz5zN3m',
});

const binanceAutoConnect = async () => {
  console.log("binance connecting")
  // const responseType = 'code';
  // const clientId = 'TC5R07Eye0JZmDeDzinPPWoU17eoR0LdQaD6KQXyO96zhsffZCeHiDhXk6BWUb7X';
  // // const redirectUri = 'https%3A%2F%2Fdev.blackalgo.com%2Fv1%2Fbinance';
  // const redirectUri = 'http%3A%2F%2Flocalhost%3A3000%2Fv1%2Fbinance';
  // const csrfToken = user._id;
  // const scope = user:email,user:address;
//  const testUri = `http%3A%2F%2Flocalhost%3A4000%2Fcompletion`
  // const apiUrl = `https://accounts.binance.com/en/oauth/authorize?response_type=${responseType}&client_id=${clientId}&redirect_uri=${redirectUri}&scope=account%3Astatus%2Ccreate%3Aapikey%2Cuser%3AopenId%2Cuser%3Aemail`;
  const apiUrlTest= `https://accounts.binance.com/en/oauth/authorize?response_type=code&client_id=wpKNiPLtNG&redirect_uri=http%3A%2F%2Flocalhost%3A4000%2Fcompletion&scope=email`
  const apiUrl = `https://accounts.binance.com/en/oauth/authorize?response_type=code&client_id=wpKNiPLtNG&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fv1%2Fbinance&scope=account%3Astatus%2Ccreate%3Aapikey%2Cuser%3AopenId%2Cuser%3Aemail`;
  https
    .get(apiUrlTest, (response) => {
      let data = '';
      response.on('data', (chunk) => {
        data += chunk;
      });
      response.on('end', () => {
        // eslint-disable-next-line no-console
        console.log(data);
        return data;
      });
    })
    .on('error', (error) => {
      // eslint-disable-next-line no-console
      console.error(error);
    });
};

const loginBinanceManually = async (reqData) => {
    const binance = new Binance().options({
        APIKEY: reqData.apiBinanceKey,
        APISECRET: reqData.binanceSecret,
      });
      
    console.info( await binance.futuresPrices() );
};

module.exports = {
  binanceAutoConnect,
  autoBinance,
  loginBinanceManually,
};
