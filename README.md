## aspera-on-cloud-sdk-js
The unofficial Aspera on Cloud SDK for Javascript.

This is a personal project and is not officially endorsed or supported by IBM Aspera.

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

See [Examples][examples] for how to perform browser-based authentication to retrieve an OAuth2 access token.

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
