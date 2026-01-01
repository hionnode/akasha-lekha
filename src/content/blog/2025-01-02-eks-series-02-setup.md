---
title: "EKS Deep Dive Series Part 2: Setting Up Your First EKS Cluster"
date: "2025-01-02"
excerpt: "Get hands-on with Amazon EKS! Learn how to create your first production-ready cluster using eksctl, configure access, and deploy your first application."
tags: ["eks", "kubernetes", "aws", "cloud", "devops", "tutorial"]
featured: true
draft: false
series: "eks-deep-dive"
seriesPart: 2
seriesTotal: 5
---

## Introduction

In [Part 1](/blog/2025-01-01-eks-series-01-introduction), we covered EKS architecture and fundamentals. Now it's time to get our hands dirty! In this post, we'll create a production-ready EKS cluster, configure access, and deploy our first application.

## What We'll Build

```
┌──────────────────────────────────────┐
│         EKS Cluster                  │
│  ┌────────────────────────────────┐  │
│  │  2x t3.medium nodes            │  │
│  │  Across 2 AZs                  │  │
│  │  With nginx demo app           │  │
│  │  Exposed via LoadBalancer      │  │
│  └────────────────────────────────┘  │
└──────────────────────────────────────┘
```

## Prerequisites

### AWS Account Setup

```bash
# 1. AWS CLI installed and configured
aws --version
# Should output: aws-cli/2.x.x

# 2. Configure AWS credentials
aws configure
# Enter your Access Key, Secret Key, Region

# 3. Verify access
aws sts get-caller-identity
```

### Required IAM Permissions

You need permissions for:

```yaml
Services:
  - EC2: Create VPC, subnets, security groups
  - EKS: Create and manage clusters
  - IAM: Create roles and policies
  - CloudFormation: Stack management (used by eksctl)
```

Minimum policy (for learning):

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "eks:*",
        "ec2:*",
        "iam:*",
        "cloudformation:*"
      ],
      "Resource": "*"
    }
  ]
}
```

⚠️ **Note**: This is overly permissive. For production, use least-privilege policies.

### Install Required Tools

#### 1. eksctl (Recommended Method)

```bash
# macOS
brew install eksctl

# Linux
curl --silent --location "https://github.com/weaveworks/eksctl/releases/latest/download/eksctl_$(uname -s)_amd64.tar.gz" | tar xz -C /tmp
sudo mv /tmp/eksctl /usr/local/bin

# Verify
eksctl version
```

#### 2. kubectl

```bash
# macOS
brew install kubectl

# Linux
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
chmod +x kubectl
sudo mv kubectl /usr/local/bin/

# Verify
kubectl version --client
```

#### 3. Helpful Tools (Optional)

```bash
# k9s - Terminal UI for Kubernetes
brew install k9s

# kubectx/kubens - Context switching
brew install kubectx

# helm - Package manager
brew install helm
```

## Method 1: Create Cluster with eksctl (Easiest)

### Basic Cluster Creation

```bash
# Create cluster with defaults
eksctl create cluster \
  --name my-eks-cluster \
  --region us-west-2 \
  --nodegroup-name standard-workers \
  --node-type t3.medium \
  --nodes 2 \
  --nodes-min 1 \
  --nodes-max 4 \
  --managed

# This will take 15-20 minutes
```

### What eksctl Creates

```yaml
# AWS Resources:
1. VPC with CIDR 192.168.0.0/16
2. 6 Subnets (3 public, 3 private) across 3 AZs
3. Internet Gateway
4. NAT Gateways (one per AZ)
5. Route Tables
6. Security Groups
7. IAM Roles:
   - EKS Cluster Role
   - Node Instance Role
8. EKS Cluster
9. Managed Node Group
10. EC2 Instances (worker nodes)

# Kubernetes Resources:
- aws-auth ConfigMap
- coredns deployment
- kube-proxy daemonset
- VPC CNI plugin
```

### Monitor Cluster Creation

```bash
# In another terminal, watch CloudFormation stacks
watch -n 5 'aws cloudformation list-stacks \
  --stack-status-filter CREATE_IN_PROGRESS \
  --query "StackSummaries[].{Name:StackName,Status:StackStatus}" \
  --output table'

# eksctl creates 2 stacks:
# 1. eksctl-<cluster-name>-cluster
# 2. eksctl-<cluster-name>-nodegroup-<ng-name>
```

### Verify Cluster

```bash
# Check cluster status
eksctl get cluster --name my-eks-cluster --region us-west-2

# Get kubeconfig (automatically done by eksctl)
aws eks update-kubeconfig --name my-eks-cluster --region us-west-2

# Verify kubectl access
kubectl get nodes
# Should show 2 t3.medium nodes in Ready state

# Check system pods
kubectl get pods -n kube-system
```

## Method 2: Create Cluster with Custom Configuration

### Create Cluster Config File

```yaml
# cluster-config.yaml
apiVersion: eksctl.io/v1alpha5
kind: ClusterConfig

metadata:
  name: production-eks-cluster
  region: us-west-2
  version: "1.28"
  tags:
    Environment: production
    ManagedBy: eksctl
    Project: my-app

# VPC Configuration
vpc:
  cidr: 10.0.0.0/16
  nat:
    gateway: HighlyAvailable # One NAT GW per AZ
  clusterEndpoints:
    privateAccess: true
    publicAccess: true

# IAM OIDC Provider (required for IRSA)
iam:
  withOIDC: true
  serviceAccounts:
    - metadata:
        name: aws-load-balancer-controller
        namespace: kube-system
      attachPolicyARNs:
        - arn:aws:iam::aws:policy/ElasticLoadBalancingFullAccess

# Managed Node Groups
managedNodeGroups:
  - name: primary-ng
    instanceType: t3.medium
    minSize: 2
    maxSize: 4
    desiredCapacity: 2
    volumeSize: 20
    volumeType: gp3
    labels:
      role: primary
      environment: production
    tags:
      Name: primary-worker
      k8s.io/cluster-autoscaler/enabled: "true"
      k8s.io/cluster-autoscaler/production-eks-cluster: "owned"
    privateNetworking: true
    ssh:
      allow: true
      publicKeyName: my-ec2-keypair # Optional: for SSH access
    iam:
      withAddonPolicies:
        imageBuilder: true
        autoScaler: true
        ebs: true
        efs: true
        albIngress: true
        cloudWatch: true

  # Spot instance node group for cost savings
  - name: spot-ng
    instanceTypes:
      - t3.medium
      - t3a.medium
    spot: true
    minSize: 0
    maxSize: 10
    desiredCapacity: 2
    labels:
      role: spot
      workload: fault-tolerant
    taints:
      - key: spot
        value: "true"
        effect: NoSchedule

# Enable CloudWatch logging
cloudWatch:
  clusterLogging:
    enableTypes:
      - "api"
      - "audit"
      - "authenticator"
      - "controllerManager"
      - "scheduler"
    logRetentionInDays: 7

# Install essential add-ons
addons:
  - name: vpc-cni
    version: latest
  - name: coredns
    version: latest
  - name: kube-proxy
    version: latest
  - name: aws-ebs-csi-driver
    version: latest
```

### Create Cluster from Config

```bash
# Create cluster
eksctl create cluster -f cluster-config.yaml

# This provisions a more production-ready setup
```

## Method 3: Create Cluster with AWS Console (GUI)

### Step-by-Step Console Creation

#### 1. Navigate to EKS

```
AWS Console → EKS → Clusters → Add cluster → Create
```

#### 2. Configure Cluster

```yaml
Name: my-console-cluster
Kubernetes version: 1.28
Cluster service role:
  - Create new role OR
  - Select existing EKS service role

Secrets encryption: Enabled (recommended)
  - Select AWS KMS key

Tags:
  Environment: dev
  Owner: your-name
```

#### 3. Specify Networking

```yaml
VPC: Select or create new
Subnets: Minimum 2 in different AZs
Security groups: Default is usually sufficient
Cluster endpoint access:
  - Public and private (recommended for getting started)

Advanced settings:
  - Enable control plane logging (all types)
```

#### 4. Configure Add-ons

```yaml
# Select latest versions:
- Amazon VPC CNI
- CoreDNS
- kube-proxy
```

#### 5. Create Node Group (Separate Step)

After cluster is active:

```yaml
Compute → Add Node Group

Node Group configuration:
  Name: standard-workers
  Node IAM role: Create new or select existing
  
Node Group compute:
  AMI type: Amazon Linux 2 (AL2_x86_64)
  Capacity type: On-Demand
  Instance types: t3.medium
  Disk size: 20 GB
  
Scaling:
  Minimum: 1
  Maximum: 4
  Desired: 2

Update strategy:
  Max unavailable: 1
```

## Post-Creation Configuration

### 1. Verify Cluster

```bash
# List clusters
aws eks list-clusters --region us-west-2

# Describe cluster
aws eks describe-cluster --name my-eks-cluster

# Get cluster status
eksctl get cluster --name my-eks-cluster
```

### 2. Configure kubectl

```bash
# Update kubeconfig
aws eks update-kubeconfig \
  --name my-eks-cluster \
  --region us-west-2 \
  --alias my-cluster

# Verify connection
kubectl get svc

# Check nodes
kubectl get nodes -o wide

# View node details
kubectl describe node <node-name>
```

### 3. Explore Cluster Resources

```bash
# View namespaces
kubectl get namespaces

# Check system pods
kubectl get pods -n kube-system

# View services
kubectl get svc --all-namespaces

# Check ConfigMaps
kubectl get configmap -n kube-system

# View aws-auth ConfigMap (controls IAM access)
kubectl get configmap aws-auth -n kube-system -o yaml
```

## Deploy Your First Application

### Create Deployment

```yaml
# nginx-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
  labels:
    app: nginx
spec:
  replicas: 3
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx:1.24
        ports:
        - containerPort: 80
        resources:
          requests:
            cpu: 100m
            memory: 128Mi
          limits:
            cpu: 250m
            memory: 256Mi
        livenessProbe:
          httpGet:
            path: /
            port: 80
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /
            port: 80
          initialDelaySeconds: 5
          periodSeconds: 5
```

### Create Service

```yaml
# nginx-service.yaml
apiVersion: v1
kind: Service
metadata:
  name: nginx-service
  annotations:
    service.beta.kubernetes.io/aws-load-balancer-type: "nlb"
    service.beta.kubernetes.io/aws-load-balancer-cross-zone-load-balancing-enabled: "true"
spec:
  selector:
    app: nginx
  ports:
    - protocol: TCP
      port: 80
      targetPort: 80
  type: LoadBalancer
```

### Deploy Application

```bash
# Apply deployment
kubectl apply -f nginx-deployment.yaml

# Verify deployment
kubectl get deployments
kubectl get pods -l app=nginx

# Apply service
kubectl apply -f nginx-service.yaml

# Get service (wait for EXTERNAL-IP)
kubectl get svc nginx-service

# Watch for LoadBalancer creation (takes 2-3 minutes)
kubectl get svc nginx-service -w
```

### Test Application

```bash
# Get LoadBalancer URL
LB_URL=$(kubectl get svc nginx-service -o jsonpath='{.status.loadBalancer.ingress[0].hostname}')

echo "Application URL: http://$LB_URL"

# Test with curl
curl http://$LB_URL

# Should return nginx welcome page HTML

# Test in browser
open http://$LB_URL # macOS
# Or paste URL in browser
```

## Understanding What Was Created in AWS

### EKS Cluster Resources

```bash
# View cluster in console
aws eks describe-cluster \
  --name my-eks-cluster \
  --query 'cluster.{Name:name,Status:status,Endpoint:endpoint,Version:version}' \
  --output table
```

### EC2 Instances (Worker Nodes)

```bash
# List EC2 instances
aws ec2 describe-instances \
  --filters "Name=tag:eks:cluster-name,Values=my-eks-cluster" \
  --query 'Reservations[*].Instances[*].{ID:InstanceId,Type:InstanceType,State:State.Name,IP:PrivateIpAddress}' \
  --output table
```

### VPC and Networking

```bash
# Get VPC ID
VPC_ID=$(aws eks describe-cluster \
  --name my-eks-cluster \
  --query 'cluster.resourcesVpcConfig.vpcId' \
  --output text)

# View VPC details
aws ec2 describe-vpcs --vpc-ids $VPC_ID

# List subnets
aws ec2 describe-subnets \
  --filters "Name=vpc-id,Values=$VPC_ID" \
  --query 'Subnets[*].{ID:SubnetId,CIDR:CidrBlock,AZ:AvailabilityZone,Public:MapPublicIpOnLaunch}' \
  --output table
```

### Security Groups

```bash
# List security groups
aws ec2 describe-security-groups \
  --filters "Name=vpc-id,Values=$VPC_ID" \
  --query 'SecurityGroups[*].{ID:GroupId,Name:GroupName,Description:Description}' \
  --output table
```

### Load Balancer (Created by Service)

```bash
# List load balancers
aws elbv2 describe-load-balancers \
  --query 'LoadBalancers[*].{Name:LoadBalancerName,DNS:DNSName,State:State.Code}' \
  --output table
```

### CloudFormation Stacks

```bash
# List stacks created by eksctl
aws cloudformation list-stacks \
  --query 'StackSummaries[?contains(StackName, `my-eks-cluster`)].{Name:StackName,Status:StackStatus}' \
  --output table
```

## Cluster Cost Analysis

### Monthly Cost Breakdown

```yaml
# EKS Control Plane:
$0.10/hour × 730 hours = $73.00/month

# Worker Nodes (2x t3.medium):
$0.0416/hour × 2 × 730 hours = $60.74/month

# Network Load Balancer:
$0.0225/hour × 730 hours = $16.43/month
Data transfer: ~$5-20/month (varies)

# Total Estimated Cost:
~$155-170/month
```

### Cost Optimization Tips

```bash
# 1. Use Spot Instances (60-90% savings)
eksctl create nodegroup \
  --cluster my-eks-cluster \
  --name spot-ng \
  --instance-types t3.medium,t3a.medium \
  --spot

# 2. Stop cluster when not in use (dev/test)
eksctl scale nodegroup --cluster my-eks-cluster --name standard-workers --nodes 0

# 3. Use Fargate for batch jobs (pay per pod)
# 4. Right-size node instances
# 5. Enable cluster autoscaler
```

## Common Issues and Troubleshooting

### Issue 1: Nodes Not Appearing

```bash
# Check node group status
eksctl get nodegroup --cluster my-eks-cluster

# Describe node group
aws eks describe-nodegroup \
  --cluster-name my-eks-cluster \
  --nodegroup-name standard-workers

# Check CloudFormation events
aws cloudformation describe-stack-events \
  --stack-name eksctl-my-eks-cluster-nodegroup-standard-workers \
  --max-items 10
```

### Issue 2: Cannot Access Cluster

```bash
# Verify IAM user/role
aws sts get-caller-identity

# Check aws-auth ConfigMap
kubectl get configmap aws-auth -n kube-system -o yaml

# Add yourself to aws-auth (if needed)
eksctl create iamidentitymapping \
  --cluster my-eks-cluster \
  --arn arn:aws:iam::ACCOUNT_ID:user/USERNAME \
  --group system:masters \
  --username admin
```

### Issue 3: Pods Stuck in Pending

```bash
# Describe pod
kubectl describe pod <pod-name>

# Common causes:
# 1. Insufficient resources
kubectl top nodes

# 2. Taints on nodes
kubectl get nodes -o json | jq '.items[].spec.taints'

# 3. Pod anti-affinity rules
# 4. PVC provisioning issues
```

### Issue 4: LoadBalancer Not Creating

```bash
# Check service
kubectl describe svc nginx-service

# Check events
kubectl get events --sort-by='.lastTimestamp'

# Common causes:
# 1. Subnet missing required tags
# 2. IAM permissions insufficient
# 3. Security group rules blocking traffic
# 4. No available subnets with free IPs
```

## Best Practices for Production

### 1. High Availability

```yaml
# Spread nodes across AZs
managedNodeGroups:
  - name: primary
    minSize: 3 # At least one per AZ
    availabilityZones:
      - us-west-2a
      - us-west-2b
      - us-west-2c
```

### 2. Security

```bash
# Enable secrets encryption
aws eks create-cluster \
  --encryption-config '[{"resources":["secrets"],"provider":{"keyArn":"arn:aws:kms:..."}}]'

# Use private endpoints for production
vpc:
  clusterEndpoints:
    privateAccess: true
    publicAccess: false # Access via VPN/Bastion
```

### 3. Monitoring

```bash
# Enable control plane logging
eksctl utils update-cluster-logging \
  --cluster my-eks-cluster \
  --enable-types all \
  --approve

# Install metrics server
kubectl apply -f https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml
```

### 4. Updates

```yaml
# Configure maintenance windows
# Plan upgrade strategy (rolling updates)
# Test in dev/staging first
# Keep nodes within 2 minor versions of control plane
```

## Cleanup Resources

### Delete Application

```bash
# Delete service (removes LoadBalancer)
kubectl delete svc nginx-service

# Delete deployment
kubectl delete deployment nginx-deployment
```

### Delete Cluster

```bash
# With eksctl (deletes all resources)
eksctl delete cluster --name my-eks-cluster --region us-west-2

# Manual deletion (if created via console)
# 1. Delete node groups
aws eks delete-nodegroup \
  --cluster-name my-eks-cluster \
  --nodegroup-name standard-workers

# 2. Delete cluster (after node groups are deleted)
aws eks delete-cluster --name my-eks-cluster

# 3. Delete VPC and related resources (if created separately)
```

### Verify Deletion

```bash
# Check CloudFormation stacks
aws cloudformation list-stacks \
  --stack-status-filter DELETE_IN_PROGRESS

# Verify no resources remain
aws eks list-clusters
aws ec2 describe-instances --filters "Name=tag:eks:cluster-name,Values=my-eks-cluster"
```

## What's Next?

In **Part 3**, we'll dive deep into EKS networking:

- VPC CNI deep dive
- Pod networking and IP management
- Load balancer types (ALB vs NLB)
- Ingress controllers
- Service meshes
- Network policies

## Quick Reference Commands

```bash
# Cluster management
eksctl create cluster -f config.yaml
eksctl get cluster
eksctl delete cluster --name <name>
eksctl scale nodegroup --cluster <cluster> --name <ng> --nodes <count>

# kubectl basics
kubectl get nodes
kubectl get pods --all-namespaces
kubectl get svc
kubectl describe pod <pod-name>
kubectl logs <pod-name>
kubectl exec -it <pod-name> -- /bin/bash

# Monitoring
kubectl top nodes
kubectl top pods
kubectl get events --sort-by='.lastTimestamp'

# Config
kubectl config get-contexts
kubectl config use-context <context>
kubectl config set-context --current --namespace=<namespace>
```

## Conclusion

Congratulations! You've successfully created your first EKS cluster and deployed an application. You now understand:

✅ How to create clusters with eksctl and AWS Console  
✅ Cluster architecture and AWS resources created  
✅ How to deploy and expose applications  
✅ Basic troubleshooting techniques  
✅ Cost considerations and optimization strategies

In the next post, we'll explore EKS networking in depth, including advanced load balancing, ingress, and service mesh concepts.

Stay tuned for **Part 3: Networking in EKS**!

---

*Did you run into any issues? Have questions? Drop a comment below or reach out!*

