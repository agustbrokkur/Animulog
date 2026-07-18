import { useMemo } from "react";
import { useAnimu } from "../../../hooks/useAnime";
import { type GroupType, GROUP_TYPES } from "../../../types/groupType";

interface Count {
    name: GroupType;
    size: number;
}

export const SidebarHeader = () => {
    const { data: animu, isLoading } = useAnimu();

    const counts = useMemo<Count[]>(() => {
        if (!animu) return [];

        return GROUP_TYPES.map(group => ({
            name: group,
            size: animu.sections
                .filter(section => section.group === group)
                .reduce((total, section) => total + section.entryIds.length, 0),
        }));
    }, [animu, isLoading]);

    return (
        <div className="pt-5 px-4 pb-4 border-b border-[#2a2a2e] shrink-0">
            <div className="border-none cursor-pointer p-0 text-[#e8473f] text-[30px] tracking-[4px] mb-0 transition-opacity duration-150 hover:opacity-75">
                Animulog
            </div>

            {
                counts.map(x => (
                    <div key={x.name}>
                        <div>{x.name}: {x.size}</div>
                    </div>
                ))
            }
        </div>
    )
} 