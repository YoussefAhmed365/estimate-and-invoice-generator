import { ArrowLeftIcon } from "@heroicons/react/24/solid";

interface ButtonProps {
    onClick?: () => void,
    className?: string,
    styleType: "primary" | "secondary" | "secondarySmall" | "outlined" | "backIcon" | "fullWidthTable"
    type: "button" | "submit" | "reset",
    disabled?: boolean,
    children?: React.ReactNode,
};

const Button = ({ onClick, type, disabled, className, children, styleType }: ButtonProps) => {
    const classMap = {
        primary: "inline-flex items-center justify-center px-6 py-3 font-semibold rounded-xl text-white bg-primary hover:bg-primary/80 hover:text-white transition-all",
        secondary: "inline-flex items-center justify-center px-6 py-3 font-semibold rounded-xl text-white bg-secondary hover:bg-secondary/80 transition-all",
        secondarySmall: "px-4 py-1.5 rounded border border-white/10 text-sm font-medium text-text-secondary hover:bg-white/5 hover:text-white hover:border-white/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed",
        outlined: "inline-flex items-center justify-center px-6 py-3 font-semibold rounded-xl border border-primary text-primary bg-transparent hover:bg-primary hover:text-white transition-all",
        backIcon: "w-fit h-fit flex items-center justify-center p-3 rounded-full bg-secondary text-white transition-colors hover:bg-secondary/80",
        fullWidthTable: "flex items-center gap-2 text-sm font-bold text-secondary group-hover:text-primary transition-colors",
    };

    if (styleType == "backIcon") {
        return (
            <button onClick={onClick} className={`${classMap[styleType]} cursor-pointer ${(className ? className : "")}`} type={type} disabled={disabled}>
                <ArrowLeftIcon className="size-5" />
            </button>
        );
    } else {
        return (
            <button onClick={onClick} className={`${classMap[styleType]} cursor-pointer ${(className ? className : "")}`} type={type} disabled={disabled}>
                {children}
            </button>
        );
    }
}

export default Button;