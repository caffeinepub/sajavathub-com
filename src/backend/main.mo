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

// Attach migration

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

  // Seed packages as part of persistent backend state
  let packages = Map.fromIter<Text, Package>([
    (
      "dcebox",
      {
        id = "dcebox";
        name = "Design Consultation Box";
        priceINR = 3999;
        description = "Expert Room Design - Design Consultation Box provides everything you need to bring your dream space to life. Our experienced designers will expertly select and coordinate furniture, décor, and accessories tailored to your unique style, lifestyle, and budget.";
        features = [
          "Home Rendering and Custom Product Selection",
          "Shopping List",
          "Option to add on a Designer Consultation",
        ];
      },
    ),
    (
      "pro",
      {
        id = "pro";
        name = "Pro Design Package";
        priceINR = 5999;
        description = "Advanced Design Package - The Pro Design Package goes beyond the essentials, offering an elevated interior design experience tailored to your unique taste and needs. Perfect for those seeking a complete transformation, this package includes everything from concept to execution, ensuring a seamless and impressive result.";
        features = [
          "Designer Consultation (In Person or Video)",
          "Home Rendering and Custom Product Selection",
          "Material and Paint Recommendations",
          "Product + Room Shopping List",
        ];
      },
    ),
    (
      "premier",
      {
        id = "premier";
        name = "Premier Design";
        priceINR = 9999;
        description = "High-End Design Package - Our Premier Design package is the ultimate choice for those who desire nothing but the best. This exclusive, high-end service caters to clients looking for luxury, sophistication, and complete customization. From initial concept to final installation, our team of elite designers will guide you through a truly exceptional design journey.";
        features = [
          "Most Experienced Designers",
          "In Person or Video Consultation",
          "Home Planning",
          "Comprehensive Room Rendering",
          "Custom Product Selection",
          "Design Optimized Shopping List",
        ];
      },
    ),
  ].values());

  // Seed designers as persistent backend state
  let designers = Map.fromIter<Text, Designer>([
    (
      "laura_almeida",
      {
        id = "laura_almeida";
        name = "Laura Almeida";
        bio = "Laura is a seasoned Architectural Designer with over 15 years of experience in both residential and commercial projects. Her expertise encompasses a wide range of styles, from traditional to contemporary, ensuring that each design is uniquely tailored to her clients' visions.";
        styles = [#modern, #contemporary, #minimalist];
        portfolio = [];
      },
    ),
    (
      "maria_ribeiro",
      {
        id = "maria_ribeiro";
        name = "Maria Ribeiro";
        bio = "Maria is a renowned Urban Architect known for her sustainable and innovative approach to design. With a focus on community and functionality, Maria transforms spaces into vibrant, eco-friendly environments that foster a sense of well-being and connection.";
        styles = [#rustic, #contemporary, #minimalist];
        portfolio = [];
      },
    ),
    (
      "jonathan_silva",
      {
        id = "jonathan_silva";
        name = "Jonathan Silva";
        bio = "Jonathan is a talented interior designer with a keen eye for detail and a passion for creating harmonious living spaces. His ability to blend textures, colors, and patterns results in aesthetically pleasing and inviting environments for his clients.";
        styles = [#rustic, #boho, #traditional];
        portfolio = [];
      },
    ),
    (
      "gabriel_fernandes",
      {
        id = "gabriel_fernandes";
        name = "Gabriel Fernandes";
        bio = "Gabriel is a versatile designer who excels at merging classic and contemporary design elements. His signature style, characterized by clean lines and subtle sophistication, delivers a timeless aesthetic that withstands changing trends.";
        styles = [#modern, #contemporary, #minimalist];
        portfolio = [];
      },
    ),
    (
      "elisabete_borges",
      {
        id = "elisabete_borges";
        name = "Elisabete Borges";
        bio = "Elisabete is an award-winning interior designer celebrated for her exquisite use of color and texture. Her approach combines classic elegance with modern luxury, resulting in spaces that are both inviting and visually captivating.";
        styles = [#modern, #traditional, #minimalist];
        portfolio = [];
      },
    ),
    (
      "ricardo_monteiro",
      {
        id = "ricardo_monteiro";
        name = "Ricardo Monteiro";
        bio = "Ricardo is a visionary landscape architect who brings a holistic perspective to design. His commitment to sustainability and appreciation of natural beauty has transformed many outdoor spaces into stunning and functional environments.";
        styles = [#modern, #boho, #minimalist];
        portfolio = [];
      },
    ),
    (
      "teresa_martins",
      {
        id = "teresa_martins";
        name = "Teresa Martins";
        bio = "Teresa is a creative design strategist specializing in innovative spatial planning. Her functional yet stylish approach optimizes space utilization and enhances the overall flow and comfort of residential and commercial interiors.";
        styles = [#boho, #contemporary, #minimalist];
        portfolio = [];
      },
    ),
    (
      "ana_sousa",
      {
        id = "ana_sousa";
        name = "Ana Sousa";
        bio = "Ana is a passionate advocate for sustainable design and eco-friendly materials. Her commitment to wellness and natural elements enhances the overall ambiance and health of the spaces she transforms.";
        styles = [#modern, #contemporary, #minimalist];
        portfolio = [];
      },
    ),
  ].values());

  let briefs = Map.empty<Text, ProjectBrief>();
  let consultations = Map.empty<Text, ConsultationRequest>();
  let notes = Map.empty<Text, List.List<ProjectNote>>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  let orders = Map.empty<Text, Order>();

  var productCategories = Map.fromIter<Text, ProductCategory>([
    (
      "homeDecor",
      {
        id = "homeDecor";
        name = "Home Decor";
        description = "Stylish accessories to enhance your home's beauty";
        products = [
          {
            id = "vase1";
            name = "Elegant Porcelain Vase";
            description = "A beautiful centerpiece for your living room or dining table.";
            priceINR = 1200;
            inventory = 50;
            imageUrl = "/images/vase1.jpg";
            roomType = #livingRoom;
            stylePreference = #modern;
            brandId = "brand1";
          },
          {
            id = "wallArt1";
            name = "Abstract Wall Art";
            description = "A modern interpretation that perfectly complements any contemporary space.";
            priceINR = 2200;
            inventory = 30;
            imageUrl = "/images/wallArt1.jpg";
            roomType = #livingRoom;
            stylePreference = #contemporary;
            brandId = "brand2";
          },
        ];
      },
    ),
    (
      "homeFurnishing",
      {
        id = "homeFurnishing";
        name = "Home Furnishing";
        description = "High-quality decor and functional accessories to refine your living spaces";
        products = [
          {
            id = "cushionSet";
            name = "Luxury Cushion Set";
            description = "Includes 4 decorative pillows in a sophisticated neutral color palette.";
            priceINR = 1800;
            inventory = 25;
            imageUrl = "/images/cushionSet.jpg";
            roomType = #livingRoom;
            stylePreference = #minimalist;
            brandId = "brand1";
          },
          {
            id = "tableRunner";
            name = "Artisan Table Runner";
            description = "Handcrafted linen table runner with floral patterns.";
            priceINR = 900;
            inventory = 60;
            imageUrl = "/images/tableRunner.jpg";
            roomType = #diningRoom;
            stylePreference = #traditional;
            brandId = "brand2";
          },
        ];
      },
    ),
  ].values());

  let productBrands = Map.empty<Text, ProductBrand>();
  // Store persistent room packages (curated product sets)
  var roomPackages = Map.fromIter<Text, RoomPackage>([
    (
      "living-modern",
      {
        id = "living-modern";
        name = "Modern Living Room Package";
        roomType = #livingRoom;
        style = #modern;
        description = "A sleek, contemporary living room design featuring bold lines and minimalist decor.";
        productIds = ["sofa-modern", "coffee-table-minimal", "area-rug-abstract"];
        priceINR = 20000;
      },
    ),
    (
      "bedroom-rustic",
      {
        id = "bedroom-rustic";
        name = "Rustic Bedroom Package";
        roomType = #bedroom;
        style = #rustic;
        description = "Embrace the charm of aged wood, natural textures, and organic warmth with our Rustic Bedroom package.";
        productIds = ["platform-bed-rustic", "reclaimed-nightstands", "wool-area-rug"];
        priceINR = 25000;
      },
    ),
    (
      "dining-minimal",
      {
        id = "dining-minimal";
        name = "Minimalist Dining Room Package";
        roomType = #diningRoom;
        style = #minimalist;
        description = "Clean lines, neutral tones, and clutter-free design come together in our Minimalist Dining Room package.";
        productIds = ["dining-table-minimalist", "upholstered-chairs-set", "glass-vase-centerpiece"];
        priceINR = 18000;
      },
    ),
    (
      "office-boho",
      {
        id = "office-boho";
        name = "Bohemian Home Office Package";
        roomType = #office;
        style = #boho;
        description = "Mix patterns, textures, and colors for a creative and inspiring workspace with our Bohemian Home Office package.";
        productIds = ["midcentury-desk", "acrylic-chair", "woven-wall-hanging"];
        priceINR = 15000;
      },
    ),
  ].values());

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
};
