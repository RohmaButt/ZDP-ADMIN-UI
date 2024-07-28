import { gql } from "@apollo/client";

var UPDATE_NOTIFICATION_ACTION = gql`
  mutation updateNotificationAction(
    $param: NotificationParams!
    $input: UpdateNotificationAction!
  ) {
    updateNotificationAction(param: $param, input: $input) {
      id
      actionPerformed
    }
  }
`;

var RESET_UNREAD_NOTIFICATIONS_COUNT = gql`
  mutation resetUnreadNotificationCount {
    resetUnreadNotificationCount {
      resetUnreadNotificationCount
    }
  }
`;

var UPDATE_NOTIFICATION_CONFIG = gql `
mutation updateNotificationConfig(
  $param: NotificationConfigParams!
  $input: UpdateNotificationConfigInputArgs!
) {
  updateNotificationConfig(param: $param, input: $input) {
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
`

export { UPDATE_NOTIFICATION_ACTION, RESET_UNREAD_NOTIFICATIONS_COUNT, UPDATE_NOTIFICATION_CONFIG};
