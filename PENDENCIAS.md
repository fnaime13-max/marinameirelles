# Pendências · Site Marina Meirelles

Legenda: **[BLOQUEIA PUBLICAÇÃO]** precisa ser resolvido antes de colocar no ar.

## Dados profissionais
- [ ] **[BLOQUEIA PUBLICAÇÃO] Número do CRN** (provavelmente CRN-9, por ser MG). O CFN exige o CRN na divulgação. Preencher em `js/config.js` → `crn`. Enquanto estiver vazio, o rodapé mostra "CRN a preencher" em laranja.
- [ ] Endereço do consultório em Pouso Alegre/MG. Hoje o site diz só "consultório em Pouso Alegre/MG". Com o endereço, dá para pôr mapa e endereço completo no JSON-LD.
- [ ] Confirmar o nome do curso de especialização em Nutrição Neonatal (instituição e ano). Hoje aparece só "Especialização · Nutrição Neonatal", tirado do post de apresentação dela.
- [ ] Confirmar se ela quer destacar "Nutricionista comportamental" como título. Isso vem da bio do Instagram e não é título de especialista registrado. Se ela tiver certificação formal na área, informar.
- [ ] Confirmar se atende só mulheres. O site fala com mulheres, como o Instagram dela. Se também atender homens, ajustar o texto.

## Atendimento
- [ ] Como funciona o acompanhamento pós-consulta: por WhatsApp? Por quanto tempo? Tem retorno incluído? Hoje o texto diz apenas "apoio para tirar dúvidas e fazer ajustes", sem prometer prazo nem frequência.
- [ ] Plataforma da consulta online (Google Meet, WhatsApp vídeo, Zoom...). É opcional.
- [ ] Se aceita convênios ou emite recibo para reembolso. Se sim, incluir no FAQ.

## Domínio e publicação
- [ ] Domínio definitivo. O provisório é `https://marinameirelles.felixdias.com/`, usado no canonical, no Open Graph, no sitemap e no robots. Se mudar, trocar nesses 4 lugares (README → "Trocar o domínio").
- [ ] DNS: criar o CNAME `marinameirelles` apontando para `fnaime13-max.github.io` (DNS only), como nos outros clientes.

## Imagens (todas reais, tiradas do Instagram dela)
| Arquivo | Dimensão | Proporção | Seção | Observação |
|---|---|---|---|---|
| `assets/img/marina-hero.webp` | 960×1200 | 4:5 | Hero (moldura oval) | Jaleco, em frente ao painel com o logo. Tirada de um story (1215×2160). Se houver o arquivo original em alta, substituir. |
| `assets/img/marina-sobre.webp` | 900×1014 | ~8:9 | Sobre mim (arco) | Jaleco e blusa rosa, no consultório. |
| `assets/img/marina-retrato.webp` | 540×540 | 1:1 | Citação | Mão no queixo. Recortada acima do texto do post e com resolução baixa (540px), mas suficiente para o círculo de 120px. |
| `assets/img/og.jpg` | 1200×630 | — | Compartilhamento (WhatsApp/Instagram) | Gerada a partir da foto do hero. |

- [ ] Fotos originais em alta resolução, se ela tiver (direção: fundo claro, luz natural, jaleco ou roupa em tons de verde/rosa claro).
- [ ] Arquivo do logo em vetor (SVG/PDF). O site usa uma releitura em texto (Great Vibes + faixa "NUTRICIONISTA"), parecida com o logo dela, mas não é o arquivo oficial.

## Aprovação
- [ ] A cliente aprovar os textos do diagrama do ciclo (Dieta restritiva → Fome e privação → Descontrole → Culpa / Acolhimento → Sua história → Estratégias possíveis → Leveza e constância). São escrita minha, baseada nos posts dela.
- [ ] Prova social: não incluí depoimentos. Os comentários do Instagram mencionam balança e medidas, o que esbarra nas regras do CFN sobre divulgar resultados. Só incluir com autorização por escrito e sem números ou antes/depois.
