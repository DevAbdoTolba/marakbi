import React from 'react';
import Image from 'next/image';

interface LogoIconProps {
  className?: string;
  width?: number;
  height?: number;
}

const LogoIcon: React.FC<LogoIconProps> = ({
  className = "",
  width = 96,
  height = 96
}) => {
  return (
    <Image
      src="/images/logo.png"
      alt="DAFFA Logo Icon"
      width={width}
      height={height}
      className={`object-contain ${className}`}
    />
  );
};

export default LogoIcon;

