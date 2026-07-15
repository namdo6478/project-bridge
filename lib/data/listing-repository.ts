import { listings as sampleListings, getListingById as getSampleListingById } from "@/lib/data/listings";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";
import type {
  Listing,
  ListingCategory,
  ListingCondition,
  ListingRegion,
  ListingSubcategory,
  SaleStatus,
} from "@/lib/types/listing";

interface ListingRow {
  id: string;
  title: string;
  category: string;
  subcategory: string;
  region: string;
  model_year: number;
  price: number | null;
  price_negotiable: boolean;
  status: string;
  condition: string;
  manufacturer: string | null;
  model_name: string | null;
  usage_hours: number | null;
  description: string;
  trade_options: string[] | null;
  created_at: string;
}

function mapListing(row: ListingRow): Listing {
  return {
    id: row.id,
    title: row.title,
    category: row.category as ListingCategory,
    subcategory: row.subcategory as ListingSubcategory,
    region: row.region as ListingRegion,
    year: row.model_year,
    price: row.price,
    priceNegotiable: row.price_negotiable,
    status: row.status as SaleStatus,
    condition: row.condition as ListingCondition,
    manufacturer: row.manufacturer || "미입력",
    model: row.model_name || undefined,
    usageHours: row.usage_hours ?? undefined,
    description: row.description,
    tradeOptions: row.trade_options ?? [],
    createdAt: row.created_at,
  };
}

export async function getAllListings(): Promise<Listing[]> {
  if (!isSupabaseConfigured()) {
    return sampleListings;
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("listings")
    .select("id,title,category,subcategory,region,model_year,price,price_negotiable,status,condition,manufacturer,model_name,usage_hours,description,trade_options,created_at")
    .eq("is_hidden", false)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("매물 목록 조회 실패", error.message);
    return sampleListings;
  }

  const databaseListings = (data as ListingRow[]).map(mapListing);
  return [...databaseListings, ...sampleListings];
}

export async function getListingById(id: string): Promise<Listing | undefined> {
  const sample = getSampleListingById(id);
  if (sample || !isSupabaseConfigured()) {
    return sample;
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("listings")
    .select("id,title,category,subcategory,region,model_year,price,price_negotiable,status,condition,manufacturer,model_name,usage_hours,description,trade_options,created_at")
    .eq("id", id)
    .eq("is_hidden", false)
    .maybeSingle();

  if (error || !data) {
    return undefined;
  }

  return mapListing(data as ListingRow);
}
