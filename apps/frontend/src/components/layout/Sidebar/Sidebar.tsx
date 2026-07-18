import { useMemo } from "react";
import { useAnimu } from "../../../hooks/useAnime";
import { GROUP_TYPE_MAPPINGS, GROUP_TYPES, type GroupType } from "../../../types/animu";
import { Aside } from "../../ui/Aside"
import { SidebarHeader } from "./SidebarHeader"
import { Link } from "react-router-dom";

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
                {
                    GROUP_TYPES.map(groupType => (
                        <div>
                            <div>{GROUP_TYPE_MAPPINGS[groupType]}</div>
                            {grouping.filter(group => group.type === groupType).map(item => (
                                <div>
                                    <Link to={item.path}><span>{item.name}: {item.count}</span></Link>
                                </div>
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