import { LitElement, html, css } from 'lit';
import "./NumberBox.js"

class Slider extends LitElement {
  constructor() {
    super();

    this.width = 200;

    this._value = 0;
    this._min = 0;
    this._max = 1;
    this.integer = false;

    this._onMouseDown = this._onMouseDown.bind(this);
  }

  static properties = {
    value: {
      type: Number,
    },
    min: {
      type: Number,
    },
    max: {
      type: Number,
    },
  }

  static styles = css`
    :host {
      display: inline-block;
      position: relative;
      height: 30px;
      width: 200px;
    }

    :host > div {
      height: 100%;
      background-color: #292929;
      border: 1px solid #404040;
    }

    :host > div:active {
      border: 1px solid #ED6447;
    }

    .rect-value {
      fill: white;
    }
  `

  set value(value) {
    this._value = value;
    this.requestUpdate();
  }

  get value() {
    return this._value;
  }

  set min(value) {
    this._min = value;
    // if (this._value < this._min) {
      // this._updateValue(this._min);
    // }
  }

  get min() {
    return this._min;
  }

  set max(value) {
    this._max = value;
    // if (this._value > this._max) {
    //   this._updateValue(this._max);
    // }
  }

  get max() {
    return this._max;
  }
  
  render() {
    const widthRect = (this._value-this._min)/(this._max - this._min) * 100;

    return html`
      <div
        tabindex="0"
        @mousedown="${this._onMouseDown}"
      >
        <svg 
          class="rect-value"
          viewbox="0 0 100 100"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
          height="30"
          width="200"
        >
          <rect x="0" width="${widthRect}" height="100"/>
        </svg>
      <div>
    `
  }

  _onMouseDown(e) {
    const xClick = e.layerX;
    const newValue = (this._max - this._min)*xClick/this.width;
    this.value = newValue;

    window.addEventListener("mousemove", this._onMouseMove);
  }

  _onMouseMove(e) {
    console.log(e);
  }
}


customElements.define('my-slider', Slider);