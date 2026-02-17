import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';
import type {
  Package,
  Designer,
  ProjectBrief,
  ConsultationRequest,
  ProjectNote,
  UserProfile,
  ProductCategory,
  ProductBrand,
  Product,
  FurnitureSubCategory,
  RoomPackage,
  Order,
  BuyerInfo,
  StylePreference,
  RoomType,
  Vendor,
  OtpRequest,
  OtpVerification,
  VendorInput,
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

export function useCreateProjectBrief() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (brief: ProjectBrief) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createProjectBrief(brief);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projectBriefs'] });
    },
  });
}

export function useGetUserProjectBriefs(userId: string) {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<ProjectBrief[]>({
    queryKey: ['projectBriefs', userId],
    queryFn: async () => {
      if (!actor || !identity) return [];
      return actor.getUserProjectBriefs(identity.getPrincipal());
    },
    enabled: !!actor && !!identity && !isFetching,
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

export function useAddNote() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (note: ProjectNote) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addNote(note);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['notes', variables.projectId] });
    },
  });
}

export function useGetNotesForProject(projectId: string) {
  const { actor, isFetching } = useActor();

  return useQuery<ProjectNote[]>({
    queryKey: ['notes', projectId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getNotesForProject(projectId);
    },
    enabled: !!actor && !isFetching && !!projectId,
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
    queryKey: ['products', 'category', categoryId],
    queryFn: async () => {
      if (!actor) return [];
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
      if (!actor) return [];
      return actor.getProductBrands();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetProductsByBrand(brandId: string) {
  const { actor, isFetching } = useActor();

  return useQuery<Product[]>({
    queryKey: ['products', 'brand', brandId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getProductsByBrand(brandId);
    },
    enabled: !!actor && !isFetching && !!brandId,
  });
}

export function useGetProductsByFurnitureSubCategory(subCategory: FurnitureSubCategory) {
  const { actor, isFetching } = useActor();

  return useQuery<Product[]>({
    queryKey: ['products', 'furniture', subCategory],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getProductsByFurnitureSubCategory(subCategory);
    },
    enabled: !!actor && !isFetching && !!subCategory,
  });
}

export function useGlobalProductSearch(searchTerm: string) {
  const { actor, isFetching } = useActor();

  return useQuery<Product[]>({
    queryKey: ['products', 'search', searchTerm],
    queryFn: async () => {
      if (!actor || !searchTerm.trim()) return [];
      return actor.globalProductSearch(searchTerm);
    },
    enabled: !!actor && !isFetching && !!searchTerm.trim(),
  });
}

export function useGetRoomPackages() {
  const { actor, isFetching } = useActor();

  return useQuery<RoomPackage[]>({
    queryKey: ['roomPackages'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getRoomPackages();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetRoomPackagesByStyleAndRoomType(
  style: StylePreference | null,
  roomType: RoomType | null
) {
  const { actor, isFetching } = useActor();

  return useQuery<RoomPackage[]>({
    queryKey: ['roomPackages', 'filter', style, roomType],
    queryFn: async () => {
      if (!actor) return [];
      if (!style || !roomType) return [];
      return actor.getRoomPackagesByStyleAndRoomType(style, roomType);
    },
    enabled: !!actor && !isFetching && !!style && !!roomType,
  });
}

export function useGetProductsForRoomPackage(packageId: string) {
  const { actor, isFetching } = useActor();

  return useQuery<Product[]>({
    queryKey: ['roomPackage', packageId, 'products'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getProductsForRoomPackage(packageId);
    },
    enabled: !!actor && !isFetching && !!packageId,
  });
}

export function usePlaceOrder() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      order,
      buyerInfo,
      orderTotal,
    }: {
      order: Order;
      buyerInfo: BuyerInfo;
      orderTotal: bigint;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.placeOrder(order, buyerInfo, orderTotal);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useGetUserOrders(userId: string) {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<Order[]>({
    queryKey: ['orders', userId],
    queryFn: async () => {
      if (!actor || !identity) return [];
      return actor.getUserOrders(identity.getPrincipal());
    },
    enabled: !!actor && !!identity && !isFetching,
  });
}

// ===== Vendor Hooks =====

export function useGetAllVendors() {
  const { actor, isFetching } = useActor();

  return useQuery<Vendor[]>({
    queryKey: ['vendors'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllVendors();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useRequestOtp() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (request: OtpRequest) => {
      if (!actor) throw new Error('Actor not available');
      return actor.requestOtp(request);
    },
  });
}

export function useVerifyOtp() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (verification: OtpVerification) => {
      if (!actor) throw new Error('Actor not available');
      return actor.verifyOtp(verification);
    },
  });
}

export function useRegisterVendor() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: VendorInput) => {
      if (!actor) throw new Error('Actor not available');
      return actor.registerVendor(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendors'] });
    },
  });
}
