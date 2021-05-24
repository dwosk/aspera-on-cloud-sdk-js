## aspera-on-cloud-sdk-js Examples
To run the examples, do the following:
1. [Register an API client](https://ibmaspera.com/help/admin/organization/registering_an_api_client) via the Aspera on Cloud Admin application using `https://localhost:3000` as the redirect uri
2. `npm install` to install the project dependencies and then `npm run build`
3. `cd` into this directory
4. `npm install` the test dependencies
5. Update [token_flow.html](oauth/token/token_flow.html) with your API client settings and org
6. Generate an SSL certificate and key for localhost (see: [mkcert](https://github.com/FiloSottile/mkcert))
7. Start the server: `node server.js`
8. Open `https://localhost:3000` in the browser
