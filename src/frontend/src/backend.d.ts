import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface ProjectBrief {
    id: string;
    status: string;
    userId: Principal;
    submissionDate: Time;
    selectedPackage?: string;
    stylePreferences: Array<StylePreference>;
    budget: BudgetRange;
    roomType: RoomType;
    timeline: string;
}
export type Time = bigint;
export interface Designer {
    id: string;
    bio: string;
    portfolio: Array<PortfolioItem>;
    styles: Array<StylePreference>;
    name: string;
}
export interface ConsultationRequest {
    id: string;
    status: string;
    userId: Principal;
    projectId?: string;
    notes: string;
    submissionDate: Time;
    requestedTime: Time;
}
export interface Package {
    id: string;
    features: Array<string>;
    name: string;
    description: string;
    priceINR: bigint;
}
export type RoomType = {
    __kind__: "bedroom";
    bedroom: null;
} | {
    __kind__: "other";
    other: string;
} | {
    __kind__: "kidsRoom";
    kidsRoom: null;
} | {
    __kind__: "office";
    office: null;
} | {
    __kind__: "livingRoom";
    livingRoom: null;
} | {
    __kind__: "diningRoom";
    diningRoom: null;
};
export interface ProjectNote {
    id: string;
    userId: Principal;
    projectId: string;
    message: string;
    timestamp: Time;
}
export interface BudgetRange {
    max: bigint;
    min: bigint;
    currency: string;
}
export type StylePreference = {
    __kind__: "other";
    other: string;
} | {
    __kind__: "rustic";
    rustic: null;
} | {
    __kind__: "boho";
    boho: null;
} | {
    __kind__: "traditional";
    traditional: null;
} | {
    __kind__: "minimalist";
    minimalist: null;
} | {
    __kind__: "modern";
    modern: null;
} | {
    __kind__: "contemporary";
    contemporary: null;
};
export interface PortfolioItem {
    id: string;
    description: string;
    style: StylePreference;
    imageUrl: string;
}
export interface ProductCategory {
    id: string;
    name: string;
    description: string;
    products: Array<Product>;
}
export interface UserProfile {
    name: string;
    createdAt: Time;
    email: string;
    address?: string;
    stylePreferences: Array<StylePreference>;
    phone: string;
}
export interface Product {
    id: string;
    stylePreference: StylePreference;
    name: string;
    description: string;
    imageUrl: string;
    priceINR: bigint;
    roomType: RoomType;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addDesigner(designer: Designer): Promise<void>;
    addNote(note: ProjectNote): Promise<void>;
    addPackage(pkg: Package): Promise<void>;
    addProductCategory(category: ProductCategory): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createProjectBrief(brief: ProjectBrief): Promise<void>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getConsultationsForProject(projectId: string): Promise<Array<ConsultationRequest>>;
    getDesigners(): Promise<Array<Designer>>;
    getNotesForProject(projectId: string): Promise<Array<ProjectNote>>;
    getPackages(): Promise<Array<Package>>;
    getProductCategories(): Promise<Array<ProductCategory>>;
    getProductsByCategory(categoryId: string): Promise<Array<Product>>;
    getProjectBrief(id: string): Promise<ProjectBrief | null>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getUserProjectBriefs(userId: Principal): Promise<Array<ProjectBrief>>;
    initializeProductCategories(): Promise<void>;
    isCallerAdmin(): Promise<boolean>;
    requestConsultation(request: ConsultationRequest): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
}
