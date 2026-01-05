#!/usr/bin/env node

/**
 * Script to convert src/utils/tools-data.ts to TOOLS.md
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current file path and directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read tools-data.ts file
const toolsDataPath = path.resolve(__dirname, '../src/utils/tools-data.ts');
const outputPath = path.resolve(__dirname, '../TOOLS.md');

// Convert heading text to GitHub-compatible anchor
function generateAnchor(text) {
  // Hard-coded anchors for specific categories
  if (text === 'Integrations & Webhooks') {
    return 'integrations--webhooks';
  } else if (text === 'User & Group Management') {
    return 'user--group-management';
  }
  
  // Generic anchor generation for other categories
  return text
    .toLowerCase()
    .replace(/[\/]/g, '')     // Remove forward slashes
    .replace(/\s+/g, '-');    // Replace spaces with hyphens
}

try {
  // Read the source file
  const toolsData = fs.readFileSync(toolsDataPath, 'utf8');
  
  // Extract tool definitions using regex
  const toolDefinitionsRegex = /export const toolDefinitions = \[([\s\S]*?)\];/;
  const match = toolsData.match(toolDefinitionsRegex);
  
  if (!match) {
    console.error('Could not parse tool definitions from source file');
    process.exit(1);
  }
  
  // Split into individual tool definitions
  const toolDefinitions = [];
  let toolsContent = match[1];
  let braceCount = 0;
  let currentTool = '';

  // Extract individual tool definitions respecting nested objects
  for (let i = 0; i < toolsContent.length; i++) {
    const char = toolsContent[i];
    currentTool += char;
    
    if (char === '{') {
      braceCount++;
    } else if (char === '}') {
      braceCount--;
      if (braceCount === 0 && i < toolsContent.length - 1) {
        if (toolsContent[i+1] === ',') {
          // Include the comma in the current tool definition
          currentTool += toolsContent[i+1];
          i++;
        }
        toolDefinitions.push(currentTool.trim());
        currentTool = '';
      }
    }
  }
  
  // Parse each tool definition
  const tools = [];
  
  for (const toolDef of toolDefinitions) {
    // Extract basic tool info
    const nameMatch = toolDef.match(/name:\s*['"]([^'"]+)['"]/);
    const descMatch = toolDef.match(/description:\s*['"]([^'"]+)['"]/);
    
    if (!nameMatch || !descMatch) continue;
    
    const name = nameMatch[1];
    const description = descMatch[1];
    
    // Extract required parameters
    const requiredMatch = toolDef.match(/required:\s*\[([\s\S]*?)\]/);
    const required = requiredMatch ? 
      (requiredMatch[1].match(/['"]([^'"]+)['"]/g) || []).map(r => r.replace(/['"]/g, '')) : 
      [];
    
    // Extract properties
    const propertiesMatch = toolDef.match(/properties:\s*{([\s\S]*?)}\s*,\s*(?:required:|type:)/);
    if (!propertiesMatch) {
      tools.push({
        name,
        description,
        parameters: []
      });
      continue;
    }
    
    const propertiesContent = propertiesMatch[1];
    
    // Parse individual parameters
    const parameters = [];
    const paramMatches = [...propertiesContent.matchAll(/([a-zA-Z0-9_]+):\s*{([\s\S]*?)(?=\s*},\s*[a-zA-Z0-9_]+:|$)/g)];
    
    for (const paramMatch of paramMatches) {
      const paramName = paramMatch[1];
      const paramContent = paramMatch[2];
      
      const typeMatch = paramContent.match(/type:\s*['"]([^'"]+)['"]/);
      const descMatch = paramContent.match(/description:\s*['"]([^'"]+)['"]/);
      
      if (typeMatch && descMatch) {
        parameters.push({
          name: paramName,
          type: typeMatch[1],
          description: descMatch[1],
          required: required.includes(paramName)
        });
      }
    }
    
    tools.push({
      name,
      description,
      parameters
    });
  }
  
  // Generate markdown content
  let markdown = '# GitLab MCP Server Tools\n\n';
  markdown += 'This document provides details on all available tools in the GitLab MCP server.\n\n';
  markdown += 'Each tool is designed to interact with GitLab APIs, allowing AI assistants to work with repositories, merge requests, issues, CI/CD pipelines, and more.\n\n';
  
  // Group tools by category based on name prefix
  const categories = {
    'Repository Management': tools.filter(t => 
      t.name.includes('project') || 
      t.name.includes('branch') || 
      t.name.includes('merge_request') || 
      t.name.includes('discussion') || 
      t.name.includes('issue') || 
      t.name.includes('repository')),
    'Integrations & Webhooks': tools.filter(t => 
      t.name.includes('integration') || 
      t.name.includes('webhook')),
    'CI/CD Management': tools.filter(t => 
      t.name.includes('trigger') || 
      t.name.includes('pipeline') || 
      t.name.includes('cicd')),
    'User & Group Management': tools.filter(t => 
      t.name.includes('user') || 
      t.name.includes('group') || 
      t.name.includes('member'))
  };
  
  // Generate table of contents
  markdown += '## Table of Contents\n\n';
  Object.keys(categories).forEach(category => {
    const anchor = generateAnchor(category);
    markdown += `- [${category}](#${anchor})\n`;
  });
  markdown += '\n';
  
  // Generate tool documentation by category
  Object.entries(categories).forEach(([category, categoryTools]) => {
    markdown += `## ${category}\n\n`;
    
    categoryTools.forEach(tool => {
      markdown += `### ${tool.name}\n\n`;
      markdown += `${tool.description}\n\n`;
      
      if (tool.parameters.length > 0) {
        markdown += '**Parameters:**\n\n';
        markdown += '| Name | Type | Required | Description |\n';
        markdown += '| ---- | ---- | -------- | ----------- |\n';
        
        tool.parameters.forEach(param => {
          markdown += `| \`${param.name}\` | \`${param.type}\` | ${param.required ? 'Yes' : 'No'} | ${param.description} |\n`;
        });
        
        markdown += '\n';
      } else {
        markdown += 'This tool does not require any parameters.\n\n';
      }
    });
  });
  
  // Add footer
  markdown += '---\n\n';
  markdown += 'Generated automatically from `src/utils/tools-data.ts`\n';
  
  // Write to TOOLS.md
  fs.writeFileSync(outputPath, markdown);
  console.log(`Successfully generated ${outputPath}`);
  
} catch (error) {
  console.error('Error generating markdown:', error);
  process.exit(1);
}
