import { cn } from "@/lib/utils";
import { Calendar, Utensils, Users, MessageSquare, ClipboardCheck } from "lucide-react";

type TabType = "events" | "mealsessions" | "users" | "feedbacks" | "foodclaims";

interface AdminTabsProps {
    activeTab: TabType;
    onTabChange: (tab: TabType) => void;
}

const tabs = [
    { id: "events" as TabType, label: "Events", icon: Calendar },
    { id: "mealsessions" as TabType, label: "Meal Sessions", icon: Utensils },
    { id: "users" as TabType, label: "Users", icon: Users },
    { id: "feedbacks" as TabType, label: "Feedbacks", icon: MessageSquare },
    { id: "foodclaims" as TabType, label: "Food Claims", icon: ClipboardCheck },
];

export function AdminTabs({ activeTab, onTabChange }: AdminTabsProps) {
    return (
        <div className="mb-6 animate-slide-up" style={{ animationDelay: "0.1s" }}>
            <div className="flex overflow-x-auto gap-1 p-1.5 bg-white rounded-2xl shadow-md border border-gray-100">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;

                    return (
                        <button
                            key={tab.id}
                            onClick={() => onTabChange(tab.id)}
                            className={cn(
                                "flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 whitespace-nowrap",
                                isActive
                                    ? "bg-gradient-to-r from-yellow-200 to-pink-200 text-gray-800 shadow-sm"
                                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                            )}
                        >
                            <Icon className={cn("h-4 w-4", isActive && "text-pink-500")} />
                            {tab.label}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}