# ArgoCD GitOps Node.js App 🚀

Welcome to the **argocd-k8s** project! This repository is a modern Kubernetes architecture lab using **GitOps** principles and best practices with **ArgoCD**.

## 🏗️ Project Architecture

This application consists of:
- **Node.js API**: A REST API.
- **Database**: PostgreSQL.
- **Prisma ORM**: Responsible for database modeling and migrations (Running as an autonomous Job in K8s).
- **Horizontal Pod Autoscaler (HPA)**: Configured to scale the API based on CPU usage.

The entire deployment is automatically managed by **ArgoCD** reading directly from this GitHub repository. The CI/CD pipeline is handled via **GitHub Actions**, which builds the Docker image and updates the tag in Kustomize.

---

## 🐙 How to run using ArgoCD (The GitOps Way)

If you want to see the GitOps magic happen, you should deploy this application through ArgoCD instead of applying the files manually!

### 1. Install ArgoCD on your cluster
If you don't have ArgoCD yet, you can quickly install it with:
```bash
kubectl create namespace argocd
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml
```

### 2. Access the ArgoCD UI
To access the ArgoCD web interface locally, open a port-forward tunnel:
```bash
kubectl port-forward svc/argocd-server -n argocd 8080:443
```
You will also need the initial admin password to log in (username is `admin`). Get it by running:
```bash
kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d
```
Access the UI at: 👉 **https://localhost:8080**

### 3. Connect ArgoCD to this Repository
Log in to the ArgoCD web interface and create a new application (New App) with the following parameters:
- **Project Name:** `default`
- **Sync Policy:** `Automatic` (Check: *Prune resources*, *Self Heal*, and *Auto-Create Namespace*)
- **Repository URL:** The URL of this Git repository.
- **Path:** `k8s/overlays/prod`
- **Cluster URL:** `https://kubernetes.default.svc`
- **Namespace:** `prod-environment`

As soon as you click *Create*, ArgoCD will read this repository and execute the perfectly orchestrated **Sync Waves**:
1. **Wave 0:** Creates the Database, Secrets, and ConfigMaps.
2. **Wave 1:** Runs the Prisma migration Job on the new database.
3. **Waves 2 & 3:** Spins up the Node.js API and the Autoscaler (HPA).

### 4. Test the Application
Once the ArgoCD dashboard is completely green (Healthy and Synced), open a tunnel to access your Node.js API:
```bash
kubectl port-forward svc/api-service 3000:80 -n prod-environment
```
Access it in your browser or Postman: 👉 **http://localhost:3000**

---

## 🛠️ How to run without ArgoCD (Manual Mode)

If you just want to test it quickly on your local machine using `kubectl` directly (without GitOps):

### Step 1: Create the Local Cluster
Use Kind to spin up a quick cluster on your machine:
```bash
kind create cluster --name argocd-k8s
```

### Step 2: Install the Application
```bash
# Kubernetes will read kustomization.yml and apply everything in the correct order
kubectl apply -k k8s/base/
```

### Step 3: Test the Application
Since we are running locally, open a tunnel (Port-Forward) to access the API:
```bash
kubectl port-forward svc/api-service 3000:80 -n prod-environment
```
Access it in your browser or Postman: 👉 **http://localhost:3000**

---

## 👨‍💻 Author

**Renato Madeia Muiambo**
- GitHub: [@thinnugly](https://github.com/thinnugly)