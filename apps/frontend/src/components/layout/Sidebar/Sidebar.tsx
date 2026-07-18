import { useMemo } from "react";
import { useAnimu } from "../../../hooks/useAnime";
import { Aside } from "../../ui/Aside"
import { SidebarHeader } from "./SidebarHeader"
import { Link } from "react-router-dom";
import { type GroupType, GROUP_ICONS, GROUP_TYPES, GROUP_TYPE_MAPPINGS } from "../../../types/groupType";

interface Grouping {
    name: string;
    type: GroupType;
    count: number;
    path: string;
}

export const Sidebar = () => {
    const { data: animu, isLoading } = useAnimu();

    const grouping = useMemo<Grouping[]>(() => {
        if (!animu) return [];

        return animu.sections.map(section => ({
            name: section.label,
            type: section.group,
            count: section.entryIds.length,
            path: `/sections/${section.id}`
        }));
    }, [animu, isLoading]);
    
    return (
        <Aside>
            <SidebarHeader />
            <div>
                {GROUP_TYPES.map(groupType => {
                    const Icon = GROUP_ICONS[groupType];
                    const sections = grouping.filter(group => group.type === groupType);

                    return (
                        <div key={groupType} className="mb-4">
                            <div className="flex items-center gap-2 text-gray-300 font-medium mb-1">
                                <Icon size={16} className="text-gray-400" />
                                <span>{GROUP_TYPE_MAPPINGS[groupType]}</span>
                            </div>

                            <div className="pl-6 border border-[#2a2a2e] m1-2">
                                {sections.map(section => (
                                    <Link key={section.path} to={section.path} className="block text-sm text-gray-400 hover:text-white py-0.5">
                                        {section.name}: {section.count}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )})
                }
            </div>
            <div>
                <div>Search</div>
                <div>Statistics</div>
                <div>Cover Manager</div>
                <div>Settings</div>
            </div>
        </Aside>
    )
} 