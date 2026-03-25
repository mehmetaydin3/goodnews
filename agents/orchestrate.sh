#!/bin/bash
set -e

LOG_DIR="agents/logs"
PROMPT_DIR="agents/prompts"

echo ""
echo "╔══════════════════════════════════════════╗"
echo "║     PROVA MULTI-AGENT ORCHESTRATOR       ║"
echo "╚══════════════════════════════════════════╝"
echo ""

run_agent() {
  local num=$1
  local name=$2
  local marker=$3
  local log_file="$LOG_DIR/${num}-${name}-output.txt"

  echo "▶ Starting Agent $num: $name..."
  claude --print "$(cat "$PROMPT_DIR/${num}-${name}.txt")" > "$log_file" 2>&1

  if grep -q "^$marker" "$log_file"; then
    echo "✅ Agent $num ($name): $marker"
  else
    echo "⚠️  Agent $num ($name) may not have finished — check $log_file"
    tail -5 "$log_file"
  fi
  echo ""
}

run_agent "02" "backend-engineer" "BACKEND-COMPLETE"
run_agent "03" "frontend-engineer" "FRONTEND-COMPLETE"
run_agent "04" "visual-lead" "VISUAL-COMPLETE"
run_agent "05" "creative-director" "CREATIVE-COMPLETE"
run_agent "06" "qa-engineer" "QA-SIGN-OFF-COMPLETE"

echo "All agents finished. Review: $LOG_DIR"
