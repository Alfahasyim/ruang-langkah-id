"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import { SocialIcon } from "@/components/ui/SocialIcon";
import { SOCIAL_PLATFORMS, type SocialLink } from "@/lib/social";

type Row = { key: string; platform: string; label: string; url: string };

let counter = 0;
const nextKey = () => `row-${counter++}`;

/**
 * Baris dinamis; nilainya dikirim sebagai JSON lewat satu input tersembunyi.
 * Server tetap memvalidasi ulang setiap baris — lihat parseSocialLinks().
 */
export function SocialLinksEditor({
  name,
  initial,
  title = "Tautan sosial media",
  description,
}: {
  name: string;
  initial: SocialLink[];
  title?: string;
  description?: string;
}) {
  const [rows, setRows] = useState<Row[]>(() =>
    initial.map((link) => ({
      key: nextKey(),
      platform: link.platform,
      label: link.label ?? "",
      url: link.url,
    })),
  );

  function update(key: string, patch: Partial<Row>) {
    setRows((current) =>
      current.map((row) => (row.key === key ? { ...row, ...patch } : row)),
    );
  }

  const payload = rows
    .filter((row) => row.url.trim() !== "")
    .map((row) => ({ platform: row.platform, label: row.label, url: row.url }));

  return (
    <div>
      <input type="hidden" name={name} value={JSON.stringify(payload)} />

      <div className="mb-3">
        <p className="text-sm font-semibold text-forest-950">{title}</p>
        {description && (
          <p className="mt-1 text-xs leading-relaxed text-granite-500">
            {description}
          </p>
        )}
      </div>

      {rows.length === 0 ? (
        <p className="rounded-xl border border-dashed border-sand-300 px-4 py-5 text-center text-sm text-granite-500">
          Belum ada tautan.
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {rows.map((row) => {
            const platform = SOCIAL_PLATFORMS.find(
              (option) => option.value === row.platform,
            );

            return (
              <li
                key={row.key}
                className="rounded-xl border border-sand-300 bg-white p-3"
              >
                <div className="flex items-center gap-2">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-sand-100 text-forest-800">
                    <SocialIcon platform={row.platform} className="h-4 w-4" />
                  </span>

                  <label className="sr-only" htmlFor={`platform-${row.key}`}>
                    Platform
                  </label>
                  <select
                    id={`platform-${row.key}`}
                    value={row.platform}
                    onChange={(event) =>
                      update(row.key, { platform: event.target.value })
                    }
                    className="min-w-0 flex-1 rounded-lg border border-sand-300 bg-white px-2.5 py-1.5 text-sm text-forest-900"
                  >
                    {SOCIAL_PLATFORMS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>

                  <button
                    type="button"
                    onClick={() =>
                      setRows((current) =>
                        current.filter((entry) => entry.key !== row.key),
                      )
                    }
                    aria-label="Hapus tautan ini"
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-terracotta-700 transition-colors hover:bg-terracotta-50"
                  >
                    <X className="h-4 w-4" aria-hidden />
                  </button>
                </div>

                {row.platform === "lainnya" && (
                  <>
                    <label className="sr-only" htmlFor={`label-${row.key}`}>
                      Nama tautan
                    </label>
                    <input
                      id={`label-${row.key}`}
                      value={row.label}
                      onChange={(event) =>
                        update(row.key, { label: event.target.value })
                      }
                      placeholder="Nama tautan, mis. Blog"
                      className="mt-2 w-full rounded-lg border border-sand-300 bg-white px-3 py-2 text-sm"
                    />
                  </>
                )}

                <label className="sr-only" htmlFor={`url-${row.key}`}>
                  Alamat tautan
                </label>
                <input
                  id={`url-${row.key}`}
                  value={row.url}
                  onChange={(event) => update(row.key, { url: event.target.value })}
                  placeholder={platform?.placeholder ?? "https://…"}
                  className="mt-2 w-full rounded-lg border border-sand-300 bg-white px-3 py-2 text-sm"
                />
              </li>
            );
          })}
        </ul>
      )}

      <button
        type="button"
        onClick={() =>
          setRows((current) => [
            ...current,
            { key: nextKey(), platform: "instagram", label: "", url: "" },
          ])
        }
        className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-sand-300 px-3 py-2 text-sm font-semibold text-forest-700 transition-colors hover:bg-forest-50"
      >
        <Plus className="h-4 w-4" aria-hidden />
        Tambah tautan
      </button>
    </div>
  );
}
