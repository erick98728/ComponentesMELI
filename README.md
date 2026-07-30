# Dock de aplicativos

Conversão completa do componente `dock-tabs.tsx` para uma aplicação estática feita somente
com HTML5, CSS3, JavaScript ES6+ e SVGs inline.

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

Os ícones foram convertidos para SVG inline. As pastas em `assets` ficam reservadas para
arquivos futuros e não são necessárias para o funcionamento do Dock.

## Recursos preservados

- Cinco aplicativos com nomes em português
- Superfície monocromática consistente, sem cores individuais
- Ampliação dos ícones conforme a distância do cursor
- Movimento elástico e retorno suave
- Elevação, brilho e escala no hover
- Feedback visual ao pressionar e clicar
- Tooltips animados
- Indicadores inferiores
- Entrada animada do Dock
- Fundo translúcido com blur, borda e sombra
- Navegação por teclado e foco visível
- Respeito a `prefers-reduced-motion`
- Layout responsivo sem remover os cinco itens

## Implementação

O efeito de ampliação usa um único ciclo de `requestAnimationFrame` para todos os itens.
As leituras de layout são agrupadas antes das escritas de estilo, reduzindo repaints e
evitando múltiplos ciclos de animação concorrentes.

Não existem dependências, imports, bibliotecas externas, processo de build ou arquivos de
configuração.

## Executar

Abra `index.html` diretamente em um navegador moderno. Também é possível servir a pasta
com qualquer servidor estático.

## Publicar na Vercel

1. Importe este repositório na Vercel.
2. Selecione **Other** como framework, caso essa opção seja solicitada.
3. Não preencha comandos de instalação ou build.
4. Use `.` como diretório de saída quando o campo for obrigatório.
5. Publique o projeto.

## Personalização

As cores, dimensões, espaçamentos e superfícies ficam centralizados nas variáveis de
`:root` em `css/styles.css`. Os nomes e ícones dos aplicativos estão em `index.html`, e os
parâmetros da ampliação ficam no objeto `CONFIG` em `js/script.js`.
