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
  ProductBrand,
  Order,
  RoomPackage,
  StylePreference,
  RoomType,
  FurnitureSubCategory,
} from '../backend';

export function useGetPackages() {
  const { actor, isFetching } = useActor();

  return useQuery<Package[]>({
    queryKey: ['packages'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
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
      if (!actor) throw new Error('Actor not available');
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
      if (!actor) throw new Error('Actor not available');
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
      if (!actor) throw new Error('Actor not available');
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
      if (!actor) throw new Error('Actor not available');
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
      if (!actor) throw new Error('Actor not available');
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
      if (!actor) throw new Error('Actor not available');
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
      if (!actor) throw new Error('Actor not available');
      return actor.getProductsByCategory(categoryId);
    },
    enabled: !!actor && !isFetching && !!categoryId,
  });
}

export function useGetProductBrands() {
  const { actor, isFetching } = useActor();

  return useQuery<ProductBrand[]>({
    queryKey: ['productBrands'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getProductBrands();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetProductsByBrand(brandId: string) {
  const { actor, isFetching } = useActor();

  return useQuery<Product[]>({
    queryKey: ['productsByBrand', brandId],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getProductsByBrand(brandId);
    },
    enabled: !!actor && !isFetching && !!brandId,
  });
}

export function usePlaceOrder() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (order: Order) => {
      if (!actor) throw new Error('Actor not available');
      return actor.placeOrder(order);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userOrders'] });
    },
    onError: (error: any) => {
      console.error('Place order error:', error);
      throw new Error(error.message || 'Failed to place order');
    },
  });
}

// Room Package Hooks
export function useGetRoomPackages() {
  const { actor, isFetching } = useActor();

  return useQuery<RoomPackage[]>({
    queryKey: ['roomPackages'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getRoomPackages();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetRoomPackageById(packageId: string) {
  const { actor, isFetching } = useActor();

  return useQuery<RoomPackage | null>({
    queryKey: ['roomPackage', packageId],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getRoomPackageById(packageId);
    },
    enabled: !!actor && !isFetching && !!packageId,
  });
}

export function useGetProductsForRoomPackage(packageId: string) {
  const { actor, isFetching } = useActor();

  return useQuery<Product[]>({
    queryKey: ['roomPackageProducts', packageId],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getProductsForRoomPackage(packageId);
    },
    enabled: !!actor && !isFetching && !!packageId,
  });
}

export function useGetRoomPackagesByStyleAndRoomType(
  style: StylePreference | null,
  roomType: RoomType | null
) {
  const { actor, isFetching } = useActor();

  return useQuery<RoomPackage[]>({
    queryKey: ['roomPackagesByStyleAndRoom', style, roomType],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      if (!style || !roomType) return [];
      return actor.getRoomPackagesByStyleAndRoomType(style, roomType);
    },
    enabled: !!actor && !isFetching && !!style && !!roomType,
  });
}

// Global Product Search Hook
export function useGlobalProductSearch(searchTerm: string) {
  const { actor, isFetching } = useActor();
  const normalizedSearchTerm = searchTerm.trim().toLowerCase();

  return useQuery<Product[]>({
    queryKey: ['globalProductSearch', normalizedSearchTerm],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      if (!normalizedSearchTerm) return [];
      return actor.globalProductSearch(normalizedSearchTerm);
    },
    enabled: !!actor && !isFetching && normalizedSearchTerm.length > 0,
  });
}

// Furniture Subcategory Hook
export function useGetProductsByFurnitureSubCategory(subCategory: FurnitureSubCategory) {
  const { actor, isFetching } = useActor();

  return useQuery<Product[]>({
    queryKey: ['productsByFurnitureSubCategory', subCategory],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getProductsByFurnitureSubCategory(subCategory);
    },
    enabled: !!actor && !isFetching,
  });
}
