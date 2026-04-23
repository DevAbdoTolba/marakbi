import React from "react";
import Image from "next/image";

interface LogoProps {
  className?: string;
  width?: number;
  height?: number;
  variant?: "gradient" | "white";
}

const Logo: React.FC<LogoProps> = ({
  className = "",
  width = 24,
  height = 60,
  variant = "gradient",
}) => {
  return (
    <Image
      src="/images/logo.png"
      alt="DAFFA Logo"
      width={width}
      height={height}
      className={`object-contain ${className}`}
    />
  );
};

export default Logo;

