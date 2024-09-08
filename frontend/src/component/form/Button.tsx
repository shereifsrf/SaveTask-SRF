import { helper } from "@/util/helper";
import React, { forwardRef } from "react";

const Button = forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ children, className, ...props }, ref) => {
  return (
    <button
      ref={ref}
      {...props}
      className={helper.cn(
        "rounded-lg border-[2.5px] border-secondary bg-primary py-1 font-bold text-white hover:bg-secondary hover:text-primary",
        className,
      )}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";

export default Button;
