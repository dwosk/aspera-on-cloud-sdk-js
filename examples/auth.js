/*
  This example is meant to be run in a node environment. This can be extended to
  start a server listening over https://localhost:3000 in which the end user would visit
  https://localhost:3000 in the browser, authenticate, and the server would exchange
  the access code for an access token.
*/
const { AsperaOnCloud } = require('../dist/cjs/index.js');

// Setup: insert an access token here
const aoc = new AsperaOnCloud({
  accessToken: "ACCESS_TOKEN"
});

(async () => {
  const myself = await aoc.getSelf();
  console.log(myself);

  const user = await aoc.api.users.getUserById({ id: '27828' });
  console.log(user);

  const workspace = await aoc.api.workspaces.getWorkspaceById({ id: '453' });
  console.log(workspace);

  const nodes = await aoc.api.nodes.getaListingofAllNodes();
  console.log(nodes.data[0]);
})();
