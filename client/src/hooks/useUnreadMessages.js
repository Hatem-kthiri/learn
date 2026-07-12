import { useEffect, useState } from "react";
import axios from "axios";
import { url } from "../utils";

const POLL_INTERVAL_MS = 15000;

// Returns the total unread message count for a user, refreshed on an
// interval. Used by the header nav badge, which needs to work on every
// page (not just the chat page, which owns the live socket connection).
export function useUnreadMessages(userId) {
  const [unreadTotal, setUnreadTotal] = useState(0);

  useEffect(() => {
    if (!userId) return;
    let cancelled = false;

    const fetchCount = () => {
      axios
        .get(`${url}/api/v1/message/unread/${userId}`)
        .then((r) => {
          if (!cancelled) setUnreadTotal(r.data.total || 0);
        })
        .catch(() => {});
    };

    fetchCount();
    const interval = setInterval(fetchCount, POLL_INTERVAL_MS);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [userId]);

  return unreadTotal;
}
