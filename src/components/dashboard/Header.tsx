import { useState } from 'react';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { NotificationCenter } from './NotificationCenter';
import { SearchDialog } from './SearchDialog';

export const Header = () => {
  const [searchOpen, setSearchOpen] = useState(false);

  // Keyboard shortcut for search (Ctrl+K or Cmd+K)
  useState(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  return (
    <>
      <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-6">
        {/* Search */}
        <div className="flex-1 max-w-md">
          <Button
            variant="outline"
            className="w-full justify-start text-muted-foreground hover:text-foreground bg-muted/50 border-0"
            onClick={() => setSearchOpen(true)}
          >
            <Search className="mr-2 h-4 w-4" />
            <span>Search devices, rooms, reports...</span>
            <Badge variant="secondary" className="ml-auto text-xs">
              Ctrl+K
            </Badge>
          </Button>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Notifications */}
          <NotificationCenter />

          {/* Status Indicator */}
          <div className="flex items-center gap-2 rounded-lg bg-success/10 px-3 py-2">
            <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
            <span className="text-sm font-medium text-success">All Systems Normal</span>
          </div>
        </div>
      </header>

      {/* Search Dialog */}
      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  );
};
