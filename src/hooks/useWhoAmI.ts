import { useState, useEffect } from 'react';

const STORAGE_KEY = 'mail-board:who-am-i';

export interface WhoAmI {
  email: string;
  name: string;
}

export function useWhoAmI() {
  const [me, setMe] = useState<WhoAmI | null>(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as WhoAmI) : null;
  });

  useEffect(() => {
    if (me) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(me));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [me]);

  return { me, setMe };
}
