import * as authentication from 'controllers/authentication';
import * as comments from 'controllers/comments';
import * as issues from 'controllers/issues';
import * as projects from 'controllers/projects';
import * as test from 'controllers/test';
import * as users from 'controllers/users';
import * as files from 'controllers/files';

export const attachPublicRoutes = (app: any): void => {
  if (process.env.NODE_ENV === 'test') {
    app.delete('/test/reset-database', test.resetDatabase);
    app.post('/test/create-account', test.createAccount);
  }

  app.post('/authentication/login', authentication.doLogin)
  app.post('/authentication/guest', authentication.createGuestAccount);
};

export const attachPrivateRoutes = (app: any): void => {
  // Comments
  app.post('/comments', comments.create);
  app.put('/comments/:commentId', comments.update);
  app.delete('/comments/:commentId', comments.remove);

  // Issues
  app.get('/issues', issues.getProjectIssues);
  app.get('/issues/:issueKey', issues.getIssueWithUsersAndComments);
  app.post('/issues', issues.create);
  app.put('/issues/:issueKey', issues.update);
  app.delete('/issues/:issueKey', issues.remove);

  // Projects
  app.get('/project', projects.getProjectWithUsersAndIssues);
  app.put('/project', projects.update);

  // User
  app.get('/currentUser', users.getCurrentUser);

  // Files
  app.put('/attachments/new', files.signedUpload);
  app.post('/attachments/retrieve', files.signedDownload);
};
