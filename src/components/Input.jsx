import React, { useId } from 'react';

const Input = React.forwardRef(function Input({
    label,
    type = "text",
    className = "",
    error = "",
    helperText = "",
    ...props
}, ref) {
    const id = useId();
    return (
        <div className="w-full mb-4">
            {label && (
                <label
                    className="block mb-1 pl-1 text-sm font-medium text-muted-foreground"
                    htmlFor={id}
                >
                    {label}
                </label>
            )}
            <input
                type={type}
                className={`
                    px-4 py-2 rounded-lg 
                    bg-card text-foreground 
                    outline-none border w-full
                    transition-all duration-300
                    focus:bg-muted focus:border-white
                    placeholder:text-muted-foreground
                    ${error ? 'border-red-400 focus:border-red-400' : 'border-border'}
                    shadow-sm hover:border-white/30
                    ${className}
                `}
                ref={ref}
                {...props}
                id={id}
                aria-invalid={!!error}
                aria-describedby={error ? `${id}-error` : helperText ? `${id}-helper` : undefined}
            />
            {helperText && !error && (
                <p id={`${id}-helper`} className="mt-1 text-xs text-muted-foreground pl-1">
                    {helperText}
                </p>
            )}
            {error && (
                <p id={`${id}-error`} className="mt-1 text-xs text-red-400 pl-1">
                    {error}
                </p>
            )}
        </div>
    );
});

export default Input;
