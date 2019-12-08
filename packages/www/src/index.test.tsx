import initialize from '.';

it('Can import root index.tsx in test', () => expect(1 + 1).toBe(2));

it('Can initialize again.', () => {
  const element = document.createElement('div');
  element.id = 'root';
  document.body.appendChild(element);
  initialize();
  initialize();
  document.body.removeChild(element);
});
