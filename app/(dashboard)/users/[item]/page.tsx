import RecordDetailRoutePage from "@/features/pages/record-detail-route-page";

export default async function UserDetailPage({
  params,
}: {
  params: Promise<{ item: string }>;
}) {
  const { item } = await params;

  return (
    <RecordDetailRoutePage
      active="Users & Roles"
      item={decodeURIComponent(item)}
    />
  );
}
