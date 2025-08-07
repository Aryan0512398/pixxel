'use client'
import React from 'react'
import { useParallax } from '../hooks/use_parallax';

function Floating_shape() {
    const scrollY = useParallax();
   const shapes = [
  {
    id: 1,
    size: 'w-24 h-24',
    position: 'top-20 left-10',
    gradient: 'from-blue-500 to-purple-500',
  },
  {
    id: 2,
    size: 'w-94 h-94',
    position: 'top-40 right-12',
    gradient: 'from-pink-500 to-yellow-500',
  },
  {
    id: 3,
    size: 'w-56 h-56',
    position: 'bottom-20 left-16',
    gradient: 'from-green-400 to-cyan-500',
  },
  {
    id: 4,
    size: 'w-64 h-64',
    position: 'bottom-35 right-60',
    gradient: 'from-indigo-500 to-blue-500',
  },
];

  return (
    <div className='fixed inset-0 overflow-hidden pointer-events-none' >
      {shapes.map(shape => (
        <div
          key={shape.id}
          className={`${shape.size} ${shape.position} bg-gradient-to-br ${shape.gradient} absolute rounded-full blur-2xl opacity-20 animate-pulse`}
          style={{
            transform: `translateY(${scrollY * 0.5}px) rotate(${scrollY * 0.1}deg)`,
          
          }}
        />
      ))}
    </div>
  )
}

export default Floating_shape
