
export interface TorrentFile {
  name: string;
  length: number;
  path: string;
  progress?: number;
  priority?: number; // 0: skip, 1: normal, 2: high
  selected?: boolean;
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
  uploadSpeed?: number;
  ratio?: number;
  seeds?: number;
  magnetURI?: string;
  created?: Date;
  comment?: string;
  createdBy?: string;
}

export interface SearchResult {
  name: string;
  size: string;
  seeds: number;
  leeches: number;
  magnetURI: string;
  category: string;
  source: string;
  uploadDate?: string;
}
