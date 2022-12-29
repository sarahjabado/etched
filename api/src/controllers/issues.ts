import { Issue } from 'entities';
import { catchErrors } from 'errors';
import { updateEntity, deleteEntity, createEntity, findEntityOrThrow } from 'utils/typeorm';

export const getProjectIssues = catchErrors(async (req, res) => {
  const { projectId } = req.currentUser;
  const { searchTerm } = req.query;

  let whereSQL = 'issue.projectId = :projectId';

  if (searchTerm) {
    whereSQL += ' AND (issue.title ILIKE :searchTerm OR issue.descriptionText ILIKE :searchTerm OR issue.key ILIKE :searchTerm)';
  }

  const issues = await Issue.createQueryBuilder('issue')
    .select()
    .where(whereSQL, { projectId, searchTerm: `%${searchTerm}%` })
    .getMany();

  res.respond({ issues });
});

export const getIssueWithUsersAndComments = catchErrors(async (req, res) => {
  const issues = await Issue.find({ key: req.params.issueKey });

  if (!issues || !issues[0]) {
    // Throw issue not found error.
    res.respond({});
    return;
  }

  const issue = await findEntityOrThrow(Issue, issues[0].id, {
    relations: ['users', 'comments', 'comments.user'],
  });
  res.respond({ issue });
});

export const create = catchErrors(async (req, res) => {
  const listPosition = await calculateListPosition(req.body);
  const issue = await createEntity(Issue, { ...req.body, listPosition });
  res.respond({ issue });
});

export const update = catchErrors(async (req, res) => {
  const issues = await Issue.find({ key: req.params.issueKey });

  if (!issues || !issues[0]) {
    // Throw issue not found error.
    res.respond({});
    return;
  }

  const issue = await updateEntity(Issue, issues[0].id, req.body);
  res.respond({ issue });
});

export const remove = catchErrors(async (req, res) => {
  const issue = await Issue.find({ key: req.params.issueKey });

  if (!issue || !issue[0]) {
    // Throw issue not found error.
    res.respond({});
    return;
  }

  const issueToDelete = await deleteEntity(Issue, issue[0].id);
  res.respond({ issueToDelete });
});

const calculateListPosition = async ({ projectId, status }: Issue): Promise<number> => {
  const issues = await Issue.find({ projectId, status });

  const listPositions = issues.map(({ listPosition }) => listPosition);

  if (listPositions.length > 0) {
    return Math.min(...listPositions) - 1;
  }
  return 1;
};
