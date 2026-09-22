import React from 'react';

interface NormandieEmblemProps {
  className?: string;
  showText?: boolean;
}

/**
 * Authentic Normandie-Niemen regiment emblem matching the exact official image
 * with two golden Norman lions, the white lightning arrow and the red shield.
 */
export const NormandieEmblem: React.FC<NormandieEmblemProps> = ({
  className = 'w-full h-full',
}) => {
  return (
    <img
      src="/normandie-emblem.svg"
      alt="Эмблема полка «Нормандия — Неман»"
      className={`${className} object-contain drop-shadow-md`}
      loading="eager"
      draggable={false}
    />
  );
};
