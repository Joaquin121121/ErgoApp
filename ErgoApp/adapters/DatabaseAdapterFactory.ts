import { DatabaseAdapter } from "./DatabaseAdapter";
import { ExpoAdapter } from "./ExpoAdapter";

export type Platform = "expo";

export function createDatabaseAdapter(platform?: Platform): DatabaseAdapter {
  // Auto-detect platform if not provided
  if (!platform) {
    platform = detectPlatform();
  }

  switch (platform) {
    case "expo":
      return new ExpoAdapter();
    default:
      throw new Error(`Unsupported platform: ${platform}`);
  }
}

function detectPlatform(): Platform {
  // Check if we're in an Expo environment
  if (typeof window !== "undefined" && (window as any).expo) {
    return "expo";
  }

  // Check for React Native environment (which Expo runs on)
  if (typeof navigator !== "undefined" && navigator.product === "ReactNative") {
    return "expo";
  }

  // Default to Expo for React Native environments
  return "expo";
}

// Convenience function to get database instance
export async function getDatabaseInstance(
  dbPath: string = "sqlite:ergolab.db",
  platform?: Platform
) {
  const adapter = createDatabaseAdapter(platform);
  return await adapter.load(dbPath);
}
