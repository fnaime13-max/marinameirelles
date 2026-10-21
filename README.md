# Site · Marina Meirelles, Nutricionista

Site de uma página, em HTML, CSS e JS puros. Não precisa de build nem de instalar nada: abra o `index.html` no navegador.

**Conceito: "Romper o ciclo".** A Marina ajuda mulheres a sair do ciclo de dieta restritiva e descontrole. O oval verde que ela usa nos posts virou o ciclo, e a borboleta 🦋 da apresentação dela no Instagram virou a saída. As cores vêm da fase atual dela: branco que desce para o sálvia, verde-floresta nos títulos, e o céu azul e o sol amarelo da ilustração "Acolhimento, nutrição e bem-estar".

## Estrutura
```
index.html            página única (todas as seções)
css/styles.css        estilos (cores e espaçamentos em variáveis no topo)
js/config.js          ← DADOS EDITÁVEIS: WhatsApp, CRN, mensagem padrão
js/borboletas.js      as borboletas em canvas (hero e contato)
js/main.js            loader 0→100%, menu, diagrama do ciclo, checklist, trilha
assets/img/           fotos (.webp) e imagem de compartilhamento (og.jpg)
assets/favicon.svg    ícone da aba (borboleta)
robots.txt, sitemap.xml
qa/                   scripts de teste com Playwright + screenshots (não publicar)
_originais/           PDFs extraídos e material de referência (não publicar)
```

## Trocar dados
Edite **`js/config.js`**:
- `whatsapp`: número com DDI e DDD, só dígitos (`5535991484131`). Todos os botões de WhatsApp (`data-wa`) usam esse número.
- `crn`: por exemplo `'CRN-9 12345'`. Aparece no rodapé.
- `mensagem`: texto que já vem escrito ao abrir o WhatsApp.
- O telefone visível no bloco "Vamos juntas?" está escrito no `index.html` (procure `99148-4131`).
- Instagram: procure `_nutricionistamarina` no `index.html`.

## Trocar fotos
Substitua o arquivo em `assets/img/` **mantendo o mesmo nome**. Não precisa mexer no código. Se o arquivo faltar, aparece um placeholder listrado com o nome e o tamanho esperados.

## Trocar o logo
O logo é texto: "Marina Meirelles" na fonte Great Vibes, com a faixa "NUTRICIONISTA" (classe `.marca`). Para usar o arquivo oficial, troque o conteúdo de `<a class="marca">` por um `<img>`.

## Trocar o domínio
Substitua `marinameirelles.felixdias.com` em: `index.html` (canonical, og:url, og:image, twitter:image, JSON-LD), `robots.txt` e `sitemap.xml`.

## Publicar (GitHub Pages)
1. Crie um repositório, envie os arquivos (sem `_originais/` e `qa/`) e ative o Pages na branch `main`.
2. Para usar um subdomínio, crie um arquivo `CNAME` com o domínio e o registro CNAME no DNS.
3. Quando mudar o CSS ou o JS, aumente o `?v=` nos links do `index.html` para o navegador não usar a versão antiga em cache.

## Interações
- **Loader:** o ciclo "dieta · fome · descontrole · culpa" gira enquanto o anel enche de 0 a 100%. Ao final, o anel se rompe e uma borboleta sai voando.
- **Borboletas (hero e contato):** fogem do mouse ou do dedo, pousam no anel oval da foto e decolam quando a mão chega perto. Um clique ou toque solta mais duas. Elas desviam do texto e do rosto.
- **O ciclo:** toque em cada etapa para ver a explicação. O botão "Romper o ciclo" transforma o círculo no caminho do acompanhamento.
- **Marque o que você sente:** os itens marcados viram a mensagem enviada no WhatsApp.
- **Como funciona:** uma borboleta percorre a trilha dos 4 passos conforme a rolagem.
- Com "reduzir movimento" ativado no sistema, tudo fica estático e o loader dura 0,4 s.

## Testes
`node qa/shots.cjs` tira screenshots em 1440 e 390 px e lista erros de console e overflow. Usa o Playwright da skill `playwright-skill`.
