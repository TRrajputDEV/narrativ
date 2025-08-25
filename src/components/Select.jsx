import React, { useId } from 'react'

function Select({
    options,
    label,
    className,
    ...props
}, ref) {
    const id = useId()
    return (
        <div className='w-full'>
            {label && <label htmlFor={id} className='inline-block mb-1 pl-1 text-muted-foreground font-medium'>{label}</label>}
            <select
                {...props}
                id={id}
                ref={ref}
                className={`px-3 py-2 rounded-lg bg-card text-foreground outline-none focus:bg-muted duration-300 border border-border hover:border-white/30 focus:border-white w-full transition-all ${className}`}
            >
                {options?.map((option) => (
                    <option key={option} value={option} className="bg-card text-foreground">
                        {option}
                    </option>
                ))}
            </select>
        </div>
    )
}

export default React.forwardRef(Select)
