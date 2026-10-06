import "../shared/theme.js";
import { bindTheme } from "../shared/theme.js";
import { supabase } from "../config/supabase.js";

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
    errorBox.textContent = "Please enter your email and password.";
    return;
  }

  try {
    // For our first Supabase test, the admin enters their real email.
    const { data, error } = await supabase.auth.signInWithPassword({
      email: login,
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

    // Send the user to the correct dashboard.
    if (profile.role === "admin") {
      window.location.href = "admin/dashboard.html";
      return;
    }

    if (profile.role === "worker") {
      window.location.href = "worker/dashboard.html";
      return;
    }

    if (profile.role === "supervisor") {
      // Supervisor UI comes later.
      window.location.href = "admin/dashboard.html";
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