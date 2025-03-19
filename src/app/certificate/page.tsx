'use client';
import React, { useState, useRef, useEffect } from 'react';
import {
    Roboto, Open_Sans, Lato, Montserrat, Oswald,
    Playfair_Display, Raleway, Ubuntu, Merriweather, Poppins,
} from 'next/font/google';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Define Google Fonts
const roboto = Roboto({ subsets: ['latin'], weight: ['400', '700', '300'] });
const openSans = Open_Sans({ subsets: ['latin'], weight: ['400', '700', '300'] });
const lato = Lato({ subsets: ['latin'], weight: ['400', '700', '300'] });
const montserrat = Montserrat({ subsets: ['latin'], weight: ['400', '700', '300'] });
const oswald = Oswald({ subsets: ['latin'], weight: ['400', '700', '300'] });
const playfairDisplay = Playfair_Display({ subsets: ['latin'], weight: ['400', '700'] });
const raleway = Raleway({ subsets: ['latin'], weight: ['400', '700', '300'] });
const ubuntu = Ubuntu({ subsets: ['latin'], weight: ['400', '700', '300'] });
const merriweather = Merriweather({ subsets: ['latin'], weight: ['400', '700', '300'] });
const poppins = Poppins({ subsets: ['latin'], weight: ['400', '700', '300'] });

const fontMap = {
    'Roboto': roboto,
    'Open Sans': openSans,
    'Lato': lato,
    'Montserrat': montserrat,
    'Oswald': oswald,
    'Playfair Display': playfairDisplay,
    'Raleway': raleway,
    'Ubuntu': ubuntu,
    'Merriweather': merriweather,
    'Poppins': poppins,
};

interface TextItem {
    type: string;
    text: string;
    x: number;
    y: number;
    width: number;
    height: number;
    fontSize: number;
    fontFamily: string;
    fontWeight: string;
    color: string;
    textAlign: 'left' | 'center' | 'right' | 'justify';
    _id: { $oid: string };
}

interface CertificateData {
    _id: { $oid: string };
    templateUrl: string;
    fields: TextItem[];
    createdAt: { $date: string };
    updatedAt: { $date: string };
    __v: number;
}

const CertificatePreview: React.FC = () => {
    const [image, setImage] = useState<HTMLImageElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const imageRef = useRef<HTMLImageElement | null>(null);

    // Hardcoded values for variables (to be replaced with API later)
    const variableValues = {
        name: "John Doe",
        event_name: "CodeFest 2025",
        date: "March 15, 2025",
    };

    // MongoDB data
    const certificateData: CertificateData = {
        "_id": { "$oid": "67d4702968720bfd1356e7a5" },
        "templateUrl": "https://firebasestorage.googleapis.com/v0/b/copycodecommunity-a082f.appspot.com/o/Thumbnails%2Fcertificates%2F1741975590284_opjiwe5ew3g.png?alt=media&token=e95e6d73-643f-494d-8861-7b27deba8d9e",
        "fields": [
            {
                "type": "custom",
                "text": "{{name}}",
                "x": 0.25925496836289097,
                "y": 0.4495720184517974,
                "width": 0.47384368594599413,
                "height": 0.18231292517006806,
                "fontSize": 28,
                "fontFamily": "Roboto",
                "fontWeight": "bold",
                "color": "#000000",
                "textAlign": "center",
                "_id": { "$oid": "67d4702968720bfd1356e7a6" }
            },
            {
                "type": "custom",
                "text": "{{event_name}} on dated {{date}} at <b>copy code community jamia hamdard</b>",
                "x": 0.2,
                "y": 0.5852193738530836,
                "width": 0.5979591836734693,
                "height": 0.1694118519342343,
                "fontSize": 18,
                "fontFamily": "Roboto",
                "fontWeight": "normal",
                "color": "#000000",
                "textAlign": "center",
                "_id": { "$oid": "67d4702968720bfd1356e7a7" }
            }
        ],
        "createdAt": { "$date": "2025-03-14T18:06:33.428Z" },
        "updatedAt": { "$date": "2025-03-14T18:06:33.428Z" },
        "__v": 0
    };

    useEffect(() => {
        const img = new Image();
        img.crossOrigin = "anonymous"; // Handle CORS for external images
        img.onload = () => {
            console.log("Image loaded successfully");
            setImage(img);
            imageRef.current = img;
            adjustCanvasSize();
        };
        img.onerror = (error) => {
            console.error("Failed to load image from:", certificateData.templateUrl, error);
        };
        img.src = certificateData.templateUrl;
    }, []);

    useEffect(() => {
        if (image) {
            drawCanvas();
        }
    }, [image]);

    const adjustCanvasSize = () => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container || !image) {
            console.error("Canvas, container, or image not available");
            return;
        }

        const containerWidth = container.clientWidth;
        const aspectRatio = image.height / image.width;

        canvas.width = containerWidth;
        canvas.height = containerWidth * aspectRatio;
        drawCanvas();
    };

    const toAbsolute = (field: TextItem, canvasWidth: number, canvasHeight: number) => ({
        x: field.x * canvasWidth,
        y: field.y * canvasHeight,
        width: field.width * canvasWidth,
        height: field.height * canvasHeight,
        fontSize: field.fontSize,
        text: field.text,
        fontFamily: field.fontFamily,
        fontWeight: field.fontWeight,
        color: field.color,
        textAlign: field.textAlign,
    });

    const replaceVariables = (text: string) => {
        let replacedText = text;
        Object.entries(variableValues).forEach(([key, value]) => {
            const regex = new RegExp(`{{${key}}}`, 'g');
            replacedText = replacedText.replace(regex, value);
        });
        console.log("Replaced text:", replacedText); // Debug the replaced text
        return replacedText;
    };

    const measureFormattedTextWidth = (ctx: CanvasRenderingContext2D, text: string, fontSize: number, fontFamily: string, fontWeight: string) => {
        let width = 0;
        const parts = text.split(/(<\/?b>|<\/?i>)/);
        let isBold = fontWeight === 'bold';
        let isItalic = false;

        parts.forEach(part => {
            if (part === '<b>') {
                isBold = true;
            } else if (part === '</b>') {
                isBold = false;
            } else if (part === '<i>') {
                isItalic = true;
            } else if (part === '</i>') {
                isItalic = false;
            } else if (part) {
                ctx.font = `${isBold ? '700' : fontWeight === 'lighter' ? '300' : '400'} ${isItalic ? 'italic' : 'normal'} ${fontSize}px "${fontFamily}"`;
                width += ctx.measureText(part).width;
            }
        });

        return width;
    };

    const wrapText = (ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, maxHeight: number, lineHeight: number, textAlign: string, fontSize: number, fontFamily: string, fontWeight: string, color: string) => {
        const words = text.split(' ');
        let line = '';
        let currentY = y;
        const lines: { text: string; x: number }[] = [];

        for (let i = 0; i < words.length; i++) {
            const testLine = line + words[i] + ' ';
            const testWidth = measureFormattedTextWidth(ctx, testLine, fontSize, fontFamily, fontWeight);

            if (testWidth > maxWidth && i > 0) {
                if (currentY + lineHeight > y + maxHeight) break;
                lines.push({ text: line.trim(), x });
                line = words[i] + ' ';
                currentY += lineHeight;
            } else {
                line = testLine;
            }
        }

        if (currentY + lineHeight <= y + maxHeight) {
            lines.push({ text: line.trim(), x });
            currentY += lineHeight;
        }

        lines.forEach((lineObj, index) => {
            let xPos = lineObj.x;
            const lineWidth = measureFormattedTextWidth(ctx, lineObj.text, fontSize, fontFamily, fontWeight);

            switch (textAlign) {
                case 'center':
                    xPos = lineObj.x + (maxWidth - lineWidth) / 2;
                    break;
                case 'right':
                    xPos = lineObj.x + maxWidth - lineWidth;
                    break;
                case 'justify':
                    if (index < lines.length - 1) {
                        const wordsInLine = lineObj.text.split(' ');
                        if (wordsInLine.length > 1) {
                            const spaceWidth = (maxWidth - measureFormattedTextWidth(ctx, wordsInLine.join(''), fontSize, fontFamily, fontWeight)) / (wordsInLine.length - 1);
                            let currentX = lineObj.x;
                            wordsInLine.forEach((word) => {
                                renderFormattedText(ctx, word, currentX, y + index * lineHeight, fontSize, fontFamily, fontWeight, color);
                                currentX += ctx.measureText(word.replace(/<\/?b>|<\/?i>/g, '')).width + spaceWidth;
                            });
                            return;
                        }
                    }
                    break;
            }

            renderFormattedText(ctx, lineObj.text, xPos, y + index * lineHeight, fontSize, fontFamily, fontWeight, color);
        });

        return currentY - y;
    };

    const renderFormattedText = (ctx: CanvasRenderingContext2D, text: string, x: number, y: number, fontSize: number, fontFamily: string, fontWeight: string, color: string) => {
        const parts = text.split(/(<\/?b>|<\/?i>)/);
        let currentX = x;
        let isBold = fontWeight === 'bold';
        let isItalic = false;

        parts.forEach(part => {
            if (part === '<b>') {
                isBold = true;
            } else if (part === '</b>') {
                isBold = false;
            } else if (part === '<i>') {
                isItalic = true;
            } else if (part === '</i>') {
                isItalic = false;
            } else if (part) {
                const fontStyle = `${isBold ? '700' : fontWeight === 'lighter' ? '300' : '400'} ${isItalic ? 'italic' : 'normal'} ${fontSize}px "${fontFamily}"`;
                ctx.font = fontStyle;
                ctx.fillStyle = color;
                ctx.fillText(part, currentX, y);
                currentX += ctx.measureText(part).width;
            }
        });
    };

    const drawCanvas = () => {
        const canvas = canvasRef.current;
        if (!canvas || !image) {
            console.error("Canvas or image not available for drawing");
            return;
        }
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            console.error("2D context not available");
            return;
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw the template image
        if (imageRef.current) {
            try {
                ctx.drawImage(imageRef.current, 0, 0, canvas.width, canvas.height);
                console.log("Image drawn successfully");
            } catch (error) {
                console.error("Error drawing image:", error);
            }
        } else {
            console.error("Image reference not set");
        }

        // Draw the text fields with replaced variables
        certificateData.fields.forEach((item) => {
            const absItem = toAbsolute(item, canvas.width, canvas.height);
            ctx.textAlign = 'left'; // Reset for internal calculations
            const lineHeight = absItem.fontSize * 1.2;
            const replacedText = replaceVariables(item.text);
            wrapText(ctx, replacedText, absItem.x, absItem.y, absItem.width, absItem.height, lineHeight, absItem.textAlign, absItem.fontSize, absItem.fontFamily, absItem.fontWeight, absItem.color);
        });
    };

    return (
        <div className={`certificate-preview ${fontMap['Roboto'].className} container mx-auto p-6 max-w-6xl`}>
            <h1 className="text-2xl font-semibold mb-6 text-gray-800">Certificate Preview</h1>

            <Card className="shadow-md">
                <CardHeader>
                    <CardTitle className="text-lg">Generated Certificate</CardTitle>
                </CardHeader>
                <CardContent>
                    {image ? (
                        <div ref={containerRef}>
                            <canvas
                                ref={canvasRef}
                                className="w-full h-auto border rounded-md shadow-sm"
                            />
                        </div>
                    ) : (
                        <p>Loading certificate template... Check console for errors.</p>
                    )}
                </CardContent>
            </Card>

            <div className="mt-6">
                <h3 className="text-lg font-medium mb-4">Certificate Data</h3>
                <pre className="bg-gray-100 p-4 rounded-md text-sm overflow-auto max-h-64 border">
                    {JSON.stringify({
                        template: certificateData.templateUrl,
                        fields: certificateData.fields.map(field => ({
                            ...field,
                            text: replaceVariables(field.text)
                        }))
                    }, null, 2)}
                </pre>
            </div>
        </div>
    );
};

export default CertificatePreview;