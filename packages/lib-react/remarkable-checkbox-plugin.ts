/* eslint-disable no-param-reassign */

export default (md: Remarkable): void => {
  // Adapted from https://github.com/jonschlinkert/remarkable/issues/189#issuecomment-590026524
  const rendertasklist = (checked: boolean) =>
    checked
      ? '<input type="checkbox" disabled class="remarkable-task-list-item-checkbox" checked />'
      : '<input type="checkbox" disabled class="remarkable-task-list-item-checkbox" />';

  md.inline.ruler.push(
    'tasklist',
    (state) => {
      let { pos } = state;
      const maxpos = state.posMax;
      if (pos === maxpos) {
        return false;
      }
      if (state.src.charCodeAt(pos) !== 91 /* [ */) {
        return false;
      }
      pos += 1;
      if (state.src.charCodeAt(pos) === 93 /* ] */) {
        state.push({
          type: 'tasklist',
          // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
          // @ts-ignore
          checked: false,
          level: state.level,
        });
        state.pos = pos + 1;
        return true;
      }
      if (
        state.src.charCodeAt(pos) === 120 /* x */ ||
        state.src.charCodeAt(pos) === 88 /* X */ ||
        state.src.charCodeAt(pos) === 32 /* Space */
      ) {
        const checked = state.src.charCodeAt(pos) !== 32;
        pos += 1;
        if (state.src.charCodeAt(pos) !== 93 /* ] */) {
          return false;
        }
        state.push({
          type: 'tasklist',
          // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
          // @ts-ignore
          checked,
          level: state.level,
        });
        state.pos = pos + 1;
        return true;
      }
      return false;
    },
    {}
  );
  md.renderer.rules.tasklist = (tokens, index) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    return rendertasklist(tokens[index].checked);
  };
};
