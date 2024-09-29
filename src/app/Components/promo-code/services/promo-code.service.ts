import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root',
})
export class PromoCodeService {
  baseUrl = environment.base_url;

  constructor(private http: HttpClient) {}

  addPromoCode(body: any) {
    return this.http.post(this.baseUrl + 'PromoCode/add-promo-code', body);
  }
  getActivePromoCodes() {
    return this.http.get(this.baseUrl + 'PromoCode/get-all-active-promo-code');
  }
  getInActivePromoCodes() {
    return this.http.get(
      this.baseUrl + 'PromoCode/get-all-inactive-promo-code'
    );
  }
  getExpiryPromoCodes() {
    return this.http.get(this.baseUrl + 'PromoCode/get-all-expiry-promo-code');
  }

  updatePromoCode(promoCodeBody: any) {
    return this.http.put(
      `${this.baseUrl}PromoCode/update-promo-code`,
      promoCodeBody,
      { responseType: 'text' }
    );
  }
}
