import Map "mo:core/Map";
import Principal "mo:core/Principal";
import List "mo:core/List";
import Nat "mo:core/Nat";
import Time "mo:core/Time";

module {
  // Type definitions for migration (copied from main.mo)
  type RoomType = {
    #livingRoom;
    #bedroom;
    #diningRoom;
    #office;
    #kidsRoom;
    #other : Text;
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

  type BudgetRange = {
    min : Nat;
    max : Nat;
    currency : Text;
  };

  type Package = {
    id : Text;
    name : Text;
    priceINR : Nat;
    description : Text;
    features : [Text];
  };

  type PortfolioItem = {
    id : Text;
    imageUrl : Text;
    style : StylePreference;
    description : Text;
  };

  type Designer = {
    id : Text;
    name : Text;
    bio : Text;
    styles : [StylePreference];
    portfolio : [PortfolioItem];
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

  type OldActor = {
    packages : Map.Map<Text, Package>;
    designers : Map.Map<Text, Designer>;
    briefs : Map.Map<Text, ProjectBrief>;
    consultations : Map.Map<Text, ConsultationRequest>;
    notes : Map.Map<Text, List.List<ProjectNote>>;
    userProfiles : Map.Map<Principal, UserProfile>;
  };

  // New product category types for migration
  type Product = {
    id : Text;
    name : Text;
    description : Text;
    priceINR : Nat;
    imageUrl : Text;
    roomType : RoomType;
    stylePreference : StylePreference;
  };

  type ProductCategory = {
    id : Text;
    name : Text;
    description : Text;
    products : [Product];
  };

  type NewActor = {
    packages : Map.Map<Text, Package>;
    designers : Map.Map<Text, Designer>;
    briefs : Map.Map<Text, ProjectBrief>;
    consultations : Map.Map<Text, ConsultationRequest>;
    notes : Map.Map<Text, List.List<ProjectNote>>;
    userProfiles : Map.Map<Principal, UserProfile>;
    productCategories : Map.Map<Text, ProductCategory>;
  };

  // Migration function to add productCategories field
  public func run(old : OldActor) : NewActor {
    let initialProductCategories = Map.empty<Text, ProductCategory>();
    {
      old with
      productCategories = initialProductCategories;
    };
  };
};
