import { isSafeInternalReturnUrl } from './auth-redirect.util';

describe('isSafeInternalReturnUrl', () => {
  it('accepts in-app paths', () => {
    expect(isSafeInternalReturnUrl('/')).toBeTrue();
    expect(isSafeInternalReturnUrl('/list/abc')).toBeTrue();
    expect(isSafeInternalReturnUrl('/list/x/add')).toBeTrue();
    expect(isSafeInternalReturnUrl('/stats')).toBeTrue();
  });

  it('rejects open redirects and scheme tricks', () => {
    expect(isSafeInternalReturnUrl('')).toBeFalse();
    expect(isSafeInternalReturnUrl('https://evil.test/')).toBeFalse();
    expect(isSafeInternalReturnUrl('//evil.test/')).toBeFalse();
    expect(isSafeInternalReturnUrl('\\evil')).toBeFalse();
    expect(isSafeInternalReturnUrl('/\\evil.com')).toBeFalse();
    expect(isSafeInternalReturnUrl('javascript:alert(1)')).toBeFalse();
  });
});
