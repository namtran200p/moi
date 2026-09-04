import { useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

export function useRealtime(workspaceId: string, onUpdate: () => void) {
  useEffect(() => {
    if (!workspaceId) return;

    const channel = supabase
      .channel('realtime-workspace')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'transactions',
          filter: `workspace_id=eq.${workspaceId}`,
        },
        () => {
          onUpdate();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [workspaceId, onUpdate]);
}