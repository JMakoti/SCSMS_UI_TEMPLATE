"use client";

import { useEffect, useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { rabaiSchools } from "@/seeders/rabai-schools";
import {
  ArrowUpToLine,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Columns3,
  Download,
  Filter,
  Plus,
  RefreshCw,
  Search,
  School,
  X,
} from "lucide-react";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import StatusBadge from "@/features/ui/status-badge";
import PageHeader from "@/features/ui/page-header";
import { schoolRegistryFilterSchema } from "@/features/schemas/school-registry-filter-schema";

function SchoolsPage({
  onAdd,
  onProfile,
}: {
  onAdd: () => void;
  onProfile: (schoolId: string) => void;
}) {
  type SchoolRegistryFilterValues = z.infer<typeof schoolRegistryFilterSchema>;
  const { register, reset, setValue, watch } =
    useForm<SchoolRegistryFilterValues>({
      resolver: zodResolver(schoolRegistryFilterSchema),
      defaultValues: {
        query: "",
        filter: "All",
        rowsPerPage: 25,
      },
    });
  const query = watch("query");
  const filter = watch("filter");
  const rowsPerPage = watch("rowsPerPage");
  const [selected, setSelected] = useState<string[]>([]);
  const [columns, setColumns] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [page, setPage] = useState(1);
  const schoolLevels = [
    "All",
    "Primary",
    "Junior_Secondary",
    "Senior_School",
  ];
  const filtered = useMemo(
    () =>
      [...rabaiSchools]
        .sort((a, b) => a.displayName.localeCompare(b.displayName))
        .filter(
          (s) =>
            (filter === "All" || s.institutionType === filter) &&
            `${s.displayName} ${s.officialName} ${s.schoolCode ?? ""} ${s.ward ?? ""}`
              .toLowerCase()
              .includes(query.toLowerCase()),
        ),
    [query, filter],
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / rowsPerPage));
  const currentPage = Math.min(page, totalPages);
  const paginated = filtered.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage,
  );
  const pageStart =
    filtered.length === 0 ? 0 : (currentPage - 1) * rowsPerPage + 1;
  const pageEnd = Math.min(currentPage * rowsPerPage, filtered.length);
  const displayValue = (value: string | null | undefined) =>
    value && value.trim() ? value : "Not provided";

  useEffect(() => {
    setPage(1);
  }, [query, filter, rowsPerPage]);

  const toggle = (id: string) =>
    setSelected((p) =>
      p.includes(id) ? p.filter((x) => x !== id) : [...p, id],
    );
  return (
    <div className="content">
      <PageHeader
        title="Schools"
        description="Manage and maintain the official school registry"
        eyebrow="School Management / Registry"
        action={
          <Button className="edit-school-button" onClick={onAdd}>
            <Plus data-icon="inline-start" />
            Add School
          </Button>
        }
      />
      <div className="toolbar">
        <div className="toolbar-left">
          <div className="input-wrap table-search">
            <Search />
            <input
              {...register("query")}
              placeholder="Search by school name, code, ward..."
            />
          </div>
        </div>
        <div className="toolbar-right">
          <button className="outline-button">
            <UploadIcon /> Import
          </button>
          <button className="outline-button">
            <Download /> Export
          </button>
          <button
            className={`outline-button ${columns ? "active-tool" : ""}`}
            onClick={() => setColumns(!columns)}
          >
            <Columns3 /> Columns
          </button>
          <div className="filter-menu-wrap">
            <button
              className={`outline-button ${filtersOpen ? "active-tool" : ""}`}
              onClick={() => setFiltersOpen((value) => !value)}
              type="button"
              aria-expanded={filtersOpen}
            >
              <Filter /> Filters
              {filter !== "All" && <span className="count-pill">1</span>}
            </button>
            {filtersOpen && (
              <div className="school-filter-menu">
                <span>Institution type</span>
                {schoolLevels.map((level) => (
                  <button
                    className={filter === level ? "selected" : ""}
                    key={level}
                    onClick={() => {
                      setValue(
                        "filter",
                        level as SchoolRegistryFilterValues["filter"],
                        {
                          shouldDirty: true,
                          shouldValidate: true,
                        },
                      );
                      setFiltersOpen(false);
                    }}
                    type="button"
                  >
                    {level.replaceAll("_", " ")}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button className="icon-button border-button">
            <RefreshCw />
          </button>
        </div>
      </div>
      {selected.length > 0 && (
        <div className="bulk-bar">
          <span>{selected.length} selected</span>
          <button>Export selected</button>
          <button>Archive</button>
          <button className="close-bulk" onClick={() => setSelected([])}>
            <X />
          </button>
        </div>
      )}
      <div className="panel table-panel">
        <div className="table-meta">
          <span>
            Showing <b>{filtered.length}</b> of {rabaiSchools.length} Rabai
            schools
          </span>
          <div className="table-meta-right">
            <span>Rows per page</span>
            <select {...register("rowsPerPage", { valueAsNumber: true })}>
              {[25, 50, 100].map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th className="check-col">
                  <input
                    type="checkbox"
                    checked={
                      selected.length === filtered.length && filtered.length > 0
                    }
                    onChange={(e) =>
                      setSelected(
                        e.target.checked ? filtered.map((s) => s.id) : [],
                      )
                    }
                  />
                </th>
                <th>
                  School Code <ChevronDown />
                </th>
                <th>
                  School Name <ChevronDown />
                </th>
                <th>
                  Type <ChevronDown />
                </th>
                <th>
                  Ownership <ChevronDown />
                </th>
                <th>
                  Gender <ChevronDown />
                </th>
                <th>
                  Boarding <ChevronDown />
                </th>
                <th>
                  Ward <ChevronDown />
                </th>
                <th>Status</th>
                <th className="action-col"></th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((s) => (
                <tr key={s.id}>
                  <td className="check-col">
                    <input
                      type="checkbox"
                      checked={selected.includes(s.id)}
                      onChange={() => toggle(s.id)}
                    />
                  </td>
                  <td>
                    <button
                      className="code-link"
                      onClick={() => onProfile(s.id)}
                    >
                      {displayValue(s.schoolCode)}
                    </button>
                  </td>
                  <td>
                    <button
                      className="school-link"
                      onClick={() => onProfile(s.id)}
                    >
                      <span className="school-mini-icon">
                        <School />
                      </span>
                      {s.displayName}
                    </button>
                  </td>
                  <td>{s.institutionType.replaceAll("_", " ")}</td>
                  <td>
                    <span className="type-label">
                      <span
                        className={`type-dot ${s.ownershipType.toLowerCase()}`}
                      />
                      {s.ownershipType.replaceAll("_", " ")}
                    </span>
                  </td>
                  <td>{displayValue(s.genderType)}</td>
                  <td>{s.boardingType.replaceAll("_", " ")}</td>
                  <td>{displayValue(s.ward)}</td>
                  <td>
                    <StatusBadge status={s.isActive ? "Active" : "Inactive"} />
                  </td>
                  <td>
                    <button
                      className="row-action"
                      onClick={() => onProfile(s.id)}
                      aria-label={`View details for ${s.displayName}`}
                      title="View details"
                    >
                      View
                      <ChevronRight />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="empty-state">
              <Search />
              <strong>No schools found</strong>
              <span>There are no schools matching your current filters.</span>
              <button
                onClick={() => {
                  reset({ query: "", filter: "All", rowsPerPage });
                }}
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
        <div className="pagination">
          <span>
            Showing {pageStart}-{pageEnd} of {filtered.length} results
          </span>
          <div className="pages">
            <button
              disabled={currentPage === 1}
              onClick={() => setPage((value) => Math.max(1, value - 1))}
            >
              <ChevronLeft />
            </button>
            {Array.from({ length: totalPages }, (_, index) => index + 1)
              .filter(
                (pageNumber) =>
                  pageNumber === 1 ||
                  pageNumber === totalPages ||
                  Math.abs(pageNumber - currentPage) <= 1,
              )
              .map((pageNumber, index, pages) => (
                <span className="page-segment" key={pageNumber}>
                  {index > 0 && pageNumber - pages[index - 1] > 1 && (
                    <span>...</span>
                  )}
                  <button
                    className={currentPage === pageNumber ? "current" : ""}
                    onClick={() => setPage(pageNumber)}
                  >
                    {pageNumber}
                  </button>
                </span>
              ))}
            <button
              disabled={currentPage === totalPages}
              onClick={() =>
                setPage((value) => Math.min(totalPages, value + 1))
              }
            >
              <ChevronRight />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
export function UploadIcon() {
  return <ArrowUpToLine />;
}

export default SchoolsPage;
