import { HttpInterceptorFn } from '@angular/common/http';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  if (localStorage.getItem('token')) {
    const token = localStorage.getItem('token');
    let clonedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });

    return next(clonedReq);
  } else {
    return next(req);
  }
};
