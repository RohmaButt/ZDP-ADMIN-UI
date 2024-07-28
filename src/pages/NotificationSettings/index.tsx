import React, { FC, useEffect, useState, useRef } from "react";
import { temp } from "../../graphql/notifications/queries";
import { UPDATE_NOTIFICATION_CONFIG } from "../../graphql/notifications/mutations";
import { useMutation, useQuery } from "@apollo/client";
import { userLocalStorageKey } from "../../utils/constants";
import { NotificationSettingsComponent } from "@zdp-pim/zdp-ui-kit";

const NotificationSettings: FC = () => {
    const [value, setValue] = React.useState('1');

    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        setValue(newValue);
    };

    const RoleLookup = () => {
        const roles = localStorage.getItem(userLocalStorageKey);
        if (roles) {
            const rolesObj = JSON.parse(roles);
            return rolesObj.roles;
        } else {
            return null;
        }
    };

    const extractAppIds = (records: any) => {
        return records.map((record: any) => record.appId);
    }

    const roles = RoleLookup();
    
    const appIds = extractAppIds(roles);

    const [notificationSettings, setNotificationSettings] = useState(
        {
            itemEdited: {
                isEmailNotification: false,
                isInAppNotification: false,
            },
            itemShared: {
                isEmailNotification: false,
                isInAppNotification: false,
            },
            approvalRequest: {
                isEmailNotification: false,
                isInAppNotification: false,
            },
        }

    );

    const {
        data: configData,
        loading: configLoading,
        error: configError,
    } = useQuery(temp, {
        variables: {
            param: {
                appId: parseFloat(value)
            },
        },
    });

    useEffect(() => {
        if (configData) {
            setNotificationSettings((prevSettings) => ({
                ...prevSettings,
                approvalRequest: configData?.getNotificationConfig?.approvalRequest,
                itemShared: configData?.getNotificationConfig?.itemShared,
                itemEdited: configData?.getNotificationConfig?.itemEdited,
            }));
        }
    }, [configData]);

    const [updateNotificationConfig, { loading, error, data }] = useMutation(UPDATE_NOTIFICATION_CONFIG);

    const [togglePressed, setTogglePressed] = React.useState(false);

    const handleToggle = (field: string, value: any) => {
        setNotificationSettings((prevSettings) => ({
            ...prevSettings,
            [field]: value,
        }));
        setTogglePressed(true);
    };

    const handleUpdate = async () => {
        const appId = parseFloat(value);
        const sharedInApp = notificationSettings?.itemShared?.isInAppNotification;
        const sharedEmail = notificationSettings?.itemShared?.isEmailNotification;
        const editedInApp = notificationSettings?.itemEdited?.isInAppNotification;
        const editedEmail = notificationSettings?.itemEdited?.isEmailNotification;
        const approvalInApp = notificationSettings?.approvalRequest?.isInAppNotification;
        const approvalEmail = notificationSettings?.approvalRequest?.isEmailNotification;
        try {
            const { data } = await updateNotificationConfig({
                variables: {
                    param: {
                        appId: appId
                    },

                    input: {
                        itemShared: {
                            isInAppNotification: sharedInApp,
                            isEmailNotification: sharedEmail
                        },
                        itemEdited: {
                            isInAppNotification: editedInApp,
                            isEmailNotification: editedEmail
                        },
                        approvalRequest: {
                            isInAppNotification: approvalInApp,
                            isEmailNotification: approvalEmail
                        }
                    },
                },
            });
            console.log('Notification configuration updated:', data.updateNotificationConfig);
        } catch (error) {
            console.error('Error updating notification configuration:', error);
        }
    };

    useEffect(() => {
        if (togglePressed==true){
            handleUpdate();
            setTogglePressed(false);
        }
    }, [notificationSettings]);

    return (
        <NotificationSettingsComponent
            data={notificationSettings}
            notificationSettings={notificationSettings}
            handleToggle={handleToggle}
            value={value}
            appIds={appIds}
            handleChange={handleChange}
        />
    );
};

export default NotificationSettings;