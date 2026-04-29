import * as React from "react";

const Button = React.forwardRef(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    // 1. 버튼 스타일(색상) 정의
    const variants = {
      default: "bg-black text-white hover:bg-gray-800",
      destructive: "bg-red-500 text-white hover:bg-red-600",
      outline: "border border-black bg-transparent hover:bg-gray-100",
      secondary: "bg-gray-200 text-black hover:bg-gray-300",
      ghost: "hover:bg-gray-100",
      link: "text-black underline-offset-4 hover:underline",
    };

    // 2. 버튼 크기 정의
    const sizes = {
      default: "h-10 px-4 py-2",
      sm: "h-9 rounded-md px-3",
      lg: "h-11 rounded-md px-8",
      icon: "h-10 w-10",
    };

    return (
      <button
        className={`
        inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium 
        ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 
        focus-visible:ring-black focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50
        ${variants[variant]} 
        ${sizes[size]} 
        ${className || ""}
      `}
        ref={ref}
        {...props}
      />
    );
  },
);

Button.displayName = "Button";

export { Button };
