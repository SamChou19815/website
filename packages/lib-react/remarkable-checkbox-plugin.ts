/* eslint-disable no-param-reassign */

const SPACE = 32;
const LBRACKET = 91;
const RBRACKET = 93;
const UPPER_X = 88;
const LOWER_X = 120;

interface CheckboxToken extends Remarkable.TagToken {
  readonly checked: boolean;
}

let inputId = 0;
const INPUT_TYPE = 'type="checkbox" disabled';
const INPUT_CLASS = 'remarkable-task-list-item-checkbox';
const LABEL_CLASS = 'remarkable-task-list-item-label';
const SPAN_MARK_CLASS = 'remarkable-task-list-item-span-mark';

const getNewInputId = (): string => {
  const id = `remarkable-task-list-item-unique-id-${inputId}`;
  inputId += 1;
  return id;
};

const rendertasklist = (checked: boolean) => {
  const id = getNewInputId();
  const inputChecked = checked ? ' checked' : '';
  const inputHTML = `<input ${INPUT_TYPE} id="${id}" class="${INPUT_CLASS}"${inputChecked} />`;
  const spanMarkHTML = `<span class="${SPAN_MARK_CLASS}" />`;
  const labelHTML = `<label class="${LABEL_CLASS}" for="${id}">${inputHTML}${spanMarkHTML}</label>`;
  return labelHTML;
};

export default (md: Remarkable): void => {
  // Adapted from https://github.com/jonschlinkert/remarkable/issues/189#issuecomment-590026524

  md.inline.ruler.push(
    'tasklist',
    (state, silent) => {
      let { pos } = state;
      const maxpos = state.posMax;
      if (pos === maxpos) {
        return false;
      }
      if (state.src.charCodeAt(pos) !== LBRACKET) {
        return false;
      }
      pos += 1;
      if (state.src.charCodeAt(pos) === RBRACKET) {
        if (!silent) {
          state.push({
            type: 'tasklist',
            // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
            // @ts-ignore
            checked: false,
            level: state.level,
          });
        }
        state.pos = pos + 1;
        return true;
      }
      if (
        state.src.charCodeAt(pos) === LOWER_X ||
        state.src.charCodeAt(pos) === UPPER_X ||
        state.src.charCodeAt(pos) === SPACE
      ) {
        const checked = state.src.charCodeAt(pos) !== SPACE;
        pos += 1;
        if (state.src.charCodeAt(pos) !== RBRACKET) {
          return false;
        }
        if (!silent) {
          state.push({
            type: 'tasklist',
            // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
            // @ts-ignore
            checked,
            level: state.level,
          });
        }
        state.pos = pos + 1;
        return true;
      }
      return false;
    },
    {}
  );

  md.renderer.rules.tasklist = (tokens, index) =>
    rendertasklist((tokens[index] as CheckboxToken).checked);
  // eslint-disable-next-line @typescript-eslint/camelcase
  md.renderer.rules.list_item_open = () => '<li class="remarkable-li">';
};
