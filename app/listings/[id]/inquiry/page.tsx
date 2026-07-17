import { redirect } from "next/navigation";

export default async function InquiryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  redirect(`/listings/${id}#direct-contact`);
}
