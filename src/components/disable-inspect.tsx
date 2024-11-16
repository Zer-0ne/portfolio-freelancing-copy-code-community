import React, { useEffect } from "react";

const DisableInspect = ({ children }: { children: React.ReactNode }) => {
    useEffect(() => {
        // Handle right-click
        const handleContextMenu = (e: MouseEvent) => {
            e.preventDefault();
            // alert("Right-click is disabled on this page.");
        };

        // Disable developer tools shortcuts
        const handleKeyDown = (e: KeyboardEvent) => {
            if (
                e.key === "F12" ||
                (e.ctrlKey && e.shiftKey && (e.key === "I" || e.key === "J")) ||
                (e.ctrlKey && e.key === "U")
            ) {
                e.preventDefault();
                // alert("Developer tools are disabled.");
            }
        };

        // Detect if DevTools is open using timing (no debugger)
        // const detectDevTools = () => {
        //   const start = performance.now();
        //   // Use a timeout to simulate delay and check for developer tools
        //   setTimeout(() => {
        //     const end = performance.now();
        //     if (end - start > 100) {
        //       alert("Developer tools detected!");
        //       // You can include any logic here, like redirecting or disabling page actions
        //     }
        //   }, 100);
        // };

        // Check DevTools when window gains focus
        // const handleFocus = () => {
        //   detectDevTools();
        // };

        // Add event listeners for detecting right-click and keypresses
        document.addEventListener("contextmenu", handleContextMenu);
        document.addEventListener("keydown", handleKeyDown);
        // window.addEventListener("focus", handleFocus);

        // Detect inspect tools periodically
        const devToolsInterval = setInterval(() => {
            //   detectDevTools();
        }, 500); // Check every 500ms

        // Cleanup event listeners and interval on unmount
        return () => {
            document.removeEventListener("contextmenu", handleContextMenu);
            document.removeEventListener("keydown", handleKeyDown);
            //   window.removeEventListener("focus", handleFocus);
            clearInterval(devToolsInterval);
        };
    }, []);

    return <>{children}</>;
};

export default DisableInspect;
