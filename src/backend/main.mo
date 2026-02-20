import List "mo:core/List";
import Map "mo:core/Map";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import Int "mo:core/Int";
import Array "mo:core/Array";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";

actor {
  stable let designerSelections = Map.empty<Principal, DesignerSelection>();

  type DesignerSelection = {
    userId : Principal.Principal;
    designerId : Text;
    timestamp : Int;
  };

  // ===== General Types =====
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

  public type GiftCardPurchase = {
    amount : Nat;
    recipientEmail : Text;
    senderName : Text;
    message : Text;
    deliveryTime : ?Time.Time;
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
    giftCardPurchase : ?GiftCardPurchase;
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

  public type BuyerInfo = {
    name : Text;
    email : Text;
    phone : Text;
    address : Text;
  };

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
  };

  // ===== Vendor Types =====
  public type Vendor = {
    id : Text;
    name : Text;
    gstNumber : Text;
    mobileNumber : Text;
    verified : Bool;
    createdAt : Time.Time;
  };

  public type Otp = {
    code : Text;
    mobileNumber : Text;
    expiryTime : Time.Time;
  };

  public type VerifiedOtp = {
    mobileNumber : Text;
    verifiedAt : Time.Time;
  };

  let packages = Map.empty<Text, Package>();
  let designers = Map.empty<Text, Designer>();
  let briefs = Map.empty<Text, ProjectBrief>();
  let consultations = Map.empty<Text, ConsultationRequest>();
  let notes = Map.empty<Text, List.List<ProjectNote>>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  let orders = Map.empty<Text, Order>();
  var furnitureCategories = Map.empty<Text, FurnitureCategory>();
  let productCategories = Map.empty<Text, ProductCategory>();
  let roomPackages = Map.empty<Text, RoomPackage>();
  let productBrands = Map.empty<Text, ProductBrand>();

  // ===== New Vendor State =====
  let vendors = Map.empty<Text, Vendor>();
  let otps = Map.empty<Text, Otp>();
  let verifiedOtps = Map.empty<Text, VerifiedOtp>();

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // === Room Package Functions ===
  public shared ({ caller }) func addRoomPackage(pkg : RoomPackage) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add room packages");
    };
    roomPackages.add(pkg.id, pkg);
  };

  public query func getRoomPackages() : async [RoomPackage] {
    roomPackages.values().toArray();
  };

  public query func getRoomPackageById(packageId : Text) : async ?RoomPackage {
    roomPackages.get(packageId);
  };

  public query func getPackagesByPriceRange(minPrice : Nat, maxPrice : Nat) : async [RoomPackage] {
    roomPackages.values().toArray().filter(
      func(pkg) { pkg.priceINR >= minPrice and pkg.priceINR <= maxPrice }
    );
  };

  public query func getRoomPackagesByStyle(style : StylePreference) : async [RoomPackage] {
    roomPackages.values().toArray().filter(
      func(pkg) { pkg.style == style }
    );
  };

  public query func getRoomPackagesByRoomType(roomType : RoomType) : async [RoomPackage] {
    roomPackages.values().toArray().filter(
      func(pkg) { pkg.roomType == roomType }
    );
  };

  public query func getRoomPackagesByStyleAndRoomType(style : StylePreference, roomType : RoomType) : async [RoomPackage] {
    roomPackages.values().toArray().filter(
      func(pkg) { pkg.style == style and pkg.roomType == roomType }
    );
  };

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

  public shared ({ caller }) func addPackage(pkg : Package) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add packages");
    };
    packages.add(pkg.id, pkg);
  };

  public query func getPackages() : async [Package] {
    // Return static packages as default data
    let defaultPackages : [Package] = [
      {
        id = "starter";
        name = "Starter Makeover";
        priceINR = 5000;
        description = "A budget-friendly mini-makeover for a single room. Includes design consultation, layout suggestions, and décor recommendations.";
        features = ["1 design consultation (virtual)", "Recommended shopping list", "Personalized style guide"];
      },
      {
        id = "premium";
        name = "Premium Package";
        priceINR = 25000;
        description = "A full-room transformation with custom designs, furniture layout, and styling. Includes 3D renders, shopping recommendations, and virtual support.";
        features = [
          "2 design consultations (virtual or in-person)",
          "3D room renderings",
          "Sourcing assistance for furniture and décor"
        ];
      },
      {
        id = "luxury";
        name = "Luxury Package";
        priceINR = 55000;
        description = "The ultimate design experience for any room or home. Includes everything from the Premium package plus project management and vendor coordination.";
        features = [
          "Up to 3 rooms included",
          "Custom sourced furniture",
          "On-site project management (for major projects)",
        ];
      }
    ];
    defaultPackages;

    // To enable persistence again, change the return value to the following
    // and remove the return statement above this one.
    // packages.values().toArray();
  };

  public shared ({ caller }) func addDesigner(designer : Designer) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add designers");
    };
    designers.add(designer.id, designer);
  };

  public query func getDesigners() : async [Designer] {
    designers.values().toArray();
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

  public query func getProductCategories() : async [ProductCategory] {
    productCategories.values().toArray();
  };

  public query func getProductsByCategory(categoryId : Text) : async [Product] {
    switch (productCategories.get(categoryId)) {
      case (null) {
        Runtime.trap("Category not found");
      };
      case (?category) { category.products };
    };
  };

  public query func getProductBrands() : async [ProductBrand] {
    productBrands.values().toArray();
  };

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

  public query func calculateOrderTotal(items : [OrderItem]) : async Nat {
    var total = 0;
    for (item in items.values()) {
      switch (getProductHelper(item.productId)) {
        case (null) {};
        case (?product) {
          total += product.priceINR * item.quantity;
        };
      };
    };
    total;
  };

  public shared ({ caller }) func placeOrder(
    order : Order,
    buyerInfo : BuyerInfo,
    orderTotal : Nat,
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can place orders");
    };

    // Ownership verification: ensure the order is for the caller
    if (order.buyerId != caller) {
      Runtime.trap("Unauthorized: Can only place orders for yourself");
    };

    // Total and quantity validation
    var calculatedTotal = 0;
    for (item in order.items.values()) {
      if (item.quantity > 1000) {
        Runtime.trap("Invalid quantity requested");
      };
      switch (getProductHelper(item.productId)) {
        case (null) { Runtime.trap("Product not found") };
        case (?product) {
          if (item.quantity > product.inventory) {
            Runtime.trap("Not enough inventory for product " # item.productId);
          };
          calculatedTotal += product.priceINR * item.quantity;
        };
      };
    };
    if (calculatedTotal != orderTotal) {
      Runtime.trap("Order total mismatch. Please try again.");
    };

    // Place order as draft after validation
    orders.add(order.id, order);

    // Persist/update user profile
    let profile : UserProfile = {
      name = buyerInfo.name;
      email = buyerInfo.email;
      phone = buyerInfo.phone;
      address = ?buyerInfo.address;
      stylePreferences = [];
      createdAt = Time.now();
    };
    userProfiles.add(caller, profile);
  };

  func getProductHelper(productId : Text) : ?Product {
    for (category in productCategories.values()) {
      let categoryProduct = category.products.find(func(p) { p.id == productId });
      switch (categoryProduct) {
        case (?product) { return ?product };
        case (null) {};
      };
    };
    for (category in furnitureCategories.values()) {
      let categoryProduct = category.products.find(func(p) { p.id == productId });
      switch (categoryProduct) {
        case (?product) { return ?product };
        case (null) {};
      };
    };
    null;
  };

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

  public query func getFurnitureCategories() : async [FurnitureCategory] {
    furnitureCategories.values().toArray();
  };

  public query func getProductsByFurnitureCategory(categoryId : Text) : async [Product] {
    switch (furnitureCategories.get(categoryId)) {
      case (null) {
        Runtime.trap("Furniture category not found");
      };
      case (?category) { category.products };
    };
  };

  public query func getProductsByFurnitureSubCategory(subCategory : FurnitureSubCategory) : async [Product] {
    var subCategoryProducts : [Product] = [];
    for (category in furnitureCategories.values()) {
      if (category.subCategory == subCategory) {
        subCategoryProducts := subCategoryProducts.concat(category.products);
      };
    };
    subCategoryProducts;
  };

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

  public query func findProductHelper(productId : Text) : async ?Product {
    for (category in productCategories.values()) {
      let categoryProduct = category.products.find(func(p) { p.id == productId });
      switch (categoryProduct) {
        case (?product) { return ?product };
        case (null) {};
      };
    };
    for (category in furnitureCategories.values()) {
      let categoryProduct = category.products.find(func(p) { p.id == productId });
      switch (categoryProduct) {
        case (?product) { return ?product };
        case (null) {};
      };
    };
    null;
  };

  // ===== New Vendor Functions =====

  public type VendorInput = {
    id : Text;
    name : Text;
    gstNumber : Text;
    mobileNumber : Text;
  };

  public type OtpVerification = {
    mobileNumber : Text;
    otp : Text;
  };

  public type OtpRequest = {
    mobileNumber : Text;
  };

  func generateRandomOtp() : Text {
    let random = Int.abs(Time.now() % 1000000000 + 123456789).toNat();
    let otp = random % 1000000;
    let paddedOtp = if (otp < 100000) { otp + 100000 } else { otp };
    paddedOtp.toText();
  };

  // No authorization required - guests need to request OTP for registration
  public func requestOtp(request : OtpRequest) : async () {
    let otpCode = generateRandomOtp();
    let expiryTime = Time.now() + 180_000_000_000;

    let otp = {
      code = otpCode;
      mobileNumber = request.mobileNumber;
      expiryTime;
    };

    otps.add(request.mobileNumber, otp);
  };

  // No authorization required - guests need to verify OTP for registration
  public func verifyOtp(verification : OtpVerification) : async () {
    switch (otps.get(verification.mobileNumber)) {
      case (null) {
        Runtime.trap("OTP expired or does not exist. Please request a new OTP.");
      };
      case (?otp) {
        if (Time.now() > otp.expiryTime) {
          otps.remove(verification.mobileNumber);
          Runtime.trap("OTP expired. Please request a new OTP.");
        };

        if (otp.code != verification.otp) {
          Runtime.trap("Invalid OTP. Please try again.");
        };

        // Mark OTP as verified
        let verifiedOtp : VerifiedOtp = {
          mobileNumber = verification.mobileNumber;
          verifiedAt = Time.now();
        };
        verifiedOtps.add(verification.mobileNumber, verifiedOtp);

        // Remove the OTP after successful verification
        otps.remove(verification.mobileNumber);
      };
    };
  };

  // No authorization required - this is the registration endpoint for new vendors (guests)
  public func registerVendor(input : VendorInput) : async () {
    // Verify that the mobile number has been verified via OTP
    switch (verifiedOtps.get(input.mobileNumber)) {
      case (null) {
        Runtime.trap("Mobile number not verified. Please complete OTP verification first.");
      };
      case (?verified) {
        // Check if verification is still valid (within 10 minutes)
        let verificationAge = Time.now() - verified.verifiedAt;
        if (verificationAge > 600_000_000_000) {
          verifiedOtps.remove(input.mobileNumber);
          Runtime.trap("OTP verification expired. Please verify your mobile number again.");
        };
      };
    };

    // Validate GST number is not empty
    if (input.gstNumber == "") {
      Runtime.trap("GST number is mandatory for vendor registration");
    };

    // Check if vendor with same mobile number already exists
    for (vendor in vendors.values()) {
      if (vendor.mobileNumber == input.mobileNumber) {
        Runtime.trap("A vendor with this mobile number already exists");
      };
    };

    let vendor : Vendor = {
      id = input.id;
      name = input.name;
      gstNumber = input.gstNumber;
      mobileNumber = input.mobileNumber;
      verified = true;
      createdAt = Time.now();
    };

    vendors.add(input.id, vendor);

    // Clean up verified OTP after successful registration
    verifiedOtps.remove(input.mobileNumber);
  };

  // ===== Vendor Query Functions =====

  // Admin-only: View specific vendor details
  public query ({ caller }) func getVendor(id : Text) : async Vendor {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view vendor details");
    };
    switch (vendors.get(id)) {
      case (?vendor) { vendor };
      case (null) {
        Runtime.trap("Vendor not found");
      };
    };
  };

  // Admin-only: View all vendors
  public query ({ caller }) func getAllVendors() : async [Vendor] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all vendors");
    };
    vendors.values().toArray();
  };

  // Admin-only: Search vendors by GST number
  public query ({ caller }) func getVendorsByGstNumber(gstNumber : Text) : async [Vendor] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can search vendors by GST number");
    };
    let filteredVendors = vendors.values().toArray().filter(
      func(vendor) { vendor.gstNumber == gstNumber }
    );
    filteredVendors;
  };

  // Admin-only: Search vendor by mobile number
  public query ({ caller }) func getVendorByMobileNumber(mobileNumber : Text) : async Vendor {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can search vendors by mobile number");
    };
    for (vendor in vendors.values()) {
      if (vendor.mobileNumber == mobileNumber) {
        return vendor;
      };
    };
    Runtime.trap("Vendor not found");
  };

  // Admin-only: Delete vendor
  public shared ({ caller }) func deleteVendor(id : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete vendors");
    };

    switch (vendors.get(id)) {
      case (null) {
        Runtime.trap("Vendor not found");
      };
      case (?_) {
        vendors.remove(id);
      };
    };
  };
};
