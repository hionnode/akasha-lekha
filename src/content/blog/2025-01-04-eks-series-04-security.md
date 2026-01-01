---
title: "EKS Deep Dive Series Part 4: Security Best Practices"
date: "2025-01-04"
excerpt: "Secure your EKS clusters with IAM Roles for Service Accounts, pod security policies, secrets management, and compliance best practices."
tags: ["eks", "kubernetes", "security", "aws", "iam", "devops"]
featured: true
draft: false
series: "eks-deep-dive"
seriesPart: 4
seriesTotal: 5
---

## Introduction

Security is paramount when running production workloads on EKS. This post covers comprehensive security practices from IAM integration to runtime protection.

## IAM Roles for Service Accounts (IRSA)

### The Problem IRSA Solves

```yaml
# Before IRSA:
Problem: All pods on a node share node IAM role
Risk: Over-privileged pods, lateral movement
Example: Pod needs S3 access → entire node gets S3 access

# With IRSA:
Solution: Each pod gets its own IAM role
Benefit: Least privilege, fine-grained permissions
Example: Only specific pods get S3 access
```

### Enable OIDC Provider

```bash
# Required for IRSA
eksctl utils associate-iam-oidc-provider \
  --cluster my-eks-cluster \
  --approve

# Verify
aws eks describe-cluster \
  --name my-eks-cluster \
  --query "cluster.identity.oidc.issuer" \
  --output text
```

### Create IAM Role for Service Account

```bash
# 1. Create IAM policy
cat > s3-policy.json <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::my-app-bucket",
        "arn:aws:s3:::my-app-bucket/*"
      ]
    }
  ]
}
EOF

aws iam create-policy \
  --policy-name MyAppS3Policy \
  --policy-document file://s3-policy.json

# 2. Create service account with IAM role
eksctl create iamserviceaccount \
  --name my-app-sa \
  --namespace default \
  --cluster my-eks-cluster \
  --attach-policy-arn arn:aws:iam::ACCOUNT_ID:policy/MyAppS3Policy \
  --approve \
  --override-existing-serviceaccounts
```

### Use Service Account in Pod

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: my-app
spec:
  serviceAccountName: my-app-sa  # IRSA magic happens here
  containers:
  - name: app
    image: my-app:latest
    env:
    - name: AWS_REGION
      value: us-west-2
```

### Verify IRSA

```bash
# Check service account
kubectl describe sa my-app-sa

# Should see annotation:
# eks.amazonaws.com/role-arn: arn:aws:iam::ACCOUNT:role/...

# Inside pod, check credentials
kubectl exec -it my-app -- env | grep AWS

# Should see:
# AWS_ROLE_ARN=arn:aws:iam::...
# AWS_WEB_IDENTITY_TOKEN_FILE=/var/run/secrets/eks.amazonaws.com/serviceaccount/token
```

## Pod Security Standards

### Pod Security Admission

```yaml
# Namespace-level pod security
apiVersion: v1
kind: Namespace
metadata:
  name: production
  labels:
    pod-security.kubernetes.io/enforce: restricted
    pod-security.kubernetes.io/audit: restricted
    pod-security.kubernetes.io/warn: restricted
```

### Secure Pod Example

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: secure-app
spec:
  securityContext:
    runAsNonRoot: true
    runAsUser: 10001
    fsGroup: 10001
    seccompProfile:
      type: RuntimeDefault
  containers:
  - name: app
    image: my-app:latest
    securityContext:
      allowPrivilegeEscalation: false
      readOnlyRootFilesystem: true
      runAsNonRoot: true
      runAsUser: 10001
      capabilities:
        drop:
          - ALL
    volumeMounts:
    - name: tmp
      mountPath: /tmp
    resources:
      limits:
        cpu: "1"
        memory: "512Mi"
      requests:
        cpu: "100m"
        memory: "128Mi"
  volumes:
  - name: tmp
    emptyDir: {}
```

## Secrets Management

### AWS Secrets Manager Integration

```bash
# 1. Install Secrets Store CSI Driver
kubectl apply -f https://raw.githubusercontent.com/kubernetes-sigs/secrets-store-csi-driver/v1.3.4/deploy/rbac-secretproviderclass.yaml
kubectl apply -f https://raw.githubusercontent.com/kubernetes-sigs/secrets-store-csi-driver/v1.3.4/deploy/csidriver.yaml
kubectl apply -f https://raw.githubusercontent.com/kubernetes-sigs/secrets-store-csi-driver/v1.3.4/deploy/secrets-store.csi.x-k8s.io_secretproviderclasses.yaml
kubectl apply -f https://raw.githubusercontent.com/kubernetes-sigs/secrets-store-csi-driver/v1.3.4/deploy/secrets-store.csi.x-k8s.io_secretproviderclasspodstatuses.yaml
kubectl apply -f https://raw.githubusercontent.com/kubernetes-sigs/secrets-store-csi-driver/v1.3.4/deploy/secrets-store-csi-driver.yaml

# 2. Install AWS Provider
kubectl apply -f https://raw.githubusercontent.com/aws/secrets-store-csi-driver-provider-aws/main/deployment/aws-provider-installer.yaml
```

### SecretProviderClass

```yaml
apiVersion: secrets-store.csi.x-k8s.io/v1
kind: SecretProviderClass
metadata:
  name: aws-secrets
spec:
  provider: aws
  parameters:
    objects: |
      - objectName: "prod/database/password"
        objectType: "secretsmanager"
        objectAlias: "db-password"
      - objectName: "prod/api/key"
        objectType: "secretsmanager"
        objectAlias: "api-key"
```

### Mount Secrets in Pod

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: app-with-secrets
spec:
  serviceAccountName: my-app-sa  # Needs Secrets Manager permissions
  containers:
  - name: app
    image: my-app:latest
    volumeMounts:
    - name: secrets-store
      mountPath: "/mnt/secrets"
      readOnly: true
    env:
    - name: DB_PASSWORD
      valueFrom:
        secretKeyRef:
          name: db-credentials
          key: db-password
  volumes:
  - name: secrets-store
    csi:
      driver: secrets-store.csi.k8s.io
      readOnly: true
      volumeAttributes:
        secretProviderClass: "aws-secrets"
      nodePublishSecretRef:
        name: my-app-sa
```

### Encrypt Kubernetes Secrets with KMS

```yaml
# Enable encryption during cluster creation
eksctl create cluster \
  --name secure-cluster \
  --encryption-config \
    '[{"resources":["secrets"],"provider":{"keyArn":"arn:aws:kms:us-west-2:ACCOUNT:key/KEY_ID"}}]'

# Or enable for existing cluster
aws eks associate-encryption-config \
  --cluster-name my-eks-cluster \
  --encryption-config \
    '[{"resources":["secrets"],"provider":{"keyArn":"arn:aws:kms:us-west-2:ACCOUNT:key/KEY_ID"}}]'
```

## Image Security

### Amazon ECR Image Scanning

```bash
# Enable scan on push
aws ecr put-image-scanning-configuration \
  --repository-name my-app \
  --image-scanning-configuration scanOnPush=true

# Scan existing image
aws ecr start-image-scan \
  --repository-name my-app \
  --image-id imageTag=latest

# Get scan results
aws ecr describe-image-scan-findings \
  --repository-name my-app \
  --image-id imageTag=latest
```

### Image Pull Policy

```yaml
# Enforce image pull policy
apiVersion: v1
kind: Pod
metadata:
  name: secure-app
spec:
  containers:
  - name: app
    image: ACCOUNT.dkr.ecr.us-west-2.amazonaws.com/my-app:v1.2.3  # Use specific tags
    imagePullPolicy: Always  # Always pull latest
```

### Private ECR Access

```yaml
# Node role needs ECR permissions
# Or use imagePullSecrets for cross-account access
apiVersion: v1
kind: Secret
metadata:
  name: ecr-registry-secret
type: kubernetes.io/dockerconfigjson
data:
  .dockerconfigjson: <base64-encoded-config>

---
apiVersion: v1
kind: Pod
spec:
  imagePullSecrets:
  - name: ecr-registry-secret
  containers:
  - name: app
    image: ACCOUNT.dkr.ecr.us-west-2.amazonaws.com/my-app:latest
```

## Network Security

### Security Groups for Pods

```yaml
apiVersion: vpcresources.k8s.aws/v1beta1
kind: SecurityGroupPolicy
metadata:
  name: database-sg-policy
spec:
  podSelector:
    matchLabels:
      app: database
  securityGroups:
    groupIds:
      - sg-database123
```

### Network Policies

```yaml
# Deny all ingress by default
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: deny-all
  namespace: production
spec:
  podSelector: {}
  policyTypes:
  - Ingress

---
# Allow specific traffic
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-frontend-to-api
spec:
  podSelector:
    matchLabels:
      app: api
  ingress:
  - from:
    - podSelector:
        matchLabels:
          app: frontend
    ports:
    - protocol: TCP
      port: 8080
```

## Audit Logging

### Enable Control Plane Logs

```bash
# Enable all log types
eksctl utils update-cluster-logging \
  --cluster my-eks-cluster \
  --enable-types all \
  --approve

# Logs sent to CloudWatch: /aws/eks/my-eks-cluster/cluster
```

### Query Audit Logs

```bash
# Search for failed authentication
aws logs filter-log-events \
  --log-group-name /aws/eks/my-eks-cluster/cluster \
  --filter-pattern '{ $.verb = "get" && $.objectRef.resource = "secrets" }'

# Find who deleted a deployment
aws logs filter-log-events \
  --log-group-name /aws/eks/my-eks-cluster/cluster \
  --filter-pattern '{ $.verb = "delete" && $.objectRef.resource = "deployments" }'
```

## Runtime Security

### Falco for Runtime Threat Detection

```bash
# Install Falco
helm repo add falcosecurity https://falcosecurity.github.io/charts
helm install falco falcosecurity/falco \
  --namespace falco \
  --create-namespace

# View Falco alerts
kubectl logs -n falco -l app.kubernetes.io/name=falco
```

### Pod Security Context Enforcement

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: restricted-pod
spec:
  securityContext:
    seccompProfile:
      type: RuntimeDefault
  containers:
  - name: app
    image: my-app:latest
    securityContext:
      allowPrivilegeEscalation: false
      capabilities:
        drop:
        - ALL
      readOnlyRootFilesystem: true
      runAsNonRoot: true
      runAsUser: 1000
```

## Compliance and Governance

### AWS Config Rules

```yaml
# Check for compliant EKS clusters
Rules:
  - eks-cluster-secrets-encrypted
  - eks-endpoint-no-public-access
  - eks-cluster-logging-enabled
  - eks-cluster-supported-version
```

### Policy as Code with OPA

```yaml
# Install OPA Gatekeeper
kubectl apply -f https://raw.githubusercontent.com/open-policy-agent/gatekeeper/master/deploy/gatekeeper.yaml

# Constraint Template
apiVersion: templates.gatekeeper.sh/v1beta1
kind: ConstraintTemplate
metadata:
  name: k8srequiredlabels
spec:
  crd:
    spec:
      names:
        kind: K8sRequiredLabels
  targets:
    - target: admission.k8s.gatekeeper.sh
      rego: |
        package k8srequiredlabels
        violation[{"msg": msg}] {
          not input.review.object.metadata.labels.owner
          msg := "All resources must have 'owner' label"
        }
```

## Best Practices Checklist

```yaml
✅ Identity & Access:
  - Use IRSA for pod IAM permissions
  - Enable OIDC provider
  - Implement least privilege IAM policies
  - Regular IAM access review

✅ Network Security:
  - Private API endpoint for production
  - Security groups for pods
  - Network policies for pod-to-pod
  - VPC Flow Logs enabled

✅ Data Protection:
  - Encrypt secrets with KMS
  - Use AWS Secrets Manager
  - Enable encryption at rest
  - Secure etcd backups

✅ Runtime Security:
  - Pod Security Standards enforced
  - Image scanning enabled
  - Runtime threat detection (Falco)
  - Resource limits set

✅ Audit & Compliance:
  - Control plane logging enabled
  - CloudTrail for API calls
  - Config rules for compliance
  - Regular security scans

✅ Image Security:
  - Use specific image tags (not latest)
  - Scan images for vulnerabilities
  - Private image registries
  - Image pull secrets

✅ Updates & Patching:
  - Keep EKS version current
  - Regular node AMI updates
  - Patch critical vulnerabilities quickly
  - Test updates in non-prod first
```

## Security Incident Response

### Investigate Suspicious Activity

```bash
# Check recent API calls
kubectl get events --sort-by='.lastTimestamp'

# View pod logs
kubectl logs <suspicious-pod> --previous

# Check pod exec history
kubectl logs -n kube-system -l component=kube-apiserver | grep exec

# Review network connections
kubectl exec <pod> -- netstat -an
```

### Quarantine Compromised Pod

```yaml
# Remove pod from service
kubectl label pod compromised-pod app-
kubectl cordon <node>  # Prevent new pods
kubectl drain <node> --ignore-daemonsets  # Evacuate pods
```

## What's Next?

In **Part 5**, we'll cover scaling and performance:

- Cluster Autoscaler
- Horizontal Pod Autoscaler
- Vertical Pod Autoscaler
- Karpenter for advanced scaling
- Performance optimization

Stay tuned!

---

*Security questions? Let me know in the comments!*

