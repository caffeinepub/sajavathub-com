import Map "mo:core/Map";
import List "mo:core/List";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import Array "mo:core/Array";
import AccessControl "authorization/access-control";

module {
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

  type Product = {
    id : Text;
    name : Text;
    description : Text;
    priceINR : Nat;
    inventory : Nat;
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

  type OldActor = {
    packages : Map.Map<Text, Package>;
    designers : Map.Map<Text, Designer>;
    briefs : Map.Map<Text, ProjectBrief>;
    consultations : Map.Map<Text, ConsultationRequest>;
    notes : Map.Map<Text, List.List<ProjectNote>>;
    userProfiles : Map.Map<Principal, UserProfile>;
    productCategories : Map.Map<Text, ProductCategory>;
    accessControlState : AccessControl.AccessControlState;
  };

  type NewActor = OldActor;

  public func run(old : OldActor) : NewActor {
    // Create new product categories
    let livingRoomProducts : [Product] = [
      {
        id = "lr-sofa";
        name = "Cozy Three-Seater Sofa";
        description = "Comfortable modern sofa with neutral upholstery.";
        priceINR = 45000;
        inventory = 10;
        imageUrl = "https://cdn.shopify.com/s/files/1/0636/2833/7284/files/Living_Room_Sofa.png";
        roomType = #livingRoom;
        stylePreference = #modern;
      },
      {
        id = "lr-coffee-table";
        name = "Glass Coffee Table";
        description = "Sleek glass coffee table with chrome legs.";
        priceINR = 14000;
        inventory = 15;
        imageUrl = "https://www.ikea.com/us/en/images/products/lack-coffee-table-white__13611_pe046306_s5.jpg";
        roomType = #livingRoom;
        stylePreference = #contemporary;
      },
      {
        id = "lr-armchair";
        name = "Accent Armchair";
        description = "Stylish accent chair for extra seating.";
        priceINR = 12000;
        inventory = 8;
        imageUrl = "https://hips.hearstapps.com/hmg-prod/images/target-cane-armchair-1646078163.png";
        roomType = #livingRoom;
        stylePreference = #modern;
      },
      {
        id = "lr-entertainment-unit";
        name = "Entertainment Unit";
        description = "Modern media center with shelves.";
        priceINR = 20000;
        inventory = 5;
        imageUrl = "https://cdn.shopify.com/s/files/1/0725/0474/2187/files/Living_Room_Furniture.png";
        roomType = #livingRoom;
        stylePreference = #contemporary;
      },
    ];

    let bedroomProducts : [Product] = [
      {
        id = "bd-bed";
        name = "Queen Bed Frame";
        description = "Solid wood bed frame with headboard.";
        priceINR = 35000;
        inventory = 12;
        imageUrl = "https://www.ikea.com/us/en/images/products/malm-bed-frame-white__13621_pe046319_s5.jpg";
        roomType = #bedroom;
        stylePreference = #modern;
      },
      {
        id = "bd-nightstands";
        name = "Nightstand Set";
        description = "Pair of matching nightstands with drawers.";
        priceINR = 11000;
        inventory = 20;
        imageUrl = "https://hips.hearstapps.com/vader-prod.s3.amazonaws.com/1689962056-81asz4ud4wl-ac-sl1500-649d7fd96fa31.jpg";
        roomType = #bedroom;
        stylePreference = #minimalist;
      },
      {
        id = "bd-wardrobe";
        name = "Wardrobe";
        description = "Spacious wardrobe with hanging and shelf storage.";
        priceINR = 25000;
        inventory = 6;
        imageUrl = "https://cdn.shopify.com/s/files/1/0725/0474/2187/files/Wardrobe.png";
        roomType = #bedroom;
        stylePreference = #contemporary;
      },
      {
        id = "bd-dresser";
        name = "Dresser";
        description = "Six-drawer dresser for extra storage.";
        priceINR = 12000;
        inventory = 10;
        imageUrl = "https://www.ikea.com/in/en/images/products/malm-chest-of-6-drawers-white__0541772_pe653112_s5.jpg";
        roomType = #bedroom;
        stylePreference = #modern;
      },
    ];

    let diningRoomProducts : [Product] = [
      {
        id = "dr-table";
        name = "Dining Table";
        description = "Large dining table with seating up to 8.";
        priceINR = 38000;
        inventory = 4;
        imageUrl = "https://www.ikea.com/in/en/images/products/ekedalen-extendable-table-brown__0634198_pe696823_s5.jpg";
        roomType = #diningRoom;
        stylePreference = #traditional;
      },
      {
        id = "dr-chairs";
        name = "Dining Chairs";
        description = "Set of 4 dining chairs with fabric upholstery.";
        priceINR = 15000;
        inventory = 8;
        imageUrl = "https://cdn.shopify.com/s/files/1/0725/0474/2187/files/Dining_Chair.png";
        roomType = #diningRoom;
        stylePreference = #contemporary;
      },
      {
        id = "dr-sideboard";
        name = "Sideboard Buffet";
        description = "Sideboard for extra dish and glass storage.";
        priceINR = 22000;
        inventory = 5;
        imageUrl = "https://hips.hearstapps.com/hmg-prod/images/modern-dining-room-sideboard-1549673789.jpg";
        roomType = #diningRoom;
        stylePreference = #modern;
      },
    ];

    let officeProducts : [Product] = [
      {
        id = "ofc-desk";
        name = "Writing Desk";
        description = "Spacious writing desk with drawers.";
        priceINR = 18000;
        inventory = 10;
        imageUrl = "https://cdn.shopify.com/s/files/1/0725/0474/2187/files/Writing_Desk.png";
        roomType = #office;
        stylePreference = #minimalist;
      },
      {
        id = "ofc-chair";
        name = "Ergonomic Office Chair";
        description = "Fully adjustable office chair with lumbar support.";
        priceINR = 9999;
        inventory = 15;
        imageUrl = "https://www.ikea.com/in/en/images/products/malld-works-chair-white__0536776_pe650406_s5.jpg";
        roomType = #office;
        stylePreference = #modern;
      },
      {
        id = "ofc-bookshelf";
        name = "Bookshelf";
        description = "Tall bookshelf for organization.";
        priceINR = 8000;
        inventory = 7;
        imageUrl = "https://www.ikea.com/gb/en/images/products/billy-bookcase-white__0625599_pe692385_s5.jpg";
        roomType = #office;
        stylePreference = #contemporary;
      },
    ];

    let kidsRoomProducts : [Product] = [
      {
        id = "kr-bed";
        name = "Bunk Bed";
        description = "Fun bunk bed design for kids.";
        priceINR = 21000;
        inventory = 6;
        imageUrl = "https://img.shop.com/Image/250000/254400/254428/products/632025289.jpg";
        roomType = #kidsRoom;
        stylePreference = #contemporary;
      },
      {
        id = "kr-bookshelf";
        name = "Childrens Bookshelf";
        description = "Bookshelf sized for kids.";
        priceINR = 2999;
        inventory = 20;
        imageUrl = "https://www.ikea.com/us/en/images/products/malarp-boo-white__0634484_pe696994_s5.jpg";
        roomType = #kidsRoom;
        stylePreference = #contemporary;
      },
      {
        id = "kr-study-desk";
        name = "Kids Study Desk";
        description = "Study desk designed for children.";
        priceINR = 7999;
        inventory = 8;
        imageUrl = "https://cdn.shopify.com/s/files/1/0725/0474/2187/files/Study_Desk.png";
        roomType = #kidsRoom;
        stylePreference = #modern;
      },
    ];

    let furnishingProducts : [Product] = [
      {
        id = "furn-curtains";
        name = "Elegant Curtains";
        description = "Beautiful blackout curtains for any room.";
        priceINR = 2999;
        inventory = 50;
        imageUrl = "https://cdn.shopify.com/s/files/1/0725/0474/2187/files/Curtains.png";
        roomType = #other("Living Room");
        stylePreference = #contemporary;
      },
      {
        id = "furn-rugs";
        name = "Handwoven Rug";
        description = "Stylish handwoven area rug.";
        priceINR = 5999;
        inventory = 30;
        imageUrl = "https://img.shop.com/Image/250000/254400/254428/products/557653539.jpg";
        roomType = #other("Bedroom");
        stylePreference = #modern;
      },
      {
        id = "furn-cushions";
        name = "Decorative Cushions";
        description = "Set of 4 decorative cushions.";
        priceINR = 2199;
        inventory = 40;
        imageUrl = "https://www.ikea.com/in/en/images/products/gurl-lb-cushion-cover-pink-blue__0216339_pe371037_s5.jpg";
        roomType = #other("Living Room");
        stylePreference = #boho;
      },
      {
        id = "furn-bedding";
        name = "Premium Bedding Set";
        description = "Luxurious bedding set for comfort.";
        priceINR = 9299;
        inventory = 15;
        imageUrl = "https://cdn.shopify.com/s/files/1/0725/0474/2187/files/Bedding_Set.png";
        roomType = #other("Bedroom");
        stylePreference = #modern;
      },
    ];

    let decorProducts : [Product] = [
      {
        id = "dec-art";
        name = "Wall Art Collection";
        description = "Set of 3 framed wall arts.";
        priceINR = 3499;
        inventory = 25;
        imageUrl = "https://cdn.shopify.com/s/files/1/0725/0474/2187/files/Wall_Art.png";
        roomType = #other("Living Room");
        stylePreference = #contemporary;
      },
      {
        id = "dec-lamps";
        name = "Ambient Floor Lamp";
        description = "Tall floor lamp for warm lighting.";
        priceINR = 5999;
        inventory = 12;
        imageUrl = "https://www.ikea.com/in/en/images/products/antara-floor-lamp-acacia__1118057_pe872839_s5.jpg";
        roomType = #other("Bedroom");
        stylePreference = #boho;
      },
      {
        id = "dec-mirrors";
        name = "Decorative Mirrors";
        description = "Set of 3 decorative wall mirrors.";
        priceINR = 4199;
        inventory = 22;
        imageUrl = "https://cdn.shopify.com/s/files/1/0725/0474/2187/files/Decorative_Mirrors.png";
        roomType = #other("Bathroom");
        stylePreference = #modern;
      },
      {
        id = "dec-vases";
        name = "Modern Vases";
        description = "Case set with dried flowers for displays.";
        priceINR = 1999;
        inventory = 30;
        imageUrl = "https://www.ikea.com/in/en/images/products/lunikva-vase-transparent-clear-glass__0990864_pe819795_s5.jpg";
        roomType = #other("Living Room");
        stylePreference = #modern;
      },
    ];

    // Construct product categories
    let newCategories = Map.empty<Text, ProductCategory>();
    newCategories.add(
      "living-room",
      {
        id = "living-room";
        name = "Living Room";
        description = "Sofas, coffee tables, and living room furniture";
        products = livingRoomProducts;
      },
    );
    newCategories.add(
      "bedroom",
      {
        id = "bedroom";
        name = "Bedroom";
        description = "Beds, dressers, wardrobes, and bedroom sets";
        products = bedroomProducts;
      },
    );
    newCategories.add(
      "dining-room",
      {
        id = "dining-room";
        name = "Dining Room";
        description = "Dining tables, chairs, sideboards, and dining sets";
        products = diningRoomProducts;
      },
    );
    newCategories.add(
      "office",
      {
        id = "office";
        name = "Office";
        description = "Desks, office chairs, bookshelves, and storage";
        products = officeProducts;
      },
    );
    newCategories.add(
      "kids-room",
      {
        id = "kids-room";
        name = "Kids Room";
        description = "Bunk beds, children's bookshelves, and study desks";
        products = kidsRoomProducts;
      },
    );
    newCategories.add(
      "furnishing",
      {
        id = "furnishing";
        name = "Furnishing";
        description = "Curtains, rugs, cushions, bedding, and home textiles";
        products = furnishingProducts;
      },
    );
    newCategories.add(
      "decor",
      {
        id = "decor";
        name = "Decor";
        description = "Wall art, lamps, mirrors, and home accessories";
        products = decorProducts;
      },
    );

    // Return full new actor state with seeded categories
    {
      old with
      productCategories = newCategories
    };
  };
};
