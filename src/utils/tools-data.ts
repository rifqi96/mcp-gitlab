/**
 * Tool definitions for GitLab MCP Server
 */

export const toolDefinitions = [
  // Repository tools
  {
    name: 'gitlab_list_projects',
    description: 'List GitLab projects accessible to the user',
    inputSchema: {
      type: 'object',
      properties: {
        search: {
          type: 'string',
          description: 'Search projects by name'
        },
        owned: {
          type: 'boolean',
          description: 'Limit to projects explicitly owned by the current user'
        },
        membership: {
          type: 'boolean',
          description: 'Limit to projects the current user is a member of'
        },
        per_page: {
          type: 'number',
          description: 'Number of projects to return per page (max 100)'
        }
      }
    }
  },
  {
    name: 'gitlab_get_project',
    description: 'Get details of a specific GitLab project',
    inputSchema: {
      type: 'object',
      properties: {
        project_id: {
          type: 'string',
          description: 'The ID or URL-encoded path of the project'
        }
      },
      required: ['project_id']
    }
  },
  {
    name: 'gitlab_list_branches',
    description: 'List branches of a GitLab project',
    inputSchema: {
      type: 'object',
      properties: {
        project_id: {
          type: 'string',
          description: 'The ID or URL-encoded path of the project'
        },
        search: {
          type: 'string',
          description: 'Search branches by name'
        }
      },
      required: ['project_id']
    }
  },
  {
    name: 'gitlab_list_merge_requests',
    description: 'List merge requests in a GitLab project',
    inputSchema: {
      type: 'object',
      properties: {
        project_id: {
          type: 'string',
          description: 'The ID or URL-encoded path of the project'
        },
        state: {
          type: 'string',
          description: 'Return merge requests with specified state (opened, closed, locked, merged)',
          enum: ['opened', 'closed', 'locked', 'merged']
        },
        scope: {
          type: 'string',
          description: 'Return merge requests for the specified scope (created_by_me, assigned_to_me, all)',
          enum: ['created_by_me', 'assigned_to_me', 'all']
        }
      },
      required: ['project_id']
    }
  },
  {
    name: 'gitlab_get_merge_request',
    description: 'Get details of a specific merge request',
    inputSchema: {
      type: 'object',
      properties: {
        project_id: {
          type: 'string',
          description: 'The ID or URL-encoded path of the project'
        },
        merge_request_iid: {
          type: 'number',
          description: 'The internal ID of the merge request'
        }
      },
      required: ['project_id', 'merge_request_iid']
    }
  },
  {
    name: 'gitlab_get_merge_request_changes',
    description: 'Get changes (diff) of a specific merge request',
    inputSchema: {
      type: 'object',
      properties: {
        project_id: {
          type: 'string',
          description: 'The ID or URL-encoded path of the project'
        },
        merge_request_iid: {
          type: 'number',
          description: 'The internal ID of the merge request'
        }
      },
      required: ['project_id', 'merge_request_iid']
    }
  },
  {
    name: 'gitlab_create_merge_request_note',
    description: 'Add a comment to a merge request',
    inputSchema: {
      type: 'object',
      properties: {
        project_id: {
          type: 'string',
          description: 'The ID or URL-encoded path of the project'
        },
        merge_request_iid: {
          type: 'number',
          description: 'The internal ID of the merge request'
        },
        body: {
          type: 'string',
          description: 'The content of the note/comment'
        }
      },
      required: ['project_id', 'merge_request_iid', 'body']
    }
  },
  {
    name: 'gitlab_create_merge_request_note_internal',
    description: 'Add a comment to a merge request with option to make it an internal note',
    inputSchema: {
      type: 'object',
      properties: {
        project_id: {
          type: 'string',
          description: 'The ID or URL-encoded path of the project'
        },
        merge_request_iid: {
          type: 'number',
          description: 'The internal ID of the merge request'
        },
        body: {
          type: 'string',
          description: 'The content of the note/comment'
        },
        internal: {
          type: 'boolean',
          description: 'If true, the note will be marked as an internal note visible only to project members'
        }
      },
      required: ['project_id', 'merge_request_iid', 'body']
    }
  },
  {
    name: 'gitlab_update_merge_request',
    description: 'Update a merge request title and description',
    inputSchema: {
      type: 'object',
      properties: {
        project_id: {
          type: 'string',
          description: 'The ID or URL-encoded path of the project'
        },
        merge_request_iid: {
          type: 'number',
          description: 'The internal ID of the merge request'
        },
        title: {
          type: 'string',
          description: 'The title of the merge request'
        },
        description: {
          type: 'string',
          description: 'The description of the merge request'
        }
      },
      required: ['project_id', 'merge_request_iid']
    }
  },
  {
    name: 'gitlab_create_merge_request_discussion',
    description: 'Create an inline comment/discussion on a specific line in a merge request. This is the full-featured version that requires commit SHAs.',
    inputSchema: {
      type: 'object',
      properties: {
        project_id: {
          type: 'string',
          description: 'The ID or URL-encoded path of the project'
        },
        merge_request_iid: {
          type: 'number',
          description: 'The internal ID of the merge request'
        },
        body: {
          type: 'string',
          description: 'The content of the comment'
        },
        position: {
          type: 'object',
          description: 'Position information for the inline comment',
          properties: {
            base_sha: {
              type: 'string',
              description: 'SHA of the base commit (parent of the MR)'
            },
            start_sha: {
              type: 'string',
              description: 'SHA of the start commit (where the MR starts)'
            },
            head_sha: {
              type: 'string',
              description: 'SHA of the head commit (latest commit in the MR)'
            },
            new_path: {
              type: 'string',
              description: 'Path to the file in the new version'
            },
            old_path: {
              type: 'string',
              description: 'Path to the file in the old version (same as new_path if not renamed)'
            },
            new_line: {
              type: ['number', 'null'],
              description: 'Line number in the new version (null if line was removed)'
            },
            old_line: {
              type: ['number', 'null'],
              description: 'Line number in the old version (null if line was added)'
            }
          },
          required: ['base_sha', 'start_sha', 'head_sha', 'new_path', 'old_path']
        }
      },
      required: ['project_id', 'merge_request_iid', 'body', 'position']
    }
  },
  {
    name: 'gitlab_create_merge_request_discussion_simple',
    description: 'Create an inline comment on a specific line in a merge request (simplified version). Automatically fetches commit SHAs from the merge request.',
    inputSchema: {
      type: 'object',
      properties: {
        project_id: {
          type: 'string',
          description: 'The ID or URL-encoded path of the project'
        },
        merge_request_iid: {
          type: 'number',
          description: 'The internal ID of the merge request'
        },
        body: {
          type: 'string',
          description: 'The content of the comment'
        },
        file_path: {
          type: 'string',
          description: 'Path to the file to comment on'
        },
        line_number: {
          type: 'number',
          description: 'Line number to comment on'
        },
        line_type: {
          type: 'string',
          description: 'Type of line: "new" for added/modified lines, "old" for removed lines',
          enum: ['new', 'old']
        }
      },
      required: ['project_id', 'merge_request_iid', 'body', 'file_path', 'line_number', 'line_type']
    }
  },
  {
    name: 'gitlab_reply_to_discussion',
    description: 'Add a reply to an existing discussion thread in a merge request. Use this to continue conversations on inline comments or general discussions.',
    inputSchema: {
      type: 'object',
      properties: {
        project_id: {
          type: 'string',
          description: 'The ID or URL-encoded path of the project'
        },
        merge_request_iid: {
          type: 'number',
          description: 'The internal ID of the merge request'
        },
        discussion_id: {
          type: 'string',
          description: 'The ID of the discussion thread to reply to'
        },
        body: {
          type: 'string',
          description: 'The content of the reply'
        }
      },
      required: ['project_id', 'merge_request_iid', 'discussion_id', 'body']
    }
  },
  {
    name: 'gitlab_list_merge_request_notes',
    description: 'List all notes/comments on a merge request',
    inputSchema: {
      type: 'object',
      properties: {
        project_id: {
          type: 'string',
          description: 'The ID or URL-encoded path of the project'
        },
        merge_request_iid: {
          type: 'number',
          description: 'The internal ID of the merge request'
        }
      },
      required: ['project_id', 'merge_request_iid']
    }
  },
  {
    name: 'gitlab_list_merge_request_discussions',
    description: 'List all discussion threads on a merge request (includes inline and general discussions)',
    inputSchema: {
      type: 'object',
      properties: {
        project_id: {
          type: 'string',
          description: 'The ID or URL-encoded path of the project'
        },
        merge_request_iid: {
          type: 'number',
          description: 'The internal ID of the merge request'
        }
      },
      required: ['project_id', 'merge_request_iid']
    }
  },
  {
    name: 'gitlab_list_issues',
    description: 'List issues in a GitLab project',
    inputSchema: {
      type: 'object',
      properties: {
        project_id: {
          type: 'string',
          description: 'The ID or URL-encoded path of the project'
        },
        state: {
          type: 'string',
          description: 'Return issues with specified state (opened, closed)',
          enum: ['opened', 'closed']
        },
        labels: {
          type: 'string',
          description: 'Comma-separated list of label names'
        }
      },
      required: ['project_id']
    }
  },
  {
    name: 'gitlab_get_repository_file',
    description: 'Get content of a file in a repository',
    inputSchema: {
      type: 'object',
      properties: {
        project_id: {
          type: 'string',
          description: 'The ID or URL-encoded path of the project'
        },
        file_path: {
          type: 'string',
          description: 'Path of the file in the repository'
        },
        ref: {
          type: 'string',
          description: 'The name of branch, tag or commit'
        }
      },
      required: ['project_id', 'file_path']
    }
  },
  {
    name: 'gitlab_compare_branches',
    description: 'Compare branches, tags or commits',
    inputSchema: {
      type: 'object',
      properties: {
        project_id: {
          type: 'string',
          description: 'The ID or URL-encoded path of the project'
        },
        from: {
          type: 'string',
          description: 'The commit SHA or branch name to compare from'
        },
        to: {
          type: 'string',
          description: 'The commit SHA or branch name to compare to'
        }
      },
      required: ['project_id', 'from', 'to']
    }
  },
  
  // Integration tools
  {
    name: 'gitlab_list_integrations',
    description: 'List all available project integrations/services',
    inputSchema: {
      type: 'object',
      properties: {
        project_id: {
          type: 'string',
          description: 'The ID or URL-encoded path of the project'
        }
      },
      required: ['project_id']
    }
  },
  {
    name: 'gitlab_get_integration',
    description: 'Get integration details for a project',
    inputSchema: {
      type: 'object',
      properties: {
        project_id: {
          type: 'string',
          description: 'The ID or URL-encoded path of the project'
        },
        integration: {
          type: 'string',
          description: 'The name of the integration (e.g., slack)'
        }
      },
      required: ['project_id', 'integration']
    }
  },
  {
    name: 'gitlab_update_slack_integration',
    description: 'Update Slack integration settings for a project',
    inputSchema: {
      type: 'object',
      properties: {
        project_id: {
          type: 'string',
          description: 'The ID or URL-encoded path of the project'
        },
        webhook: {
          type: 'string',
          description: 'The Slack webhook URL'
        },
        username: {
          type: 'string',
          description: 'The Slack username'
        },
        channel: {
          type: 'string',
          description: 'The Slack channel name'
        }
      },
      required: ['project_id', 'webhook']
    }
  },
  {
    name: 'gitlab_disable_slack_integration',
    description: 'Disable Slack integration for a project',
    inputSchema: {
      type: 'object',
      properties: {
        project_id: {
          type: 'string',
          description: 'The ID or URL-encoded path of the project'
        }
      },
      required: ['project_id']
    }
  },
  {
    name: 'gitlab_list_webhooks',
    description: 'List webhooks for a project',
    inputSchema: {
      type: 'object',
      properties: {
        project_id: {
          type: 'string',
          description: 'The ID or URL-encoded path of the project'
        }
      },
      required: ['project_id']
    }
  },
  {
    name: 'gitlab_get_webhook',
    description: 'Get details of a specific webhook',
    inputSchema: {
      type: 'object',
      properties: {
        project_id: {
          type: 'string',
          description: 'The ID or URL-encoded path of the project'
        },
        webhook_id: {
          type: 'number',
          description: 'The ID of the webhook'
        }
      },
      required: ['project_id', 'webhook_id']
    }
  },
  {
    name: 'gitlab_add_webhook',
    description: 'Add a new webhook to a project',
    inputSchema: {
      type: 'object',
      properties: {
        project_id: {
          type: 'string',
          description: 'The ID or URL-encoded path of the project'
        },
        url: {
          type: 'string',
          description: 'The webhook URL'
        },
        token: {
          type: 'string',
          description: 'Secret token to validate received payloads'
        },
        push_events: {
          type: 'boolean',
          description: 'Trigger webhook for push events'
        },
        issues_events: {
          type: 'boolean',
          description: 'Trigger webhook for issues events'
        },
        merge_requests_events: {
          type: 'boolean',
          description: 'Trigger webhook for merge request events'
        },
        enable_ssl_verification: {
          type: 'boolean',
          description: 'Enable SSL verification for the webhook'
        }
      },
      required: ['project_id', 'url']
    }
  },
  {
    name: 'gitlab_update_webhook',
    description: 'Update an existing webhook',
    inputSchema: {
      type: 'object',
      properties: {
        project_id: {
          type: 'string',
          description: 'The ID or URL-encoded path of the project'
        },
        webhook_id: {
          type: 'number',
          description: 'The ID of the webhook'
        },
        url: {
          type: 'string',
          description: 'The webhook URL'
        },
        token: {
          type: 'string',
          description: 'Secret token to validate received payloads'
        },
        push_events: {
          type: 'boolean',
          description: 'Trigger webhook for push events'
        },
        issues_events: {
          type: 'boolean',
          description: 'Trigger webhook for issues events'
        },
        merge_requests_events: {
          type: 'boolean',
          description: 'Trigger webhook for merge request events'
        },
        enable_ssl_verification: {
          type: 'boolean',
          description: 'Enable SSL verification for the webhook'
        }
      },
      required: ['project_id', 'webhook_id', 'url']
    }
  },
  {
    name: 'gitlab_delete_webhook',
    description: 'Delete a webhook',
    inputSchema: {
      type: 'object',
      properties: {
        project_id: {
          type: 'string',
          description: 'The ID or URL-encoded path of the project'
        },
        webhook_id: {
          type: 'number',
          description: 'The ID of the webhook'
        }
      },
      required: ['project_id', 'webhook_id']
    }
  },
  {
    name: 'gitlab_test_webhook',
    description: 'Test a webhook',
    inputSchema: {
      type: 'object',
      properties: {
        project_id: {
          type: 'string',
          description: 'The ID or URL-encoded path of the project'
        },
        webhook_id: {
          type: 'number',
          description: 'The ID of the webhook'
        }
      },
      required: ['project_id', 'webhook_id']
    }
  },

  // CI/CD tools
  {
    name: 'gitlab_list_trigger_tokens',
    description: 'List pipeline trigger tokens',
    inputSchema: {
      type: 'object',
      properties: {
        project_id: {
          type: 'string',
          description: 'The ID or URL-encoded path of the project'
        }
      },
      required: ['project_id']
    }
  },
  {
    name: 'gitlab_get_trigger_token',
    description: 'Get details of a pipeline trigger token',
    inputSchema: {
      type: 'object',
      properties: {
        project_id: {
          type: 'string',
          description: 'The ID or URL-encoded path of the project'
        },
        trigger_id: {
          type: 'number',
          description: 'The ID of the trigger'
        }
      },
      required: ['project_id', 'trigger_id']
    }
  },
  {
    name: 'gitlab_create_trigger_token',
    description: 'Create a new pipeline trigger token',
    inputSchema: {
      type: 'object',
      properties: {
        project_id: {
          type: 'string',
          description: 'The ID or URL-encoded path of the project'
        },
        description: {
          type: 'string',
          description: 'The trigger description'
        }
      },
      required: ['project_id', 'description']
    }
  },
  {
    name: 'gitlab_update_trigger_token',
    description: 'Update a pipeline trigger token',
    inputSchema: {
      type: 'object',
      properties: {
        project_id: {
          type: 'string',
          description: 'The ID or URL-encoded path of the project'
        },
        trigger_id: {
          type: 'number',
          description: 'The ID of the trigger'
        },
        description: {
          type: 'string',
          description: 'The new trigger description'
        }
      },
      required: ['project_id', 'trigger_id', 'description']
    }
  },
  {
    name: 'gitlab_delete_trigger_token',
    description: 'Delete a pipeline trigger token',
    inputSchema: {
      type: 'object',
      properties: {
        project_id: {
          type: 'string',
          description: 'The ID or URL-encoded path of the project'
        },
        trigger_id: {
          type: 'number',
          description: 'The ID of the trigger'
        }
      },
      required: ['project_id', 'trigger_id']
    }
  },
  {
    name: 'gitlab_trigger_pipeline',
    description: 'Trigger a pipeline run',
    inputSchema: {
      type: 'object',
      properties: {
        project_id: {
          type: 'string',
          description: 'The ID or URL-encoded path of the project'
        },
        ref: {
          type: 'string',
          description: 'The branch or tag name to run the pipeline for'
        },
        token: {
          type: 'string',
          description: 'The trigger token'
        },
        variables: {
          type: 'object',
          description: 'Variables to pass to the pipeline',
          additionalProperties: { type: 'string' }
        }
      },
      required: ['project_id', 'ref', 'token']
    }
  },
  {
    name: 'gitlab_list_cicd_variables',
    description: 'List CI/CD variables for a project',
    inputSchema: {
      type: 'object',
      properties: {
        project_id: {
          type: 'string',
          description: 'The ID or URL-encoded path of the project'
        }
      },
      required: ['project_id']
    }
  },
  {
    name: 'gitlab_get_cicd_variable',
    description: 'Get a specific CI/CD variable',
    inputSchema: {
      type: 'object',
      properties: {
        project_id: {
          type: 'string',
          description: 'The ID or URL-encoded path of the project'
        },
        key: {
          type: 'string',
          description: 'The key of the variable'
        }
      },
      required: ['project_id', 'key']
    }
  },
  {
    name: 'gitlab_create_cicd_variable',
    description: 'Create a new CI/CD variable',
    inputSchema: {
      type: 'object',
      properties: {
        project_id: {
          type: 'string',
          description: 'The ID or URL-encoded path of the project'
        },
        key: {
          type: 'string',
          description: 'The key of the variable'
        },
        value: {
          type: 'string',
          description: 'The value of the variable'
        },
        protected: {
          type: 'boolean',
          description: 'Whether the variable is protected'
        },
        masked: {
          type: 'boolean',
          description: 'Whether the variable is masked'
        }
      },
      required: ['project_id', 'key', 'value']
    }
  },
  {
    name: 'gitlab_update_cicd_variable',
    description: 'Update a CI/CD variable',
    inputSchema: {
      type: 'object',
      properties: {
        project_id: {
          type: 'string',
          description: 'The ID or URL-encoded path of the project'
        },
        key: {
          type: 'string',
          description: 'The key of the variable'
        },
        value: {
          type: 'string',
          description: 'The value of the variable'
        },
        protected: {
          type: 'boolean',
          description: 'Whether the variable is protected'
        },
        masked: {
          type: 'boolean',
          description: 'Whether the variable is masked'
        }
      },
      required: ['project_id', 'key', 'value']
    }
  },
  {
    name: 'gitlab_delete_cicd_variable',
    description: 'Delete a CI/CD variable',
    inputSchema: {
      type: 'object',
      properties: {
        project_id: {
          type: 'string',
          description: 'The ID or URL-encoded path of the project'
        },
        key: {
          type: 'string',
          description: 'The key of the variable'
        }
      },
      required: ['project_id', 'key']
    }
  },

  // Users and Groups tools
  {
    name: 'gitlab_list_users',
    description: 'List GitLab users',
    inputSchema: {
      type: 'object',
      properties: {
        search: {
          type: 'string',
          description: 'Search users by username, name or email'
        },
        active: {
          type: 'boolean',
          description: 'Filter users by active status'
        }
      }
    }
  },
  {
    name: 'gitlab_get_user',
    description: 'Get details of a specific user',
    inputSchema: {
      type: 'object',
      properties: {
        user_id: {
          type: 'number',
          description: 'The ID of the user'
        }
      },
      required: ['user_id']
    }
  },
  {
    name: 'gitlab_list_groups',
    description: 'List GitLab groups',
    inputSchema: {
      type: 'object',
      properties: {
        search: {
          type: 'string',
          description: 'Search groups by name'
        },
        owned: {
          type: 'boolean',
          description: 'Limit to groups explicitly owned by the current user'
        }
      }
    }
  },
  {
    name: 'gitlab_get_group',
    description: 'Get details of a specific group',
    inputSchema: {
      type: 'object',
      properties: {
        group_id: {
          type: 'string',
          description: 'The ID or URL-encoded path of the group'
        }
      },
      required: ['group_id']
    }
  },
  {
    name: 'gitlab_list_group_members',
    description: 'List members of a group',
    inputSchema: {
      type: 'object',
      properties: {
        group_id: {
          type: 'string',
          description: 'The ID or URL-encoded path of the group'
        }
      },
      required: ['group_id']
    }
  },
  {
    name: 'gitlab_add_group_member',
    description: 'Add a user to a group',
    inputSchema: {
      type: 'object',
      properties: {
        group_id: {
          type: 'string',
          description: 'The ID or URL-encoded path of the group'
        },
        user_id: {
          type: 'number',
          description: 'The ID of the user'
        },
        access_level: {
          type: 'number',
          description: 'Access level (10=Guest, 20=Reporter, 30=Developer, 40=Maintainer, 50=Owner)',
          enum: [10, 20, 30, 40, 50]
        }
      },
      required: ['group_id', 'user_id', 'access_level']
    }
  },
  {
    name: 'gitlab_list_project_members',
    description: 'List members of a project',
    inputSchema: {
      type: 'object',
      properties: {
        project_id: {
          type: 'string',
          description: 'The ID or URL-encoded path of the project'
        }
      },
      required: ['project_id']
    }
  },
  {
    name: 'gitlab_add_project_member',
    description: 'Add a user to a project',
    inputSchema: {
      type: 'object',
      properties: {
        project_id: {
          type: 'string',
          description: 'The ID or URL-encoded path of the project'
        },
        user_id: {
          type: 'number',
          description: 'The ID of the user'
        },
        access_level: {
          type: 'number',
          description: 'Access level (10=Guest, 20=Reporter, 30=Developer, 40=Maintainer, 50=Owner)',
          enum: [10, 20, 30, 40, 50]
        }
      },
      required: ['project_id', 'user_id', 'access_level']
    }
  }
];

// Export lists of tools by category for easier selection
export const repositoryTools = toolDefinitions.slice(0, 17);  // 17 repository tools (was 15, now 17)
export const integrationTools = toolDefinitions.slice(17, 27);  // 10 integration tools
export const cicdTools = toolDefinitions.slice(27, 38);  // 11 CI/CD tools
export const usersGroupsTools = toolDefinitions.slice(38);  // 8 users/groups tools
