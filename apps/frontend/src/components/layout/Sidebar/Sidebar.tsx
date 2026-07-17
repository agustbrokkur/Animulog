import { useMemo } from "react";
import { useAnimu } from "../../../hooks/useAnime";
import { GROUP_TYPE_MAPPINGS, GROUP_TYPES, type GroupType } from "../../../types/animu";
import { Aside } from "../../ui/Aside"
import { SidebarHeader } from "./SidebarHeader"

interface Grouping {
    name: string;
    type: GroupType;
    count: number;
}

export const Sidebar = () => {
    const { data: animu, isLoading } = useAnimu();

    const grouping = useMemo<Grouping[]>(() => {
        if (!animu) return [];

        return animu.sections.map(section => ({
            name: section.label,
            type: section.group,
            count: section.entryIds.length
        }));
    }, [animu, isLoading]);
    
    return (
        <Aside>
            <SidebarHeader />
            <div>
                {
                    GROUP_TYPES.map(groupType => (
                        <div>
                            <div>{GROUP_TYPE_MAPPINGS[groupType]}</div>
                            {grouping.filter(group => group.type === groupType).map(item => (
                                <div>{item.name}: {item.count}</div>
                            ))}
                            -----------------------------------------------
                        </div>
                    ))
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