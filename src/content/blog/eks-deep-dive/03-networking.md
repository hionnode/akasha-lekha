---
title: "EKS Deep Dive Series Part 3: Networking in EKS"
date: "2025-01-03"
excerpt: "Master EKS networking with VPC CNI, pod networking, load balancers, ingress controllers, and network policies for production-grade deployments."
tags: ["eks", "kubernetes", "networking", "aws", "vpc", "devops"]
featured: true
draft: false
series: "eks-deep-dive"
seriesPart: 3
---

## Introduction

Networking is one of the most critical and complex aspects of running Kubernetes on AWS. In this post, we'll explore how EKS handles networking, from pod IP assignment to external traffic routing.

## EKS Networking Architecture

```
┌───────────────────────────────────────────────────────┐
│                   AWS VPC (10.0.0.0/16)              │
│  ┌────────────────────────────────────────────────┐  │
│  │  Subnet 10.0.1.0/24 (AZ-a)                     │  │
│  │  ┌──────────┐  ┌──────────┐                    │  │
│  │  │  Node 1  │  │  Node 2  │                    │  │
│  │  │  ┌────┐  │  │  ┌────┐  │                    │  │
│  │  │  │Pod │  │  │  │Pod │  │ (VPC IPs)          │  │
│  │  │  │10  │  │  │  │10  │  │                    │  │
│  │  │  │.0  │  │  │  │.0  │  │                    │  │
│  │  │  │.1  │  │  │  │.1  │  │                    │  │
│  │  │  │.5  │  │  │  │.20 │  │                    │  │
│  │  │  └────┘  │  │  └────┘  │                    │  │
│  │  └──────────┘  └──────────┘                    │  │
│  └────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────┐  │
│  │  Subnet 10.0.2.0/24 (AZ-b)                     │  │
│  │  ┌──────────┐                                  │  │
│  │  │  Node 3  │                                  │  │
│  │  │  ┌────┐  │                                  │  │
│  │  │  │Pod │  │                                  │  │
│  │  │  │10  │  │                                  │  │
│  │  │  │.0  │  │                                  │  │
│  │  │  │.2  │  │                                  │  │
│  │  │  │.8  │  │                                  │  │
│  │  │  └────┘  │                                  │  │
│  │  └──────────┘                                  │  │
│  └────────────────────────────────────────────────┘  │
└───────────────────────────────────────────────────────┘
```

## VPC CNI Plugin Deep Dive

### How VPC CNI Works

Unlike traditional Kubernetes networking (like Calico or Flannel), AWS VPC CNI assigns real VPC IP addresses to pods:

```yaml
Key Features:
  - Pods get first-class VPC IPs
  - No NAT for pod-to-pod traffic
  - Native VPC networking integration
  - Security groups can apply to pods
  - Network ACLs and flow logs work natively
```

### ENI and IP Management

```bash
# Each EC2 instance has:
# 1. Primary ENI (for node communication)
# 2. Secondary ENIs (for pod IPs)

# IP allocation per node:
# max_pods = (ENIs_per_instance × IPs_per_ENI) - 1

# Example: t3.medium
# ENIs: 3
# IPs per ENI: 6
# Max pods: (3 × 6) - 1 = 17 pods

# Example: m5.large
# ENIs: 3
# IPs per ENI: 10
# Max pods: (3 × 10) - 1 = 29 pods
```

### View ENI Configuration

```bash
# On worker node, check ENIs
kubectl get nodes -o json | jq '.items[].status.allocatable'

# View VPC CNI daemonset
kubectl get daemonset aws-node -n kube-system

# Check CNI logs
kubectl logs -n kube-system -l k8s-app=aws-node

# View IP allocation
kubectl describe node <node-name> | grep Allocatable -A 5
```

### Configure VPC CNI

```yaml
# VPC CNI environment variables
apiVersion: v1
kind: ConfigMap
metadata:
  name: amazon-vpc-cni
  namespace: kube-system
data:
  # Enable prefix delegation (increases pod density)
  ENABLE_PREFIX_DELEGATION: "true"
  
  # Warm IP target (pre-allocated IPs)
  WARM_IP_TARGET: "3"
  
  # Minimum number of IPs
  MINIMUM_IP_TARGET: "10"
  
  # Maximum IPs per ENI
  WARM_ENI_TARGET: "1"
  
  # Enable network policy
  AWS_VPC_K8S_CNI_EXTERNALSNAT: "false"
```

### Prefix Delegation Mode

```yaml
# Increases pod density significantly
# Instead of individual IPs, allocates /28 prefixes

# Example: t3.medium with prefix delegation
# Without: 17 pods
# With: 110 pods!

# Enable prefix delegation:
kubectl set env daemonset aws-node \
  -n kube-system \
  ENABLE_PREFIX_DELEGATION=true

# Requires VPC CNI v1.9+
```

## Pod Networking

### Pod-to-Pod Communication

```yaml
# Within same node: Direct routing via bridge
Pod A (10.0.1.5) → veth → bridge → veth → Pod B (10.0.1.8)

# Across nodes: VPC routing
Pod A (Node 1, 10.0.1.5) → VPC Route → Pod C (Node 2, 10.0.2.10)

# No NAT, no overlay network
# Full visibility in VPC flow logs
```

### Security Groups for Pods

```yaml
# Assign security groups to pods (not just nodes)
apiVersion: vpcresources.k8s.aws/v1beta1
kind: SecurityGroupPolicy
metadata:
  name: my-app-sgp
  namespace: default
spec:
  podSelector:
    matchLabels:
      app: my-app
  securityGroups:
    groupIds:
      - sg-0123456789abcdef0
```

### Network Policy Example

```yaml
# Restrict pod-to-pod traffic
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: api-allow-from-frontend
  namespace: production
spec:
  podSelector:
    matchLabels:
      app: api
  policyTypes:
    - Ingress
  ingress:
    - from:
        - podSelector:
            matchLabels:
              app: frontend
      ports:
        - protocol: TCP
          port: 8080
```

## Service Types and Load Balancing

### LoadBalancer Service (Classic)

```yaml
# Creates AWS Classic Load Balancer
apiVersion: v1
kind: Service
metadata:
  name: nginx-clb
spec:
  type: LoadBalancer
  selector:
    app: nginx
  ports:
    - port: 80
      targetPort: 80
```

### Network Load Balancer

```yaml
# More performant, Layer 4
apiVersion: v1
kind: Service
metadata:
  name: nginx-nlb
  annotations:
    service.beta.kubernetes.io/aws-load-balancer-type: "nlb"
    service.beta.kubernetes.io/aws-load-balancer-cross-zone-load-balancing-enabled: "true"
    service.beta.kubernetes.io/aws-load-balancer-backend-protocol: "tcp"
spec:
  type: LoadBalancer
  selector:
    app: nginx
  ports:
    - port: 80
      targetPort: 80
```

### Internal Load Balancer

```yaml
# Private load balancer (not internet-facing)
apiVersion: v1
kind: Service
metadata:
  name: internal-service
  annotations:
    service.beta.kubernetes.io/aws-load-balancer-internal: "true"
    service.beta.kubernetes.io/aws-load-balancer-type: "nlb"
spec:
  type: LoadBalancer
  selector:
    app: internal-app
  ports:
    - port: 80
```

## AWS Load Balancer Controller

### Why Use ALB Controller?

```yaml
Benefits:
  - Application Load Balancer (Layer 7)
  - Advanced routing (path, host, headers)
  - Cognito/OIDC authentication
  - WAF integration
  - Cost savings (one ALB for multiple services)
  - Better for HTTP/HTTPS traffic
```

### Install ALB Controller

```bash
# 1. Create IAM OIDC provider
eksctl utils associate-iam-oidc-provider \
  --cluster my-eks-cluster \
  --approve

# 2. Create IAM policy
curl -o iam-policy.json https://raw.githubusercontent.com/kubernetes-sigs/aws-load-balancer-controller/v2.6.0/docs/install/iam_policy.json

aws iam create-policy \
  --policy-name AWSLoadBalancerControllerIAMPolicy \
  --policy-document file://iam-policy.json

# 3. Create service account
eksctl create iamserviceaccount \
  --cluster=my-eks-cluster \
  --namespace=kube-system \
  --name=aws-load-balancer-controller \
  --attach-policy-arn=arn:aws:iam::ACCOUNT_ID:policy/AWSLoadBalancerControllerIAMPolicy \
  --override-existing-serviceaccounts \
  --approve

# 4. Install controller via Helm
helm repo add eks https://aws.github.io/eks-charts
helm install aws-load-balancer-controller eks/aws-load-balancer-controller \
  -n kube-system \
  --set clusterName=my-eks-cluster \
  --set serviceAccount.create=false \
  --set serviceAccount.name=aws-load-balancer-controller

# Verify installation
kubectl get deployment -n kube-system aws-load-balancer-controller
```

### Ingress with ALB

```yaml
# Application Load Balancer ingress
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: app-ingress
  annotations:
    alb.ingress.kubernetes.io/scheme: internet-facing
    alb.ingress.kubernetes.io/target-type: ip
    alb.ingress.kubernetes.io/listen-ports: '[{"HTTP": 80}, {"HTTPS": 443}]'
    alb.ingress.kubernetes.io/certificate-arn: arn:aws:acm:us-west-2:ACCOUNT:certificate/...
    alb.ingress.kubernetes.io/ssl-redirect: '443'
    alb.ingress.kubernetes.io/healthcheck-path: /health
spec:
  ingressClassName: alb
  rules:
    - host: api.example.com
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: api-service
                port:
                  number: 80
    - host: www.example.com
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: frontend-service
                port:
                  number: 80
```

### Advanced ALB Features

```yaml
# WAF integration
alb.ingress.kubernetes.io/wafv2-acl-arn: arn:aws:wafv2:...

# Cognito authentication
alb.ingress.kubernetes.io/auth-type: cognito
alb.ingress.kubernetes.io/auth-idp-cognito: '{"UserPoolArn":"...","UserPoolClientId":"...","UserPoolDomain":"..."}'

# Custom target group attributes
alb.ingress.kubernetes.io/target-group-attributes: stickiness.enabled=true,stickiness.lb_cookie.duration_seconds=3600

# Header-based routing
alb.ingress.kubernetes.io/conditions.rule1: '[{"field":"http-header","httpHeaderConfig":{"httpHeaderName":"User-Agent","values":["*Mobile*"]}}]'
```

## DNS and Service Discovery

### CoreDNS Configuration

```yaml
# CoreDNS is the default DNS server
# View ConfigMap:
kubectl get configmap coredns -n kube-system -o yaml

# Service DNS format:
# <service-name>.<namespace>.svc.cluster.local

# Example:
# Service: my-api in namespace: production
# DNS: my-api.production.svc.cluster.local
```

### External DNS

```yaml
# Automatically create Route53 records for services/ingress

# Install External DNS
apiVersion: apps/v1
kind: Deployment
metadata:
  name: external-dns
spec:
  template:
    spec:
      serviceAccountName: external-dns
      containers:
      - name: external-dns
        image: k8s.gcr.io/external-dns/external-dns:v0.13.5
        args:
        - --source=service
        - --source=ingress
        - --domain-filter=example.com
        - --provider=aws
        - --policy=upsert-only
        - --aws-zone-type=public
        - --registry=txt
        - --txt-owner-id=my-eks-cluster
```

## Network Troubleshooting

### Debug Pod Network Issues

```bash
# Check pod IP
kubectl get pod <pod-name> -o wide

# Exec into pod
kubectl exec -it <pod-name> -- /bin/sh

# Test DNS resolution
nslookup kubernetes.default.svc.cluster.local

# Test connectivity
curl http://service-name.namespace.svc.cluster.local

# Ping another pod (if ping is available)
ping <pod-ip>

# Check routes
ip route

# View network interfaces
ip addr show
```

### Debug Service Issues

```bash
# Check service endpoints
kubectl get endpoints <service-name>

# Describe service
kubectl describe svc <service-name>

# Check if pods match selector
kubectl get pods -l app=<label>

# Test service internally
kubectl run test-pod --image=busybox -it --rm -- wget -O- http://service-name

# Check kube-proxy logs
kubectl logs -n kube-system -l k8s-app=kube-proxy
```

### Debug Load Balancer Issues

```bash
# Check service events
kubectl describe svc <service-name>

# Verify security groups
aws ec2 describe-security-groups \
  --filters "Name=tag:kubernetes.io/cluster/my-eks-cluster,Values=owned"

# Check ALB controller logs
kubectl logs -n kube-system deployment/aws-load-balancer-controller

# Verify target groups
aws elbv2 describe-target-groups \
  --query 'TargetGroups[*].{Name:TargetGroupName,Health:HealthCheckPath}'

# Check target health
aws elbv2 describe-target-health \
  --target-group-arn <arn>
```

## Network Performance Optimization

### Enable IPv6 (Dual Stack)

```yaml
# Increases available IPs significantly
# Enable during cluster creation:
eksctl create cluster \
  --name ipv6-cluster \
  --ip-family ipv6

# Or configure VPC CNI for IPv6:
kubectl set env daemonset aws-node \
  -n kube-system \
  ENABLE_IPv6=true
```

### Optimize CNI Configuration

```yaml
# Reduce warm IP pool to save IPs
kubectl set env daemonset aws-node \
  -n kube-system \
  WARM_IP_TARGET=1

# Enable prefix delegation
kubectl set env daemonset aws-node \
  -n kube-system \
  ENABLE_PREFIX_DELEGATION=true

# Tune for high-density workloads
MINIMUM_IP_TARGET=10
WARM_ENI_TARGET=0
WARM_PREFIX_TARGET=1
```

### Network Bandwidth Optimization

```bash
# Use enhanced networking instances
# c5n, m5n, r5n families have higher bandwidth

# Enable ENA (Elastic Network Adapter)
# Verify ENA is enabled
aws ec2 describe-instances \
  --instance-ids i-1234567890abcdef0 \
  --query 'Reservations[0].Instances[0].EnaSupport'

# Use placement groups for low latency
# Cluster placement group for nodes running latency-sensitive workloads
```

## Best Practices

### 1. Subnet Planning

```yaml
# Allocate sufficient IP space
Production:
  - VPC: /16 (65,536 IPs)
  - Pod subnets: /19 per AZ (8,192 IPs each)
  - Node subnets: /24 per AZ (256 IPs each)

# Leave room for growth
# Calculate: nodes × max_pods_per_node × 1.5 (buffer)
```

### 2. Security

```yaml
# Use private subnets for nodes
# Enable VPC Flow Logs
# Implement Network Policies
# Use security groups for pods
# Enable encryption in transit (TLS)
```

### 3. High Availability

```yaml
# Multi-AZ deployment
# Cross-zone load balancing
# Pod topology spread constraints
# PodDisruptionBudgets
```

### 4. Monitoring

```bash
# Monitor CNI metrics
kubectl top nodes
kubectl top pods

# Enable VPC Flow Logs
aws ec2 create-flow-logs \
  --resource-type VPC \
  --resource-ids vpc-xxx \
  --traffic-type ALL \
  --log-destination-type cloud-watch-logs \
  --log-group-name /aws/vpc/flowlogs

# Use AWS CloudWatch Container Insights
```

## What's Next?

In **Part 4**, we'll cover EKS security in depth:

- IAM Roles for Service Accounts (IRSA)
- Pod Security Standards
- Secrets management with AWS Secrets Manager
- Image scanning and security
- Audit logging and compliance

Stay tuned!

---

*Questions about EKS networking? Drop a comment below!*

