interface FieldProps {
    type: "text" | "date"
    label?: string
    name: string
    placeholder?: string,
    disabled?: boolean,
    icon?: React.ReactNode,
    value?: string | number,
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void,
};


const Field = ({ type, label, name, placeholder, disabled, icon, value, onChange }: FieldProps) => {
    if (label) {
        if (icon) {
            return (
                <label className="flex flex-col gap-2">
                    <span className="text-text-secondary text-xs uppercase tracking-wider font-bold">{label}</span>
                    <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground">
                            {icon}
                        </span>
                        <input className="bg-secondary w-full rounded-lg border border-white/10 pl-10 pr-4 py-3" name={name} placeholder={placeholder} type={type} disabled={disabled} value={value} onChange={onChange} />
                    </div>
                </label>
            );
        } else {
            return (
                <label className="flex flex-col gap-2">
                    <span className="text-text-secondary text-xs uppercase tracking-wider font-bold">{label}</span>
                    <input className="bg-secondary w-full rounded-lg border border-white/10 pl-10 pr-4 py-3" name={name} placeholder={placeholder} type={type} disabled={disabled} value={value} onChange={onChange} />
                </label>
            );
        }
    } else {
        if (icon) {
            return (
                <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground">
                        {icon}
                    </span>
                    <input className="bg-secondary w-full rounded-lg border border-white/10 pl-10 pr-4 py-3" name={name} placeholder={placeholder} type={type} disabled={disabled} value={value} onChange={onChange} />
                </div>
            );
        } else {
            return (
                <input className="bg-secondary w-full rounded-lg border border-white/10 pl-10 pr-4 py-3" name={name} placeholder={placeholder} type={type} disabled={disabled} value={value} onChange={onChange} />
            );
        }
    }
}

export default Field;