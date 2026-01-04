/**
 * Tool registry - maps tool names to handler functions
 */

import { ToolRegistry } from "./handler-types.js";

// Import repository handlers
import * as repoHandlers from "../handlers/repository-handlers.js";

// Import integration handlers
import * as integrationHandlers from "../handlers/integration-handlers.js";

// Import CI/CD handlers
import * as cicdHandlers from "../handlers/cicd-handlers.js";

// Import users and groups handlers
import * as usersGroupsHandlers from "../handlers/users-groups-handlers.js";

/**
 * Registry of all available tools mapped to their handler functions
 */
export const toolRegistry: ToolRegistry = {
  // Repository tools
  gitlab_list_projects: repoHandlers.listProjects,
  gitlab_get_project: repoHandlers.getProject,
  gitlab_list_branches: repoHandlers.listBranches,
  gitlab_list_merge_requests: repoHandlers.listMergeRequests,
  gitlab_get_merge_request: repoHandlers.getMergeRequest,
  gitlab_get_merge_request_changes: repoHandlers.getMergeRequestChanges,
  gitlab_create_merge_request_note: repoHandlers.createMergeRequestNote,
  gitlab_create_merge_request_note_internal: repoHandlers.createMergeRequestNoteInternal,
  gitlab_update_merge_request: repoHandlers.updateMergeRequest,
  gitlab_create_merge_request_discussion: repoHandlers.createMergeRequestDiscussion,
  gitlab_create_merge_request_discussion_simple: repoHandlers.createMergeRequestDiscussionSimple,
  gitlab_reply_to_discussion: repoHandlers.replyToDiscussion,
  gitlab_list_merge_request_notes: repoHandlers.listMergeRequestNotes,
  gitlab_list_merge_request_discussions: repoHandlers.listMergeRequestDiscussions,
  gitlab_resolve_merge_request_discussion: repoHandlers.resolveMergeRequestDiscussion,
  gitlab_list_issues: repoHandlers.listIssues,
  gitlab_get_repository_file: repoHandlers.getRepositoryFile,
  gitlab_compare_branches: repoHandlers.compareBranches,

  // Integration tools
  gitlab_list_integrations: integrationHandlers.listIntegrations,
  gitlab_get_integration: integrationHandlers.getIntegration,
  gitlab_update_slack_integration: integrationHandlers.updateSlackIntegration,
  gitlab_disable_slack_integration: integrationHandlers.disableSlackIntegration,
  gitlab_list_webhooks: integrationHandlers.listWebhooks,
  gitlab_get_webhook: integrationHandlers.getWebhook,
  gitlab_add_webhook: integrationHandlers.addWebhook,
  gitlab_update_webhook: integrationHandlers.updateWebhook,
  gitlab_delete_webhook: integrationHandlers.deleteWebhook,
  gitlab_test_webhook: integrationHandlers.testWebhook,

  // CI/CD tools
  gitlab_list_trigger_tokens: cicdHandlers.listTriggerTokens,
  gitlab_get_trigger_token: cicdHandlers.getTriggerToken,
  gitlab_create_trigger_token: cicdHandlers.createTriggerToken,
  gitlab_update_trigger_token: cicdHandlers.updateTriggerToken,
  gitlab_delete_trigger_token: cicdHandlers.deleteTriggerToken,
  gitlab_trigger_pipeline: cicdHandlers.triggerPipeline,
  gitlab_list_cicd_variables: cicdHandlers.listCiCdVariables,
  gitlab_get_cicd_variable: cicdHandlers.getCiCdVariable,
  gitlab_create_cicd_variable: cicdHandlers.createCiCdVariable,
  gitlab_update_cicd_variable: cicdHandlers.updateCiCdVariable,
  gitlab_delete_cicd_variable: cicdHandlers.deleteCiCdVariable,

  // Users and Groups tools
  gitlab_list_users: usersGroupsHandlers.listUsers,
  gitlab_get_user: usersGroupsHandlers.getUser,
  gitlab_list_groups: usersGroupsHandlers.listGroups,
  gitlab_get_group: usersGroupsHandlers.getGroup,
  gitlab_list_group_members: usersGroupsHandlers.listGroupMembers,
  gitlab_add_group_member: usersGroupsHandlers.addGroupMember,
  gitlab_list_project_members: usersGroupsHandlers.listProjectMembers,
  gitlab_add_project_member: usersGroupsHandlers.addProjectMember
};
