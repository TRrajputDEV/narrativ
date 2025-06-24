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
                    className="block mb-1 pl-1 text-sm font-medium text-gray-700"
                    htmlFor={id}
                >
                    {label}
                </label>
            )}
            <input
                type={type}
                className={`
                    px-4 py-2 rounded-lg 
                    bg-white text-gray-900 
                    outline-none border w-full
                    transition duration-200
                    focus:bg-gray-50 focus:border-blue-500
                    ${error ? 'border-red-500 focus:border-red-500' : 'border-gray-300'}
                    shadow-sm
                    ${className}
                `}
                ref={ref}
                {...props}
                id={id}
                aria-invalid={!!error}
                aria-describedby={error ? `${id}-error` : helperText ? `${id}-helper` : undefined}
            />
            {helperText && !error && (
                <p id={`${id}-helper`} className="mt-1 text-xs text-gray-500 pl-1">
                    {helperText}
                </p>
            )}
            {error && (
                <p id={`${id}-error`} className="mt-1 text-xs text-red-600 pl-1">
                    {error}
                </p>
            )}
        </div>
    );
});

export default Input;