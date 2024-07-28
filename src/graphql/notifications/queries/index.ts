import { gql } from "@apollo/client";

export const GET_DATA_BY_JSON = gql`
  query GetDataByJsonQuery(
    $pagination: PaginationInput!
    $DataModelInput: DataModelInput!
    $QueryInput: FilterInputString!
  ) {
    GetDataByJsonQuery(
      pagination: $pagination
      DataModelInput: $DataModelInput
      QueryInput: $QueryInput
    ) {
      info
    }
  }
  `
export const GET_NOTIFICATIONS = gql`
  query getNotifications($pagination: PaginationInput!) {
    getAllNotification(pagination: $pagination) {
      data {
        id
        content
        context
        type
        from
        to
        actionPerformed
        readAt
        metadata
        url
        appId
        createdAt
        updatedAt
        deletedAt
        createdBy
        createdByUsername
        updatedBy
        updatedByUsername
        fromUser {
          createdAt
          updatedAt
          deletedAt
          createdBy
          createdByUsername
          updatedBy
          updatedByUsername
          id
          externalUserId
          authenticationType
          firstName
          lastName
          email
          userName
          isActive
          profilePic
        }
        toUser {
          createdAt
          updatedAt
          deletedAt
          createdBy
          createdByUsername
          updatedBy
          updatedByUsername
          id
          externalUserId
          authenticationType
          firstName
          lastName
          email
          userName
          isActive
          profilePic
        }
      }
      totalRecords
    }
  }
`;

export const GET_UNREAD_NOTIFICATIONS_COUNT = gql`
  query getUnreadNotificationCount {
    getUnreadNotificationCount {
      unreadNotificationCount
    }
  }
`;

export const GET_NOTIFICATION_CONFIG = gql`
  query getNotificationConfig {
    getNotificationConfig(
      param:{
        appId: 1
      }    
    ){
      appId
      userId
      itemEdited {
        isEmailNotification
        isInAppNotification
      }
      itemShared {
        isEmailNotification
        isInAppNotification
      }
      approvalRequest {
        isEmailNotification
        isInAppNotification
      }
    }
  }
`;

export const temp = gql`
query getNotificationConfig($param: NotificationConfigParams!) {
  getNotificationConfig(param: $param) {
    appId
    userId
    itemEdited {
      isEmailNotification
      isInAppNotification
    }
    itemShared {
      isEmailNotification
      isInAppNotification
    }
    approvalRequest {
      isEmailNotification
      isInAppNotification
    }
  }
}
`;

