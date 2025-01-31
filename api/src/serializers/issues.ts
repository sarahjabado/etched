import { pick } from 'lodash';

import { Issue } from 'entities';

export const issuePartial = (issue: Issue): Partial<Issue> =>
  pick(issue, [
    'id',
    'key',
    'title',
    'type',
    'status',
    'priority',
    'listPosition',
    'createdAt',
    'updatedAt',
    'userIds',
  ]);
