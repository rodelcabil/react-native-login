import PushNotification from 'react-native-push-notification';

const showNotification = (title, message) => {
    PushNotification.localNotification({
        title: title,
        message: message,
        channelId: "123",
    });
};

const handleScheduleNotification = (title, message, date) => {
    PushNotification.localNotificationSchedule({
        title: title,
        message: message,
        channelId: "123",
        //date: new Date(Date.now() + 5 * 1000), 
        //3600
        date: new Date(Date.now() + 5 * 1000), 
        allowWhileIdle: true,
    });
};

const handleCancel = () => {
    PushNotification.cancelAllLocalNotifications();
};

export {showNotification, handleScheduleNotification, handleCancel};