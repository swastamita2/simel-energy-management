import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, ArrowRight, Loader2 } from 'lucide-react';
import { useEnergy } from '@/contexts/EnergyContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useDebounce } from '@/hooks/use-debounce';
import { SearchResult } from '@/types';

// Static pages data
const staticPages: SearchResult[] = [
  { id: 'p1', type: 'page', title: 'Dashboard', subtitle: 'Main dashboard view', url: '/dashboard' },
  { id: 'p2', type: 'page', title: 'Monitoring', subtitle: 'Real-time device monitoring', url: '/monitoring' },
  { id: 'p3', type: 'page', title: 'Analytics', subtitle: 'Energy analytics and insights', url: '/analytics' },
  { id: 'p4', type: 'page', title: 'Reports', subtitle: 'Generate and view reports', url: '/reports' },
  { id: 'p5', type: 'page', title: 'Users', subtitle: 'User management', url: '/users' },
  { id: 'p6', type: 'page', title: 'Settings', subtitle: 'Application settings', url: '/settings' },
  { id: 'p7', type: 'page', title: 'Automation', subtitle: 'Automation rules', url: '/automation' },
];

const getTypeColor = (type: SearchResult['type']) => {
  switch (type) {
    case 'room':
      return 'bg-blue-500/10 text-blue-700 dark:text-blue-300';
    case 'device':
      return 'bg-green-500/10 text-green-700 dark:text-green-300';
    case 'report':
      return 'bg-purple-500/10 text-purple-700 dark:text-purple-300';
    case 'page':
      return 'bg-orange-500/10 text-orange-700 dark:text-orange-300';
    default:
      return 'bg-gray-500/10 text-gray-700 dark:text-gray-300';
  }
};

const getTypeLabel = (type: SearchResult['type']) => {
  return type.charAt(0).toUpperCase() + type.slice(1);
};

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const SearchDialog = ({ open, onOpenChange }: SearchDialogProps) => {
  const navigate = useNavigate();
  const { devices, rooms } = useEnergy();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  const debouncedQuery = useDebounce(query, 300);

  // Generate search data from real context data
  const searchData = useMemo(() => {
    const roomResults: SearchResult[] = rooms.map(room => ({
      id: `r-${room.id}`,
      type: 'room' as const,
      title: room.name,
      subtitle: `${room.building} • ${room.devicesOn}/${room.totalDevices} devices active`,
      url: '/monitoring',
    }));

    const deviceResults: SearchResult[] = devices.map(device => ({
      id: `d-${device.id}`,
      type: 'device' as const,
      title: device.name,
      subtitle: `${device.room} • ${device.building} • ${device.status === 'on' ? 'Active' : 'Inactive'}`,
      url: '/monitoring',
    }));

    return [...roomResults, ...deviceResults, ...staticPages];
  }, [devices, rooms]);

  // Perform search - memoized to prevent unnecessary recalculations
  const performSearch = useCallback((searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    
    // Simulate API delay
    setTimeout(() => {
      const filtered = searchData.filter(
        (item) =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.subtitle?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setResults(filtered);
      setLoading(false);
    }, 150);
  }, [searchData]);

  // Load recent searches from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('recentSearches');
    if (stored) {
      try {
        setRecentSearches(JSON.parse(stored));
      } catch {
        // Failed to parse, ignore
      }
    }
  }, []);

  // Trigger search when debounced query changes
  useEffect(() => {
    performSearch(debouncedQuery);
  }, [debouncedQuery, performSearch]);

  const saveRecentSearch = useCallback((searchTerm: string) => {
    if (!searchTerm.trim()) return;
    
    const updated = [searchTerm, ...recentSearches.filter(s => s !== searchTerm)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
  }, [recentSearches]);

  const handleResultClick = useCallback((result: SearchResult) => {
    saveRecentSearch(query);
    navigate(result.url);
    onOpenChange(false);
    setQuery('');
  }, [query, saveRecentSearch, onOpenChange, navigate]);

  const handleRecentSearchClick = useCallback((search: string) => {
    setQuery(search);
  }, []);

  const clearRecentSearches = useCallback(() => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onOpenChange(false);
      setQuery('');
    }
  }, [onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0 gap-0">
        <DialogHeader className="p-4 pb-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search devices, rooms, reports..."
              className="pl-10 pr-10 h-12 text-base"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
            {loading && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              </div>
            )}
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[400px] px-4">
          {!query && recentSearches.length > 0 && (
            <div className="py-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-semibold text-muted-foreground uppercase">Recent Searches</p>
                <button
                  onClick={clearRecentSearches}
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  Clear
                </button>
              </div>
              <div className="space-y-1">
                {recentSearches.map((search, index) => (
                  <button
                    key={index}
                    onClick={() => handleRecentSearchClick(search)}
                    className="w-full text-left px-3 py-2 rounded-md hover:bg-muted transition-colors flex items-center justify-between group"
                  >
                    <span className="text-sm">{search}</span>
                    <ArrowRight className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {query && results.length === 0 && !loading && (
            <div className="py-12 text-center">
              <Search className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
              <p className="text-sm text-muted-foreground">No results found for "{query}"</p>
              <p className="text-xs text-muted-foreground mt-1">
                Try different keywords or check your spelling
              </p>
            </div>
          )}

          {query && results.length > 0 && (
            <div className="py-4">
              <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">
                {results.length} Result{results.length !== 1 ? 's' : ''}
              </p>
              <div className="space-y-1">
                {results.map((result) => (
                  <button
                    key={result.id}
                    onClick={() => handleResultClick(result)}
                    className="w-full text-left px-3 py-3 rounded-md hover:bg-muted transition-colors flex items-center justify-between group"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="secondary" className={cn('text-xs', getTypeColor(result.type))}>
                          {getTypeLabel(result.type)}
                        </Badge>
                        <span className="font-medium text-sm truncate">{result.title}</span>
                      </div>
                      {result.subtitle && (
                        <p className="text-xs text-muted-foreground truncate">{result.subtitle}</p>
                      )}
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 ml-2" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </ScrollArea>

        <div className="p-3 border-t bg-muted/30">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-4">
              <span>↑↓ Navigate</span>
              <span>↵ Select</span>
              <span>ESC Close</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
