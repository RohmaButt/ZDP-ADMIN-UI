export const getConditions = (type: string) => {
  switch (type) {
    case "integer":
      return ConditionsForInteger;
    case "string":
      return ConditionsForString;
    default:
      return Conditions;
  }
};

export const Conditions = [
  {
    label: "IS",
    value: "$eq",
  },
  {
    label: "IS NOT",
    value: "$ne",
  },
  {
    label: "GREATER THAN",
    value: "$gt",
  },
  {
    label: "LESS THAN",
    value: "$lt",
  },
  {
    label: "LESS THAN EQUAL TO",
    value: "$lte",
  },
  {
    label: "GREATER THAN EQUAL TO",
    value: "$gte",
  },
  {
    label: "CONTAINS",
    value: "$like",
  },
  {
    label: "STARTS WITH",
    value: "$like",
  },
  {
    label: "ENDS WITH",
    value: "$like",
  },
];

export const Conditions1 = [
  {
    label: "Is/Equals",
    value: "term",
  },
  {
    label: "Is Not",
    value: "isNot",
  },
  {
    label: "Greater Than",
    value: "greaterValue",
  },
  {
    label: "Less than",
    value: "lessValue",
  },
  {
    label: "Between",
    value: "between",
  },
  {
    label: "Less than equal to",
    value: "lessOrEqualValue",
  },
  {
    label: "Greater than equal to",
    value: "greaterOrEqualValue",
  },
  {
    label: "Contains",
    value: "contains",
  },
  {
    label: "Is Empty",
    value: "isEmpty",
  },
  {
    label: "Not Empty",
    value: "isNotEmpty",
  },

];

export const ConditionsForInteger = [
  {
    label: "IS",
    value: "$eq",
  },
  {
    label: "IS NOT",
    value: "$ne",
  },
  {
    label: "GREATER THAN",
    value: "$gt",
  },
  {
    label: "LESS THAN",
    value: "$lt",
  },
  {
    label: "LESS THAN EQUAL TO",
    value: "$lte",
  },
  {
    label: "GREATER THAN EQUAL TO",
    value: "$gte",
  },
];

export const ConditionsForString = [
  {
    label: "IS",
    value: "$eq",
  },
  {
    label: "IS NOT",
    value: "$ne",
  },
  {
    label: "CONTAINS",
    value: "$like",
  },
  {
    label: "STARTS WITH",
    value: "%$like",
  },
  {
    label: "ENDS WITH",
    value: "$like%",
  },
];
