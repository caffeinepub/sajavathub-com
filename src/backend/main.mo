import Map "mo:core/Map";
import Array "mo:core/Array";
import List "mo:core/List";
import Text "mo:core/Text";
import Iter "mo:core/Iter";
import Nat "mo:core/Nat";
import Order "mo:core/Order";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import Migration "migration";

(with migration = Migration.run)
actor {
  // ===== Types =====
  public type RoomType = {
    #livingRoom;
    #bedroom;
    #diningRoom;
    #office;
    #kidsRoom;
    #other : Text;
  };

  public type StylePreference = {
    #modern;
    #traditional;
    #contemporary;
    #boho;
    #minimalist;
    #rustic;
    #other : Text;
  };

  public type BudgetRange = {
    min : Nat;
    max : Nat;
    currency : Text;
  };

  public type Package = {
    id : Text;
    name : Text;
    priceINR : Nat;
    description : Text;
    features : [Text];
  };

  public type PortfolioItem = {
    id : Text;
    imageUrl : Text;
    style : StylePreference;
    description : Text;
  };

  public type Designer = {
    id : Text;
    name : Text;
    bio : Text;
    styles : [StylePreference];
    portfolio : [PortfolioItem];
  };

  public type ProjectBrief = {
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

  public type ConsultationRequest = {
    id : Text;
    userId : Principal;
    projectId : ?Text;
    requestedTime : Time.Time;
    notes : Text;
    status : Text;
    submissionDate : Time.Time;
  };

  public type ProjectNote = {
    id : Text;
    userId : Principal;
    projectId : Text;
    message : Text;
    timestamp : Time.Time;
  };

  public type UserProfile = {
    name : Text;
    email : Text;
    phone : Text;
    address : ?Text;
    stylePreferences : [StylePreference];
    createdAt : Time.Time;
  };

  public type Product = {
    id : Text;
    name : Text;
    description : Text;
    priceINR : Nat;
    imageUrl : Text;
    roomType : RoomType;
    stylePreference : StylePreference;
  };

  public type ProductCategory = {
    id : Text;
    name : Text;
    description : Text;
    products : [Product];
  };

  // Array extensions
  module ArrayExtras {
    public func mapMaybe<T, R>(array : [T], f : T -> ?R) : [R] {
      let results = List.empty<R>();
      for (elem in array.values()) {
        switch (f(elem)) {
          case (?value) { results.add(value) };
          case (null) {};
        };
      };
      results.toArray();
    };

    public func filter<T>(array : [T], predicate : T -> Bool) : [T] {
      let results = List.empty<T>();
      for (elem in array.values()) {
        if (predicate(elem)) { results.add(elem) };
      };
      results.toArray();
    };

    public func sort<T>(array : [T], compare : (T, T) -> Order.Order) : [T] {
      array.sort();
    };
  };

  // Maps
  let packages = Map.empty<Text, Package>();
  let designers = Map.empty<Text, Designer>();
  let briefs = Map.empty<Text, ProjectBrief>();
  let consultations = Map.empty<Text, ConsultationRequest>();
  let notes = Map.empty<Text, List.List<ProjectNote>>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  let productCategories = Map.empty<Text, ProductCategory>(); // New product category store

  // Authorization state
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // === Package Functions ===
  public shared ({ caller }) func addPackage(pkg : Package) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add packages");
    };
    packages.add(pkg.id, pkg);
  };

  public query ({ caller }) func getPackages() : async [Package] {
    packages.values().toArray();
  };

  // === Designer Functions ===
  public shared ({ caller }) func addDesigner(designer : Designer) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add designers");
    };
    designers.add(designer.id, designer);
  };

  public query ({ caller }) func getDesigners() : async [Designer] {
    designers.values().toArray();
  };

  // === Project Brief Functions ===
  public query ({ caller }) func getProjectBrief(id : Text) : async ?ProjectBrief {
    let brief = briefs.get(id);
    switch (brief) {
      case (?existingBrief) {
        if (existingBrief.userId == caller or AccessControl.isAdmin(accessControlState, caller)) {
          brief;
        } else {
          Runtime.trap("Unauthorized: Can only access your own projects");
        };
      };
      case (null) { null };
    };
  };

  public query ({ caller }) func getUserProjectBriefs(userId : Principal) : async [ProjectBrief] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view project briefs");
    };
    if (userId != caller and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own projects");
    };
    let filtered = briefs.values().toArray().filter(
      func(project) { project.userId == userId }
    );
    filtered;
  };

  public shared ({ caller }) func createProjectBrief(brief : ProjectBrief) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create project briefs");
    };
    if (brief.userId != caller) {
      Runtime.trap("Unauthorized: Can only create projects for yourself");
    };
    briefs.add(brief.id, brief);
  };

  // === Consultation Functions ===
  public shared ({ caller }) func requestConsultation(request : ConsultationRequest) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can request consultations");
    };
    if (request.userId != caller) {
      Runtime.trap("Unauthorized: Can only create consultation requests for yourself");
    };
    // Verify project ownership if projectId is provided
    switch (request.projectId) {
      case (?projectId) {
        switch (briefs.get(projectId)) {
          case (?project) {
            if (project.userId != caller) {
              Runtime.trap("Unauthorized: Can only request consultations for your own projects");
            };
          };
          case (null) {
            Runtime.trap("Project not found");
          };
        };
      };
      case (null) {};
    };
    consultations.add(request.id, request);
  };

  public query ({ caller }) func getConsultationsForProject(projectId : Text) : async [ConsultationRequest] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view consultations");
    };
    // Verify project ownership
    switch (briefs.get(projectId)) {
      case (?project) {
        if (project.userId != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only view consultations for your own projects");
        };
      };
      case (null) {
        Runtime.trap("Project not found");
      };
    };
    consultations.values().toArray().filter(func(c) { switch (c.projectId) { case (?pid) { pid == projectId }; case (_) { false } } });
  };

  // === Project Notes Functions ===
  public shared ({ caller }) func addNote(note : ProjectNote) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add notes");
    };
    if (note.userId != caller) {
      Runtime.trap("Unauthorized: Can only create notes for yourself");
    };
    // Verify project ownership
    switch (briefs.get(note.projectId)) {
      case (?project) {
        if (project.userId != caller) {
          Runtime.trap("Unauthorized: Can only add notes to your own projects");
        };
      };
      case (null) {
        Runtime.trap("Project not found");
      };
    };
    switch (notes.get(note.projectId)) {
      case (null) { notes.add(note.projectId, List.singleton<ProjectNote>(note)) };
      case (?existing) { existing.add(note) };
    };
  };

  public query ({ caller }) func getNotesForProject(projectId : Text) : async [ProjectNote] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view notes");
    };
    // Verify project ownership
    switch (briefs.get(projectId)) {
      case (?project) {
        if (project.userId != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only view notes for your own projects");
        };
      };
      case (null) {
        Runtime.trap("Project not found");
      };
    };
    switch (notes.get(projectId)) {
      case (null) { [] };
      case (?existing) { existing.toArray() };
    };
  };

  // === User Profile Functions ===
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can retrieve their profile");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin)) and user != caller) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // === Product Category Functions ===
  public query ({ caller }) func getProductCategories() : async [ProductCategory] {
    productCategories.values().toArray();
  };

  public query ({ caller }) func getProductsByCategory(categoryId : Text) : async [Product] {
    switch (productCategories.get(categoryId)) {
      case (null) {
        Runtime.trap("Category not found");
      };
      case (?category) { category.products };
    };
  };

  public shared ({ caller }) func addProductCategory(category : ProductCategory) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add categories");
    };
    productCategories.add(category.id, category);
  };

  // Initial seed for product categories
  public shared ({ caller }) func initializeProductCategories() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can initialize categories");
    };

    let seedCategories = [
      {
        id = "living-room-furniture";
        name = "Living Room Furniture";
        description = "Sofas, Coffee Tables, TV Units, etc.";
        products = [
          {
            id = "sofa-1";
            name = "Modern 3-Seater Sofa";
            description = "Comfortable modern sofa";
            priceINR = 40000;
            imageUrl = "https://images.unsplash.com/photo-1506744038136-46273834b3fb";
            roomType = #livingRoom;
            stylePreference = #modern;
          },
        ];
      },
      {
        id = "bedroom-furniture";
        name = "Bedroom Furniture";
        description = "Beds, Wardrobes, Nightstands";
        products = [
          {
            id = "bed-1";
            name = "King Size Bed";
            description = "Elegant king size bed";
            priceINR = 55000;
            imageUrl = "https://images.unsplash.com/photo-1519710164239-da123dc03ef4";
            roomType = #bedroom;
            stylePreference = #traditional;
          },
        ];
      },
    ];
    for (category in seedCategories.values()) {
      productCategories.add(category.id, category);
    };
  };
};
