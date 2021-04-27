import { Auth, User, getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { Observable } from 'rxjs';

import firebaseApp from './firebase-initializer';

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
export const toAppUser = async (firebaseUser: User | null): Promise<AppUser | null> => {
  if (firebaseUser == null) {
    return null;
  }
  const { uid, displayName, email } = firebaseUser;
  if (typeof email !== 'string') {
    throw new Error('Bad user!');
  }
  const token: string = await firebaseUser.getIdToken(true);
  return { uid, displayName: displayName ?? 'GitHub User without display name', email, token };
};

let appUser: AppUser | null = null;

/** Cache the given user in the memory. */
const cacheAppUser = (user: AppUser): void => {
  appUser = user;
};

export const hasAppUser = (): boolean => appUser !== null;

/**
 * Returns the global app user.
 *
 * If the user is not cached yet, it will not try to get one from firebase.
 * Instead, it will throw an error.
 */
export const getAppUser = (): AppUser => {
  if (appUser != null) return appUser;
  throw new Error('App is not initialized.');
};

export const firebaseAuth: Auth = getAuth(firebaseApp);

const appUserAsyncProcessor = async (user: User | null) => {
  const appUserOptional = await toAppUser(user);
  if (appUserOptional != null) {
    cacheAppUser(appUserOptional);
  }
  return appUserOptional;
};

/** @returns a globally cached app user obserable, directly from firebase auth. */
export const appUser$: Observable<AppUser | null> = new Observable((subscriber) => {
  const unsubscribe = onAuthStateChanged(firebaseAuth, async (user) => {
    const appUserOptional = await appUserAsyncProcessor(user);
    subscriber.next(appUserOptional);
  });
  return { unsubscribe };
});

/** Sign out from firebase auth. */
export const firebaseSignOut = (): void => {
  signOut(firebaseAuth).then(() => {});
};
