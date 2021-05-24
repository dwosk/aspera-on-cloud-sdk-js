## aspera-on-cloud-sdk-js
The unofficial Aspera on Cloud SDK for Javascript.

## Installation
Install via npm
```
$ npm install aspera-on-cloud-sdk-js
```

## Usage
[Register an API client](https://ibmaspera.com/help/admin/organization/registering_an_api_client) via the Aspera on Cloud Admin application

```
import { AsperaOnCloud } from 'aspera-on-cloud-sdk-js'

const aoc = new AsperaOnCloud({ accessToken: 'ACCESS_TOKEN' });
aoc.api.workspaces.getWorkspaces()
  .then(res => console.log(res))
  .catch(err => console.error(err));

aoc.api.users.getUsers()
  .then(res => console.log(res))
  .catch(err => console.error(err));

aoc.api.nodes.getInformationonaSpecificNode('42')
  .then(res => console.log(res))
  .catch(err => console.error(err));

aoc.api.users.updateUser('7', { first_name: 'David' })
  .then(res => console.log(res))
  .catch(err => console.error(err));

// Using search params
aoc.api.users.getUsers({}, { query: { per_page: 1, page: 1 }})
  .then(res => console.log(res))
  .catch(err => console.error(err));
```

For more complete usage, check out the [Documentation](https://dwosk.github.io/aspera-on-cloud-sdk-js/interfaces/aspera_on_cloud.asperaoncloudapi.html) for detailed information about which functions are available.

### Examples
See [Examples][examples] for how to use the SDK to perform various tasks, including retrieving an OAuth access token. More on OAuth below:

#### OAuth
This SDK supports multiple application types and grant types for exchanging for an access token:
1. `authorization_code` flow ([example](examples/oauth/code/auth_code_with_backend.js)) - Recommended for apps that run a node backend web server and intend the user to authenticate via a browser.
2. `jwt-bearer` flow ([example](examples/oauth/jwt/jwt_bearer_flow.js)) - Recommended for browser-less experiences (such as a CLI) in which the app makes requests on behalf of the user.
3. `token` flow ([example](examples/oauth/token/token_flow.html)) - Simple, browser-based example to retrieve an access token. Your API integration may or may not support this.
4. `authorization_code` flow with PKCE - While this is recommended for performing OAuth2 in the user's browser or other public apps, Aspera On Cloud does not yet support the PKCE extension.

### Manual API calls
If you require an API call that is not supported by the SDK, you can use the `request` method to manually construct your own API call.

```
let axiosOptions = {
  method: 'POST'
  data: { ... }
};
aoc.request('/foo', axiosOptions)
  .then(res => console.log(res))
  .catch(err => console.error(err));
```

[examples]: https://github.com/dwosk/aspera-on-cloud-sdk-js/tree/develop/examples
