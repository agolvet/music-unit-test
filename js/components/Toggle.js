import { LitElement, html, css } from 'lit';

class Toggle extends LitElement {
  constructor() {
    super();

    this.active = true;
  }

  static properties = {
    active: {
      type: Boolean,
      reflect: true,
    },
  }

  static styles = css`
    :host {
      display: inline-block;
      position: relative;
      height: 30px;
      width: 30px;
      border: 1px solid #404040;
      background-color: #292929;
      cursor: pointer;
    }

    .cross {
      stroke: #404040;
      stroke-width: 8px;
    }

    .active {
      stroke: white;
    }
  `

  render() {
    return html`
      <svg 
        class="cross ${this.active ? "active" : ''}"
        viewbox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
        height="30"
        width="30"
        @click="${this._onClick}"
      >
        <line x1="20" x2="80" y1="80" y2="20"/>
        <line x1="20" x2="80" y1="20" y2="80"/>
      </svg>
    `
  }

  _onClick() {
    this.active = !this.active;

    const event = new CustomEvent('change', {
      bubbles: true,
      composed: true,
      detail: { value: this.active },
    });

    this.dispatchEvent(event);
  }
}


customElements.define('toggle-box', Toggle);