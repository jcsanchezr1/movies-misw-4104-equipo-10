import { TestBed, inject } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { ToastrService, ToastrModule } from 'ngx-toastr';
import { HttpErrorInterceptorService } from './http-error-interceptor.service';
import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';

describe('Service: HttpErrorInterceptor', () => {
  let service: HttpErrorInterceptorService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, ToastrModule.forRoot()],

      providers: [
        HttpErrorInterceptorService,
        ToastrService,
        {
          provide: HTTP_INTERCEPTORS,
          useClass: HttpErrorInterceptorService,
          multi: true,
        },
      ],
    });
    service = TestBed.inject(HttpErrorInterceptorService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should handle client side error', inject(
    [HttpClient],
    (http: HttpClient) => {
      const mockErrorResponse = new ErrorEvent('error', {
        message: 'Invalid request parameters',
      });
      const data = 'Invalid request parameters';
      const url = '/api/data';

      http.get(url).subscribe(
        () => {},
        (error: string) => {
          expect(error).toMatch(/Invalid request parameters/i);
        }
      );

      const req = httpMock.expectOne(url);
      req.error(mockErrorResponse);
    }
  ));

  it('should handle server side errors', inject(
    [HttpClient],
    (http: HttpClient) => {
      const mockErrorResponse = {
        status: 500,
        statusText: 'Internal Server Error',
      };
      const data = 'Internal Server Error';
      const url = '/api/data';

      http.get(url).subscribe(
        () => {},
        (error: string) => {
          expect(error).toMatch(/500: Internal Server Error/i);
        }
      );

      const req = httpMock.expectOne(url);
      req.flush(data, mockErrorResponse);
    }
  ));

  it('should handle server side errors status code 0', inject(
    [HttpClient],
    (http: HttpClient) => {
      const mockErrorResponse = { status: 0, statusText: 'Unknown' };
      const data = 'Unknown';
      const url = '/api/data';

      http.get(url).subscribe(
        () => {},
        (error: string) => {
          expect(error).toMatch(/No hay conexión con el servidor/i);
        }
      );

      const req = httpMock.expectOne(url);
      req.flush(data, mockErrorResponse);
    }
  ));
});
