import RecordDetailRoutePage from "@/features/pages/record-detail-route-page";

export default async function AuditLogDetailPage({
  params,
}: {
  params: Promise<{ item: string }>;
}) {
  const { item } = await params;

  return (
    <RecordDetailRoutePage
      active="Audit Logs"
      item={decodeURIComponent(item)}
    />
  );
}
