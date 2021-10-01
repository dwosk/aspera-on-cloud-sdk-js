/*
  This example demonstrates how to get an OAuth2 access token using a simple node
  backend server using the code flow.

  Once the server is started, navigate to https://localhost:3000 in the browser. You
  should be redirected to the OAuth2 URL after which the server will be given the
  authorization_code which will be exchanged for the access token.
*/
const express = require('express');
const app = express();
const https = require('https');
const fs = require('fs');
const { AsperaOnCloud } = require('../../../dist/cjs/index');
const port = 3000;

/**
 * Insert your API client integration settings here as specified
 * in the Aspera On Cloud Admin app.
 *
 * id - client id of your API client
 * secret - client secret of your API client
 * org - the organization or subdomain that your API client belongs to
 * scope - desired grant access for the access token
 */
const CLIENT = {
  id: 'CLIENT_ID',
  secret: 'CLIENT_SECRET',
  org: 'ORG',
  scope: ['admin-user:all', 'user:all']
};

const options = {
  clientId: CLIENT.id,
  clientSecret: CLIENT.secret,
  org: CLIENT.org,
  redirectUri: 'https://localhost:3000'
};
const aoc = new AsperaOnCloud(options);

app.get('/', async (req, res) => {
  const { code } = req.query;

  if (code) {
    try {
      const tokenResponse = await aoc.auth.getAccessTokenWithCode(code, CLIENT.scope)
      const { access_token } = tokenResponse.data;
      console.log('Access Token:', access_token);

      aoc.auth.setAccessToken(access_token);

      const self = await aoc.getSelf();
      console.log('Current user:', self.data);
    } catch (err) {
      console.error(err);
    }
  } else {
    const url = aoc.auth.getOauthUrl(undefined, CLIENT.scope)
    // Specify the URL to redirect the page to
    res.writeHead(302, { Location: url });
    res.end();
  }
});

const httpsOptions = {
  key: fs.readFileSync('./examples/localhost-key.pem'),
  cert: fs.readFileSync('./examples/localhost.pem')
};
const server = https.createServer(httpsOptions, app).listen(port, () => {
  console.log('Express server running at https://localhost:' + port);
});
