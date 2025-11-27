# Cyberlearn3 v1.0 (Minikube-ready)
此版本為 **完整可在本地 Minikube 運行** 的 Cyberlearn3 v1.0，整合 A–H（Backend, Frontend, Mobile skeleton, Keycloak, Payments placeholders, AI endpoint, Postgres, Redis, Helm skeleton, CI）。
所有指令以 **繁體中文** 說明；IT 名詞以 **英文** 表示。

## 目標環境 (Minikube)
- Minikube (driver: docker)
- kubectl
- helm (optional)
- docker

## 一鍵上手步驟（Minikube）
1. 開啟 Minikube (建議資源): 
```bash
minikube start --cpus=4 --memory=8192 --driver=docker
minikube addons enable ingress
```
2. 解壓 repo 並切換目錄（若你已下載 ZIP）:
```bash
unzip Cyberlearn3_minikube.zip
cd Cyberlearn3_minikube
```
3. 將 docker build 指向 minikube:
```bash
eval $(minikube docker-env)
docker build -t cyberlearn/backend:local ./backend
docker build -t cyberlearn/frontend:local ./frontend
docker build -t cyberlearn/keycloak:local ./keycloak
```
> （Keycloak image 為可選，chart 會使用官方 image 若不 build）

4. Deploy 基礎服務（postgres / redis / keycloak / backend / frontend）:
```bash
kubectl apply -f k8s/postgres.yaml
kubectl apply -f k8s/redis.yaml
kubectl apply -f k8s/keycloak-deploy.yaml
kubectl apply -f k8s/backend-deploy.yaml
kubectl apply -f k8s/frontend-deploy.yaml
kubectl apply -f k8s/ingress.yaml
```
5. 新增 hosts（讓瀏覽器能存取 local ingresses）:
```bash
echo "$(minikube ip) frontend.cyberlearn.local auth.cyberlearn.local" | sudo tee -a /etc/hosts
```
6. 初次設定 Keycloak（匯入 realm）:
- 到 `http://auth.cyberlearn.local` 登入 admin (預設帳號密碼見下方)
- 匯入 `keycloak/realm-export.json`（Realm: Cyberlearn）

7. 訪問系統:
- Frontend: `http://frontend.cyberlearn.local`
- Keycloak: `http://auth.cyberlearn.local`
- Backend health: `http://<minikube-ip>:<nodeport-if-used>/health` 或透過 ingress `/api/health`

---
## 預設帳號 (for demo)
Keycloak admin (本 demo 建議在 Keycloak UI 設定一個 admin)
- username: `admin`
- password: `admin`

> 請在生產環境務必變更憑證與 secrets。

---
## Repo 內容重點
- `k8s/`：Postgres StatefulSet, Redis, Keycloak, Backend, Frontend, Ingress
- `backend/`：Node.js Express (module-like structure), Dockerfile, sample SQL init
- `frontend/`：React + i18n, Dockerfile
- `keycloak/realm-export.json`：Keycloak realm skeleton（含 TOTP requiredActions，SMS 為 placeholder）
- `mobile/`：Expo React Native skeleton
- `helm/`：Helm chart skeleton
- `.github/workflows/ci.yml`：CI skeleton

---
## 注意事項（Production-readiness）
- Payment integrations (Stripe/Alipay/PayMe/FPS) 目前為 placeholder，生產時請設定 merchant credentials 並確保 PCI compliance。
- Secrets 管理請使用 Vault 或 SealedSecrets；不要把明文 credentials 放在 repo。
- Backup: 本地可測 Velero，或企業級 Commvault（production）
- Firewall: Palo Alto CN-Series 非本地範疇，請在轉雲端時整合

---
如果你需要，我可以：
- 把整個 repo 直接 push 到 `https://github.com/cyberwh15ky/Cyberlearn3.git`（需你授權 token 或 repo access）
- 幫你把 Keycloak realm 自動匯入並建立 demo users
- 把支付整合改為真實 merchant (需要實際 credentials)

# Cyberlearn3 v1.0 - installer package