import { useEffect, useState, useCallback, useRef } from "react";
import { setSensorHistoryData } from "../slices/historyDataSlice";
import { useAppDispatch, useAppSelector } from "./helper";

const rangeEndingAt = (end) => ({
  startTime: new Date(end.getTime() - 86400000).toISOString(), endTime: end.toISOString(),
});
export default function useSensorHistory() {
  const dispatch = useAppDispatch();
  const deviceId = useAppSelector(state => state.device.activeDevice)?.id;
  const [timeRange, setTimeRange] = useState(() => rangeEndingAt(new Date()));
  const rangeRef = useRef(timeRange);
  const [latestTimestamp, setLatestTimestamp] = useState(null);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [latestLoading, setLatestLoading] = useState(false);
  const [historyError, setHistoryError] = useState(null);
  const [latestError, setLatestError] = useState(null);
  const historyToken = useRef(0);
  const latestToken = useRef(0);
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const loadHistory = useCallback(async (range) => {
    const token = ++historyToken.current;
    if (!deviceId) return;
    setHistoryLoading(true); setHistoryError(null);
    dispatch(setSensorHistoryData([]));
    try {
      const query = new URLSearchParams({ ...range, deviceId, interval: "minute", timezone: "Asia/Jakarta" });
      const response = await fetch(`${baseUrl}/v1/weather-data?${query}`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const result = await response.json();
      if (result.status !== "success" || !Array.isArray(result.data?.data)) throw new Error(result.message || "Data tidak valid");
      if (token === historyToken.current) dispatch(setSensorHistoryData(result.data.data));
    } catch (error) {
      if (token === historyToken.current) setHistoryError(`Gagal memuat riwayat: ${error.message}`);
    } finally {
      if (token === historyToken.current) setHistoryLoading(false);
    }
  }, [deviceId, dispatch, baseUrl]);

  const loadLatest = useCallback(async (applyRange) => {
    const token = ++latestToken.current;
    if (!deviceId) return;
    setLatestLoading(true); setLatestError(null);
    try {
      const response = await fetch(`${baseUrl}/v1/weather-data/latest?deviceId=${encodeURIComponent(deviceId)}`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const result = await response.json();
      if (result.status && result.status !== "success") throw new Error(result.message || "Data tidak valid");
      const latest = result.data?.latest ?? null;
      if (latest && !Number.isFinite(new Date(latest).getTime())) throw new Error("Timestamp tidak valid");
      if (token !== latestToken.current) return;
      setLatestTimestamp(latest);
      if (applyRange) {
        const range = rangeEndingAt(latest ? new Date(latest) : new Date());
        rangeRef.current = range; setTimeRange(range); await loadHistory(range);
      }
    } catch (error) {
      if (token === latestToken.current) {
        setLatestError(`Gagal memuat waktu data terakhir: ${error.message}`);
        if (applyRange) await loadHistory(rangeRef.current);
      }
    } finally {
      if (token === latestToken.current) setLatestLoading(false);
    }
  }, [deviceId, baseUrl, loadHistory]);

  useEffect(() => {
    setLatestTimestamp(null); setHistoryError(null); setLatestError(null);
    setHistoryLoading(false); setLatestLoading(false);
    dispatch(setSensorHistoryData([]));
    loadLatest(true);
    return () => { ++latestToken.current; ++historyToken.current; };
  }, [loadLatest, dispatch]);

  const updateTimeRange = useCallback((startTime, endTime) => {
    if (!Number.isFinite(Date.parse(startTime)) || !Number.isFinite(Date.parse(endTime)) || Date.parse(startTime) >= Date.parse(endTime)) return;
    ++latestToken.current; setLatestLoading(false); setLatestError(null);
    const range = { startTime, endTime };
    rangeRef.current = range; setTimeRange(range); loadHistory(range);
  }, [loadHistory]);
  const resetToLatest = useCallback(() => {
    ++historyToken.current; setHistoryLoading(false);
    return loadLatest(true);
  }, [loadLatest]);
  const refresh = useCallback(() => {
    loadHistory(rangeRef.current);
    return loadLatest(false);
  }, [loadHistory, loadLatest]);
  return { timeRange, updateTimeRange, latestTimestamp, resetToLatest, refresh,
    historyLoading, latestLoading, historyError, latestError };
}
