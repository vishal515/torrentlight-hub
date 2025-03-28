
import React from 'react';
import { Bookmark, HardDrive, Link, Info, Calendar, BarChart, ArrowDownUp } from 'lucide-react';
import { formatBytes, formatSpeed } from '@/lib/utils';
import { TorrentInfo, TorrentFile } from '@/types/torrent';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';

interface TorrentDetailsProps {
  torrent: TorrentInfo;
  onToggleFileSelection: (torrentId: string, fileIndex: number, selected: boolean) => void;
  onSetFilePriority: (torrentId: string, fileIndex: number, priority: number) => void;
  onDownloadFile: (torrentId: string, fileIndex: number) => void;
}

const TorrentDetails: React.FC<TorrentDetailsProps> = ({ 
  torrent, 
  onToggleFileSelection, 
  onSetFilePriority,
  onDownloadFile 
}) => {
  const copyMagnetLink = () => {
    if (torrent.magnetURI) {
      navigator.clipboard.writeText(torrent.magnetURI);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-xl font-bold">{torrent.name}</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-secondary/30 p-4 rounded-md space-y-3">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Info className="h-4 w-4" /> General Info
            </h3>
            
            <div className="grid grid-cols-3 gap-2 text-sm">
              <div className="text-muted-foreground">Hash:</div>
              <div className="col-span-2 text-xs font-mono overflow-hidden text-ellipsis">{torrent.infoHash}</div>
              
              <div className="text-muted-foreground">Size:</div>
              <div className="col-span-2">{formatBytes(torrent.length)}</div>
              
              <div className="text-muted-foreground">Created:</div>
              <div className="col-span-2">{torrent.created ? torrent.created.toLocaleDateString() : 'Unknown'}</div>
              
              <div className="text-muted-foreground">Comment:</div>
              <div className="col-span-2">{torrent.comment || 'None'}</div>
              
              <div className="text-muted-foreground">Created By:</div>
              <div className="col-span-2">{torrent.createdBy || 'Unknown'}</div>
            </div>
            
            <div className="pt-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full text-xs"
                onClick={copyMagnetLink}
              >
                <Link className="h-3.5 w-3.5 mr-1" /> Copy Magnet Link
              </Button>
            </div>
          </div>
          
          <div className="bg-secondary/30 p-4 rounded-md space-y-3">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <BarChart className="h-4 w-4" /> Transfer Stats
            </h3>
            
            <div className="grid grid-cols-3 gap-2 text-sm">
              <div className="text-muted-foreground">Status:</div>
              <div className="col-span-2">
                <span className={torrent.done ? 'text-green-400' : torrent.paused ? 'text-amber-400' : 'text-blue-400'}>
                  {torrent.done ? 'Completed' : torrent.paused ? 'Paused' : 'Downloading'}
                </span>
              </div>
              
              <div className="text-muted-foreground">Progress:</div>
              <div className="col-span-2">
                <div className="flex items-center gap-2">
                  <Progress value={torrent.progress * 100} className="h-2 flex-grow" />
                  <span className="text-xs">{Math.round(torrent.progress * 100)}%</span>
                </div>
              </div>
              
              <div className="text-muted-foreground">Download Speed:</div>
              <div className="col-span-2">{formatSpeed(torrent.downloadSpeed)}/s</div>
              
              <div className="text-muted-foreground">Upload Speed:</div>
              <div className="col-span-2">{formatSpeed(torrent.uploadSpeed || 0)}/s</div>
              
              <div className="text-muted-foreground">Downloaded:</div>
              <div className="col-span-2">{formatBytes(torrent.downloaded)}</div>
              
              <div className="text-muted-foreground">Uploaded:</div>
              <div className="col-span-2">{formatBytes(torrent.uploaded)}</div>
              
              <div className="text-muted-foreground">Ratio:</div>
              <div className="col-span-2">{torrent.ratio?.toFixed(2) || '0.00'}</div>
              
              <div className="text-muted-foreground">Peers/Seeds:</div>
              <div className="col-span-2">{torrent.numPeers} peers / {torrent.seeds || '?'} seeds</div>
              
              <div className="text-muted-foreground">ETA:</div>
              <div className="col-span-2">{torrent.done ? 'Complete' : torrent.timeRemaining}</div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-secondary/30 p-4 rounded-md">
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <HardDrive className="h-4 w-4" /> Files ({torrent.files.length})
        </h3>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/50">
                <th className="text-left py-2 font-medium">Name</th>
                <th className="text-center py-2 font-medium">Size</th>
                <th className="text-center py-2 font-medium">Progress</th>
                <th className="text-center py-2 font-medium">Priority</th>
                <th className="text-center py-2 font-medium">Download</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {torrent.files.map((file, index) => (
                <tr key={index} className="hover:bg-secondary/50">
                  <td className="py-2 flex items-center gap-2">
                    <Checkbox 
                      id={`file-${index}`}
                      checked={file.selected !== false}
                      onCheckedChange={(checked) => 
                        onToggleFileSelection(torrent.infoHash, index, checked as boolean)
                      }
                    />
                    <label 
                      htmlFor={`file-${index}`}
                      className="cursor-pointer truncate max-w-[300px]"
                      title={file.name}
                    >
                      {file.name}
                    </label>
                  </td>
                  <td className="text-center py-2">{formatBytes(file.length)}</td>
                  <td className="text-center py-2">
                    <div className="flex items-center px-4">
                      <Progress 
                        value={(file.progress || 0) * 100} 
                        className="h-2 flex-grow"
                      />
                      <span className="ml-2 text-xs w-8 text-right">
                        {Math.round((file.progress || 0) * 100)}%
                      </span>
                    </div>
                  </td>
                  <td className="text-center py-2">
                    <select
                      className="bg-background text-foreground border border-input rounded px-2 py-1"
                      value={file.priority || 1}
                      onChange={(e) => onSetFilePriority(torrent.infoHash, index, Number(e.target.value))}
                    >
                      <option value={0}>Low</option>
                      <option value={1}>Normal</option>
                      <option value={2}>High</option>
                    </select>
                  </td>
                  <td className="text-center py-2">
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={!torrent.done}
                      onClick={() => onDownloadFile(torrent.infoHash, index)}
                    >
                      Download
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TorrentDetails;
