# Matemágica

Site de questões de matemática resolvidas passo a passo, com animações visuais, feito para alunos do **7º ano do ensino fundamental**.

## Sobre o projeto

O Matemágica se propõe a ajudar os alunos a entender a matemática vendo o raciocínio acontecer, e não apenas lendo a resposta final. Cada questão é resolvida em etapas curtas: a conta se transforma na tela, o que mudou em cada etapa ganha destaque de cor e o resultado aparece no final.

- **Questões do livro dos alunos.** As questões foram escolhidas do livro didático usado pela turma e estão organizadas pelos capítulos do livro (9 a 12).
- **A resolução avança com a rolagem.** O aluno controla o ritmo: rolando a página para baixo, a conta avança; rolando para cima, ela volta. Dá para parar em qualquer etapa pelo tempo que precisar.
- **Vídeo com narração.** Cada questão pode ter um link para um vídeo no YouTube com a resolução explicada em voz.
- **Dicas para preservar a atenção.** O site também traz orientações de como manter o foco durante um estudo concentrado. *Esta seção está em construção.*

## Como usar o site

1. Na página inicial, escolha um capítulo nos cards à direita.
2. Leia o enunciado da questão (e a figura, quando houver).
3. Role a página para acompanhar a resolução. Embaixo da animação aparecem o número, o nome e a descrição da etapa atual. A barra de progresso tem um trecho por etapa, e clicar num trecho leva direto a ela.
4. No fim da questão, use **Ver resposta** para conferir o resultado e os links **Anterior / Próxima** para seguir.
5. No canto superior direito, o **menu de questões** troca de questão dentro do capítulo, e o **ícone do YouTube** abre o vídeo narrado.

Cada questão tem um endereço próprio (por exemplo, `capitulos/capitulo-12.html#q10`), que pode ser enviado direto aos alunos.

## Questões disponíveis

| Capítulo | Questões |
|---|---|
| 9 · livro 2 | 4 (p. 75) — 3 a (p. 83) — 2 (p. 84) — 6, 7 e 8 (p. 85) — 9 a (p. 86) · **livro suplementar 2**: 8 (p. 47) — 11 e 12 a, b, c (p. 49) |
| 10 · livro 2 | 3 (p. 105) — 1 (p. 112) — 7 e 8 (p. 114) — 13 e 14 (p. 115) |
| 11 · livro 3 | 7 e 8 (p. 15) — 2 (p. 20) — 1 e 3 (p. 24) — 4 (p. 25) |
| 12 · livro 3 | 1 e 3 (p. 35) — 3 c, 3 f e 4 (p. 39) — 10 (p. 44) |

## Rodando localmente

O site é feito só com HTML, CSS e JavaScript, sem etapa de build. Para evitar bloqueios do navegador ao carregar arquivos locais (fontes e scripts), abra-o por um servidor simples na pasta do projeto:

```bash
python -m http.server 5517
```

Depois acesse `http://localhost:5517`. É preciso internet para as fontes do Google Fonts e para o KaTeX, que desenha as fórmulas da página inicial.

## Estrutura de pastas

```
index.html                  página inicial (hero com as fórmulas animadas)
capitulos/
  capitulo-09.html … capitulo-12.html
assets/
  css/
    base.css                cores, fontes e estilos comuns
    home.css                página inicial
    capitulo.css            páginas de capítulo (header, menu, enunciado)
    questao.css             área da resolução guiada pela rolagem
  js/
    home.js                 animação da palavra e das fórmulas da página inicial
    capitulo.js             menu de questões, link do YouTube, anterior/próxima
    questao-cena.js         liga a rolagem ao tempo das animações
  questoes/
    capitulo-XX/qNN-nome.js uma resolução animada por arquivo
  vendor/react/             React 18 (usado só para desenhar as animações)
  vendor/lottie/            lottie-web (ícones animados de algumas questões)
  fonts/                    fonte Mattilda (título da página inicial)
  images/                   fundo da página inicial e imagem do card "Início"
```

## Adicionando uma questão

1. Coloque o arquivo da resolução animada em `assets/questoes/capitulo-XX/`. Ele registra a questão em `window.Questoes` com um identificador, por exemplo `cap12-q10`.
2. Na página do capítulo, carregue o arquivo com um `<script defer>` junto dos outros, antes de `questao-cena.js`.
3. Copie um bloco `<article class="questao">` existente e ajuste:
   - `id`: a âncora da URL (`q10`);
   - `data-cena`: o identificador registrado no passo 1;
   - `data-youtube`: o link do vídeo narrado (vazio deixa o ícone desativado);
   - `data-resumo` (opcional): o texto curto do menu, quando o enunciado tem frações ou raízes;
   - enunciado, figura (se houver), alternativas e resposta.

O menu do header e os links de anterior/próxima são montados automaticamente a partir dos blocos `<article>`, em ordem de aparição.

## Atualizando o site publicado

Os arquivos da página inicial são carregados com um número de versão (`home.css?v=3`, `home.js?v=3`). Ao alterar um deles, aumente esse número no `index.html` para que quem já visitou o site receba a versão nova em vez da guardada em cache.

## Tecnologias

- HTML, CSS e JavaScript puros
- [React 18](https://react.dev/) (cópia local) para desenhar as resoluções animadas
- [KaTeX](https://katex.org/) para as fórmulas da página inicial
- [lottie-web](https://github.com/airbnb/lottie-web) (MIT, cópia local) para os ícones animados de algumas questões
- Fontes: Mattilda (título), Manrope (interface), Caveat, IBM Plex Mono e STIX Two Text (animações)

## Créditos

Os enunciados das questões pertencem ao livro didático dos alunos e são usados aqui com finalidade educacional.
