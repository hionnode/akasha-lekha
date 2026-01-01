---
title: "EKS Deep Dive Series Part 5: Scaling and Performance Optimization"
date: "2025-01-05"
excerpt: "Master EKS autoscaling with Cluster Autoscaler, HPA, VPA, and Karpenter. Learn performance optimization techniques for production workloads."
tags: ["eks", "kubernetes", "scaling", "performance", "karpenter", "devops"]
featured: true
draft: false
series: "eks-deep-dive"
seriesPart: 5
seriesTotal: 5
---

## Introduction

Scaling is one of Kubernetes' superpowers. This post covers comprehensive scaling strategies for EKS, from horizontal pod autoscaling to intelligent node provisioning with Karpenter.

## Types of Scaling in EKS

```yaml
Scaling Dimensions:
  1. Horizontal Pod Autoscaler (HPA) - Scale pod replicas
  2. Vertical Pod Autoscaler (VPA) - Scale pod resources
  3. Cluster Autoscaler (CA) - Scale worker nodes
  4. Karpenter - Intelligent node provisioning
  5. Manual Scaling - On-demand adjustments
```

## Horizontal Pod Autoscaler (HPA)

### Metrics Server Installation

```bash
# Required for HPA
kubectl apply -f https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml

# Verify
kubectl get deployment metrics-server -n kube-system
kubectl top nodes
kubectl top pods
```

### Basic CPU-based HPA

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: nginx-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: nginx-deployment
  minReplicas: 2
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  behavior:
    scaleDown:
      stabilizationWindowSeconds: 300
      policies:
      - type: Percent
        value: 50
        periodSeconds: 60
    scaleUp:
      stabilizationWindowSeconds: 0
      policies:
      - type: Percent
        value: 100
        periodSeconds: 30
      - type: Pods
        value: 4
        periodSeconds: 30
      selectPolicy: Max
```

### Memory-based HPA

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: api-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: api-deployment
  minReplicas: 3
  maxReplicas: 20
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80
```

### Custom Metrics HPA

```yaml
# Scale based on request rate, queue length, etc.
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: custom-metrics-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: web-app
  minReplicas: 2
  maxReplicas: 50
  metrics:
  - type: External
    external:
      metric:
        name: sqs_queue_messages
        selector:
          matchLabels:
            queue_name: my-queue
      target:
        type: AverageValue
        averageValue: "30"
```

### Test HPA

```bash
# Deploy sample app with HPA
kubectl apply -f https://k8s.io/examples/application/php-apache.yaml

# Create HPA
kubectl autoscale deployment php-apache --cpu-percent=50 --min=1 --max=10

# Generate load
kubectl run -i --tty load-generator --rm --image=busybox --restart=Never -- /bin/sh -c "while sleep 0.01; do wget -q -O- http://php-apache; done"

# Watch HPA
kubectl get hpa -w

# Check events
kubectl describe hpa php-apache
```

## Cluster Autoscaler

### Install Cluster Autoscaler

```bash
# 1. Create IAM policy
cat > cluster-autoscaler-policy.json <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "autoscaling:DescribeAutoScalingGroups",
        "autoscaling:DescribeAutoScalingInstances",
        "autoscaling:DescribeLaunchConfigurations",
        "autoscaling:DescribeScalingActivities",
        "autoscaling:DescribeTags",
        "ec2:DescribeInstanceTypes",
        "ec2:DescribeLaunchTemplateVersions"
      ],
      "Resource": ["*"]
    },
    {
      "Effect": "Allow",
      "Action": [
        "autoscaling:SetDesiredCapacity",
        "autoscaling:TerminateInstanceInAutoScalingGroup",
        "ec2:DescribeImages",
        "ec2:GetInstanceTypesFromInstanceRequirements",
        "eks:DescribeNodegroup"
      ],
      "Resource": ["*"]
    }
  ]
}
EOF

aws iam create-policy \
  --policy-name AmazonEKSClusterAutoscalerPolicy \
  --policy-document file://cluster-autoscaler-policy.json

# 2. Create service account with IAM role
eksctl create iamserviceaccount \
  --cluster=my-eks-cluster \
  --namespace=kube-system \
  --name=cluster-autoscaler \
  --attach-policy-arn=arn:aws:iam::ACCOUNT_ID:policy/AmazonEKSClusterAutoscalerPolicy \
  --override-existing-serviceaccounts \
  --approve

# 3. Deploy Cluster Autoscaler
kubectl apply -f https://raw.githubusercontent.com/kubernetes/autoscaler/master/cluster-autoscaler/cloudprovider/aws/examples/cluster-autoscaler-autodiscover.yaml

# 4. Patch deployment
kubectl -n kube-system patch deployment cluster-autoscaler \
  -p '{"spec":{"template":{"metadata":{"annotations":{"cluster-autoscaler.kubernetes.io/safe-to-evict": "false"}}}}}'

kubectl -n kube-system set image deployment/cluster-autoscaler \
  cluster-autoscaler=registry.k8s.io/autoscaling/cluster-autoscaler:v1.28.0

# 5. Add cluster name
kubectl -n kube-system edit deployment cluster-autoscaler
# Add: --node-group-auto-discovery=asg:tag=k8s.io/cluster-autoscaler/enabled,k8s.io/cluster-autoscaler/my-eks-cluster
```

### Configure Node Groups for CA

```yaml
# Tag your Auto Scaling Groups
k8s.io/cluster-autoscaler/enabled: true
k8s.io/cluster-autoscaler/my-eks-cluster: owned
```

### Cluster Autoscaler Options

```yaml
# Key configuration options
--scale-down-enabled=true
--scale-down-delay-after-add=10m
--scale-down-unneeded-time=10m
--scale-down-utilization-threshold=0.5
--skip-nodes-with-local-storage=false
--skip-nodes-with-system-pods=false
--balance-similar-node-groups=true
--expander=least-waste  # Or: most-pods, priority, random
```

### Test Cluster Autoscaler

```bash
# Deploy resource-intensive pods
kubectl apply -f - <<EOF
apiVersion: apps/v1
kind: Deployment
metadata:
  name: inflate
spec:
  replicas: 0
  selector:
    matchLabels:
      app: inflate
  template:
    metadata:
      labels:
        app: inflate
    spec:
      containers:
      - name: inflate
        image: public.ecr.aws/eks-distro/kubernetes/pause:3.2
        resources:
          requests:
            cpu: 1000m
            memory: 1Gi
EOF

# Scale up
kubectl scale deployment inflate --replicas=10

# Watch nodes
kubectl get nodes -w

# Check CA logs
kubectl logs -f -n kube-system deployment/cluster-autoscaler

# Scale down
kubectl scale deployment inflate --replicas=0
# Wait ~10 minutes for scale down
```

## Karpenter - Next-Gen Autoscaling

### Why Karpenter?

```yaml
Advantages over Cluster Autoscaler:
  - Faster provisioning (seconds vs minutes)
  - More intelligent bin-packing
  - Better instance type selection
  - Spot instance support
  - Consolidation for cost savings
  - Direct EC2 API (no ASG)
```

### Install Karpenter

```bash
# 1. Set environment variables
export CLUSTER_NAME=my-eks-cluster
export AWS_REGION=us-west-2
export AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)

# 2. Create Karpenter IAM role
curl -fsSL https://raw.githubusercontent.com/aws/karpenter/"v0.32.0"/website/content/en/preview/getting-started/getting-started-with-karpenter/cloudformation.yaml \
  | envsubst | aws cloudformation deploy \
  --stack-name "Karpenter-${CLUSTER_NAME}" \
  --template-file - \
  --capabilities CAPABILITY_NAMED_IAM \
  --parameter-overrides "ClusterName=${CLUSTER_NAME}"

# 3. Tag subnets for Karpenter
for NODEGROUP in $(aws eks list-nodegroups --cluster-name ${CLUSTER_NAME} \
  --query 'nodegroups[0]' --output text); do
    aws eks describe-nodegroup --cluster-name ${CLUSTER_NAME} \
    --nodegroup-name $NODEGROUP --query 'nodegroup.subnets' --output text | \
    tr '\t' '\n' | xargs -I {} aws ec2 create-tags --resources {} \
    --tags "Key=karpenter.sh/discovery,Value=${CLUSTER_NAME}"
done

# 4. Install Karpenter with Helm
helm upgrade --install karpenter oci://public.ecr.aws/karpenter/karpenter \
  --version v0.32.0 \
  --namespace karpenter \
  --create-namespace \
  --set settings.aws.clusterName=${CLUSTER_NAME} \
  --set settings.aws.defaultInstanceProfile=KarpenterNodeInstanceProfile-${CLUSTER_NAME} \
  --set settings.aws.interruptionQueueName=${CLUSTER_NAME} \
  --set controller.resources.requests.cpu=1 \
  --set controller.resources.requests.memory=1Gi \
  --set controller.resources.limits.cpu=1 \
  --set controller.resources.limits.memory=1Gi
```

### Karpenter Provisioner

```yaml
apiVersion: karpenter.sh/v1alpha5
kind: Provisioner
metadata:
  name: default
spec:
  requirements:
    - key: karpenter.sh/capacity-type
      operator: In
      values: ["on-demand", "spot"]
    - key: kubernetes.io/arch
      operator: In
      values: ["amd64"]
    - key: karpenter.k8s.aws/instance-category
      operator: In
      values: ["c", "m", "r"]
    - key: karpenter.k8s.aws/instance-generation
      operator: Gt
      values: ["5"]
  limits:
    resources:
      cpu: 1000
      memory: 1000Gi
  providerRef:
    name: default
  ttlSecondsAfterEmpty: 30
  ttlSecondsUntilExpired: 604800  # 7 days
  consolidation:
    enabled: true

---
apiVersion: karpenter.k8s.aws/v1alpha1
kind: AWSNodeTemplate
metadata:
  name: default
spec:
  subnetSelector:
    karpenter.sh/discovery: my-eks-cluster
  securityGroupSelector:
    karpenter.sh/discovery: my-eks-cluster
  tags:
    Name: karpenter-node
    Environment: production
  blockDeviceMappings:
    - deviceName: /dev/xvda
      ebs:
        volumeSize: 20Gi
        volumeType: gp3
        encrypted: true
  userData: |
    #!/bin/bash
    echo "Custom user data for karpenter nodes"
```

### Test Karpenter

```bash
# Deploy workload
kubectl apply -f - <<EOF
apiVersion: apps/v1
kind: Deployment
metadata:
  name: karpenter-test
spec:
  replicas: 0
  selector:
    matchLabels:
      app: karpenter-test
  template:
    metadata:
      labels:
        app: karpenter-test
    spec:
      containers:
      - name: app
        image: public.ecr.aws/eks-distro/kubernetes/pause:3.2
        resources:
          requests:
            cpu: 1
            memory: 1Gi
EOF

# Scale up
kubectl scale deployment karpenter-test --replicas=10

# Watch Karpenter provision nodes
kubectl logs -f -n karpenter -l app.kubernetes.io/name=karpenter -c controller

# Check nodes
kubectl get nodes -L karpenter.sh/capacity-type

# Scale down - Karpenter consolidates automatically
kubectl scale deployment karpenter-test --replicas=0
```

## Vertical Pod Autoscaler (VPA)

### Install VPA

```bash
# Install VPA
git clone https://github.com/kubernetes/autoscaler.git
cd autoscaler/vertical-pod-autoscaler
./hack/vpa-up.sh

# Verify
kubectl get deployment -n kube-system | grep vpa
```

### VPA Configuration

```yaml
apiVersion: autoscaling.k8s.io/v1
kind: VerticalPodAutoscaler
metadata:
  name: my-app-vpa
spec:
  targetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: my-app
  updatePolicy:
    updateMode: "Auto"  # Or: Initial, Recreate, Off
  resourcePolicy:
    containerPolicies:
    - containerName: app
      minAllowed:
        cpu: 100m
        memory: 128Mi
      maxAllowed:
        cpu: 2
        memory: 2Gi
      controlledResources: ["cpu", "memory"]
```

### VPA Recommendation Mode

```yaml
# Get recommendations without applying
apiVersion: autoscaling.k8s.io/v1
kind: VerticalPodAutoscaler
metadata:
  name: my-app-vpa-recommend
spec:
  targetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: my-app
  updatePolicy:
    updateMode: "Off"
```

### Check VPA Recommendations

```bash
# View recommendations
kubectl describe vpa my-app-vpa

# Example output:
# Recommendation:
#   Container Recommendations:
#     Container Name:  app
#     Lower Bound:
#       Cpu:     25m
#       Memory:  262144k
#     Target:
#       Cpu:     587m
#       Memory:  262144k
#     Uncapped Target:
#       Cpu:     587m
#       Memory:  262144k
#     Upper Bound:
#       Cpu:     21147m
#       Memory:  1431655765
```

## Performance Optimization

### Node Selection and Instance Types

```yaml
# Use nodeSelector for workload placement
apiVersion: v1
kind: Pod
metadata:
  name: compute-intensive
spec:
  nodeSelector:
    node.kubernetes.io/instance-type: c5.2xlarge
    workload: compute
  containers:
  - name: app
    image: my-app:latest
```

### Topology Spread Constraints

```yaml
# Spread pods across AZs and nodes
apiVersion: apps/v1
kind: Deployment
metadata:
  name: high-availability-app
spec:
  replicas: 6
  template:
    spec:
      topologySpreadConstraints:
      - maxSkew: 1
        topologyKey: topology.kubernetes.io/zone
        whenUnsatisfiable: DoNotSchedule
        labelSelector:
          matchLabels:
            app: high-availability-app
      - maxSkew: 1
        topologyKey: kubernetes.io/hostname
        whenUnsatisfiable: DoNotSchedule
        labelSelector:
          matchLabels:
            app: high-availability-app
```

### Resource Quotas

```yaml
# Prevent resource exhaustion
apiVersion: v1
kind: ResourceQuota
metadata:
  name: compute-resources
  namespace: production
spec:
  hard:
    requests.cpu: "100"
    requests.memory: 200Gi
    limits.cpu: "200"
    limits.memory: 400Gi
    persistentvolumeclaims: "10"
```

### PodDisruptionBudgets

```yaml
# Ensure availability during disruptions
apiVersion: policy/v1
kind: PodDisruptionBudget
metadata:
  name: api-pdb
spec:
  minAvailable: 2
  selector:
    matchLabels:
      app: api
```

## Monitoring Scaling Metrics

### CloudWatch Container Insights

```bash
# Install Container Insights
ClusterName=my-eks-cluster
RegionName=us-west-2
FluentBitHttpPort='2020'
FluentBitReadFromHead='Off'
[[ ${FluentBitReadFromHead} = 'On' ]] && FluentBitReadFromTail='Off'|| FluentBitReadFromTail='On'
[[ -z ${FluentBitHttpPort} ]] && FluentBitHttpServer='Off' || FluentBitHttpServer='On'

curl https://raw.githubusercontent.com/aws-samples/amazon-cloudwatch-container-insights/latest/k8s-deployment-manifest-templates/deployment-mode/daemonset/container-insights-monitoring/quickstart/cwagent-fluent-bit-quickstart.yaml | sed 's/{{cluster_name}}/'${ClusterName}'/;s/{{region_name}}/'${RegionName}'/;s/{{http_server_toggle}}/"'${FluentBitHttpServer}'"/;s/{{http_server_port}}/"'${FluentBitHttpPort}'"/;s/{{read_from_head}}/"'${FluentBitReadFromHead}'"/;s/{{read_from_tail}}/"'${FluentBitReadFromTail}'"/' | kubectl apply -f -
```

### Prometheus and Grafana

```bash
# Install Prometheus
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm install prometheus prometheus-community/kube-prometheus-stack \
  --namespace monitoring \
  --create-namespace

# Access Grafana
kubectl port-forward -n monitoring svc/prometheus-grafana 3000:80
```

## Cost Optimization

### Spot Instance Integration

```yaml
# Karpenter with Spot
apiVersion: karpenter.sh/v1alpha5
kind: Provisioner
metadata:
  name: spot
spec:
  requirements:
    - key: karpenter.sh/capacity-type
      operator: In
      values: ["spot"]
  consolidation:
    enabled: true
```

### Right-Sizing Recommendations

```bash
# Use VPA recommendations
kubectl get vpa --all-namespaces

# Analyze with kubecost
helm install kubecost kubecost/cost-analyzer \
  --namespace kubecost \
  --create-namespace \
  --set kubecostToken="YOUR_TOKEN"
```

## Best Practices

```yaml
✅ HPA Best Practices:
  - Set appropriate CPU/memory targets (60-80%)
  - Use behavior policies for smooth scaling
  - Combine CPU and memory metrics
  - Monitor scaling events

✅ Cluster Autoscaler:
  - Tag node groups correctly
  - Set reasonable min/max sizes
  - Configure scale-down delays
  - Use expander strategies

✅ Karpenter:
  - Define clear provisioner requirements
  - Enable consolidation
  - Use spot instances where appropriate
  - Set TTL for unused nodes

✅ Performance:
  - Set resource requests/limits
  - Use PodDisruptionBudgets
  - Implement topology spread
  - Monitor and adjust continuously
```

## Conclusion

You now have comprehensive knowledge of scaling strategies in EKS. The series covered:

✅ **Part 1**: EKS architecture and fundamentals  
✅ **Part 2**: Setting up your first cluster  
✅ **Part 3**: Networking in depth  
✅ **Part 4**: Security best practices  
✅ **Part 5**: Scaling and performance

You're now equipped to run production-grade EKS clusters!

## Additional Resources

- [EKS Best Practices Guide](https://aws.github.io/aws-eks-best-practices/)
- [Karpenter Documentation](https://karpenter.sh/)
- [Cluster Autoscaler](https://github.com/kubernetes/autoscaler/tree/master/cluster-autoscaler)

---

*Found this series helpful? Share it with your team!*

