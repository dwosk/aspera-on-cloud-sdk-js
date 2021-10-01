const { AsperaOnCloud } = require('../../../dist/cjs/index');
const fs = require('fs');

/**
 * Insert your API client integration settings here as specified
 * in the Aspera On Cloud Admin app.
 *
 * id - client id of your API client
 * secret - client secret of your API client
 * org - the organization or subdomain that your API client belongs to
 * email - the email of the user associated with the private key
 * privateKey - path to the private key (relative to where you invoke this script from)
 * scope - desired grant access for the access token
 */
const CLIENT = {
  id: 'CLIENT_ID',
  secret: 'CLIENT_SECRET',
  org: 'ORG',
  email: 'EMAIL',
  privateKey: 'PATH_TO_PRIVATE_KEY',
  scope: ['user:all']
};

const aoc = new AsperaOnCloud({
  clientId: CLIENT.id,
  clientSecret: CLIENT.secret,
  org: CLIENT.org
});

const privateKey = fs.readFileSync(CLIENT.privateKey);

(async () => {
  const token = await aoc.auth.getAccessTokenWithJwt(CLIENT.email, privateKey, CLIENT.scope);
  console.log(token.data);

  aoc.auth.setAccessToken(token.data.access_token);

  const user = await aoc.api.users.getUsers({}, { query: { per_page: 1 }});
  console.log(user.data);
})();
