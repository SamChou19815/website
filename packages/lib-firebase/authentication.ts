import firebase from 'firebase/app';
import { error } from 'lib-common';
import { Observable } from 'rxjs';

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
const cacheAppUser = (user: AppUser): void => {
  appUser = user;
};

const setGAUser = ({ uid }: AppUser): void => {
  firebase.analytics().setUserId(uid);
  firebase.analytics().logEvent('login', {});
};

export const hasAppUser = (): boolean => appUser !== null;

/**
 * Returns the global app user.
 *
 * If the user is not cached yet, it will not try to get one from firebase.
 * Instead, it will throw an error.
 */
export const getAppUser = (): AppUser => appUser ?? error('App is not initialized.');

const firebaseAuth = firebase.auth();

const appUserAsyncProcessor = async (user: firebase.User | null) => {
  const appUserOptional = await toAppUser(user);
  if (appUserOptional != null) {
    cacheAppUser(appUserOptional);
    setGAUser(appUserOptional);
  }
  return appUserOptional;
};

/** @returns a globally cached app user obserable, directly from firebase auth. */
export const appUser$: Observable<AppUser | null> = new Observable((subscriber) => {
  const unsubscribe = firebaseAuth.onAuthStateChanged(async (user) => {
    const appUserOptional = await appUserAsyncProcessor(user);
    subscriber.next(appUserOptional);
  });
  return { unsubscribe };
});

/** Sign out from firebase auth. */
export const firebaseSignOut = (): void => {
  firebase
    .auth()
    .signOut()
    .then(() => {});
};
