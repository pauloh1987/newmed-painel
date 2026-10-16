#!/usr/bin/env node
// Cria (ou promove) um usuário administrador do painel.
//
//   npm run create-admin -- email@empresa.com.br
//
// A senha é pedida no terminal (não aparece na tela). Para uso automatizado, defina ADMIN_PASSWORD.
// Se o e-mail já existir no Supabase Auth, o usuário só é promovido a administrador (a senha NÃO é alterada).
//
// Precisa de NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY no .env.local.
// A chave service_role ignora todas as regras de segurança: use só aqui, nunca no site.

import { createClient } from "@supabase/supabase-js";

try {
  process.loadEnvFile(".env.local");
} catch {
  // sem .env.local: usa as variáveis do ambiente
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !serviceKey) {
  console.error("Defina NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY no arquivo .env.local (veja .env.example).");
  process.exit(1);
}

const email = (process.argv[2] ?? "").trim().toLowerCase();
if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
  console.error("Uso: npm run create-admin -- email@empresa.com.br");
  process.exit(1);
}

/** Lê uma linha sem mostrar o que é digitado. */
function askHidden(prompt) {
  return new Promise((resolve) => {
    process.stdout.write(prompt);
    const { stdin } = process;
    stdin.setRawMode?.(true);
    stdin.resume();
    stdin.setEncoding("utf8");
    let value = "";
    const onData = (chunk) => {
      for (const ch of chunk) {
        if (ch === "\r" || ch === "\n") {
          stdin.setRawMode?.(false);
          stdin.pause();
          stdin.off("data", onData);
          process.stdout.write("\n");
          return resolve(value);
        }
        if (ch === "\u0003") process.exit(130); // Ctrl+C
        if (ch === "\u007f" || ch === "\b") value = value.slice(0, -1);
        else value += ch;
      }
    };
    stdin.on("data", onData);
  });
}

const supabase = createClient(url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });

async function findUserByEmail(target) {
  for (let page = 1; page <= 50; page++) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage: 200 });
    if (error) throw error;
    const found = data.users.find((u) => u.email?.toLowerCase() === target);
    if (found) return found;
    if (data.users.length < 200) return null;
  }
  return null;
}

let userId;
const existing = await findUserByEmail(email);

if (existing) {
  userId = existing.id;
  console.log(`Usuário ${email} já existe: será apenas promovido a administrador (a senha não foi alterada).`);
} else {
  const password = process.env.ADMIN_PASSWORD || (await askHidden("Senha do novo administrador (mín. 8 caracteres): "));
  if (password.length < 8) {
    console.error("A senha precisa ter pelo menos 8 caracteres.");
    process.exit(1);
  }
  const { data, error } = await supabase.auth.admin.createUser({ email, password, email_confirm: true });
  if (error) {
    console.error(`Não foi possível criar o usuário: ${error.message}`);
    process.exit(1);
  }
  userId = data.user.id;
  console.log(`Usuário ${email} criado.`);
}

const { error } = await supabase.from("admin_users").upsert({ user_id: userId }, { onConflict: "user_id" });
if (error) {
  console.error(`Não foi possível registrar como administrador: ${error.message}`);
  console.error("As migrations (supabase/migrations) já foram aplicadas no banco?");
  process.exit(1);
}

console.log(`Pronto! ${email} agora pode entrar em /admin.`);
