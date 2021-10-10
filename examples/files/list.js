const { AsperaOnCloud } = require('../../dist/cjs/index');
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
  org: CLIENT.org,
  apiServer: 'api.qa.ibmaspera.com'
});

const privateKey = fs.readFileSync(CLIENT.privateKey);

(async () => {
  // Get access token for Aspera On Cloud API access
  const token = await aoc.auth.getAccessTokenWithJwt(CLIENT.email, privateKey, CLIENT.scope);
  const { access_token: aocAccessToken } = token.data;
  console.log(`
    AoC Access Token: ${aocAccessToken}
  `);
  aoc.auth.setAccessToken(aocAccessToken);

  // Get user's default node id
  const self = await aoc.getSelf();
  const { home_node_id, home_file_id } = self.data;

  // Get node info
  const node = await aoc.api.nodes.getInformationonaSpecificNode({ id: home_node_id });
  const { access_key, host } = node.data;

  // Get access token for Node API access
  const nodeApiToken = await aoc.auth.getAccessTokenWithJwt(CLIENT.email, privateKey, [`node.${access_key}:user:all`]);
  const { access_token: nodeAccessToken } = nodeApiToken.data;
  console.log(`
    User Home File Id: ${home_file_id}
    Node Access Key: ${access_key}
    Node API Access Token: ${nodeAccessToken}
    Host: ${host}
  `);

  // List files in user's home directory
  let options = {
    baseUrl: `https://${host}`,
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${nodeAccessToken}`,
      'X-Aspera-AccessKey': access_key
    }
  };

  const files = await aoc.request(`/files/${home_file_id}/files`, options)
  files.data.forEach(file => {
    console.log(file.name);
  })
})();
