import { Link, useParams } from "react-router-dom";
import { useAnimu } from "../../../hooks/useAnime";

export const Breadcrumb = () => {
    const { animeId, sectionId } = useParams();
    const { data: animu, isLoading, isError } = useAnimu();

    const entryItem = animeId 
        ? animu?.entries.find(entry => entry.id === animeId) 
        : undefined;

    const sectionItem = sectionId 
        ? animu?.sections.find(section => section.id === sectionId) 
        : animeId 
        ? animu?.sections.find(x => x.entryIds.includes(animeId))
        : undefined;

    const crumbs = [{ label: "Overview", path: "/" }];

    if (entryItem) {
        crumbs.push({ label: sectionItem?.label ?? "N/A", path: `/sections/${sectionItem?.id ?? "N/A"}`})
        crumbs.push({ label: entryItem.title, path: `/anime/${entryItem.id}` });
    }
    else if (sectionItem) {
        crumbs.push({ label: sectionItem.label, path: `/sections/${sectionItem.id}`})
    }

    return (
    <nav className="flex items-center gap-2 text-sm text-gray-400">
      {crumbs.map((crumb, i) => (
        <span key={crumb.path} className="flex items-center gap-2">
          {i > 0 && <span>/</span>}
          {i === crumbs.length - 1 ? (
            <span className="text-white">{crumb.label}</span>
          ) : (
            <Link to={crumb.path} className="hover:text-white">{crumb.label}</Link>
          )}
        </span>
      ))}
    </nav>
    )
}