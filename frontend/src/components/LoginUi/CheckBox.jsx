import * as React from "react";

const Checkbox = React.forwardRef(({ className, ...props }, ref) => (
  <div className="relative flex items-center justify-center">
    <input
      type="checkbox"
      ref={ref}
      className={`
        peer h-5 w-5 cursor-pointer appearance-none rounded-[4px] border border-black 
        bg-white transition-all checked:bg-black 
        ${className}
      `}
      {...props}
    />
    {/* 체크 표시 아이콘 (직접 SVG로 그림) */}
    <svg
      className="absolute h-3.5 w-3.5 pointer-events-none hidden peer-checked:block text-white"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  </div>
));

Checkbox.displayName = "Checkbox";

export { Checkbox };
