import AsyncStorage from "@react-native-async-storage/async-storage";

// Storage keys for persistence
export const USER_DATA_KEY = "@ergo_app_user_data";
export const USER_ROLE_KEY = "@ergo_app_user_role";

// Utility functions for debugging and testing persistence
export const debugPersistence = {
  // Check what's stored in AsyncStorage
  async checkStoredData() {
    try {
      const userData = await AsyncStorage.getItem(USER_DATA_KEY);
      const userRole = await AsyncStorage.getItem(USER_ROLE_KEY);

      console.log("=== Stored Auth Data ===");
      console.log("User Data:", userData ? JSON.parse(userData) : "None");
      console.log("User Role:", userRole || "None");
      console.log("======================");

      return {
        userData: userData ? JSON.parse(userData) : null,
        userRole: userRole || null,
      };
    } catch (error) {
      console.error("Error checking stored data:", error);
      return null;
    }
  },

  // Clear all stored auth data (useful for testing)
  async clearAllData() {
    try {
      await AsyncStorage.multiRemove([USER_DATA_KEY, USER_ROLE_KEY]);
      console.log("All auth data cleared from storage");
    } catch (error) {
      console.error("Error clearing stored data:", error);
    }
  },

  // Get all AsyncStorage keys (for debugging)
  async getAllKeys() {
    try {
      const keys = await AsyncStorage.getAllKeys();
      console.log("All AsyncStorage keys:", keys);
      return keys;
    } catch (error) {
      console.error("Error getting keys:", error);
      return [];
    }
  },

  // Check if user data is properly structured
  validateUserData(userData: any) {
    if (!userData) {
      console.log("❌ No user data found");
      return false;
    }

    console.log("=== User Data Validation ===");
    console.log(
      "Type:",
      userData.hasOwnProperty("discipline") ? "Athlete" : "Coach"
    );

    if (userData.hasOwnProperty("discipline")) {
      // Validate athlete data
      const requiredAthleteFields = [
        "id",
        "name",
        "email",
        "discipline",
        "category",
      ];
      const missingFields = requiredAthleteFields.filter(
        (field) => !userData[field]
      );

      if (missingFields.length > 0) {
        console.log("❌ Missing athlete fields:", missingFields);
        return false;
      }

      console.log("✅ Athlete data is valid");
      console.log("- Name:", userData.name);
      console.log("- Email:", userData.email);
      console.log("- Discipline:", userData.discipline);
      console.log("- Character:", userData.character);
    } else {
      // Validate coach data
      const requiredCoachFields = ["name", "email"];
      const missingFields = requiredCoachFields.filter(
        (field) => !userData[field]
      );

      if (missingFields.length > 0) {
        console.log("❌ Missing coach fields:", missingFields);
        return false;
      }

      console.log("✅ Coach data is valid");
      console.log("- Name:", userData.name);
      console.log("- Email:", userData.email);
      console.log("- Specialty:", userData.specialty);
    }

    console.log("===========================");
    return true;
  },

  // Test login data mapping
  async testDataMapping() {
    console.log("=== Testing Data Mapping ===");

    // Sample athlete database data
    const sampleAthleteDbData = {
      id: "123e4567-e89b-12d3-a456-426614174000",
      coach_id: "456e7890-e89b-12d3-a456-426614174001",
      name: "John Doe",
      birth_date: "1995-05-15",
      country: "USA",
      state: "California",
      gender: "M",
      height: "180",
      height_unit: "cm",
      weight: "75",
      weight_unit: "kg",
      discipline: "Football",
      category: "Professional",
      institution: "UCLA",
      comments: "Excellent athlete",
      email: "john.doe@example.com",
      character: "Roger",
    };

    // Sample coach database data
    const sampleCoachDbData = {
      id: "789e0123-e89b-12d3-a456-426614174002",
      email: "coach@example.com",
      first_name: "Jane",
      last_name: "Smith",
      info: "Experienced coach with 10 years of experience",
      specialty: "Strength Training",
    };

    console.log("Sample DB Athlete Data:", sampleAthleteDbData);
    console.log("Sample DB Coach Data:", sampleCoachDbData);
    console.log("============================");
  },

  // Test getAge function with different date formats
  testGetAge() {
    const { getAge } = require("./utils");

    console.log("=== Testing getAge Function ===");

    // Test with ISO string (your format)
    const isoDate = "2025-07-21T00:00:00.000Z";
    console.log(`ISO Date: ${isoDate}`);
    console.log(`Age: ${getAge(isoDate)} years`);

    // Test with Date object
    const dateObj = new Date("1995-05-15");
    console.log(`Date Object: ${dateObj.toISOString()}`);
    console.log(`Age: ${getAge(dateObj)} years`);

    // Test with different ISO formats
    const testDates = [
      "1990-12-25T10:30:00.000Z",
      "2000-01-01T00:00:00.000Z",
      "1985-06-15T23:59:59.999Z",
      "2030-01-01T00:00:00.000Z", // Future date (should return 0)
      "invalid-date", // Invalid date (should return 0)
    ];

    testDates.forEach((date) => {
      console.log(`Date: ${date} -> Age: ${getAge(date)} years`);
    });

    console.log("==============================");
  },
};
