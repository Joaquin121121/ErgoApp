import { createClient } from "@supabase/supabase-js";
import AsyncStorage from "@react-native-async-storage/async-storage";

const supabaseUrl = "https://txpdkefctuxefnitisqp.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR4cGRrZWZjdHV4ZWZuaXRpc3FwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ1OTMyMjYsImV4cCI6MjA2MDE2OTIyNn0._G_0hzRYcl7bbR-r3EAIZK54YmEco1DOE_Pi6butFKY";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
