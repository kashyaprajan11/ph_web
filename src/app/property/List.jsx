"use client";
import { useEffect, useState } from "react";
import { useQuery, useLazyQuery } from "@apollo/client";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Link from "next/link";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { usePathname } from "next/navigation";
import { styled, useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import InfiniteScroll from "react-infinite-scroll-component";

import Card from "./Card";
import CategoryBoxes from "src/components/CategoryBoxes";
import CreatePropertySaleRentLease from "../createProperty";
import useToggleAuth from "@/utils/hooks/useToggleAuth";
import { GET_PROPERTIES, SEARCH_PROPERTIES } from "@/graphql/properties";
import { removeDuplicateObjectsFromArray } from "@/utils/helper";
import useFilters from "@/utils/hooks/useFilters";
import ZeroBoxes from "@/components/ZeroBoxes";
import { Pagination } from "@mui/material";

const Section = styled(Box)(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
  gap: "1.2rem",
  [theme.breakpoints.down("md")]: {
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
  },
  [theme.breakpoints.down("sm")]: {
    display: "flex",
    flexDirection: "column",
  },
  width: "100%",
}));

function PropertyList({
  data,
  type,
  title,
  listedFor: listedForProp,
  viewAllLink,
  infiniteScroll,
  count,
  showFilters,
  isSearch,
  searchText,
  searchResultsTotalCount,
}) {
  const pathname = usePathname();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [propertyIdToEdit, setPropertyIdToEdit] = useState(null);
  const [page, setPage] = useState(0);
  const [properties, setProperties] = useState([]);

  const { Auth, toggleAuth } = useToggleAuth();
  const {
    city,
    bedrooms,
    listedFor,
    ResetButton,
    CityDropdown,
    BedroomsDropdown,
    ListedForDropdown,
  } = useFilters({
    sx: {
      "& fieldset": {
        borderRadius: "8px",
        borderColor: theme.palette.grey[300],
      },
    },
    onReset: () => setPage(0),
    onChangeCity: () => setPage(0),
    onChangeBedrooms: () => setPage(0),
    onChangeListedFor: () => setPage(0),
  });

  const variables = { first: count, offset: page * count };
  if (type) {
    variables.type = type;
  }
  if (city) {
    variables.city = city;
  }
  if (bedrooms) {
    variables.bedrooms = bedrooms;
  }
  if (listedFor || listedForProp) {
    variables.listedFor = listedForProp ?? listedFor;
  }

  const [searchProperties] = useLazyQuery(SEARCH_PROPERTIES);

  const { data: propertiesData } = useQuery(GET_PROPERTIES, {
    variables,
    skip: !infiniteScroll || !count || isSearch,
    fetchPolicy: "network-only",
  });

  useEffect(() => {
    const props = propertiesData?.properties?.nodes ?? [];
    if (props.length > 0) {
      if ((city || bedrooms || listedFor) && page === 0) {
        setProperties(props);
      } else {
        setProperties((prev) => {
          return removeDuplicateObjectsFromArray([...prev, ...props]);
        });
      }
    }
  }, [propertiesData]);

  const toggleEditor = (id) => () => {
    setPropertyIdToEdit(id);
  };

  const handleFetchNextPage = () => {
    setPage((prev) => prev + 1);
  };

  const handleSearch = async (_e, searchPage) => {
    setPage(searchPage - 1);
    try {
      const { data } = await searchProperties({
        variables: {
          searchText,
          city,
          first: count,
          offset: (searchPage - 1) * count,
        },
      });
      setProperties(data?.searchProperties?.nodes ?? []);
    } catch (err) {
      console.log(err);
    }
  };

  const isHome = pathname === "/";
  const showCategoryBoxes =
    (isHome || (!isHome && !isMobile)) && !pathname.includes("/dashboard");

  const listToShow =
    isSearch ||
    (infiniteScroll && count && page > 0) ||
    city ||
    bedrooms ||
    listedFor
      ? properties
      : data ?? [];

  const propertyToEdit = listToShow.find((l) => l.id === propertyIdToEdit);

  const hasMore =
    page === 0
      ? true
      : propertiesData?.properties?.totalCount > listToShow.length;

  return (
    <Stack spacing={2} sx={{ height: "100%" }}>
      {showCategoryBoxes && (
        <Stack py={2}>
          <CategoryBoxes />
        </Stack>
      )}

      {isHome && !isMobile && <ZeroBoxes />}

      {title && (
        <Stack
          spacing={2}
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography
            gutterBottom
            color={theme.palette.text.primary}
            fontWeight={theme.typography.fontWeightMedium}
            fontFamily={theme.typography.fontFamily.Manrope}
            variant="h4"
            textAlign="left"
            fontSize={{ xs: "1.4rem", sm: "1.6rem" }}
          >
            {title}
          </Typography>

          {showFilters && (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: listedForProp
                  ? "repeat(3, 1fr)"
                  : "repeat(4, 1fr)",
                gap: "1em",
                [theme.breakpoints.down("sm")]: {
                  gridTemplateColumns: "1fr 1fr",
                },
                width: { xs: "100%", md: "auto" },
              }}
            >
              <CityDropdown />
              <BedroomsDropdown />
              {!listedForProp && <ListedForDropdown />}
              <ResetButton />
            </Box>
          )}
          {viewAllLink && (
            <Button
              variant="contained"
              LinkComponent={Link}
              href={viewAllLink}
              sx={{
                display: { xs: "none", sm: "flex" },
                borderRadius: "8px",
                fontSize: "1rem",
              }}
            >
              View All
            </Button>
          )}
        </Stack>
      )}

      <Section>
        {!infiniteScroll &&
          !isSearch &&
          !propertyIdToEdit &&
          data.map((l, i) => {
            return (
              <Box key={i} sx={{ justifySelf: "center", width: "100%" }}>
                <Card
                  data={l}
                  isPriority={i < 9}
                  toggleAuth={toggleAuth}
                  togglePropertyEditor={toggleEditor(l.id)}
                />
              </Box>
            );
          })}
      </Section>

      {isSearch && (
        <Section>
          {(page === 0 ? data : listToShow).map((l, i) => {
            return (
              <Box key={i} sx={{ justifySelf: "center", width: "100%" }}>
                <Card
                  data={l}
                  isPriority={i < 9}
                  toggleAuth={toggleAuth}
                  togglePropertyEditor={toggleEditor(l.id)}
                />
              </Box>
            );
          })}
        </Section>
      )}

      {isSearch && (
        <Stack alignItems="center" justifyContent="center">
          <Pagination
            page={page + 1}
            onChange={handleSearch}
            count={Math.floor(searchResultsTotalCount / 10)}
          />
        </Stack>
      )}
      {infiniteScroll && !isSearch && !propertyIdToEdit && (
        <InfiniteScroll
          dataLength={listToShow.length}
          next={handleFetchNextPage}
          hasMore={hasMore}
          endMessage={<></>}
          loader={<></>}
        >
          <Section>
            {listToShow.map((l, i) => {
              return (
                <Box key={i} sx={{ justifySelf: "center", width: "100%" }}>
                  <Card
                    data={l}
                    isPriority={i < 9}
                    toggleAuth={toggleAuth}
                    togglePropertyEditor={toggleEditor(l.id)}
                  />
                </Box>
              );
            })}
          </Section>
        </InfiniteScroll>
      )}

      {!!propertyIdToEdit && (
        <CreatePropertySaleRentLease
          data={propertyToEdit}
          handleCancel={toggleEditor()}
        />
      )}
      {Auth}
    </Stack>
  );
}

export default PropertyList;
