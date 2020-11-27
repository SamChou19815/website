import { getAppUser } from 'lib-firebase/authentication';

const ADMIN_EMAIL = 'sam@developersam.com';

// eslint-disable-next-line import/prefer-default-export
export const isAdminUser = (): boolean => getAppUser().email === ADMIN_EMAIL;
