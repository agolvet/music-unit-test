import { LitElement, html, css } from 'lit';

/*
  Component to save and load presets from rnbo parameters values.

  Presets are saved to LocalStorage and therefore saved between browser sessions.
*/

class Presets extends LitElement {
  constructor() {
    super();

    this.mode = "load";
    this.numberPresets = 10;
    this.device = null;
    const savedPresets = JSON.parse(localStorage.getItem("myFmSynthPresets"));
    this.presets = savedPresets ? savedPresets : {};
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
      cursor: pointer;
    }

    .mode-button {
      border: 1px solid #404040;
      background-color: #292929;
      font-size: 11px;
      height: 16px;
      width: 30px;
      text-align: center;
      align-content: end;
      user-select: none;
      cursor: pointer;
    }

    #save-load > .mode-active {
      background-color: #ED6447;
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
      height: 32px;
      width: 30px;
      margin-right: 5px;
      gap: 2px;
    }
  `

  render() {
    return html` 
      <div id="preset-container">
        <div id="save-load">
          <div
            class="mode-button ${this.mode === "save" ? "mode-active" : ''}"
            @click="${e => this.mode = "save"}"
          >save</div>
          <div 
            class="mode-button ${this.mode === "load" ? "mode-active" : ''}"
            @click="${e => this.mode = "load"}"
          >load</div>
        </div>
        ${[...Array(this.numberPresets).keys()].map(i => {
          return html`
            <div 
              class="preset-button ${Object.hasOwn(this.presets, i) ? "active-preset" : ''}"
              @click="${e => this._onClickPreset(i)}"
            >${i+1}</div>
          `
        })}
      </div>
    `
  }

  _onClickPreset(i) { 
    if (this.device) {
      if (this.mode === "load") {
        if (this.presets[i]) {
          const preset = this.presets[i];
          Object.keys(preset).forEach(paramId => {
            const rnboParam = this.device.parameters.find(p => p.id === paramId);
            rnboParam.value = preset[paramId];
          });
        }
      } else { // save
        const preset = {};
        this.device.parameters.forEach(param => {
          preset[param.id] = param.value;
        });
        this.presets[i] = preset;
        localStorage.setItem("myFmSynthPresets", JSON.stringify(this.presets));
      }
    }  
    this.requestUpdate(); 
  }

}

customElements.define('my-presets', Presets);

