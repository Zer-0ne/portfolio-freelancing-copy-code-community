import React from 'react'

const ToggleBtn = ({
    onClick,
    isClicked,
    className
}: {
    onClick: React.MouseEventHandler<HTMLDivElement> | undefined;
    className?: string
    isClicked: boolean
}) => {
    return (
        <div
            className={`${className} after:content-[''] flex relative w-[100px] h-auto rounded-3xl px-2 py-1 bg-[#3d38389d] text-[transparent] after:absolute after:top-[3px] after:bottom-[3px] after:w-[40%] after:rounded-full ${!isClicked ? 'after:bg-[grey] after:left-[3px]' : 'after:bg-[green] after:right-[3px]'}`}
            onClick={onClick}
        />
    )
}

export default ToggleBtn