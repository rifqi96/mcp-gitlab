#!/bin/bash

# AWS Lightsail Container Deployment Script
# This script builds and deploys your GitLab MCP server to AWS Lightsail

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
SERVICE_NAME="mcp-gitlab-service"
CONTAINER_NAME="mcp-gitlab"
REGION="us-east-1"  # Change this to your preferred region
POWER="micro"       # Options: nano, micro, small, medium, large, xlarge
SCALE=1             # Number of container instances

echo -e "${BLUE}=====================================${NC}"
echo -e "${BLUE}GitLab MCP Server - Lightsail Deploy${NC}"
echo -e "${BLUE}=====================================${NC}\n"

# Check prerequisites
echo -e "${YELLOW}Checking prerequisites...${NC}"

if ! command -v aws &> /dev/null; then
    echo -e "${RED}❌ AWS CLI not found. Please install it first:${NC}"
    echo "   brew install awscli  (macOS)"
    echo "   Or visit: https://aws.amazon.com/cli/"
    exit 1
fi

if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker not found. Please install Docker Desktop first:${NC}"
    echo "   https://www.docker.com/products/docker-desktop"
    exit 1
fi

# Check if AWS Lightsail is accessible (better detection method)
if ! aws lightsail get-regions &> /dev/null; then
    echo -e "${RED}❌ AWS Lightsail is not accessible.${NC}"
    echo "Please ensure:"
    echo "1. AWS CLI is configured with valid credentials"
    echo "2. Your account has access to Lightsail"
    echo "3. Lightsail plugin is installed: https://lightsail.aws.amazon.com/ls/docs/en_us/articles/amazon-lightsail-install-software"
    exit 1
fi

echo -e "${GREEN}✓ All prerequisites met${NC}\n"

# Check if service exists
echo -e "${YELLOW}Checking if service exists...${NC}"
if aws lightsail get-container-services --service-name "$SERVICE_NAME" --region "$REGION" &> /dev/null; then
    echo -e "${GREEN}✓ Service '$SERVICE_NAME' exists${NC}"
    SERVICE_EXISTS=true
else
    echo -e "${YELLOW}⚠ Service '$SERVICE_NAME' does not exist. It will be created.${NC}"
    SERVICE_EXISTS=false
fi

# If service doesn't exist, create it
if [ "$SERVICE_EXISTS" = false ]; then
    echo -e "\n${YELLOW}Creating Lightsail container service...${NC}"
    echo "Service: $SERVICE_NAME"
    echo "Region: $REGION"
    echo "Power: $POWER (0.5 vCPU, 1 GB RAM)"
    echo "Scale: $SCALE container(s)"
    echo ""
    read -p "Proceed with creation? (y/N) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo -e "${RED}Deployment cancelled${NC}"
        exit 1
    fi

    aws lightsail create-container-service \
        --service-name "$SERVICE_NAME" \
        --power "$POWER" \
        --scale "$SCALE" \
        --region "$REGION"
    
    echo -e "${GREEN}✓ Service created. Waiting for it to become active...${NC}"
    echo -e "${YELLOW}This may take 2-3 minutes...${NC}"
    
    # Wait for service to be ready
    while true; do
        STATE=$(aws lightsail get-container-services \
            --service-name "$SERVICE_NAME" \
            --region "$REGION" \
            --query "containerServices[0].state" \
            --output text)
        
        if [ "$STATE" = "READY" ]; then
            echo -e "${GREEN}✓ Service is ready${NC}"
            break
        fi
        echo -ne "${YELLOW}⏳ Waiting for service to become ready (current: $STATE)...${NC}\r"
        sleep 10
    done
fi

# Build Docker image for linux/amd64 platform (required by AWS Lightsail)
echo -e "\n${YELLOW}Building Docker image for linux/amd64...${NC}"
docker build --platform linux/amd64 -t "$CONTAINER_NAME:latest" .

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Docker image built successfully${NC}"
else
    echo -e "${RED}❌ Docker build failed${NC}"
    exit 1
fi

# Push image to Lightsail
echo -e "\n${YELLOW}Pushing image to Lightsail...${NC}"
echo -e "${BLUE}This may take a few minutes depending on image size...${NC}"

aws lightsail push-container-image \
    --service-name "$SERVICE_NAME" \
    --label "$CONTAINER_NAME" \
    --image "$CONTAINER_NAME:latest" \
    --region "$REGION"

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Image pushed successfully${NC}"
else
    echo -e "${RED}❌ Image push failed${NC}"
    exit 1
fi

# Get the image name (Lightsail assigns a unique name)
IMAGE_NAME=$(aws lightsail get-container-images \
    --service-name "$SERVICE_NAME" \
    --region "$REGION" \
    --query "containerImages[0].image" \
    --output text)

echo -e "${GREEN}✓ Image available: $IMAGE_NAME${NC}"

# Update containers.json with the actual image name
echo -e "\n${YELLOW}Updating deployment configuration...${NC}"
sed "s|:mcp-gitlab-service.mcp-gitlab.latest|$IMAGE_NAME|g" containers.json > containers-deploy.json

# Deploy the container
echo -e "\n${YELLOW}Deploying container...${NC}"
aws lightsail create-container-service-deployment \
    --service-name "$SERVICE_NAME" \
    --region "$REGION" \
    --containers file://containers-deploy.json \
    --public-endpoint '{
        "containerName": "'"$CONTAINER_NAME"'",
        "containerPort": 3000,
        "healthCheck": {
            "healthyThreshold": 2,
            "unhealthyThreshold": 2,
            "timeoutSeconds": 3,
            "intervalSeconds": 30,
            "path": "/health",
            "successCodes": "200"
        }
    }'

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Deployment initiated${NC}"
else
    echo -e "${RED}❌ Deployment failed${NC}"
    exit 1
fi

# Clean up temporary file
rm -f containers-deploy.json

# Wait for deployment to complete
echo -e "\n${YELLOW}⏳ Waiting for deployment to complete...${NC}"
echo -e "${BLUE}This usually takes 2-3 minutes...${NC}\n"

while true; do
    DEPLOYMENT_STATE=$(aws lightsail get-container-services \
        --service-name "$SERVICE_NAME" \
        --region "$REGION" \
        --query "containerServices[0].currentDeployment.state" \
        --output text)
    
    if [ "$DEPLOYMENT_STATE" = "ACTIVE" ]; then
        echo -e "\n${GREEN}✓ Deployment completed successfully!${NC}"
        break
    elif [ "$DEPLOYMENT_STATE" = "FAILED" ]; then
        echo -e "\n${RED}❌ Deployment failed${NC}"
        exit 1
    fi
    
    echo -ne "${YELLOW}⏳ Deployment in progress (state: $DEPLOYMENT_STATE)...${NC}\r"
    sleep 10
done

# Get the public URL
PUBLIC_URL=$(aws lightsail get-container-services \
    --service-name "$SERVICE_NAME" \
    --region "$REGION" \
    --query "containerServices[0].url" \
    --output text)

echo -e "\n${GREEN}=====================================${NC}"
echo -e "${GREEN}🎉 Deployment Successful!${NC}"
echo -e "${GREEN}=====================================${NC}"
echo -e "\n${BLUE}Your GitLab MCP Server is now live at:${NC}"
echo -e "${GREEN}$PUBLIC_URL${NC}"
echo -e "\n${BLUE}Health check:${NC}"
echo -e "${GREEN}$PUBLIC_URL/health${NC}"
echo -e "\n${BLUE}MCP endpoint:${NC}"
echo -e "${GREEN}$PUBLIC_URL/mcp${NC}"
echo -e "\n${YELLOW}⚠️  Important: Don't forget to configure environment variables in AWS Console!${NC}"
echo -e "${YELLOW}   Go to: Lightsail > Container services > $SERVICE_NAME${NC}"
echo -e "${YELLOW}   Set: GITLAB_API_TOKEN and GITLAB_API_URL${NC}"
echo ""
