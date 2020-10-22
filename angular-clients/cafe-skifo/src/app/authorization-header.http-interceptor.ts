import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UaaService } from './uaa.service';

@Injectable({
  providedIn: 'root',
})
export class AuthorizationHeaderHttpInterceptor implements HttpInterceptor {
  constructor(private uaa: UaaService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const accessToken = this.uaa.accessToken;
    const request = accessToken
      ? req.clone({
          setHeaders: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
      : req;

    return next.handle(request);
  }
}
