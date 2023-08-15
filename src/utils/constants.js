export const USER_TYPE = {
  SELLER: "SELLER",
  BUYER: "BUYER",
};

export const PROPERTY_TYPE = {
  HOUSE: "HOUSE",
  VILLA: "VILLA",
  LAND: "LAND",
  FLAT: "FLAT",
  APARTMENT: "APARTMENT",
  BUNGALOW: "BUNGALOW",
  FARM_HOUSE: "FARM HOUSE",
  PENT_HOUSE: "PENT HOUSE",
  COUNTRY_HOME: "COUNTRY HOME",
  INDEPENDENT_HOUSE: "HOUSE",
  CHATEAU: "CHATEAU",
  CABIN: "CABIN",
  PROJECT: "PROJECT",
  COMMERCIAL: "COMMERCIAL",
  PG: "PG",
  HOSTEL: "HOSTEL",
};

export const LISTING_TYPE = {
  SALE: "SALE",
  RENT: "RENT",
  LEASE: "LEASE",
};

export const PROPERTY_CONDITION = {
  OK: "OK",
  GOOD: "GOOD",
  VERY_GOOD: "VERY GOOD",
  AVERAGE: "AVERAGE",
  BAD: "BAD",
};

export const PROPERTY_STATUS = {
  IN_REVIEW: "IN REVIEW",
  REJECTED: "REJECTED",
  APPROVED: "APPROVED",
  NOT_FOR_SALE: "NOT FOR SALE",
  NOT_FOR_RENT: "NOT FOR RENT",
  SOLD: "SOLD",
};

export const ALL_CITIES = [
  "AMALAPURAM",
  "BANGALORE",
  "BHIMAVARAM",
  "PALAKOLLU",
  "CHENNAI",
  "DELHI",
  "GURGAON",
  "HYDERABAD",
  "KAKINADA",
  "MUMBAI",
  "PUNE",
  "RAJAHMUNDRY",
  "VIJAYAWADA",
  "VISHAKAPATNAM",
];

export const LOCALITIES = {
  HYDERABAD: [],
  VISHAKAPATNAM: [],
  VIJAYAWADA: [],
  AMALAPURAM: [],
  BANGALORE: [],
  PUNE: [],
};

export const PRIVATE_ROUTES = [
  "/dashboard",
  "/dashboard/messages",
  "/dashboard/manage-properties",
  "/dashboard/saved-properties",
  "/dashboard/settings",
  "/dashboard/subscriptions",
];

export const navlinksSale = [
  { link: "flats-for-sale", title: "Flats For Sale" },
  { link: "villas-for-sale", title: "Villas For Sale" },
  { link: "houses-for-sale", title: "Independent Houses For Sale" },
  { link: "farm-houses-for-sale", title: "Farm Houses For Sale" },
  {
    link: "commercial-properties-for-sale",
    title: "Commerical Properties For Sale",
  },
  {
    link: "bungalows-for-sale",
    title: "Bungalows For Sale",
  },
  { link: "pent-houses-for-sale", title: "Pent Houses For Sale" },
  { link: "properties-for-sale", title: "Properties For Sale" },
];

export const navlinksRent = [
  { link: "flats-for-rent", title: "Flats For Rent" },
  { link: "villas-for-rent", title: "Villas For Rent" },
  { link: "houses-for-rent", title: "Independent Houses For Rent" },
  { link: "farm-houses-for-rent", title: "Farm Houses For Rent" },
  {
    link: "commercial-properties-for-rent",
    title: "Commerical Properties For Rent",
  },
  {
    link: "bungalows-for-rent",
    title: "Bungalows For Rent",
  },
  { link: "pent-houses-for-rent", title: "Pent Houses For Rent" },
  { link: "properties-for-rent", title: "Properties For Rent" },
];

export const navlinksOthers = [
  { link: "paying-guests-accomodation", title: "Paying Guest" },
  { link: "hostel-accommodation", title: "Hostels" },
];

export const navlinks = [...navlinksSale, ...navlinksRent, ...navlinksOthers];

const navLinkWithCities = [];
for (let link of navlinks) {
  for (let city of ALL_CITIES) {
    navLinkWithCities.push({
      link: `${link.link}-in-${city.toLowerCase()}`,
      title: `${link.title} in ${
        city.charAt(0).toUpperCase() + city.slice(1).toLowerCase()
      }`,
    });
  }
}
export { navLinkWithCities };
