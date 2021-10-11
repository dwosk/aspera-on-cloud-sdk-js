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
});
