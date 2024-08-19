import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

export const authguardGuard: CanActivateFn = (route, state) => {
  const toaster: ToastrService = inject(ToastrService);
  const router: Router = inject(Router);
  const token = localStorage.getItem('token');
  const expiryTimestamp = localStorage.getItem('expiryDate')
    ? parseInt(localStorage.getItem('expiryDate')!, 10)
    : 0;

  const currentTimestamp = Math.floor(Date.now() / 1000); // Get the current time in Unix timestamp format

  if (token && currentTimestamp < expiryTimestamp) {
    // Token is valid and not expired
    return true;
  } else if (token && currentTimestamp >= expiryTimestamp) {
    // Token has expired, log the user out
    toaster.error('تم انتهاء الجلسة');
    localStorage.removeItem('expiryDate');
    localStorage.removeItem('token');
    return router.createUrlTree(['/auth/login']);
  } else if (!token) {
    // No token, redirect to login
    return router.createUrlTree(['/auth/login']);
  }

  return true;
};
