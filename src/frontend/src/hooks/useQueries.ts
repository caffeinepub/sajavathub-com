import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type {
  Package,
  Designer,
  ProjectBrief,
  ConsultationRequest,
  ProjectNote,
  UserProfile,
  ProductCategory,
  Product,
} from '../backend';

export function useGetPackages() {
  const { actor, isFetching } = useActor();

  return useQuery<Package[]>({
    queryKey: ['packages'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getPackages();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetDesigners() {
  const { actor, isFetching } = useActor();

  return useQuery<Designer[]>({
    queryKey: ['designers'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getDesigners();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetUserProjectBriefs(userId: string) {
  const { actor, isFetching } = useActor();

  return useQuery<ProjectBrief[]>({
    queryKey: ['userProjectBriefs', userId],
    queryFn: async () => {
      if (!actor) return [];
      const principal = { toText: () => userId } as any;
      return actor.getUserProjectBriefs(principal);
    },
    enabled: !!actor && !isFetching && !!userId,
  });
}

export function useGetProjectBrief(projectId: string) {
  const { actor, isFetching } = useActor();

  return useQuery<ProjectBrief | null>({
    queryKey: ['projectBrief', projectId],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getProjectBrief(projectId);
    },
    enabled: !!actor && !isFetching && !!projectId,
  });
}

export function useCreateProjectBrief() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (brief: ProjectBrief) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createProjectBrief(brief);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProjectBriefs'] });
    },
  });
}

export function useRequestConsultation() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (request: ConsultationRequest) => {
      if (!actor) throw new Error('Actor not available');
      return actor.requestConsultation(request);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['consultations'] });
    },
  });
}

export function useGetConsultationsForProject(projectId: string) {
  const { actor, isFetching } = useActor();

  return useQuery<ConsultationRequest[]>({
    queryKey: ['consultations', projectId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getConsultationsForProject(projectId);
    },
    enabled: !!actor && !isFetching && !!projectId,
  });
}

export function useGetNotesForProject(projectId: string) {
  const { actor, isFetching } = useActor();

  return useQuery<ProjectNote[]>({
    queryKey: ['projectNotes', projectId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getNotesForProject(projectId);
    },
    enabled: !!actor && !isFetching && !!projectId,
  });
}

export function useAddNote() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (note: ProjectNote) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addNote(note);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['projectNotes', variables.projectId] });
    },
  });
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useGetProductCategories() {
  const { actor, isFetching } = useActor();

  return useQuery<ProductCategory[]>({
    queryKey: ['productCategories'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getProductCategories();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetProductsByCategory(categoryId: string) {
  const { actor, isFetching } = useActor();

  return useQuery<Product[]>({
    queryKey: ['productsByCategory', categoryId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getProductsByCategory(categoryId);
    },
    enabled: !!actor && !isFetching && !!categoryId,
  });
}
