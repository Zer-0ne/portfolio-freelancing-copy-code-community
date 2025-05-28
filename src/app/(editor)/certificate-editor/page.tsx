'use client';
import React, { useState, useRef, useEffect } from 'react';
import {
    Roboto, Open_Sans, Lato, Montserrat, Oswald,
    Playfair_Display, Raleway, Ubuntu, Merriweather, Poppins, Dancing_Script
} from 'next/font/google';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { allPost, createNew, allPost as fetchAll, editPost as updatePost } from '@/utils/FetchFromApi';

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

const certificateTypes = ['participation', 'appreciation', 'achievement', 'completion', 'excellence'];

type BaseTextItem = {
    x: number;
    y: number;
    width: number;
    height: number;
    _id?: string;
}

type CustomTextItem = BaseTextItem & {
    type: 'custom';
    text: string;
    fontSize: number;
    fontFamily: string;
    fontWeight: string;
    color: string;
    textAlign: 'left' | 'center' | 'right' | 'justify';
}

type DescriptionTextItem = BaseTextItem & {
    type: 'description';
    descriptions: Record<string, string>;
    fontSize: number;
    fontFamily: string;
    fontWeight: string;
    color: string;
    textAlign: 'left' | 'center' | 'right' | 'justify';
}

type QrCodeItem = BaseTextItem & {
    type: 'qrcode';
}

type TextItem = CustomTextItem | DescriptionTextItem | QrCodeItem;

export interface CertificateTemplate {
    _id: string;
    templateUrl: string;
    fields: TextItem[];
    createdAt: { $date: string };
    updatedAt: { $date: string };
    __v: number;
}

const CertificateEditor: React.FC = () => {
    const [image, setImage] = useState<HTMLImageElement | null>(null);
    const [fields, setFields] = useState<TextItem[]>([]);
    const [textInput, setTextInput] = useState<string>('');
    const [selectedField, setSelectedField] = useState<number | null>(null);
    const [templates, setTemplates] = useState<CertificateTemplate[]>([]);
    const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
    const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const imageRef = useRef<HTMLImageElement | null>(null);
    const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
    const [base64Image, setBase64Image] = useState<string | null>(null);
    const [templateUrl, setTemplateUrl] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [dragging, setDragging] = useState<number | null>(null);
    const [resizing, setResizing] = useState<{ index: number; corner: 'tl' | 'tr' | 'bl' | 'br' } | null>(null);
    const [offset, setOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
    const [previewMode, setPreviewMode] = useState(false);
    const [addFieldType, setAddFieldType] = useState<'custom' | 'description'>('custom');
    const [descriptionInputs, setDescriptionInputs] = useState<Record<string, string>>(
        Object.fromEntries(certificateTypes.map(type => [type, '']))
    );
    const [sampleCertificateType, setSampleCertificateType] = useState('participation');

    const fontOptions = [
        'Arial', 'Times New Roman', 'Courier New', 'Georgia', 'Verdana',
        'Roboto', 'Open Sans', 'Lato', 'Montserrat', 'Oswald',
        'Playfair Display', 'Raleway', 'Ubuntu', 'Merriweather', 'Poppins', 'Dancing Script'
    ];

    const allowedVariables = ['name', 'event_name', 'certificate_type', 'date'];

    const sampleVariableValues = {
        name: "John Doe",
        event_name: "CodeFest 2025",
        certificate_type: sampleCertificateType,
        date: "March 15, 2025",
    };

    const generateRandomString = () => {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    };

    const addDefaultQrCode = (canvasWidth: number, canvasHeight: number) => {
        const qrSize = 100 / canvasWidth;
        return {
            type: 'qrcode' as const,
            x: 1 - qrSize - (30 / canvasWidth),
            y: 1 - qrSize - (30 / canvasHeight),
            width: qrSize,
            height: qrSize,
        };
    };

    const getRootFontSize = () => {
        return parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
    };

    const remToPx = (rem: number) => rem * getRootFontSize();

    useEffect(() => {
        const fetchTemplates = async () => {
            try {
                const data = await fetchAll('certificate-template') as CertificateTemplate[];
                setTemplates(data);
            } catch (error) {
                console.error('Error fetching templates:', error);
            }
        };
        fetchTemplates();
    }, []);

    useEffect(() => {
        const handleResize = () => {
            adjustCanvasSize();
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [image]);

    useEffect(() => {
        const generateQrCode = async () => {
            if (templateUrl) {
                const url = `${window.location.origin}/certificate/preview?template=${templateUrl}&random=${generateRandomString()}`;
                const dataUrl = await generateQRCode(url);
                setQrCodeDataUrl(dataUrl);
            } else {
                const tempUrl = `${window.location.origin}/certificate/preview?temp=${generateRandomString()}`;
                const dataUrl = await generateQRCode(tempUrl);
                setQrCodeDataUrl(dataUrl);
            }
        };
        generateQrCode();
    }, [templateUrl]);

    useEffect(() => {
        drawCanvas();
    }, [image, fields, selectedField, previewMode, qrCodeDataUrl, sampleCertificateType]);

    useEffect(() => {
        if (image) {
            setTimeout(() => adjustCanvasSize(() => {
                const canvas = canvasRef.current;
                if (canvas && fields.length === 0) {
                    console.log('Adding QR code for new image');
                    setFields([addDefaultQrCode(canvas.width, canvas.height)]);
                    drawCanvas();
                }
            }), 100);
        }
    }, [image]);

    const adjustCanvasSize = (callback?: () => void) => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container || !image) return;

        const containerWidth = container.clientWidth;
        const aspectRatio = image.height / image.width;

        canvas.width = containerWidth;
        canvas.height = containerWidth * aspectRatio;
        drawCanvas();

        if (callback) callback();
    };

    const toAbsolute = (field: TextItem, canvasWidth: number, canvasHeight: number) => ({
        x: field.x * canvasWidth,
        y: field.y * canvasHeight,
        width: field.width * canvasWidth,
        height: field.height * canvasHeight,
    });

    const replacePlaceholders = (text: string): string => {
        let replacedText = text;
        for (const key in sampleVariableValues) {
            const placeholder = `{{${key}}}`;
            const value = sampleVariableValues[key as keyof typeof sampleVariableValues];
            replacedText = replacedText.replace(new RegExp(placeholder, 'g'), value);
        }
        return replacedText;
    };

    const getFieldText = (field: TextItem): string => {
        if (field.type === 'custom') {
            return previewMode ? replacePlaceholders(field.text) : field.text;
        } else if (field.type === 'description') {
            const descriptionText = field.descriptions[sampleCertificateType] || '';
            return previewMode ? replacePlaceholders(descriptionText) : descriptionText;
        }
        return '';
    };

    const measureFormattedTextWidth = (ctx: CanvasRenderingContext2D, text: string, fontSize: number, fontFamily: string, fontWeight: string) => {
        let width = 0;
        const parts = text.split(/(<\/?b>|<\/?i>)/);
        let isBold = fontWeight === 'bold';
        let isItalic = false;

        parts.forEach(part => {
            if (part === '<b>') isBold = true;
            else if (part === '</b>') isBold = false;
            else if (part === '<i>') isItalic = true;
            else if (part === '</i>') isItalic = false;
            else if (part) {
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
            if (part === '<b>') isBold = true;
            else if (part === '</b>') isBold = false;
            else if (part === '<i>') isItalic = true;
            else if (part === '</i>') isItalic = false;
            else if (part) {
                const fontStyle = `${isBold ? '700' : fontWeight === 'lighter' ? '300' : '400'} ${isItalic ? 'italic' : 'normal'} ${fontSize}px "${fontFamily}"`;
                ctx.font = fontStyle;
                ctx.fillStyle = previewMode && part.match(/{{.*?}}/) ? color : part.match(/{{.*?}}/) ? '#FF4444' : color;
                ctx.fillText(part, currentX, y);
                currentX += ctx.measureText(part).width;
            }
        });
    };

    const drawCanvas = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (image && imageRef.current) {
            try {
                ctx.drawImage(imageRef.current, 0, 0, canvas.width, canvas.height);
            } catch (error) {
                console.error("Error drawing image:", error);
            }
        }

        fields.forEach((item, index) => {
            const absPos = toAbsolute(item, canvas.width, canvas.height);

            if (item.type === 'custom' || item.type === 'description') {
                const textToRender = getFieldText(item);
                const fontSize = item.fontSize ? remToPx(item.fontSize) : undefined;
                const fontFamily = item.fontFamily;
                const fontWeight = item.fontWeight;
                const color = item.color;
                const textAlign = item.textAlign;

                if (textToRender && fontSize && fontFamily && fontWeight && color && textAlign) {
                    ctx.textAlign = 'left';
                    const lineHeight = fontSize * 1.2;
                    const textHeight = wrapText(ctx, textToRender, absPos.x, absPos.y, absPos.width, absPos.height, lineHeight, textAlign, fontSize, fontFamily, fontWeight, color);

                    if (selectedField === index) {
                        ctx.strokeStyle = '#007bff';
                        ctx.lineWidth = 2;
                        ctx.strokeRect(absPos.x - 5, absPos.y - fontSize - 5, absPos.width + 10, textHeight + 10);

                        ctx.fillStyle = '#007bff';
                        const handleSize = 8;
                        ctx.fillRect(absPos.x - 5 - handleSize / 2, absPos.y - fontSize - 5 - handleSize / 2, handleSize, handleSize);
                        ctx.fillRect(absPos.x + absPos.width + 5 - handleSize / 2, absPos.y - fontSize - 5 - handleSize / 2, handleSize, handleSize);
                        ctx.fillRect(absPos.x - 5 - handleSize / 2, absPos.y + textHeight + 5 - handleSize / 2, handleSize, handleSize);
                        ctx.fillRect(absPos.x + absPos.width + 5 - handleSize / 2, absPos.y + textHeight + 5 - handleSize / 2, handleSize, handleSize);
                    }
                }
            } else if (item.type === 'qrcode' && qrCodeDataUrl) {
                const qrCodeImg = new Image();
                qrCodeImg.onload = () => {
                    ctx.imageSmoothingEnabled = false;
                    ctx.drawImage(qrCodeImg, absPos.x, absPos.y, absPos.width, absPos.height);

                    if (selectedField === index) {
                        ctx.strokeStyle = '#007bff';
                        ctx.lineWidth = 2;
                        ctx.strokeRect(absPos.x - 5, absPos.y - 5, absPos.width + 10, absPos.height + 10);

                        ctx.fillStyle = '#007bff';
                        const handleSize = 8;
                        ctx.fillRect(absPos.x - 5 - handleSize / 2, absPos.y - 5 - handleSize / 2, handleSize, handleSize);
                        ctx.fillRect(absPos.x + absPos.width + 5 - handleSize / 2, absPos.y - 5 - handleSize / 2, handleSize, handleSize);
                        ctx.fillRect(absPos.x - 5 - handleSize / 2, absPos.y + absPos.height + 5 - handleSize / 2, handleSize, handleSize);
                        ctx.fillRect(absPos.x + absPos.width + 5 - handleSize / 2, absPos.y + absPos.height + 5 - handleSize / 2, handleSize, handleSize);
                    }
                };
                qrCodeImg.onerror = () => console.error("Error loading QR code image");
                qrCodeImg.src = qrCodeDataUrl;
            }
        });
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                console.log('Image uploaded, initializing...');
                setBase64Image(base64String);
                setSelectedTemplate(null);
                setFields([]);
                setImage(null);
                setTemplateUrl(null);
                setQrCodeDataUrl(null);

                const img = new Image();
                img.onload = () => {
                    console.log('Image loaded, setting up canvas...');
                    setImage(img);
                    imageRef.current = img;
                    adjustCanvasSize(() => {
                        const canvas = canvasRef.current;
                        if (canvas) {
                            console.log('Canvas sized, adding QR code...');
                            const qrField = addDefaultQrCode(canvas.width, canvas.height);
                            setFields([qrField]);
                            drawCanvas();
                            console.log('Fields after adding QR:', [qrField]);
                        }
                    });
                };
                img.onerror = () => console.error("Error loading uploaded image");
                img.src = base64String;
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCreateTemplate = async () => {
        if (!base64Image || !fields.length) {
            alert('Please upload an image and add at least one field before creating a template');
            return;
        }

        setIsUploading(true);
        try {
            const { storeImage } = await import('@/utils/FetchFromApi');
            const imageUrl = await storeImage(base64Image, 'Thumbnails', `certificates/${Date.now()}_${Math.random().toString(36).substring(2)}.png`) as string;
            const data = {
                templateUrl: imageUrl,
                fields
            };
            const response = await createNew(data, 'certificate-template') as CertificateTemplate;
            setTemplateUrl(imageUrl);
            setTemplates([...templates, response]);
            setSelectedTemplate(response?._id);
            return response;
        } catch (error) {
            console.error('Error uploading to Firebase:', error);
            alert('Failed to create template');
        } finally {
            setIsUploading(false);
        }
    };

    const loadTemplate = (templateId: string) => {
        const template = templates.find(t => t?._id === templateId);
        if (!template) {
            console.error("Template not found:", templateId);
            return;
        }

        setImage(null);
        setFields([]);
        setBase64Image(null);
        setSelectedField(null);
        setTextInput('');
        setTemplateUrl(template?.templateUrl);
        setSelectedTemplate(templateId);

        const hasQrCode = template.fields.some(f => f.type === 'qrcode');
        const updatedFields = hasQrCode
            ? template.fields
            : [...template.fields, addDefaultQrCode(1000, 1000)];

        setFields(updatedFields);

        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.onload = () => {
            setImage(img);
            imageRef.current = img;
            adjustCanvasSize(() => {
                const canvas = canvasRef.current;
                if (canvas && !hasQrCode) {
                    setFields(prev => {
                        const newFields = [...prev];
                        newFields[newFields.length - 1] = addDefaultQrCode(canvas.width, canvas.height);
                        return newFields;
                    });
                }
            });
            drawCanvas();
        };
        img.onerror = () => {
            console.error("Error loading template image:", template?.templateUrl);
            alert("Failed to load template image.");
        };
        img.src = template?.templateUrl;
    };

    const validateText = (text: string) => {
        const matches = text.match(/{{(.*?)}}/g) || [];
        for (const match of matches) {
            const variable = match.slice(2, -2);
            if (!allowedVariables.includes(variable)) {
                return false;
            }
        }
        return true;
    };

    const addField = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        if (addFieldType === 'custom') {
            if (textInput.trim() === '' || !validateText(textInput)) {
                if (!validateText(textInput)) {
                    alert('Only {{name}}, {{event_name}}, {{certificate_type}}, and {{date}} are allowed as variables.');
                }
                return;
            }
            const newField: CustomTextItem = {
                type: 'custom',
                text: textInput,
                x: 50 / canvas.width,
                y: 50 / canvas.height,
                width: 200 / canvas.width,
                height: 50 / canvas.height,
                fontSize: 1.25,
                fontFamily: 'Roboto',
                fontWeight: 'normal',
                color: '#000000',
                textAlign: 'left'
            };
            setFields([...fields, newField]);
            setSelectedField(fields.length);
            setTextInput('');
        } else {
            for (const type of certificateTypes) {
                const text = descriptionInputs[type];
                if (text.trim() === '' || !validateText(text)) {
                    alert(`Please enter valid text for ${type}`);
                    return;
                }
            }
            const newField: DescriptionTextItem = {
                type: 'description',
                descriptions: descriptionInputs,
                x: 50 / canvas.width,
                y: 50 / canvas.height,
                width: 200 / canvas.width,
                height: 50 / canvas.height,
                fontSize: 1.25,
                fontFamily: 'Roboto',
                fontWeight: 'normal',
                color: '#000000',
                textAlign: 'left'
            };
            setFields([...fields, newField]);
            setSelectedField(fields.length);
            setDescriptionInputs(Object.fromEntries(certificateTypes.map(type => [type, ''])));
        }
    };

    const applyFormatting = (tag: 'b' | 'i') => {
        const textarea = textAreaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = textInput.substring(start, end);

        if (start === end) return;

        const newText = `${textInput.substring(0, start)}<${tag}>${selectedText}</${tag}>${textInput.substring(end)}`;
        setTextInput(newText);
    };

    const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        const mouseX = (e.clientX - rect.left) * (canvas.width / rect.width);
        const mouseY = (e.clientY - rect.top) * (canvas.height / rect.height);
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let fieldSelected = false;

        fields.forEach((item, index) => {
            const absPos = toAbsolute(item, canvas.width, canvas.height);
            const handleSize = 8;
            const handleTolerance = 4;

            if (item.type === 'custom' || item.type === 'description') {
                const fontSize = item.fontSize ? remToPx(item.fontSize) : 0;
                const textHeight = fontSize * 1.2 * (getFieldText(item).split('\n').length || 1);

                if (mouseX >= absPos.x - 5 - handleSize / 2 - handleTolerance &&
                    mouseX <= absPos.x - 5 + handleSize / 2 + handleTolerance &&
                    mouseY >= absPos.y - fontSize - 5 - handleSize / 2 - handleTolerance &&
                    mouseY <= absPos.y - fontSize - 5 + handleSize / 2 + handleTolerance) {
                    setResizing({ index, corner: 'tl' });
                    setSelectedField(index);
                    setOffset({ x: mouseX - absPos.x, y: mouseY - absPos.y });
                    fieldSelected = true;
                } else if (mouseX >= absPos.x + absPos.width + 5 - handleSize / 2 - handleTolerance &&
                    mouseX <= absPos.x + absPos.width + 5 + handleSize / 2 + handleTolerance &&
                    mouseY >= absPos.y - fontSize - 5 - handleSize / 2 - handleTolerance &&
                    mouseY <= absPos.y - fontSize - 5 + handleSize / 2 + handleTolerance) {
                    setResizing({ index, corner: 'tr' });
                    setSelectedField(index);
                    setOffset({ x: mouseX - (absPos.x + absPos.width), y: mouseY - absPos.y });
                    fieldSelected = true;
                } else if (mouseX >= absPos.x - 5 - handleSize / 2 - handleTolerance &&
                    mouseX <= absPos.x - 5 + handleSize / 2 + handleTolerance &&
                    mouseY >= absPos.y + textHeight + 5 - handleSize / 2 - handleTolerance &&
                    mouseY <= absPos.y + textHeight + 5 + handleSize / 2 + handleTolerance) {
                    setResizing({ index, corner: 'bl' });
                    setSelectedField(index);
                    setOffset({ x: mouseX - absPos.x, y: mouseY - (absPos.y + textHeight) });
                    fieldSelected = true;
                } else if (mouseX >= absPos.x + absPos.width + 5 - handleSize / 2 - handleTolerance &&
                    mouseX <= absPos.x + absPos.width + 5 + handleSize / 2 + handleTolerance &&
                    mouseY >= absPos.y + textHeight + 5 - handleSize / 2 - handleTolerance &&
                    mouseY <= absPos.y + textHeight + 5 + handleSize / 2 + handleTolerance) {
                    setResizing({ index, corner: 'br' });
                    setSelectedField(index);
                    setOffset({ x: mouseX - (absPos.x + absPos.width), y: mouseY - (absPos.y + textHeight) });
                    fieldSelected = true;
                } else if (mouseX >= absPos.x - 5 && mouseX <= absPos.x + absPos.width + 5 &&
                    mouseY >= absPos.y - fontSize - 5 && mouseY <= absPos.y + textHeight + 5) {
                    setDragging(index);
                    setSelectedField(index);
                    setOffset({ x: mouseX - absPos.x, y: mouseY - absPos.y });
                    if (item.type === 'custom') {
                        setTextInput(item.text);
                    } else {
                        setTextInput('');
                    }
                    fieldSelected = true;
                }
            } else if (item.type === 'qrcode') {
                if (mouseX >= absPos.x - 5 - handleSize / 2 - handleTolerance &&
                    mouseX <= absPos.x - 5 + handleSize / 2 + handleTolerance &&
                    mouseY >= absPos.y - 5 - handleSize / 2 - handleTolerance &&
                    mouseY <= absPos.y - 5 + handleSize / 2 + handleTolerance) {
                    setResizing({ index, corner: 'tl' });
                    setSelectedField(index);
                    setOffset({ x: mouseX - absPos.x, y: mouseY - absPos.y });
                    fieldSelected = true;
                } else if (mouseX >= absPos.x + absPos.width + 5 - handleSize / 2 - handleTolerance &&
                    mouseX <= absPos.x + absPos.width + 5 + handleSize / 2 + handleTolerance &&
                    mouseY >= absPos.y - 5 - handleSize / 2 - handleTolerance &&
                    mouseY <= absPos.y - 5 + handleSize / 2 + handleTolerance) {
                    setResizing({ index, corner: 'tr' });
                    setSelectedField(index);
                    setOffset({ x: mouseX - (absPos.x + absPos.width), y: mouseY - absPos.y });
                    fieldSelected = true;
                } else if (mouseX >= absPos.x - 5 - handleSize / 2 - handleTolerance &&
                    mouseX <= absPos.x - 5 + handleSize / 2 + handleTolerance &&
                    mouseY >= absPos.y + absPos.height + 5 - handleSize / 2 - handleTolerance &&
                    mouseY <= absPos.y + absPos.height + 5 + handleSize / 2 + handleTolerance) {
                    setResizing({ index, corner: 'bl' });
                    setSelectedField(index);
                    setOffset({ x: mouseX - absPos.x, y: mouseY - (absPos.y + absPos.height) });
                    fieldSelected = true;
                } else if (mouseX >= absPos.x + absPos.width + 5 - handleSize / 2 - handleTolerance &&
                    mouseX <= absPos.x + absPos.width + 5 + handleSize / 2 + handleTolerance &&
                    mouseY >= absPos.y + absPos.height + 5 - handleSize / 2 - handleTolerance &&
                    mouseY <= absPos.y + absPos.height + 5 + handleSize / 2 + handleTolerance) {
                    setResizing({ index, corner: 'br' });
                    setSelectedField(index);
                    setOffset({ x: mouseX - (absPos.x + absPos.width), y: mouseY - (absPos.y + absPos.height) });
                    fieldSelected = true;
                } else if (mouseX >= absPos.x - 5 && mouseX <= absPos.x + absPos.width + 5 &&
                    mouseY >= absPos.y - 5 && mouseY <= absPos.y + absPos.height + 5) {
                    setDragging(index);
                    setSelectedField(index);
                    setOffset({ x: mouseX - absPos.x, y: mouseY - absPos.y });
                    setTextInput('');
                    fieldSelected = true;
                }
            }
        });

        if (!fieldSelected) {
            setSelectedField(null);
            setTextInput('');
        }
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        const mouseX = (e.clientX - rect.left) * (canvas.width / rect.width);
        const mouseY = (e.clientY - rect.top) * (canvas.height / rect.height);

        if (dragging !== null) {
            setFields((prevFields) => {
                const newFields = [...prevFields];
                const absPos = toAbsolute(newFields[dragging], canvas.width, canvas.height);
                const newX = mouseX - offset.x;
                const newY = mouseY - offset.y;
                const relPos = toRelative(newX, newY, absPos.width, absPos.height, canvas.width, canvas.height);
                newFields[dragging] = {
                    ...newFields[dragging],
                    x: relPos.x,
                    y: relPos.y,
                };
                return newFields;
            });
        } else if (resizing !== null) {
            setFields((prevFields) => {
                const newFields = [...prevFields];
                const absPos = toAbsolute(newFields[resizing.index], canvas.width, canvas.height);
                let newX = absPos.x;
                let newY = absPos.y;
                let newWidth = absPos.width;
                let newHeight = absPos.height;

                if (newFields[resizing.index].type === 'qrcode') {
                    let newSize: number;
                    switch (resizing.corner) {
                        case 'tl':
                            newSize = Math.max(50, absPos.x + absPos.width - mouseX + offset.x);
                            newX = mouseX - offset.x;
                            newY = absPos.y + absPos.height - newSize;
                            break;
                        case 'tr':
                            newSize = Math.max(50, mouseX - absPos.x - offset.x);
                            newX = absPos.x;
                            newY = absPos.y + absPos.height - newSize;
                            break;
                        case 'bl':
                            newSize = Math.max(50, absPos.x + absPos.width - mouseX + offset.x);
                            newX = mouseX - offset.x;
                            newY = absPos.y;
                            break;
                        case 'br':
                            newSize = Math.max(50, mouseX - absPos.x - offset.x);
                            newX = absPos.x;
                            newY = absPos.y;
                            break;
                        default:
                            newSize = absPos.width;
                    }
                    const relPos = toRelative(newX, newY, newSize, newSize, canvas.width, canvas.height);
                    newFields[resizing.index] = {
                        ...newFields[resizing.index],
                        x: relPos.x,
                        y: relPos.y,
                        width: relPos.width,
                        height: relPos.height,
                    };
                } else {
                    switch (resizing.corner) {
                        case 'tl':
                            newWidth = Math.max(50, absPos.x + absPos.width - mouseX + offset.x);
                            newHeight = Math.max(30, absPos.y + absPos.height - mouseY + offset.y);
                            newX = mouseX - offset.x;
                            newY = mouseY - offset.y;
                            break;
                        case 'tr':
                            newWidth = Math.max(50, mouseX - absPos.x - offset.x);
                            newHeight = Math.max(30, absPos.y + absPos.height - mouseY + offset.y);
                            newY = mouseY - offset.y;
                            break;
                        case 'bl':
                            newWidth = Math.max(50, absPos.x + absPos.width - mouseX + offset.x);
                            newHeight = Math.max(30, mouseY - absPos.y - offset.y);
                            newX = mouseX - offset.x;
                            break;
                        case 'br':
                            newWidth = Math.max(50, mouseX - absPos.x - offset.x);
                            newHeight = Math.max(30, mouseY - absPos.y - offset.y);
                            break;
                    }
                    const relPos = toRelative(newX, newY, newWidth, newHeight, canvas.width, canvas.height);
                    newFields[resizing.index] = {
                        ...newFields[resizing.index],
                        x: relPos.x,
                        y: relPos.y,
                        width: relPos.width,
                        height: relPos.height,
                    };
                }
                return newFields;
            });
        }
    };

    const toRelative = (x: number, y: number, width: number, height: number, canvasWidth: number, canvasHeight: number) => ({
        x: x / canvasWidth,
        y: y / canvasHeight,
        width: width / canvasWidth,
        height: height / canvasHeight,
    });

    const handleMouseUp = () => {
        setDragging(null);
        setResizing(null);
    };

    const updateSelectedField = (property: keyof TextItem | string, value: string | number) => {
        if (selectedField === null) return;

        if (property === 'text' && !validateText(value as string)) {
            alert('Only {{name}}, {{event_name}}, {{certificate_type}}, and {{date}} are allowed as variables.');
            return;
        }

        setFields((prevFields) => {
            const newFields = [...prevFields];
            newFields[selectedField] = {
                ...newFields[selectedField],
                [property]: value
            };
            return newFields;
        });

        if (property === 'text') setTextInput(value as string);
    };

    const deleteSelectedField = () => {
        if (selectedField === null) return;

        setFields((prevFields) => {
            const newFields = [...prevFields];
            newFields.splice(selectedField, 1);
            return newFields;
        });

        setSelectedField(null);
        setTextInput('');
    };

    const handleUpdateTemplate = async () => {
        if (!selectedTemplate) {
            alert('Please select an existing template to update');
            return;
        }

        if (!fields.length) {
            alert('Please add at least one field to update the template');
            return;
        }

        setIsUploading(true);
        try {
            let imageUrl = templateUrl;
            if (base64Image) {
                const { storeImage } = await import('@/utils/FetchFromApi');
                imageUrl = await storeImage(base64Image, 'Thumbnails', `certificates/${Date.now()}_${Math.random().toString(36).substring(2)}.png`) as string;
                setTemplateUrl(imageUrl);
            }

            const data = {
                templateUrl: imageUrl,
                fields
            };
            await updatePost(selectedTemplate as string, data, 'certificate-template');
            const response = await fetchAll(`/certificate-template/${selectedTemplate}` as string) as CertificateTemplate;
            setTemplates(templates.map(t => t?._id === selectedTemplate ? response : t));
        } catch (error) {
            console.error('Error updating template:', error);
            alert('Failed to update template');
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className={`certificate-editor ${fontMap['Roboto'].className} container mx-auto p-6 max-w-6xl bg-black`}>
            <h1 className="text-2xl font-semibold mb-6 text-white">Certificate Editor</h1>

            <div className="grid bg-black grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="shadow-md">
                    <CardHeader>
                        <CardTitle className="text-lg">Template</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Input type="file" accept="image/*" onChange={handleImageUpload} className="mb-4" />
                        {templates.length > 0 && (
                            <div className="mb-4">
                                <label className="text-sm text-gray-600">Load Existing Template</label>
                                <Select
                                    value={selectedTemplate || ''}
                                    onValueChange={(value) => loadTemplate(value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a template" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {templates.map(template => (
                                            <SelectItem key={template?._id} value={template?._id}>
                                                <div className="flex items-center">
                                                    <img
                                                        src={template?.templateUrl}
                                                        alt={template?._id}
                                                        className="w-10 h-10 mr-2 object-cover rounded"
                                                        onError={(e) => (e.currentTarget.src = '/placeholder.png')}
                                                    />
                                                    <span>{template?.templateUrl?.split('/').pop()?.split('?')[0] || template?._id}</span>
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}
                        <div className="mb-4">
                            <Button
                                onClick={() => setPreviewMode(!previewMode)}
                                className="w-full"
                                variant={previewMode ? "default" : "outline"}
                            >
                                {previewMode ? "Exit Preview Mode" : "Preview with Sample Data"}
                            </Button>
                        </div>
                        <div className="mb-4">
                            <label className="text-sm text-gray-600">Sample Certificate Type for Preview</label>
                            <Select value={sampleCertificateType} onValueChange={setSampleCertificateType}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {certificateTypes.map(type => (
                                        <SelectItem key={type} value={type}>{type}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        {image && (
                            <div ref={containerRef}>
                                <canvas
                                    ref={canvasRef}
                                    className="w-full h-auto border rounded-md shadow-sm"
                                    onMouseDown={handleMouseDown}
                                    onMouseMove={handleMouseMove}
                                    onMouseUp={handleMouseUp}
                                    onMouseLeave={handleMouseUp}
                                />
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card className="shadow-md">
                    <CardHeader>
                        <CardTitle className="text-lg">Add/Edit Field</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm text-gray-600">Field Type</label>
                                <Select value={addFieldType} onValueChange={(value: 'custom' | 'description') => setAddFieldType(value)}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="custom">Normal (Custom Text)</SelectItem>
                                        <SelectItem value="description">Description</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            {addFieldType === 'custom' ? (
                                <div className="border rounded-md p-2 bg-black border-gray-600">
                                    <div className="flex gap-2 mb-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => applyFormatting('b')}
                                            className="h-8 w-8 p-0"
                                        >
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6zM6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" />
                                            </svg>
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => applyFormatting('i')}
                                            className="h-8 w-8 p-0"
                                        >
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <line x1="19" y1="4" x2="10" y2="20" />
                                                <line x1="14" y1="4" x2="5" y2="4" />
                                                <line x1="19" y1="20" x2="10" y2="20" />
                                            </svg>
                                        </Button>
                                    </div>
                                    <Textarea
                                        ref={textAreaRef}
                                        value={textInput}
                                        onChange={(e) => setTextInput(e.target.value)}
                                        placeholder="e.g., <b>{{name}}</b>, This is <i>{{event_name}}</i> on {{date}}"
                                        className="min-h-[100px] resize-y border-none bg-black text-gray-300 focus:ring-0 placeholder-gray-500"
                                    />
                                </div>
                            ) : (
                                <div>
                                    {certificateTypes.map(type => (
                                        <div key={type} className="mb-2">
                                            <label className="text-sm text-gray-600">{type}</label>
                                            <Textarea
                                                value={descriptionInputs[type]}
                                                onChange={(e) => setDescriptionInputs(prev => ({ ...prev, [type]: e.target.value }))}
                                                placeholder={`Description for ${type}`}
                                                className="min-h-[60px]"
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}
                            <div className="flex gap-2">
                                <Button
                                    onClick={addField}
                                    disabled={addFieldType === 'custom' ? textInput.trim() === '' : certificateTypes.some(type => descriptionInputs[type].trim() === '')}
                                    className="w-full"
                                >
                                    {selectedField === null ? 'Add Field' : 'Update Field'}
                                </Button>
                            </div>
                            <p className="text-sm text-gray-600">
                                Allowed variables: <span className="text-red-500">{`{{name}}`}</span>,
                                <span className="text-red-500">{`{{event_name}}`}</span>,
                                <span className="text-red-500">{`{{certificate_type}}`}</span>,
                                <span className="text-red-500">{`{{date}}`}</span>
                                <br />
                                Select text and use buttons to format (for custom fields)
                            </p>
                        </div>

                        {selectedField !== null && (
                            <div className="mt-6">
                                <h3 className="text-lg font-medium mb-4">Field Properties ({fields[selectedField].type})</h3>
                                <div className="space-y-4">
                                    {fields[selectedField].type === 'custom' && (
                                        <div className="border rounded-md p-2 bg-black border-gray-600">
                                            <div className="flex gap-2 mb-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => applyFormatting('b')}
                                                    className="h-8 w-8 p-0"
                                                >
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6zM6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" />
                                                    </svg>
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => applyFormatting('i')}
                                                    className="h-8 w-8 p-0"
                                                >
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <line x1="19" y1="4" x2="10" y2="20" />
                                                        <line x1="14" y1="4" x2="5" y2="4" />
                                                        <line x1="19" y1="20" x2="10" y2="20" />
                                                    </svg>
                                                </Button>
                                            </div>
                                            <Textarea
                                                ref={textAreaRef}
                                                value={textInput}
                                                onChange={(e) => {
                                                    setTextInput(e.target.value);
                                                    updateSelectedField('text', e.target.value);
                                                }}
                                                className="min-h-[100px] resize-y border-none bg-black text-gray-300 focus:ring-0 placeholder-gray-500"
                                            />
                                        </div>
                                    )}
                                    {fields[selectedField].type === 'description' && (
                                        <div>
                                            {certificateTypes.map(type => (
                                                <div key={type} className="mb-4">
                                                    <label className="text-sm text-gray-600">{type}</label>
                                                    <Textarea
                                                        value={(fields[selectedField] as DescriptionTextItem).descriptions[type]}
                                                        onChange={(e) => {
                                                            setFields(prevFields => {
                                                                const newFields = [...prevFields];
                                                                const field = newFields[selectedField];
                                                                if (field.type === 'description') {
                                                                    newFields[selectedField] = {
                                                                        ...field,
                                                                        descriptions: { ...field.descriptions, [type]: e.target.value }
                                                                    };
                                                                }
                                                                return newFields;
                                                            });
                                                        }}
                                                        className="min-h-[100px]"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    {fields[selectedField].type !== 'qrcode' && (
                                        <>
                                            <div>
                                                <label className="text-sm text-gray-600">Font Family</label>
                                                <Select
                                                    value={fields[selectedField].fontFamily}
                                                    onValueChange={(value) => updateSelectedField('fontFamily', value)}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {fontOptions.map(font => (
                                                            <SelectItem key={font} value={font}>{font}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <div>
                                                <label className="text-sm text-gray-600">Font Size ({fields[selectedField].fontSize}rem)</label>
                                                <input
                                                    type="range"
                                                    min="0.625"
                                                    max="4.5"
                                                    step="0.125"
                                                    value={fields[selectedField].fontSize}
                                                    onChange={(e) => updateSelectedField('fontSize', parseFloat(e.target.value))}
                                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                                />
                                            </div>

                                            <div>
                                                <label className="text-sm text-gray-600">Font Weight</label>
                                                <Select
                                                    value={fields[selectedField].fontWeight}
                                                    onValueChange={(value) => updateSelectedField('fontWeight', value)}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="normal">Normal</SelectItem>
                                                        <SelectItem value="bold">Bold</SelectItem>
                                                        <SelectItem value="lighter">Light</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <div>
                                                <label className="text-sm text-gray-600">Text Color</label>
                                                <input
                                                    type="color"
                                                    value={fields[selectedField].color}
                                                    onChange={(e) => updateSelectedField('color', e.target.value)}
                                                    className="w-full h-10 border-none rounded-md"
                                                />
                                            </div>

                                            <div>
                                                <label className="text-sm text-gray-600">Text Align</label>
                                                <Select
                                                    value={fields[selectedField].textAlign}
                                                    onValueChange={(value) => updateSelectedField('textAlign', value)}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="left">Left</SelectItem>
                                                        <SelectItem value="center">Center</SelectItem>
                                                        <SelectItem value="right">Right</SelectItem>
                                                        <SelectItem value="justify">Justify</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </>
                                    )}
                                    <div>
                                        {canvasRef.current && (
                                            <>
                                                <p className="text-sm text-gray-600">Width: {(fields[selectedField].width * canvasRef.current.width).toFixed(0)}px</p>
                                                <p className="text-sm text-gray-600">Height: {(fields[selectedField].height * canvasRef.current.height).toFixed(0)}px</p>
                                            </>
                                        )}
                                    </div>
                                    <Button
                                        variant="destructive"
                                        onClick={deleteSelectedField}
                                        className="w-full"
                                    >
                                        Delete Field
                                    </Button>
                                </div>
                            </div>
                        )}

                        <div className="flex gap-4 mt-4">
                            <Button
                                onClick={handleCreateTemplate}
                                disabled={isUploading || !base64Image}
                                className="w-full"
                            >
                                {isUploading ? 'Creating...' : 'Create Template'}
                            </Button>
                            <Button
                                onClick={handleUpdateTemplate}
                                disabled={isUploading || !selectedTemplate}
                                className="w-full bg-blue-500 hover:bg-blue-600"
                            >
                                {isUploading ? 'Updating...' : 'Update Template'}
                            </Button>
                        </div>

                        {image && (
                            <div className="mt-6">
                                <h3 className="text-lg font-medium mb-4">Certificate Template Data</h3>
                                <pre className="bg-black p-4 rounded-md text-sm overflow-auto max-h-64 border border-gray-600 text-gray-300">
                                    {JSON.stringify({
                                        template: templateUrl || (base64Image ? base64Image.substring(0, 30) + '...' : 'No image'),
                                        fields
                                    }, null, 2)}
                                </pre>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default CertificateEditor;

const generateQRCode = async (url: string): Promise<string> => {
    const QRCode = (await import('qrcode')).default;
    return QRCode.toDataURL(url, {
        width: 300,
        margin: 2,
        errorCorrectionLevel: 'H'
    });
};