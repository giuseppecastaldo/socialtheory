'use client'

import Pusher from "pusher-js";
import { createContext, useContext } from "react";

const PusherContext = createContext<Pusher | null>(null);

export const PusherProvider = ({ children }: { children: React.ReactNode }) => {
    // Pusher.logToConsole = true;
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_APP_KEY || "", {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER || "",
      forceTLS: true,
      channelAuthorization: {
        endpoint: "/api/pusher/channel/auth",
        transport: "ajax"
      },
      userAuthentication: {
        endpoint: "/api/pusher/auth",
        transport: "ajax"
      },
    });
    pusher.signin()
  
    return (
      <PusherContext.Provider value={pusher}>
        {children}
      </PusherContext.Provider>
    );
  };

export function usePusher() {
  return useContext(PusherContext);
}
