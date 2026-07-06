"use client";

interface DataPoint { day: string; value: number; }

export default function SalesChart({ data }: { data: DataPoint[] }) {
    const max = Math.max(...data.map((d) => d.value));
    return (
        <div className="flex items-end justify-between gap-2 h-40">
            {data.map((d) => (
                <div key={d.day} className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-full flex items-end justify-center h-32">
                        <div
                            className="w-full max-w-[36px] bg-gradient-to-t from-primary-400 to-primary-300 rounded-t-lg transition-all duration-700"
                            style={{ height: `${(d.value / max) * 100}%` }}
                        />
                    </div>
                    <span className="text-[11px] text-gray-500 font-medium">{d.day}</span>
                </div>
            ))}
        </div>
    );
}