/**
 * Provides color conversion and validation utils
 * @class YAHOO.util.Color
 * @namespace YAHOO.util
 */
YAHOO.util.Color = function() {

    var HCHARS="0123456789ABCDEF", lang=YAHOO.lang;

    return {

        /**
         * Converts 0-1 to 0-255
         * @method real2dec
         * @param n {float} the number to convert
         * @return {int} a number 0-255
         */
        real2dec: function(n) {
            return Math.min(255, Math.round(n*256));
        },

        /**
         * Converts HSV (h[0-360], s[0-1]), v[0-1] to RGB [255,255,255]
         * @method hsv2rgb
         * @param h {int|[int, float, float]} the hue, or an
         *        array containing all three parameters
         * @param s {float} the saturation
         * @param v {float} the value/brightness
         * @return {[int, int, int]} the red, green, blue values in
         *          decimal.
         */
        hsv2rgb: function(h, s, v) { 

            if (lang.isArray(h)) {
                return this.hsv2rgb.call(this, h[0], h[1], h[2]);
            }

            var r, g, b, i, f, p, q, t;
            i = Math.floor((h/60)%6);
            f = (h/60)-i;
            p = v*(1-s);
            q = v*(1-f*s);
            t = v*(1-(1-f)*s);
            switch(i) {
                case 0: r=v; g=t; b=p; break;
                case 1: r=q; g=v; b=p; break;
                case 2: r=p; g=v; b=t; break;
                case 3: r=p; g=q; b=v; break;
                case 4: r=t; g=p; b=v; break;
                case 5: r=v; g=p; b=q; break;
            }

            var fn=this.real2dec;

            return [fn(r), fn(g), fn(b)];
        },

        /**
         * Converts to RGB [255,255,255] to HSV (h[0-360], s[0-1]), v[0-1]
         * @method rgb2hsv
         * @param r {int|[int, int, int]} the red value, or an
         *        array containing all three parameters
         * @param g {int} the green value
         * @param b {int} the blue value
         * @return {[int, float, float]} the value converted to hsv
         */
        rgb2hsv: function(r, g, b) {

            if (lang.isArray(r)) {
                return this.rgb2hsv.call(this, r[0], r[1], r[2]);
            }

            r=r/255;
            g=g/255;
            b=b/255;

            var min,max,delta,h,s,v;
            min = Math.min(Math.min(r,g),b);
            max = Math.max(Math.max(r,g),b);
            delta = max-min;

            switch (max) {
                case min: h=0; break;
                case r:   h=60*(g-b)/delta; 
                          if (g<b) {
                              h+=360;
                          }
                          break;
                case g:   h=(60*(b-r)/delta)+120; break;
                case b:   h=(60*(r-g)/delta)+240; break;
            }
            
            s = (max === 0) ? 0 : 1-(min/max);

            var hsv = [Math.round(h), s, max];

            return hsv;

        },

        /**
         * Converts decimal rgb values into a hex string
         * 255,255,255 -> FFFFFF
         * @method rgb2hex
         * @param r {int|[int, int, int]} the red value, or an
         *        array containing all three parameters
         * @param g {int} the green value
         * @param b {int} the blue value
         * @return {string} the hex string
         */
        rgb2hex: function(r, g, b) {
            if (lang.isArray(r)) {
                return this.rgb2hex.call(this, r[0], r[1], r[2]);
            }

            var f=this.dec2hex;
            return f(r) + f(g) + f(b);
        },
     
        /**
         * Converts an int 0...255 to hex pair 00...FF
         * @method dec2hex
         * @param n {int} the number to convert
         * @return {string} the hex equivalent
         */
        dec2hex: function(n) {
            n = parseInt(n, 10);
            n = (lang.isNumber(n)) ? n : 0;
            n = (n > 255 || n < 0) ? 0 : n;

            return HCHARS.charAt((n - n % 16) / 16) + HCHARS.charAt(n % 16);
        },

        /**
         * Converts a hex pair 00...FF to an int 0...255 
         * @method hex2dec
         * @param str {string} the hex pair to convert
         * @return {int} the decimal
         */
        hex2dec: function(str) {
            var f = function(c) {
                return HCHARS.indexOf(c.toUpperCase());
            };

            var s=str.split('');
            
            return ((f(s[0]) * 16) + f(s[1]));
        },

        /**
         * Converts a hex string to rgb
         * @method hex2rgb
         * @param str {string} the hex string
         * @return {[int, int, int]} an array containing the rgb values
         */
        hex2rgb: function(s) { 
            var f = this.hex2dec;
            return [f(s.substr(0, 2)), f(s.substr(2, 2)), f(s.substr(4, 2))];
        },

        /**
         * Returns the closest websafe color to the supplied rgb value.
         * @method websafe
         * @param r {int|[int, int, int]} the red value, or an
         *        array containing all three parameters
         * @param g {int} the green value
         * @param b {int} the blue value
         * @return {[int, int, int]} an array containing the closes
         *                           websafe rgb colors.
         */
        websafe: function(r, g, b) {

            if (lang.isArray(r)) {
                return this.websafe.call(this, r[0], r[1], r[2]);
            }

            // returns the closest match [0, 51, 102, 153, 204, 255]
            var f = function(v) {
                if (lang.isNumber(v)) {
                    v = Math.min(Math.max(0, v), 255);
                    var i, next;
                    for (i=0; i<256; i=i+51) {
                        next = i+51;
                        if (v >= i && v <= next) {
                            return (v-i > 25) ? next : i;
                        }
                    }
                }

                return v;
            };

            return [f(r), f(g), f(b)];
        }
    };
}();


(function() {

    /**
     * The colorpicker module provides a widget for selecting colors
     * @module colorpicker
     * @requires yahoo, dom, event, element, slider
     */

    /**
     * A widget to select colors
     * @namespace YAHOO.widget
     * @class YAHOO.widget.ColorPicker
     * @extends YAHOO.util.Element
     * @constructor
     * @param {HTMLElement | String | Object} el(optional) The html 
     * element that represents the colorpicker, or the attribute object to use. 
     * An element will be created if none provided.
     * @param {Object} attr (optional) A key map of the colorpicker's 
     * initial attributes.  Ignored if first arg is attributes object.
     */
    YAHOO.widget.ColorPicker = function(el, attr) {
        attr = attr || {};
        if (arguments.length === 1 && !YAHOO.lang.isString(el) && !el.nodeName) {
            attr = el; // treat first arg as attr object
            el = attr.element || null;
        }
        
        if (!el && !attr.element) { // create if we dont have one
            el = _createHostElement.call(this, attr);
        }

    	YAHOO.widget.ColorPicker.superclass.constructor.call(this, el, attr); 
    };

    YAHOO.extend(YAHOO.widget.ColorPicker, YAHOO.util.Element);
    
    var proto = YAHOO.widget.ColorPicker.prototype,
        Slider=YAHOO.widget.Slider,
        Color=YAHOO.util.Color,
        Dom = YAHOO.util.Dom,
        Event = YAHOO.util.Event,
        lang = YAHOO.lang,
        sub = lang.substitute;
    

    var b = "yui-picker";

    /**
     * The element ids used by this control
     * @property ID
     * @final
     */
    proto.ID = {

        /**
         * The id for the "red" form field
         * @property ID.R
         * @type String
         * @final
         * @default yui-picker-r
         */
        R: b + "-r",

        /**
         * The id for the "red" hex pair output
         * @property ID.R_HEX
         * @type String
         * @final
         * @default yui-picker-rhex
         */
        R_HEX: b + "-rhex",

        /**
         * The id for the "green" form field
         * @property ID.G
         * @type String
         * @final
         * @default yui-picker-g
         */
        G: b + "-g",

        /**
         * The id for the "green" hex pair output
         * @property ID.G_HEX
         * @type String
         * @final
         * @default yui-picker-ghex
         */
        G_HEX: b + "-ghex",


        /**
         * The id for the "blue" form field
         * @property ID.B
         * @type String
         * @final
         * @default yui-picker-b
         */
        B: b + "-b",

        /**
         * The id for the "blue" hex pair output
         * @property ID.B_HEX
         * @type String
         * @final
         * @default yui-picker-bhex
         */
        B_HEX: b + "-bhex",

        /**
         * The id for the "hue" form field
         * @property ID.H
         * @type String
         * @final
         * @default yui-picker-h
         */
        H: b + "-h",

        /**
         * The id for the "saturation" form field
         * @property ID.S
         * @type String
         * @final
         * @default yui-picker-s
         */
        S: b + "-s",

        /**
         * The id for the "value" form field
         * @property ID.V
         * @type String
         * @final
         * @default yui-picker-v
         */
        V: b + "-v",

        /**
         * The id for the picker region slider
         * @property ID.PICKER_BG
         * @type String
         * @final
         * @default yui-picker-bg
         */
        PICKER_BG:      b + "-bg",

        /**
         * The id for the picker region thumb
         * @property ID.PICKER_THUMB
         * @type String
         * @final
         * @default yui-picker-thumb
         */
        PICKER_THUMB:   b + "-thumb",

        /**
         * The id for the hue slider
         * @property ID.HUE_BG
         * @type String
         * @final
         * @default yui-picker-hue-bg
         */
        HUE_BG:         b + "-hue-bg",

        /**
         * The id for the hue thumb
         * @property ID.HUE_THUMB
         * @type String
         * @final
         * @default yui-picker-hue-thumb
         */
        HUE_THUMB:      b + "-hue-thumb",

        /**
         * The id for the hex value form field
         * @property ID.HEX
         * @type String
         * @final
         * @default yui-picker-hex
         */
        HEX:            b + "-hex",

        /**
         * The id for the color swatch
         * @property ID.SWATCH
         * @type String
         * @final
         * @default yui-picker-swatch
         */
        SWATCH:         b + "-swatch",

        /**
         * The id for the websafe color swatch
         * @property ID.WEBSAFE_SWATCH
         * @type String
         * @final
         * @default yui-picker-websafe-swatch
         */
        WEBSAFE_SWATCH: b + "-websafe-swatch",

        /**
         * The id for the control details
         * @property ID.CONTROLS
         * @final
         * @default yui-picker-controls
         */
        CONTROLS: b + "-controls",

        /**
         * The id for the rgb controls
         * @property ID.RGB_CONTROLS
         * @final
         * @default yui-picker-rgb-controls
         */
        RGB_CONTROLS: b + "-rgb-controls",

        /**
         * The id for the hsv controls
         * @property ID.HSV_CONTROLS
         * @final
         * @default yui-picker-hsv-controls
         */
        HSV_CONTROLS: b + "-hsv-controls",
        
        /**
         * The id for the hsv controls
         * @property ID.HEX_CONTROLS
         * @final
         * @default yui-picker-hex-controls
         */
        HEX_CONTROLS: b + "-hex-controls",

        /**
         * The id for the hex summary
         * @property ID.HEX_SUMMARY
         * @final
         * @default yui-picker-hex-summary
         */
        HEX_SUMMARY: b + "-hex-summary",

        /**
         * The id for the controls section header
         * @property ID.CONTROLS_LABEL
         * @final
         * @default yui-picker-controls-label
         */
        CONTROLS_LABEL: b + "-controls-label"
    };

    /**
     * Constants for any script-generated messages.  The values here
     * are the default messages.  They can be updated by providing
     * the complete list to the constructor for the "text" attribute.
     * @property TEXT
     * @final
     */
    proto.TEXT = {
        ILLEGAL_HEX: "Illegal hex value entered",
        SHOW_CONTROLS: "Show color details",
        HIDE_CONTROLS: "Hide color details",
        CURRENT_COLOR: "Currently selected color: {rgb}",
        CLOSEST_WEBSAFE: "Closest websafe color: {rgb}. Click to select.",
        R: "R",
        G: "G",
        B: "B",
        H: "H",
        S: "S",
        V: "V",
        HEX: "#",
        DEG: "�",
        //DEG: "&#176;",
        PERCENT: "%"
    };

    /*
     * Constants for the control's custom event names.  subscribe
     * to the rgbChange event instead.
     * @property EVENT
     * @final
     */
    //proto.EVENT = {
        //CHANGE: "change"
    //};

    //proto.CSS = { };

    /**
     * Constants for the control's default default values
     * @property DEFAULT
     * @final
     */
    proto.DEFAULT = {
        PICKER_SIZE: 180
    };

    /**
     * Constants for the control's configuration attributes
     * @property OPT
     * @final
     */
    proto.OPT = {
        HUE: "hue",
        SATURATION: "saturation",
        VALUE: "value",
        RED: "red",
        GREEN: "green",
        BLUE: "blue",
        HSV: "hsv",
        RGB: "rgb",
        WEBSAFE: "websafe",
        HEX: "hex",
        PICKER_SIZE: "pickersize",
        SHOW_CONTROLS: "showcontrols",
        SHOW_RGB_CONTROLS: "showrgbcontrols",
        SHOW_HSV_CONTROLS: "showhsvcontrols",
        SHOW_HEX_CONTROLS: "showhexcontrols",
        SHOW_HEX_SUMMARY: "showhexsummary",
        SHOW_WEBSAFE: "showwebsafe",
        //SHOW_SUBMIT: "showsubmit",
        CONTAINER: "container",
        IDS: "ids",
        ELEMENTS: "elements",
        TEXT: "text",
        ANIMATE: "animate"
    };

    /**
     * Sets the control to the specified rgb value and
     * moves the sliders to the proper positions
     * @method setValue
     * @param rgb {[int, int, int]} the rgb value
     * @param silent {boolean} whether or not to fire the change event
     */
    proto.setValue = function(rgb, silent) {
        silent = (silent) || false;
        this.set(this.OPT.RGB, rgb, silent);
        _updateSliders.call(this);
    };

    /**
     * The hue slider
     * @property hueSlider
     * @type YAHOO.widget.Slider
     */
    proto.hueSlider = null; 
    
    /**
     * The picker region
     * @property pickerSlider
     * @type YAHOO.widget.Slider
     */
    proto.pickerSlider = null;

    /**
     * Translates the slider value into hue, int[0,359]
     * @method _getH
     * @private
     * @return {int} the hue from 0 to 359
     */
    var _getH = function() {
        var size = this.get(this.OPT.PICKER_SIZE),
            h = (size - this.hueSlider.getValue()) / size;
        h = Math.round(h*360);
        return (h === 360) ? 0 : h;
    };

    /**
     * Translates the slider value into saturation, int[0,1], left to right
     * @method _getS
     * @private
     * @return {int} the saturation from 0 to 1
     */
    var _getS = function() {
        return this.pickerSlider.getXValue() / this.get(this.OPT.PICKER_SIZE);
    };

    /**
     * Translates the slider value into value/brightness, int[0,1], top
     * to bottom
     * @method _getV
     * @private
     * @return {int} the value from 0 to 1
     */
    var _getV = function() {
        var size = this.get(this.OPT.PICKER_SIZE);
        return (size - this.pickerSlider.getYValue()) / size;
    };

    /**
     * Updates the background of the swatch with the current rbg value.
     * Also updates the websafe swatch to the closest websafe color
     * @method _updateSwatch
     * @private
     */
    var _updateSwatch = function() {
        var rgb = this.get(this.OPT.RGB),
            websafe = this.get(this.OPT.WEBSAFE),
            el = this.getElement(this.ID.SWATCH),
            color = rgb.join(","),
            text = this.get(this.OPT.TEXT);

        Dom.setStyle(el, "background-color", "rgb(" + color  + ")");
        el.title = lang.substitute(text.CURRENT_COLOR, {
                "rgb": "#" + this.get(this.OPT.HEX)
            });


        el = this.getElement(this.ID.WEBSAFE_SWATCH);
        color = websafe.join(",");

        Dom.setStyle(el, "background-color", "rgb(" + color + ")");
        el.title = lang.substitute(text.CLOSEST_WEBSAFE, {
                "rgb": "#" + Color.rgb2hex(websafe)
            });

    };

    /**
     * Reads the sliders and converts the values to RGB, updating the
     * internal state for all the individual form fields
     * @method _getValuesFromSliders
     * @private
     */
    var _getValuesFromSliders = function() {
        var h=_getH.call(this), s=_getS.call(this), v=_getV.call(this);

        rgb = Color.hsv2rgb(h, s, v);
        var websafe = Color.websafe(rgb);
        var hex = Color.rgb2hex(rgb[0], rgb[1], rgb[2]);

        this.set(this.OPT.RGB, rgb);
    };

    /**
     * Updates the form field controls with the state data contained
     * in the control.
     * @method _updateFormFields
     * @private
     */
    var _updateFormFields = function() {
        this.getElement(this.ID.H).value = this.get(this.OPT.HUE);
        this.getElement(this.ID.S).value = this.get(this.OPT.SATURATION);
        this.getElement(this.ID.V).value = this.get(this.OPT.VALUE);
        this.getElement(this.ID.R).value = this.get(this.OPT.RED);
        this.getElement(this.ID.R_HEX).innerHTML = Color.dec2hex(this.get(this.OPT.RED));
        this.getElement(this.ID.G).value = this.get(this.OPT.GREEN);
        this.getElement(this.ID.G_HEX).innerHTML = Color.dec2hex(this.get(this.OPT.GREEN));
        this.getElement(this.ID.B).value = this.get(this.OPT.BLUE);
        this.getElement(this.ID.B_HEX).innerHTML = Color.dec2hex(this.get(this.OPT.BLUE));
        this.getElement(this.ID.HEX).value = this.get(this.OPT.HEX);
    };

    /**
     * Event handler for the hue slider.
     * @method _onHueSliderChange
     * @param newOffset {int} pixels from the start position
     * @private
     */
    var _onHueSliderChange = function(newOffset) {

        var h = _getH.call(this);
        this.set(this.OPT.HUE, h, true);

        // set picker background to the hue
        var rgb = Color.hsv2rgb(h, 1, 1);
        var styleDef = "rgb(" + rgb.join(",") + ")";

        Dom.setStyle(this.getElement(this.ID.PICKER_BG), "background-color", styleDef);

        if (this.hueSlider.valueChangeSource === this.hueSlider.SOURCE_UI_EVENT) {
            _getValuesFromSliders.call(this);
        }

        _updateFormFields.call(this);
        _updateSwatch.call(this);
    };

    /**
     * Event handler for the picker slider, which controls the
     * saturation and value/brightness.
     * @method _onPickerSliderChange
     * @param newOffset {{x: int, y: int}} x/y pixels from the start position
     * @private
     */
    var _onPickerSliderChange = function(newOffset) {

        var s=_getS.call(this), v=_getV.call(this);
        this.set(this.OPT.SATURATION, Math.round(s*100), true);
        this.set(this.OPT.VALUE, Math.round(v*100), true);

        if (this.pickerSlider.valueChangeSource === this.pickerSlider.SOURCE_UI_EVENT) {
            _getValuesFromSliders.call(this);
        }

        _updateFormFields.call(this);
        _updateSwatch.call(this);
    };


    /**
     * Key map to well-known commands for text field input
     * @method _getCommand
     * @param e {Event} the keypress or keydown event
     * @return {int} a command code
     * <ul>
     * <li>0 = not a number, letter in range, or special key</li>
     * <li>1 = number</li>
     * <li>2 = a-fA-F</li>
     * <li>3 = increment (up arrow)</li>
     * <li>4 = decrement (down arrow)</li>
     * <li>5 = special key (tab, delete, return, escape, left, right)</li> 
     * <li>6 = return</li>
     * </ul>
     * @private
     */
    var _getCommand = function(e) {
        var c = Event.getCharCode(e);

        //alert(Event.getCharCode(e) + ", " + e.keyCode + ", " + e.charCode);

        // special keys
        if (c === 38) { // up arrow
            return 3;
        } else if (c === 13) { // return
            return 6;
        } else if (c === 40) { // down array
            return 4;
        } else if (c >= 48 && c<=57) { // 0-9
            return 1;
        } else if (c >= 97 && c<=102) { // a-f
            return 2;
        } else if (c >= 65 && c<=70) { // A-F
            return 2;
        //} else if ("8, 9, 13, 27, 37, 39".indexOf(c) > -1 || 
        //              (c >= 112 && c <=123)) { // including F-keys
        // tab, delete, return, escape, left, right
        } else if ("8, 9, 13, 27, 37, 39".indexOf(c) > -1) { // special chars
            return 5;
        } else { // something we probably don't want
            return 0;
        }
    };

    /**
     * Handle keydown on one of the rgb and hsv fields.
     * @method _rgbFieldKeypress
     * @param e {Event} the keypress event
     * @param el {HTMLElement} the field
     * @param prop {string} the key to the linked property
     */
    var _rgbFieldKeypress = function(e, el, prop) {
        var command = _getCommand(e);
        var inc = (e.shiftKey) ? 10 : 1;
        switch (command) {
            case 6: // return, update the value
                var val = parseInt(el.value, 10);
                if (val !== this.get(prop)) {
                    this.set(prop, val);
                }
                break;
                        
            case 3: // up arrow, increment
                this.set(prop, Math.min(this.get(prop)+inc, 255));
                _updateFormFields.call(this);
                //Event.stopEvent(e);
                break;
            case 4: // down arrow, decrement
                this.set(prop, Math.max(this.get(prop)-inc, 0));
                _updateFormFields.call(this);
                //Event.stopEvent(e);
                break;

            default:
        }

    };

    /**
     * Handle keydown on the hex field
     * @method _hexFieldKeypress
     * @param e {Event} the keypress event
     * @param el {HTMLElement} the field
     * @param prop {string} the key to the linked property
     */
    var _hexFieldKeypress = function(e, el, prop) {
        var command = _getCommand(e);
        if (command === 6) { // return, update the value
            var val = el.value;
            if (val !== this.get(prop)) {
                this.set(prop, val);
            }
        }
    };

    /** 
     * Allows numbers and special chars only.  Used for the
     * rgb and hsv fields keypress handler.
     * @method _numbersOnly
     * @param e {Event} the event
     * @private
     * @return {boolean} false if we are canceling the event
     */
    var _numbersOnly = function(e) {
        return _hexOnly(e, true);
    };

    /** 
     * Allows numbers and special chars, and by default allows a-f.  
     * Used for the hex field keypress handler.
     * @method _hexOnly
     * @param e {Event} the event
     * @param numbersOnly omits a-f if set to true
     * @private
     * @return {boolean} false if we are canceling the event
     */
    var _hexOnly = function(e, numbersOnly) {
        var command = _getCommand(e);
        switch (command) {
            case 6: // return
            case 5: // special char
            case 1: // number
                break;
            case 2: // hex char (a-f)
                if (numbersOnly !== true) {
                    break;
                }

                // fallthrough is intentional

            default: // prevent alpha and punctuation
                Event.stopEvent(e);
                return false;
        }
    };

    /**
     * Returns the element reference that is saved.  The id can be either
     * the element id, or the key for this id in the "id" config attribute.
     * For instance, the host element id can be obtained by passing its
     * id (default: "yui_picker") or by its key "YUI_PICKER".
     * @param id {string} the element id, or key 
     * @return {HTMLElement} a reference to the element
     */
    proto.getElement = function(id) { 
        return this.get(this.OPT.ELEMENTS)[this.get(this.OPT.IDS)[id]]; 
    };

    _createElements = function() {
        var el, child, img, fld, i, 
            ids = this.get(this.OPT.IDS),
            text = this.get(this.OPT.TEXT),
            Elem = function(type, o) {
                var n = document.createElement(type);
                if (o) {
                    lang.augmentObject(n, o, true);
                }
                return n;
            },
            RGBElem = function(type, obj) {
                var o = lang.merge({
                        type: "text",
                        autocomplete: "off",
                        value: "0",
                        size: 3,
                        maxlength: 3
                    }, obj);

                o.name = o.id;
                return new Elem(type, o);
            };

        var p = this.get("element");

        // Picker slider (S and V) ---------------------------------------------

        el = new Elem("div", {
            id: ids[this.ID.PICKER_BG],
            className: "yui-picker-bg",
            tabIndex: -1,
            hideFocus: true
        });

        child = new Elem("div", {
            id: ids[this.ID.PICKER_THUMB],
            className: "yui-picker-thumb"
        });

        img = new Elem("img", {
            src: "../src/assets/picker_thumb.png"
        });

        child.appendChild(img);
        el.appendChild(child);
        p.appendChild(el);
        
        // Hue slider ---------------------------------------------
        el = new Elem("div", {
            id: ids[this.ID.HUE_BG],
            className: "yui-picker-hue-bg",
            tabIndex: -1,
            hideFocus: true
        });

        child = new Elem("div", {
            id: ids[this.ID.HUE_THUMB],
            className: "yui-picker-hue-thumb"
        });

        img = new Elem("img", {
            src: "../src/assets/hue_thumb.png"
        });

        child.appendChild(img);
        el.appendChild(child);
        p.appendChild(el);


        // controls ---------------------------------------------

        el = new Elem("div", {
            id: ids[this.ID.CONTROLS],
            className: "yui-picker-controls"
        });

        p.appendChild(el);
        p = el;

            // controls header
            el = new Elem("div", {
                className: "hd"
            });

            child = new Elem("a", {
                id: ids[this.ID.CONTROLS_LABEL],
                //className: "yui-picker-controls-label",
                href: "#"
            });
            el.appendChild(child);
            p.appendChild(el);

            // bd
            el = new Elem("div", {
                className: "bd"
            });

            p.appendChild(el);
            p = el;

                // rgb
                el = new Elem("ul", {
                    id: ids[this.ID.RGB_CONTROLS],
                    className: "yui-picker-rgb-controls"
                });

                child = new Elem("li");
                child.appendChild(document.createTextNode(text.R + " "));

                fld = new RGBElem("input", {
                    id: ids[this.ID.R],
                    className: "yui-picker-r"
                });

                child.appendChild(fld);
                el.appendChild(child);

                child = new Elem("li");
                child.appendChild(document.createTextNode(text.G + " "));

                fld = new RGBElem("input", {
                    id: ids[this.ID.G],
                    className: "yui-picker-g"
                });

                child.appendChild(fld);
                el.appendChild(child);

                child = new Elem("li");
                child.appendChild(document.createTextNode(text.B + " "));

                fld = new RGBElem("input", {
                    id: ids[this.ID.B],
                    className: "yui-picker-b"
                });

                child.appendChild(fld);
                el.appendChild(child);

                p.appendChild(el);

                // hsv
                el = new Elem("ul", {
                    id: ids[this.ID.HSV_CONTROLS],
                    className: "yui-picker-hsv-controls"
                });

                child = new Elem("li");
                child.appendChild(document.createTextNode(text.H + " "));

                fld = new RGBElem("input", {
                    id: ids[this.ID.H],
                    className: "yui-picker-h"
                });

                child.appendChild(fld);
                child.appendChild(document.createTextNode(" " + text.DEG));

                el.appendChild(child);

                child = new Elem("li");
                child.appendChild(document.createTextNode(text.S + " "));

                fld = new RGBElem("input", {
                    id: ids[this.ID.S],
                    className: "yui-picker-s"
                });

                child.appendChild(fld);
                child.appendChild(document.createTextNode(" " + text.PERCENT));

                el.appendChild(child);

                child = new Elem("li");
                child.appendChild(document.createTextNode(text.V + " "));

                fld = new RGBElem("input", {
                    id: ids[this.ID.V],
                    className: "yui-picker-v"
                });

                child.appendChild(fld);
                child.appendChild(document.createTextNode(" " + text.PERCENT));

                el.appendChild(child);
                p.appendChild(el);


                // hex summary

                el = new Elem("ul", {
                    id: ids[this.ID.HEX_SUMMARY],
                    className: "yui-picker-hex_summary"
                });

                child = new Elem("li", {
                    id: ids[this.ID.R_HEX]
                });
                el.appendChild(child);

                child = new Elem("li", {
                    id: ids[this.ID.G_HEX]
                });
                el.appendChild(child);

                child = new Elem("li", {
                    id: ids[this.ID.B_HEX]
                });
                el.appendChild(child);
                p.appendChild(el);

                // hex field
                el = new Elem("div", {
                    id: ids[this.ID.HEX_CONTROLS],
                    className: "yui-picker-hex-controls"
                });
                el.appendChild(document.createTextNode(text.HEX + " "));

                child = new RGBElem("input", {
                    id: ids[this.ID.HEX],
                    className: "yui-picker-hex",
                    size: 6,
                    maxlength: 6
                });

                el.appendChild(child);
                p.appendChild(el);

                p = this.get("element");

                // swatch
                el = new Elem("div", {
                    id: ids[this.ID.SWATCH],
                    className: "yui-picker-swatch"
                });

                p.appendChild(el);

                // websafe swatch
                el = new Elem("div", {
                    id: ids[this.ID.WEBSAFE_SWATCH],
                    className: "yui-picker-websafe-swatch"
                });

                p.appendChild(el);

    };

    /**
     * Sets the initial state of the sliders
     * @method initPicker
     */
    proto.initPicker = function () {

        // bind all of our elements
        var o=this.OPT, 
            ids = this.get(o.IDS), 
            els = this.get(o.ELEMENTS), 
                  i, el, id;

        // Add the default value as a key for each element for easier lookup
        for (i in this.ID) {
            if (lang.hasOwnProperty(this.ID, i)) {
                ids[this.ID[i]] = ids[i];
            }
        }

        // Check for picker element, if not there, create all of them
        el = Dom.get(ids[this.ID.PICKER_BG]);
        if (!el) {
            _createElements.call(this);
        } else {
        }

        for (i in ids) {
            if (lang.hasOwnProperty(ids, i)) {
                // look for element
                el = Dom.get(ids[i]);

                // generate an id if the implementer passed in an element reference,
                // and the element did not have an id already
                id = Dom.generateId(el);

                // update the id in case we generated the id
                ids[i] = id; // key is WEBSAFE_SWATCH
                ids[ids[i]] = id; // key is websafe_swatch

                // store the dom ref
                els[id] = el;
            }
        }

        // set the initial visibility state of our controls
            els = [o.SHOW_CONTROLS, 
                   o.SHOW_RGB_CONTROLS,
                   o.SHOW_HSV_CONTROLS,
                   o.SHOW_HEX_CONTROLS,
                   o.SHOW_HEX_SUMMARY];

        for (i=0; i<els.length; i=i+1) {
            this.set(els[i], this.get(els[i]));
        }

        var s = this.get(o.PICKER_SIZE);

        this.hueSlider = Slider.getVertSlider(this.getElement(this.ID.HUE_BG), 
                                              this.getElement(this.ID.HUE_THUMB), 0, s);
        this.hueSlider.subscribe("change", _onHueSliderChange, this, true);

        this.pickerSlider = Slider.getSliderRegion(this.getElement(this.ID.PICKER_BG), 
                                                   this.getElement(this.ID.PICKER_THUMB), 0, s, 0, s);
        this.pickerSlider.subscribe("change", _onPickerSliderChange, this, true);

        //_onHueSliderChange.call(this, 0);

        Event.on(this.getElement(this.ID.WEBSAFE_SWATCH), "click", function(e) {
               this.setValue(this.get(o.WEBSAFE));
               //_updateSliders
           }, this, true);

        Event.on(this.getElement(this.ID.CONTROLS_LABEL), "click", function(e) {
               this.set(o.SHOW_CONTROLS, !this.get(o.SHOW_CONTROLS));
               Event.preventDefault(e);
           }, this, true);

        _attachRGBHSV.call(this, this.ID.R, this.OPT.RED); 
        _attachRGBHSV.call(this, this.ID.G, this.OPT.GREEN); 
        _attachRGBHSV.call(this, this.ID.B, this.OPT.BLUE); 
        _attachRGBHSV.call(this, this.ID.H, this.OPT.HUE); 
        _attachRGBHSV.call(this, this.ID.S, this.OPT.SATURATION); 
        _attachRGBHSV.call(this, this.ID.V, this.OPT.VALUE); 

        Event.on(this.getElement(this.ID.HEX), "keydown", function(e, me) {
                _hexFieldKeypress.call(me, e, this, me.OPT.HEX);
            }, this);

        Event.on(this.getElement(this.ID.HEX), "keypress", _hexOnly, this);
    };

    _attachRGBHSV = function(id, config) {
        Event.on(this.getElement(id), "keydown", function(e, me) {
                _rgbFieldKeypress.call(me, e, this, config);
            }, this);

        Event.on(this.getElement(id), "keypress", _numbersOnly, this);
    };


    /**
     * Sets up the config attributes and the change listeners for this
     * properties
     * @method initAttributes
     * @param attr An object containing default attribute values
     */
    proto.initAttributes = function(attr) {

        attr = attr || {};
        YAHOO.widget.ColorPicker.superclass.initAttributes.call(this, attr);
        
        /**
         * The size of the picker. Trying to change this is not recommended.
         * @config pickersize
         * @default 180
         * @type int
         */
        this.setAttributeConfig(this.OPT.PICKER_SIZE, {
                value: attr.size || this.DEFAULT.PICKER_SIZE
            });

        /**
         * The current hue value 0-360
         * @config hue
         * @type int
         */
        this.setAttributeConfig(this.OPT.HUE, {
                value: attr.hue || 0,
                validator: lang.isNumber
            });

        /**
         * The current saturation value 0-100
         * @config saturation
         * @type int
         */
        this.setAttributeConfig(this.OPT.SATURATION, {
                value: attr.saturation || 0,
                validator: lang.isNumber
            });

        /**
         * The current value/brightness value 0-100
         * @config value
         * @type int
         */
        this.setAttributeConfig(this.OPT.VALUE, {
                value: attr.value || 100,
                validator: lang.isNumber
            });

        /**
         * The current red value 0-255
         * @config red
         * @type int
         */
        this.setAttributeConfig(this.OPT.RED, {
                value: attr.red || 255,
                validator: lang.isNumber
            });

        /**
         * The current green value 0-255
         * @config green 
         * @type int
         */
        this.setAttributeConfig(this.OPT.GREEN, {
                value: attr.red || 255,
                validator: lang.isNumber
            });

        /**
         * The current blue value 0-255
         * @config blue
         * @type int
         */
        this.setAttributeConfig(this.OPT.BLUE, {
                value: attr.blue || 255,
                validator: lang.isNumber
            });

        /**
         * The current hex value #000000-#FFFFFF, without the #
         * @config hex
         * @type string
         */
        this.setAttributeConfig(this.OPT.HEX, {
                value: attr.hex || "FFFFFF",
                validator: lang.isString
            });

        /**
         * The current rgb value.  Updates the state of all of the
         * other value fields.  Read-only: use setValue to set the
         * controls rgb value.
         * @config hex
         * @type [int, int, int]
         * @readonly
         */
        this.setAttributeConfig(this.OPT.RGB, {
                value: attr.rgb || [255,255,255],
                method: function(rgb) {

                    this.set(this.OPT.RED, rgb[0], true);
                    this.set(this.OPT.GREEN, rgb[1], true);
                    this.set(this.OPT.BLUE, rgb[2], true);

                    var websafe = Color.websafe(rgb);
                    this.set(this.OPT.WEBSAFE, websafe, true);

                    var hex = Color.rgb2hex(rgb);
                    this.set(this.OPT.HEX, hex, true);

                    var hsv = Color.rgb2hsv(rgb);


                    this.set(this.OPT.HUE, hsv[0], true);
                    this.set(this.OPT.SATURATION, Math.round(hsv[1]*100), true);
                    this.set(this.OPT.VALUE, Math.round(hsv[2]*100), true);
                },
                readonly: true
            });

        /**
         * If the color picker will live inside of a container object,
         * set, provide a reference to it so the control can use the
         * container's events.
         * @config container
         * @type YAHOO.widget.Panel
         */
        this.setAttributeConfig(this.OPT.CONTAINER, {
                    value: null,
                    method: function(container) {
                        if (container) {
                            // Position can get out of sync when the
                            // control is manipulated while display is
                            // none.  Resetting the slider constraints
                            // when it is visible gets the state back in
                            // order.
                            container.showEvent.subscribe(function() {
                                // this.pickerSlider.thumb.resetConstraints();
                                // this.hueSlider.thumb.resetConstraints();
                                this.pickerSlider.focus();
                            }, this, true);
                        }
                    }
                });
        /**
         * The closest current websafe value
         * @config websafe
         * @type int
         */
        this.setAttributeConfig(this.OPT.WEBSAFE, {
                value: attr.websafe || [255,255,255]
            });

        /**
         * A list of element ids and/or element references used by the 
         * control.  The default is the this.ID list, and can be customized
         * by passing a list in the contructor
         * @config ids
         * @type {referenceid: realid}
         * @writeonce
         */
        this.setAttributeConfig(this.OPT.IDS, {
                value: attr.ids || this.ID,
                writeonce: true
            });

        /**
         * A list of text strings for internationalization.  Default
         * is this.TEXT
         * @config text
         * @type {key: text}
         * @writeonce
         */
        this.setAttributeConfig(this.OPT.TEXT, {
                value: attr.text || this.TEXT,
                writeonce: true
            });

        /**
         * The element refs used by this control.  Set at initialization
         * @config elements
         * @type {id: HTMLElement}
         * @readonly
         */
        this.setAttributeConfig(this.OPT.ELEMENTS, {
                value: {},
                readonly: true
            });

        /**
         * Returns the cached element reference.  If the id is not a string, it
         * is assumed that it is an element and this is returned.
         * @param id {string|HTMLElement} the element key, id, or ref
         * @param on {boolean} hide or show.  If true, show
         * @private */
        _hideShowEl = function(id, on) {
            var el = (lang.isString(id) ? this.getElement(id) : id);
            //Dom.setStyle(id, "visibility", (on) ? "" : "hidden");
            Dom.setStyle(el, "display", (on) ? "" : "none");
        };

        /**
         * Hide/show the entire set of controls
         * @config showcontrols
         * @type boolean
         * @default true
         */
        this.setAttributeConfig(this.OPT.SHOW_CONTROLS, {
                value: (attr.showcontrols) || true,
                method: function(on) {

                    var el = Dom.getElementsByClassName("bd", "div", 
                            this.getElement(this.ID.CONTROLS))[0];

                    _hideShowEl.call(this, el, on);

                    this.getElement(this.ID.CONTROLS_LABEL).innerHTML = 
                        (on) ? this.get(this.OPT.TEXT).HIDE_CONTROLS :
                               this.get(this.OPT.TEXT).SHOW_CONTROLS;

                }
            });

        /**
         * Hide/show the rgb controls
         * @config showrgbcontrols
         * @type boolean
         * @default true
         */
        this.setAttributeConfig(this.OPT.SHOW_RGB_CONTROLS, {
                value: (attr.showrgbcontrols) || true,
                method: function(on) {
                    //Dom.setStyle(this.getElement(this.ID.RBG_CONTROLS), "visibility", (on) ? "" : "hidden");
                    _hideShowEl.call(this, this.ID.RGB_CONTROLS, on);
                }
            });

        /**
         * Hide/show the hsv controls
         * @config showhsvcontrols
         * @type boolean
         * @default false
         */
        this.setAttributeConfig(this.OPT.SHOW_HSV_CONTROLS, {
                value: (attr.showhsvcontrols) || false,
                method: function(on) {
                    //Dom.setStyle(this.getElement(this.ID.HSV_CONTROLS), "visibility", (on) ? "" : "hidden");
                    _hideShowEl.call(this, this.ID.HSV_CONTROLS, on);

                    // can't show both the hsv controls and the rbg hex summary
                    if (on && this.get(this.OPT.SHOW_HEX_SUMMARY)) {
                        this.set(this.OPT.SHOW_HEX_SUMMARY, false);
                    }
                }
            });

        /**
         * Hide/show the hex controls
         * @config showhexcontrols
         * @type boolean
         * @default true
         */
        this.setAttributeConfig(this.OPT.SHOW_HEX_CONTROLS, {
                value: (attr.showhexcontrols) || false,
                method: function(on) {
                    _hideShowEl.call(this, this.ID.HEX_CONTROLS, on);
                }
            });

        /**
         * Hide/show the hex summary
         * @config showhexsummary
         * @type boolean
         * @default true
         */
        this.setAttributeConfig(this.OPT.SHOW_HEX_SUMMARY, {
                value: (attr.showhexsummary) || true,
                method: function(on) {
                    _hideShowEl.call(this, this.ID.HEX_SUMMARY, on);

                    // can't show both the hsv controls and the rbg hex summary
                    if (on && this.get(this.OPT.SHOW_HSV_CONTROLS)) {
                        this.set(this.OPT.SHOW_HSV_CONTROLS, false);
                    }
                }
            });

        this.setAttributeConfig(this.OPT.ANIMATE, {
                value: (attr.animate) || true,
                method: function(on) {
                    this.pickerSlider.animate = on;
                    this.hueSlider.animate = on;
                }
            });

        this.on(this.OPT.HUE + "Change", _updateRGBFromHSV, this, true);
        this.on(this.OPT.SATURATION + "Change", _updateRGBFromHSV, this, true);
        this.on(this.OPT.VALUE + "Change", _updatePickerSlider, this, true);

        this.on(this.OPT.RED + "Change", _updateRGB, this, true);
        this.on(this.OPT.GREEN + "Change", _updateRGB, this, true);
        this.on(this.OPT.BLUE + "Change", _updateRGB, this, true);

        this.on(this.OPT.HEX + "Change", _updateHex, this, true);

        this.initPicker();
    };

    /**
     * Updates the rgb attribute with the current state of the r,g,b
     * fields.  This is invoked from change listeners on these
     * attributes to facilitate updating these values from the
     * individual form fields
     * @method _updateRGB
     * @private
     */
    var _updateRGB = function() {
        var rgb = [this.get(this.OPT.RED), 
                   this.get(this.OPT.GREEN),
                   this.get(this.OPT.BLUE)];

        this.set(this.OPT.RGB, rgb);

        _updateSliders.call(this);
    };

    /**
     * Updates the RGB values from the current state of the HSV
     * values.  Executed when the one of the HSV form fields are
     * updated
     * _updateRGBFromHSV
     * @private
     */
    var _updateRGBFromHSV = function() {
        var hsv = [this.get(this.OPT.HUE), 
                   this.get(this.OPT.SATURATION)/100,
                   this.get(this.OPT.VALUE)/100];

        var rgb = Color.hsv2rgb(hsv);

        this.set(this.OPT.RGB, rgb);

        _updateSliders.call(this);
    };

    /**
     * Parses the hex string to normalize shorthand values, converts
     * the hex value to rgb and updates the rgb attribute (which
     * updates the state for all of the other values)
     * method _updateHex
     * @private
     */
    var _updateHex = function() {
       
        var hex = this.get(this.OPT.HEX), l=hex.length;

        // support #369 -> #336699 shorthand
        if (l === 3) {
            var c = hex.split(""), i;
            for (i=0; i<l; i=i+1) {
                c[i] = c[i] + c[i];
            }

            hex = c.join("");
        }

        if (hex.length !== 6) {
            return false;
        }

        var rgb = Color.hex2rgb(hex);


        this.setValue(rgb);

        //_updateSliders.call(this);

    };

    /**
     * Moves the sliders into the position dictated by the current state
     * of the control
     * @method _updateSliders
     * @private
     */
    var _updateSliders = function() {
        _updateHueSlider.call(this);
        _updatePickerSlider.call(this);
    };

    /**
     * Moves the hue slider into the position dictated by the current state
     * of the control
     * @method _updateHueSlider
     * @private
     */
    var _updateHueSlider = function() {
        var size = this.get(this.OPT.PICKER_SIZE),
            h = this.get(this.OPT.HUE);

        h = size - Math.round(h / 360 * size);
        
        // 0 is at the top and bottom of the hue slider.  Always go to
        // the top so we don't end up sending the thumb to the bottom
        // when the value didn't actually change (e.g., a conversion
        // produced 360 instead of 0 and the value was already 0).
        if (h === size) {
            h = 0;
        }

        this.hueSlider.setValue(h);
    };

    /**
     * Moves the picker slider into the position dictated by the current state
     * of the control
     * @method _updatePickerSlider
     * @private
     */
    var _updatePickerSlider = function() {
        var size = this.get(this.OPT.PICKER_SIZE),
            s = this.get(this.OPT.SATURATION),
            v = this.get(this.OPT.VALUE);

        s = Math.round(s * size / 100);
        v = Math.round(size - (v * size / 100));


        this.pickerSlider.setRegionValue(s, v);
    };

    /**
     * Creates the host element if it doesn't exist
     * @method _createHostElement
     * @private
     */
    var _createHostElement = function() {
        var el = document.createElement('div');

        if (this.CSS.BASE) {
            el.className = this.CSS.BASE;
        }
        
        return el;
    };


})();
YAHOO.register("colorpicker", YAHOO.widget.ColorPicker, {version: "@VERSION@", build: "@BUILD@"});
