export interface SessionConnections {
  numberOfElements: number;
  content: Array<TokenConnection>;
}

export interface DefaultRecordingProperties {
  name: string;
  hasAudio: boolean;
  hasVideo: boolean;
  outputMode: string;
  recordingLayout: string;
  resolution: string;
  frameRate: number;
  shmSize: number;
  mediaNode: string;
}

export interface SessionContent {
  allowTranscoding: boolean;
  connections: SessionConnections;
  createdAt: number;
  customSessionId: string;
  defaultRecordingProperties: DefaultRecordingProperties;
  forcedVideoCodec: string;
  forcedVideoCodecResolved: string;
  id: string;
  mediaMode: string;
  object: string;
  recording: false;
  recordingMode: string;
  sessionId: string;
}

export interface SessionObject {
  content: Array<SessionContent>;
  numberOfElements: number;
}

export interface TokenConnection {
  activeAt: null;
  adaptativeBitrate: null;
  clientData: null;
  connectionId: string;
  createdAt: number;
  customIceServers: Array<any>;
  id: string;
  ip: null;
  kurentoOptions: null;
  location: null;
  networkCache: null;
  object: string;
  onlyPlayWithSubscribers: null;
  platform: null;
  publishers: null;
  record: boolean;
  role: string;
  rtspUri: string | null;
  serverData: string;
  sessionId: string;
  status: string;
  subscribers: string;
  token: string;
  type: string;
}
