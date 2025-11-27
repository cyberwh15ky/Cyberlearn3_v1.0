# Minikube run hints

- If frontend cannot reach backend via /api, use kubectl port-forward:
  kubectl port-forward svc/cyberlearn-backend 4000:4000
  Then in frontend dev mode set proxy to http://localhost:4000