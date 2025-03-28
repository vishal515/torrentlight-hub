
export interface TorrentFile {
  name: string;
  length: number;
  path: string;
}

export interface TorrentInfo {
  infoHash: string;
  name: string;
  progress: number;
  downloadSpeed: number;
  uploaded: number;
  downloaded: number;
  length: number;
  numPeers: number;
  timeRemaining: string;
  done: boolean;
  paused: boolean;
  files: TorrentFile[];
}
