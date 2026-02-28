import { getQuotes } from "@/actions/actions";
import { ChartBarSquareIcon, EllipsisHorizontalCircleIcon, CheckCircleIcon } from "@heroicons/react/24/solid";

interface CardProps {
    title: string;
    value: number;
    description: string;
    icon: React.ReactNode;
    color: string;
};

// Generate styled overview card with data
function Card({ title, value, description, icon, color }: CardProps) {
    return (
        <div className="bg-secondary-background p-8 rounded-lg border border-white/10">
            <div className="flex justify-between items-center mb-7">
                <h2 className="font-bold text-white/60">{title}</h2>
                <div className={`${color} rounded-lg p-2 flex justify-center items-center`}>{icon}</div>
            </div>
            <p className="text-5xl font-bold mb-4">{value}</p>
            <p className="text-sm text-white/50">{description}</p>
        </div>
    );
}

// Generate overview cards with data
export default async function OverviewCards() {
    // Initialize variables
    let totalQuotes = 0;
    let pendingApproval = 0;
    let approved = 0;

    try {
        let quotes = await getQuotes();
        totalQuotes = quotes.length;
        pendingApproval = quotes.filter((quote) => quote.status === "Pending").length;
        approved = quotes.filter((quote) => quote.status === "Approved").length;
    } catch (error) {
        console.log(error);
    }

    // Return overview cards
    return (
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <Card
                title="Total Quotes"
                value={totalQuotes}
                description="Total quotes created"
                icon={<ChartBarSquareIcon className="size-6 text-blue-600" />}
                color="bg-blue-600/10"
            />
            <Card
                title="Pending Approval"
                value={pendingApproval}
                description="Requires follow-up"
                icon={<EllipsisHorizontalCircleIcon className="size-6 text-yellow-600" />}
                color="bg-yellow-600/10"
            />
            <Card
                title="Approved"
                value={approved}
                description="Ready for invoicing"
                icon={<CheckCircleIcon className="size-6 text-green-600" />}
                color="bg-green-600/10"
            />
        </section>
    );
}