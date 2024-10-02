
var frontend = frontend ?? {};

frontend.colorByNumber = function () {


    function lighterColor(number) {
        numberString =  String(number);
        /*
        const lastSix = numberString.slice(-6);
        let colorCode = '#' + parseInt(lastSix).toString(16).padStart(6, '0');
        */
        const no420 = numberString.slice(-7);
        let colorCode = '#' + parseInt(no420).toString(16)

        const r = parseInt(colorCode.slice(1, 3), 16);
        const g = parseInt(colorCode.slice(3, 5), 16);
        const b = parseInt(colorCode.slice(5, 7), 16);
        const brightness = (r * 299 + g * 587 + b * 114) / 1000;

        if (brightness < 128) {
            colorCode = `#${((r + 128) % 255).toString(16).padStart(2, '0')}${((g + 128) % 255).toString(16).padStart(2, '0')}${((b + 128) % 255).toString(16).padStart(2, '0')}`;
        }

        return colorCode;
    }

    function darkenColor(colorCode, percent) {
        const num = parseInt(colorCode.slice(1), 16);
        const amt = Math.round(2.55 * percent);

        let r = (num >> 16) - amt;
        let g = (num >> 8 & 0x00FF) - amt;
        let b = (num & 0x0000FF) - amt;

        r = (r < 0) ? 0 : r;
        g = (g < 0) ? 0 : g;
        b = (b < 0) ? 0 : b;

        return "#" + (r.toString(16).padStart(2, '0')) + (g.toString(16).padStart(2, '0')) + (b.toString(16).padStart(2, '0'));
    }
    return {

        getLighterShade: (number) => lighterColor(number),

        getDarkerShade: (colorCode, percent) => { return darkenColor(colorCode, percent) }

    }
}();
