import { LitElement, html, css } from 'lit';


/*
  Number box to display values and set value from keyboard input.

  Min and max ranges can be defined and integer values can be forced.
  Value is set when losing focus (e.g. clicking outside of element) or pressing
  enter.
*/

class NumberBox extends LitElement {
  constructor() {
    super();

    this._value = 0;
    this._typedValue = '0';
    this._min = -Infinity;
    this._max = +Infinity;
    this.integer = false;

    // reset displayed value when typing new value.
    this._newValue = false;

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
    this._typedValue = this._numToString(value);
    this.requestUpdate();
  }

  get value() {
    return this._value;
  }

  set min(value) {
    this._min = value;
    if (this._value < this._min) {
      this._updateValueFromNumber(this._min);
    }
  }

  get min() {
    return this._min;
  }

  set max(value) {
    this._max = value;
    if (this._value > this._max) {
      this._updateValueFromNumber(this._max);
    }
  }

  get max() {
    return this._max;
  }

  static styles = css`
    :host {
      display: inline-block;
      position: relative;
      height: 30px;
      width: 100px;
      border: 1px solid #404040;
      background-color: #292929;
    }

    :host(:focus) {
      border: 1px solid #ED6447;
    }
      
    :host > div {
      height: 100%;
      padding: 0 5px;
      display: flex;
      align-items: center;
      cursor: pointer;
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
      user-select: none;
      overflow: scroll;
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

  _numToString(num) {
    return this.integer ? num.toString() : num.toFixed(2);
  }

  _updateValueFromNumber(value) {
    this._value = Math.max(this._min, Math.min(this._max, value));
    this._typedValue = this._numToString(this._value);

    this.requestUpdate();

    const event = new CustomEvent('change', {
      bubbles: true,
      composed: true,
      detail: { value: this._value },
    });

    this.dispatchEvent(event);
  }

  _updateValueFromString(value) {
    this._value = parseFloat(value);
    this.value = Math.max(this._min, Math.min(this._max, this._value));


    this.requestUpdate();
    
    const event = new CustomEvent('change', {
      bubbles: true,
      composed: true,
      detail: { value: this._value },
    });

    this.dispatchEvent(event);
  }

  _onFocus(e) {
    this.addEventListener("keydown", this._onKeyDown);
    this._newValue = true;
  }

  // update value when focus is lost 
  _onBlur(e) {
    this.removeEventListener("keydown", this._onKeyDown);
    this._updateValueFromString(this._typedValue);
  }
  
  _onKeyDown(e) {
    const isNumber = /^[0-9]$/i.test(e.key);
    if (this._newValue) {
      this._typedValue = '';
      this._newValue = false;
    }
    if (isNumber) {
      this._typedValue = this._typedValue + e.key;
    } else if ((e.key === "." || e.key === ",") && !(this._typedValue.includes('.')) && !this.integer) {
      this._typedValue = this._typedValue + ".";
    } else if ((e.key === "-") && this._typedValue === "") {
      this._typedValue = "-";
    } else if (e.key === "Backspace") {
      if (this._typedValue.length === 1) {
        this._typedValue = ''
      } else {
        this._typedValue = this._typedValue.slice(0, -1);
      }
    } else if (e.key === "Enter") {
      this._updateValueFromString(this._typedValue);
    }

    this.requestUpdate();
  }
}

customElements.define('number-box', NumberBox);