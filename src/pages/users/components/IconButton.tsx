import { ComponentProps } from "react";
import { twMerge } from "tailwind-merge";

interface IconButtonProps extends ComponentProps<"button"> {
  transparent?: boolean;
}

export const IconButton = ({ ...props }: IconButtonProps) => {
  return (
    <button
      {...props}
      className={twMerge(
        "md:border rounded-md p-1.5 transition-all duration-200",
        props.disabled ? "opacity-45" : "hover:bg-accent hover:text-primary"
      )}
    />
  );
};
