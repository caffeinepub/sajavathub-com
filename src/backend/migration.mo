import Map "mo:core/Map";
import Text "mo:core/Text";
import Time "mo:core/Time";

module {
  type Vendor = {
    id : Text;
    name : Text;
    gstNumber : Text;
    mobileNumber : Text;
    verified : Bool;
    createdAt : Time.Time;
  };

  type Otp = {
    code : Text;
    mobileNumber : Text;
    expiryTime : Time.Time;
  };

  type VerifiedOtp = {
    mobileNumber : Text;
    verifiedAt : Time.Time;
  };

  type OldActor = {};
  type NewActor = {
    vendors : Map.Map<Text, Vendor>;
    otps : Map.Map<Text, Otp>;
    verifiedOtps : Map.Map<Text, VerifiedOtp>;
  };

  public func run(_ : OldActor) : NewActor {
    {
      vendors = Map.empty<Text, Vendor>();
      otps = Map.empty<Text, Otp>();
      verifiedOtps = Map.empty<Text, VerifiedOtp>();
    };
  };
};
