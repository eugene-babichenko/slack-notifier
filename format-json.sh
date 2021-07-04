#!/usr/bin/env bash
set -euo pipefail

jq -M --tab . "$1" | sponge "$1"
