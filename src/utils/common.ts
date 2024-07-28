import { ConditionType } from "../components/FilterView";
import { UserData } from "../pages/UserProfile/UserProfileDetails";
import { UserRoles } from "./constants";

export const createQuery = (userConditions: ConditionType[],entity:string) => {
  if (userConditions.length === 0) {
    return {};
  } else {
    const conditionsObject: Array<any> = [];
    userConditions.map((conditionItem) => {
      conditionsObject.push({
        [`${entity}.${conditionItem.field}`]: {
          [conditionItem.condition]: conditionItem.values,
        },
      });
      return 0;
    });

    const query = {
      $and: {
        $and: conditionsObject,
      }
    };
    return query;
  }
};

export const createQueryCondition = (condtion: ConditionType) => {
  const conditionStringObject = {
    [condtion.field]: {
      [condtion.condition]: condtion.values,
    },
  };

  return conditionStringObject;
};

export const unionOfArrays = (arr1: Array<any>, arr2: Array<any>) => {
  const union = Array.from(new Set([...arr1, ...arr2]));
  return union;
};

export const getFirstTwoLetters = (name: string | undefined) => {
  if (!name) return "";

  const nameArr = name.split(" ");

  if (nameArr.length === 1) {
    return nameArr[0][0];
  }

  const firstName = nameArr[0];
  const secondName = nameArr[1];

  return `${firstName[0]}${secondName[0]}`;
};

export const getFullName = (firstName: string | undefined, lastName: string | undefined) => {
  if (!firstName) return "";
  if (!lastName) return firstName;
  return `${firstName} ${lastName}`;
};

export const getNewObject = (obj: object) => {
  return JSON.parse(JSON.stringify(obj));
};

export const isUserReadOnly = (roleId: number) => {
  return roleId == UserRoles.read_only;
};

export const getRoleId = (user: UserData | null) => {
  return user?.roles[0]?.roleId;
};
 
export const getFriendlyName = (str: string) => {
  var i,
    frags = str.split('_');
  for (i = 0; i < frags.length; i++) {
    frags[i] = frags[i].charAt(0).toUpperCase() + frags[i].slice(1);
  }
  return frags.join(' ');
};

export const getRoutePath = (path: string) => {
  const commonRoute = '/admin';
  if (path.startsWith('/')) {
    path = path.slice(1);
  }
  return `${commonRoute}/${path}`;
};

export const getRole = (user: UserData | null) => {
  const id = getRoleId(user);

  if (id == 1) return 'Read Only';
  else if (id == 2) return 'Write';
  else if (id == 3) return 'Admin';
  else return 'Super Admin';
};

export const  toPascalCase=(str: string) =>{
  // Split the string by whitespace and non-alphanumeric characters
  const words = str.split(/[\s\W]+/);
  
  // Capitalize the first letter of each word
  const capitalizedWords = words.map(word => word.charAt(0).toUpperCase() + word.slice(1));

  // Join the capitalized words without any separator
  const pascalCase = capitalizedWords.join(' ');

  return pascalCase;
}