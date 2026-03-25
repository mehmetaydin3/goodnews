#!/bin/bash
set -e

echo ""
echo "================================================"
echo " PROVA MULTI-AGENT BUILD SYSTEM"
echo "================================================"
echo ""

# --- Round counter for iterative fixing ---
ROUND=1
MAX_ROUNDS=3

while [ $ROUND -le $MAX_ROUNDS ]; do
  echo ">>> ROUND $ROUND: Running Design Agent..."
  claude --print "$(cat prompts/design-agent.txt)" > logs/design-output-r${ROUND}.txt 2>&1
  echo "    Design Agent done. Log: logs/design-output-r${ROUND}.txt"
  echo ""

  echo ">>> ROUND $ROUND: Running QA Agent..."
  claude --print "$(cat prompts/qa-agent.txt)" > logs/qa-output-r${ROUND}.txt 2>&1
  echo "    QA Agent done. Log: logs/qa-output-r${ROUND}.txt"
  echo ""

  echo "=== QA RESULT (Round $ROUND) ==="
  cat logs/qa-output-r${ROUND}.txt
  echo ""

  # Check if QA passed
  if grep -q "^READY FOR BROWSER REVIEW" logs/qa-output-r${ROUND}.txt; then
    echo "✅ All checks passed in round $ROUND. Done!"
    break
  else
    echo "⚠️  QA found issues. Starting round $((ROUND + 1))..."
    ROUND=$((ROUND + 1))
  fi
done

if [ $ROUND -gt $MAX_ROUNDS ]; then
  echo "❌ Max rounds reached. Review logs manually."
fi
