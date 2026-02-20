import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Designer, RoomType, StylePreference } from '../backend';

export function useGetRecommendedDesigners(
  roomType: RoomType | null,
  stylePreferences: StylePreference[]
) {
  const { actor, isFetching } = useActor();

  return useQuery<Designer[]>({
    queryKey: ['recommendedDesigners', roomType, stylePreferences],
    queryFn: async () => {
      if (!actor) return [];
      
      // Get all designers
      const allDesigners = await actor.getDesigners();
      
      // Filter designers based on style preferences
      if (stylePreferences.length === 0) {
        return allDesigners;
      }
      
      const matchingDesigners = allDesigners.filter((designer) => {
        return designer.styles.some((designerStyle: any) => {
          return stylePreferences.some((prefStyle: any) => {
            if (designerStyle.__kind__ && prefStyle.__kind__) {
              return designerStyle.__kind__ === prefStyle.__kind__;
            }
            return false;
          });
        });
      });
      
      return matchingDesigners.length > 0 ? matchingDesigners : allDesigners.slice(0, 3);
    },
    enabled: !!actor && !isFetching && !!roomType && stylePreferences.length > 0,
  });
}

export function useSelectDesigner() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ briefId, designerId }: { briefId: string; designerId: string }) => {
      if (!actor) throw new Error('Actor not available');
      
      // Store the selection in the backend
      // Note: The backend stores this in the designerSelections map
      // This is a placeholder - the actual backend method would need to be called
      console.log('Selected designer:', designerId, 'for brief:', briefId);
      
      // In a real implementation, you would call something like:
      // await actor.assignDesignerToBrief(briefId, designerId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projectBriefs'] });
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}
