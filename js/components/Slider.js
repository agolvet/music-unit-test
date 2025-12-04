import { LitElement, html, css } from 'lit';
import "./NumberBox.js"

class Slider extends LitElement {
  constructor() {
    super();

    this.width = 200;

    this._value = 0;
    this._min = 0;
    this._max = 1;

    this._widthRect = 0;

    this._onMouseDown = this._onMouseDown.bind(this);
    this._onMouseMove = this._onMouseMove.bind(this);
    this._onMouseUp = this._onMouseUp.bind(this);
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
      display: flex;
    }

    .slider {
      height: 100%;
      background-color: #292929;
      border: 1px solid #404040;
      margin-right: 5px;
    }

    .slider:active {
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
    this._widthRect = this._widthFromValue(this._value);

    return html`
      <div>
        <div
          class="slider"
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
            <rect x="0" width="${this._widthRect}" height="100"/>
          </svg>
        </div>
        <number-box
          min="${this._min}"
          max="${this._max}"
          value="${this._value}"
          @change="${e => this.value = e.detail.value}"
        ><number-box>
      </div>
    `
  }

  _widthFromValue(value) {
    return (value - this._min) / (this._max - this._min) * 100;
  }

  _valueFromWidth(width) {
    return width/100*(this._max - this._min) + this._min;
  }

  _pixelToViewbox(val) {
    return val/this.width * 100;
  }

  // _valueFromWidth(width) {

  // }

  _triggerInput() {
    const event = new CustomEvent('input', {
      bubbles: true,
      composed: true,
      detail: { value: this._value },
    });

    this.dispatchEvent(event);
  }

  _triggerChange() {
    const event = new CustomEvent('change', {
      bubbles: true,
      composed: true,
      detail: { value: this._value },
    });

    this.dispatchEvent(event);
  }

  _onMouseDown(e) {
    const xClick = e.layerX;
    this._windownXClickDown = e.clientX;
   
    this.value = (this._max - this._min)*xClick/this.width + this._min;
    this._widthOnClick = this._widthFromValue(this._value);

    this._triggerInput();

    window.addEventListener("mousemove", this._onMouseMove);
    window.addEventListener("mouseup", this._onMouseUp);
  }

  _onMouseMove(e) {
    const mouseDisplacement = e.clientX - this._windownXClickDown;  
    this._widthRect = Math.min(100, Math.max(0, this._widthOnClick + this._pixelToViewbox(mouseDisplacement)));
    this.value = this._valueFromWidth(this._widthRect);

    this._triggerInput();

    this.requestUpdate();
  }

  _onMouseUp(e) {
    this._triggerChange();

    window.removeEventListener("mousemove", this._onMouseMove);
  }
}


customElements.define('my-slider', Slider);