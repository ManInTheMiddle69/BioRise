import { getData, saveData } from "../data/store.js";
import { supabase } from "../config/supabase.js";

export function bindLogout() {
  const button = document.querySelector("#logoutBtn");
  if (!button) return;

  button.onclick = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error("Supabase sign-out error:", error);
    } finally {
      const data = getData();
      data.currentUser = null;
      saveData(data);
      location.href = "../login.html";
    }
  };
}
