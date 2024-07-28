import React, {
  Dispatch,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Button, Tabs } from "antd";
import useMetaData from "../../hooks/useMetaData";
import SavedFilter from "../SavedFilterView";
import ConditionView from "../ConditionView";
import {
  FilterCreateInput,
  CreateFilter,
  UpdateFilter,
} from "../../graphql/filters/mutations";
import { useMutation, useQuery } from "@apollo/client";
import { defaultPaginationParams } from "../../utils/constants";
import { GET_SAVED_FILTERS } from "../../graphql/filters/queries";
import { unionOfArrays } from "../../utils/common";
import { SetStateAction } from "react";
import Drawer from "@mui/material/Drawer";
import Typography from "@mui/material/Typography";
import { InputText, Divider, BasicSelect } from "../index";
import NoData from "../external/NoData";
import Box from "@mui/material/Box";
import { Store } from "react-notifications-component";
import NotificationContent, {
  notificationOptions,
} from "../NotificationContent";
import Switch from "@mui/material/Switch";
import { Tooltip } from "@mui/material";

const { TabPane } = Tabs;

export type DeletedFilterConditions = Array<string | number>;

export type FilterViewProps = {
  onClose: () => void;
  visible: boolean;
  showDrawer?: () => void;
  onRun?: (filter: string, query?: Object) => void;
  fields?: Array<any>;
  components?: Array<SelectComponentType>;
  defaultComponentValue?: string | undefined;
  defaultComponentTitle?: string | undefined;
  tableConditions?: Array<ConditionType>;
  setTableConditions?: Dispatch<SetStateAction<ConditionType[]>>;
  deletedFilterConditions?: DeletedFilterConditions;
  setDeletedFilterConditions?: Dispatch<
    SetStateAction<DeletedFilterConditions>
  >;
};

export type SelectComponentType = {
  label: string;
  value: string;
};

export type ConditionType = {
  field: string;
  condition: string;
  values: string | number | undefined;
  keyIndentifier?: string | number;
  isDone?: boolean;
  label?: string;
};

export const UIComponents = [
  {
    label: "Records Processed",
    value: "processedRecords",
    dto: "EdiFeedStatisticGq",
  },
  {
    label: "Product Items",
    value: "productItems",
    dto: "ProductItemSchemaGQ",
  },
  {
    label: "Product Exclusion",
    value: "productExlusion",
    dto: "ProductExclusion",
  },
  {
    label: "Media",
    value: "media",
    dto: "MediaEntity",
  },
];

const getDTO = (component: string) => {
  const index = UIComponents.findIndex((item) => item.value === component);
  return UIComponents[index].dto;
};

const FilterView = ({
  onClose,
  visible,
  onRun,
  fields,
  components,
  defaultComponentValue,
  tableConditions = [],
  setTableConditions,
  deletedFilterConditions,
  setDeletedFilterConditions,
  defaultComponentTitle,
}: FilterViewProps) => {
  const [component, setcomponent] = useState<string>(
    defaultComponentValue ? defaultComponentValue : ""
  );
  const [data, metaDataLoading] = useMetaData();
  const [filterName, setFilterName] = useState<string>("");
  const [editFilterId, setEditFilterId] = useState<number>();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTabKey, setActiveTabKey] = useState<string>("1");
  const [currentFilter, setCurrentFilter] = useState(undefined);
  const [showSavedArchived, setShowSavedArchived] = useState(false);
  const [showSharedArchived, setShowSharedArchived] = useState(false);
  const [filterNameError, setFilterNameError] =
    useState<"error" | undefined>(undefined);
  const [userConditions, setUserConditions] =
    useState<Array<ConditionType>>(tableConditions);
  const [
    createFilterMutateFunction,
    {
      data: filtersSaveResFromServer,
      loading: saveFilterLoading,
      error: saveFilterError,
    },
  ] = useMutation(CreateFilter);
  const getDefaultFilterArguments = {
    $and: [{ dto: { $eq: getDTO(defaultComponentValue!) } }],
  };
  const {
    data: savedFiltersFromServer,
    refetch: refetchSavedFilters,
    error: getSavedFilterError,
  } = useQuery(GET_SAVED_FILTERS, {
    variables: {
      pagination: { ...defaultPaginationParams },
      filterInput: {
        filterInputString: JSON.stringify(getDefaultFilterArguments),
      },
      sharedFilterArg: { isShared: false },
    },
  });
  const {
    data: sharedFiltersFromServer,
    refetch: refetchsharedSavedFilters,
    error: getsharedFilterError,
  } = useQuery(GET_SAVED_FILTERS, {
    variables: {
      pagination: { ...defaultPaginationParams },
      filterInput: {
        filterInputString: JSON.stringify(getDefaultFilterArguments),
      },
      sharedFilterArg: { isShared: true },
    },
  });
  const [
    updateFilterMutateFunction,
    {
      data: updateFilterResFromServer,
      error: updateFilterError,
      loading: updateFilterLoading,
    },
  ] = useMutation(UpdateFilter, {
    notifyOnNetworkStatusChange: true,
  });

  useEffect(() => {
    if (tableConditions.length > 0 || deletedFilterConditions?.length) {
      const updatedUserConditions = userConditions.filter(
        (item) =>
          !deletedFilterConditions?.includes(item.keyIndentifier as string)
      );
      setUserConditions((prevCondtions) =>
        unionOfArrays(updatedUserConditions, tableConditions)
      );
      setDeletedFilterConditions && setDeletedFilterConditions([]);
    }
  }, [tableConditions]);

  useEffect(() => {
    if (isEditing) {
      setActiveTabKey("1");
    }
  }, [isEditing]);

  const handleEditMode = (
    mode: boolean,
    filterName: string,
    filterId: number
  ) => {
    setFilterName(filterName);
    setEditFilterId(filterId);
    setIsEditing(mode);
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setFilterName("");
    setEditFilterId(undefined);
    setUserConditions([]);
    setActiveTabKey("2");
  };

  useEffect(() => {
    if (!updateFilterError && updateFilterResFromServer) {
      Store.addNotification({
        content: (
          <NotificationContent
            type={"success"}
            message={"Filter updated successfully."}
          />
        ),
        ...notificationOptions,
      });
      cancelEdit();
    }
  }, [updateFilterResFromServer, updateFilterError]);

  const onComponentChange = (value: string) => {
    setcomponent(value);
  };

  const handleRefectSavedFilters = () => {
    refetchSavedFilters({
      pagination: { ...defaultPaginationParams },
      filterInput: {
        filterInputString: JSON.stringify(getDefaultFilterArguments),
      },
    });
    setTableConditions && setTableConditions([]);
  };

  const updateFilter = () => {
    if (filterName === "") {
      setFilterNameError("error");
      return;
    } else {
      setFilterNameError(undefined);
    }

    const query = createQuery();
    updateFilterMutateFunction({
      variables: {
        param: { id: editFilterId },
        updateFilterInput: { name: filterName, value: JSON.stringify(query) },
      },
    });
  };

  const createQuery = () => {
    if (userConditions.length === 0) {
      setTableConditions && setTableConditions([]);
      return {};
    } else {
      const conditionsObject: Array<any> = [];
      userConditions.map((conditionItem) => {
        conditionsObject.push({
          [conditionItem.field]: {
            [conditionItem.condition]: conditionItem.values,
          },
        });
        return 0;
      });

      const query = {
        $and: conditionsObject,
      };

      return query;
    }
  };

  const executeQuery = () => {
    const queryObj = createQuery();
    const queryJson = JSON.stringify(queryObj);
    onRun && onRun(queryJson, queryObj);
    setCurrentFilter(undefined);
  };

  const executeRawQuery = useCallback(
    (query: string, filter: any) => {
      onRun && onRun(query, filter ? JSON.parse(filter.Filter.value) : filter);
      setTableConditions && setTableConditions([]);
      setCurrentFilter(filter);
    },
    [onRun]
  );

  const fieldsFromMetaData = useMemo(() => {
    if (fields) {
      return fields;
    } else {
      return data?.EdiFeedStatisticGq?.fields || [];
    }
  }, [fields, data]);

  const saveFilter = () => {
    if (filterName === "") {
      setFilterNameError("error");
      return;
    } else {
      setFilterNameError(undefined);
    }

    const query = createQuery();
    const filter: FilterCreateInput = {
      dto: getDTO(component),
      value: JSON.stringify(query),
      name: filterName,
    };

    createFilterMutateFunction({
      variables: {
        createFilterInput: filter,
      },
    });
  };

  useEffect(() => {
    if (!saveFilterError && filtersSaveResFromServer) {
      setFilterName("");
      setUserConditions([]);
      Store.addNotification({
        content: (
          <NotificationContent
            type={"success"}
            message={
              "Filter saved successfully. You can view it in My Filters tab."
            }
          />
        ),
        ...notificationOptions,
      });
      handleRefectSavedFilters();
      setCurrentFilter(filtersSaveResFromServer?.createFilter);
    }
  }, [filtersSaveResFromServer, saveFilterError]);

  const OperationsSlot = {
    left: (
      <>
        <Button
          onClick={() => executeQuery()}
          style={{ marginRight: 10 }}
          disabled={activeTabKey !== "1"}
        >
          Run
        </Button>
        {isEditing ? (
          <Button
            loading={updateFilterLoading}
            onClick={updateFilter}
            style={{ marginRight: 10 }}
            disabled={
              !userConditions.length || !filterName || activeTabKey === "2"
            }
          >
            Update
          </Button>
        ) : (
          <Button
            loading={saveFilterLoading}
            onClick={saveFilter}
            style={{ marginRight: 20 }}
            disabled={
              !userConditions.length || !filterName || activeTabKey === "2"
            }
          >
            Save
          </Button>
        )}
        {isEditing && (
          <Button onClick={cancelEdit} style={{ marginRight: 20 }}>
            Cancel
          </Button>
        )}
      </>
    ),
  };

  const addNewFileds = () => {
    const UserConditionInputs: ConditionType = {
      field: "",
      condition: "",
      values: "",
      keyIndentifier: Math.random(),
      isDone: false,
    };

    setUserConditions((prevCondtions) => [
      UserConditionInputs,
      ...prevCondtions,
    ]);
  };

  const handleUserConditions = (
    key: string,
    value: any,
    option: any,
    index: number
  ) => {
    try {
      const condition: ConditionType = userConditions[index];
      const updatedCondition = {
        ...condition,
        [key]: value,
      };
      if (option && option.key.includes("metadata-name"))
        updatedCondition.label = option.props.children;
      const newConditions = [...userConditions];
      newConditions[index] = updatedCondition;
      setUserConditions(newConditions);
    } catch (err) {}
  };

  const deleteCondition = (index: number) => {
    const newConditions = [...userConditions];
    newConditions.splice(index, 1);
    setUserConditions(newConditions);
  };

  const handleMarkDone = (index: number) => {
    const condition: ConditionType = userConditions[index];
    const updatedCondition = {
      ...condition,
      isDone: !condition.isDone,
    };
    const newConditions = [...userConditions];
    newConditions[index] = updatedCondition;
    setUserConditions(newConditions);
  };

  const handleFilterNameChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    setFilterName(ev.target.value);
  };

  return (
    <Drawer
      anchor="right"
      onClose={onClose}
      open={visible}
      PaperProps={{
        style: { backgroundColor: "white", padding: "20px", width: "34%" },
      }}
    >
      <Typography fontWeight={550} variant="subtitle1">
        Filters
      </Typography>
      <Divider style={{ marginBottom: "20px" }} />
      <Tabs
        style={{ position: "sticky" }}
        tabBarExtraContent={OperationsSlot}
        defaultActiveKey={
          savedFiltersFromServer?.userFilterGetAll?.data?.length > 0 ? "2" : "1"
        }
        activeKey={activeTabKey}
        onChange={(activeKey: string) => setActiveTabKey(activeKey)}
      >
        <TabPane tab={isEditing ? "Edit Filter" : "Add Filter"} key="1">
          <InputText
            onChange={handleFilterNameChange}
            error={!!filterNameError}
            errorText={filterNameError}
            value={filterName}
            label={"Filter Name"}
          />
          <Divider />
          <BasicSelect
            label="Component"
            onChange={onComponentChange}
            menuItems={components ? components : UIComponents}
            value={component}
          />
          <Divider />

          <Typography variant="subtitle1">Conditions</Typography>
          <ConditionView
            userConditions={userConditions}
            handleMarkDone={handleMarkDone}
            deleteCondition={deleteCondition}
            fieldsFromMetaData={fieldsFromMetaData}
            metaDataLoading={metaDataLoading}
            handleUserConditions={handleUserConditions}
          />

          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "flex-end",
              marginTop: "10px",
            }}
          >
            <Button
              onClick={() => {
                addNewFileds();
              }}
              placeholder="Add Condition"
            >
              Add
            </Button>
          </div>
        </TabPane>
        <TabPane tab="My Filters" key="2">
          <TabHeader
            title={defaultComponentTitle}
            isSwitchChecked={showSavedArchived}
            onSwitchChange={(value) => setShowSavedArchived(value)}
          />
          {savedFiltersFromServer &&
          savedFiltersFromServer.userFilterGetAll?.data?.length ? (
            savedFiltersFromServer?.userFilterGetAll?.data?.map((item: any) => {
              {
                return showSavedArchived || item.isActive ? (
                  <SavedFilter
                    setUserConditions={setUserConditions}
                    filter={item}
                    key={item.id}
                    executeRawQuery={executeRawQuery}
                    currentFilter={currentFilter}
                    updateFilter={updateFilter}
                    handleRefectFilters={handleRefectSavedFilters}
                    setEditMode={handleEditMode}
                    fieldsFromMetaData={fieldsFromMetaData}
                    isEditable={true}
                    isShareable={true}
                  />
                ) : null;
              }
            })
          ) : (
            <Box
              sx={{
                marginTop: "20%",
              }}
            >
              <NoData />
            </Box>
          )}
        </TabPane>
        <TabPane tab="Shared" key="3">
          <TabHeader
            title={defaultComponentTitle}
            isSwitchChecked={showSharedArchived}
            onSwitchChange={(value) => setShowSharedArchived(value)}
          />
          {sharedFiltersFromServer &&
          sharedFiltersFromServer.userFilterGetAll?.data?.length ? (
            sharedFiltersFromServer.userFilterGetAll?.data?.map((item: any) => {
              {
                return showSharedArchived || item.isActive ? (
                  <SavedFilter
                    setUserConditions={setUserConditions}
                    filter={item}
                    key={item.id}
                    executeRawQuery={executeRawQuery}
                    currentFilter={currentFilter}
                    updateFilter={updateFilter}
                    handleRefectFilters={refetchsharedSavedFilters}
                    fieldsFromMetaData={fieldsFromMetaData}
                  />
                ) : null;
              }
            })
          ) : (
            <Box
              sx={{
                marginTop: "20%",
              }}
            >
              <NoData />
            </Box>
          )}
        </TabPane>
      </Tabs>
    </Drawer>
  );
};

export default FilterView;

type TabHeaderProps = {
  isSwitchChecked: boolean;
  onSwitchChange: (value: boolean) => void;
  title?: string;
};
const TabHeader: React.FC<TabHeaderProps> = ({
  isSwitchChecked,
  onSwitchChange,
  title,
}: TabHeaderProps) => {
  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
        component={"div"}
      >
        <Typography fontWeight={"bold"} color={"primary"} variant="h6">
          {title}
        </Typography>

        <Tooltip title="Archived">
          <Switch
            checked={isSwitchChecked}
            onChange={(ev) => onSwitchChange(ev.target.checked)}
          />
        </Tooltip>
      </Box>
      <Divider style={{ marginTop: "10px" }} />
    </>
  );
};
