export default class FieldBag {
    constructor() {
        this.fields = {};
    }

    /**
     * Initializes and adds a new field to the bag.
     */
    _add(name) {
        this.fields[name] = {};
        this._setFlags(name, { dirty: false, valid: false }, true);
    }

    /**
     * Remooves a field from the bag.
     */
    _remove(name) {
        delete this.fields[name];
    }

    /**
     * Sets the flags for a specified field.
     */
    _setFlags(name, flags, initial = false) {
        Object.keys(flags).forEach(flag => this._setFlag(name, flag, flags[flag], initial));
    }

    /**
     * Sets a flag for a specified field.
     */
    _setFlag(name, flag, value, initial = false) {
        const method = `set${flag.charAt(0).toUpperCase()}${flag.slice(1)}`;
        if (typeof this[method] !== 'function') {
            return;
        }

        this[method](name, value, initial);
    }

    /**
     * Updates the dirty flag for a specified field with its dependant flags.
     */
    setDirty(name, value, initial = false) {
        this.fields[name].dirty = value;
        this.fields[name].clean = initial || ! value;
        this.fields[name].passed = this.fields[name].valid && value;
        this.fields[name].failed = ! this.fields[name].valid && value;
    }

    /**
     * Updates the valid flag for a specified field with its dependant flags.
     */
    setValid(name, value) {
        this.fields[name].valid = value;
        this.fields[name].passed = this.fields[name].dirty && value;
        this.fields[name].failed = this.fields[name].dirty && ! value;
    }

    /**
     * Gets a flag.
     */
    _getFieldFlag(name, flag) {
        if (this.fields[name]) {
            return this.fields[name][flag];
        }

        return false;
    }

    dirty(name) {
        return this._getFieldFlag(name, 'dirty');
    }

    valid(name) {
        return this._getFieldFlag(name, 'valid');
    }

    passed(name) {
        return this._getFieldFlag(name, 'passed');
    }

    faild(name) {
        return this._getFieldFlag(name, 'failed');
    }
}