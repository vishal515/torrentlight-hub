
import React, { useState, useEffect, useRef } from 'react';
import TorrentInput from './TorrentInput';
import TorrentList from './TorrentList';
import { toast } from "@/components/ui/use-toast";
import { TorrentInfo, TorrentFile } from '@/types/torrent';
import { formatTimeRemaining } from '@/lib/utils';

declare global {
  interface Window {
    WebTorrent: any;
  }
}

const TorrentClient: React.FC = () => {
  const [torrents, setTorrents] = useState<TorrentInfo[]>([]);
  const [isClientReady, setIsClientReady] = useState(false);
  const clientRef = useRef<any>(null);

  // Initialize WebTorrent client
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (window.WebTorrent) {
        try {
          clientRef.current = new window.WebTorrent();
          setIsClientReady(true);
          
          // Clean up on unmount
          return () => {
            if (clientRef.current) {
              clientRef.current.destroy();
            }
          };
        } catch (error) {
          console.error('Error initializing WebTorrent client:', error);
          toast({
            variant: "destructive",
            title: "WebTorrent Error",
            description: "Failed to initialize WebTorrent client.",
          });
        }
      } else {
        console.error('WebTorrent library not loaded');
        toast({
          variant: "destructive",
          title: "WebTorrent Not Loaded",
          description: "The WebTorrent library failed to load. Please refresh the page.",
        });
      }
    }
  }, []);

  // Update torrent info periodically
  useEffect(() => {
    const updateInterval = setInterval(() => {
      if (clientRef.current) {
        const updatedTorrents = clientRef.current.torrents.map((torrent: any) => ({
          infoHash: torrent.infoHash,
          name: torrent.name || 'Unnamed Torrent',
          progress: torrent.progress,
          downloadSpeed: torrent.downloadSpeed,
          uploaded: torrent.uploaded,
          downloaded: torrent.downloaded,
          length: torrent.length || 0,
          numPeers: torrent.numPeers,
          timeRemaining: formatTimeRemaining(torrent.timeRemaining),
          done: torrent.done,
          paused: torrent.paused || false,
          files: torrent.files ? torrent.files.map((file: any) => ({
            name: file.name,
            length: file.length,
            path: file.path
          })) : []
        }));
        
        setTorrents(updatedTorrents);
      }
    }, 1000);

    return () => clearInterval(updateInterval);
  }, []);

  const handleAddTorrent = (magnetUri: string) => {
    if (!isClientReady) {
      toast({
        variant: "destructive",
        title: "Client Not Ready",
        description: "WebTorrent client is not initialized yet.",
      });
      return;
    }

    try {
      toast({
        title: "Adding Torrent",
        description: "Please wait while we process your torrent...",
      });

      clientRef.current.add(magnetUri, (torrent: any) => {
        // Handle successful torrent add
        torrent.on('ready', () => {
          toast({
            title: "Torrent Added",
            description: `"${torrent.name}" has been added successfully.`,
          });
        });

        torrent.on('error', (err: Error) => {
          console.error('Torrent error:', err);
          toast({
            variant: "destructive",
            title: "Torrent Error",
            description: `Error with torrent: ${err.message}`,
          });
        });

        torrent.on('done', () => {
          toast({
            title: "Download Complete",
            description: `"${torrent.name}" has finished downloading.`,
          });
        });
      });
    } catch (error: any) {
      console.error('Error adding torrent:', error);
      toast({
        variant: "destructive",
        title: "Failed to Add Torrent",
        description: error.message || "An unknown error occurred.",
      });
    }
  };

  const handlePauseTorrent = (torrentId: string) => {
    const torrent = clientRef.current.get(torrentId);
    if (torrent) {
      // WebTorrent doesn't have a built-in pause method, so we pause by destroying connections
      torrent.pause();
      // Mark as paused in our state
      setTorrents(prev => prev.map(t => 
        t.infoHash === torrentId ? { ...t, paused: true } : t
      ));
    }
  };

  const handleResumeTorrent = (torrentId: string) => {
    const torrent = clientRef.current.get(torrentId);
    if (torrent) {
      // Resume the torrent
      torrent.resume();
      // Update our state
      setTorrents(prev => prev.map(t => 
        t.infoHash === torrentId ? { ...t, paused: false } : t
      ));
    }
  };

  const handleStopTorrent = (torrentId: string) => {
    const torrent = clientRef.current.get(torrentId);
    if (torrent) {
      torrent.destroy();
      setTorrents(prev => prev.filter(t => t.infoHash !== torrentId));
      toast({
        title: "Torrent Removed",
        description: "The torrent has been removed successfully.",
      });
    }
  };

  const handleDownloadFile = (torrentId: string, fileIndex: number) => {
    const torrent = clientRef.current.get(torrentId);
    if (torrent && torrent.files && torrent.files[fileIndex]) {
      const file = torrent.files[fileIndex];
      // Create a link to download the file
      file.getBlobURL((err: Error | null, url: string) => {
        if (err) {
          console.error('Error creating download link:', err);
          toast({
            variant: "destructive",
            title: "Download Error",
            description: `Failed to prepare file for download: ${err.message}`,
          });
          return;
        }
        
        const a = document.createElement('a');
        a.download = file.name;
        a.href = url;
        a.click();
        
        // Clean up
        setTimeout(() => {
          window.URL.revokeObjectURL(url);
        }, 30000);
      });
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      <TorrentInput onAddTorrent={handleAddTorrent} />
      
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Torrents</h2>
        <TorrentList 
          torrents={torrents}
          onPauseTorrent={handlePauseTorrent}
          onResumeTorrent={handleResumeTorrent}
          onStopTorrent={handleStopTorrent}
          onDownloadFile={handleDownloadFile}
        />
      </div>
    </div>
  );
};

export default TorrentClient;
