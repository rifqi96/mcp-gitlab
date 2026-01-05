/**
 * Repository-related tool handlers
 */

import { McpError, ErrorCode } from "@modelcontextprotocol/sdk/types.js";
import { ToolHandler } from "../utils/handler-types.js";
import { formatResponse } from "../utils/response-formatter.js";
import { DiscussionPosition, DiffRefs } from "../types/repository.types.js";

/**
 * List projects handler
 */
export const listProjects: ToolHandler = async (params, context) => {
  const { search, owned, membership, per_page } = params.arguments || {};
  const response = await context.axiosInstance.get('/projects', {
    params: {
      search,
      owned: owned === true ? true : undefined,
      membership: membership === true ? true : undefined,
      per_page: per_page || 20
    }
  });
  
  return formatResponse(response.data);
};

/**
 * Get project details handler
 */
export const getProject: ToolHandler = async (params, context) => {
  const { project_id } = params.arguments || {};
  if (!project_id) {
    throw new McpError(ErrorCode.InvalidParams, 'project_id is required');
  }
  
  const response = await context.axiosInstance.get(`/projects/${encodeURIComponent(String(project_id))}`);
  return formatResponse(response.data);
};

/**
 * List branches handler
 */
export const listBranches: ToolHandler = async (params, context) => {
  const { project_id, search } = params.arguments || {};
  if (!project_id) {
    throw new McpError(ErrorCode.InvalidParams, 'project_id is required');
  }
  
  const response = await context.axiosInstance.get(
    `/projects/${encodeURIComponent(String(project_id))}/repository/branches`,
    { params: { search } }
  );
  return formatResponse(response.data);
};

/**
 * List merge requests handler
 */
export const listMergeRequests: ToolHandler = async (params, context) => {
  const { project_id, state, scope } = params.arguments || {};
  if (!project_id) {
    throw new McpError(ErrorCode.InvalidParams, 'project_id is required');
  }
  
  const response = await context.axiosInstance.get(
    `/projects/${encodeURIComponent(String(project_id))}/merge_requests`,
    { params: { state, scope } }
  );
  return formatResponse(response.data);
};

/**
 * Get merge request details handler
 */
export const getMergeRequest: ToolHandler = async (params, context) => {
  const { project_id, merge_request_iid } = params.arguments || {};
  if (!project_id || !merge_request_iid) {
    throw new McpError(ErrorCode.InvalidParams, 'project_id and merge_request_iid are required');
  }
  
  const response = await context.axiosInstance.get(
    `/projects/${encodeURIComponent(String(project_id))}/merge_requests/${merge_request_iid}`
  );
  return formatResponse(response.data);
};

/**
 * Get merge request changes handler
 */
export const getMergeRequestChanges: ToolHandler = async (params, context) => {
  const { project_id, merge_request_iid } = params.arguments || {};
  if (!project_id || !merge_request_iid) {
    throw new McpError(ErrorCode.InvalidParams, 'project_id and merge_request_iid are required');
  }
  
  const response = await context.axiosInstance.get(
    `/projects/${encodeURIComponent(String(project_id))}/merge_requests/${merge_request_iid}/changes`
  );
  return formatResponse(response.data);
};

/**
 * Create merge request note handler
 */
export const createMergeRequestNote: ToolHandler = async (params, context) => {
  const { project_id, merge_request_iid, body } = params.arguments || {};
  if (!project_id || !merge_request_iid || !body) {
    throw new McpError(ErrorCode.InvalidParams, 'project_id, merge_request_iid, and body are required');
  }
  
  const response = await context.axiosInstance.post(
    `/projects/${encodeURIComponent(String(project_id))}/merge_requests/${merge_request_iid}/notes`,
    { body }
  );
  return formatResponse(response.data);
};

/**
 * List issues handler
 */
export const listIssues: ToolHandler = async (params, context) => {
  const { project_id, state, labels } = params.arguments || {};
  if (!project_id) {
    throw new McpError(ErrorCode.InvalidParams, 'project_id is required');
  }
  
  const response = await context.axiosInstance.get(
    `/projects/${encodeURIComponent(String(project_id))}/issues`,
    { params: { state, labels } }
  );
  return formatResponse(response.data);
};

/**
 * Get repository file handler
 */
export const getRepositoryFile: ToolHandler = async (params, context) => {
  const { project_id, file_path, ref } = params.arguments || {};
  if (!project_id || !file_path) {
    throw new McpError(ErrorCode.InvalidParams, 'project_id and file_path are required');
  }
  
  const response = await context.axiosInstance.get(
    `/projects/${encodeURIComponent(String(project_id))}/repository/files/${encodeURIComponent(String(file_path))}`,
    { params: { ref: ref || 'main' } }
  );
  return formatResponse(response.data);
};

/**
 * Compare branches handler
 */
export const compareBranches: ToolHandler = async (params, context) => {
  const { project_id, from, to } = params.arguments || {};
  if (!project_id || !from || !to) {
    throw new McpError(ErrorCode.InvalidParams, 'project_id, from, and to are required');
  }
  
  const response = await context.axiosInstance.get(
    `/projects/${encodeURIComponent(String(project_id))}/repository/compare`,
    { params: { from, to } }
  );
  return formatResponse(response.data);
};

/**
 * Update merge request title and description handler
 */
export const updateMergeRequest: ToolHandler = async (params, context) => {
  const { project_id, merge_request_iid, title, description } = params.arguments || {};
  if (!project_id || !merge_request_iid) {
    throw new McpError(ErrorCode.InvalidParams, 'project_id and merge_request_iid are required');
  }
  
  if (!title && !description) {
    throw new McpError(ErrorCode.InvalidParams, 'At least one of title or description is required');
  }
  
  const response = await context.axiosInstance.put(
    `/projects/${encodeURIComponent(String(project_id))}/merge_requests/${merge_request_iid}`,
    { title, description }
  );
  return formatResponse(response.data);
};

/**
 * Create merge request note handler with internal note option
 */
export const createMergeRequestNoteInternal: ToolHandler = async (params, context) => {
  const { project_id, merge_request_iid, body, internal } = params.arguments || {};
  if (!project_id || !merge_request_iid || !body) {
    throw new McpError(ErrorCode.InvalidParams, 'project_id, merge_request_iid, and body are required');
  }
  
  const response = await context.axiosInstance.post(
    `/projects/${encodeURIComponent(String(project_id))}/merge_requests/${merge_request_iid}/notes`,
    { body, internal: internal === true }
  );
  return formatResponse(response.data);
};

/**
 * Create merge request discussion (inline comment) handler
 */
export const createMergeRequestDiscussion: ToolHandler = async (params, context) => {
  const args = params.arguments || {};
  const { project_id, merge_request_iid, body, position } = args;
  
  if (!project_id || !merge_request_iid || !body || !position) {
    throw new McpError(ErrorCode.InvalidParams, 'project_id, merge_request_iid, body, and position are required');
  }
  
  // Type guard: ensure position is an object with required properties
  const positionData = position as DiscussionPosition;
  const { base_sha, start_sha, head_sha, new_path, old_path } = positionData;
  
  if (!base_sha || !start_sha || !head_sha || !new_path || !old_path) {
    throw new McpError(
      ErrorCode.InvalidParams, 
      'position must include base_sha, start_sha, head_sha, new_path, and old_path'
    );
  }
  
  const response = await context.axiosInstance.post(
    `/projects/${encodeURIComponent(String(project_id))}/merge_requests/${merge_request_iid}/discussions`,
    {
      body,
      position: {
        ...positionData,
        position_type: 'text'
      }
    }
  );
  return formatResponse(response.data);
};

/**
 * Create merge request discussion (inline comment) handler - simplified version
 * Automatically fetches commit SHAs from the merge request
 */
export const createMergeRequestDiscussionSimple: ToolHandler = async (params, context) => {
  const { project_id, merge_request_iid, body, file_path, line_number, line_type } = params.arguments || {};
  
  if (!project_id || !merge_request_iid || !body || !file_path || !line_number || !line_type) {
    throw new McpError(
      ErrorCode.InvalidParams, 
      'project_id, merge_request_iid, body, file_path, line_number, and line_type are required'
    );
  }
  
  // Validate line_type
  if (line_type !== 'new' && line_type !== 'old') {
    throw new McpError(ErrorCode.InvalidParams, 'line_type must be either "new" or "old"');
  }
  
  // First, fetch the merge request details to get diff_refs
  const mrResponse = await context.axiosInstance.get(
    `/projects/${encodeURIComponent(String(project_id))}/merge_requests/${merge_request_iid}`
  );
  
  const diffRefs = mrResponse.data.diff_refs;
  if (!diffRefs) {
    throw new McpError(
      ErrorCode.InternalError, 
      'Could not retrieve diff_refs from merge request. The MR may not have any commits yet.'
    );
  }
  
  // Construct the position object
  const position = {
    base_sha: diffRefs.base_sha,
    start_sha: diffRefs.start_sha,
    head_sha: diffRefs.head_sha,
    position_type: 'text',
    new_path: file_path,
    old_path: file_path,
    new_line: line_type === 'new' ? line_number : null,
    old_line: line_type === 'old' ? line_number : null
  };
  
  // Create the discussion
  const response = await context.axiosInstance.post(
    `/projects/${encodeURIComponent(String(project_id))}/merge_requests/${merge_request_iid}/discussions`,
    { body, position }
  );
  
  return formatResponse(response.data);
};

/**
 * Reply to an existing discussion thread handler
 */
export const replyToDiscussion: ToolHandler = async (params, context) => {
  const { project_id, merge_request_iid, discussion_id, body } = params.arguments || {};
  
  if (!project_id || !merge_request_iid || !discussion_id || !body) {
    throw new McpError(
      ErrorCode.InvalidParams, 
      'project_id, merge_request_iid, discussion_id, and body are required'
    );
  }
  
  const response = await context.axiosInstance.post(
    `/projects/${encodeURIComponent(String(project_id))}/merge_requests/${merge_request_iid}/discussions/${encodeURIComponent(String(discussion_id))}/notes`,
    { body }
  );
  
  return formatResponse(response.data);
};

/**
 * List merge request notes handler
 */
export const listMergeRequestNotes: ToolHandler = async (params, context) => {
  const { project_id, merge_request_iid } = params.arguments || {};
  
  if (!project_id || !merge_request_iid) {
    throw new McpError(ErrorCode.InvalidParams, 'project_id and merge_request_iid are required');
  }
  
  const response = await context.axiosInstance.get(
    `/projects/${encodeURIComponent(String(project_id))}/merge_requests/${merge_request_iid}/notes`
  );
  
  return formatResponse(response.data);
};

/**
 * List merge request discussions handler
 */
export const listMergeRequestDiscussions: ToolHandler = async (params, context) => {
  const { project_id, merge_request_iid } = params.arguments || {};
  
  if (!project_id || !merge_request_iid) {
    throw new McpError(ErrorCode.InvalidParams, 'project_id and merge_request_iid are required');
  }
  
  const response = await context.axiosInstance.get(
    `/projects/${encodeURIComponent(String(project_id))}/merge_requests/${merge_request_iid}/discussions`
  );
  
  return formatResponse(response.data);
};

/**
 * Resolve merge request discussion handler
 */
export const resolveMergeRequestDiscussion: ToolHandler = async (params, context) => {
  const { project_id, merge_request_iid, discussion_id, resolved } = params.arguments || {};
  
  if (!project_id || !merge_request_iid || !discussion_id || resolved === undefined) {
    throw new McpError(ErrorCode.InvalidParams, 'project_id, merge_request_iid, discussion_id, and resolved are required');
  }
  
  const response = await context.axiosInstance.put(
    `/projects/${encodeURIComponent(String(project_id))}/merge_requests/${merge_request_iid}/discussions/${encodeURIComponent(String(discussion_id))}`,
    { resolved }
  );
  
  return formatResponse(response.data);
};
