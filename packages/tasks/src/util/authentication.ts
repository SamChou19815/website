import firebase from 'firebase/app';
import 'firebase/auth';
import { error } from './general';

export type AppUser = {
  readonly uid: string;
  readonly displayName: string;
  readonly email: string;
  readonly token: string;
};

/**
 * Returns the promise of an app user from the given raw firebase user.
 *
 * @param firebaseUser a raw firebase user or null.
 * @return the promise of an app user or null if there is no such user..
 */
export const toAppUser = async (firebaseUser: firebase.User | null): Promise<AppUser | null> => {
  if (firebaseUser == null) {
    return null;
  }
  const { uid, displayName, email } = firebaseUser;
  if (typeof displayName !== 'string' || typeof email !== 'string') {
    throw new Error('Bad user!');
  }
  const token: string = await firebaseUser.getIdToken(true);
  return { uid, displayName, email, token };
};

let appUser: AppUser | null = null;

/** Cache the given user in the memory. */
export const cacheAppUser = (user: AppUser): void => {
  appUser = user;
};

/**
 * Returns the global app user.
 *
 * If the user is not cached yet, it will not try to get one from firebase.
 * Instead, it will throw an error.
 */
export const getAppUser = (): AppUser => appUser ?? error('App is not initialized.');

/** Sign out from firebase auth. */
export const firebaseSignOut = (): void => {
  firebase
    .auth()
    .signOut()
    .then(() => {});
};
