import RecordDetailRoutePage from "@/features/pages/record-detail-route-page";

export default async function PerformanceDetailPage({
  params,
}: {
  params: Promise<{ item: string }>;
}) {
  const { item } = await params;

  return (
    <RecordDetailRoutePage
      active="School Performance"
      item={decodeURIComponent(item)}
    />
  );
}