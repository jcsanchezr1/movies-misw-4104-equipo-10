import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class HttpErrorInterceptorService {
  constructor(private toastrService: ToastrService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = '';
        let errorType = '';

        if (error.error instanceof ErrorEvent) {
          errorType = 'Error del lado del cliente';
          errorMessage = error.error.message;
        } else {
          errorType = 'Error del lado del servidor';
          if (error.status === 0) {
            errorMessage = 'No hay conexión con el servidor';
          } else {
            errorMessage = `${error.status}: ${error.statusText}`;
          }

          if (error.statusText !== 'OK') {
            this.toastrService.error(errorMessage, errorType, {
              closeButton: true,
            });
          }
        }
        return throwError(errorMessage);
      })
    );
  }
}
