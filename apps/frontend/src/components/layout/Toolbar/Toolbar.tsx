import { Link, useParams } from "react-router-dom";
import { useAnimu } from "../../../hooks/useAnime";
import { Breadcrumb } from "./Breadcrumb";

interface Crumbs {
    name: string;
    path: string;
}

export const Toolbar = () => {
    const { animeId, sectionId } = useParams();
    const { data: animu, isLoading, isError } = useAnimu();
    console.log(animeId, sectionId);

    const crumbs: Crumbs[] = [{ name: "Overview", path: "/" }];

    if (animeId) {
        console.log("Hey");
        const sectionItem = animu?.sections.find(x => x.entryIds.includes(animeId));
        const entryItem = animu?.entries.find(x => x.id === animeId);
        console.log(sectionItem);
        console.log(entryItem);

        crumbs.push({ name: sectionItem?.label ?? "", path: `section/${sectionItem?.id}` });
        crumbs.push({ name: entryItem?.title ?? "", path: `section/${entryItem?.id}` });
    }

    if (sectionId) {
        console.log("HO");
        const sectionItem = animu?.sections.find(x => x.id === sectionId);

        crumbs.push({ name: sectionItem?.label ?? "", path: `section/${sectionItem?.id}` });
    }

    return (
        <>
            <Breadcrumb />
        </>
        // <div className="flex items-center justify-between py-0 px-6 h-14 bg-[#141416] border-b border-[#2a2a2e] shrink-0">
        //     {/* Overview  */}
        //     {
        //         crumbs.map(crumb => (
        //             <><Link key={crumb.name} to={crumb.path}>{crumb.name}</Link> / </>
        //         ))
        //     }
        // </div>
    )
} 