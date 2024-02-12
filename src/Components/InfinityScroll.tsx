import React, { useCallback, useRef } from 'react'

const InfinityScroll = ({
    children,
    isLoading
}: {
    children: JSX.Element | React.ReactNode;
    isLoading?: boolean;
}) => {
    // create observer of useRef 
    const observer = useRef<IntersectionObserver | null>(null)

    // create callback for lastElement of data 
    const lastElement = useCallback((node: Element) => {
        if (isLoading) return
        if (observer.current) observer.current.disconnect()
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                console.log('Visible')
            }
        })
        if (node) observer.current?.observe(node)
    }, [isLoading])
    return (
        <div>InfinityScroll</div>
    )
}

export default InfinityScroll