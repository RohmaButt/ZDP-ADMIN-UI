import {
  CheckCircleOutlined,
  DeleteOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { Button, Divider, Tag, Typography } from "antd";
import React from "react";
import { Conditions } from "../../utils/conditionalOperators";
import GetInputField from "../DynamicInput";
import BasicSelect from "../external/BasicSelect";
import { ConditionType } from "../FilterView";
import SelectDropdown from "../SelectDropdown";

const { Text } = Typography;

const getUserReadableCondition = (condition: string) => {
  const index = Conditions.findIndex((item) => item.value === condition);
  return Conditions[index].label;
};

export type ConditionViewPropTypes = {
  userConditions: Array<ConditionType>;
  handleMarkDone: (index: number) => void;
  deleteCondition: (index: number) => void;
  handleUserConditions: any;
  fieldsFromMetaData: any;
  metaDataLoading: boolean;
};

const ConditionView = ({
  userConditions,
  handleMarkDone,
  deleteCondition,
  handleUserConditions,
  fieldsFromMetaData,
  metaDataLoading,
}: ConditionViewPropTypes) => {
  return (
    <div>
      {userConditions.map((condition, index) => {
        const conditionText =
          condition.isDone &&
          `${condition.label}    ${getUserReadableCondition(
            condition.condition
          )}   ${`{ ${condition.values} }`}`;
        return condition.isDone ? (
          <div key={condition.keyIndentifier}>
            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginTop: "8px",
              }}
            >
              <div style={{ width: "90%", overflow: "clip" }}>
                <Tag
                  style={{
                    fontSize: 14,
                    backgroundColor: "#1890ff",
                    padding: 4,
                    border: 0,
                    paddingInline: "12px",
                    maxWidth: "95%",
                  }}
                >
                  <Text
                    ellipsis={
                      conditionText && conditionText?.length > 10
                        ? { tooltip: conditionText }
                        : false
                    }
                    style={{
                      color: "white",
                    }}
                  >
                    {conditionText}
                  </Text>
                </Tag>
              </div>
              <div style={{ width: "5%", marginRight: "5px" }}>
                <EditOutlined
                  onClick={() => {
                    handleMarkDone(index);
                  }}
                />
              </div>
              <div style={{ width: "5%" }}>
                <DeleteOutlined
                  onClick={() => {
                    deleteCondition(index);
                  }}
                />
              </div>
            </div>
          </div>
        ) : (
          <div key={condition.keyIndentifier}>
            <BasicSelect
              label="Field"
              menuItems={fieldsFromMetaData}
              defaultValue={condition.field}
              onChange={(value: string, option: any) => {
                handleUserConditions("field", value, option, index);
              }}
              labelKey={"metadata"}
              hasNestedLabel={true}
              nestedLabelKey={"friendlyName"}
              valueKey={"name"}
              formStyle={{ marginTop: 10 }}
              isLoading={metaDataLoading}
            />

            <BasicSelect
              label="Condition"
              defaultValue={condition.condition}
              onChange={(value: string, option: any) =>
                handleUserConditions("condition", value, option, index)
              }
              menuItems={Conditions}
              formStyle={{ marginTop: 20 }}
              disabled={!condition.field}
            />

            {condition.field &&
              GetInputField(
                handleUserConditions,
                condition.field,
                index,
                fieldsFromMetaData,
                condition.values
              )}
            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "flex-end",
                marginTop: 20,
              }}
            >
              <Button
                size="large"
                icon={
                  <DeleteOutlined
                    onClick={() => {
                      deleteCondition(index);
                    }}
                    placeholder="Condition delete button"
                  />
                }
              ></Button>
              <Button
                size="large"
                placeholder="Condition done button"
                disabled={
                  condition.field && condition.condition && condition.values
                    ? false
                    : true
                }
                onClick={() => {
                  handleMarkDone(index);
                }}
                icon={<CheckCircleOutlined />}
              ></Button>
            </div>
            <Divider />
          </div>
        );
      })}
    </div>
  );
};

export default ConditionView;
