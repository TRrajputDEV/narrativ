import React from 'react'

function Button({
    children,
    type = 'button',
    bgColor = 'bg-white',
    textColor = 'text-black',
    className = '',
    hoverBgColor = 'hover:bg-white/90',
    focusRing = 'focus:ring-2 focus:ring-white/20 focus:outline-none',
    shadow = 'shadow-lg',
    transition = 'transition-all duration-300',
    ...props
}) {
    return (
        <button
            type={type}
            className={`
                px-5 py-2.5 rounded-lg font-semibold doto-button
                ${bgColor} ${textColor}
                ${hoverBgColor} ${focusRing} ${shadow} ${transition}
                hover:scale-105 hover:shadow-white/20
                ${className}
            `}
            {...props}
        >
            {children}
        </button>
    )
}

export default Button
