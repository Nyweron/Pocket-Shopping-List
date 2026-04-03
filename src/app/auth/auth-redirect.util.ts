import { ActivatedRoute, Router } from '@angular/router';

/**
 * Blocks open redirects: only same-app relative paths are accepted.
 */
export function isSafeInternalReturnUrl(url: string): boolean {
  if (!url.startsWith('/') || url.startsWith('//')) {
    return false;
  }
  if (url.includes('\\')) {
    return false;
  }
  if (/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(url)) {
    return false;
  }
  return true;
}

/** After login / register success, go to returnUrl if valid, else home. */
export function navigateAfterAuth(router: Router, route: ActivatedRoute): void {
  const raw = route.snapshot.queryParamMap.get('returnUrl');
  if (raw && isSafeInternalReturnUrl(raw)) {
    void router.navigateByUrl(raw);
  } else {
    void router.navigate(['/']);
  }
}
