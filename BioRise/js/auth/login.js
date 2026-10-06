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
    errorBox.textContent = "Please enter your login and passcode.";
    return;
  }

  try {
    const isWorkerCode = /^WRK\d+$/i.test(login);
    const email = isWorkerCode
      ? `${login.toLowerCase()}@biorise.example.com`
      : login;

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error || !data.user) {
      errorBox.textContent = "Incorrect login or passcode.";
      if (error) console.error("Supabase login error:", error);
      return;
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role, active, worker_id")
      .eq("id", data.user.id)
      .single();

    if (profileError || !profile) {
      await supabase.auth.signOut();
      errorBox.textContent = "Your BioRise profile could not be found.";
      return;
    }
    if (!profile.active) {
      await supabase.auth.signOut();
      errorBox.textContent = "This BioRise account has been disabled.";
      return;
    }

    const store = getData();

    // During the migration, mirror the authenticated worker into the old
    // local data shape so the existing worker dashboard can render.
    if (profile.role === "worker" && profile.worker_id) {
      const { data: worker } = await supabase
        .from("workers")
        .select("id, worker_code, full_name, phone, job_title, salary, hired_date, national_id, notes, points, active")
        .eq("id", profile.worker_id)
        .single();

      if (worker) {
        const localWorker = {
          id: worker.id,
          code: worker.worker_code,
          name: worker.full_name,
          photo: "",
          phone: worker.phone || "",
          job: worker.job_title || "Farm Worker",
          salary: Number(worker.salary || 0),
          hired: worker.hired_date || "",
          nationalId: worker.national_id || "",
          notes: worker.notes || "",
          active: worker.active !== false,
          points: Number(worker.points || 0)
        };
        const idx = store.workers.findIndex(w => w.id === worker.id || w.code === worker.worker_code);
        if (idx >= 0) store.workers[idx] = localWorker;
        else store.workers.push(localWorker);
      }
    }

    store.currentUser = {
      id: profile.role === "admin" ? "ADMIN001" : (isWorkerCode ? login.toUpperCase() : login),
      role: profile.role,
      workerId: profile.worker_id || null,
      authUserId: data.user.id,
      loginAt: Date.now()
    };
    saveData(store);

    if (profile.role === "admin" || profile.role === "supervisor") {
      window.location.href = "admin/dashboard.html";
      return;
    }
    if (profile.role === "worker") {
      window.location.href = "worker/dashboard.html";
      return;
    }

    await supabase.auth.signOut();
    errorBox.textContent = "This account does not have a valid BioRise role.";
  } catch (error) {
    console.error("BioRise login error:", error);
    errorBox.textContent = "Unable to connect to BioRise. Please try again.";
  }
});
