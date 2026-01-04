# GitLab MCP Server Tools

This document provides details on all available tools in the GitLab MCP server.

Each tool is designed to interact with GitLab APIs, allowing AI assistants to work with repositories, merge requests, issues, CI/CD pipelines, and more.

## Table of Contents

- [Repository Management](#repository-management)
- [Integrations & Webhooks](#integrations--webhooks)
- [CI/CD Management](#cicd-management)
- [User & Group Management](#user--group-management)

## Repository Management

### gitlab_list_projects

List GitLab projects accessible to the user

This tool does not require any parameters.

### gitlab_get_project

Get details of a specific GitLab project

**Parameters:**

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| `project_id` | `string` | Yes | The ID or URL-encoded path of the project |

### gitlab_list_branches

List branches of a GitLab project

**Parameters:**

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| `project_id` | `string` | Yes | The ID or URL-encoded path of the project |
| `search` | `string` | No | Search branches by name |

### gitlab_list_merge_requests

List merge requests in a GitLab project

**Parameters:**

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| `project_id` | `string` | Yes | The ID or URL-encoded path of the project |
| `state` | `string` | No | Return merge requests with specified state (opened, closed, locked, merged) |
| `scope` | `string` | No | Return merge requests for the specified scope (created_by_me, assigned_to_me, all) |

### gitlab_get_merge_request

Get details of a specific merge request

**Parameters:**

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| `project_id` | `string` | Yes | The ID or URL-encoded path of the project |
| `merge_request_iid` | `number` | Yes | The internal ID of the merge request |

### gitlab_get_merge_request_changes

Get changes (diff) of a specific merge request

**Parameters:**

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| `project_id` | `string` | Yes | The ID or URL-encoded path of the project |
| `merge_request_iid` | `number` | Yes | The internal ID of the merge request |

### gitlab_create_merge_request_note

Add a comment to a merge request

**Parameters:**

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| `project_id` | `string` | Yes | The ID or URL-encoded path of the project |
| `merge_request_iid` | `number` | Yes | The internal ID of the merge request |
| `body` | `string` | Yes | The content of the note/comment |

### gitlab_create_merge_request_note_internal

Add a comment to a merge request with option to make it an internal note

**Parameters:**

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| `project_id` | `string` | Yes | The ID or URL-encoded path of the project |
| `merge_request_iid` | `number` | Yes | The internal ID of the merge request |
| `body` | `string` | Yes | The content of the note/comment |
| `internal` | `boolean` | No | If true, the note will be marked as an internal note visible only to project members |

### gitlab_update_merge_request

Update a merge request title and description

**Parameters:**

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| `project_id` | `string` | Yes | The ID or URL-encoded path of the project |
| `merge_request_iid` | `number` | Yes | The internal ID of the merge request |
| `title` | `string` | No | The title of the merge request |
| `description` | `string` | No | The description of the merge request |

### gitlab_create_merge_request_discussion

Create an inline comment/discussion on a specific line in a merge request. This is the full-featured version that requires commit SHAs.

**Parameters:**

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| `project_id` | `string` | No | The ID or URL-encoded path of the project |
| `merge_request_iid` | `number` | No | The internal ID of the merge request |
| `body` | `string` | No | The content of the comment |
| `position` | `object` | No | Position information for the inline comment |
| `start_sha` | `string` | Yes | SHA of the start commit (where the MR starts) |
| `head_sha` | `string` | Yes | SHA of the head commit (latest commit in the MR) |
| `new_path` | `string` | Yes | Path to the file in the new version |
| `old_path` | `string` | Yes | Path to the file in the old version (same as new_path if not renamed) |

### gitlab_create_merge_request_discussion_simple

Create an inline comment on a specific line in a merge request (simplified version). Automatically fetches commit SHAs from the merge request.

**Parameters:**

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| `project_id` | `string` | Yes | The ID or URL-encoded path of the project |
| `merge_request_iid` | `number` | Yes | The internal ID of the merge request |
| `body` | `string` | Yes | The content of the comment |
| `file_path` | `string` | Yes | Path to the file to comment on |
| `line_number` | `number` | Yes | Line number to comment on |
| `line_type` | `string` | Yes | Type of line:  |

### gitlab_reply_to_discussion

Add a reply to an existing discussion thread in a merge request. Use this to continue conversations on inline comments or general discussions.

**Parameters:**

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| `project_id` | `string` | Yes | The ID or URL-encoded path of the project |
| `merge_request_iid` | `number` | Yes | The internal ID of the merge request |
| `discussion_id` | `string` | Yes | The ID of the discussion thread to reply to |
| `body` | `string` | Yes | The content of the reply |

### gitlab_list_merge_request_notes

List all notes/comments on a merge request

**Parameters:**

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| `project_id` | `string` | Yes | The ID or URL-encoded path of the project |
| `merge_request_iid` | `number` | Yes | The internal ID of the merge request |

### gitlab_list_merge_request_discussions

List all discussion threads on a merge request (includes inline and general discussions)

**Parameters:**

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| `project_id` | `string` | Yes | The ID or URL-encoded path of the project |
| `merge_request_iid` | `number` | Yes | The internal ID of the merge request |

### gitlab_list_issues

List issues in a GitLab project

**Parameters:**

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| `project_id` | `string` | Yes | The ID or URL-encoded path of the project |
| `state` | `string` | No | Return issues with specified state (opened, closed) |
| `labels` | `string` | No | Comma-separated list of label names |

### gitlab_get_repository_file

Get content of a file in a repository

**Parameters:**

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| `project_id` | `string` | Yes | The ID or URL-encoded path of the project |
| `file_path` | `string` | Yes | Path of the file in the repository |
| `ref` | `string` | No | The name of branch, tag or commit |

### gitlab_compare_branches

Compare branches, tags or commits

**Parameters:**

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| `project_id` | `string` | Yes | The ID or URL-encoded path of the project |
| `from` | `string` | Yes | The commit SHA or branch name to compare from |
| `to` | `string` | Yes | The commit SHA or branch name to compare to |

### gitlab_list_project_members

List members of a project

**Parameters:**

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| `project_id` | `string` | Yes | The ID or URL-encoded path of the project |

### gitlab_add_project_member

Add a user to a project

**Parameters:**

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| `project_id` | `string` | Yes | The ID or URL-encoded path of the project |
| `user_id` | `number` | Yes | The ID of the user |
| `access_level` | `number` | Yes | Access level (10=Guest, 20=Reporter, 30=Developer, 40=Maintainer, 50=Owner) |

## Integrations & Webhooks

### gitlab_list_integrations

List all available project integrations/services

**Parameters:**

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| `project_id` | `string` | Yes | The ID or URL-encoded path of the project |

### gitlab_get_integration

Get integration details for a project

**Parameters:**

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| `project_id` | `string` | Yes | The ID or URL-encoded path of the project |
| `integration` | `string` | Yes | The name of the integration (e.g., slack) |

### gitlab_update_slack_integration

Update Slack integration settings for a project

**Parameters:**

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| `project_id` | `string` | Yes | The ID or URL-encoded path of the project |
| `webhook` | `string` | Yes | The Slack webhook URL |
| `username` | `string` | No | The Slack username |
| `channel` | `string` | No | The Slack channel name |

### gitlab_disable_slack_integration

Disable Slack integration for a project

**Parameters:**

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| `project_id` | `string` | Yes | The ID or URL-encoded path of the project |

### gitlab_list_webhooks

List webhooks for a project

**Parameters:**

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| `project_id` | `string` | Yes | The ID or URL-encoded path of the project |

### gitlab_get_webhook

Get details of a specific webhook

**Parameters:**

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| `project_id` | `string` | Yes | The ID or URL-encoded path of the project |
| `webhook_id` | `number` | Yes | The ID of the webhook |

### gitlab_add_webhook

Add a new webhook to a project

**Parameters:**

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| `project_id` | `string` | Yes | The ID or URL-encoded path of the project |
| `url` | `string` | Yes | The webhook URL |
| `token` | `string` | No | Secret token to validate received payloads |
| `push_events` | `boolean` | No | Trigger webhook for push events |
| `issues_events` | `boolean` | No | Trigger webhook for issues events |
| `merge_requests_events` | `boolean` | No | Trigger webhook for merge request events |
| `enable_ssl_verification` | `boolean` | No | Enable SSL verification for the webhook |

### gitlab_update_webhook

Update an existing webhook

**Parameters:**

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| `project_id` | `string` | Yes | The ID or URL-encoded path of the project |
| `webhook_id` | `number` | Yes | The ID of the webhook |
| `url` | `string` | Yes | The webhook URL |
| `token` | `string` | No | Secret token to validate received payloads |
| `push_events` | `boolean` | No | Trigger webhook for push events |
| `issues_events` | `boolean` | No | Trigger webhook for issues events |
| `merge_requests_events` | `boolean` | No | Trigger webhook for merge request events |
| `enable_ssl_verification` | `boolean` | No | Enable SSL verification for the webhook |

### gitlab_delete_webhook

Delete a webhook

**Parameters:**

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| `project_id` | `string` | Yes | The ID or URL-encoded path of the project |
| `webhook_id` | `number` | Yes | The ID of the webhook |

### gitlab_test_webhook

Test a webhook

**Parameters:**

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| `project_id` | `string` | Yes | The ID or URL-encoded path of the project |
| `webhook_id` | `number` | Yes | The ID of the webhook |

## CI/CD Management

### gitlab_list_trigger_tokens

List pipeline trigger tokens

**Parameters:**

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| `project_id` | `string` | Yes | The ID or URL-encoded path of the project |

### gitlab_get_trigger_token

Get details of a pipeline trigger token

**Parameters:**

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| `project_id` | `string` | Yes | The ID or URL-encoded path of the project |
| `trigger_id` | `number` | Yes | The ID of the trigger |

### gitlab_create_trigger_token

Create a new pipeline trigger token

**Parameters:**

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| `project_id` | `string` | Yes | The ID or URL-encoded path of the project |
| `description` | `string` | Yes | The trigger description |

### gitlab_update_trigger_token

Update a pipeline trigger token

**Parameters:**

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| `project_id` | `string` | Yes | The ID or URL-encoded path of the project |
| `trigger_id` | `number` | Yes | The ID of the trigger |
| `description` | `string` | Yes | The new trigger description |

### gitlab_delete_trigger_token

Delete a pipeline trigger token

**Parameters:**

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| `project_id` | `string` | Yes | The ID or URL-encoded path of the project |
| `trigger_id` | `number` | Yes | The ID of the trigger |

### gitlab_trigger_pipeline

Trigger a pipeline run

**Parameters:**

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| `project_id` | `string` | Yes | The ID or URL-encoded path of the project |
| `ref` | `string` | Yes | The branch or tag name to run the pipeline for |
| `token` | `string` | Yes | The trigger token |
| `variables` | `object` | No | Variables to pass to the pipeline |

### gitlab_list_cicd_variables

List CI/CD variables for a project

**Parameters:**

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| `project_id` | `string` | Yes | The ID or URL-encoded path of the project |

### gitlab_get_cicd_variable

Get a specific CI/CD variable

**Parameters:**

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| `project_id` | `string` | Yes | The ID or URL-encoded path of the project |
| `key` | `string` | Yes | The key of the variable |

### gitlab_create_cicd_variable

Create a new CI/CD variable

**Parameters:**

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| `project_id` | `string` | Yes | The ID or URL-encoded path of the project |
| `key` | `string` | Yes | The key of the variable |
| `value` | `string` | Yes | The value of the variable |
| `protected` | `boolean` | No | Whether the variable is protected |
| `masked` | `boolean` | No | Whether the variable is masked |

### gitlab_update_cicd_variable

Update a CI/CD variable

**Parameters:**

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| `project_id` | `string` | Yes | The ID or URL-encoded path of the project |
| `key` | `string` | Yes | The key of the variable |
| `value` | `string` | Yes | The value of the variable |
| `protected` | `boolean` | No | Whether the variable is protected |
| `masked` | `boolean` | No | Whether the variable is masked |

### gitlab_delete_cicd_variable

Delete a CI/CD variable

**Parameters:**

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| `project_id` | `string` | Yes | The ID or URL-encoded path of the project |
| `key` | `string` | Yes | The key of the variable |

## User & Group Management

### gitlab_list_users

List GitLab users

This tool does not require any parameters.

### gitlab_get_user

Get details of a specific user

**Parameters:**

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| `user_id` | `number` | Yes | The ID of the user |

### gitlab_list_groups

List GitLab groups

This tool does not require any parameters.

### gitlab_get_group

Get details of a specific group

**Parameters:**

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| `group_id` | `string` | Yes | The ID or URL-encoded path of the group |

### gitlab_list_group_members

List members of a group

**Parameters:**

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| `group_id` | `string` | Yes | The ID or URL-encoded path of the group |

### gitlab_add_group_member

Add a user to a group

**Parameters:**

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| `group_id` | `string` | Yes | The ID or URL-encoded path of the group |
| `user_id` | `number` | Yes | The ID of the user |
| `access_level` | `number` | Yes | Access level (10=Guest, 20=Reporter, 30=Developer, 40=Maintainer, 50=Owner) |

### gitlab_list_project_members

List members of a project

**Parameters:**

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| `project_id` | `string` | Yes | The ID or URL-encoded path of the project |

### gitlab_add_project_member

Add a user to a project

**Parameters:**

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| `project_id` | `string` | Yes | The ID or URL-encoded path of the project |
| `user_id` | `number` | Yes | The ID of the user |
| `access_level` | `number` | Yes | Access level (10=Guest, 20=Reporter, 30=Developer, 40=Maintainer, 50=Owner) |

---

Generated automatically from `src/utils/tools-data.ts`
