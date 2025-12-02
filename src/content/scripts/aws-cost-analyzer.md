---
title: "AWS Cost Analyzer Script"
description: "Bash script to analyze AWS costs by service and generate a detailed report. Helps identify cost drivers and optimization opportunities."
language: "bash"
tags: ["aws", "finops", "bash"]
externalRepo: "https://github.com/example/aws-scripts"
---

## Usage

```bash
./aws-cost-analyzer.sh --profile production --month 2024-12
```

## Requirements

- AWS CLI v2 installed and configured
- `jq` for JSON parsing
- Valid AWS credentials with Cost Explorer permissions
- IAM permissions: `ce:GetCostAndUsage`, `ce:GetDimensionValues`

## Script

```bash
#!/bin/bash

set -euo pipefail

PROFILE=""
MONTH=""
OUTPUT_FORMAT="table"

usage() {
    cat << EOF
Usage: $0 [OPTIONS]

Analyze AWS costs by service for a given month.

OPTIONS:
    --profile PROFILE    AWS profile to use (required)
    --month YYYY-MM      Month to analyze (required, format: 2024-12)
    --format FORMAT      Output format: table, json, csv (default: table)
    -h, --help          Show this help message

EXAMPLES:
    $0 --profile production --month 2024-12
    $0 --profile dev --month 2024-11 --format json
EOF
    exit 1
}

parse_args() {
    while [[ $# -gt 0 ]]; do
        case $1 in
            --profile)
                PROFILE="$2"
                shift 2
                ;;
            --month)
                MONTH="$2"
                shift 2
                ;;
            --format)
                OUTPUT_FORMAT="$2"
                shift 2
                ;;
            -h|--help)
                usage
                ;;
            *)
                echo "Unknown option: $1"
                usage
                ;;
        esac
    done

    if [[ -z "$PROFILE" ]] || [[ -z "$MONTH" ]]; then
        echo "Error: --profile and --month are required"
        usage
    fi
}

get_start_date() {
    echo "${MONTH}-01"
}

get_end_date() {
    local year=$(echo "$MONTH" | cut -d'-' -f1)
    local month=$(echo "$MONTH" | cut -d'-' -f2)
    local last_day=$(cal "$month" "$year" | awk 'NF {DAYS = $NF}; END {print DAYS}')
    echo "${MONTH}-${last_day}"
}

analyze_costs() {
    local start_date=$(get_start_date)
    local end_date=$(get_end_date)

    echo "Analyzing AWS costs from $start_date to $end_date..." >&2

    aws ce get-cost-and-usage \
        --profile "$PROFILE" \
        --time-period Start="$start_date",End="$end_date" \
        --granularity MONTHLY \
        --metrics BlendedCost \
        --group-by Type=DIMENSION,Key=SERVICE \
        --output json | jq -r '
            .ResultsByTime[0].Groups[] |
            [.Keys[0], .Metrics.BlendedCost.Amount] |
            @tsv
        ' | sort -t$'\t' -k2 -rn
}

format_output() {
    case "$OUTPUT_FORMAT" in
        table)
            awk -F'\t' 'BEGIN {
                printf "%-40s %15s\n", "Service", "Cost (USD)"
                printf "%-40s %15s\n", "----------------------------------------", "---------------"
            }
            {
                printf "%-40s $%14.2f\n", $1, $2
            }
            END {
                total = 0
                while ((getline line < "/dev/stdin") > 0) {
                    split(line, fields, "\t")
                    total += fields[2]
                }
                printf "%-40s %15s\n", "----------------------------------------", "---------------"
                printf "%-40s $%14.2f\n", "TOTAL", total
            }'
            ;;
        json)
            jq -s '[.[] | {service: .[0], cost: .[1]}]'
            ;;
        csv)
            awk -F'\t' 'BEGIN {print "Service,Cost"} {print $1","$2}'
            ;;
    esac
}

main() {
    parse_args "$@"
    analyze_costs | format_output
}

main "$@"
```

## Output Example

```
Service                                  Cost (USD)
---------------------------------------- ---------------
Amazon Elastic Compute Cloud - Compute  $    1234.56
Amazon Relational Database Service      $     567.89
Amazon Simple Storage Service           $     234.12
Amazon CloudWatch                       $      45.67
---------------------------------------- ---------------
TOTAL                                   $    2082.24
```

## Notes

- Costs are shown in USD
- Requires Cost Explorer API access
- May take a few minutes for large accounts
- Consider caching results for repeated queries

