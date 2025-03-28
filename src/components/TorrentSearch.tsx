
import React, { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SearchResult } from '@/types/torrent';
import { toast } from "@/components/ui/use-toast";

interface TorrentSearchProps {
  onAddTorrent: (magnetUri: string) => void;
}

// Demo search results for illustration (in a real app, these would come from an API)
const DEMO_RESULTS: SearchResult[] = [
  {
    name: "Big Buck Bunny (2008)",
    size: "276.1 MB",
    seeds: 120,
    leeches: 10,
    magnetURI: "magnet:?xt=urn:btih:dd8255ecdc7ca55fb0bbf81323d87062db1f6d1c&dn=Big+Buck+Bunny&tr=udp%3A%2F%2Fexplodie.org%3A6969&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Ftracker.empire-js.us%3A1337&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337&tr=wss%3A%2F%2Ftracker.btorrent.xyz&tr=wss%3A%2F%2Ftracker.fastcast.nz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com&ws=https%3A%2F%2Fwebtorrent.io%2Ftorrents%2F&xs=https%3A%2F%2Fwebtorrent.io%2Ftorrents%2Fbig-buck-bunny.torrent",
    category: "Movies",
    source: "Public Domain"
  },
  {
    name: "Sintel (2010)",
    size: "129.5 MB",
    seeds: 145,
    leeches: 15,
    magnetURI: "magnet:?xt=urn:btih:08ada5a7a6183aae1e09d831df6748d566095a10&dn=Sintel&tr=udp%3A%2F%2Fexplodie.org%3A6969&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Ftracker.empire-js.us%3A1337&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337&tr=wss%3A%2F%2Ftracker.btorrent.xyz&tr=wss%3A%2F%2Ftracker.fastcast.nz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com&ws=https%3A%2F%2Fwebtorrent.io%2Ftorrents%2F&xs=https%3A%2F%2Fwebtorrent.io%2Ftorrents%2Fsintel.torrent",
    category: "Movies",
    source: "Public Domain"
  },
  {
    name: "Tears of Steel (2012)",
    size: "184.2 MB",
    seeds: 95,
    leeches: 8,
    magnetURI: "magnet:?xt=urn:btih:209c8226b299b308beaf2b9cd3fb49212dbd13ec&dn=Tears+of+Steel&tr=udp%3A%2F%2Fexplodie.org%3A6969&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Ftracker.empire-js.us%3A1337&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337&tr=wss%3A%2F%2Ftracker.btorrent.xyz&tr=wss%3A%2F%2Ftracker.fastcast.nz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com&ws=https%3A%2F%2Fwebtorrent.io%2Ftorrents%2F&xs=https%3A%2F%2Fwebtorrent.io%2Ftorrents%2Ftears-of-steel.torrent",
    category: "Movies",
    source: "Public Domain"
  },
  {
    name: "Cosmos Laundromat (2015)",
    size: "203.7 MB",
    seeds: 85,
    leeches: 12,
    magnetURI: "magnet:?xt=urn:btih:c9e15763f722f23e98a29decdfae341b98d53056&dn=Cosmos+Laundromat&tr=udp%3A%2F%2Fexplodie.org%3A6969&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Ftracker.empire-js.us%3A1337&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337&tr=wss%3A%2F%2Ftracker.btorrent.xyz&tr=wss%3A%2F%2Ftracker.fastcast.nz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com&ws=https%3A%2F%2Fwebtorrent.io%2Ftorrents%2F&xs=https%3A%2F%2Fwebtorrent.io%2Ftorrents%2Fcosmos-laundromat.torrent",
    category: "Movies",
    source: "Public Domain"
  }
];

const TorrentSearch: React.FC<TorrentSearchProps> = ({ onAddTorrent }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [category, setCategory] = useState("all");
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      toast({
        title: "Search Error",
        description: "Please enter a search term",
        variant: "destructive"
      });
      return;
    }

    setIsSearching(true);
    
    // Simulate API call with a delay
    setTimeout(() => {
      // Filter demo results based on query and category
      const query = searchQuery.toLowerCase();
      const filteredResults = DEMO_RESULTS.filter(result => {
        const matchesQuery = result.name.toLowerCase().includes(query);
        const matchesCategory = category === "all" || result.category.toLowerCase() === category.toLowerCase();
        return matchesQuery && matchesCategory;
      });
      
      setSearchResults(filteredResults);
      setIsSearching(false);
      
      toast({
        title: "Search Complete",
        description: `Found ${filteredResults.length} results for "${searchQuery}"`,
      });
    }, 1000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleAddTorrent = (magnetURI: string) => {
    onAddTorrent(magnetURI);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search for torrents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="pl-9"
          />
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              <span className="hidden sm:inline">Category</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuRadioGroup value={category} onValueChange={setCategory}>
              <DropdownMenuRadioItem value="all">All Categories</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="movies">Movies</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="tv">TV Shows</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="music">Music</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="software">Software</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="games">Games</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <Button onClick={handleSearch} disabled={isSearching}>
          {isSearching ? 'Searching...' : 'Search'}
        </Button>
      </div>
      
      {searchResults.length > 0 && (
        <div className="bg-secondary/30 rounded-md overflow-hidden">
          <div className="grid grid-cols-6 p-3 font-medium text-sm border-b border-border/50">
            <div className="col-span-3">Name</div>
            <div className="text-center">Size</div>
            <div className="text-center">Seeds</div>
            <div className="text-center">Actions</div>
          </div>
          <div className="divide-y divide-border/30">
            {searchResults.map((result, index) => (
              <div key={index} className="grid grid-cols-6 p-3 items-center hover:bg-secondary/50 transition-colors">
                <div className="col-span-3 truncate" title={result.name}>{result.name}</div>
                <div className="text-center text-sm">{result.size}</div>
                <div className="text-center text-sm">
                  <span className="text-green-500">{result.seeds}</span>
                  <span className="text-muted-foreground mx-1">/</span>
                  <span className="text-red-500">{result.leeches}</span>
                </div>
                <div className="text-center">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleAddTorrent(result.magnetURI)}
                  >
                    Download
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TorrentSearch;
