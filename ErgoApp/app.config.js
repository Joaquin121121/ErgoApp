export default {
  expo: {
    name: "ErgoApp",
    slug: "ErgoApp",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "myapp",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    splash: {
      image: "./assets/icons/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.ergolab.ergoapp",
      googleServicesFile: process.env.GOOGLE_SERVICES_INFOPLIST,
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      package: "com.ergolab.ergoapp",
      googleServicesFile: process.env.GOOGLE_SERVICES_JSON,
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/favicon.png",
    },
    plugins: [
      "expo-font",
      "expo-router",
      "@react-native-google-signin/google-signin",
      [
        "expo-image-picker",
        {
          photosPermission:
            "The app accesses your photos to let you share them.",
        },
      ],
    ],
    experiments: {
      typedRoutes: true,
    },
    extra: {
      eas: {
        projectId: "9665c70c-2683-4b8b-a2c9-417f0e3d975a",
        supabaseUrl: "https://txpdkefctuxefnitisqp.supabase.co",
        supabaseAnonKey:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR4cGRrZWZjdHV4ZWZuaXRpc3FwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ1OTMyMjYsImV4cCI6MjA2MDE2OTIyNn0._G_0hzRYcl7bbR-r3EAIZK54YmEco1DOE_Pi6butFKY",
      },
    },
  },
};
