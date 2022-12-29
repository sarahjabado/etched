import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import toast from 'shared/utils/toast';
import { getStoredAuthToken, removeStoredAuthToken } from 'shared/utils/authToken';
import { PageLoader } from 'shared/components';

const Logout = () => {
    const history = useHistory();

    useEffect(() => {
        const processLogout = async () => {
            try {
                removeStoredAuthToken();
                toast.success('You have successfully logged out!');
                history.push('/');
            } catch (error) {
                toast.error(error);
            }
        };

        if (getStoredAuthToken()) {
            processLogout();
        }
    }, [history]);

    return <PageLoader />;
};

export default Logout;
