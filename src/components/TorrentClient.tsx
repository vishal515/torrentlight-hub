
import React, { useState, useEffect, useRef } from 'react';
import TorrentInput from './TorrentInput';
import TorrentList from './TorrentList';
import TorrentSearch from './TorrentSearch';
import TorrentDetails from './TorrentDetails';
import SpeedControls from './SpeedControls';
import { toast } from "@/components/ui/use-toast";
import { TorrentInfo, TorrentFile } from '@/types/torrent';
import { formatTimeRemaining } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from '@/components/ui/card';

declare global {
  interface Window {
    WebTorrent: any;
  }
}

const TorrentClient: React.FC = () => {
  const [torrents, setTorrents] = useState<TorrentInfo[]>([]);
  const [isClientReady, setIsClientReady] = useState(false);
  const [selectedTorrent, setSelectedTorrent] = useState<string | null>(null);
  const [downloadLimit, setDownloadLimit] = useState<number>(0); // 0 means no limit
  const [uploadLimit, setUploadLimit] = useState<number>(0); // 0 means no limit
  const [isPowerSaveEnabled, setIsPowerSaveEnabled] = useState<boolean>(false);
  const clientRef = useRef<any>(null);
  const updateIntervalRef = useRef<number | null>(null);

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
            if (updateIntervalRef.current) {
              clearInterval(updateIntervalRef.current);
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

  // Set up torrent info update interval
  useEffect(() => {
    if (updateIntervalRef.current) {
      clearInterval(updateIntervalRef.current);
    }

    // Use different intervals based on power save mode
    const updateFrequency = isPowerSaveEnabled ? 2000 : 1000;
    updateIntervalRef.current = window.setInterval(updateTorrentsInfo, updateFrequency);

    return () => {
      if (updateIntervalRef.current) {
        clearInterval(updateIntervalRef.current);
      }
    };
  }, [isPowerSaveEnabled]);

  // Update torrent speed limits when they change
  useEffect(() => {
    if (clientRef.current) {
      // In a real implementation, WebTorrent would support these directly
      // but for this demo, we just log the changes
      console.log(`Download limit set to: ${downloadLimit} bytes/s`);
      console.log(`Upload limit set to: ${uploadLimit} bytes/s`);
      
      // Throttle the speed for all torrents (pseudo-implementation)
      clientRef.current.torrents.forEach((torrent: any) => {
        // In a real implementation, these methods would exist
        if (downloadLimit > 0 && torrent.setDownloadLimit) {
          torrent.setDownloadLimit(downloadLimit);
        }
        if (uploadLimit > 0 && torrent.setUploadLimit) {
          torrent.setUploadLimit(uploadLimit);
        }
      });
    }
  }, [downloadLimit, uploadLimit]);

  // Function to update torrent information
  const updateTorrentsInfo = () => {
    if (clientRef.current) {
      const updatedTorrents = clientRef.current.torrents.map((torrent: any) => {
        // Calculate ratio
        const ratio = torrent.uploaded > 0 && torrent.downloaded > 0
          ? torrent.uploaded / torrent.downloaded
          : 0;
            
        return {
          infoHash: torrent.infoHash,
          name: torrent.name || 'Unnamed Torrent',
          progress: torrent.progress,
          downloadSpeed: torrent.downloadSpeed,
          uploadSpeed: torrent.uploadSpeed,
          uploaded: torrent.uploaded,
          downloaded: torrent.downloaded,
          length: torrent.length || 0,
          numPeers: torrent.numPeers,
          seeds: torrent._peers ? Object.keys(torrent._peers).length : 0,
          timeRemaining: formatTimeRemaining(torrent.timeRemaining),
          done: torrent.done,
          paused: torrent.paused || false,
          ratio: ratio,
          magnetURI: torrent.magnetURI,
          created: torrent.created,
          comment: torrent.comment,
          createdBy: torrent.createdBy,
          files: torrent.files ? torrent.files.map((file: any) => ({
            name: file.name,
            length: file.length,
            path: file.path,
            progress: file.progress,
            selected: file.selected !== false,
            priority: file.priority || 1
          })) : []
        };
      });
      
      setTorrents(updatedTorrents);
    }
  };

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
          updateTorrentsInfo();
          setSelectedTorrent(torrent.infoHash);
          
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
          updateTorrentsInfo();
          
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
      // Update torrents info
      updateTorrentsInfo();
    }
  };

  const handleResumeTorrent = (torrentId: string) => {
    const torrent = clientRef.current.get(torrentId);
    if (torrent) {
      // Resume the torrent
      torrent.resume();
      // Update torrents info
      updateTorrentsInfo();
    }
  };

  const handleStopTorrent = (torrentId: string) => {
    const torrent = clientRef.current.get(torrentId);
    if (torrent) {
      // If this was the selected torrent, unselect it
      if (selectedTorrent === torrentId) {
        setSelectedTorrent(null);
      }
      
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

  const handleToggleFileSelection = (torrentId: string, fileIndex: number, selected: boolean) => {
    const torrent = clientRef.current.get(torrentId);
    if (torrent && torrent.files && torrent.files[fileIndex]) {
      const file = torrent.files[fileIndex];
      
      // In WebTorrent, we would call file.select() or file.deselect()
      // For demo purposes, we'll just update our state
      if (selected) {
        file.select();
      } else {
        file.deselect();
      }
      
      // Update the UI
      updateTorrentsInfo();
    }
  };

  const handleSetFilePriority = (torrentId: string, fileIndex: number, priority: number) => {
    const torrent = clientRef.current.get(torrentId);
    if (torrent && torrent.files && torrent.files[fileIndex]) {
      // In a real implementation, WebTorrent would support file priorities
      // but for this demo, we'll just update our state
      
      // Update torrents info to reflect the change in the UI
      setTorrents(prev => 
        prev.map(t => {
          if (t.infoHash === torrentId) {
            const updatedFiles = [...t.files];
            updatedFiles[fileIndex] = {
              ...updatedFiles[fileIndex],
              priority
            };
            return { ...t, files: updatedFiles };
          }
          return t;
        })
      );
    }
  };

  const handleSelectTorrent = (torrentId: string) => {
    setSelectedTorrent(torrentId);
  };

  // Find the selected torrent from our list
  const selectedTorrentInfo = selectedTorrent 
    ? torrents.find(t => t.infoHash === selectedTorrent)
    : null;

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      <Tabs defaultValue="add" className="w-full">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="add">Add Torrent</TabsTrigger>
          <TabsTrigger value="search">Search Torrents</TabsTrigger>
        </TabsList>
        
        <TabsContent value="add" className="space-y-4">
          <TorrentInput onAddTorrent={handleAddTorrent} />
        </TabsContent>
        
        <TabsContent value="search" className="space-y-4">
          <TorrentSearch onAddTorrent={handleAddTorrent} />
        </TabsContent>
      </Tabs>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="mt-8">
            <h2 className="text-xl font-bold mb-4">Torrents</h2>
            <TorrentList 
              torrents={torrents}
              onPauseTorrent={handlePauseTorrent}
              onResumeTorrent={handleResumeTorrent}
              onStopTorrent={handleStopTorrent}
              onDownloadFile={handleDownloadFile}
              onSelectTorrent={handleSelectTorrent}
              selectedTorrentId={selectedTorrent}
            />
          </div>
          
          {selectedTorrentInfo && (
            <div className="mt-8">
              <h2 className="text-xl font-bold mb-4">Torrent Details</h2>
              <TorrentDetails 
                torrent={selectedTorrentInfo}
                onToggleFileSelection={handleToggleFileSelection}
                onSetFilePriority={handleSetFilePriority}
                onDownloadFile={handleDownloadFile}
              />
            </div>
          )}
        </div>
        
        <div>
          <div className="mt-8">
            <h2 className="text-xl font-bold mb-4">Settings</h2>
            <SpeedControls 
              downloadLimit={downloadLimit}
              uploadLimit={uploadLimit}
              isPowerSaveEnabled={isPowerSaveEnabled}
              onSetDownloadLimit={setDownloadLimit}
              onSetUploadLimit={setUploadLimit}
              onTogglePowerSave={setIsPowerSaveEnabled}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TorrentClient;
