import { useEffect, useRef, useState } from "react";
import { useQuery } from "@apollo/client";
import InfiniteScroll from "react-infinite-scroll-component";
import { GET_NOTIFICATIONS } from "../../graphql/notifications/queries";
import "./style.css";
import { List, ListItem } from "@mui/material";
import React from "react";
interface Item {
  id: number;
  text: string;
}
const Test = () => {
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [PaginatedDataFromDB, setPaginatedDataFromDB] = useState<any[]>([]);
  const [appendedData, setAppendedData] = useState<any[]>([]);

  const {
    loading: loadingNotficationsData,
    error: errorNotficationsData,
    data: notficationsData,
    refetch: refetchNotifications,
  } = useQuery(GET_NOTIFICATIONS, {
    fetchPolicy: "network-only",
    variables: {
      pagination: { limit: 5, offset: page },
    },
  });

  useEffect(() => {
    console.log("aa1", page, notficationsData?.getAllNotification?.data || []);
    setPaginatedDataFromDB(notficationsData?.getAllNotification?.data || []);
    if (page === 0)
      setAppendedData(notficationsData?.getAllNotification?.data || []);
  }, [notficationsData?.getAllNotification?.data, page]);

  const fetchMoreData = () => {
    try {
      setPage(page + 1);
      const newData = PaginatedDataFromDB;
      console.log("aa4", page, newData);
      if (appendedData === undefined || appendedData?.length >= 100) {
        setHasMore(false);
        return;
      }
      if (
        PaginatedDataFromDB === undefined ||
        PaginatedDataFromDB?.length === 0
      ) {
        setHasMore(false);
        return;
      } else {
        // const g: any[] = appendedData.concat([...newData]);
        // console.log("aa44", g);
        // setAppendedData((prevFirstArray: any) => [
        //   prevFirstArray.concat(newData),
        // ]);
        if (page !== 0) {
          setAppendedData((prevFirstArray: any) => [
            ...prevFirstArray,
            ...newData,
          ]);
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div className="main-div-scroll">
      <InfiniteScroll
        className="custom-infinite-scroll"
        dataLength={page * 5 || 0}
        next={fetchMoreData}
        hasMore={hasMore}
        loader={<h4>Loading...</h4>}
        height={100}
        endMessage={
          <p style={{ textAlign: "center" }}>
            <b>No more notifications</b>
          </p>
        }
      >
        {appendedData?.length > 0 &&
          appendedData?.map((item: any) => (
            <div key={item?.id}>
              {item?.id}-{item?.content}-{item?.type}
            </div>
          ))}
      </InfiniteScroll>
    </div>
  );
};
export default Test;
