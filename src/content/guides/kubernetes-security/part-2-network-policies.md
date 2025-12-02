---
title: "Part 2: Network Policies"
guide: "kubernetes-security"
part: 2
date: "2024-12-02"
tags: ["kubernetes", "security", "networking"]
---

## Network Policies Overview

Network policies in Kubernetes allow you to control traffic between pods. Think of them as firewall rules for your cluster.

## Default Behavior

By default, all pods can communicate with each other. Network policies let you restrict this:

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: deny-all
spec:
  podSelector: {}
  policyTypes:
  - Ingress
  - Egress
```

This policy denies all ingress and egress traffic to all pods.

## Allowing Specific Traffic

Here's an example that allows traffic only from a specific namespace:

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-frontend
spec:
  podSelector:
    matchLabels:
      app: backend
  policyTypes:
  - Ingress
  ingress:
  - from:
    - namespaceSelector:
        matchLabels:
          name: frontend
    ports:
    - protocol: TCP
      port: 8080
```

## Best Practices

1. Start with deny-all policies
2. Gradually allow necessary traffic
3. Use labels consistently
4. Test policies in non-production first

## Next Steps

In Part 3, we'll cover RBAC and how to control who can do what in your cluster.

