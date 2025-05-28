'use client';
import React, { useState, useRef, useEffect } from 'react';
import {
    Roboto, Open_Sans, Lato, Montserrat, Oswald,
    Playfair_Display, Raleway, Ubuntu, Merriweather, Poppins, Dancing_Script
} from 'next/font/google';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Linkedin, Share } from 'lucide-react';
import { allPost } from '@/utils/FetchFromApi';
import { useParams } from 'next/navigation';

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
const dancingScript = Dancing_Script({ subsets: ['latin'], weight: ['400', '700', '500'] });

// Font mapping for Google Fonts
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
    'Dancing Script': dancingScript
};

// Certificate types consistent with CertificateEditor
const certificateTypes = ['participation', 'appreciation', 'achievement', 'completion', 'excellence'];

interface BaseTextItem {
    x: number;
    y: number;
    width: number;
    height: number;
    _id?: string;
}

interface CustomTextItem extends BaseTextItem {
    type: 'custom';
    text: string;
    fontSize: number;
    fontFamily: string;
    fontWeight: string;
    color: string;
    textAlign: 'left' | 'center' | 'right' | 'justify';
}

interface DescriptionTextItem extends BaseTextItem {
    type: 'description';
    descriptions: Record<string, string>;
    fontSize: number;
    fontFamily: string;
    fontWeight: string;
    color: string;
    textAlign: 'left' | 'center' | 'right' | 'justify';
}

interface QrCodeItem extends BaseTextItem {
    type: 'qrcode';
}

type TextItem = CustomTextItem | DescriptionTextItem | QrCodeItem;

interface CertificateData {
    _id: string;
    templateUrl: string;
    fields: TextItem[];
    createdAt: string;
    category: string;
    updatedAt: string;
    __v: number;
    originalWidth?: number;
    originalHeight?: number;
    eventName: string;
    userName: string;
    date: string;
}

// Corrected grammar in subheadings
const CertificateSubHeading: {
    [key: string]: (certificateData: CertificateData) => JSX.Element;
} = {
    participation: (certificateData: CertificateData) => (
        <h4 className="font-light text-[1rem] opacity-80 text-center">
            This certificate provided by{' '}
            <span className="font-semibold">
                Copy Code Community, Jamia Hamdard, New Delhi
            </span>{' '}
            is proof of the sheer grit, hard work, and dedication of the participant through which they have participated in the{' '}
            {certificateData.eventName}. CopyCode Community congratulates them on achieving yet another milestone.
        </h4>
    ),
    appreciation: (certificateData: CertificateData) => (
        <h4 className="font-light text-[1rem] opacity-80 text-center">
            This certificate of appreciation provided by{' '}
            <span className="font-semibold">
                Copy Code Community, Jamia Hamdard, New Delhi
            </span>{' '}
            recognizes the outstanding contribution and dedication of the participant in the{' '}
            {certificateData.eventName}. CopyCode Community applauds their exceptional achievement.
        </h4>
    ),
    achievement: (certificateData: CertificateData) => (
        <h4 className="font-light text-[1rem] opacity-80 text-center">
            This certificate of achievement provided by{' '}
            <span className="font-semibold">
                Copy Code Community, Jamia Hamdard, New Delhi
            </span>{' '}
            celebrates the remarkable success of the participant in the{' '}
            {certificateData.eventName}. CopyCode Community honors their outstanding performance.
        </h4>
    ),
    completion: (certificateData: CertificateData) => (
        <h4 className="font-light text-[1rem] opacity-80 text-center">
            This certificate of completion provided by{' '}
            <span className="font-semibold">
                Copy Code Community, Jamia Hamdard, New Delhi
            </span>{' '}
            certifies that the participant has successfully completed the{' '}
            {certificateData.eventName}. CopyCode Community commends their commitment to learning.
        </h4>
    ),
    excellence: (certificateData: CertificateData) => (
        <h4 className="font-light text-[1rem] opacity-80 text-center">
            This certificate of excellence provided by{' '}
            <span className="font-semibold">
                Copy Code Community, Jamia Hamdard, New Delhi
            </span>{' '}
            acknowledges the exemplary performance of the participant in the{' '}
            {certificateData.eventName}. CopyCode Community salutes their pursuit of excellence.
        </h4>
    ),
    default: (certificateData: CertificateData) => (
        <h4 className="font-light text-[1rem] opacity-80 text-center">
            This certificate is provided by{' '}
            <span className="font-semibold">
                Copy Code Community, Jamia Hamdard, New Delhi
            </span>{' '}
            for {certificateData.userName}'s participation in {certificateData.eventName}.
        </h4>
    )
};

const CertificatePreview: React.FC = () => {
    const [image, setImage] = useState<HTMLImageElement | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [certificateImageUrl, setCertificateImageUrl] = useState<string | null>(null);
    const [certificateData, setCertificateData] = useState<CertificateData | null>(null);
    const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const params = useParams();

    // Helper function to convert rem to pixels
    const remToPx = (rem: number) => {
        return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
    };

    useEffect(() => {
        if (!params?.id) {
            setError("Certificate ID is missing.");
            setIsLoading(false);
            return;
        }

        const fetchData = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const data = await allPost(`certificate/${params.id}`);
                
                if (!data || !data.template) {
                    throw new Error("Invalid certificate data received");
                }

                // Normalize category to handle different formats
                let category = data?.category?.toLowerCase() || "participation";

                const mappedData: CertificateData = {
                    _id: data?._id,
                    templateUrl: data?.template.templateUrl,
                    fields: data?.template.fields.map((field: TextItem) => ({
                        ...field,
                    })),
                    category,
                    createdAt: data?.createdAt,
                    updatedAt: data?.updatedAt,
                    __v: data?.__v,
                    eventName: data?.eventName,
                    userName: data?.name || data?.user?.name || "Unknown",
                    date: data?.date ? new Date(data.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    }) : "Unknown"
                };
                setCertificateData(mappedData);
            } catch (error) {
                console.error('Error fetching certificate data:', error);
                setError("Failed to load certificate data. Please try again later.");
                setIsLoading(false);
            }
        };
        fetchData();
    }, [params?.id]);

    const certificatePublicUrl = `${window.location.href}`;

    // Generate QR Code
    useEffect(() => {
        if (!certificatePublicUrl) return;

        generateQRCode(certificatePublicUrl).then(dataUrl => {
            setQrCodeDataUrl(dataUrl);
        }).catch(err => {
            console.error('QR Code generation failed:', err);
            setError("Failed to generate QR code.");
        });
    }, [certificatePublicUrl]);

    // Function to generate QR code
    const generateQRCode = async (url: string): Promise<string> => {
        try {
            const QRCode = await import('qrcode');
            return QRCode.toDataURL(url, { width: 300, margin: 1 });
        } catch (error) {
            console.error('Error generating QR code:', error);
            const canvas = document.createElement('canvas');
            canvas.width = 40;
            canvas.height = 40;
            const ctx = canvas.getContext('2d');
            if (!ctx) return '';
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, 40, 40);
            ctx.fillStyle = '#000000';
            ctx.fillRect(5, 5, 30, 30);
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(10, 10, 20, 20);
            ctx.fillStyle = '#000000';
            ctx.fillRect(15, 15, 10, 10);
            return canvas.toDataURL();
        }
    };

    useEffect(() => {
        if (!certificateData?.templateUrl) return;

        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => {
            setImage(img);
            setIsLoading(false);
        };
        img.onerror = () => {
            console.error("Failed to load image from:", certificateData.templateUrl);
            setError("Failed to load certificate template image.");
            setIsLoading(false);
        };
        img.src = certificateData.templateUrl;
    }, [certificateData?.templateUrl]);

    useEffect(() => {
        const handleResize = debounce(() => adjustCanvasSize(), 100);
        window.addEventListener('resize', handleResize);
        if (image && certificateData) adjustCanvasSize();
        return () => window.removeEventListener('resize', handleResize);
    }, [image, certificateData]);

    const debounce = (func: Function, wait: number) => {
        let timeout: NodeJS.Timeout;
        return (...args: any[]) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func(...args), wait);
        };
    };

    useEffect(() => {
        if (image && certificateData) {
            drawCanvas();
            generateShareableImage();
        }
    }, [image, certificateData, qrCodeDataUrl]);

    const variableValues = {
        name: certificateData?.userName || "John Doe",
        event_name: certificateData?.eventName || "CodeFest 2025",
        date: certificateData?.date || "March 15, 2025",
        certificate_type: certificateData?.category || "participation",
    };

    const generateShareableImage = async () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        try {
            const dataUrl = canvas.toDataURL('image/png');
            setCertificateImageUrl(dataUrl);
        } catch (error) {
            console.error("Error generating shareable image:", error);
            setError("Failed to generate shareable image.");
        }
    };

    const adjustCanvasSize = () => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container || !image || !certificateData) return;

        const containerWidth = container.clientWidth;
        const aspectRatio = image.height / image.width;

        canvas.width = containerWidth;
        canvas.height = containerWidth * aspectRatio;

        drawCanvas();
    };

    const drawCanvas = () => {
        const canvas = canvasRef.current;
        if (!canvas || !image || !certificateData) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const dpr = window.devicePixelRatio || 1;
        canvas.width = canvas.offsetWidth * dpr;
        canvas.height = (canvas.offsetWidth * image.height / image.width) * dpr;
        ctx.scale(dpr, dpr);

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(image, 0, 0, canvas.width / dpr, canvas.height / dpr);

        certificateData.fields.forEach((item) => {
            const absItem = toAbsolute(item, canvas.width / dpr, canvas.height / dpr);

            if (item.type === 'custom' && absItem.text && absItem.fontSize && absItem.fontFamily && absItem.fontWeight && absItem.color && absItem.textAlign) {
                ctx.textAlign = 'left';
                const lineHeight = absItem.fontSize * 1.2;
                wrapText(
                    ctx, absItem.text, absItem.x, absItem.y, absItem.width, absItem.height,
                    lineHeight, absItem.textAlign, absItem.fontSize, absItem.fontFamily,
                    absItem.fontWeight, absItem.color
                );
            } else if (item.type === 'description' && item.descriptions && absItem.fontSize && absItem.fontFamily && absItem.fontWeight && absItem.color && absItem.textAlign) {
                const descriptionText = item.descriptions[certificateData.category.toLowerCase()] || item.descriptions['participation'] || '';
                if (descriptionText) {
                    ctx.textAlign = 'left';
                    const lineHeight = absItem.fontSize * 1.2;
                    wrapText(
                        ctx, replacePlaceholders(descriptionText), absItem.x, absItem.y, absItem.width, absItem.height,
                        lineHeight, absItem.textAlign, absItem.fontSize, absItem.fontFamily,
                        absItem.fontWeight, absItem.color
                    );
                }
            } else if (item.type === 'qrcode' && qrCodeDataUrl) {
                const qrCodeImg = new Image();
                qrCodeImg.onload = () => {
                    ctx.imageSmoothingEnabled = false;
                    ctx.drawImage(qrCodeImg, absItem.x, absItem.y, absItem.width, absItem.height);
                };
                qrCodeImg.onerror = () => console.error("Error loading QR code image");
                qrCodeImg.src = qrCodeDataUrl;
            }
        });
    };

    const toAbsolute = (field: TextItem, canvasWidth: number, canvasHeight: number) => {
        const baseWidth = 1000;
        const scaleFactor = canvasWidth / baseWidth;

        const fontSizeInPixels = (field as CustomTextItem).fontSize ? remToPx((field as CustomTextItem).fontSize) * scaleFactor * 2.0 : 16;

        return {
            x: field.x * canvasWidth,
            y: field.y * canvasHeight,
            width: field.width * canvasWidth,
            height: field.height * canvasHeight,
            fontSize: fontSizeInPixels,
            text: field.type === 'custom' ? replacePlaceholders(field.text || '') : undefined,
            fontFamily: (field as CustomTextItem).fontFamily || 'Arial',
            fontWeight: (field as CustomTextItem).fontWeight || 'normal',
            color: (field as CustomTextItem).color || '#000000',
            textAlign: ((field as CustomTextItem).textAlign || 'center') as 'left' | 'center' | 'right' | 'justify',
        };
    };

    const replacePlaceholders = (text: string): string => {
        if (!text) return '';
        
        let replacedText = text;
        for (const key in variableValues) {
            const placeholder = `{{${key}}}`;
            const value = variableValues[key as keyof typeof variableValues];
            replacedText = replacedText.replace(new RegExp(placeholder, 'g'), value);
        }
        return replacedText;
    };

    const getFontFamilyName = (fontFamily?: string): string => {
        if (!fontFamily) return 'Arial';
        if (fontFamily in fontMap) {
            return fontMap[fontFamily as keyof typeof fontMap].style.fontFamily;
        }
        return fontFamily;
    };

    const measureFormattedTextWidth = (ctx: CanvasRenderingContext2D, text: string, fontSize: number, fontFamily: string, fontWeight: string) => {
        if (!text) return 0;
        
        let width = 0;
        const parts = text.split(/(<\/?b>|<\/?i>)/);
        let isBold = fontWeight === 'bold';
        let isItalic = false;

        const fontFamilyName = getFontFamilyName(fontFamily);

        parts.forEach(part => {
            if (part === '<b>') isBold = true;
            else if (part === '</b>') isBold = false;
            else if (part === '<i>') isItalic = true;
            else if (part === '</i>') isItalic = false;
            else if (part) {
                ctx.font = `${isBold ? '700' : fontWeight === 'lighter' ? '300' : '400'} ${isItalic ? 'italic' : 'normal'} ${fontSize}px ${fontFamilyName}`;
                width += ctx.measureText(part).width;
            }
        });
        return width;
    };

    const wrapText = (
        ctx: CanvasRenderingContext2D, text: string, x: number, y: number,
        maxWidth: number, maxHeight: number, lineHeight: number, textAlign: string,
        fontSize: number, fontFamily: string, fontWeight: string, color: string
    ) => {
        if (!text) return;
        
        const fontFamilyName = getFontFamilyName(fontFamily);
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
    };

    const renderFormattedText = (
        ctx: CanvasRenderingContext2D, text: string, x: number, y: number,
        fontSize: number, fontFamily: string, fontWeight: string, color: string
    ) => {
        if (!text) return;
        
        const parts = text.split(/(<\/?b>|<\/?i>)/);
        let currentX = x;
        let isBold = fontWeight === 'bold';
        let isItalic = false;

        const fontFamilyName = getFontFamilyName(fontFamily);

        parts.forEach(part => {
            if (part === '<b>') isBold = true;
            else if (part === '</b>') isBold = false;
            else if (part === '<i>') isItalic = true;
            else if (part === '</i>') isItalic = false;
            else if (part) {
                const fontStyle = `${isBold ? '700' : fontWeight === 'lighter' ? '300' : '400'} ${isItalic ? 'italic' : 'normal'} ${fontSize}px ${fontFamilyName}`;
                ctx.font = fontStyle;
                ctx.fillStyle = color;
                ctx.fillText(part, currentX, y);
                currentX += ctx.measureText(part).width;
            }
        });
    };

    const downloadCertificate = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        canvas.toBlob((blob) => {
            if (!blob) return;
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `certificate-${variableValues.name?.replace(/\s+/g, '-')}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        }, 'image/png', 1.0);
    };

    const shareToLinkedIn = async () => {
        try {
            const shareText = `Check out my certificate for ${variableValues.event_name}!`;
            const linkedInShareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(certificatePublicUrl)}&title=${encodeURIComponent(shareText)}`;
            window.open(linkedInShareUrl, '_blank');
        } catch (error) {
            console.error("Error sharing to LinkedIn:", error);
            setError("Failed to share to LinkedIn.");
        }
    };

    const shareToWhatsApp = async () => {
        try {
            const shareText = `Check out my certificate for ${variableValues.event_name}!\n\n${certificatePublicUrl}`;
            const whatsappShareUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
            window.open(whatsappShareUrl, '_blank');
        } catch (error) {
            console.error("Error sharing to WhatsApp:", error);
            setError("Failed to share to WhatsApp.");
        }
    };

    const getCertificateSubHeading = () => {
        if (!certificateData) return null;
        
        const category = certificateData.category.toLowerCase();
        const SubHeadingComponent = CertificateSubHeading[category] || CertificateSubHeading.default;
        return SubHeadingComponent(certificateData);
    };

    return (
        <Card className="shadow-md max-w-5xl mx-auto w-full">
            <CardHeader className="border-b">
                <CardTitle className="text-lg">Certificate of{' '}
                    <span className='capitalize'>
                        {certificateData?.category || 'Participation'}
                    </span>
                </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
                <div className='flex gap-2 items-center flex-col mb-3 justify-center'>
                    {certificateData && getCertificateSubHeading()}
                </div>
                <div ref={containerRef} className="flex justify-center bg-gray-50 p-4 rounded-md w-full">
                    {isLoading ? (
                        <div className="flex items-center justify-center w-full h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                        </div>
                    ) : error ? (
                        <div className="text-center text-red-500 p-4">{error}</div>
                    ) : certificateData && image ? (
                        <canvas
                            ref={canvasRef}
                            className="rounded-md shadow-sm w-full"
                        />
                    ) : (
                        <div className="text-center text-red-500 p-4">Failed to load certificate</div>
                    )}
                </div>
            </CardContent>
            <CardFooter className="border-t p-4 flex flex-wrap gap-3 justify-center">
                <Button
                    onClick={downloadCertificate}
                    className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
                    disabled={!certificateData || isLoading || !!error}
                >
                    <Download size={16} />
                    Download Certificate
                </Button>
                <Button
                    onClick={shareToLinkedIn}
                    className="bg-blue-800 hover:bg-blue-900 flex items-center gap-2"
                    disabled={!certificateData || isLoading || !!error}
                >
                    <Linkedin size={16} />
                    Share on LinkedIn
                </Button>
                <Button
                    onClick={shareToWhatsApp}
                    className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
                    disabled={!certificateData || isLoading || !!error}
                >
                    <Share size={16} />
                    Share on WhatsApp
                </Button>
            </CardFooter>
        </Card>
    );
};

export default CertificatePreview;