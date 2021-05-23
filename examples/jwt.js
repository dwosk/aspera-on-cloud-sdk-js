const { AsperaOnCloud } = require('../dist/cjs/index');
const fs = require('fs');

/**
 * Insert the details for your Aspera on Cloud API client
 */
const CLIENT = {
  id: 'CLIENT_ID',
  secret: 'CLIENT_SECRET',
  org: 'ORG',
  email: 'EMAIL',
  privateKey: 'PATH_TO_PRIVATE_KEY'
};

const aoc = new AsperaOnCloud({
  clientId: CLIENT.id,
  clientSecret: CLIENT.secret,
  org: CLIENT.org,
  apiServer: CLIENT.apiServer
});

const privateKey = fs.readFileSync(CLIENT.privateKey);

(async () => {
  const token = await aoc.auth.getAccessTokenWithJwt(CLIENT.email, privateKey);
  console.log(token.data);

  aoc.auth.setAccessToken(token.data.access_token);

  const user = await aoc.api.users.getUsers({}, { query: { per_page: 1 }});
  console.log(user.data);
})();
