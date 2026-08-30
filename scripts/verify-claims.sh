#!/usr/bin/env bash
# FlashGuard Pro - Claim Verification Runner (Bash)
set -e
python3 "$(dirname "$0")/verify_claims.py"
