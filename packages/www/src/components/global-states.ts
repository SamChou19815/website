import { atom, useRecoilState, SetterOrUpdater } from 'recoil';

const DeveloperSamOnBirthdayAtom = atom({
  key: 'dev-sam-on-birthday',
  default: false,
});

const TerminalForceOnBirthdayAtom = atom({
  key: 'terminal-force-on-birthday',
  default: false,
});

type TimelinePills = {
  readonly workChecked: boolean;
  readonly projectsChecked: boolean;
  readonly eventsChecked: boolean;
};

const TimelinePillsAtom = atom<TimelinePills>({
  key: 'timeline-pills',
  default: {
    workChecked: true,
    projectsChecked: true,
    eventsChecked: true,
  },
});

export const useDeveloperSamOnBirthday = (): boolean =>
  useRecoilState(DeveloperSamOnBirthdayAtom)[0];

export const useSetDeveloperSamOnBirthday = (): SetterOrUpdater<boolean> =>
  useRecoilState(DeveloperSamOnBirthdayAtom)[1];

export const useTerminalForceOnBirthday = (): boolean =>
  useRecoilState(TerminalForceOnBirthdayAtom)[0];

export const useSetTerminalForceOnBirthday = (): SetterOrUpdater<boolean> =>
  useRecoilState(TerminalForceOnBirthdayAtom)[1];

export const useTimelinePillsState = (): readonly [TimelinePills, SetterOrUpdater<TimelinePills>] =>
  useRecoilState(TimelinePillsAtom);
