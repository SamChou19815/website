import { useState } from 'react';

import { shallowEqual } from 'react-redux';

type UseFormManagerReturns<T extends {}> = [T, (change: Partial<T>) => void];

export default <T extends {}>(initialFormValues: T): UseFormManagerReturns<T> => {
  const [cachedInitialFormValues, setCachedInitialFormValues] = useState(initialFormValues);
  const [formValues, setFormValues] = useState(initialFormValues);

  if (!shallowEqual(cachedInitialFormValues, initialFormValues)) {
    setCachedInitialFormValues(initialFormValues);
    setFormValues(initialFormValues);
  }

  const setPartialFormValues = (change: Partial<T>): void =>
    setFormValues((previousFormValues) => ({ ...previousFormValues, ...change }));

  return [formValues, setPartialFormValues];
};
