import { atom, useRecoilState, SetterOrUpdater } from 'recoil';

const DeveloperSamOnBirthdayAtom = atom({
  key: 'dev-sam-on-birthday',
  default: false,
});

export const useDeveloperSamOnBirthday = (): boolean =>
  useRecoilState(DeveloperSamOnBirthdayAtom)[0];

export const useSetDeveloperSamOnBirthday = (): SetterOrUpdater<boolean> =>
  useRecoilState(DeveloperSamOnBirthdayAtom)[1];
