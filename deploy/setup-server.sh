#!/usr/bin/env bash
#
# Initial server setup for War Room on a fresh Ubuntu/Debian VPS (e.g. Hetzner).
# Run once as root or with sudo:
#   curl -sSL <raw-github-url>/deploy/setup-server.sh | bash
#
set -euo pipefail

APP_DIR="${APP_DIR:-/opt/warroom}"
APP_USER="${APP_USER:-warroom}"
REPO_URL="${REPO_URL:-git@github.com:ntokyb/war-room.git}"

echo "=== War Room — Server Setup ==="

# 1. System updates & Docker
echo "[1/5] Installing Docker..."
apt-get update -qq
apt-get install -y -qq ca-certificates curl git
install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
chmod a+r /etc/apt/keyrings/docker.asc
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  tee /etc/apt/sources.list.d/docker.list > /dev/null
apt-get update -qq
apt-get install -y -qq docker-ce docker-ce-cli containerd.io docker-compose-plugin

# 2. Create app user
echo "[2/5] Creating app user..."
if ! id "$APP_USER" &>/dev/null; then
  useradd -m -s /bin/bash "$APP_USER"
  usermod -aG docker "$APP_USER"
fi

# 3. Clone repo
echo "[3/5] Cloning repository..."
if [ ! -d "$APP_DIR" ]; then
  git clone "$REPO_URL" "$APP_DIR"
  chown -R "$APP_USER":"$APP_USER" "$APP_DIR"
fi

# 4. Create .env from example
echo "[4/5] Setting up environment..."
if [ ! -f "$APP_DIR/server/.env" ]; then
  cp "$APP_DIR/server/.env.example" "$APP_DIR/server/.env"
  echo "  → Edit $APP_DIR/server/.env and set ANTHROPIC_API_KEY"
fi

# 5. Start
echo "[5/5] Starting containers..."
cd "$APP_DIR"
docker compose up -d --build

echo ""
echo "=== Setup complete ==="
echo "App running at http://$(hostname -I | awk '{print $1}')"
echo ""
echo "Next steps:"
echo "  1. Edit $APP_DIR/server/.env with your ANTHROPIC_API_KEY"
echo "  2. docker compose restart server"
echo "  3. Set up GitHub deploy keys: ssh-keygen -t ed25519 -f ~/.ssh/warroom_deploy"
echo "  4. Add the public key as a deploy key in your GitHub repo"
echo "  5. Add these GitHub Actions secrets:"
echo "     SERVER_HOST  = your server IP"
echo "     SERVER_USER  = $APP_USER"
echo "     SERVER_SSH_KEY = contents of ~/.ssh/warroom_deploy (private key)"
echo "     APP_DIR      = $APP_DIR"
