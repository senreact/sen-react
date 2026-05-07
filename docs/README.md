# docs/amadou/

Hand-off documentation pack for Amadou Sambe (Executive Director, REACT).

## Purpose

Everything in this folder is written for Amadou, not for Tom. Non-technical. Plain language. No jargon. No repo structure, no skills, no hooks, no agents.

## Structure

```
amadou/
├── README.md                  # (this file — for Tom's reference)
├── en/                        # English primary (Tom reviews first)
│   ├── 00-cover-note.md
│   ├── 01-platform-vision.md
│   ├── 02-build-roadmap.md
│   └── 03-final-validation.md
└── fr/                        # French draft (Claude translation — marked "à valider par Amadou")
    ├── 00-note-de-transmission.md
    ├── 01-vision-plateforme.md
    ├── 02-feuille-de-route.md
    └── 03-validation-finale.md
```

## The hard gate

`03-final-validation.md` / `03-validation-finale.md` contains three questions Amadou must answer before Wave 0 begins. Build is blocked until those answers are received.

## Hand-off workflow

1. Tom reviews EN versions → edits as needed
2. Tom reviews FR versions → flags anything needing adjustment
3. Run `scripts/ops/build-pdfs.sh` (to be built in Wave 0) → produces `docs/amadou/pdf/*.pdf`
4. Send PDFs to Amadou via WhatsApp or email
5. Ideally: book a video call to walk through them together
6. Capture Amadou's answers in `discovery/decisions-log.md` (D010, D011, D012)
7. Unblock Wave 0

## PDF generation (future)

- Tool: `pandoc` with the `eisvogel` LaTeX template
- Trigger: `docs-to-pdf` skill (see `docs/setup-plan.md` §3.14)
- Output: `docs/amadou/pdf/<filename>.pdf`
- Local, free, no cloud

## Translation policy

All French documents in `fr/` are Claude-generated drafts marked with a visible "À valider par Amadou" banner. Amadou's review is required before distribution. No translation ships without his sign-off (per decision D005).
