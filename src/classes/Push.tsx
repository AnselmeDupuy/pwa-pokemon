export class Push {

    
    askPermission = () => {
        Notification.requestPermission().then((permission) => {
            if (permission !== "granted") {
                console.error("Notification permission not granted");
                return;
            }
        });
    };

    sendNotification = (msg : string, body: string, tag: string) => {
            new Notification(msg, {
                body: body,
                icon: "/icons/icon-192x192.maskable.png",
                tag: tag,
            });
    };
}