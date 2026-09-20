import RecordDetailRoutePage from "@/features/pages/record-detail-route-page";

export default async function InfrastructureDetailPage({
  params,
}: {
  params: Promise<{ item: string }>;
}) {
  const { item } = await params;

  return (
    <RecordDetailRoutePage
      active="Infrastructure"
      item={decodeURIComponent(item)}
    />
  );
}
