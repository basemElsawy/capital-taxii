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
          if (response.error.errors) {
            if (lang == 'ar') {
              errors.push(`خطأ: ${response.error.errors}`);
            } else {
              errors.push(response.error.errors);
            }
          }

          const fieldErrors = response.error.errors[field];
          if (Array.isArray(fieldErrors)) {
            fieldErrors.forEach((errorMsg: string) => {
              if (lang === 'ar') {
                errors.push(`خطأ: ${errorMsg}`);
              } else {
                errors.push(errorMsg);
              }
            });
          } else if (typeof fieldErrors == 'object') {
            if (lang == 'ar') {
              errors.push(`خطأ: ${fieldErrors.errorAr}`);
            } else {
              errors.push(`خطأ: ${fieldErrors.errorEn}`);
            }
          } else {
            fieldErrors.forEach((errorMsg: string) => {
              if (lang === 'ar') {
                errors.push(`خطأ: ${errorMsg}`);
              } else {
                errors.push(errorMsg);
              }
            });
          }
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
