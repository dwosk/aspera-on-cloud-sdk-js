import { AsperaOnCloud } from "../src";

describe('AsperaOnCloud', () => {

  test('sets correct headers when given accessToken', () => {
    const aoc = new AsperaOnCloud({ accessToken: 'foo' });
    expect(aoc.auth.getAxios().defaults.headers.common['Authorization']).toBe('Bearer foo');
  });
});
