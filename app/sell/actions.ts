"use server";

import { revalidatePath } from "next/cache";
import {
  LISTING_CATEGORIES,
  LISTING_REGIONS,
  LISTING_SUBCATEGORIES,
  type ListingCategory,
} from "@/lib/types/listing";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

export interface CreateListingState {
  status: "idle" | "success" | "error";
  message: string;
  listingId?: string;
}

export const initialCreateListingState: CreateListingState = {
  status: "idle",
  message: "",
};

function textValue(formData: FormData, name: string) {
  return String(formData.get(name) ?? "").trim();
}

function numberValue(formData: FormData, name: string) {
  const value = Number(formData.get(name));
  return Number.isFinite(value) ? value : null;
}

export async function createListing(
  _previousState: CreateListingState,
  formData: FormData,
): Promise<CreateListingState> {
  if (!isSupabaseConfigured()) {
    return {
      status: "error",
      message: "데이터베이스 연결 준비는 완료되었습니다. Supabase 프로젝트 키를 연결하면 실제 등록이 시작됩니다.",
    };
  }

  const category = textValue(formData, "category") as ListingCategory;
  const subcategory = textValue(formData, "subcategory");
  const region = textValue(formData, "region");
  const condition = textValue(formData, "condition");
  const title = textValue(formData, "title");
  const description = textValue(formData, "description");
  const year = numberValue(formData, "year");
  const priceNegotiable = formData.get("priceNegotiable") === "on";
  const price = priceNegotiable ? null : numberValue(formData, "price");

  const validCategory = LISTING_CATEGORIES.includes(category) && category !== "삽니다";
  const validSubcategory = validCategory &&
    (LISTING_SUBCATEGORIES[category] as readonly string[]).includes(subcategory);
  const validRegion = (LISTING_REGIONS as readonly string[]).includes(region) && region !== "전국";

  if (
    !validCategory ||
    !validSubcategory ||
    !validRegion ||
    !["신품", "중고"].includes(condition) ||
    title.length < 4 ||
    description.length < 10 ||
    !year ||
    year < 1980 ||
    year > new Date().getFullYear() + 1 ||
    (!priceNegotiable && (price === null || price < 0))
  ) {
    return {
      status: "error",
      message: "필수 항목을 다시 확인해 주세요. 제목과 상세 설명도 충분히 입력해야 합니다.",
    };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      status: "error",
      message: "실제 매물을 등록하려면 먼저 로그인해 주세요.",
    };
  }

  const profileResult = await supabase.from("profiles").upsert({
    id: user.id,
    display_name: textValue(formData, "sellerName"),
    phone: textValue(formData, "contact"),
    updated_at: new Date().toISOString(),
  });

  if (profileResult.error) {
    return { status: "error", message: "판매자 정보를 저장하지 못했습니다. 잠시 후 다시 시도해 주세요." };
  }

  const { data, error } = await supabase
    .from("listings")
    .insert({
      seller_id: user.id,
      title,
      category,
      subcategory,
      condition,
      manufacturer: textValue(formData, "manufacturer") || null,
      model_name: textValue(formData, "model") || null,
      model_year: year,
      usage_hours: numberValue(formData, "usageHours"),
      price,
      price_negotiable: priceNegotiable,
      region,
      description,
      trade_options: formData.getAll("tradeOptions").map(String),
      status: "판매중",
    })
    .select("id")
    .single();

  if (error) {
    console.error("매물 등록 실패", error.message);
    return { status: "error", message: "매물을 저장하지 못했습니다. 입력 내용을 확인하고 다시 시도해 주세요." };
  }

  revalidatePath("/");
  revalidatePath("/listings");

  return {
    status: "success",
    message: "매물이 등록되었습니다. 매물 목록에서 바로 확인할 수 있습니다.",
    listingId: data.id,
  };
}
