"use client";

import { BlackCover, Sidebar } from "@/components/shared";
import { SocketContextProvider } from "@/context/";
import { Session } from "@/lib/store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useRecoilValue } from "recoil";

type Props = { children: React.ReactNode };

export default function AppLayout({ children }: Props) {
  const session = useRecoilValue(Session);
  const router = useRouter();

  useEffect(() => {
    if (session?.status === "loading") return;
    else if (session?.status === "unauthenticated")
      router.push("/auth/sign-in");

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.status]);

  return (
    <SocketContextProvider>
      <BlackCover />
      <div className="h-full min-h-screen grid-cols-[auto,1fr] grid-rows-1 lg:grid">
        <Sidebar />
        {children}
      </div>
    </SocketContextProvider>
  );
}
