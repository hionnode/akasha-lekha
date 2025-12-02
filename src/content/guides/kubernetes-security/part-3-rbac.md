---
title: "Part 3: RBAC & Access Control"
guide: "kubernetes-security"
part: 3
date: "2024-12-03"
tags: ["kubernetes", "security", "rbac"]
---

## RBAC Overview

Role-Based Access Control (RBAC) is Kubernetes' way of controlling who can do what. It's essential for multi-user environments.

## Core Concepts

- **Role**: Defines permissions within a namespace
- **ClusterRole**: Defines permissions cluster-wide
- **RoleBinding**: Grants a role to users/groups/service accounts in a namespace
- **ClusterRoleBinding**: Grants a role cluster-wide

## Example: Read-Only Role

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  namespace: default
  name: pod-reader
rules:
- apiGroups: [""]
  resources: ["pods"]
  verbs: ["get", "list", "watch"]
```

Bind it to a user:

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: read-pods
  namespace: default
subjects:
- kind: User
  name: developer
  apiGroup: rbac.authorization.k8s.io
roleRef:
  kind: Role
  name: pod-reader
  apiGroup: rbac.authorization.k8s.io
```

## Service Account Permissions

Service accounts need permissions too:

```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: app-sa
---
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: app-sa-binding
subjects:
- kind: ServiceAccount
  name: app-sa
roleRef:
  kind: Role
  name: app-role
  apiGroup: rbac.authorization.k8s.io
```

## Best Practices

1. Grant minimum necessary permissions
2. Use namespaces to isolate resources
3. Regularly audit RBAC configurations
4. Use tools like `kubectl auth can-i` to test permissions

## Conclusion

This concludes our Kubernetes security guide. You now have the fundamentals to secure your clusters. Remember: security is an ongoing process, not a one-time setup.

