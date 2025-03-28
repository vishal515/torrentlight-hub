
import React, { useState } from 'react';
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MagnetIcon } from "@/components/icons/MagnetIcon";

interface TorrentInputProps {
  onAddTorrent: (magnetUri: string) => void;
}

const TorrentInput: React.FC<TorrentInputProps> = ({ onAddTorrent }) => {
  const [magnetUri, setMagnetUri] = useState('');

  const handleAddTorrent = () => {
    if (!magnetUri.trim().startsWith('magnet:?')) {
      toast({
        variant: "destructive",
        title: "Invalid Magnet Link",
        description: "Please enter a valid magnet URI starting with 'magnet:?'",
      });
      return;
    }

    onAddTorrent(magnetUri.trim());
    setMagnetUri('');
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-grow">
          <Input
            type="text"
            placeholder="Enter magnet link or URI..."
            value={magnetUri}
            onChange={(e) => setMagnetUri(e.target.value)}
            className="w-full pl-10 bg-secondary/50 text-foreground border-border"
          />
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
            <MagnetIcon />
          </div>
        </div>
        <Button 
          onClick={handleAddTorrent}
          className="bg-torrent hover:bg-torrent-dark text-torrent-foreground"
        >
          Add Torrent
        </Button>
      </div>
    </div>
  );
};

export default TorrentInput;
