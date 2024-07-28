import { Box, Card, CardContent, Tab, Tabs, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { GET_DATA_BY_ID } from "../../graphql/common/queries";
import { a11yProps, NameAvatar } from "../Members";
import React from "react";
import { useLazyQuery } from "@apollo/client";
const Search = () => {
  const [value, setValue] = useState<number>(0);
  const { state }: { state: any } = useLocation();
  const [currentOption, setCurrentOption] = useState();
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  const navigate = useNavigate();
  const [getDataById, { data: queryData, loading: queryDataLoading }] =
    useLazyQuery(GET_DATA_BY_ID, {
      variables: {
        DataModelInput: {
          entity: "Company",
        },
        param: {
          id: Number(currentOption),
        },
      },
      notifyOnNetworkStatusChange: true,
    });
  useEffect(() => {
    if (!queryDataLoading && queryData) {
      let companyName = queryData?.GetDataById?.info?.name;
      let tempCompanytName = companyName.replace(/ /g, "");
      let tempGroupName = (currentOption as any)?.name.replace(/ /g, "");
      navigate(`/admin/companies/${tempCompanytName}/${tempGroupName}`, {
        state: { group: currentOption },
      });
    }
  }, [queryData, queryDataLoading]);
  const specificSearchNavigate = (option: any) => {
    setCurrentOption(option);
    if (option?.type === "company") {
      let tempCompanyName = option?.name.replace(/ /g, "");
      navigate(`/admin/companies/${tempCompanyName}`, {
        state: { company: option },
      });
    } else if (option?.type === "group") {
      getDataById({
        variables: {
          DataModelInput: {
            entity: "Company",
          },
          param: {
            id: Number(option?.companyId),
          },
        },
      });
    }
  };
  return (
    <Box sx={{ width: "100%" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography fontWeight={"bold"} variant="h6">
          Search ADMIN
        </Typography>
      </Box>
      <Box sx={{ width: "100%" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs value={value} onChange={handleChange} aria-label="Data tabs">
            <Tab
              sx={{ textTransform: "none", fontWeight: "bold" }}
              label={`All (${state?.filteredData?.length})`}
              {...a11yProps(0)}
            />
            <Tab
              sx={{ textTransform: "none", fontWeight: "bold" }}
              label={`People (${
                state?.filteredData?.filter(
                  (results: any) => results.type === "user"
                )?.length
              })`}
              {...a11yProps(1)}
            />
            <Tab
              sx={{ textTransform: "none", fontWeight: "bold" }}
              label={`Groups (${
                state?.filteredData?.filter(
                  (results: any) => results.type === "group"
                )?.length
              })`}
              {...a11yProps(2)}
            />
            <Tab
              sx={{ textTransform: "none", fontWeight: "bold" }}
              label={`Companies (${
                state?.filteredData?.filter(
                  (results: any) => results.type === "company"
                )?.length
              })`}
              {...a11yProps(3)}
            />
          </Tabs>
        </Box>
        <Box>
          <Typography
            variant="subtitle2"
            sx={{ opacity: "0.65", padding: 1.5 }}
          >
            Showing Results for: "{state?.searchKey}"
          </Typography>
        </Box>
      </Box>
      {state?.filteredData?.map((results: any) => {
        return value === 1 && results.type === "user" ? (
          <CardViewPerson firstName={results.firstName} email={results.email} />
        ) : value === 2 && results.type === "group" ? (
          <CardViewGroup
            name={results.name}
            description={results.description}
            onClick={() => specificSearchNavigate(results)}
          />
        ) : value === 3 && results.type === "company" ? (
          <CardViewGroup
            name={results.name}
            description={results.description}
            onClick={() => specificSearchNavigate(results)}
          />
        ) : value === 0 ? (
          results.type === "user" ? (
            <CardViewPerson
              firstName={results.firstName}
              email={results.email}
            />
          ) : (
            <CardViewGroup
              name={results.name}
              description={results.description}
              onClick={() => specificSearchNavigate(results)}
            />
          )
        ) : (
          ""
        );
      })}
    </Box>
  );
};
export default Search;
interface CardProps {
  name?: string;
  description?: string;
  onClick?: () => void;
}
const CardViewGroup = (props: CardProps) => {
  return (
    <Card
      onClick={props.onClick}
      sx={{
        display: "flex",
        flexDirection: "column",
        cursor: "pointer",
        marginBottom: "1.2rem",
      }}
    >
      <CardContent
        sx={{
          display: "flex",
          alignItems: "flex-start",
          marginBottom: "-1.8rem",
        }}
      >
        <NameAvatar name={props.name} />
        <Typography sx={{ marginLeft: 1.5 }} color="text.primary">
          {props.name}
        </Typography>
      </CardContent>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "start",
          marginLeft: 8,
          marginBottom: 1,
        }}
      >
        <Typography variant="subtitle2" sx={{ opacity: "0.65" }}>
          {props.name} Description
        </Typography>
        <Typography variant="subtitle2" sx={{ opacity: "0.65" }}>
          {props.description}
        </Typography>
      </Box>
    </Card>
  );
};
interface CardProps2 {
  firstName?: string;
  email?: string;
  onClick?: () => void;
}
const CardViewPerson = (props: CardProps2) => {
  return (
    <Card
      onClick={props.onClick}
      sx={{
        display: "flex",
        flexDirection: "column",
        cursor: "pointer",
        marginBottom: "1.2rem",
      }}
    >
      <CardContent sx={{ display: "flex", marginBottom: "-2.0rem" }}>
        <NameAvatar name={props.firstName} />
        <Typography sx={{ marginLeft: 1.5 }} color="#132640">
          {props?.firstName}
        </Typography>
      </CardContent>
      <Box sx={{ display: "flex", flexDirection: "grid", width: "65%" }}>
        <Box sx={{ display: "flex", flexDirection: "column", width: "50%" }}>
          <Typography
            variant="subtitle2"
            sx={{ marginLeft: 8, opacity: "0.65" }}
          >
            Email:
          </Typography>
          <Typography
            variant="subtitle2"
            sx={{ marginLeft: 8, color: "text.primary" }}
          >
            {props?.email}
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            width: "20%",
            marginBottom: 1,
          }}
        >
          <Typography variant="subtitle2" sx={{ opacity: "0.65" }}>
            Company:
          </Typography>
          <Typography variant="subtitle2" sx={{ color: "#132640" }}>
            Zones
          </Typography>
        </Box>
      </Box>
    </Card>
  );
};
