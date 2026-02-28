interface BadgeProps {
    state: "Draft" | "Approved" | "Pending" | "Rejected"
};

export default function Badge({ state }: BadgeProps) {
    let badgeStyle = "";
    let dotStyle = "";

    switch (state) {
        case "Approved":
            badgeStyle = "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-glow-green";
            dotStyle = "bg-emerald-400 animate-pulse";
            break;
        case "Pending":
            badgeStyle = "bg-amber-500/10 text-amber-400 border border-amber-500/20 shadow-glow-amber";
            dotStyle = "bg-amber-400";
            break;
        case "Rejected":
            badgeStyle = "bg-red-500/10 text-red-400 border border-red-500/20";
            dotStyle = "bg-red-400";
            break;
        default:
            badgeStyle = "bg-slate-700/30 text-slate-300 border border-slate-600/30";
            dotStyle = "bg-slate-400";
            break;
    }

    return (
        <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${badgeStyle}`}>
            <span className={`size-1.5 rounded-full ${dotStyle}`}></span>
            {state}
        </span>
    );
}