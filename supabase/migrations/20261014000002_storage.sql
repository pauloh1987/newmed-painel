-- =============================================================================
-- Storage: bucket público "media" para fotos de produtos, banners, blog etc.
--   - leitura pública (as imagens aparecem no site);
--   - envio/alteração/exclusão só para administradores;
--   - limite de 5 MB por arquivo e apenas formatos de imagem seguros (sem SVG).
-- =============================================================================
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'media',
  'media',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif']
)
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

create policy "media: admin envia" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'media' and (select public.is_admin()));

create policy "media: admin altera" on storage.objects
  for update to authenticated
  using (bucket_id = 'media' and (select public.is_admin()))
  with check (bucket_id = 'media' and (select public.is_admin()));

create policy "media: admin remove" on storage.objects
  for delete to authenticated
  using (bucket_id = 'media' and (select public.is_admin()));

-- admin também precisa listar os arquivos do bucket (biblioteca de mídia)
create policy "media: admin lista" on storage.objects
  for select to authenticated
  using (bucket_id = 'media' and (select public.is_admin()));
