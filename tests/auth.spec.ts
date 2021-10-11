import { AsperaOnCloudAuth } from "../src";

describe('AsperaOnCloudAuth', () => {

  describe('accessToken', () => {

    test('can be set via the constructor', () => {
      const aoc = new AsperaOnCloudAuth({ accessToken: 'foo' });
      expect(aoc.getAccessToken()).toBe('foo');
    });

    test('can be set directly later', () => {
      const aoc = new AsperaOnCloudAuth({});
      aoc.setAccessToken('foo');
      expect(aoc.getAccessToken()).toBe('foo');
    });
  });

  describe('clientId', () => {

    test('can be set via the constructor', () => {
      const aoc = new AsperaOnCloudAuth({ clientId: 'foo' });
      expect(aoc.getClientId()).toBe('foo');
    });


    test('can be set directly later', () => {
      const aoc = new AsperaOnCloudAuth({});
      aoc.setClientId('foo');
      expect(aoc.getClientId()).toBe('foo');
    });
  });

  describe('clientSecret', () => {

    test('can be set via the constructor', () => {
      const aoc = new AsperaOnCloudAuth({ clientSecret: 'foo' });
      expect(aoc.getClientSecret()).toBe('foo');
    });
  });

  describe('org', () => {

    test('can be set via the constructor', () => {
      const aoc = new AsperaOnCloudAuth({ org: 'foo' });
      expect(aoc.getOrg()).toBe('foo');
    });


    test('can be set directly later', () => {
      const aoc = new AsperaOnCloudAuth({});
      aoc.setOrg('foo');
      expect(aoc.getOrg()).toBe('foo');
    });
  });

  describe('redirectUri', () => {

    test('can be set via the constructor', () => {
      const aoc = new AsperaOnCloudAuth({ redirectUri: 'foo' });
      expect(aoc.getRedirectUri()).toBe('foo');
    });
  });

  describe('getAccessTokenWithJwt', () => {

    const buf = Buffer.alloc(5);

    test('throws an error when no clientId provided', () => {
      const aoc = new AsperaOnCloudAuth({});
      expect(() => { aoc.getAccessTokenWithJwt('dwosk@ibm.com', buf); }).toThrow('Missing client id');
    });

    test('throws an error when no clientSecret provided', () => {
      const aoc = new AsperaOnCloudAuth({ clientId: 'foo' });
      expect(() => { aoc.getAccessTokenWithJwt('dwosk@ibm.com', buf); }).toThrow('Missing client secret');
    });

    test('throws an error when no org provided', () => {
      const aoc = new AsperaOnCloudAuth({ clientId: 'foo', clientSecret: 'bar' });
      expect(() => { aoc.getAccessTokenWithJwt('dwosk@ibm.com', buf); }).toThrow('Missing org');
    });
  });

  describe('getOauthUrl', () => {

    test('throws an error if no clientId given', () => {
      const aoc = new AsperaOnCloudAuth({});
      expect(() => { aoc.getOauthUrl(); }).toThrow('Missing client id');
    });

    test('throws an error if no org given', () => {
      const aoc = new AsperaOnCloudAuth({ clientId: 'foo' });
      expect(() => { aoc.getOauthUrl(); }).toThrow('Missing org');
    });

    test('throws an error if no redirectUri when using code grant type', () => {
      const aoc = new AsperaOnCloudAuth({ clientId: 'foo', org: 'org' });
      expect(() => { aoc.getOauthUrl(); }).toThrow('Missing redirect uri');
    });

    test('changes base url if custom apiServer is set', () => {
      const aoc = new AsperaOnCloudAuth({ clientId: 'foo', org: 'org', redirectUri: '127.0.0.1', apiServer: 'aspera.us' });
      const url = aoc.getOauthUrl();
      expect(url).toEqual('https://aspera.us/api/v1/admin/oauth2/org/authorize?response_type=code&client_id=foo&redirect_uri=127.0.0.1&scope=user:all');
    });

    const aoc = new AsperaOnCloudAuth({
      clientId: 'client_id',
      org: 'org',
      redirectUri: '127.0.0.1'
    });

    for (const state of [undefined, 'foo']) {
      for (const scope of [undefined, ['user:all', 'admin:all']]) {
        for (const grant of [undefined, 'code']) {

          test(`returns correct oauth url given - state: ${state}, scope: ${scope}, responseType: ${grant}`, () => {
            const url = aoc.getOauthUrl(state, scope, grant);

            expect(url).toMatch(new RegExp('^https://api.ibmaspera.com/api/v1/admin/oauth2/org/authorize?'));
            expect(url).toContain('?response_type=code&client_id=client_id');
            expect(url).toContain(`&redirect_uri=${aoc.getRedirectUri()}`);

            if (scope) {
              expect(url).toContain(`&scope=${scope.join(' ')}`);
            } else {
              expect(url).toContain(`&scope=user:all`);
            }

            if (state) {
              expect(url).toContain(`&state=${state}`);
            } else {
              expect(url).not.toContain('&state=');
            }
          });

        }
      }
    }
  });
});
