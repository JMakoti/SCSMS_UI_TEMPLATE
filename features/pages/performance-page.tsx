import { rabaiSchools } from "@/seeders/rabai-schools";

const registrySchools = [...rabaiSchools].sort((a, b) =>
  a.displayName.localeCompare(b.displayName),
);
const defaultPerformanceSchool =
  registrySchools[0]?.displayName ?? "Not provided";


export default function PerformanceContent(
    {
        detail = false,
        school = defaultPerformanceSchool,
    }: {
        detail?: boolean;
        school?: string;
    }
) {
    return (
        <div>
            <h3>Performance Content</h3>
        </div>
    )
}


