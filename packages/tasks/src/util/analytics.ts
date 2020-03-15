import firebase from 'firebase/app';
import 'firebase/analytics';
import { AppUser } from '../firebase/authentication';
import { Page } from './constants';

const viewPage = (page: Page): void =>
  firebase.analytics().logEvent('screen-view', { screenName: page });

export const viewLandingPage = (): void => viewPage('Landing Page');
export const enterTasksView = (): void => viewPage('Tasks View');
export const enterGraphView = (): void => viewPage('Graph View');

type EventType = 'add-task' | 'edit-task' | 'delete-task';

export const setGAUser = ({ uid }: AppUser): void => {
  firebase.analytics().setUserId(uid);
  firebase.analytics().logEvent('login', {});
};

const reportEvent = (eventType: EventType): void => {
  firebase.analytics().logEvent<EventType>(eventType, {});
};

export const reportAddTaskEvent = (): void => reportEvent('add-task');
export const reportEditTaskEvent = (): void => reportEvent('edit-task');
export const reportDeleteTaskEvent = (): void => reportEvent('delete-task');
