import { useQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
  addMetaData,
  selectMetaData,
} from "../features/metaData/metaDataSlice";
import { GET_EDI_METADATA } from "../graphql/dashboard/queries";

export type MetaDataDictionaryType = {
  [key: string]: Object;
};

const useMetaData = () => {
  const dispatch = useAppDispatch();
  const { data: metaData, loading, error } = useQuery(GET_EDI_METADATA);
  const metaDataDictionaryRedux = useAppSelector(selectMetaData);
  const [metaDataDictionary, setmetaDataDictionary] = useState<
    MetaDataDictionaryType | any | null
  >(null);

  useEffect(() => {
    if (!metaDataDictionaryRedux && metaData) {
      const metaDataDictionary: MetaDataDictionaryType = {};
      const DTOs: Array<any> = metaData.GetEdiFeedStatisticMetaData.info;
      DTOs.map((dtoMetaData: any) => {
        const key = dtoMetaData.name;
        metaDataDictionary[key] = dtoMetaData;
        return dtoMetaData;
      });
      dispatch(addMetaData(metaDataDictionary));
      setmetaDataDictionary(metaDataDictionary);
    } else {
      setmetaDataDictionary(metaDataDictionaryRedux);
    }
  }, [metaData, metaDataDictionaryRedux]);

  return [metaDataDictionary, loading, error];
};

export default useMetaData;
