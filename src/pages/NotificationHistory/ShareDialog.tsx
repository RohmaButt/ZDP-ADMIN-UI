import Autocomplete, { OptionType } from "./AutoComplete";
import BoxComponent from "./Box";
import TypographyComponent from "./Typography";
import { useMsal } from "@azure/msal-react";
import { useEffect, useState } from "react";
import { callMsGetAllUsersGraph } from "../../services/msGraphApi";
import { useDebounce } from "use-debounce";
import { getAllUsersRequest } from "../../config/authConfig";
import { useLazyQuery, useQuery } from "@apollo/client";
import { GET_TABLE_DATA } from "../../graphql/generic/queries";
import { pimClient } from "../../providers";
import React from "react";

export type User = {
  businessPhones: [];
  displayName: string;
  givenName: string;
  id: string;
  jobTitle: string | null;
  mail: string;
  mobilePhone: string | null;
  officeLocation: string | null;
  preferredLanguage: string | null;
  surname: string;
  userPrincipalName: string;
};

type IProps = {
  values: OptionType[];
  onSetValue: (val: OptionType[]) => void; // Change the type to accept an array
  title?: string;
  userType?: string;
};

export default function ShareDialog({
  values,
  title,
  userType,
  onSetValue,
}: IProps) {
  const { instance, accounts } = useMsal();
  const [users, setUser] = useState<User[]>();
  const [optionsVal, setOptionsVal] = useState<OptionType[]>([]);
  const [textVal, setTextVal] = useState("");
  const [debounceVal] = useDebounce(textVal, 300);

  const getDefaultFilterArguments = {
    $and: {
      $and: [{ first_name: { $like: debounceVal } }],
    },
  };

  const [getZDPusers] = useLazyQuery(GET_TABLE_DATA, {
    variables: {
      pagination: { offset: 0, limit: 10 },
      DataModelInput: { entity: "user" },
      QueryInput: {
        filterInputString: "{}",
      },
    },
  });

  const getAllUsers = (searchParam?: string) => {
    if (userType === "AD") {
      const request = {
        ...getAllUsersRequest,
        account: accounts[0],
      };

      // Silently acquires an access token which is then attached to a request for Microsoft Graph data
      instance
        .acquireTokenSilent(request)
        .then((response) => {
          callMsGetAllUsersGraph(response.accessToken, searchParam).then(
            (response) => {
              setUser(response.value);
              // Using map to create a new array with the desired structure
              const copyArr = [...response.value];

              const optionArr = copyArr.map((item: User) => {
                console.log(item);
                return {
                  name: item.displayName,
                  inputValue: "",
                  email: item.userPrincipalName,
                  id: item.id,
                };
              });
              setOptionsVal(optionArr);
            }
          );
        })
        .catch((e) => {
          instance.acquireTokenPopup(request).then((response) => {
            callMsGetAllUsersGraph(response.accessToken, searchParam).then(
              (response) => console.log(response)
            );
          });
        });
    } else if (userType == "ZDP") {
      getZDPusers({
        variables: {
          pagination: { offset: 0, limit: 10 },
          DataModelInput: { entity: "user" },
          QueryInput: {
            filterInputString: JSON.stringify(getDefaultFilterArguments),
          },
        },
      }).then((response) => {
        console.log(response.data);
        setUser(response.data);
        const copyArr = [...response.data.GetDataByJsonQuery.info.data];
        console.log(copyArr);
        const optionArr = copyArr.map((item: any) => {
          console.log(item);
          return {
            name: item.firstName,
            inputValue: "",
            email: item.email,
            id: item.id,
          };
        });
        setOptionsVal(optionArr);
      });
    }
  };

  useEffect(() => {
    getAllUsers(debounceVal);
  }, [debounceVal]);

  const setTextValue = (value: string) => {
    setTextVal(value);
  };

  return (
    <BoxComponent
      sx={{ display: "flex", gap: "16px", flexDirection: "column", pb: "24px" }}
    >
      <TypographyComponent
        variant="XSmallHeading"
        component="h1"
        sx={{ color: "#323E4D" }}
      >
        {title}
      </TypographyComponent>
      <Autocomplete
        options={optionsVal}
        value={values}
        setValue={onSetValue}
        textVal={textVal}
        setTextValue={setTextValue}
      />
    </BoxComponent>
  );
}

ShareDialog.defaultProps = {
  title: "Share via Email",
  userType: "AD",
};
