# Botão líquido do GitHub

Conversão completa do componente original em React, TypeScript, Tailwind CSS,
Motion e Lucide para uma aplicação estática feita somente com HTML5, CSS3,
JavaScript ES6+ e SVG inline.

## Estrutura

```text
/
├── index.html
├── css/
│   └── styles.css
├── js/
│   └── script.js
├── assets/
│   ├── images/
│   ├── icons/
│   └── fonts/
└── README.md
```

As pastas em `assets` estão reservadas para futuras imagens, fontes ou ícones.
Os ícones atuais foram convertidos para SVG inline, portanto o projeto não faz
requisições externas.

## Como executar

Há duas opções:

1. Abra `index.html` diretamente no navegador.
2. Sirva a pasta com qualquer servidor estático.

Não é necessário instalar Node.js, executar `npm install` ou gerar um build.

## Configuração

As cores, o endereço aberto pelo botão e a velocidade da animação ficam no
objeto `CONFIG`, no início de `js/script.js`.

- `repositoryUrl`: endereço aberto pelo botão.
- `idleCycleDuration`: duração do ciclo normal, em milissegundos.
- `hoverCycleDuration`: duração do ciclo durante hover ou foco.
- `maximumFrameRate`: limite de atualizações visuais por segundo.
- `colors`: as 17 cores do gradiente original.

## Deploy na Vercel

1. Envie esta estrutura para um repositório no GitHub.
2. Na Vercel, escolha **Add New > Project**.
3. Importe o repositório.
4. Se a Vercel solicitar um preset, selecione **Other**.
5. Deixe os comandos de build e instalação vazios.
6. Use `.` como diretório de saída, quando esse campo for exigido.
7. Clique em **Deploy**.

O projeto não precisa de `vercel.json`, framework, dependências ou etapa de
compilação.

## Compatibilidade e acessibilidade

- Navegadores modernos com suporte a SVG inline e `requestAnimationFrame`.
- Layout responsivo equivalente ao componente original.
- Link acessível por teclado, com foco visível e nome descritivo.
- Respeito a `prefers-reduced-motion`.
- Pausa automática da animação quando a página fica em segundo plano.
