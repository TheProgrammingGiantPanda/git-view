import { css, html, LitElement } from 'lit';
import { property } from 'lit/decorators.js';

import { unsafeHTML } from 'lit/directives/unsafe-html.js';

import { Loader } from './loader.js';

export class GitView extends LitElement {
  static styles = [];

  @property({ type: String }) href: string = '';

  @property({ type: String }) startTag: string = '';

  @property({ type: String }) endTag: string = '';

  // @property({ type: String }) theme: string =
  //   '/node_modules/prismjs/themes/prism.css';

  @property({ attribute: false }) _items: string = '';

  connectedCallback() {
    super.connectedCallback();
    this.fetchData();
  }

  async fetchData() {
    this._items = (
      await Loader.load(this.href, this.startTag, this.endTag)
    ).join('\n');
  }

  render() {
    return this._items
      ? html`<pre><code>${unsafeHTML(this._items)} </code></pre>`
      : html`<pre><code>LOADING...</code></pre>`;
  }
}
