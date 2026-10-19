<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Project rules
- All slide copy and data live in src/data/forum.ts; slide components only render it (keeps content editable without touching layout).
- Slides are registered in order in src/slides/index.ts with React.lazy; each slide is one file wrapping SlideShell.
- Slides are authored at 1920×1080 and scaled by ScaledStage; on mobile portrait `data-flow` switches to stacked layout via the `flow:` custom variant.
- DeckContext `thumb`/`reduced` flags must disable costly or time-based effects (overview thumbnails, print, prefers-reduced-motion).
- Browser-only APIs (Path2D, canvas, Audio) are created inside effects only — SSR runs on workers.
