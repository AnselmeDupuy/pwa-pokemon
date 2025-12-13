const setNotifTimer = () => {
    setTimeout(() => {
        new Notification("Rappel PWA !", {
            body: "Ceci est un rappel.",
            icon: "/icons/icon-192x192.maskable.png",
            badge: "/icons/badge-72x72.png",
            tag: "reminder-notification",
        });
    }, 10000);
}

const NotificationManager = () => {
    // Demander la permission si ce n'est pas déjà fait
    const askPermission = () => {
        Notification.requestPermission().then((permission) => {
            if (permission !== "granted") {
                console.error("Notification permission not granted");
                return;
            }
        });
    };

    const sendNotification = () => {
        // Créer et afficher la notification
            new Notification("Nouvelle alerte PWA !", {
                body: "Vous avez un nouveau message de l'atelier PWA.",
                icon: "/icons/icon-192x192.maskable.png", // Icône affichée dans la notification
                tag: "message-notification", // Identifiant unique pour regrouper les notifications
            });
    };

    return (
        <>
        {Notification.permission === "default" && <button onClick={askPermission}>Demander la permission</button>}

        {Notification.permission === "granted" && <button onClick={sendNotification}>Envoyer une notification</button>}

        { Notification.permission === "granted" && <button onClick={setNotifTimer}>Programmer un rappel</button> }
    </>
)};

export { NotificationManager };