#!/usr/bin/env sh
# Cursor hook: revisar co-autoría de Cursor antes de git push (Team 48).
input=$(cat)

if ! printf '%s' "$input" | grep -qE 'git push'; then
  printf '%s\n' '{"permission":"allow"}'
  exit 0
fi

if ! git rev-parse --git-dir >/dev/null 2>&1; then
  printf '%s\n' '{"permission":"allow"}'
  exit 0
fi

upstream=$(git rev-parse '@{u}' 2>/dev/null) || upstream=""
range="HEAD"
if [ -n "$upstream" ]; then
  range="${upstream}..HEAD"
fi

if git log --format=%B "$range" 2>/dev/null | grep -qiE 'Co-authored-by:[[:space:]]*Cursor[[:space:]]*<'; then
  printf '%s\n' '{
    "permission": "deny",
    "user_message": "Hay commits con Co-authored-by: Cursor. Reescribí el mensaje antes del push (guía en .cursor/rules/git-commits-no-cursor-coauthor.mdc).",
    "agent_message": "Do not push. Run git log -1 --format=full, then rewrite with Git Bash filter-branch msg-filter grep -v Co-authored-by, or prepare-commit-msg hooks after scripts/setup-git-hooks."
  }'
  exit 2
fi

printf '%s\n' '{"permission":"allow"}'
exit 0
