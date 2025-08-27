// hooks/useWarningData.ts
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  setWarnings,
  setLoading,
  setError,
  setPagination,
} from "../slices/warningSlice";

/**
 * Fetch warnings with server-side pagination.
 * @param dispatch Redux dispatch
 * @param params { page?: number; limit?: number; type?: string; sort?: string; signal?: AbortSignal }
 */
export async function fetchWarningData(dispatch, params = {}) {
  const { page = 1, limit = 10, type, sort, signal } = params;

  dispatch(setLoading("pending"));
  dispatch(setError(null));

  try {
    const baseUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/warnings`;
    const q = new URLSearchParams();
    q.set("page", String(page));
    q.set("limit", String(limit));
    if (type) q.set("type", type);
    if (sort) q.set("sort", sort);

    const response = await fetch(`${baseUrl}?${q.toString()}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      signal,
    });

    // Try to read JSON even on !ok to surface backend message
    const body = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(body?.message || "Failed to fetch warnings");
    }

    // Normalize data + meta from common API shapes
    const data = body?.data || body || {};
    const list = data?.warnings ?? data?.items ?? data?.results ?? []; // tolerate different keys

    const meta = data?.pagination ||
      data?.meta || {
        page: data?.page ?? Number(q.get("page")) ?? 1,
        limit: data?.limit ?? Number(q.get("limit")) ?? 10,
        total: data?.total ?? body?.total ?? 0,
        totalPages:
          data?.totalPages ??
          data?.pages ??
          (data?.total && (data?.limit || Number(q.get("limit")))
            ? Math.max(
                1,
                Math.ceil(
                  Number(data.total) / Number(data.limit || q.get("limit"))
                )
              )
            : 1),
      };

    dispatch(setWarnings(Array.isArray(list) ? list : []));
    dispatch(
      setPagination({
        page: Number(meta.page) || 1,
        limit: Number(meta.limit) || limit,
        total: Number(meta.total) || 0,
        totalPages: Number(meta.totalPages) || 1,
      })
    );
    dispatch(setLoading("succeeded"));
  } catch (error) {
    // Ignore abort errors
    if (error?.name === "AbortError") return;
    dispatch(
      setError(
        error?.message || "An unknown error occurred while fetching warnings."
      )
    );
    dispatch(setLoading("failed"));
    console.error("Error in fetchWarningData:", error);
  }
}

/**
 * Hook to fetch warnings when pagination/filter params change.
 * @example useWarningData({ page, limit, type, sort })
 */
export default function useWarningData(params = {}) {
  const dispatch = useDispatch();

  useEffect(() => {
    const controller = new AbortController();
    fetchWarningData(dispatch, { ...params, signal: controller.signal });
    return () => controller.abort();
    // List params explicitly so reruns happen correctly
  }, [dispatch, params.page, params.limit, params.type, params.sort]);
}
