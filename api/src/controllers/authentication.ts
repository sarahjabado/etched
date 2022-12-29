import { catchErrors } from 'errors';
import { signToken } from 'utils/authToken';
import createAccount from 'database/createGuestAccount';
import { User } from 'entities';

export const createGuestAccount = catchErrors(async (_req, res) => {
  const user = await createAccount();
  res.respond({
    authToken: signToken({ sub: user.id }),
  });
});

export const doLogin = catchErrors(async (req, res): Promise<void> => {
  const username = req.body.email || null;
  const password = req.body.password || null;

  const failResponse = () => {
    res.respond({
      success: false,
      message: 'Invalid email or password.',
    });
  }

  if (!username || !password) {
    console.log('Missing request body.');
    failResponse();

    return;
  }

  const user = await User.isValidLogin(username, password);

  if (!user) {
    console.log('isValidLogin failed');
    failResponse();

    return;
  }

  res.respond({
    success: true,
    message: null,
    authToken: signToken({ sub: user.id }),
  });

});