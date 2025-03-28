
import React from 'react';
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Play, 
  Pause, 
  StopCircle, 
  Download, 
  Info,
  ArrowDown,
  ArrowUp,
  ChevronRight
} from "lucide-react";
import { formatBytes, formatSpeed, shortenFileName } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { TorrentInfo } from '@/types/torrent';
import { cn } from '@/lib/utils';

interface TorrentListProps {
  torrents: TorrentInfo[];
  onPauseTorrent: (torrentId: string) => void;
  onResumeTorrent: (torrentId: string) => void;
  onStopTorrent: (torrentId: string) => void;
  onDownloadFile: (torrentId: string, fileIndex: number) => void;
  onSelectTorrent: (torrentId: string) => void;
  selectedTorrentId: string | null;
}

const TorrentList: React.FC<TorrentListProps> = ({ 
  torrents, 
  onPauseTorrent, 
  onResumeTorrent, 
  onStopTorrent, 
  onDownloadFile,
  onSelectTorrent,
  selectedTorrentId
}) => {
  if (torrents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-16 h-16 mb-4 text-muted-foreground">
          <Info size={64} />
        </div>
        <h3 className="text-xl font-semibold mb-2">No Torrents Added</h3>
        <p className="text-muted-foreground max-w-md">
          Add a torrent using the magnet link input above or search for torrents to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {torrents.map((torrent) => (
        <Card 
          key={torrent.infoHash}
          className={cn(
            "bg-secondary/30 border-border/50 overflow-hidden transition-all duration-200 hover:border-border torrent-row cursor-pointer",
            selectedTorrentId === torrent.infoHash && "border-primary border-2"
          )}
          onClick={() => onSelectTorrent(torrent.infoHash)}
        >
          <CardContent className="p-4">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
              {/* Torrent Name and Progress */}
              <div className="lg:col-span-2 flex flex-col justify-between">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <h3 className="font-semibold text-base truncate">{shortenFileName(torrent.name)}</h3>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{torrent.name}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <div className="mt-2 space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>{Math.floor(torrent.progress * 100)}%</span>
                    <span>{formatBytes(torrent.downloaded)} / {formatBytes(torrent.length)}</span>
                  </div>
                  <Progress value={torrent.progress * 100} className="h-2 progress-bar" />
                </div>
              </div>
              
              {/* Status and Speed */}
              <div className="lg:col-span-1 flex flex-col justify-center">
                <div className="text-sm">
                  <div className="flex flex-col">
                    <span className={`font-medium ${torrent.done ? 'text-green-400' : 'text-torrent-light'}`}>
                      {torrent.done ? 'Completed' : torrent.paused ? 'Paused' : 'Downloading'}
                    </span>
                    {!torrent.done && !torrent.paused && (
                      <div className="flex gap-2">
                        <span className="flex items-center text-blue-400">
                          <ArrowDown className="h-3 w-3 mr-1" />
                          {formatSpeed(torrent.downloadSpeed)}/s
                        </span>
                        <span className="flex items-center text-green-400">
                          <ArrowUp className="h-3 w-3 mr-1" />
                          {formatSpeed(torrent.uploadSpeed || 0)}/s
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Time and Peers */}
              <div className="lg:col-span-1 text-sm flex flex-col justify-center">
                <div>
                  <span className="text-muted-foreground">Peers: </span>
                  <span>{torrent.numPeers}</span>
                </div>
                {!torrent.done && !torrent.paused && (
                  <div>
                    <span className="text-muted-foreground">ETA: </span>
                    <span>{torrent.timeRemaining}</span>
                  </div>
                )}
              </div>
              
              {/* Actions */}
              <div className="lg:col-span-1 flex justify-end items-center space-x-2">
                {!torrent.done ? (
                  <>
                    {torrent.paused ? (
                      <Button 
                        onClick={(e) => {
                          e.stopPropagation();
                          onResumeTorrent(torrent.infoHash);
                        }} 
                        variant="outline" 
                        size="sm"
                      >
                        <Play size={16} />
                      </Button>
                    ) : (
                      <Button 
                        onClick={(e) => {
                          e.stopPropagation();
                          onPauseTorrent(torrent.infoHash);
                        }} 
                        variant="outline" 
                        size="sm"
                      >
                        <Pause size={16} />
                      </Button>
                    )}
                    <Button 
                      onClick={(e) => {
                        e.stopPropagation();
                        onStopTorrent(torrent.infoHash);
                      }} 
                      variant="outline" 
                      size="sm"
                    >
                      <StopCircle size={16} />
                    </Button>
                  </>
                ) : (
                  <>
                    <Button 
                      onClick={(e) => {
                        e.stopPropagation();
                        // If there's just one file, download it directly
                        if (torrent.files.length === 1) {
                          onDownloadFile(torrent.infoHash, 0);
                        }
                      }} 
                      variant="outline" 
                      size="sm"
                      className="text-xs"
                      disabled={torrent.files.length !== 1}
                    >
                      <Download size={16} className="mr-1" />
                      Download
                    </Button>
                    <Button 
                      onClick={(e) => {
                        e.stopPropagation();
                        onStopTorrent(torrent.infoHash);
                      }} 
                      variant="outline" 
                      size="sm"
                    >
                      <StopCircle size={16} />
                    </Button>
                  </>
                )}
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectTorrent(torrent.infoHash);
                  }}
                >
                  <ChevronRight size={16} />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default TorrentList;
