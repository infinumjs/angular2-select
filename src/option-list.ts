import {Option} from './option';
import {Diacritics} from './diacritics';

export class OptionList {

    private _options: Array<Option> = [];
    private _selection: Array<Option>;

    /* Consider using these for performance improvement. */
    // private _filtered: Array<Option>;
    // private _value: Array<string>;

    private _highlightedOption: Option = null;

    constructor(options: Array<any>) {

        if (typeof options === 'undefined' || options === null) {
            options = [];
        }

        this.options = options.map((option) => {
            return new Option(option.value, option.label, {disabled: option.disabled});
        });

        this.highlight();
    }

    /** Options. **/

    get options(): Array<Option> {
        return this._options;
    }

    set options(options: Array<Option>) {
        const currentOptions = options;

        this._selection.forEach((selectedOption: Option) => {
            const index = currentOptions.indexOf(selectedOption);

            if (index === -1) {
                currentOptions.push(selectedOption);
            }
        });

        this._options = currentOptions;
    }

    getOptionsByValue(value: string): Array<Option> {
        return this.options.filter((option) => {
            return option.value === value;
        });
    }

    /** Value. **/

    get value(): Array<string> {
        return this.selection.map((selectedOption) => {
            return selectedOption.value;
        });
    }

    set value(v: Array<string>) {
        v = typeof v === 'undefined' || v === null ? [] : v;

        this.options.forEach((option) => {
            const isOptionSelected = v.indexOf(option.value) > -1;
            if (isOptionSelected) {
                this.select(option, true);  // TODO is it ok to have multiple=true here?
            }
        });
    }

    /** Selection. **/

    get selection(): Array<Option> {
        return this._selection;
    }

    select(option: Option, multiple: boolean) {
        if (!multiple) {
            this.clearSelection();
        }
        option.selected = true;
        this._selection.push(option);
    }

    deselect(option: Option) {
        const deselectedOptionIndex = this._selection.indexOf(option);

        option.selected = false;

        if (deselectedOptionIndex > -1) {
            this._selection.splice(deselectedOptionIndex, 1);
        }
    }

    clearSelection() {
        this.options.forEach((option) => {
            option.selected = false;
        });

        this._selection = [];
    }

    /** Filter. **/

    get filtered(): Array<Option> {
        return this.options.filter((option) => {
            return option.shown;
        });
    }

    filter(term: string) {

        if (term.trim() === '') {
            this.resetFilter();
        }
        else {
            this.options.forEach((option) => {
                let l: string = Diacritics.strip(option.label).toUpperCase();
                let t: string = Diacritics.strip(term).toUpperCase();
                option.shown = l.indexOf(t) > -1;
            });
        }

        this.highlight();
    }

    resetFilter() {
        this.options.forEach((option) => {
            option.shown = true;
        });
    }

    /** Highlight. **/

    get highlightedOption(): Option {
        return this._highlightedOption;
    }

    highlight() {
        let option: Option = this.hasShownSelected() ?
            this.getFirstShownSelected() : this.getFirstShown();
        this.highlightOption(option);
    }

    highlightOption(option: Option) {
        this.clearHighlightedOption();

        if (option !== null) {
            option.highlighted = true;
            this._highlightedOption = option;
        }
    }

    highlightNextOption() {
        let shownOptions = this.filtered;
        let index = this.getHighlightedIndexFromList(shownOptions);

        if (index > -1 && index < shownOptions.length - 1) {
            this.highlightOption(shownOptions[index + 1]);
        }
    }

    highlightPreviousOption() {
        let shownOptions = this.filtered;
        let index = this.getHighlightedIndexFromList(shownOptions);

        if (index > 0) {
            this.highlightOption(shownOptions[index - 1]);
        }
    }

    private clearHighlightedOption() {
        if (this.highlightedOption !== null) {
            this.highlightedOption.highlighted = false;
            this._highlightedOption = null;
        }
    }

    private getHighlightedIndexFromList(options: Array<Option>) {
        for (let i = 0; i < options.length; i++) {
            if (options[i].highlighted) {
                return i;
            }
        }
        return -1;
    }

    getHighlightedIndex() {
        return this.getHighlightedIndexFromList(this.filtered);
    }

    /** Util. **/

    hasShown() {
        return this.options.some((option) => {
            return option.shown;
        });
    }

    hasSelected() {
        return this.options.some((option) => {
            return option.selected;
        });
    }

    hasShownSelected() {
        return this.options.some((option) => {
            return option.shown && option.selected;
        });
    }

    private getFirstShown(): Option {
        for (let option of this.options) {
            if (option.shown) {
                return option;
            }
        }
        return null;
    }

    private getFirstShownSelected(): Option {
        for (let option of this.options) {
            if (option.shown && option.selected) {
                return option;
            }
        }
        return null;
    }

    // v0 and v1 are assumed not to be undefined or null.
    static equalValues(v0: Array<string>, v1: Array<string>): boolean {

        if (v0.length !== v1.length) {
            return false;
        }

        let a: Array<string> = v0.slice().sort();
        let b: Array<string> = v1.slice().sort();

        return a.every((v, i) => {
            return v === b[i];
        });
    }
}
