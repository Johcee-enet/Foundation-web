"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

type ISession = {
  session: { userId: string | null } | null;
};

const SessionContext = createContext<ISession | null>(null);

interface SessionProps {
  children: ReactNode;
}
export default function SessionProvider({ children }: SessionProps) {
  const [session, setSession] = useState<{ userId: string | null } | null>(
    null,
  );
  useEffect(() => {
    const _session = sessionStorage.getItem("fd-session");
    if (_session) {
      setSession(JSON.parse(_session));
    }
  }, []);

  return (
    <SessionContext.Provider value={{ session }}>
      {children}
    </SessionContext.Provider>
  );
}

const useSession = () => useContext(SessionContext);

export { useSession };
