import React, { useEffect } from "react";

const DisableInspect = ({ children }: { children: React.ReactNode }) => {
    useEffect(() => {
        // Handle right-click
        const handleContextMenu = (e: MouseEvent) => {
            e.preventDefault();
            alert("Right-click is disabled on this page.");
        };

        // Disable developer tools shortcuts
        const handleKeyDown = (e: KeyboardEvent) => {
            if (
                e.key === "F12" ||
                (e.ctrlKey && e.shiftKey && (e.key === "I" || e.key === "J")) ||
                (e.ctrlKey && e.key === "U")
            ) {
                e.preventDefault();
                alert("Developer tools are disabled.");
            }
        };

        // Detect if DevTools is open
        const detectDevTools = () => {
            const devToolsOpen = /./;
            devToolsOpen.toString = () => {
                console.log("DevTools detected!");
                setTimeout(() => {
                    alert("Developer tools detected! Closing the tab...");
                    window.close(); // Attempt to close the tab
                }, 1000);
                return "DevTools detected!";
            };
            console.log(devToolsOpen);
        };

        // Add event listeners
        document.addEventListener("contextmenu", handleContextMenu);
        document.addEventListener("keydown", handleKeyDown);

        // Detect inspect tools periodically
        const devToolsInterval = setInterval(detectDevTools, 1000);

        // Cleanup event listeners on unmount
        return () => {
            document.removeEventListener("contextmenu", handleContextMenu);
            document.removeEventListener("keydown", handleKeyDown);
            clearInterval(devToolsInterval);
        };
    }, []);

    return <>{children}</>;
};

export default DisableInspect;
