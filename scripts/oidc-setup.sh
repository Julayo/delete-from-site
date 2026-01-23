#!/usr/bin/env bash
set -euo pipefail

# --- Config ---
GITHUB_OWNER="Julayo"
GITHUB_REPO="delete-from-site"
AWS_ACCOUNT_ID="567626725406"
ROLE_NAME="DeleteFromSiteGithubDeploy"
BUCKET_NAME="delete-from-site"
DISTRIBUTION_ID="E2UN2UG87AFRPM"

# Optional: set to 1 if you want to allow CloudFront invalidation
ENABLE_CLOUDFRONT=1

# --- Helpers ---
log() { echo "[oidc] $*"; }

# 1) Create OIDC provider if missing
PROVIDER_ARN=$(aws iam list-open-id-connect-providers \
  --query "OpenIDConnectProviderList[?contains(Arn, 'token.actions.githubusercontent.com')].Arn | [0]" \
  --output text)

if [[ -z "$PROVIDER_ARN" || "$PROVIDER_ARN" == "None" ]]; then
  log "Creating OIDC provider for GitHub Actions..."
  PROVIDER_ARN=$(aws iam create-open-id-connect-provider \
    --url https://token.actions.githubusercontent.com \
    --client-id-list sts.amazonaws.com \
    --thumbprint-list 6938fd4d98bab03faadb97b34396831e3780aea1 \
    --query OpenIDConnectProviderArn \
    --output text)
else
  log "OIDC provider already exists: $PROVIDER_ARN"
fi

# 2) Create IAM policy for deploy
POLICY_NAME="DeleteFromSiteDeployPolicy"
POLICY_DOC=$(cat <<POLICY
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "S3Deploy",
      "Effect": "Allow",
      "Action": [
        "s3:ListBucket",
        "s3:PutObject",
        "s3:DeleteObject",
        "s3:GetObject"
      ],
      "Resource": [
        "arn:aws:s3:::${BUCKET_NAME}",
        "arn:aws:s3:::${BUCKET_NAME}/*"
      ]
    }
    $( [[ "$ENABLE_CLOUDFRONT" == "1" ]] && cat <<CF
    ,{
      "Sid": "CloudFrontInvalidate",
      "Effect": "Allow",
      "Action": [
        "cloudfront:CreateInvalidation"
      ],
      "Resource": "arn:aws:cloudfront::${AWS_ACCOUNT_ID}:distribution/${DISTRIBUTION_ID}"
    }
CF
)
  ]
}
POLICY
)

POLICY_ARN=$(aws iam list-policies --scope Local --query "Policies[?PolicyName=='${POLICY_NAME}'].Arn | [0]" --output text)
if [[ -z "$POLICY_ARN" || "$POLICY_ARN" == "None" ]]; then
  log "Creating IAM policy $POLICY_NAME..."
  POLICY_ARN=$(aws iam create-policy --policy-name "$POLICY_NAME" --policy-document "$POLICY_DOC" --query Policy.Arn --output text)
else
  log "Policy already exists: $POLICY_ARN"
fi

# 3) Create IAM role with trust policy for repo
TRUST_DOC=$(cat <<TRUST
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {"Federated": "${PROVIDER_ARN}"},
      "Action": "sts:AssumeRoleWithWebIdentity",
      "Condition": {
        "StringEquals": {"token.actions.githubusercontent.com:aud": "sts.amazonaws.com"},
        "StringLike": {"token.actions.githubusercontent.com:sub": "repo:${GITHUB_OWNER}/${GITHUB_REPO}:ref:refs/heads/main"}
      }
    }
  ]
}
TRUST
)

ROLE_ARN=$(aws iam get-role --role-name "$ROLE_NAME" --query Role.Arn --output text 2>/dev/null || true)
if [[ -z "$ROLE_ARN" ]]; then
  log "Creating role $ROLE_NAME..."
  ROLE_ARN=$(aws iam create-role --role-name "$ROLE_NAME" --assume-role-policy-document "$TRUST_DOC" --query Role.Arn --output text)
else
  log "Role already exists: $ROLE_ARN"
fi

# 4) Attach policy to role
aws iam attach-role-policy --role-name "$ROLE_NAME" --policy-arn "$POLICY_ARN"

log "Done. Set GitHub Secrets:"
log "AWS_ROLE_ARN=$ROLE_ARN"
log "CLOUDFRONT_DISTRIBUTION_ID=$DISTRIBUTION_ID"
