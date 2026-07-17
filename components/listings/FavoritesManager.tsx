"use client";

import { useEffect, useMemo, useState } from "react";
import { listings } from "@/lib/data/listings";
import type { Listing } from "@/lib/types/listing";
import { formatPrice } from "@/lib/utils/format";
import { ListingCard } from "@/components/listings/ListingCard";
import {
  initializeFavoriteListingIds,
  setFavoriteListingIds,
  subscribeToListingStorage,
} from "@/lib/listings/device-storage";
import { getListingFreshness } from "@/lib/listings/freshness";

const initialFavorites = listings.slice(0, 3);

export function FavoritesManager() {
  const [items, setItems] = useState<Listing[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [notice, setNotice] = useState("");

  const selectedItems = useMemo(
    () => selectedIds.map((id) => items.find((item) => item.id === id)).filter((item): item is Listing => Boolean(item)),
    [items, selectedIds],
  );

  useEffect(() => {
    const sync = () => {
      const ids = initializeFavoriteListingIds(initialFavorites.map((item) => item.id));
      window.setTimeout(() => {
        setItems(ids.map((id) => listings.find((item) => item.id === id)).filter((item): item is Listing => Boolean(item)));
      }, 0);
    };
    sync();
    return subscribeToListingStorage(sync);
  }, []);

  const toggleCompare = (id: string) => {
    setNotice("");
    setSelectedIds((current) => {
      if (current.includes(id)) return current.filter((item) => item !== id);
      if (current.length >= 3) {
        setNotice("비교는 한 번에 최대 3대까지 선택할 수 있습니다.");
        return current;
      }
      return [...current, id];
    });
  };

  const removeFavorite = (id: string) => {
    const nextItems = items.filter((item) => item.id !== id);
    setItems(nextItems);
    setFavoriteListingIds(nextItems.map((item) => item.id));
    setSelectedIds((current) => current.filter((item) => item !== id));
    setNotice("관심 매물에서 제외했습니다. 이 기기에 변경 내용이 저장됐습니다.");
  };

  const resetFavorites = () => {
    setItems(initialFavorites);
    setFavoriteListingIds(initialFavorites.map((item) => item.id));
    setSelectedIds([]);
    setNotice("예시 관심 매물을 다시 불러왔습니다.");
  };

  return (
    <>
      <div className="mt-6 flex flex-col gap-3 rounded-xl border border-brand/20 bg-brand/5 p-4 text-sm leading-relaxed text-brand sm:flex-row sm:items-center sm:justify-between">
        <div>
          <strong>관심 매물 비교 예시</strong>
          <p className="mt-1 text-text-secondary">저장한 매물은 이 기기에 유지됩니다. 2~3대를 선택하면 가격, 지역, 연식과 상태를 한눈에 비교할 수 있습니다.</p>
        </div>
        <span className="shrink-0 rounded-full bg-white px-3 py-1.5 text-xs font-bold text-brand">{items.length}대 저장</span>
      </div>

      {notice && <p role="status" className="mt-4 rounded-lg border border-border bg-white p-3 text-sm font-medium text-text-secondary">{notice}</p>}

      {items.length > 0 ? (
        <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <div key={item.id} className="overflow-hidden rounded-xl border border-border bg-white p-2 shadow-sm">
              <ListingCard listing={item} />
              <div className="mt-2 grid grid-cols-[1fr_auto] gap-2">
                <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-brand/5 px-3 py-2.5 text-xs font-bold text-brand">
                  <input type="checkbox" checked={selectedIds.includes(item.id)} onChange={() => toggleCompare(item.id)} className="h-4 w-4 accent-brand" />
                  비교 선택
                </label>
                <button type="button" onClick={() => removeFavorite(item.id)} className="rounded-lg border border-border px-3 py-2.5 text-xs font-bold text-text-secondary hover:border-red-200 hover:text-red-700">관심 해제</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-7 rounded-xl border border-dashed border-border bg-white p-10 text-center">
          <p className="font-bold text-text-primary">저장한 관심 매물이 없습니다.</p>
          <p className="mt-2 text-sm text-text-secondary">매물 상세 화면에서 관심 매물을 저장할 수 있습니다.</p>
          <button type="button" onClick={resetFavorites} className="mt-5 rounded-lg bg-brand px-4 py-2.5 text-sm font-bold text-white">예시 매물 다시 보기</button>
        </div>
      )}

      {selectedItems.length > 0 && (
        <section className="mt-8 overflow-hidden rounded-xl border border-brand/20 bg-white">
          <div className="flex flex-col gap-2 border-b border-border bg-brand/5 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div><p className="text-xs font-bold tracking-[0.12em] text-brand">COMPARE</p><h2 className="mt-1 text-xl font-bold text-text-primary">선택 장비 비교</h2></div>
            <p className="text-sm text-text-secondary">{selectedItems.length < 2 ? "한 대를 더 선택하면 비교가 쉬워집니다." : `${selectedItems.length}대를 비교하고 있습니다.`}</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] table-fixed text-left text-sm">
              <thead><tr className="border-b border-border"><th className="w-28 p-4 text-xs text-text-muted">항목</th>{selectedItems.map((item) => <th key={item.id} className="p-4 align-top font-bold text-text-primary">{item.title}</th>)}</tr></thead>
              <tbody className="divide-y divide-border">
                {[
                  ["가격", (item: Listing) => formatPrice(item.price, item.priceNegotiable)],
                  ["지역", (item: Listing) => item.region],
                  ["연식", (item: Listing) => `${item.year}년`],
                  ["모델", (item: Listing) => item.model ?? "판매자 확인"],
                  ["사용시간", (item: Listing) => item.usageHours ? `${item.usageHours.toLocaleString("ko-KR")}시간` : "판매자 확인"],
                  ["상태", (item: Listing) => item.condition],
                  ["거래", (item: Listing) => item.status],
                  ["최근 확인", (item: Listing) => getListingFreshness(item.confirmedAt).label],
                  ["시운전", (item: Listing) => item.tradeOptions?.includes("시운전 가능") ? "가능" : "판매자 확인"],
                ].map(([label, getValue]) => (
                  <tr key={label as string}><th className="bg-surface-muted p-4 text-xs font-semibold text-text-muted">{label as string}</th>{selectedItems.map((item) => <td key={item.id} className="p-4 font-medium text-text-secondary">{(getValue as (listing: Listing) => string)(item)}</td>)}</tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </>
  );
}
