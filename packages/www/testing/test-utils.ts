// eslint-disable-next-line import/prefer-default-export
export const dispatchOnInputChange = (inputNode: HTMLInputElement, value: string): void => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set.call(
    inputNode,
    value
  );
  const event = new Event('change', { bubbles: true });
  inputNode.dispatchEvent(event);
};
