import { FirebaseStrategy } from './firebase.strategy';
import { DecodedIdToken } from './decoded-id-token';

describe('Firebase Strategy', () => {
  let strategy: FirebaseStrategy;

  beforeEach(() => {
    strategy = new FirebaseStrategy({ issuer: 'issuer', audience: 'audience' });
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  describe('validate', () => {
    it('should return DecodedIdToken', () => {
      const token = { uid: Math.random().toString() } as DecodedIdToken;
      const data = strategy.validate(token);

      expect(data).not.toBe(null);
      expect(data).toEqual(token);
    });
  });
});
