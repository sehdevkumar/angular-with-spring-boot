import { TokenConnection } from './../typings/session-typing';
import { OpenVidu, StreamEvent, VideoElementEvent } from 'openvidu-browser';
import { SessionService } from './../services/session-service.service';
import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef,
} from '@angular/core';

@Component({
  selector: 'app-live-stream-videos',
  templateUrl: './live-stream-videos.component.html',
  styleUrls: ['./live-stream-videos.component.scss'],
})
export class LiveStreamVideosComponent implements OnInit, AfterViewInit {
  @ViewChild('cameras')
  cameras!: ElementRef;
  // tslint:disable-next-line:new-parens
  openVidu: OpenVidu;
  videosContainer!: HTMLDivElement;

  public get getIsCameraIsPublished(): boolean {
    return this.sessionService.sessionObject?.numberOfElements !== 0;
  }

  constructor(private sessionService: SessionService) {
    this.openVidu = new OpenVidu();
  }
  ngAfterViewInit(): void {
    this.subscribeTokensAndStartLiveStreaming();
    this.sessionService.cameraPublishNotification.subscribe((flag) => {
      this.cameras.nativeElement.innerHTML = '';
      this.sessionService.getAllInitialApiCall();
      this.subscribeTokensAndStartLiveStreaming();
    });
  }

  private subscribeTokensAndStartLiveStreaming(): void {
    this.sessionService.tokenCollectionDispatch.subscribe(
      (res: Array<TokenConnection>) => {
        res.forEach((t) => {
          this.getStartLiveStreamingVidoes(t.token);
        });
      }
    );
  }

  ngOnInit(): void {}

  getStartLiveStreamingVidoes(token: string): void {
    const session = this.openVidu.initSession();

    session
      .connect(token)
      .then(() => {
        console.log('Session Has Connected Successfully');
      })
      .catch((err) => {
        console.log('Session Not Connected', err);
      });

    // On every asynchronous exception...
    session.on('exception', (exception) => {
      console.warn(exception);
    });

    session.on('streamCreated', (event: StreamEvent) => {
      this.videosContainer = document.getElementById(
        'cameras'
      ) as HTMLDivElement;
      const videoDiv = document.createElement('div');
      const stream = event.stream;
      // tslint:disable-next-line:indent
      videoDiv.classList.add('video-container');
      videoDiv.id = stream.streamId;
      // tslint:disable-next-line:indent
      this.videosContainer?.appendChild(videoDiv);
      // Append video inside our brand new <div> element
      // tslint:disable-next-line:indent
      const subscriber = session.subscribe(event.stream, videoDiv, {
        insertMode: 'APPEND',
      });

      // When the HTML video has been appended to DOM...
      subscriber.on('videoElementCreated', (ev) => {
        // ...append camera name on top of video
        const cameraName = document.createElement('div');
        cameraName.innerText = stream.connection.data;
        cameraName.classList.add('camera-name');
        ev?.element?.parentNode?.insertBefore(cameraName, ev.element);
        // ...start loader
        const loader = document.createElement('div');
        loader.classList.add('loader');
        ev?.element?.parentNode?.insertBefore(loader, ev.element.nextSibling);
      });

      // When the HTML video starts playing...
      subscriber.on('streamPlaying', (ev) => {
        // ...remove loader
        const cameraVideoElement = subscriber.videos[0].video;
        cameraVideoElement?.parentNode?.removeChild(
          cameraVideoElement?.nextSibling as HTMLUnknownElement
        );
        // ... mute video if browser blocked autoplay
        this.autoplayMutedVideoIfBlocked(cameraVideoElement);
      });

      // When the HTML video has been removed from DOM...
      subscriber.on('videoElementDestroyed', (ev) => {
        // ...remove the HTML elements related to the destroyed video
        const videoContainer = document.getElementById(stream.streamId);
        videoContainer?.parentNode?.removeChild(videoContainer);
      });
    });
  }

  // tslint:disable-next-line:typedef
  autoplayMutedVideoIfBlocked(video: HTMLVideoElement) {
    // Browser can block video playback if it is auto played without user interaction
    // One solution is to mute the video and let the user know
    video.controls = true;
    const promise = video.play();
    if (promise !== undefined) {
      promise
        .then(() => {
          // Autoplay started
        })
        .catch((error) => {
          // The video must play muted until user hits play button
          video.muted = true;
          video.play();
        });
    }
  }
}
