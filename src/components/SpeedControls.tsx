
import React, { useState } from 'react';
import { Slider } from '@/components/ui/slider';
import { 
  ArrowDown, 
  ArrowUp, 
  BatteryCharging,
  Gauge
} from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { formatBytes } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface SpeedControlsProps {
  onSetDownloadLimit: (speed: number) => void;
  onSetUploadLimit: (speed: number) => void;
  onTogglePowerSave: (enabled: boolean) => void;
  downloadLimit: number;
  uploadLimit: number;
  isPowerSaveEnabled: boolean;
}

const SpeedControls: React.FC<SpeedControlsProps> = ({
  onSetDownloadLimit,
  onSetUploadLimit,
  onTogglePowerSave,
  downloadLimit,
  uploadLimit,
  isPowerSaveEnabled
}) => {
  // Convert bytes/s to KB/s for display
  const dlKBs = Math.round(downloadLimit / 1024);
  const ulKBs = Math.round(uploadLimit / 1024);
  
  // Download speed presets (in KB/s)
  const downloadPresets = [0, 512, 1024, 2048, 5120, 10240];
  const uploadPresets = [0, 128, 256, 512, 1024, 2048];
  
  return (
    <div className="bg-secondary/30 p-4 rounded-md space-y-5">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <Gauge className="h-4 w-4" /> Bandwidth Settings
      </h3>
      
      <div className="space-y-6">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ArrowDown className="h-4 w-4 text-blue-400" />
              <h4 className="font-medium">Download Speed Limit</h4>
            </div>
            <div className="text-sm font-medium">
              {dlKBs === 0 ? "Unlimited" : `${dlKBs} KB/s`}
            </div>
          </div>
          
          <Slider 
            value={[dlKBs]}
            min={0}
            max={15000}
            step={64}
            onValueChange={(values) => {
              onSetDownloadLimit(values[0] * 1024);
            }}
          />
          
          <div className="flex justify-between gap-2 mt-2">
            {downloadPresets.map((preset, i) => (
              <Button 
                key={i}
                variant="outline" 
                size="sm"
                className="text-xs flex-1"
                onClick={() => onSetDownloadLimit(preset * 1024)}
              >
                {preset === 0 ? "No Limit" : `${preset} KB/s`}
              </Button>
            ))}
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ArrowUp className="h-4 w-4 text-green-400" />
              <h4 className="font-medium">Upload Speed Limit</h4>
            </div>
            <div className="text-sm font-medium">
              {ulKBs === 0 ? "Unlimited" : `${ulKBs} KB/s`}
            </div>
          </div>
          
          <Slider 
            value={[ulKBs]}
            min={0}
            max={5000}
            step={32}
            onValueChange={(values) => {
              onSetUploadLimit(values[0] * 1024);
            }}
          />
          
          <div className="flex justify-between gap-2 mt-2">
            {uploadPresets.map((preset, i) => (
              <Button 
                key={i}
                variant="outline" 
                size="sm"
                className="text-xs flex-1"
                onClick={() => onSetUploadLimit(preset * 1024)}
              >
                {preset === 0 ? "No Limit" : `${preset} KB/s`}
              </Button>
            ))}
          </div>
        </div>
        
        <div className="pt-2 border-t border-border/40">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BatteryCharging className="h-4 w-4 text-amber-400" />
              <h4 className="font-medium">Power Saving Mode</h4>
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Switch 
                    checked={isPowerSaveEnabled}
                    onCheckedChange={onTogglePowerSave}
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Reduces CPU usage by decreasing update frequency</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Reduces resource usage by slowing down UI updates and background processes.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SpeedControls;
