'use client'
import { Typography } from "@mui/material";
import { NextFont } from "next/dist/compiled/@next/font";
import { useEffect, useState } from "react";

const Typewriter = ({ texts, speed, onFinish, className, ref, style }: {
    texts: string[];
    speed: number;
    className?: NextFont
    onFinish: () => void,
    ref?: any;
    style?: any
}) => {
    const [displayedText, setDisplayedText] = useState("");
    const [textIndex, setTextIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isFinished, setIsFinished] = useState(false);

    useEffect(() => {
        const currentText = texts[textIndex];

        const timeout = setTimeout(() => {
            if (isFinished) return; // Stop if finished

            if (isDeleting) {
                setDisplayedText(currentText.substring(0, displayedText.length - 1));
                if (displayedText === "") {
                    // Wait for 1-2 seconds before moving to the next text
                    if (textIndex === texts.length - 1) {
                        setIsFinished(true); // Mark as finished if it's the last text
                        onFinish(); // Call the onFinish callback
                    } else {
                        setIsDeleting(false);
                        setTextIndex((prevIndex) => prevIndex + 1); // Move to the next text
                    }
                }
            } else {
                setDisplayedText(currentText.substring(0, displayedText.length + 1));
                if (displayedText === currentText) {
                    // Wait for 1-2 seconds before stopping
                    if (textIndex === texts.length - 1) {
                        setIsFinished(true); // Mark as finished if it's the last text
                        onFinish(); // Call the onFinish callback
                    } else {
                        // Wait before starting to delete
                        setTimeout(() => {
                            setIsDeleting(true);
                        }, 1000); // Adjust this value for the pause duration
                    }
                }
            }
        }, isDeleting ? speed / 3 : speed); // Deleting is 3 times faster

        return () => clearTimeout(timeout);
    }, [displayedText, isDeleting, speed, textIndex, texts, isFinished, onFinish]);

    return (
        <Typography
            variant='body1'
            sx={{
                fontSize: { xl: 20, md: 16, xs: 14 },
                fontFamily: `${className?.style?.fontFamily} !important`
            }} style={style} className={`${className?.className}`}>
            {displayedText}
        </Typography>
    );
};

export default Typewriter;
