# Copilot instructions — site Verts‑Pâturage

Petit site statique multi-pages en **français**. Chaque page est un fichier HTML autonome à la racine — il n'y a pas de build, pas de package manager, et pas de moteur de templates.

## Fichiers clés
- index.html  ← Accueil page (paired: `Accueil.css`, `Accueil.js`)
- Serviteurs.html  ← `Serviteurs.css`, `Serviteurs.js`
- Departements.html  ← `Departements.css`, `Departements.js`
- Jeunesse.html
- Programme.html
- localisation.html
- Louange_Adoration.html  ← utilise Tailwind CDN + `Louange_Adoration.css` / FontAwesome

## Vue d'ensemble (why)
- Simple static site: shared header/navigation et footer sont dupliqués dans chaque page. Les interactions légères (menu burger, verset du jour, animations) sont implémentées par de petits fichiers `.js` associés.
- Certaines pages utilisent Tailwind via CDN (ex. `Departements.html`, `Louange_Adoration.html`) — attention à ne pas ajouter une configuration build non désirée sans accord.

## Conventions & règles pratiques
- Respectez la casse des noms de fichiers (Windows est permissif, mais les hôtes UNIX et les bonnes pratiques exigent cohérence). Exemple: le fichier s'appelle `Serviteurs.html` — certains liens internes utilisent `serviteurs.html` (OK sur Windows) ; conservez la casse lors d'un renommage.
- Encodage: UTF‑8 sans BOM.
- Styles & scripts: chaque page a souvent un `*.css` et un `*.js` avec le même préfixe — modifiez les deux si vous changez l'UI/JS d'une page.
- Navigation dupliquée: quand vous changez le menu, appliquez la même modification à toutes les pages listées ci‑dessus.
- Assets (images): référencés de manière relative (ex. `pasteur.jpg`, `president.jpg`) — placez de nouvelles images à la racine ou mettez à jour tous les chemins référents.
- Accessibilité: conservez les attributs ARIA existants (ex. `role="navigation"`, `aria-label`) et les éléments sémantiques (`<nav>`, `<header>`, `<main>`).

## Patterns et exemples concrets
- Menu burger: recherche `class="burger"` et `class="nav-links"` — JS typique:

```js
// exemple: Accueil.js
const burger = document.querySelector('.burger');
const nav = document.querySelector('.nav-links');
if (burger && nav) burger.addEventListener('click', () => nav.classList.toggle('open'));
```

- Verset du jour: `id="verset-du-jour"` (populé par `Accueil.js`).
- Boutons/CTA: `id="ctaBtn"` (petite animation via JS).
- Tailwind usage: pages qui incluent `https://cdn.tailwindcss.com` (ex. `Louange_Adoration.html`) — n'ajoutez pas de build step local sans demander.

## Tests & vérification
- Test manuel local (Windows):
  ```powershell
  start index.html
  ```
- Pour tout renommage, faire un `grep`/recherche sur le repo pour remplacer toutes les occurrences du nom de fichier (liens relatifs). Utilisez la recherche globale dans l'éditeur.
- Vérifiez les images après changement de nom/chemin et testez sur un hôte case‑sensitive si possible (Linux ci‑de‑préférence).

## PR/commit guidance
- Commits petits et ciblés (une page / une logique par commit).
- Messages en français, impératif: ex. `Mettre à jour menu`, `Corriger orthographe Accueil`.
- Si vous changez la navigation ou des filenames, ajoutez une checklist dans la PR indiquant toutes les pages mises à jour.

## Agent rules (do / don't)
- DO: Préserver la langue française et le ton existant.
- DO: Proposer des petites améliorations (corrections de contenu, accessibilité, chemins d'assets) avec PRs ciblées.
- DON'T: Ne pas mettre en place de gros refactors (templates, bundlers, CI) sans approbation humaine — proposer un plan minimal si vous pensez que c'est nécessaire.

---
Si vous voulez, je peux ajouter des snippets de header/footer à synchroniser automatiquement ou générer une checklist de pages à mettre à jour lors d'une modification de navigation.
