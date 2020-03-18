import { useState } from 'react';

type UseFormManagerReturns<T extends {}> = [T, (change: Partial<T>) => void];

export default <T extends {}>(initialFormValues: T): UseFormManagerReturns<T> => {
  const [cachedInitialFormValues, setCachedInitialFormValues] = useState(initialFormValues);
  const [formValues, setFormValues] = useState(initialFormValues);

  if (cachedInitialFormValues !== initialFormValues) {
    setCachedInitialFormValues(initialFormValues);
    setFormValues(initialFormValues);
  }

  const setPartialFormValues = (change: Partial<T>): void =>
    setFormValues(previousFormValues => ({ ...previousFormValues, ...change }));

  return [formValues, setPartialFormValues];
};
