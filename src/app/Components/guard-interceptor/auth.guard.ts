import { formatDate } from '@angular/common';
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

export const authguardGuard: CanActivateFn = (route, state) => {
  debugger;
  console.log('authGuard works !!!');
  const toaster: ToastrService = inject(ToastrService);
  const router: Router = inject(Router);
  const token = localStorage.getItem('token');
  let timeExpiry = localStorage.getItem('expiryDate')
    ? <string>localStorage.getItem('expiryDate')
    : '00';
  let timeNow = formatDate(Date.now(), 'dd', 'en-US');
  let timecompare = formatDate(timeExpiry, 'dd', 'en-US');

  if (token) {
    console.log('there is a token');
    return true;
  } else if (timeNow === timecompare) {
    toaster.error('تم انتهاء الجلسة');
    localStorage.removeItem('expiry');
    localStorage.removeItem('token');
    return router.createUrlTree(['/auth/login']);
  } else if (!token) {
    return router.createUrlTree(['/auth/login']);
  }

  return true;
};
