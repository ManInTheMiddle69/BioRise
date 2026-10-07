import "../shared/theme.js";
import { bindTheme } from "../shared/theme.js";
import { supabase } from "../config/supabase.js";
import { getData, saveData } from "../data/store.js";

const form = document.querySelector("#loginForm");
const errorBox = document.querySelector("#loginError");
const loginInput = document.querySelector("#workerId");
const passwordInput = document.querySelector("#passcode");

bindTheme();

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  errorBox.textContent = "";

  const login = loginInput.value.trim();
  const password = passwordInput.value;

  if (!login || !password) {
    errorBox.textContent = "Please enter your BioRise ID/email and passcode.";
    return;
  }

  // Workers only type WRK001. BioRise converts it to the hidden internal
  // Supabase email used when the worker account was created.
  const normalizedLogin = login.toUpperCase();
  const isWorkerId = /^WRK[0-9]+$/.test(normalizedLogin);
  const authEmail = isWorkerId
    ? `${normalizedLogin.toLowerCase()}@biorise.example.com`
    : login;

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: authEmail,
      password
    });

    if (error) {
      errorBox.textContent = "Incorrect email or password.";
      console.error("Supabase login error:", error);
      return;
    }

    if (!data.user) {
      errorBox.textContent = "Unable to sign in.";
      return;
    }

    // Read the BioRise role connected to this Supabase account.
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role, active, worker_id")
      .eq("id", data.user.id)
      .single();

    if (profileError || !profile) {
      console.error("Profile error:", profileError);

      await supabase.auth.signOut();

      errorBox.textContent =
        "Your BioRise profile could not be found.";

      return;
    }

    if (!profile.active) {
      await supabase.auth.signOut();

      errorBox.textContent =
        "This BioRise account has been disabled.";

      return;
    }

    // Temporary compatibility bridge while the rest of BioRise is migrated
    // from localStorage to Supabase. The old dashboard guard still reads
    // currentUser from the local BioRise store, so mirror the VERIFIED
    // Supabase role here. This is not used as the source of authentication.
    const store = getData();
    store.currentUser = {
      id: profile.role === "admin" ? "ADMIN001" : (isWorkerId ? normalizedLogin : (login.split("@")[0] || "USER")),
      role: profile.role,
      workerId: profile.worker_id || null,
      authUserId: data.user.id,
      loginAt: Date.now()
    };
    saveData(store);

    // Send the user to the correct dashboard.
    if (profile.role === "admin" || profile.role === "supervisor") {
      window.location.href = "admin/dashboard.html";
      return;
    }

    if (profile.role === "worker") {
      window.location.href = "worker/dashboard.html";
      return;
    }

    await supabase.auth.signOut();

    errorBox.textContent =
      "This account does not have a valid BioRise role.";

  } catch (error) {
    console.error("BioRise login error:", error);

    errorBox.textContent =
      "Unable to connect to BioRise. Please try again.";
  }
});