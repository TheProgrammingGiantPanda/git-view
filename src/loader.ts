type FileToPromise = Record<string, Promise<string[]>>;
interface Reducer {
  save: boolean;
  lines: string[];
}
class GitLoader {
  private _files: FileToPromise = {};

  private static async load(file: string): Promise<string[]> {
    const response: Response = await fetch(file);
    if (!response.ok) {
      return [];
    }
    const text = await response.text();
    return text.split('\n');
  }

  private _getFile(file: string): Promise<string[]> {
    this._files[file] = this._files[file] || GitLoader.load(file);
    return this._files[file];
  }

  async load(
    file: string,
    startTag: string,
    endTag: string = '###'
  ): Promise<string[]> {
    return (await this._getFile(file)).reduce(
      (accum: Reducer, next: string) => {
        if (accum.save && next.includes(endTag)) {
          // eslint-disable-next-line no-param-reassign
          accum.save = false;
        }
        if (next.includes(startTag)) {
          // eslint-disable-next-line no-param-reassign
          accum.save = true;
        }
        if (accum.save) {
          accum.lines.push(next);
        }
        return accum;
      },
      { save: true, lines: [] }
    ).lines;
  }
}

export const Loader = new GitLoader();
