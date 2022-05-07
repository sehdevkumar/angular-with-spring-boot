import { OpenVidu } from 'openvidu-browser';
import {
  HttpHeaders,
  HttpClient,
  HttpParams,
  HttpErrorResponse,
} from '@angular/common/http';
import { TokenConnection, SessionObject } from './../typings/session-typing';
import { Injectable } from '@angular/core';
import { Subject, throwError as observableThrowError } from 'rxjs';
import { catchError } from 'rxjs/operators';
@Injectable({
  providedIn: 'root',
})
export class SessionService {
  OPENVIDU_SERVER_URL = 'https://' + '172.17.0.1' + ':4443';
  OPENVIDU_SERVER_SECRET = 'MY_SECRET';
  sessionObject: SessionObject | undefined;
  tokenCollection: Array<TokenConnection> = [];
  tokenCollectionDispatch: Subject<Array<TokenConnection>> = new Subject();
  cameraPublishNotification: Subject<boolean> = new Subject();

  constructor(private htttpClient: HttpClient) {}

  getAllInitialApiCall(): void {
    this.getAllSessionFromServer().then((res: SessionObject) => {
      this.sessionObject = res;
      this.getAllTokensForSession().then(async () => {
        this.tokenCollectionDispatch.next(this.tokenCollection);
      });
    });
  }

  private getAllSessionFromServer(): Promise<any> {
    return new Promise((resolved, reject) => {
      const body = {};
      const options = {
        headers: new HttpHeaders({
          // tslint:disable-next-line:object-literal-key-quotes
          Authorization:
            'Basic ' + btoa('OPENVIDUAPP:' + this.OPENVIDU_SERVER_SECRET),
          'Content-Type': 'application/json',
        }),
      };
      return this.htttpClient
        .get(this.OPENVIDU_SERVER_URL + '/openvidu/api/sessions/', options)
        .pipe(
          catchError((error) => {
            reject(error);
            return observableThrowError(error);
          })
        )
        .subscribe((response) => {
          resolved(response);
        });
    });
  }

  /**
   * This function will retun the tokens
   * @returns Promise<void
   */
  private getAllTokensForSession(): Promise<void> {
    return new Promise((resolved, rejected) => {
      const body = {};
      const options = {
        headers: new HttpHeaders({
          // tslint:disable-next-line:object-literal-key-quotes
          Authorization:
            'Basic ' + btoa('OPENVIDUAPP:' + this.OPENVIDU_SERVER_SECRET),
          'Content-Type': 'application/json',
        }),
      };
      const len = this.sessionObject?.content.length ?? 0;
      this.sessionObject?.content.forEach((c, i) => {
        this.htttpClient
          .post(
            this.OPENVIDU_SERVER_URL +
              '/openvidu/api/sessions/' +
              c?.sessionId +
              '/connection',
            body,
            options
          )
          .pipe(
            catchError((error) => {
              rejected();
              return observableThrowError(error);
            })
          )
          .subscribe((response: any) => {
            this.tokenCollection.push(response);
            if (i === len - 1) {
              resolved();
            }
          });
      });
    });
  }
}
