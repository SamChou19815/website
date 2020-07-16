// eslint-disable-next-line import/prefer-default-export
export const dispatchOnInputChange = (inputNode: HTMLInputElement, value: string): void => {
  // @ts-expect-error: too dynamic
  Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set.call(
    inputNode,
    value
  );
  const event = new Event('change', { bubbles: true });
  inputNode.dispatchEvent(event);
};
