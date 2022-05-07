import { SessionService } from './services/session-service.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AfterViewInit, Component, OnInit } from '@angular/core';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterViewInit, OnInit {
  constructor(
    private htttpClient: HttpClient,
    private sessionService: SessionService
  ) {
    this.sessionService.getAllInitialApiCall();
  }
  ngAfterViewInit(): void {}
  ngOnInit(): void {}
}
