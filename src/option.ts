import { OptionProperties } from './option-properties.interface';

const defaultOptionProperties: OptionProperties = {
    disabled: false,
    highlighted: false,
    selected: false,
    shown: true
};

export class Option {

    value: string;
    label: string;

    private properties: OptionProperties;

    constructor(value: string, label: string, _properties?: OptionProperties) {
        this.value = value;
        this.label = label;

        this.properties = Object.assign(defaultOptionProperties, _properties);
    }

    get disabled() {
        return this.properties.disabled;
    }

    set disabled(isDisabled: boolean) {
        this.properties.disabled = isDisabled;
    }

    get highlighted() {
        return this.properties.highlighted;
    }

    set highlighted(isHighlighted: boolean) {
        this.properties.highlighted = isHighlighted;
    }

    get selected() {
        return this.properties.selected;
    }

    set selected(isSelected: boolean) {
        this.properties.selected = isSelected;
    }

    get shown() {
        return this.properties.shown;
    }

    set shown(isShown: boolean) {
        this.properties.shown = isShown;
    }

    show() {
        this.shown = true;
    }

    hide() {
        this.shown = false;
    }

    disable() {
        this.disabled = true;
    }

    enable() {
        this.disabled = false;
    }

    undecoratedCopy() {
        return {
            label: this.label,
            value: this.value
        };
    }
}
