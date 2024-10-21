import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ErrorHandlerService {
  constructor() {}

  getErrors(response: any, lang: string): string[] {
    const errors: string[] = [];
    if (response && response.error.errors) {
      for (let field in response.error.errors) {
        if (response.error.errors.hasOwnProperty(field)) {
          const fieldErrors = response.error.errors[field];
          fieldErrors.forEach((errorMsg: string) => {
            if (lang === 'Ar') {
              errors.push(`خطأ: ${errorMsg}`);
            } else {
              errors.push(errorMsg);
            }
          });
        }
      }
    } else {
      const defaultErrorMessage =
        lang === 'Ar' ? 'حدث خطأ غير معروف.' : 'An unknown error occurred.';
      errors.push(defaultErrorMessage);
    }

    return errors;
  }
}
