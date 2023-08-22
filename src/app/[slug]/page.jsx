import { client } from "@/graphql/serverClient";
import { GET_PROPERTIES } from "@/graphql/properties";
import Home from "../Home";
import RentalAgreement from "src/app/rentalAgreement";
import RentRecieptGenerator from "src/app/rentRecieptGenerator";
import PropertyList from "src/app/property/List";
import {
  ALL_CITIES,
  PROPERTY_TYPE,
  navlinks,
  navLinkWithCities,
} from "@/utils/constants";
import CreateProperty from "src/app/createProperty";

export default async function Page({ params }) {
  const { slug = "" } = params;
  let data = [];
  const variables = { first: 20, offset: 0 };

  const isRentalAgreementPage =
    slug === "rental-agreement" ||
    slug?.split("-").slice(0, 3).join("-") === "rental-agreement-in";
  const isListPropertyPage = slug === "list-your-property-for-sale-rent-lease";

  const navLink = navlinks.find((l) => l.link === slug);
  const navLinkWithCity = navLinkWithCities.find((l) => l.link === slug);
  const isCityLink = navLinkWithCity?.link === slug;

  if (navLink?.link === slug || isCityLink) {
    let listedFor = null;
    let city = null;
    if (isCityLink) {
      listedFor = slug.split("-in-")[0];
      city = slug.split("-in-").pop().toUpperCase();
    }
    listedFor = (isCityLink ? listedFor : slug).split("-").pop().toUpperCase();
    let propertyType = slug.split("-for-")[0];
    propertyType = propertyType.split("-").join("_").slice(0, -1).toUpperCase();

    const isPG = slug.includes("pg") || slug.includes("paying-guests");
    const isHostel = slug.includes("hostel");

    if (
      !slug.includes("properties-for-sale") &&
      !slug.includes("properties-for-rent")
    ) {
      variables.type = propertyType;
    }
    if (slug.includes("commercial")) {
      variables.type = PROPERTY_TYPE.COMMERCIAL;
    }
    if (isPG) {
      variables.type = PROPERTY_TYPE.PG;
    }
    if (isHostel) {
      variables.type = PROPERTY_TYPE.HOSTEL;
    }

    if (!isPG && !isHostel) {
      variables.listedFor = listedFor;
    }

    if (city && isCityLink) {
      variables.city = city;
    }

    let res = await client.request(GET_PROPERTIES, variables);
    const initialResData = res?.properties?.nodes ?? [];
    data = res?.properties?.nodes ?? [];
    if (data.length === 0) {
      res = await client.request(GET_PROPERTIES, { first: 20, offset: 0 });
      data = res?.properties?.nodes ?? [];
    }
    return (
      <PropertyList
        data={data}
        type={variables.type}
        infiniteScroll
        listedFor={listedFor}
        city={city}
        count={20}
        title={isCityLink ? navLinkWithCity.title : navLink.title}
        showFilters
      />
    );
  } else if (isRentalAgreementPage) {
    const rentalAgreementCity =
      slug === "rental-agreement" ? "" : slug.split("-").pop();
    return <RentalAgreement city={rentalAgreementCity} />;
  } else if (
    slug === "online-rent-reciept-generator-free" ||
    slug === "rent-reciept-generator-online"
  ) {
    return <RentRecieptGenerator />;
  } else if (isListPropertyPage) {
    return <CreateProperty />;
  } else {
    return <Home data={data} />;
  }
}

export function generateStaticParams() {
  let paths = [
    { slug: "rental-agreement" },
    { slug: "online-rent-reciept-generator-free" },
    { slug: "rent-reciept-generator-online" },
    { slug: "list-your-property-for-sale-rent-lease" },
  ];
  for (let city of ALL_CITIES) {
    paths.push({
      slug: `rental-agreement-in-${city.toLowerCase()}`,
    });
  }
  for (let link of navlinks) {
    paths.push({
      slug: link.link,
    });
  }
  for (let link of navLinkWithCities) {
    paths.push({
      slug: link.link,
    });
  }
  return paths;
}
