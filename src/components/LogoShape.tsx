import React from 'react';
import Image from 'next/image';

interface LogoShapeProps {
  className?: string;
  width?: number;
  height?: number;
}

const LogoShape: React.FC<LogoShapeProps> = ({
  className = "",
  width = 240,
  height = 240
}) => {
  return (
    <Image
      src="/images/logo_colored.png"
      alt="DAFFA Logo Shape"
      width={width}
      height={height}
      className={`object-contain ${className}`}
    />
  );
};

export default LogoShape;

