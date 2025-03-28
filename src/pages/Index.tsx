
import React from 'react';
import TorrentClient from '@/components/TorrentClient';

const Index: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="py-6 px-4 border-b border-border/30">
        <div className="max-w-6xl mx-auto w-full">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-foreground">TorrentLite Web</h1>
            <div className="flex items-center gap-2">
              <a 
                href="https://webtorrent.io/docs" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                WebTorrent Docs
              </a>
            </div>
          </div>
        </div>
      </header>
      
      <main className="flex-1 p-4 lg:p-8">
        <TorrentClient />
        
        <div className="mt-12 max-w-6xl mx-auto text-center">
          <h3 className="text-lg font-semibold mb-2">Sample Magnet Link (Public Domain)</h3>
          <div className="p-4 bg-secondary/30 rounded-lg text-sm text-muted-foreground overflow-x-auto">
            <code className="break-all">
              magnet:?xt=urn:btih:08ada5a7a6183aae1e09d831df6748d566095a10&dn=Sintel&tr=udp%3A%2F%2Fexplodie.org%3A6969&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Ftracker.empire-js.us%3A1337&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337&tr=wss%3A%2F%2Ftracker.btorrent.xyz&tr=wss%3A%2F%2Ftracker.fastcast.nz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com&ws=https%3A%2F%2Fwebtorrent.io%2Ftorrents%2F&xs=https%3A%2F%2Fwebtorrent.io%2Ftorrents%2Fsintel.torrent
            </code>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            This sample magnet link is for "Sintel", a free and open movie produced by the Blender Foundation.
          </p>
        </div>
      </main>
      
      <footer className="py-6 px-4 border-t border-border/30 text-center text-sm text-muted-foreground">
        <div className="max-w-6xl mx-auto">
          <p>TorrentLite Web - A simple web-based torrent client powered by WebTorrent</p>
          <p className="mt-1">
            ⚠️ Only download content you have legal rights to, such as public domain works or content you own. ⚠️
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
