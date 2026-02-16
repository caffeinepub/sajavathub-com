import Map "mo:core/Map";
import List "mo:core/List";
import Principal "mo:core/Principal";
import Nat "mo:core/Nat";
import Text "mo:core/Text";
import Time "mo:core/Time";
import AccessControl "authorization/access-control";

module {
  // Old types (from original actor)
  type OldProductCategory = {
    id : Text;
    name : Text;
    description : Text;
    products : [OldProduct];
  };

  type OldProduct = {
    id : Text;
    name : Text;
    description : Text;
    priceINR : Nat;
    inventory : Nat;
    imageUrl : Text;
    roomType : RoomType;
    stylePreference : StylePreference;
    brandId : Text;
  };

  type OldRoomPackage = {
    id : Text;
    name : Text;
    roomType : RoomType;
    style : StylePreference;
    description : Text;
    productIds : [Text];
    priceINR : Nat;
  };

  type StylePreference = {
    #modern;
    #traditional;
    #contemporary;
    #boho;
    #minimalist;
    #rustic;
    #other : Text;
  };

  type RoomType = {
    #livingRoom;
    #bedroom;
    #diningRoom;
    #office;
    #kidsRoom;
    #other : Text;
  };

  type Package = {
    id : Text;
    name : Text;
    priceINR : Nat;
    description : Text;
    features : [Text];
  };

  type Designer = {
    id : Text;
    name : Text;
    bio : Text;
    styles : [StylePreference];
    portfolio : [PortfolioItem];
  };

  type PortfolioItem = {
    id : Text;
    imageUrl : Text;
    style : StylePreference;
    description : Text;
  };

  type ProjectBrief = {
    id : Text;
    userId : Principal;
    roomType : RoomType;
    stylePreferences : [StylePreference];
    budget : BudgetRange;
    timeline : Text;
    selectedPackage : ?Text;
    submissionDate : Time.Time;
    status : Text;
  };

  type BudgetRange = {
    min : Nat;
    max : Nat;
    currency : Text;
  };

  type ConsultationRequest = {
    id : Text;
    userId : Principal;
    projectId : ?Text;
    requestedTime : Time.Time;
    notes : Text;
    status : Text;
    submissionDate : Time.Time;
  };

  type ProjectNote = {
    id : Text;
    userId : Principal;
    projectId : Text;
    message : Text;
    timestamp : Time.Time;
  };

  type UserProfile = {
    name : Text;
    email : Text;
    phone : Text;
    address : ?Text;
    stylePreferences : [StylePreference];
    createdAt : Time.Time;
  };

  type PaymentMethod = {
    #wallet;
    #netBanking;
    #upi;
  };

  type OldOrderItem = {
    productId : Text;
    quantity : Nat;
    price : Nat;
  };

  type OldDeliveryAddress = {
    fullName : Text;
    addressLine1 : Text;
    addressLine2 : ?Text;
    city : Text;
    state : Text;
    country : Text;
    postalCode : Text;
    phoneNumber : Text;
  };

  type OldOrder = {
    id : Text;
    buyerId : Principal;
    items : [OldOrderItem];
    totalAmount : Nat;
    paymentMethod : PaymentMethod;
    status : Text;
    createdAt : Time.Time;
    deliveryAddress : OldDeliveryAddress;
  };

  type ProductBrand = {
    id : Text;
    name : Text;
    description : Text;
    logoUrl : Text;
  };

  // New furniture types
  type FurnitureSubCategory = {
    #sofa;
    #centerTable;
    #diningTable;
    #cornerTable;
    #kingSizeBed;
    #queenSizeBed;
    #bedSideTables;
    #dressingTable;
    #studyTable;
    #sofaChairs;
    #recliners;
    #crockeryUnit;
  };

  type FurnitureCategory = {
    id : Text;
    name : Text;
    description : Text;
    subCategory : FurnitureSubCategory;
    products : [OldProduct];
  };

  // Old actor type
  type OldActor = {
    productCategories : Map.Map<Text, OldProductCategory>;
    roomPackages : Map.Map<Text, OldRoomPackage>;
    packages : Map.Map<Text, Package>;
    designers : Map.Map<Text, Designer>;
    briefs : Map.Map<Text, ProjectBrief>;
    consultations : Map.Map<Text, ConsultationRequest>;
    notes : Map.Map<Text, List.List<ProjectNote>>;
    userProfiles : Map.Map<Principal, UserProfile>;
    orders : Map.Map<Text, OldOrder>;
    productBrands : Map.Map<Text, ProductBrand>;
    accessControlState : AccessControl.AccessControlState;
  };

  // New actor type
  type NewActor = {
    productCategories : Map.Map<Text, OldProductCategory>;
    furnitureCategories : Map.Map<Text, FurnitureCategory>;
    roomPackages : Map.Map<Text, OldRoomPackage>;
    packages : Map.Map<Text, Package>;
    designers : Map.Map<Text, Designer>;
    briefs : Map.Map<Text, ProjectBrief>;
    consultations : Map.Map<Text, ConsultationRequest>;
    notes : Map.Map<Text, List.List<ProjectNote>>;
    userProfiles : Map.Map<Principal, UserProfile>;
    orders : Map.Map<Text, OldOrder>;
    productBrands : Map.Map<Text, ProductBrand>;
    accessControlState : AccessControl.AccessControlState;
  };

  public func run(old : OldActor) : NewActor {
    let emptyFurnitureCategories = Map.empty<Text, FurnitureCategory>();
    { old with furnitureCategories = emptyFurnitureCategories };
  };
};
