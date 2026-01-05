/**
 * Type definitions for GitLab repository operations
 */

/**
 * Position object for inline comments in merge request discussions
 */
export interface DiscussionPosition {
  base_sha: string;
  start_sha: string;
  head_sha: string;
  new_path: string;
  old_path: string;
  new_line?: number | null;
  old_line?: number | null;
}

/**
 * Diff refs from merge request for creating discussions
 */
export interface DiffRefs {
  base_sha: string;
  start_sha: string;
  head_sha: string;
}
