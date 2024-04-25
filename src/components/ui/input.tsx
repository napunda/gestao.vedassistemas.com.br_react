import * as React from "react";
import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useState } from "react";
// import { withMask } from "use-mask-input";
import { useMask } from "@react-input/mask";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
}

const inputClasses = cva(
  ["absolute", "top-1/2", "-translate-y-1/2", "text-muted-foreground"],
  {
    variants: {
      position: {
        left: "left-3 pointer-events-none",
        right: "right-3",
      },
    },
    defaultVariants: {
      position: "left",
    },
  }
);

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  mask?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, icon, iconPosition = "left", mask, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const [typeState, setTypeState] = useState(type);
    const renderIconPassword = () => {
      const handleClick = () => {
        setShowPassword(!showPassword);
        setTypeState(showPassword ? "password" : "text");
      };

      return (
        <div className={inputClasses({ position: "right" })}>
          {showPassword ? (
            <EyeIcon
              onClick={handleClick}
              className="cursor-pointer"
              size={16}
            />
          ) : (
            <EyeOffIcon
              onClick={handleClick}
              className="cursor-pointer"
              size={16}
            />
          )}
        </div>
      );
    };

    const inputRef = useMask({
      mask: mask,
      replacement: { _: /\d/ },
    });
    return (
      <div className="relative w-full">
        {icon && (
          <div className={inputClasses({ position: iconPosition })}>{icon}</div>
        )}
        <input
          ref={mask ? inputRef : ref}
          type={typeState}
          className={cn(
            "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
            className,
            icon ? (iconPosition === "left" ? "pl-9" : "pr-9") : ""
          )}
          {...props}
        />
        {type === "password" && renderIconPassword()}
      </div>
    );
  }
);

Input.displayName = "Input";
export { Input };
