'use client';

import { Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import character1 from '/images/character1.png';

interface MascotCharacterProps {
  src?: string;
  alt?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
  animated?: boolean;
  withSparkles?: boolean;
  className?: string;
}

export function MascotCharacter({
  src = character1,
  alt = 'Mascot character',
  size = 'md',
  animated = true,
  withSparkles = false,
  className,
}: MascotCharacterProps) {
  const sizeClasses: Record<
    NonNullable<MascotCharacterProps['size']>,
    string
  > = {
    sm: 'w-16 h-16 md:w-20 md:h-20',
    md: 'w-20 h-20 md:w-28 md:h-28',
    lg: 'w-28 h-28 md:w-36 md:h-36',
    xl: 'w-36 h-36 md:w-48 md:h-48',
    '2xl': 'w-48 h-48 md:w-56 md:h-56',
    '3xl': 'w-56 h-56 md:w-64 md:h-64',
  };

  return (
    <motion.div
      className={cn(
        'relative flex items-center justify-center rounded-full bg-white shadow-lg overflow-hidden',
        sizeClasses[size],
        animated && 'animate-bounce',
        className,
      )}
      animate={animated ? { y: [0, -10, 0] } : undefined}
      transition={
        animated
          ? { duration: 2, repeat: Infinity, ease: 'easeInOut' }
          : undefined
      }
    >
      {/* Ensure the img fills container and stays circular */}
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover rounded-full"
      />

      {withSparkles && (
        <>
          <div className="absolute -top-2 -right-2 text-yellow-300 animate-spin">
            <Star className="w-4 h-4 fill-current" />
          </div>
          <div className="absolute -bottom-2 -left-2 text-yellow-300 animate-ping">
            <Star className="w-3 h-3 fill-current" />
          </div>
        </>
      )}
    </motion.div>
  );
}

export default MascotCharacter;
