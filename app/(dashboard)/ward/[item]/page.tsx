import RecordDetailRoutePage from "@/features/pages/record-detail-route-page";

export default async function WardDetailPage({
  params,
}: {
  params: Promise<{ item: string }>;
}) {
  const { item } = await params;

  return (
    <RecordDetailRoutePage active="Ward" item={decodeURIComponent(item)} />
  );
}
