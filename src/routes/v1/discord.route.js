// /* eslint-disable import/no-extraneous-dependencies */
// const express = require('express');
// const fetch = require('node-fetch');
// const { URLSearchParams } = require('url');

// const app = express();

// const config = {
//   clientId: '1100680502714843216',
//   clientSecret: 'yf3uYHVnmAVMXX_froy3iBpk11saN6Oi',
//   redirectUri: 'http://localhost:4000/completion',
// };

// app.get('/discord', (request, response) => {
//   response.send(
//     'login with discord: <a href=`https://discord.com/api/oauth2/authorize?client_id=1100680502714843216&redirect_uri=http%3A%2F%2Flocalhost%3A4000%2Fcompletion&response_type=code&scope=identify%20email`>login</a>'
//   );
// });

// app.get('/authorize', (request, response) => {
//   const { code } = request.query;
//   const params = new URLSearchParams();
//   params.append('client_id', config.clientId);
//   params.append('client_secret', config.clientSecret);
//   params.append('grant_type', 'authorization_code');
//   params.append('code', code);
//   params.append('redirect_uri', config.redirectUri);
//   fetch(`https://discord.com/api/oauth2/token`, {
//     method: 'POST',
//     body: params,
//   }).then((res) => {
//     const result = res.json();
//     response.send('logged in', result);
//   });
// });
