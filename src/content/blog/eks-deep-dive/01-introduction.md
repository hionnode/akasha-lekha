---
title: "EKS Deep Dive Series Part 1: Introduction to Amazon EKS"
date: "2025-01-01"
excerpt: "Begin your journey into Amazon EKS with this comprehensive introduction covering architecture, core concepts, and when to use EKS over self-managed Kubernetes."
tags: ["eks", "kubernetes", "aws", "cloud", "devops"]
featured: true
draft: false
series: "eks-deep-dive"
seriesPart: 1
---

## Welcome to the EKS Deep Dive Series

Amazon Elastic Kubernetes Service (EKS) is AWS's managed Kubernetes service that simplifies running Kubernetes on AWS without needing to install, operate, and maintain your own Kubernetes control plane. This comprehensive series will take you from EKS fundamentals to production-grade deployments.

## What You'll Learn in This Series

:::tip
This is a hands-on series! Each part includes practical examples and commands you can run in your own AWS account. Make sure you have the AWS CLI and kubectl installed before starting.
:::

Over the next several posts, we'll cover:

1. **Part 1 (This Post)**: EKS Architecture & Fundamentals
2. **Part 2**: Setting Up Your First EKS Cluster
3. **Part 3**: Networking in EKS - VPC, Subnets, and Load Balancing
4. **Part 4**: Security Best Practices - IAM Roles, IRSA, and Pod Security
5. **Part 5**: Scaling and Performance Optimization
6. **Part 6**: Observability - Logging, Monitoring, and Tracing

## Why Amazon EKS?

### The Kubernetes Management Challenge

Running self-managed Kubernetes involves:

- **Control Plane Management**: etcd backups, API server scaling, version upgrades
- **High Availability**: Multi-master setups, load balancing, fault tolerance
- **Security**: Certificate management, authentication, authorization, audit logging
- **Operational Overhead**: Monitoring, alerting, incident response

### What EKS Provides

:::note
EKS follows Kubernetes upstream with minimal changes, ensuring compatibility with standard Kubernetes tools and practices.
:::

Amazon EKS takes care of:

✅ **Managed Control Plane**: AWS operates the Kubernetes control plane across multiple AZs  
✅ **Automated Updates**: Seamless Kubernetes version upgrades  
✅ **High Availability**: 99.95% SLA with multi-AZ control plane  
✅ **Security**: Integrated with AWS IAM, VPC, and security services  
✅ **Scalability**: Auto-scales control plane based on cluster load  
✅ **Compliance**: HIPAA, PCI DSS, SOC, ISO certified

## EKS Architecture Overview

### Control Plane Architecture

```
┌─────────────────────────────────────────────────────┐
│              AWS Managed Control Plane              │
│  ┌─────────────────────────────────────────────┐   │
│  │  AZ1          AZ2          AZ3              │   │
│  │  ┌──────┐    ┌──────┐    ┌──────┐          │   │
│  │  │ API  │    │ API  │    │ API  │          │   │
│  │  │Server│    │Server│    │Server│          │   │
│  │  └──┬───┘    └──┬───┘    └──┬───┘          │   │
│  │     │           │           │               │   │
│  │  ┌──▼─────────▼─────────▼──┐               │   │
│  │  │     etcd (HA Cluster)    │               │   │
│  │  └──────────────────────────┘               │   │
│  └─────────────────────────────────────────────┘   │
└──────────────────┬──────────────────────────────────┘
                   │
        ┌──────────▼──────────┐
        │   Elastic Network   │
        │    Interface (ENI)  │
        └──────────┬──────────┘
                   │
┌──────────────────▼──────────────────────────────────┐
│              Customer VPC (Data Plane)              │
│  ┌────────────────────────────────────────────┐    │
│  │  Worker Node 1  │  Worker Node 2  │ ...   │    │
│  │  ┌──────────┐   │  ┌──────────┐   │       │    │
│  │  │  Kubelet │   │  │  Kubelet │   │       │    │
│  │  │  Pods    │   │  │  Pods    │   │       │    │
│  │  └──────────┘   │  └──────────┘   │       │    │
│  └────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────┘
```

### Key Components

#### 1. Control Plane (AWS Managed)

The EKS control plane consists of:

- **API Server**: Exposes the Kubernetes API
- **etcd**: Distributed key-value store for cluster data
- **Controller Manager**: Runs core controllers
- **Scheduler**: Assigns pods to nodes
- **Cloud Controller Manager**: Integrates with AWS services

#### 2. Data Plane (Customer Managed)

Worker nodes running in your VPC:

- **EC2 Instances**: Traditional compute instances
- **Fargate**: Serverless compute for containers (we'll cover this in Part 6)
- **EKS Optimized AMIs**: Pre-configured with kubelet, Docker/containerd
- **Node Groups**: Managed or self-managed collections of nodes

### Network Communication

```yaml
# Communication Flows:
1. kubectl → API Server (via AWS Public/Private Endpoint)
2. API Server ↔ Worker Nodes (via ENI in your VPC)
3. Worker Nodes ↔ AWS Services (via VPC routing)
4. Pods ↔ Pods (via AWS VPC CNI)
```

## EKS vs Self-Managed Kubernetes

| Aspect | Self-Managed K8s | Amazon EKS |
|--------|------------------|------------|
| **Control Plane** | You manage | AWS manages |
| **etcd Backups** | Manual setup | Automated |
| **HA Setup** | Complex multi-master | Built-in multi-AZ |
| **Version Upgrades** | Manual, risky | Managed, safer |
| **Cost** | EC2 + overhead | $0.10/hour + EC2 |
| **Security Patching** | Your responsibility | Automated |
| **SLA** | None | 99.95% |
| **Initial Setup** | Days/weeks | Hours |
| **Maintenance** | Ongoing effort | Minimal |

## When to Choose EKS

### ✅ Good Use Cases for EKS

1. **Production Workloads**: Need high availability and SLA
2. **Enterprise Applications**: Require compliance certifications
3. **AWS-Native**: Already using AWS services extensively
4. **Limited Ops Team**: Don't want control plane management burden
5. **Regulatory Requirements**: Need audit logs, encryption, compliance

### ⚠️ Consider Alternatives When

1. **Cost-Sensitive Development**: Consider minikube, kind, or k3s for dev
2. **Multi-Cloud Strategy**: Tools like GKE, AKS, or Rancher might fit better
3. **Edge Computing**: Consider k3s or lightweight distributions
4. **Learning**: Self-managed might teach more fundamentals

## EKS Cluster Types

### 1. Standard EKS Cluster

```bash
# Traditional cluster with EC2 worker nodes
- Control Plane: AWS Managed
- Data Plane: EC2 instances in your VPC
- Use Case: Full control over nodes, cost optimization
```

### 2. EKS with Fargate

```bash
# Serverless compute for containers
- Control Plane: AWS Managed
- Data Plane: Fargate (serverless)
- Use Case: Zero node management, batch jobs, stateless apps
```

### 3. EKS Anywhere

```bash
# On-premises Kubernetes using EKS
- Control Plane: Your data center
- Data Plane: Your infrastructure
- Use Case: Hybrid cloud, data sovereignty, edge
```

### 4. EKS Distro (EKS-D)

```bash
# Open-source Kubernetes distribution
- Same Kubernetes used in EKS
- Self-managed everywhere
- Use Case: Consistent K8s version across environments
```

## Cost Breakdown

### Control Plane Cost

```
$0.10 per hour per cluster = $73/month
```

### Worker Node Costs (Examples)

```yaml
# t3.medium (2 vCPU, 4GB RAM)
- On-Demand: $0.0416/hour = ~$30/month
- Spot: ~$12-15/month (60-70% savings)

# m5.large (2 vCPU, 8GB RAM)
- On-Demand: $0.096/hour = ~$70/month
- Spot: ~$25-35/month

# Example 3-node cluster cost:
Control Plane: $73/month
3x t3.medium: $90/month
Total: ~$163/month
```

### Cost Optimization Tips

1. **Use Spot Instances**: 60-90% savings for fault-tolerant workloads
2. **Right-Size Nodes**: Start small, scale as needed
3. **Cluster Autoscaler**: Scale nodes based on demand
4. **Fargate for Burst**: Use for temporary workloads
5. **Reserved Instances**: For predictable, long-running workloads

## EKS API Endpoints

### Public Endpoint (Default)

```yaml
# Accessible from internet (with authentication)
Pros:
  - Easy to access from anywhere
  - Simple setup
  - No VPN required

Cons:
  - Exposed to internet (albeit secured)
  - Network latency for on-prem access
```

### Private Endpoint

```yaml
# Accessible only from within VPC
Pros:
  - Maximum security
  - Not exposed to internet
  - Lower latency from VPC

Cons:
  - Requires VPN/Direct Connect for remote access
  - More complex setup
```

### Combined (Recommended for Production)

```yaml
# Both public and private endpoints enabled
Pros:
  - Flexibility for different access patterns
  - CI/CD from internet + secure internal access
  - Best of both worlds

Cons:
  - Slightly higher cost (minimal)
```

## EKS Add-ons

AWS provides managed add-ons:

### Core Add-ons

```yaml title="core-addons.yaml"
# 1. VPC CNI - Pod Networking
Purpose: Assigns VPC IP addresses to pods
Why: Native AWS networking integration

# 2. kube-proxy - Service Networking
Purpose: Network rules for service access
Why: Required for Kubernetes services

# 3. CoreDNS - Service Discovery
Purpose: DNS resolution for services
Why: Required for service name resolution

# 4. EBS CSI Driver - Persistent Storage
Purpose: Dynamic volume provisioning with EBS
Why: Persistent storage for stateful apps

# 5. EFS CSI Driver - Shared Storage
Purpose: Shared file system across pods
Why: Multi-pod read-write access
```

### Optional Add-ons

```yaml
# AWS Load Balancer Controller
Purpose: Create ALB/NLB for ingress
Use: Replace default load balancer

# Cluster Autoscaler
Purpose: Auto-scale worker nodes
Use: Dynamic capacity management

# Metrics Server
Purpose: Resource metrics for HPA
Use: Horizontal pod autoscaling

# Prometheus/Grafana
Purpose: Monitoring and alerting
Use: Observability
```

## EKS Authentication & Authorization

### AWS IAM Integration

```yaml
# EKS uses AWS IAM for authentication
Authentication Flow:
  1. User/Role assumes AWS IAM identity
  2. aws-iam-authenticator generates token
  3. Token sent to API server
  4. API server validates with AWS STS
  5. Kubernetes RBAC checks permissions
```

### Sample IAM Policy

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "eks:DescribeCluster",
        "eks:ListClusters"
      ],
      "Resource": "*"
    }
  ]
}
```

### ConfigMap aws-auth

```yaml
# Maps AWS IAM roles/users to Kubernetes RBAC
apiVersion: v1
kind: ConfigMap
metadata:
  name: aws-auth
  namespace: kube-system
data:
  mapRoles: |
    - rolearn: arn:aws:iam::ACCOUNT:role/EKSNodeRole
      username: system:node:{{EC2PrivateDNSName}}
      groups:
        - system:bootstrappers
        - system:nodes
  mapUsers: |
    - userarn: arn:aws:iam::ACCOUNT:user/admin
      username: admin
      groups:
        - system:masters
```

## EKS Versions and Lifecycle

### Kubernetes Version Support

```yaml
# EKS supports 3 Kubernetes versions at a time
Current (as of writing):
  - 1.28 (Latest)
  - 1.27
  - 1.26

Support Timeline:
  - New version: Released ~30 days after upstream
  - Standard support: ~14 months
  - Extended support: Additional 12 months ($0.60/cluster/hour)
  - End of life: Must upgrade
```

### Upgrade Process

```bash
# EKS upgrades are sequential - no version skipping
1.26 → 1.27 → 1.28
```

## Prerequisites

Before diving into EKS, ensure you have:

:::warning
Running EKS clusters incurs costs! The control plane costs $0.10/hour (~$73/month) plus worker node costs. Remember to clean up resources after testing.
:::

<details>
<summary>View detailed prerequisites</summary>

### AWS Account Requirements
- Active AWS account with billing enabled
- IAM user/role with appropriate permissions (AdministratorAccess recommended for learning)
- AWS CLI v2.x or later installed and configured

### Local Tools
```bash title="install-tools.sh" terminal
# Install kubectl
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
chmod +x kubectl
sudo mv kubectl /usr/local/bin/

# Verify installation
kubectl version --client
```

### Knowledge Prerequisites
- Basic Kubernetes concepts (Pods, Deployments, Services)
- Understanding of AWS networking (VPC, Subnets, Security Groups)
- Familiarity with the command line

</details>

--- for EKS

### AWS Account Requirements

```yaml
- Valid AWS account
- Appropriate IAM permissions
- VPC with subnets (minimum 2 AZs)
- Service-linked role for EKS
```

### Tools You'll Need

```bash
# Essential tools:
- aws-cli (v2)
- kubectl
- eksctl (easiest way to create clusters)
- helm (package manager)

# Optional but helpful:
- k9s (terminal UI)
- kubectx/kubens (context switching)
- stern (log aggregation)
- lens (desktop IDE)
```

## Common EKS Patterns

### Pattern 1: Application Deployment

```yaml
# Typical flow:
1. Create EKS cluster
2. Configure kubectl context
3. Deploy application using Kubernetes manifests/Helm
4. Expose via LoadBalancer service or Ingress
5. Configure auto-scaling (HPA/CA)
6. Set up monitoring and logging
```

### Pattern 2: CI/CD Integration

```yaml
# GitOps approach:
1. Code commit → GitHub/GitLab
2. CI pipeline builds Docker image
3. Push image to ECR
4. Update Kubernetes manifests
5. ArgoCD/Flux deploys to EKS
6. Automated testing and rollback
```

### Pattern 3: Multi-Environment Setup

```yaml
# Separate clusters per environment:
- dev-cluster
- staging-cluster
- prod-cluster

Benefits:
  - Isolation
  - Independent scaling
  - Safe testing
```

## EKS Limits and Quotas

### Default Limits

```yaml
# Per Region:
Clusters: 100 (soft limit, can request increase)

# Per Cluster:
Managed Node Groups: 30
Fargate Profiles: 10
Max Nodes: 450 (for VPC CNI, based on ENI limits)

# Network:
Max Pods per Node: Depends on instance type
  t3.medium: 17 pods
  m5.large: 29 pods
  m5.xlarge: 58 pods
```

## Troubleshooting Common Issues

### Issue 1: Nodes Not Joining Cluster

```bash
# Check:
1. IAM role has required permissions
2. Security group allows communication
3. Subnet has available IPs
4. AWS auth ConfigMap includes node role

# Debug:
kubectl get nodes
aws eks describe-cluster --name my-cluster
```

### Issue 2: Pods Can't Pull Images

```bash
# Check:
1. ECR repository permissions
2. Node IAM role has ECR pull permissions
3. Image name and tag are correct

# Verify:
kubectl describe pod <pod-name>
kubectl logs <pod-name>
```

### Issue 3: LoadBalancer Not Created

```bash
# Check:
1. AWS Load Balancer Controller installed
2. Subnet tags configured correctly
3. Security groups allow traffic
4. IAM permissions for controller

# Required subnet tags:
kubernetes.io/role/elb: 1 (public subnets)
kubernetes.io/role/internal-elb: 1 (private subnets)
```

## Best Practices Summary

### ✅ Security

- Enable private endpoint for production
- Use IAM roles for service accounts (IRSA)
- Enable secrets encryption with AWS KMS
- Implement pod security standards
- Regular security patches and updates

### ✅ Networking

- Spread nodes across multiple AZs
- Use private subnets for worker nodes
- Configure proper security groups
- Implement network policies
- Use VPC endpoints for AWS services

### ✅ Operations

- Use managed node groups
- Enable control plane logging
- Implement comprehensive monitoring
- Plan upgrade strategy
- Document cluster configuration

### ✅ Cost Optimization

- Use spot instances for fault-tolerant workloads
- Implement cluster autoscaler
- Right-size resource requests/limits
- Use Fargate for batch jobs
- Monitor and optimize resource utilization

## What's Next?

In **Part 2**, we'll get hands-on and:

- Set up your AWS environment
- Create your first EKS cluster using `eksctl`
- Configure `kubectl` access
- Deploy a sample application
- Expose the application via LoadBalancer
- Understand the resources created

## Additional Resources

### Official Documentation

- [Amazon EKS User Guide](https://docs.aws.amazon.com/eks/)
- [EKS Best Practices Guide](https://aws.github.io/aws-eks-best-practices/)
- [Kubernetes Documentation](https://kubernetes.io/docs/)

### Tools

- [eksctl](https://eksctl.io/) - Official CLI for EKS
- [AWS Load Balancer Controller](https://github.com/kubernetes-sigs/aws-load-balancer-controller)
- [EKS Blueprints](https://github.com/aws-ia/terraform-aws-eks-blueprints)

### Community

- [EKS GitHub](https://github.com/aws/amazon-eks-ami)
- [AWS Containers Roadmap](https://github.com/aws/containers-roadmap)
- [CNCF Slack #eks](https://cloud-native.slack.com/)

## Conclusion

Amazon EKS provides a robust, scalable, and secure platform for running Kubernetes workloads on AWS. By understanding the architecture, cost model, and best practices covered in this introduction, you're well-prepared to begin your EKS journey.

In the next post, we'll roll up our sleeves and create our first EKS cluster, deploy an application, and explore the various resources EKS creates in your AWS account.

Stay tuned for **Part 2: Setting Up Your First EKS Cluster**!

---

*Have questions or feedback about this post? Feel free to reach out or leave a comment. If you found this helpful, consider sharing it with your team!*

