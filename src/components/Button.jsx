import React from 'react'

function Button({
    children,
    type = 'button',
    bgColor = 'bg-blue-600',
    textColor = 'text-white',
    className = '',
    hoverBgColor = 'hover:bg-blue-700',
    focusRing = 'focus:ring-2 focus:ring-blue-400 focus:outline-none',
    shadow = 'shadow-md',
    transition = 'transition duration-200',
    ...props
}) {
    return (
        <button
            type={type}
            className={`
                px-5 py-2.5 rounded-lg font-semibold
                ${bgColor} ${textColor}
                ${hoverBgColor} ${focusRing} ${shadow} ${transition}
                ${className}
            `}
            {...props}
        >
            {children}
        </button>
    )
}

export default Button