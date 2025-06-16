"use client";

import { ReactNode, useMemo, Suspense } from "react";
import { RoomProvider } from "@liveblocks/react/suspense";
import { useSearchParams } from "next/navigation";
import { ClientSideSuspense } from "@liveblocks/react";

// Create a separate component that uses useSearchParams
function RoomContent({ children }: { children: ReactNode }) {
    const roomId = useExampleRoomId("liveblocks:examples:nextjs-yjs-monaco");
    console.log("Room ID:", roomId);

    return (
        <RoomProvider
            id={roomId}
            initialPresence={{
                cursor: null,
            }}
        >
            <ClientSideSuspense fallback={<div>Loading</div>}>{children}</ClientSideSuspense>
        </RoomProvider>
    );
}

// Main component with Suspense boundary
export function Room({ children }: { children: ReactNode }) {
    return (
        <Suspense fallback={<div>Loading room data...</div>}>
            <RoomContent>{children}</RoomContent>
        </Suspense>
    );
}
export function Room2({ children }: { children: ReactNode }) {
    return (
        <Suspense fallback={<div>Loading room data...</div>}>
            <RoomContent>{children}</RoomContent>
        </Suspense>
    );
}

/**
 * This function is used when deploying an example on liveblocks.io.
 * You can ignore it completely if you run the example locally.
 */
function useExampleRoomId(roomId: string) {
    const params = useSearchParams();
    const exampleId = params?.get("exampleId");

    const exampleRoomId = useMemo(() => {
        return exampleId ? `${roomId}-${exampleId}` : roomId;
    }, [roomId, exampleId]);

    return exampleRoomId;
}