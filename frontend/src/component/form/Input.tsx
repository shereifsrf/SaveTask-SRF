import { helper } from "@/util/helper";
import { forwardRef } from "react";
import { FieldError } from "react-hook-form";

interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  error?: FieldError;
  multiline?: boolean;
}
const Input = forwardRef<HTMLInputElement | HTMLTextAreaElement, InputProps>(
  ({ multiline, error, ...props }, ref) => {
    const twClass = helper.cn(
      "w-full placeholder-secondary text-primary rounded-lg p-2 outline-none border-2 focus:border-secondary",
      { "border-red-500": error },
    );
    return (
      <div className="flex w-full flex-col justify-center">
        {multiline ? (
          <textarea
            className={helper.cn(twClass, props.className)}
            {...props}
            ref={ref as React.Ref<HTMLTextAreaElement>}
          />
        ) : (
          <input
            {...props}
            className={helper.cn(props.className, twClass)}
            ref={ref as React.Ref<HTMLInputElement>}
          />
        )}
        {error && (
          <p className="text-pretty text-[10px] text-red-500">
            {error.message}
          </p>
        )}
      </div>
    );
  },
);
Input.displayName = "Input";

export default Input;
