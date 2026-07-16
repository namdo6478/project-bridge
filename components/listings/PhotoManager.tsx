"use client";

import { useEffect, useRef, useState } from "react";

interface ManagedPhoto {
  id: string;
  label: string;
  previewUrl?: string;
  file?: File;
}

const MAX_PHOTOS = 8;
const MAX_PHOTO_SIZE = 10 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

const initialPhotos: ManagedPhoto[] = [
  { id: "demo-overall", label: "장비 전체" },
  { id: "demo-nameplate", label: "제조 명판" },
  { id: "demo-condition", label: "사용 흔적" },
];

function moveItem(items: ManagedPhoto[], from: number, to: number) {
  const next = [...items];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

export function PhotoManager() {
  const [photos, setPhotos] = useState<ManagedPhoto[]>(initialPhotos);
  const [message, setMessage] = useState("");
  const objectUrlsRef = useRef(new Set<string>());

  useEffect(() => {
    const objectUrls = objectUrlsRef.current;
    return () => objectUrls.forEach((url) => URL.revokeObjectURL(url));
  }, []);

  const addPhotos = (files: FileList | null) => {
    if (!files) return;
    const remaining = MAX_PHOTOS - photos.length;
    const selected = Array.from(files).slice(0, Math.max(remaining, 0));

    if (remaining <= 0) {
      setMessage(`사진은 최대 ${MAX_PHOTOS}장까지 등록할 수 있습니다.`);
      return;
    }
    if (selected.some((file) => !ALLOWED_TYPES.includes(file.type))) {
      setMessage("JPG, PNG, WEBP 사진만 추가할 수 있습니다.");
      return;
    }
    if (selected.some((file) => file.size > MAX_PHOTO_SIZE)) {
      setMessage("사진 한 장의 용량은 10MB 이하여야 합니다.");
      return;
    }

    const additions = selected.map((file) => {
      const previewUrl = URL.createObjectURL(file);
      objectUrlsRef.current.add(previewUrl);
      return {
        id: `${file.name}-${file.lastModified}-${crypto.randomUUID()}`,
        label: file.name,
        previewUrl,
        file,
      };
    });
    setPhotos((current) => [...current, ...additions]);
    setMessage(files.length > remaining ? `최대 ${MAX_PHOTOS}장까지만 추가했습니다.` : `${additions.length}장을 추가했습니다.`);
  };

  const removePhoto = (index: number) => {
    setPhotos((current) => {
      const target = current[index];
      if (target?.previewUrl) {
        URL.revokeObjectURL(target.previewUrl);
        objectUrlsRef.current.delete(target.previewUrl);
      }
      return current.filter((_, photoIndex) => photoIndex !== index);
    });
    setMessage(index === 0 ? "대표 사진을 삭제해 다음 사진이 대표 사진이 되었습니다." : "사진을 삭제했습니다.");
  };

  const makeRepresentative = (index: number) => {
    setPhotos((current) => moveItem(current, index, 0));
    setMessage("선택한 사진을 대표 사진으로 변경했습니다.");
  };

  const movePhoto = (index: number, direction: -1 | 1) => {
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= photos.length) return;
    setPhotos((current) => moveItem(current, index, nextIndex));
    setMessage("사진 순서를 변경했습니다.");
  };

  return (
    <section className="rounded-xl border border-border bg-white p-5 sm:p-7">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <h2 className="text-xl font-bold text-text-primary">사진 관리</h2>
          <p className="mt-2 text-sm leading-relaxed text-text-secondary">첫 번째 사진이 검색 목록과 상세 화면의 대표 사진으로 표시됩니다.</p>
        </div>
        <label className="shrink-0 cursor-pointer rounded-lg border border-brand/25 px-4 py-2.5 text-center text-sm font-bold text-brand hover:bg-brand/5">
          사진 추가
          <input type="file" multiple accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={(event) => addPhotos(event.target.files)} />
        </label>
      </div>

      {photos.length > 0 ? (
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-label="등록 사진 관리">
          {photos.map((photo, index) => (
            <article key={photo.id} className={`overflow-hidden rounded-xl border-2 bg-white ${index === 0 ? "border-brand" : "border-border"}`}>
              <div
                className={`relative aspect-[4/3] bg-cover bg-center ${photo.previewUrl ? "" : "bg-[linear-gradient(135deg,#eef5f0,#f8faf9)]"}`}
                style={photo.previewUrl ? { backgroundImage: `url(${photo.previewUrl})` } : undefined}
                role="img"
                aria-label={`${photo.label} 사진`}
              >
                {!photo.previewUrl && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center px-3 text-center text-brand/70">
                    <svg viewBox="0 0 48 48" className="h-12 w-12" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path d="M8 33V17a4 4 0 0 1 4-4h5l2-3h10l2 3h5a4 4 0 0 1 4 4v16a4 4 0 0 1-4 4H12a4 4 0 0 1-4-4Z"/><circle cx="24" cy="25" r="7"/></svg>
                    <span className="mt-2 text-sm font-bold">{photo.label}</span>
                    <span className="mt-1 text-[11px] text-text-muted">등록된 사진 예시</span>
                  </div>
                )}
                {index === 0 && <span className="absolute left-2 top-2 rounded bg-brand px-2 py-1 text-[11px] font-bold text-white">대표 사진</span>}
                <span className="absolute bottom-2 right-2 rounded-full bg-black/60 px-2 py-1 text-[11px] font-bold text-white">{index + 1}</span>
              </div>

              <div className="p-3">
                <p className="truncate text-xs text-text-muted" title={photo.label}>{photo.label}</p>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <button type="button" disabled={index === 0} onClick={() => movePhoto(index, -1)} className="rounded-md border border-border px-2 py-2 text-xs font-semibold text-text-secondary disabled:opacity-35">앞으로</button>
                  <button type="button" disabled={index === photos.length - 1} onClick={() => movePhoto(index, 1)} className="rounded-md border border-border px-2 py-2 text-xs font-semibold text-text-secondary disabled:opacity-35">뒤로</button>
                </div>
                {index !== 0 && <button type="button" onClick={() => makeRepresentative(index)} className="mt-2 w-full rounded-md bg-brand/10 px-2 py-2 text-xs font-bold text-brand">대표 사진으로 지정</button>}
                <button type="button" onClick={() => removePhoto(index)} className="mt-2 w-full px-2 py-1.5 text-xs font-semibold text-red-700 hover:underline">사진 삭제</button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="mt-5 rounded-xl border border-dashed border-border bg-surface-muted px-5 py-10 text-center text-sm text-text-secondary">등록된 사진이 없습니다. 장비 전체 사진부터 추가해 주세요.</div>
      )}

      <div className="mt-4 flex flex-col gap-2 rounded-lg bg-brand/5 p-3 text-xs leading-relaxed text-text-secondary sm:flex-row sm:items-center sm:justify-between">
        <span>JPG·PNG·WEBP, 장당 10MB 이하, 최대 {MAX_PHOTOS}장</span>
        <strong className="text-brand">현재 {photos.length}장</strong>
      </div>
      {message && <p role="status" className="mt-3 text-sm font-medium text-brand">{message}</p>}
    </section>
  );
}
