import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type Time = bigint;
export interface Designer {
    id: string;
    bio: string;
    portfolio: Array<PortfolioItem>;
    styles: Array<StylePreference>;
    name: string;
}
export interface OrderItem {
    productId: string;
    quantity: bigint;
    price: bigint;
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
export interface ProductBrand {
    id: string;
    name: string;
    description: string;
    logoUrl: string;
}
export interface ProjectNote {
    id: string;
    userId: Principal;
    projectId: string;
    message: string;
    timestamp: Time;
}
export interface FurnitureCategory {
    id: string;
    subCategory: FurnitureSubCategory;
    name: string;
    description: string;
    products: Array<Product>;
}
export interface BudgetRange {
    max: bigint;
    min: bigint;
    currency: string;
}
export interface BuyerInfo {
    name: string;
    email: string;
    address: string;
    phone: string;
}
export interface DeliveryAddress {
    country: string;
    city: string;
    postalCode: string;
    fullName: string;
    state: string;
    addressLine1: string;
    addressLine2?: string;
    phoneNumber: string;
}
export interface OtpRequest {
    mobileNumber: string;
}
export interface Vendor {
    id: string;
    verified: boolean;
    gstNumber: string;
    name: string;
    createdAt: Time;
    mobileNumber: string;
}
export interface ProductCategory {
    id: string;
    name: string;
    description: string;
    products: Array<Product>;
}
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
export interface VendorInput {
    id: string;
    gstNumber: string;
    name: string;
    mobileNumber: string;
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
export interface Package {
    id: string;
    features: Array<string>;
    name: string;
    description: string;
    priceINR: bigint;
}
export interface Order {
    id: string;
    status: string;
    deliveryAddress: DeliveryAddress;
    paymentMethod: PaymentMethod;
    giftCardPurchase?: GiftCardPurchase;
    createdAt: Time;
    totalAmount: bigint;
    buyerId: Principal;
    items: Array<OrderItem>;
}
export interface OtpVerification {
    otp: string;
    mobileNumber: string;
}
export interface RoomPackage {
    id: string;
    productIds: Array<string>;
    name: string;
    description: string;
    style: StylePreference;
    priceINR: bigint;
    roomType: RoomType;
}
export interface GiftCardPurchase {
    deliveryTime?: Time;
    message: string;
    senderName: string;
    amount: bigint;
    recipientEmail: string;
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
export interface Product {
    id: string;
    stylePreference: StylePreference;
    inventory: bigint;
    name: string;
    description: string;
    imageUrl: string;
    brandId: string;
    priceINR: bigint;
    roomType: RoomType;
}
export interface UserProfile {
    name: string;
    createdAt: Time;
    email: string;
    address?: string;
    stylePreferences: Array<StylePreference>;
    phone: string;
}
export enum FurnitureSubCategory {
    bedSideTables = "bedSideTables",
    sofa = "sofa",
    sofaChairs = "sofaChairs",
    cornerTable = "cornerTable",
    studyTable = "studyTable",
    kingSizeBed = "kingSizeBed",
    recliners = "recliners",
    crockeryUnit = "crockeryUnit",
    queenSizeBed = "queenSizeBed",
    dressingTable = "dressingTable",
    centerTable = "centerTable",
    diningTable = "diningTable"
}
export enum PaymentMethod {
    upi = "upi",
    wallet = "wallet",
    netBanking = "netBanking"
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
    addRoomPackage(pkg: RoomPackage): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    calculateOrderTotal(items: Array<OrderItem>): Promise<bigint>;
    createProjectBrief(brief: ProjectBrief): Promise<void>;
    deleteVendor(id: string): Promise<void>;
    findProductHelper(productId: string): Promise<Product | null>;
    getAllVendors(): Promise<Array<Vendor>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getConsultationsForProject(projectId: string): Promise<Array<ConsultationRequest>>;
    getDesigners(): Promise<Array<Designer>>;
    getFurnitureCategories(): Promise<Array<FurnitureCategory>>;
    getNotesForProject(projectId: string): Promise<Array<ProjectNote>>;
    getOrder(orderId: string): Promise<Order | null>;
    getPackages(): Promise<Array<Package>>;
    getPackagesByPriceRange(minPrice: bigint, maxPrice: bigint): Promise<Array<RoomPackage>>;
    getProductBrands(): Promise<Array<ProductBrand>>;
    getProductCategories(): Promise<Array<ProductCategory>>;
    getProductsByBrand(brandId: string): Promise<Array<Product>>;
    getProductsByCategory(categoryId: string): Promise<Array<Product>>;
    getProductsByFurnitureCategory(categoryId: string): Promise<Array<Product>>;
    getProductsByFurnitureSubCategory(subCategory: FurnitureSubCategory): Promise<Array<Product>>;
    getProductsForRoomPackage(packageId: string): Promise<Array<Product>>;
    getProjectBrief(id: string): Promise<ProjectBrief | null>;
    getRoomPackageById(packageId: string): Promise<RoomPackage | null>;
    getRoomPackages(): Promise<Array<RoomPackage>>;
    getRoomPackagesByRoomType(roomType: RoomType): Promise<Array<RoomPackage>>;
    getRoomPackagesByStyle(style: StylePreference): Promise<Array<RoomPackage>>;
    getRoomPackagesByStyleAndRoomType(style: StylePreference, roomType: RoomType): Promise<Array<RoomPackage>>;
    getStyleOptionsForRoomType(roomType: RoomType): Promise<Array<StylePreference>>;
    getUserOrders(userId: Principal): Promise<Array<Order>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getUserProjectBriefs(userId: Principal): Promise<Array<ProjectBrief>>;
    getVendor(id: string): Promise<Vendor>;
    getVendorByMobileNumber(mobileNumber: string): Promise<Vendor>;
    getVendorsByGstNumber(gstNumber: string): Promise<Array<Vendor>>;
    globalProductSearch(searchTerm: string): Promise<Array<Product>>;
    isCallerAdmin(): Promise<boolean>;
    placeOrder(order: Order, buyerInfo: BuyerInfo, orderTotal: bigint): Promise<void>;
    registerVendor(input: VendorInput): Promise<void>;
    requestConsultation(request: ConsultationRequest): Promise<void>;
    requestOtp(request: OtpRequest): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    searchFurnitureProducts(searchTerm: string): Promise<Array<Product>>;
    verifyOtp(verification: OtpVerification): Promise<void>;
}
