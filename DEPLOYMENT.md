# AWS Lightsail Container Deployment Guide

Complete guide for deploying your GitLab MCP Server to AWS Lightsail Container Service.

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Quick Start](#quick-start)
3. [Detailed Setup](#detailed-setup)
4. [Testing Locally](#testing-locally)
5. [Deploying to AWS](#deploying-to-aws)
6. [Post-Deployment](#post-deployment)
7. [Updating Your Deployment](#updating-your-deployment)
8. [Monitoring & Logs](#monitoring--logs)
9. [Troubleshooting](#troubleshooting)
10. [Cost Management](#cost-management)

---

## Prerequisites

### 1. Install Docker Desktop
- **macOS/Windows**: Download from [docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop)
- **Linux**: Follow instructions at [docs.docker.com/engine/install](https://docs.docker.com/engine/install/)

Verify installation:
```bash
docker --version
docker-compose --version
```

### 2. Install AWS CLI
- **macOS**: 
  ```bash
  brew install awscli
  ```
- **Windows**: Download from [aws.amazon.com/cli](https://aws.amazon.com/cli/)
- **Linux**: 
  ```bash
  curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
  unzip awscliv2.zip
  sudo ./aws/install
  ```

Verify installation:
```bash
aws --version
```

### 3. Install Lightsail Plugin
```bash
# macOS
sudo curl "https://s3.us-west-2.amazonaws.com/lightsailctl/latest/darwin-amd64/lightsailctl" -o "/usr/local/bin/lightsailctl"
sudo chmod +x /usr/local/bin/lightsailctl

# Linux
sudo curl "https://s3.us-west-2.amazonaws.com/lightsailctl/latest/linux-amd64/lightsailctl" -o "/usr/local/bin/lightsailctl"
sudo chmod +x /usr/local/bin/lightsailctl

# Windows (PowerShell as Administrator)
Invoke-WebRequest -Uri "https://s3.us-west-2.amazonaws.com/lightsailctl/latest/windows-amd64/lightsailctl.exe" -OutFile "C:\Program Files\Amazon\lightsailctl.exe"
```

### 4. Configure AWS Credentials
```bash
aws configure
```

You'll need:
- AWS Access Key ID
- AWS Secret Access Key
- Default region (e.g., `us-east-1`)
- Default output format: `json`

---

## Quick Start

### For Impatient Developers 🚀

```bash
# 1. Test locally first
docker-compose up

# 2. Test the server
curl http://localhost:3000/health

# 3. Stop local test
docker-compose down

# 4. Make deployment script executable
chmod +x lightsail-deploy.sh

# 5. Deploy to AWS
./lightsail-deploy.sh

# 6. Configure environment variables in AWS Console (see below)
```

---

## Detailed Setup

### Step 1: Verify Your Local Setup

1. **Check your `.env` file**:
   ```bash
   cat .env
   ```
   
   Should contain:
   ```
   GITLAB_API_TOKEN="your_token_here"
   GITLAB_API_URL="https://gitlab.presidio.com/api/v4"
   MCP_TRANSPORT=http
   MCP_HTTP_PORT=3000
   ```

2. **Build the application**:
   ```bash
   npm run build
   ```

---

## Testing Locally

### Option 1: Test with Docker Compose (Recommended)

1. **Start the container**:
   ```bash
   docker-compose up
   ```

2. **In another terminal, test endpoints**:
   ```bash
   # Health check
   curl http://localhost:3000/health
   
   # Expected response:
   # {"status":"ok","transport":"streamable-http","activeSessions":0}
   ```

3. **Stop the container**:
   ```bash
   docker-compose down
   ```

### Option 2: Test with Docker Directly

```bash
# Build
docker build -t mcp-gitlab:latest .

# Run
docker run -p 3000:3000 \
  -e GITLAB_API_TOKEN="${GITLAB_API_TOKEN}" \
  -e GITLAB_API_URL="${GITLAB_API_URL}" \
  -e MCP_TRANSPORT=http \
  -e MCP_HTTP_PORT=3000 \
  mcp-gitlab:latest

# Test
curl http://localhost:3000/health

# Stop (Ctrl+C)
```

---

## Deploying to AWS

### Step 1: Make Script Executable

```bash
chmod +x lightsail-deploy.sh
```

### Step 2: Configure Deployment Settings

Edit `lightsail-deploy.sh` if needed:

```bash
SERVICE_NAME="mcp-gitlab-service"  # Your service name
REGION="us-east-1"                 # Your AWS region
POWER="micro"                       # micro = $10/month (0.5 vCPU, 1 GB)
SCALE=1                             # Number of containers
```

### Step 3: Run Deployment

```bash
./lightsail-deploy.sh
```

The script will:
1. ✅ Check prerequisites (Docker, AWS CLI, Lightsail plugin)
2. ✅ Create Lightsail service (if doesn't exist)
3. ✅ Build Docker image
4. ✅ Push image to Lightsail registry
5. ✅ Deploy container
6. ✅ Wait for deployment to complete
7. ✅ Display your public URL

**Expected output**:
```
====================================
🎉 Deployment Successful!
====================================

Your GitLab MCP Server is now live at:
https://mcp-gitlab-service.xxxxxx.us-east-1.cs.amazonlightsail.com

Health check:
https://mcp-gitlab-service.xxxxxx.us-east-1.cs.amazonlightsail.com/health

MCP endpoint:
https://mcp-gitlab-service.xxxxxx.us-east-1.cs.amazonlightsail.com/mcp
```

---

## Post-Deployment

### Step 1: Configure Environment Variables in AWS Console

⚠️ **IMPORTANT**: The deployment script creates the service but you must set environment variables manually.

1. **Go to AWS Console**:
   - Navigate to: [Lightsail Console](https://lightsail.aws.amazon.com/)
   - Click on "Containers"
   - Click on your service: `mcp-gitlab-service`

2. **Set Environment Variables**:
   - Click on "Deployments" tab
   - Click "Modify your deployment"
   - Scroll to "Environment variables"
   - Add these variables:

   | Key | Value |
   |-----|-------|
   | `GITLAB_API_TOKEN` | `YOUR_ACTUAL_TOKEN` |
   | `GITLAB_API_URL` | `https://gitlab.presidio.com/api/v4` |
   | `MCP_TRANSPORT` | `http` |
   | `MCP_HTTP_PORT` | `3000` |

3. **Save and Deploy**:
   - Click "Save and deploy"
   - Wait 2-3 minutes for redeployment

### Step 2: Verify Deployment

```bash
# Replace with your actual URL
curl https://your-service.region.cs.amazonlightsail.com/health
```

Expected response:
```json
{
  "status": "ok",
  "transport": "streamable-http",
  "activeSessions": 0
}
```

### Step 3: Test MCP Endpoint

```bash
# Initialize request
curl -X POST https://your-service.region.cs.amazonlightsail.com/mcp \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "initialize",
    "params": {
      "protocolVersion": "2024-11-05",
      "capabilities": {},
      "clientInfo": {
        "name": "test-client",
        "version": "1.0.0"
      }
    }
  }'
```

---

## Updating Your Deployment

### For Code Changes

```bash
# 1. Make your code changes
# 2. Test locally
docker-compose up

# 3. Redeploy
./lightsail-deploy.sh
```

The script will:
- Build new image
- Push to Lightsail
- Deploy automatically
- Keep previous version as rollback option

### Rolling Back

If something goes wrong:

1. Go to AWS Console → Lightsail → Your service
2. Click "Deployments" tab
3. Find previous deployment
4. Click "Modify and redeploy"
5. Save

---

## Monitoring & Logs

### View Logs in AWS Console

1. Go to: Lightsail → Container services → `mcp-gitlab-service`
2. Click "Logs" tab
3. Select your container
4. View real-time logs

### View Logs via CLI

```bash
# Get latest logs
aws lightsail get-container-log \
  --service-name mcp-gitlab-service \
  --container-name mcp-gitlab \
  --region us-east-1

# Follow logs (live)
aws lightsail get-container-log \
  --service-name mcp-gitlab-service \
  --container-name mcp-gitlab \
  --region us-east-1 \
  --page-token ""
```

### Monitoring Metrics

In AWS Console:
- **Container health**: Check health check status
- **Request count**: Monitor traffic
- **CPU/Memory**: Track resource usage
- **Deployment history**: View past deployments

---

## Troubleshooting

### Issue: Deployment Script Fails

**Error**: `AWS CLI not found`
```bash
# Install AWS CLI
brew install awscli  # macOS
```

**Error**: `Docker not found`
```bash
# Install Docker Desktop
# Visit: https://www.docker.com/products/docker-desktop
```

**Error**: `lightsailctl plugin not found`
```bash
# Install Lightsail plugin (see Prerequisites section)
sudo curl "https://s3.us-west-2.amazonaws.com/lightsailctl/latest/darwin-amd64/lightsailctl" -o "/usr/local/bin/lightsailctl"
sudo chmod +x /usr/local/bin/lightsailctl
```

### Issue: Container Won't Start

**Check logs**:
```bash
aws lightsail get-container-log \
  --service-name mcp-gitlab-service \
  --container-name mcp-gitlab \
  --region us-east-1
```

**Common causes**:
1. Missing environment variables → Set in AWS Console
2. GitLab token invalid → Check token permissions
3. Port configuration issue → Verify port 3000 is correct

### Issue: Health Check Failing

**Check**:
1. Environment variables set correctly
2. GitLab API URL is accessible
3. API token has correct permissions

**Test locally**:
```bash
docker-compose up
curl http://localhost:3000/health
```

### Issue: Can't Access Public URL

**Check**:
1. Deployment is "ACTIVE" (not PENDING)
2. Public endpoint is enabled
3. HTTPS certificate is provisioned (takes 5-10 minutes first time)

---

## Cost Management

### Current Costs

**Micro Plan**: $10/month
- 0.5 vCPU, 1 GB RAM
- Includes 500 GB data transfer
- Includes HTTPS certificate
- Includes container registry

**Free Tier**: 3 months free on Micro plan

### Cost Optimization Tips

1. **Use 1 container** - Don't scale unless needed
2. **Monitor data transfer** - First 500 GB is free
3. **Use health checks** - Prevents unnecessary restarts
4. **Downgrade if needed**:
   ```bash
   # Edit lightsail-deploy.sh
   POWER="nano"  # $7/month instead of $10
   ```

### Viewing Your Bill

1. Go to: AWS Console → Billing
2. View: Lightsail charges
3. Set up: Billing alerts for unexpected charges

---

## Additional Resources

- [AWS Lightsail Docs](https://docs.aws.amazon.com/lightsail/latest/userguide/amazon-lightsail-container-services.html)
- [Docker Documentation](https://docs.docker.com/)
- [Model Context Protocol Spec](https://modelcontextprotocol.io/)
- [GitLab API Docs](https://docs.gitlab.com/ee/api/)

---

## Support

If you encounter issues:

1. Check the [Troubleshooting](#troubleshooting) section
2. Review AWS Lightsail logs
3. Test locally with Docker
4. Check GitLab API connectivity

---

## Quick Reference Commands

```bash
# Local testing
docker-compose up                # Start locally
docker-compose down              # Stop locally
docker-compose logs -f           # Follow logs

# Deployment
./lightsail-deploy.sh           # Deploy to AWS

# AWS CLI commands
aws lightsail get-container-services --region us-east-1
aws lightsail get-container-log --service-name mcp-gitlab-service --container-name mcp-gitlab --region us-east-1

# View your URL
aws lightsail get-container-services \
  --service-name mcp-gitlab-service \
  --region us-east-1 \
  --query "containerServices[0].url" \
  --output text
```

---

**Happy Deploying! 🚀**
