'use client';
import { useEffect, useRef } from 'react';
import React, { use, useState } from 'react'

function UserInterfaceObserver(threshold = 0.1) {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef();
    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => setIsVisible(entry.isIntersecting), {
            threshold,
        });
        if (ref.current) {
            observer.observe(ref.current);
        }
        return ()=> observer.disconnect();
    }, [threshold]);
    return [ref, isVisible];
}

export default UserInterfaceObserver
