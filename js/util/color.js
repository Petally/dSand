import { clamp } from "./clamp.js";

// HSL Color helper class
class Color {
	constructor(h, s, l) {
		this.h = h;
		this.s = s;
		this.l = l;
	}

	// Returns this color as 3 rgb values
	toRGB() {
		let r, g, b;
		const h = this.h / 360;
		const s = this.s / 100;
		const l = this.l / 100;
		if (s == 0) {
			r = g = b = l; // achromatic
		} else {
			function hue2rgb(p, q, t) {
				if (t < 0) t += 1;
				if (t > 1) t -= 1;
				if (t < 1/6) return p + (q - p) * 6 * t;
				if (t < 1/2) return q;
				if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
				return p;
			}

			const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
			const p = 2 * l - q;

			r = hue2rgb(p, q, h + 1/3);
			g = hue2rgb(p, q, h);
			b = hue2rgb(p, q, h - 1/3);
		}

		return [ r * 255, g * 255, b * 255 ];
	}

	// returns a new color which is the given color subtracted from this color
	subtract(color) {
		return new Color(clamp(this.h - color.h, 0, 360), clamp(this.s - color.s, 0, 100), clamp(this.l - color.l, 0, 100));
	}
}

export { Color };