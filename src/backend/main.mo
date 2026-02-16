import Map "mo:core/Map";
import Array "mo:core/Array";
import List "mo:core/List";
import Text "mo:core/Text";
import Iter "mo:core/Iter";
import Nat "mo:core/Nat";
import Order "mo:core/Order";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
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
    inventory : Nat;
    imageUrl : Text;
    roomType : RoomType;
    stylePreference : StylePreference;
    brandId : Text;
  };

  public type FurnitureSubCategory = {
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

  public type FurnitureCategory = {
    id : Text;
    name : Text;
    description : Text;
    subCategory : FurnitureSubCategory;
    products : [Product];
  };

  public type ProductCategory = {
    id : Text;
    name : Text;
    description : Text;
    products : [Product];
  };

  public type ProductBrand = {
    id : Text;
    name : Text;
    description : Text;
    logoUrl : Text;
  };

  public type PaymentMethod = {
    #wallet;
    #netBanking;
    #upi;
  };

  public type OrderItem = {
    productId : Text;
    quantity : Nat;
    price : Nat;
  };

  public type DeliveryAddress = {
    fullName : Text;
    addressLine1 : Text;
    addressLine2 : ?Text;
    city : Text;
    state : Text;
    country : Text;
    postalCode : Text;
    phoneNumber : Text;
  };

  public type Order = {
    id : Text;
    buyerId : Principal;
    items : [OrderItem];
    totalAmount : Nat;
    paymentMethod : PaymentMethod;
    status : Text;
    createdAt : Time.Time;
    deliveryAddress : DeliveryAddress;
  };

  public type RoomPackage = {
    id : Text;
    name : Text;
    roomType : RoomType;
    style : StylePreference;
    description : Text;
    productIds : [Text];
    priceINR : Nat;
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

  let packages = Map.empty<Text, Package>();
  let designers = Map.empty<Text, Designer>();
  let briefs = Map.empty<Text, ProjectBrief>();
  let consultations = Map.empty<Text, ConsultationRequest>();
  let notes = Map.empty<Text, List.List<ProjectNote>>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  let orders = Map.empty<Text, Order>();
  let furnitureCategories = Map.empty<Text, FurnitureCategory>();
  let productCategories = Map.empty<Text, ProductCategory>();
  let roomPackages = Map.empty<Text, RoomPackage>();
  let productBrands = Map.empty<Text, ProductBrand>();

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // === Room Package Functions ===
  // Admin-only: Add new room packages
  public shared ({ caller }) func addRoomPackage(pkg : RoomPackage) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add room packages");
    };
    roomPackages.add(pkg.id, pkg);
  };

  // Public browsing: List all room packages (accessible to all including guests)
  public query func getRoomPackages() : async [RoomPackage] {
    roomPackages.values().toArray();
  };

  // Public browsing: Get specific room package (accessible to all including guests)
  public query func getRoomPackageById(packageId : Text) : async ?RoomPackage {
    roomPackages.get(packageId);
  };

  // Public browsing: Filter packages by style (accessible to all including guests)
  public query func getRoomPackagesByStyle(style : StylePreference) : async [RoomPackage] {
    roomPackages.values().toArray().filter(
      func(pkg) { pkg.style == style }
    );
  };

  // Public browsing: Filter packages by room type (accessible to all including guests)
  public query func getRoomPackagesByRoomType(roomType : RoomType) : async [RoomPackage] {
    roomPackages.values().toArray().filter(
      func(pkg) { pkg.roomType == roomType }
    );
  };

  // Public browsing: Filter packages by style and room type (accessible to all including guests)
  public query func getRoomPackagesByStyleAndRoomType(style : StylePreference, roomType : RoomType) : async [RoomPackage] {
    roomPackages.values().toArray().filter(
      func(pkg) { pkg.style == style and pkg.roomType == roomType }
    );
  };

  // Public browsing: Get available styles for a room type (accessible to all including guests)
  public query func getStyleOptionsForRoomType(roomType : RoomType) : async [StylePreference] {
    let filtered = roomPackages.values().toArray().filter(
      func(pkg) { pkg.roomType == roomType }
    );
    let uniqueStyles = List.empty<StylePreference>();

    for (pkg in filtered.values()) {
      let exists = uniqueStyles.any(func(style) { style == pkg.style });
      if (not exists) {
        uniqueStyles.add(pkg.style);
      };
    };

    uniqueStyles.toArray();
  };

  // Public browsing: Resolve package products (accessible to all including guests)
  public query func getProductsForRoomPackage(packageId : Text) : async [Product] {
    switch (roomPackages.get(packageId)) {
      case (null) {
        Runtime.trap("Room package not found");
      };
      case (?pkg) {
        var products : [Product] = [];
        for (category in productCategories.values()) {
          let categoryProducts = category.products.filter(
            func(p) {
              let matches = pkg.productIds.any(func(pid) { pid == p.id });
              matches;
            }
          );
          products := products.concat(categoryProducts);
        };
        products;
      };
    };
  };

  // Admin-only: Add design packages
  public shared ({ caller }) func addPackage(pkg : Package) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add packages");
    };
    packages.add(pkg.id, pkg);
  };

  // Public browsing: List design packages (accessible to all including guests)
  public query func getPackages() : async [Package] {
    packages.values().toArray();
  };

  // Admin-only: Add designers
  public shared ({ caller }) func addDesigner(designer : Designer) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add designers");
    };
    designers.add(designer.id, designer);
  };

  // Public browsing: List designers (accessible to all including guests)
  public query func getDesigners() : async [Designer] {
    designers.values().toArray();
  };

  // User-only: Create project brief (ownership verified)
  public shared ({ caller }) func createProjectBrief(brief : ProjectBrief) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create project briefs");
    };
    if (brief.userId != caller) {
      Runtime.trap("Unauthorized: Can only create projects for yourself");
    };
    briefs.add(brief.id, brief);
  };

  // User-only: Get project brief (ownership or admin verified)
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

  // User-only: Get user's project briefs (ownership or admin verified)
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

  // User-only: Request consultation (ownership verified)
  public shared ({ caller }) func requestConsultation(request : ConsultationRequest) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can request consultations");
    };
    if (request.userId != caller) {
      Runtime.trap("Unauthorized: Can only create consultation requests for yourself");
    };
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

  // User-only: Get consultations for project (ownership or admin verified)
  public query ({ caller }) func getConsultationsForProject(projectId : Text) : async [ConsultationRequest] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view consultations");
    };
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

  // User-only: Add note to project (ownership verified)
  public shared ({ caller }) func addNote(note : ProjectNote) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add notes");
    };
    if (note.userId != caller) {
      Runtime.trap("Unauthorized: Can only create notes for yourself");
    };
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

  // User-only: Get notes for project (ownership or admin verified)
  public query ({ caller }) func getNotesForProject(projectId : Text) : async [ProjectNote] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view notes");
    };
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

  // User-only: Get caller's profile
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can retrieve their profile");
    };
    userProfiles.get(caller);
  };

  // User-only: Get user profile (ownership or admin verified)
  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin)) and user != caller) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  // User-only: Save caller's profile
  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Public browsing: Get product categories (accessible to all including guests)
  public query func getProductCategories() : async [ProductCategory] {
    productCategories.values().toArray();
  };

  // Public browsing: Get products by category (accessible to all including guests)
  public query func getProductsByCategory(categoryId : Text) : async [Product] {
    switch (productCategories.get(categoryId)) {
      case (null) {
        Runtime.trap("Category not found");
      };
      case (?category) { category.products };
    };
  };

  // Public browsing: Get product brands (accessible to all including guests)
  public query func getProductBrands() : async [ProductBrand] {
    productBrands.values().toArray();
  };

  // Public browsing: Get products by brand (accessible to all including guests)
  public query func getProductsByBrand(brandId : Text) : async [Product] {
    switch (productBrands.get(brandId)) {
      case (null) {
        Runtime.trap("Brand not found");
      };
      case (?_) {
        var brandProducts : [Product] = [];
        for (category in productCategories.values()) {
          let categoryProducts = category.products.filter(
            func(p) { p.brandId == brandId }
          );
          brandProducts := brandProducts.concat(categoryProducts);
        };
        brandProducts;
      };
    };
  };

  // User-only: Place order (ownership verified)
  public shared ({ caller }) func placeOrder(order : Order) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can place orders");
    };
    if (order.buyerId != caller) {
      Runtime.trap("Unauthorized: Can only place orders for yourself");
    };
    orders.add(order.id, order);
  };

  // User-only: Get order (ownership or admin verified)
  public query ({ caller }) func getOrder(orderId : Text) : async ?Order {
    let order = orders.get(orderId);
    switch (order) {
      case (?existingOrder) {
        if (existingOrder.buyerId == caller or AccessControl.isAdmin(accessControlState, caller)) {
          order;
        } else {
          Runtime.trap("Unauthorized: Can only access your own orders");
        };
      };
      case (null) { null };
    };
  };

  // User-only: Get user's orders (ownership or admin verified)
  public query ({ caller }) func getUserOrders(userId : Principal) : async [Order] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view orders");
    };
    if (userId != caller and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own orders");
    };
    let filtered = orders.values().toArray().filter(
      func(order) { order.buyerId == userId }
    );
    filtered;
  };

  // Public browsing: Get furniture categories (accessible to all including guests)
  public query func getFurnitureCategories() : async [FurnitureCategory] {
    furnitureCategories.values().toArray();
  };

  // Public browsing: Get products by furniture category (accessible to all including guests)
  public query func getProductsByFurnitureCategory(categoryId : Text) : async [Product] {
    switch (furnitureCategories.get(categoryId)) {
      case (null) {
        Runtime.trap("Furniture category not found");
      };
      case (?category) { category.products };
    };
  };

  // Public browsing: Get products by furniture subcategory (accessible to all including guests)
  public query func getProductsByFurnitureSubCategory(subCategory : FurnitureSubCategory) : async [Product] {
    var subCategoryProducts : [Product] = [];
    for (category in furnitureCategories.values()) {
      if (category.subCategory == subCategory) {
        subCategoryProducts := subCategoryProducts.concat(category.products);
      };
    };
    subCategoryProducts;
  };

  // Public browsing: Search furniture products (accessible to all including guests)
  public query func searchFurnitureProducts(searchTerm : Text) : async [Product] {
    var matchingProducts : [Product] = [];
    for (category in furnitureCategories.values()) {
      let categoryProducts = category.products.filter(
        func(p) {
          p.name.toLower().contains(#text(searchTerm.toLower())) or
          p.description.toLower().contains(#text(searchTerm.toLower()));
        }
      );
      matchingProducts := matchingProducts.concat(categoryProducts);
    };
    matchingProducts;
  };

  // Public browsing: Global product search across all categories (accessible to all including guests)
  public query func globalProductSearch(searchTerm : Text) : async [Product] {
    let lowerSearchTerm = searchTerm.toLower();
    var matchingProducts : [Product] = [];

    // Product categories
    for (category in productCategories.values()) {
      let categoryProducts = category.products.filter(
        func(p) {
          p.name.toLower().contains(#text(lowerSearchTerm)) or
          p.description.toLower().contains(#text(lowerSearchTerm));
        }
      );
      matchingProducts := matchingProducts.concat(categoryProducts);
    };

    // Furniture categories
    for (category in furnitureCategories.values()) {
      let categoryProducts = category.products.filter(
        func(p) {
          p.name.toLower().contains(#text(lowerSearchTerm)) or
          p.description.toLower().contains(#text(lowerSearchTerm));
        }
      );
      matchingProducts := matchingProducts.concat(categoryProducts);
    };

    matchingProducts;
  };
};
