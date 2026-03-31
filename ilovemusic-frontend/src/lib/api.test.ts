import { afterEach, describe, expect, it, vi } from "vitest";
import { verifySpotifyStatusEndpoint } from "@/lib/api";

describe("verifySpotifyStatusEndpoint", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns exists=true with parsed data when endpoint responds 200", async () => {
    const mockPayload = {
      success: true,
      data: {
        spotify_connected: true,
        spotify_id: "user123",
        username: "sai",
        timestamp: 1774895951000,
      },
    };

    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      status: 200,
      json: vi.fn().mockResolvedValue(mockPayload),
    } as unknown as Response);

    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    const result = await verifySpotifyStatusEndpoint("token");

    expect(result).toEqual({
      exists: true,
      connected: true,
      data: mockPayload.data,
    });
    expect(logSpy).toHaveBeenCalledWith("✅ Endpoint verified - Connected: true, User: sai");
  });

  it("returns exists=false when endpoint responds 404", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      status: 404,
      json: vi.fn(),
    } as unknown as Response);

    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    const result = await verifySpotifyStatusEndpoint("token");

    expect(result).toEqual({
      exists: false,
      error: "Endpoint returned 404 Not Found",
    });
    expect(logSpy).toHaveBeenCalledWith("❌ Endpoint not found");
  });

  it("returns exists=false on network errors", async () => {
    vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("Failed to fetch"));

    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    const result = await verifySpotifyStatusEndpoint("token");

    expect(result).toEqual({
      exists: false,
      error: "Failed to fetch",
    });
    expect(logSpy).toHaveBeenCalledWith("❌ Endpoint not found");
  });
});

