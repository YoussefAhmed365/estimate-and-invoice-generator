"use client";
import { getQuoteById, updateQuote } from "@/actions/actions";
import Button from "@/components/UI/Button";
import Field from "@/components/UI/Field";
import { PlusIcon } from "@heroicons/react/24/outline";
import { BuildingOffice2Icon, CalendarDaysIcon, CheckBadgeIcon, DocumentArrowDownIcon, FolderOpenIcon, PlusCircleIcon, TrashIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";


interface TaskData {
    id: number;
    name: string;
    description: string;
    hours: number;
    rate: number;
};

interface TaskProps {
    task: TaskData;
    onDelete: (id: number) => void;
    onUpdate: (id: number, field: keyof TaskData, value: string | number) => void;
};

const Task = ({ task, onDelete, onUpdate }: TaskProps) => {
    const taskAmount = task.hours * task.rate;

    return (
        <tr className="group hover:bg-input-bg/50 transition-colors">
            <td className="px-6 py-4">
                <div className="flex flex-col gap-2">
                    <input name="task-name" value={task.name} onChange={(e) => onUpdate(task.id, 'name', e.target.value)} className="bg-transparent border-0 border-b border-dashed border-secondary p-0 pb-1 text-white font-medium focus:ring-0 focus:border-primary placeholder:text-text-secondary/50" placeholder="Enter task name" type="text" />
                    <input name="task-description" value={task.description} onChange={(e) => onUpdate(task.id, 'description', e.target.value)} className="bg-transparent border-0 p-0 text-sm text-text-secondary focus:ring-0 placeholder:text-text-secondary/50" placeholder="Add description" type="text" />
                </div>
            </td>
            <td className="px-6 py-4">
                <input name="task-hours" value={task.hours} onChange={(e) => onUpdate(task.id, 'hours', Number(e.target.value))} className="w-full bg-input-bg rounded px-3 py-2 text-right text-white border border-secondary focus:border-primary focus:ring-1 focus:ring-primary outline-none" min={0} placeholder="0" type="number" />
            </td>
            <td className="px-6 py-4">
                <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary text-sm">$</span>
                    <input name="task-rate" value={task.rate} onChange={(e) => onUpdate(task.id, 'rate', Number(e.target.value))} className="w-full bg-input-bg rounded pl-6 pr-3 py-2 text-right text-white border border-secondary focus:border-primary focus:ring-1 focus:ring-primary outline-none" min={0} placeholder="0" type="number" />
                </div>
            </td>
            <td className="px-6 py-4 text-right font-bold text-text-secondary/50 text-lg">
                {taskAmount ? `$${taskAmount.toFixed(2)}` : '$0.00'}
            </td>
            <td className="px-6 py-4 text-center">
                <button type="button" onClick={() => onDelete(task.id)} className="text-text-secondary hover:text-red-500 cursor-pointer transition-colors opacity-0 group-hover:opacity-100 p-2">
                    <TrashIcon className="size-5" />
                </button>
            </td>
        </tr>
    );
};

function UpdateEstimateContent() {
    // Get quote id from the URL "/quote/update-estimate?id=${quote._id?.toString()}"
    const searchParams = useSearchParams();
    const router = useRouter();
    const quoteId: string = searchParams.get('id') || "";

    // Quote variables
    const [clientName, setClientName] = useState("");
    const [projectName, setProjectName] = useState("");
    const [issueDate, setIssueDate] = useState("");
    const [validUntil, setValidUntil] = useState("");
    const [notesForClient, setNotesForClient] = useState("");
    const [tasks, setTasks] = useState<TaskData[]>([]);
    const [taxRate, setTaxRate] = useState<number>(10);
    const [discount, setDiscount] = useState<number>(0);
    const [quoteStatus, setQuoteStatus] = useState<"Draft" | "Pending" | "Approved" | "Rejected">("Draft");

    useEffect(() => {
        if (quoteId) {
            GetQuoteData();
        } else {
            router.push('/');
        }
    }, [quoteId, router]);


    // Get quote data from database
    async function GetQuoteData() {
        const quote = await getQuoteById(quoteId);
        if (quote) {
            setClientName(quote.clientName || "");
            setProjectName(quote.projectName || "");
            setIssueDate(quote.issueDate || "");
            setValidUntil(quote.validUntil || "");
            setNotesForClient(quote.notesForClient || "");
            setTasks(quote.lineItems || []);
            setTaxRate(quote.taxRatePercentage || 0);
            setDiscount(quote.discount || 0);
            setQuoteStatus(quote.status);
        }
    }

    function addTask() {
        setTasks([...tasks, { id: Date.now(), name: '', description: '', hours: 0, rate: 0 }]);
    }

    function deleteTask(id: number) {
        setTasks(tasks.filter((t) => t.id !== id));
    }

    function updateTask(id: number, field: keyof TaskData, value: string | number) {
        setTasks(tasks.map((t) => (t.id === id ? { ...t, [field]: value } : t)));
    }

    const subtotal = tasks.reduce((sum, task) => sum + task.hours * task.rate, 0);
    const taxAmount = (subtotal * taxRate) / 100;
    const grandTotal = subtotal + taxAmount - discount;

    async function handleSave(status: "Draft" | "Pending" | "Approved" | "Rejected") {
        // Basic validation
        if (status === "Pending") {
            if (!clientName || !projectName || tasks.length === 0) {
                alert("Please fill in Client Name, Project Name and add at least one task.");
                return;
            }
        }

        const formData = new FormData();
        formData.append("clientName", clientName);
        formData.append("projectName", projectName);
        formData.append("issueDate", issueDate);
        formData.append("validUntil", validUntil);
        formData.append("notesForClient", notesForClient);
        formData.append("lineItems", JSON.stringify(tasks));
        formData.append("subTotal", subtotal.toString());
        formData.append("taxRatePercentage", taxRate.toString());
        formData.append("taxAmount", taxAmount.toString());
        formData.append("discount", discount.toString());
        formData.append("grandTotal", grandTotal.toString());
        formData.append("status", status);

        const result = await updateQuote(quoteId, formData);
        if (result.success) {
            alert("Quote saved successfully!");
            router.push("/");
        } else {
            alert("Failed to save quote.");
        }
    }

    return (
        <main className="flex-1 w-full max-w-[1200px] mx-auto px-4 py-8 md:px-10 md:py-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3">
                        <Link href="/quote">
                            <Button type="button" styleType="backIcon" />
                        </Link>
                        <h1 className="text-white text-3xl md:text-4xl font-black leading-tight tracking-[-0.033em]">Create New Estimate</h1>
                    </div>
                    <p className="text-text-secondary text-base font-normal leading-normal ml-11">Draft a new project proposal for your client.</p>
                </div>
                <div className="flex items-center gap-3 ml-11 md:ml-0">
                    <Button type="button" styleType="secondary" onClick={() => handleSave("Draft")}>Save Draft</Button>
                    <Button type="button" styleType="outlined">Generate PDF <DocumentArrowDownIcon className="size-5 ml-2" /></Button>
                </div>
            </div>

            <div className="bg-secondary-background rounded-xl shadow-2xl border border-secondary overflow-hidden">
                <div className="p-6 md:p-8 border-b border-secondary">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                        <Field type="text" label="Client Name" name="clientName" value={clientName} onChange={(e) => setClientName(e.target.value)} icon={<BuildingOffice2Icon className="size-5" />} placeholder="e.g. Acme Corp" />
                        <Field type="text" label="Project Name" name="projectName" value={projectName} onChange={(e) => setProjectName(e.target.value)} icon={<FolderOpenIcon className="size-5" />} placeholder="e.g. Website Redesign Q3" />
                        <Field type="date" label="Issue Date" name="issueDate" value={issueDate} onChange={(e) => setIssueDate(e.target.value)} icon={<CalendarDaysIcon className="size-5" />} />
                        <Field type="date" label="Valid Until" name="validUntil" value={validUntil} onChange={(e) => setValidUntil(e.target.value)} icon={<CheckBadgeIcon className="size-5" />} />
                    </div>
                </div>

                <div className="p-6 md:p-8">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-white text-lg font-bold">Line Items</h3>
                        <div className="inline-flex items-center gap-2">
                            <span className="text-text-secondary">Quote Status:</span>
                            <select
                                value={quoteStatus}
                                onChange={(e) => setQuoteStatus(e.target.value as any)}
                                className="bg-input-bg border border-secondary text-white text-sm rounded-lg pl-1 pr-6 py-2 focus:ring-primary focus:border-primary outline-none transition-all cursor-pointer"
                            >
                                <option value="Draft">Draft</option>
                                <option value="Pending">Pending</option>
                                <option value="Approved">Approved</option>
                                <option value="Rejected">Rejected</option>
                            </select>
                        </div>
                    </div>

                    <div className="overflow-x-auto rounded-lg border border-secondary mb-8 bg-background/50">
                        <table className="w-full min-w-[800px] border-collapse">
                            <thead>
                                <tr className="bg-input-bg border-b border-secondary">
                                    <th className="px-6 py-4 text-left text-xs font-bold text-text-secondary uppercase tracking-wider w-[35%]">Task / Description</th>
                                    <th className="px-6 py-4 text-right text-xs font-bold text-text-secondary uppercase tracking-wider w-[15%]">Hours</th>
                                    <th className="px-6 py-4 text-right text-xs font-bold text-text-secondary uppercase tracking-wider w-[15%]">Rate</th>
                                    <th className="px-6 py-4 text-right text-xs font-bold text-text-secondary uppercase tracking-wider w-[15%]">Amount</th>
                                    <th className="px-6 py-4 w-[10%]"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-secondary">
                                {tasks.map((task, index) => (
                                    <Task key={index} task={task} onDelete={deleteTask} onUpdate={updateTask} />
                                ))}
                            </tbody>
                        </table>
                        <div className="bg-input-bg border-t border-secondary flex justify-center hover:bg-input-bg/80 transition-colors cursor-pointer group">
                            <Button type="button" styleType="fullWidthTable" onClick={addTask} className="text-text-secondary min-w-full min-h-full flex justify-center items-center py-4"><PlusIcon className="size-4 mr-2" /> Add New Line</Button>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row justify-between gap-12">
                        <div className="flex-1 max-w-md">
                            <label className="block text-sm font-bold text-text-secondary mb-2 uppercase tracking-wider">Notes for Client</label>
                            <textarea className="w-full h-32 p-3 rounded-lg border border-secondary bg-input-bg text-text-main text-sm resize-none focus:border-primary focus:ring-1 focus:ring-primary outline-none placeholder:text-text-secondary" value={notesForClient} onChange={(e) => setNotesForClient(e.target.value)} placeholder="Add any additional notes, payment terms, or thank you message..."></textarea>
                        </div>

                        <div className="w-full md:w-80 flex flex-col gap-4 bg-input-bg/30 p-6 rounded-lg border border-secondary/50">
                            <div className="flex justify-between items-center text-text-secondary text-sm">
                                <span>Subtotal</span>
                                <span className="font-bold text-white text-base">${subtotal.toFixed(2)}</span>
                            </div>

                            <div className="flex justify-between items-center text-text-secondary text-sm">
                                <div className="flex items-center gap-2">
                                    <span>Tax</span>
                                    <div className="relative w-16">
                                        <input className="w-full bg-input-bg border border-secondary rounded py-1 pl-2 pr-6 text-right text-xs font-bold text-white focus:ring-1 focus:ring-primary outline-none focus:border-primary" type="number" min={0} value={taxRate} onChange={(e) => setTaxRate(Number(e.target.value))} />
                                        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-text-secondary text-xs">%</span>
                                    </div>
                                </div>
                                <span className="font-bold text-white text-base">${taxAmount.toFixed(2)}</span>
                            </div>

                            <div className="flex justify-between items-center text-text-secondary text-sm">
                                <div className="flex items-center gap-2">
                                    <span>Discount</span>
                                    <div className="relative w-20">
                                        <span className="absolute left-2 top-1/2 -translate-y-1/2 text-text-secondary text-xs">$</span>
                                        <input className="w-full bg-input-bg border border-secondary rounded py-1 pl-5 pr-2 text-right text-xs font-bold text-white focus:ring-1 focus:ring-primary outline-none focus:border-primary" type="number" min={0} value={discount} onChange={(e) => setDiscount(Number(e.target.value))} />
                                    </div>
                                </div>
                                <span className="font-bold text-white text-base">-${discount.toFixed(2)}</span>
                            </div>

                            <div className="h-px bg-secondary my-2"></div>

                            <div className="flex justify-between items-end">
                                <span className="text-white text-lg font-bold">Grand Total</span>
                                <span className="text-primary text-3xl font-black tracking-tight drop-shadow-lg">${grandTotal.toFixed(2)}</span>
                            </div>

                            <div className="mt-4">
                                <button type="button" onClick={() => handleSave(quoteStatus)} className="w-full flex items-center justify-center h-12 rounded-lg bg-primary text-white text-base font-bold shadow-xl shadow-primary/30 hover:bg-primary/80 transition-all hover:-translate-y-0.5 border border-primary/50 cursor-pointer">
                                    Save Quote
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default function UpdateEstimate() {
    return (
        <Suspense fallback={<div className="flex justify-center items-center h-screen"><p className="text-white">Loading...</p></div>}>
            <UpdateEstimateContent />
        </Suspense>
    );
}