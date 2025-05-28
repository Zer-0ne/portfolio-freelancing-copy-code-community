'use client';
import * as React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from '@/components/ui/drawer';
import { Download, User, Mail, Phone, Star, Linkedin, MessageCircle, } from 'lucide-react';
import Sparkles from '@/assests/svg/star.svg';
import Image from 'next/image';
import Github from 'next-auth/providers/github';
import { GitHub } from '@mui/icons-material';

// Custom hook to determine if the screen size is desktop (>= 768px)
function useIsDesktop() {
    const [isDesktop, setIsDesktop] = React.useState(false);

    React.useEffect(() => {
        setIsDesktop(window.innerWidth >= 768);
        const handleResize = () => {
            setIsDesktop(window.innerWidth >= 768);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return isDesktop;
}

// Enhanced Developer Info Component
function DeveloperInfo({ className }: any) {
    return (
        <div className={cn('space-y-6 p-2 bg-transparent', className)}>
            {/* Header Section */}
            <div className="text-center space-y-2">
                <div className="relative mx-auto w-20 h-20 rounded-full bg-gray-950 flex items-center justify-center shadow-lg">
                    <User className="w-10 h-10 text-[white]" />
                    <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full border-2 border-[green] flex items-center justify-center">
                        <div className="w-2 h-2 bg-[green] rounded-full"></div>
                    </div>
                </div>
                <h3 className="text-xl font-bold text-[green]">Sahil Khan</h3>
                <p className="text-sm text-white">Full Stack Developer</p>
            </div>

            {/* Info Cards */}
            <div className="space-y-3">
                <a
                    href="mailto:sahilkhan8294799@gmail.com"
                    className="flex items-center space-x-3 p-3 rounded-lg backdrop-blur-sm border-[#ffffff36] border-[2px] hover:shadow-md transition-all duration-200"
                >
                    <div className="w-10 h-10 rounded-full flex items-center justify-center">
                        <Mail className="w-5 h-5 text-white" />
                    </div>
                    <div className='overflow-hidden'>
                        <p className="text-xs truncate text-white">Email</p>
                        <p className="font-medium truncate text-[green]">sahilkhan8294799@gmail.com</p>
                    </div>
                </a>

                <a
                    href="tel:+917982408995"
                    className="flex items-center space-x-3 p-3 rounded-lg backdrop-blur-sm border-[#ffffff36] border-[2px] hover:shadow-md transition-all duration-200"
                >
                    <div className="w-10 h-10 rounded-full flex items-center justify-center">
                        <Phone className="w-5 h-5 text-white" />
                    </div>
                    <div className='overflow-hidden'>
                        <p className="text-xs truncate text-white">Phone</p>
                        <p className="font-medium truncate text-[green]">+91 7982408995</p>
                    </div>
                </a>
            </div>

            {/* Skills Section */}
            <div className="space-y-3">
                <h4 className="text-sm font-semibold text-gray-700 flex items-center">
                    <Star className="w-4 h-4 mr-2 text-yellow-500" />
                    Key Skills
                </h4>
                <div className="flex flex-wrap gap-2">
                    {['React', 'Next.js', 'TypeScript', 'Node.js'].map((skill) => (
                        <span
                            key={skill}
                            className="px-3 py-1 text-xs font-medium backdrop-blur-sm text-[white] rounded-full border border-gray-200/50"
                        >
                            {skill}
                        </span>
                    ))}
                </div>
            </div>

            {/* Social Buttons */}
            <div className="space-y-3">
                <h4 className="text-sm font-semibold text-gray-700">Connect</h4>
                <div className="flex gap-4 justify-center items-center">
                    <a
                        href="https://github.com/Zer-0ne/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-800 hover:bg-gray-700 transition"
                    >
                        <GitHub className="w-5 h-5 text-white" />
                    </a>
                    <a
                        href="https://www.linkedin.com/in/sahil-khan-7a718a259/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-700 hover:bg-blue-600 transition"
                    >
                        <Linkedin className="w-5 h-5 text-white" />
                    </a>
                    <a
                        href="https://wa.me/917982408995"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 flex items-center justify-center rounded-full bg-green-600 hover:bg-green-500 transition"
                    >
                        <MessageCircle className="w-5 h-5 text-white" />
                    </a>
                </div>
            </div>
        </div>
    );
}

function DraggableButton({ children }: { children?: React.ReactNode }) {
    const [pos, setPos] = React.useState({ x: 0, y: 0 });
    const dragging = React.useRef(false);
    const dragStartPos = React.useRef({ x: 0, y: 0 });
    const mouseStartPos = React.useRef({ x: 0, y: 0 });
    const hasDraggedRef = React.useRef(false);
    const wrapperRef = React.useRef<HTMLDivElement>(null);

    // On mount, move to bottom-right (24px margin)
    React.useEffect(() => {
        function placeBottomRight() {
            if (!wrapperRef.current) return;
            const vw = window.innerWidth;
            const vh = window.innerHeight;
            const { offsetWidth: bw, offsetHeight: bh } = wrapperRef.current;
            setPos({
                x: vw - bw - 24,
                y: vh - bh - 24,
            });
        }

        const timer = setTimeout(placeBottomRight, 100);
        window.addEventListener('resize', placeBottomRight);
        return () => {
            clearTimeout(timer);
            window.removeEventListener('resize', placeBottomRight);
        };
    }, []);

    // Global mouse move and up handlers
    React.useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!dragging.current) return;
            const newX = e.clientX - dragStartPos.current.x;
            const newY = e.clientY - dragStartPos.current.y;
            const vw = window.innerWidth;
            const vh = window.innerHeight;
            const bw = wrapperRef.current?.offsetWidth || 0;
            const bh = wrapperRef.current?.offsetHeight || 0;
            const constrainedX = Math.max(0, Math.min(newX, vw - bw));
            const constrainedY = Math.max(0, Math.min(newY, vh - bh));
            setPos({ x: constrainedX, y: constrainedY });
        };

        const handleMouseUp = (e: MouseEvent) => {
            if (dragging.current) {
                const dx = e.clientX - mouseStartPos.current.x;
                const dy = e.clientY - mouseStartPos.current.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance > 5) { // Threshold of 5 pixels
                    hasDraggedRef.current = true;
                    setTimeout(() => {
                        hasDraggedRef.current = false;
                    }, 100); // Reset after 100ms
                }
            }
            dragging.current = false;
            document.body.style.cursor = '';
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, []);

    const handleMouseDown = (e: React.MouseEvent) => {
        const rect = wrapperRef.current?.getBoundingClientRect();
        if (!rect) return;
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const margin = 20;
        const nearLeftEdge = x < margin;
        const nearRightEdge = x > rect.width - margin;
        const nearTopEdge = y < margin;
        const nearBottomEdge = y > rect.height - margin;
        if (nearLeftEdge || nearRightEdge || nearTopEdge || nearBottomEdge) {
            e.preventDefault();
            dragging.current = true;
            document.body.style.cursor = 'grabbing';
            mouseStartPos.current = { x: e.clientX, y: e.clientY };
            dragStartPos.current = {
                x: e.clientX - pos.x,
                y: e.clientY - pos.y,
            };
        }
    };

    return (
        <div
            ref={wrapperRef}
            onMouseDown={handleMouseDown}
            onClickCapture={(e) => {
                if (hasDraggedRef.current) {
                    e.stopPropagation();
                    e.preventDefault();
                }
            }}
            style={{
                position: 'fixed',
                left: pos.x,
                top: pos.y,
                zIndex: 9999,
                userSelect: 'none',
                cursor: 'pointer',
            }}
        >
            {children}
        </div>
    );
}

// Enhanced Drawer Dialog Component with Animation
export function DrawerDialogDemo() {
    const [open, setOpen] = React.useState(false);
    const [isLoaded, setIsLoaded] = React.useState(false);
    const [showText, setShowText] = React.useState(true);
    const isDesktop = useIsDesktop();

    const sparklesRef = React.useRef<SVGSVGElement | null>(null);

    React.useEffect(() => {
        if (sparklesRef.current) {
            const svg = sparklesRef.current;
            const paths = svg.querySelectorAll('path');
            paths.forEach((path) => {
                path.removeAttribute('stroke');
            });
        }
    }, []);

    React.useEffect(() => {
        // Initial load animation
        const loadTimer = setTimeout(() => {
            setIsLoaded(true);
        }, 100);

        // Hide text after 2 seconds
        const textTimer = setTimeout(() => {
            setShowText(false);
        }, 2000);

        return () => {
            clearTimeout(loadTimer);
            clearTimeout(textTimer);
        };
    }, []);

    const buttonClassName = `
        bg-transparent backdrop-blur-lg 
        hover:bg-transparent items-center justify-center
        transition-all duration-500 ease-out
        shadow-lg hover:shadow-xl 
        group overflow-hidden border-0
        ${isLoaded
            ? 'transform translate-y-0 scale-100 opacity-100'
            : 'transform translate-y-full scale-50 opacity-0'
        }
    `;

    if (isDesktop) {
        return (
            <>
                {/* Updated styles with SVG fill animation */}
                <style jsx>{`
                    @keyframes rgb-shift {
                        0% { background-position: 0% 50%; }
                        50% { background-position: 100% 50%; }
                        100% { background-position: 0% 50%; }
                    }

                    @keyframes sparkles-rgb {
                        0% { fill: rgb(255, 0, 150); }
                        25% { fill: rgb(0, 255, 255); }
                        50% { fill: rgb(255, 255, 0); }
                        75% { fill: rgb(255, 0, 150); }
                        100% { fill: rgb(0, 255, 255); }
                    }

                    .rgb-gradient-text {
                        background: linear-gradient(
                            90deg, 
                            rgb(255, 0, 150) 0%,
                            rgb(0, 255, 255) 25%, 
                            rgb(255, 255, 0) 50%, 
                            rgb(255, 0, 150) 75%,
                            rgb(0, 255, 255) 100%
                        );
                        background-size: 200% 200%;
                        animation: rgb-shift 3s ease-in-out infinite;
                        -webkit-background-clip: text;
                        background-clip: text;
                        -webkit-text-fill-color: transparent;
                        font-weight: 600;
                    }

                    .sparkles-animation {
                        animation: sparkles-rgb 10s ease-in-out infinite;
                    }
                `}</style>

                <DraggableButton>
                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger asChild>
                            <Button className={buttonClassName}>
                                <Image
                                    src={Sparkles}
                                    alt="Sparkles"
                                    width={30}
                                    height={30}
                                />
                                <span
                                    className={`
                                        rgb-gradient-text font-semibold
                                        transition-all duration-500 ease-in-out overflow-hidden
                                        ${showText
                                            ? 'max-w-40 opacity-100 ml-2'
                                            : 'max-w-0 opacity-0 ml-0'
                                        }
                                        group-hover:max-w-40 group-hover:opacity-100 group-hover:ml-2
                                    `}
                                >
                                    Know About Developer
                                </span>
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[450px] border-[1px] border-[#ffffff71] shadow-2xl backdrop-blur-lg bg-transparent">
                            <DialogHeader className="text-center pb-2">
                                <DialogTitle className="text-2xl font-bold text-[green]">
                                    Developer Profile
                                </DialogTitle>
                                <DialogDescription className="text-white">
                                    Get to know the talented developer behind this project
                                </DialogDescription>
                            </DialogHeader>
                            <DeveloperInfo />
                        </DialogContent>
                    </Dialog>
                </DraggableButton>
            </>
        );
    }

    return (
        <>
            {/* Updated styles with SVG fill animation */}
            <style jsx>{`
                @keyframes rgb-shift {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }

                @keyframes sparkles-rgb {
                    0% { fill: rgb(255, 0, 150); }
                    25% { fill: rgb(0, 255, 255); }
                    50% { fill: rgb(255, 255, 0); }
                    75% { fill: rgb(255, 0, 150); }
                    100% { fill: rgb(0, 255, 255); }
                }

                .rgb-gradient-text {
                    background: linear-gradient(
                        90deg, 
                        rgb(255, 0, 150) 0%,
                        rgb(0, 255, 255) 25%, 
                        rgb(255, 255, 0) 50%, 
                        rgb(255, 0, 150) 75%,
                        rgb(0, 255, 255) 100%
                    );
                    background-size: 200% 200%;
                    animation: rgb-shift 10s ease-in-out infinite;
                    -webkit-background-clip: text;
                    background-clip: text;
                    -webkit-text-fill-color: transparent;
                    font-weight: 600;
                }

                .sparkles-animation {
                    animation: sparkles-rgb 3s ease-in-out infinite;
                }
            `}</style>

            <DraggableButton>
                <Drawer open={open} onOpenChange={setOpen}>
                    <DrawerTrigger asChild>
                        <Button className={buttonClassName}>
                            <Image
                                src={Sparkles}
                                alt="Sparkles"
                                width={30}
                                height={30}
                            />
                            <span
                                className={`
                                    rgb-gradient-text font-semibold
                                    transition-all duration-500 ease-in-out overflow-hidden
                                    ${showText
                                        ? 'max-w-40 opacity-100 ml-2'
                                        : 'max-w-0 opacity-0 ml-0'
                                    }
                                    group-hover:max-w-40 group-hover:opacity-100 group-hover:ml-2
                                `}
                            >
                                Know About Developer
                            </span>
                        </Button>
                    </DrawerTrigger>
                    <DrawerContent className="border-0 bg-transparent backdrop-blur-lg border-t border-gray-200/30">
                        <DrawerHeader className="text-center">
                            <DrawerTitle className="text-2xl font-bold text-[green]">
                                Developer Profile
                            </DrawerTitle>
                            <DrawerDescription className="text-white">
                                Get to know the talented developer behind this project
                            </DrawerDescription>
                        </DrawerHeader>
                        <DeveloperInfo className="px-4" />
                        <DrawerFooter className="pt-4">
                            <DrawerClose asChild>
                                <Button variant="outline" className="border-gray-300/50 hover:bg-white/20 backdrop-blur-sm">
                                    Close
                                </Button>
                            </DrawerClose>
                        </DrawerFooter>
                    </DrawerContent>
                </Drawer>
            </DraggableButton>
        </>
    );
}