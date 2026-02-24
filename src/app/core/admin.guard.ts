import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformServer } from '@angular/common';
import { AuthService } from '../pages/services/auth.service';

export const adminGuard: CanActivateFn = (route, state) => {
  const platformId = inject(PLATFORM_ID);
  const auth = inject(AuthService);
  const router = inject(Router);

  // On SSR, localStorage/session is not available; let client-side guard decide after hydration.
  if (isPlatformServer(platformId)) return true;

  if (auth.isAuthenticated() && auth.isAdmin()) return true;
  return router.createUrlTree(['/auth', 'login']);
};
