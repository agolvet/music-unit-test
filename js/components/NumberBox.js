import { LitElement, html, css } from 'lit';

class NumberBox extends LitElement {
  constructor() {
    super();

    this._value = 0;
    this._typedValue = this._value;
    this._min = -Infinity;
    this._max = +Infinity;
    this.integer = false;

    this._newValue = false;
    this._inDecimal = false;
    this._mult = 0.1;

    this._onKeyDown = this._onKeyDown.bind(this);
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
    integer: {
      type: Boolean,
      reflect: true,
    }
  }

  set value(value) {
    this._value = value;
    this._typedValue = value;
    this.requestUpdate();
  }

  get value() {
    return this._value;
  }

  set min(value) {
    this._min = value;
    if (this._value < this._min) {
      this._updateValue(this._min);
    }
  }

  get min() {
    return this._min;
  }

  set max(value) {
    this._max = value;
    if (this._value > this._max) {
      this._updateValue(this._max);
    }
  }

  get max() {
    return this._max;
  }

  static styles = css`
    :host {
      display: inline-block;
      position: relative;
      background-color: #292929;
      height: 30px;
      width: 100px;
    }
      
    :host > div {
      padding: 0 5px;
      display: flex;
      align-items: center;
      border: 1px solid black;
    }

    :host > div:focus {
      border: 1px solid #ED6447;
    }
      
    .triangle {
      fill: white;
    }

    :host > div:focus > .triangle {
      fill: #ED6447;
    }

    .value {
      font-size: 14px;
      padding: 0 10px;
    }
  `;

  render() { 
    return html`
      <div 
        tabindex="0"
        @focus="${this._onFocus}"
        @blur="${this._onBlur}"
      >
        <svg 
          class="triangle"
          viewbox="0 0 100 100"
          xmlns="http://www.w3.org/2000/svg"
          height="30"
          width="15"
        >
          <polygon points="0,100 100,50 0,0">
        </svg>
        <div class="value">${this._typedValue}</div>

      </div>
    `
  }

  _updateValue(value) {
    this._value = Math.max(this._min, Math.min(this._max, value))
    this._typedValue = this._value;

    this.requestUpdate();
    
    const event = new CustomEvent('change', {
      bubbles: true,
      composed: true,
      detail: { value: this._value },
    });

    this.dispatchEvent(event);
  }

  _onFocus(e) {
    window.addEventListener("keydown", this._onKeyDown);
    this._newValue = true;
  }

  _onBlur(e) {
    window.removeEventListener("keydown", this._onKeyDown);
    this._mult = 0.1;
    this._inDecimal = false;
    this._updateValue(this._typedValue);
  }

  _onKeyDown(e) {
    if (this._typedValue.toString().length < 7) {
      const isNumber = /^[0-9]$/i.test(e.key);
      if (isNumber) {
        if (this._newValue) {
          this._typedValue = 0;
          this._newValue = false;
        }
        const n = parseInt(e.key);
        if (this._inDecimal) {
          this._typedValue = this._typedValue + n * this._mult;
          this._mult /= 10;
        } else {
          this._typedValue = this._typedValue * 10 + n;
        }
      }
      else if ((e.key === "." || e.key === ",") && !this._inDecimal && !this.integer) {
        this._inDecimal = true;
      }
    }

    this.requestUpdate();
  }
}

customElements.define('number-box', NumberBox);