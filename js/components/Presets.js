import { LitElement, html, css } from 'lit';

class Presets extends LitElement {
  constructor() {
    super();

    this.mode = "load";
    this.numberPresets = 10;
    this.device = null
    this.presets = {
      "0": {
        "ratio": 40,
      },
    };
  }

  static properties = {
    mode: {
      type: String,
    },
    numberPresets: {
      type: Number,
    },
    device: {
      type: Object,
      attribute: true,
      reflect: true,
    },
  }

  static styles = css`
    :host {
      display: inline-block;
      margin: 10px 0;
    }
      

    .preset-button {
      border: 1px solid #404040;
      background-color: #292929;
      text-align: center;
      align-content: center;
      width: 30px;
      margin-right: 2px;
      user-select: none;
    }

    .active-preset {
      background-color: #ED6447;
    }

    #preset-container {
      display: flex;
    }

    #save-load {
      display: flex;
      flex-direction: column;
      height: 31px;
      width: 30px;
      margin-right: 5px;
    }

    #save-load > div {
      border: 1px solid #404040;
      background-color: #292929;
      font-size: 11px;
      height: 15px;
      width: 30px;
      text-align: center;
      align-content: center;
      margin-bottom: 1px;
      user-select: none;
    }

    #save-load > .mode-active {
      background-color: #ED6447;
    }
  `

  render() {
    return html` 
      <div id="preset-container">
        <div id="save-load">
          <div
            class="${this.mode === "save" ? "mode-active" : ''}"
            @click="${e => this.mode = "save"}"
          >save</div>
          <div 
            class="${this.mode === "load" ? "mode-active" : ''}"
            @click="${e => this.mode = "load"}"
          >load</div>
        </div>
        ${[...Array(this.numberPresets).keys()].map(i => {
          return html`
            <div 
              class="preset-button"
              @click="${e => this.onClickPreset(i)}"
            >${i+1}</div>
          `
        })}
      </div>
    `
  }

  onClickPreset(i) {
    
    if (this.mode === "load") {
      if (this.presets[i]) {
        const event = new CustomEvent('input', {
          bubbles: true,
          composed: true,
          detail: { value: this.presets[i] },
        });
  
        this.dispatchEvent(event);
      }
    }
  }

  // savePreset(i) {
  //   console.log('hello save')
  // }

  // loadPreset(i) {
  //   const preset = this.presets[i];
  //   if (preset) {
  //     Object.keys(preset).forEach(paramId => {
  //       const rnboParam = this.device.parameters.find(p => p.id === paramId);
  //       rnboParam.value = preset[paramId];
  //     });
  //   }
  // }
}

customElements.define('my-presets', Presets);

