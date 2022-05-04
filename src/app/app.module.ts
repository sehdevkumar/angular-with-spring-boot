import { SessionService } from './services/session-service.service';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { LiveStreamVideosComponent } from './live-stream-videos/live-stream-videos.component';
@NgModule({
  declarations: [AppComponent, LiveStreamVideosComponent],
  imports: [BrowserModule, AppRoutingModule, HttpClientModule],
  providers: [SessionService],
  bootstrap: [AppComponent],
})
export class AppModule {}
