#!/bin/bash
set -e
echo "=== Cyberlearn3 v1.0 Minikube one-click installer ==="
for cmd in minikube kubectl docker unzip; do
  if ! command -v $cmd >/dev/null 2>&1; then
    echo "Error: $cmd not found. Please install $cmd and rerun."
    exit 1
  fi
done

ZIPFILE="Cyberlearn3_v1.0_minikube.zip"
if [ ! -f "$ZIPFILE" ]; then
  echo "Zip file $ZIPFILE not found in current directory. Please place it here and rerun."
  exit 1
fi

echo "Starting Minikube..."
minikube start --driver=docker --cpus=4 --memory=8192

minikube addons enable ingress || true

echo "Loading Docker images into minikube..."
eval $(minikube docker-env)

if [ -d backend ]; then
  docker build -t cyberlearn/backend:local ./backend
fi
if [ -d frontend ]; then
  docker build -t cyberlearn/frontend:local ./frontend
fi
if [ -d keycloak ]; then
  docker build -t cyberlearn/keycloak:local ./keycloak || true
fi

echo "Applying Kubernetes manifests..."
kubectl apply -f k8s/

MINIKUBE_IP=$(minikube ip)
echo "Adding hosts entries (requires sudo)..."
echo "$MINIKUBE_IP frontend.cyberlearn.local auth.cyberlearn.local api.cyberlearn.local" | sudo tee -a /etc/hosts

echo "Installation complete. Visit http://frontend.cyberlearn.local and http://auth.cyberlearn.local"
