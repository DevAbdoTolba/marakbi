import React from 'react';

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
    <svg 
      className={className} 
      width={width} 
      height={height} 
      viewBox="0 0 24 60" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12.0123 50.5851C12.0123 50.5851 10.8338 36.1351 0 26.5638L1.1839 0.000366211C1.1839 0.000366211 22.3402 7.91096 12.0123 50.5851Z"
        fill="url(#paint0_linear_1676_751)"
      />
      <path
        d="M0 30.2157C0 30.2157 5.90335 34.5208 6.54696 40.9644L0 30.2157Z"
        fill="url(#paint1_linear_1676_751)"
      />
      <defs>
        <linearGradient
          id="paint0_linear_1676_751"
          x1="7.42648"
          y1="0.000366211"
          x2="7.42648"
          y2="50.5851"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#106BD8" />
          <stop offset="0.557692" stopColor="#083872" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_1676_751"
          x1="3.27348"
          y1="30.2157"
          x2="3.27348"
          y2="40.9644"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#106BD8" />
          <stop offset="0.557692" stopColor="#083872" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default LogoShape;
