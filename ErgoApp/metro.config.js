const { getDefaultConfig } = require("@expo/metro-config");

const defaultConfig = getDefaultConfig(__dirname);
defaultConfig.resolver.sourceExts.push("cjs");

// Ensure proper resolution for victory-native
defaultConfig.resolver.platforms = ["ios", "android", "native", "web"];

module.exports = defaultConfig;
