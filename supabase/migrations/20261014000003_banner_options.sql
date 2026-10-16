-- Opções de apresentação por banner:
--   text_position: onde fica o texto sobre a foto (esquerda / centro / direita);
--   overlay: "dark" escurece a foto (texto branco), "light" clareia (texto escuro),
--            "none" não aplica filtro (arte já pronta, com o texto dentro da imagem).
alter table public.banners
  add column text_position text not null default 'left' check (text_position in ('left', 'center', 'right')),
  add column overlay text not null default 'dark' check (overlay in ('dark', 'light', 'none'));
