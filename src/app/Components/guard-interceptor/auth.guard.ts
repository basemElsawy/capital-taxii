import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

export const authguardGuard: CanActivateFn = (route, state) => {
  const toaster: ToastrService = inject(ToastrService);
  const router: Router = inject(Router);

  const token = localStorage?.getItem('token');
  const expiryTimestampString = localStorage?.getItem('expiryDate');

  // Parse expiry timestamp if available
  const expiryTimestamp = expiryTimestampString
    ? parseInt(expiryTimestampString, 10)
    : 0;

  const currentTimestamp = Math.floor(Date.now() / 1000); // Current time in Unix timestamp format

  if (token && currentTimestamp < expiryTimestamp) {
    // Token is valid and not expired
    return true;
  } else if (token && currentTimestamp >= expiryTimestamp) {
    // Token has expired, log the user out
    toaster.error('تم انتهاء الجلسة');
    localStorage?.removeItem('expiryDate');
    localStorage?.removeItem('token');
    return router.createUrlTree(['/auth/login']);
  } else {
    // No token, redirect to login
    return router.createUrlTree(['/auth/login']);
  }
};
