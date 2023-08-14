import { gql, client } from "@/graphql/serverClient";
import Home from "./Home";

const GET_PROPERTIES = gql`
  query getProperties(
    $first: Int!
    $offset: Int!
    $listedFor: TypeOfListing
    $type: PropertyType
    $city: PropertyCity
  ) {
    properties(
      condition: { listedFor: $listedFor, type: $type, city: $city }
      first: $first
      offset: $offset
      orderBy: CREATED_AT_DESC
    ) {
      nodes {
        id
        number
        type
        slug
        title
        city
        price
        listedFor
        isFurnished
        hasSwimmingPool
        hasParking
        hasBasement
        description
        country
        condition
        bedrooms
        bathrooms
        attributes
        createdAt
        area
        ownerId
        agentId
        media: propertyMedias {
          nodes {
            id
            mediaUrl
            media {
              signedUrl
            }
            isCoverImage
          }
        }
      }
    }
  }
`;

export default async function Page() {
  const res = await client.request(GET_PROPERTIES, { first: 10, offset: 0 });
  const data = res?.properties?.nodes ?? [];
  return <Home data={data} />;
}
