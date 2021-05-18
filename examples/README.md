## aspera-on-cloud-sdk-js Examples
To run the example, do the following:
1. [Register an API client](https://ibmaspera.com/help/admin/organization/registering_an_api_client) via the Aspera on Cloud Admin application using `https://localhost:3000` as the redirect uri
2. `npm install` to install the project dependencies and then `npm run build`
3. `cd` into this directory
4. `npm install` the test dependencies
5. Update `auth.html` with your API client settings and org
6. Generate an SSL certificate and key for localhost using [mkcert](https://github.com/FiloSottile/mkcert)
7. Run `node server.js` to start the test server
8. In the browser, go to `https://localhost:3000`

For the node example, run `node auth.js`
