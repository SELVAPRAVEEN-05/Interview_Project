"use client";

import React, {
  useCallback,
  useMemo,
  useState,
  useEffect,
  useRef,
} from "react";
import { decodePassphrase } from "@/lib/client-utils";
import { DebugMode } from "@/lib/Debug";
import { KeyboardShortcuts } from "@/lib/KeyboardShortcuts";
import { RecordingIndicator } from "@/lib/RecordingIndicator";
import { SettingsMenu } from "@/lib/SettingsMenu";
import { ConnectionDetails } from "@/lib/types";
import {
  formatChatMessageLinks,
  LocalUserChoices,
  PreJoin,
  RoomContext,
  VideoConference,
} from "@livekit/components-react";
import {
  ExternalE2EEKeyProvider,
  RoomOptions,
  VideoCodec,
  VideoPresets,
  Room,
  DeviceUnsupportedError,
  RoomConnectOptions,
  RoomEvent,
} from "livekit-client";
import { useRouter } from "next/navigation";
import { useSetupE2EE } from "@/lib/useSetupE2EE";
import { CollaborativeEditor } from "@/component/editor";
import { Room2 } from "@/app/Room";

const CONN_DETAILS_ENDPOINT =
  process.env.NEXT_PUBLIC_CONN_DETAILS_ENDPOINT ?? "/api/connection-details";
const SHOW_SETTINGS_MENU =
  process.env.NEXT_PUBLIC_SHOW_SETTINGS_MENU === "true";

// Resizable Split Panel Component
const ResizableSplitPanel: React.FC<{
  leftPanel: React.ReactNode;
  rightPanel: React.ReactNode;
  initialLeftWidth?: number;
  minLeftWidth?: number;
  minRightWidth?: number;
}> = ({
  leftPanel,
  rightPanel,
  initialLeftWidth = 66.67, // 2/3 in percentage
  minLeftWidth = 20,
  minRightWidth = 20,
}) => {
  const [leftWidth, setLeftWidth] = useState(initialLeftWidth);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging || !containerRef.current) return;

      const container = containerRef.current;
      const containerRect = container.getBoundingClientRect();
      const newLeftWidth =
        ((e.clientX - containerRect.left) / containerRect.width) * 100;

      // Enforce minimum widths
      const clampedWidth = Math.max(
        minLeftWidth,
        Math.min(100 - minRightWidth, newLeftWidth)
      );

      setLeftWidth(clampedWidth);
    },
    [isDragging, minLeftWidth, minRightWidth]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";

      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  return (
    <div ref={containerRef} className="flex w-full h-full">
      <div
        className="flex-shrink-0 overflow-hidden"
        style={{ width: `${leftWidth}%` }}
      >
        {leftPanel}
      </div>

      <div
        className="w-2 bg-gray-300 hover:bg-gray-400 cursor-col-resize flex-shrink-0 transition-colors duration-150"
        onMouseDown={handleMouseDown}
        style={{ backgroundColor: isDragging ? "#9ca3af" : undefined }}
      >
        <div className="w-full h-full flex items-center justify-center">
          <div className="w-1 h-12 bg-gray-500 rounded-full opacity-60" />
        </div>
      </div>

      <div className="flex-1 overflow-hidden">{rightPanel}</div>
    </div>
  );
};

// Custom hook for connection details
const useConnectionDetails = (roomName: string, region?: string) => {
  const [connectionDetails, setConnectionDetails] = useState<
    ConnectionDetails | undefined
  >();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchConnectionDetails = useCallback(
    async (participantName: string) => {
      setIsLoading(true);
      setError(null);

      try {
        const url = new URL(CONN_DETAILS_ENDPOINT, window.location.origin);
        url.searchParams.append("roomName", roomName);
        url.searchParams.append("participantName", participantName);
        if (region) {
          url.searchParams.append("region", region);
        }

        const response = await fetch(url.toString());
        if (!response.ok) {
          throw new Error(
            `Failed to fetch connection details: ${response.statusText}`
          );
        }

        const data = await response.json();
        setConnectionDetails(data);
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("Unknown error occurred")
        );
        console.error("Connection details fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    },
    [roomName, region]
  );

  return { connectionDetails, isLoading, error, fetchConnectionDetails };
};

// Main component
export function PageClientImpl(props: {
  roomName: string;
  region?: string;
  hq: boolean;
  codec: VideoCodec;
}) {
  const [preJoinChoices, setPreJoinChoices] = useState<
    LocalUserChoices | undefined
  >();
  const { connectionDetails, isLoading, error, fetchConnectionDetails } =
    useConnectionDetails(props.roomName, props.region);

  const preJoinDefaults = useMemo(
    () => ({
      username: "",
      videoEnabled: true,
      audioEnabled: true,
    }),
    []
  );

  const handlePreJoinSubmit = useCallback(
    async (values: LocalUserChoices) => {
      setPreJoinChoices(values);
      await fetchConnectionDetails(values.username);
    },
    [fetchConnectionDetails]
  );

  const handlePreJoinError = useCallback((e: Error) => {
    console.error("PreJoin error:", e);
  }, []);

  if (error) {
    return (
      <main
        data-lk-theme="default"
        className="h-full flex p-0 items-center justify-center"
      >
        <div className="text-center p-8">
          <h2 className="text-xl font-semibold text-red-600 mb-2">
            Connection Error
          </h2>
          <p className="text-gray-600">{error.message}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </main>
    );
  }

  return (
    <main data-lk-theme="default" className="h-full">
      {!connectionDetails || !preJoinChoices ? (
        <div className="h-full flex items-center justify-center">
          {isLoading ? (
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2  border-blue-500 mx-auto mb-4"></div>
              <p className="text-blue-900">Connecting...</p>
            </div>
          ) : (
            <PreJoin
              defaults={preJoinDefaults}
              onSubmit={handlePreJoinSubmit}
              onError={handlePreJoinError}
            />
          )}
        </div>
      ) : (
        <ResizableSplitPanel
          leftPanel={
            <div className="h-full w-full overflow-scroll scrollbar-hide bg-white">
              <div className="h-full flex flex-col">
                <div className="flex-shrink-0 px-4 py-2 bg-gray-50 border-b border-gray-200">
                  <h2 className="text-sm font-medium text-gray-700">
                    Collaborative Editor
                  </h2>
                </div>
                <div className="flex-1 overflow-scroll scrollbar-hide">
                  <Room2>
                    <CollaborativeEditor />
                  </Room2>
                </div>
              </div>
            </div>
          }
          rightPanel={
            <div className="h-full w-full overflow-hidden bg-gray-900">
              <div className="h-full flex flex-col">
                <div className="flex-shrink-0 px-4 py-2 bg-gray-800 border-b border-gray-700">
                  <h2 className="text-sm font-medium text-gray-200">
                    Video Conference
                  </h2>
                </div>
                <div className="flex-1 overflow-hidden">
                  <VideoConferenceComponent
                    connectionDetails={connectionDetails}
                    userChoices={preJoinChoices}
                    options={{ codec: props.codec, hq: props.hq }}
                  />
                </div>
              </div>
            </div>
          }
          initialLeftWidth={60}
          minLeftWidth={35}
          minRightWidth={30}
        />
      )}
    </main>
  );
}

// Optimized VideoConference component with memoization
const VideoConferenceComponent = React.memo<{
  userChoices: LocalUserChoices;
  connectionDetails: ConnectionDetails;
  options: {
    hq: boolean;
    codec: VideoCodec;
  };
}>(({ userChoices, connectionDetails, options }) => {
  const router = useRouter();
  const { worker, e2eePassphrase } = useSetupE2EE();
  const [e2eeSetupComplete, setE2eeSetupComplete] = useState(false);

  const keyProvider = useMemo(() => new ExternalE2EEKeyProvider(), []);
  const e2eeEnabled = useMemo(
    () => !!(e2eePassphrase && worker),
    [e2eePassphrase, worker]
  );

  const roomOptions = useMemo((): RoomOptions => {
    let videoCodec: VideoCodec | undefined = options.codec || "vp9";

    // Disable certain codecs for E2EE
    if (e2eeEnabled && (videoCodec === "av1" || videoCodec === "vp9")) {
      videoCodec = undefined;
    }

    return {
      videoCaptureDefaults: {
        deviceId: userChoices.videoDeviceId ?? undefined,
        resolution: options.hq ? VideoPresets.h2160 : VideoPresets.h720,
      },
      publishDefaults: {
        dtx: false,
        videoSimulcastLayers: options.hq
          ? [VideoPresets.h1080, VideoPresets.h720]
          : [VideoPresets.h540, VideoPresets.h216],
        red: !e2eeEnabled,
        videoCodec,
      },
      audioCaptureDefaults: {
        deviceId: userChoices.audioDeviceId ?? undefined,
      },
      adaptiveStream: { pixelDensity: "screen" },
      dynacast: true,
      e2ee:
        keyProvider && worker && e2eeEnabled
          ? { keyProvider, worker }
          : undefined,
    };
  }, [userChoices, options, e2eeEnabled, keyProvider, worker]);

  const room = useMemo(() => new Room(roomOptions), [roomOptions]);

  const connectOptions = useMemo(
    (): RoomConnectOptions => ({
      autoSubscribe: true,
    }),
    []
  );

  // Event handlers
  const handleOnLeave = useCallback(() => {
    router.push("/");
  }, [router]);

  const handleError = useCallback((error: Error) => {
    console.error("Room error:", error);
    alert(`Unexpected error: ${error.message}`);
  }, []);

  const handleEncryptionError = useCallback((error: Error) => {
    console.error("Encryption error:", error);
    alert(`Encryption error: ${error.message}`);
  }, []);

  // E2EE setup
  useEffect(() => {
    if (!e2eeEnabled) {
      setE2eeSetupComplete(true);
      return;
    }

    keyProvider
      .setKey(decodePassphrase(e2eePassphrase))
      .then(() => room.setE2EEEnabled(true))
      .then(() => setE2eeSetupComplete(true))
      .catch((error) => {
        if (error instanceof DeviceUnsupportedError) {
          alert(
            "Your browser does not support encrypted meetings. Please update to the latest version."
          );
        }
        handleError(error);
      });
  }, [e2eeEnabled, room, e2eePassphrase, keyProvider, handleError]);

  // Room connection and cleanup
  useEffect(() => {
    if (!e2eeSetupComplete) return;

    const cleanup = () => {
      room.off(RoomEvent.Disconnected, handleOnLeave);
      room.off(RoomEvent.EncryptionError, handleEncryptionError);
      room.off(RoomEvent.MediaDevicesError, handleError);
    };

    // Add event listeners
    room.on(RoomEvent.Disconnected, handleOnLeave);
    room.on(RoomEvent.EncryptionError, handleEncryptionError);
    room.on(RoomEvent.MediaDevicesError, handleError);

    // Connect to room
    room
      .connect(
        connectionDetails.serverUrl,
        connectionDetails.participantToken,
        connectOptions
      )
      .then(() => {
        // Enable devices based on user choices
        const promises = [];
        if (userChoices.videoEnabled) {
          promises.push(room.localParticipant.setCameraEnabled(true));
        }
        if (userChoices.audioEnabled) {
          promises.push(room.localParticipant.setMicrophoneEnabled(true));
        }
        return Promise.all(promises);
      })
      .catch(handleError);

    return cleanup;
  }, [
    e2eeSetupComplete,
    room,
    connectionDetails,
    connectOptions,
    userChoices,
    handleOnLeave,
    handleEncryptionError,
    handleError,
  ]);

  return (
    <div className="lk-room-container h-full w-full overflow-hidden">
      <RoomContext.Provider value={room}>
        <div className="h-full flex flex-col">
          <KeyboardShortcuts />
          <div className="flex-1 overflow-hidden">
            <VideoConference
              chatMessageFormatter={formatChatMessageLinks}
              SettingsComponent={SHOW_SETTINGS_MENU ? SettingsMenu : undefined}
            />
          </div>
          <DebugMode />
          <RecordingIndicator />
        </div>
      </RoomContext.Provider>
    </div>
  );
});

VideoConferenceComponent.displayName = "VideoConferenceComponent";
