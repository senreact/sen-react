import { createClient } from "@supabase/supabase-js";

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false } },
);

const users = [
  {
    email: "e2e-admin@senreact.test",
    password: "testtesttest",
    profile_type: "admin",
    display_name: "Admin de test (E2E)",
  },
  {
    email: "e2e-entrepreneur@senreact.test",
    password: "testtesttest",
    profile_type: "entrepreneur",
    display_name: "Aïssatou E2E",
    sector_slug: "digitalisation-technologie",
    region: "Dakar",
    summary: "Entrepreneure de test pour la validation Phase 6.",
  },
  {
    email: "e2e-org-pending@senreact.test",
    password: "testtesttest",
    profile_type: "organisation",
    display_name: "Contact ONG E2E",
    organisation_name: "ONG E2E Pending",
    sector_slug: "agroecologie",
    region: "Thiès",
    summary: "ONG de test (en attente).",
    phone: "+221 77 000 00 01",
  },
  {
    email: "e2e-org-verified@senreact.test",
    password: "testtesttest",
    profile_type: "organisation",
    display_name: "Contact ONG verified",
    organisation_name: "ONG E2E Verified",
    sector_slug: "energies-renouvelables",
    region: "Saint-Louis",
    summary: "ONG de test (déjà vérifiée).",
    phone: "+221 77 000 00 02",
  },
];

for (const u of users) {
  const list = await sb.auth.admin.listUsers({ page: 1, perPage: 200 });
  const existing = list.data.users.find((x) => x.email?.toLowerCase() === u.email.toLowerCase());
  if (existing) await sb.auth.admin.deleteUser(existing.id);
  const { data, error } = await sb.auth.admin.createUser({
    email: u.email,
    password: u.password,
    email_confirm: true,
  });
  if (error) {
    console.error("createUser", u.email, error);
    process.exit(1);
  }
  const userId = data.user.id;
  const profile = {
    user_id: userId,
    profile_type: u.profile_type,
    display_name: u.display_name,
    sector_slug: u.sector_slug ?? null,
    region: u.region ?? null,
    summary: u.summary ?? null,
    phone: u.phone ?? null,
    organisation_name: u.organisation_name ?? null,
  };
  if (u.profile_type === "admin" || u.profile_type === "entrepreneur") {
    profile.verification_status = "auto_verified";
    profile.verified_at = new Date().toISOString();
  } else if (u.email.includes("verified")) {
    profile.verification_status = "verified";
    profile.verified_at = new Date().toISOString();
  }
  const { error: pErr } = await sb.from("user_profiles").insert(profile);
  if (pErr) {
    console.error("insert profile", u.email, pErr);
    process.exit(1);
  }
  console.log(
    "OK",
    u.email,
    "→",
    u.profile_type,
    "status:",
    profile.verification_status ?? "pending",
  );
}
