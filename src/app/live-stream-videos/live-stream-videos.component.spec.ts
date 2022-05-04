import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveStreamVideosComponent } from './live-stream-videos.component';

describe('LiveStreamVideosComponent', () => {
  let component: LiveStreamVideosComponent;
  let fixture: ComponentFixture<LiveStreamVideosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LiveStreamVideosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LiveStreamVideosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
