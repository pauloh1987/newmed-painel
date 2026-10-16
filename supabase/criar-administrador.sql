-- =============================================================================
-- Torna um usuário administrador do painel (/admin).
--
-- 1) No Supabase: Authentication > Users > Add user > Create new user.
--    Informe o e-mail e uma senha longa e marque "Auto Confirm User".
-- 2) Troque o e-mail abaixo pelo mesmo e-mail e clique em Run (SQL Editor).
--
-- Repita para cada pessoa que for usar o painel.
-- =============================================================================
insert into public.admin_users (user_id)
select id from auth.users where email = 'seu-email@newmedequipamentos.com.br'
on conflict (user_id) do nothing;

-- Conferência: deve listar o e-mail que você acabou de promover.
select u.email
from public.admin_users a
join auth.users u on u.id = a.user_id;
