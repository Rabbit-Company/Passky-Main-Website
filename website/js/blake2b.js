/*
Blake2b-JS v2.0.0
https://github.com/Rabbit-Company/Blake2b-JS
License: GPL-3.0
*/
class Blake2b {
	v = new Uint32Array(32);
	m = new Uint32Array(32);
	BLAKE2B_IV32 = new Uint32Array([
		4089235720, 1779033703, 2227873595, 3144134277, 4271175723, 1013904242, 1595750129, 2773480762, 2917565137, 1359893119, 725511199, 2600822924, 4215389547,
		528734635, 327033209, 1541459225,
	]);
	SIGMA8 = [
		0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 14, 10, 4, 8, 9, 15, 13, 6, 1, 12, 0, 2, 11, 7, 5, 3, 11, 8, 12, 0, 5, 2, 15, 13, 10, 14, 3, 6, 7, 1,
		9, 4, 7, 9, 3, 1, 13, 12, 11, 14, 2, 6, 5, 10, 4, 0, 15, 8, 9, 0, 5, 7, 2, 4, 10, 15, 14, 1, 11, 12, 6, 8, 3, 13, 2, 12, 6, 10, 0, 11, 8, 3, 4, 13, 7, 5,
		15, 14, 1, 9, 12, 5, 1, 15, 14, 13, 4, 10, 0, 7, 6, 3, 9, 2, 8, 11, 13, 11, 7, 14, 12, 1, 3, 9, 5, 0, 15, 4, 8, 6, 2, 10, 6, 15, 14, 9, 11, 3, 0, 8, 12, 2,
		13, 7, 1, 4, 10, 5, 10, 2, 8, 4, 7, 6, 1, 5, 15, 11, 9, 14, 3, 12, 13, 0, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 14, 10, 4, 8, 9, 15, 13, 6,
		1, 12, 0, 2, 11, 7, 5, 3,
	];
	parameterBlock = new Uint8Array([
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	]);
	SIGMA82 = new Uint8Array(
		this.SIGMA8.map(function (x) {
			return x * 2;
		})
	);
	ADD64AA(v, a, b) {
		const o0 = v[a] + v[b];
		let o1 = v[a + 1] + v[b + 1];
		if (o0 >= 4294967296) o1++;
		v[a] = o0;
		v[a + 1] = o1;
	}
	ADD64AC(v, a, b0, b1) {
		let o0 = v[a] + b0;
		if (b0 < 0) o0 += 4294967296;
		let o1 = v[a + 1] + b1;
		if (o0 >= 4294967296) o1++;
		v[a] = o0;
		v[a + 1] = o1;
	}
	B2B_GET32(arr, i) {
		return arr[i] ^ (arr[i + 1] << 8) ^ (arr[i + 2] << 16) ^ (arr[i + 3] << 24);
	}
	B2B_G(a, b, c, d, ix, iy) {
		const x0 = this.m[ix];
		const x1 = this.m[ix + 1];
		const y0 = this.m[iy];
		const y1 = this.m[iy + 1];
		this.ADD64AA(this.v, a, b);
		this.ADD64AC(this.v, a, x0, x1);
		let xor0 = this.v[d] ^ this.v[a];
		let xor1 = this.v[d + 1] ^ this.v[a + 1];
		this.v[d] = xor1;
		this.v[d + 1] = xor0;
		this.ADD64AA(this.v, c, d);
		xor0 = this.v[b] ^ this.v[c];
		xor1 = this.v[b + 1] ^ this.v[c + 1];
		this.v[b] = (xor0 >>> 24) ^ (xor1 << 8);
		this.v[b + 1] = (xor1 >>> 24) ^ (xor0 << 8);
		this.ADD64AA(this.v, a, b);
		this.ADD64AC(this.v, a, y0, y1);
		xor0 = this.v[d] ^ this.v[a];
		xor1 = this.v[d + 1] ^ this.v[a + 1];
		this.v[d] = (xor0 >>> 16) ^ (xor1 << 16);
		this.v[d + 1] = (xor1 >>> 16) ^ (xor0 << 16);
		this.ADD64AA(this.v, c, d);
		xor0 = this.v[b] ^ this.v[c];
		xor1 = this.v[b + 1] ^ this.v[c + 1];
		this.v[b] = (xor1 >>> 31) ^ (xor0 << 1);
		this.v[b + 1] = (xor0 >>> 31) ^ (xor1 << 1);
	}
	blake2bCompress(ctx, last) {
		let i = 0;
		for (i = 0; i < 16; i++) {
			this.v[i] = ctx.h[i];
			this.v[i + 16] = this.BLAKE2B_IV32[i];
		}
		this.v[24] = this.v[24] ^ ctx.t;
		this.v[25] = this.v[25] ^ (ctx.t / 4294967296);
		if (last) {
			this.v[28] = ~this.v[28];
			this.v[29] = ~this.v[29];
		}
		for (i = 0; i < 32; i++) {
			this.m[i] = this.B2B_GET32(ctx.b, 4 * i);
		}
		for (i = 0; i < 12; i++) {
			this.B2B_G(0, 8, 16, 24, this.SIGMA82[i * 16 + 0], this.SIGMA82[i * 16 + 1]);
			this.B2B_G(2, 10, 18, 26, this.SIGMA82[i * 16 + 2], this.SIGMA82[i * 16 + 3]);
			this.B2B_G(4, 12, 20, 28, this.SIGMA82[i * 16 + 4], this.SIGMA82[i * 16 + 5]);
			this.B2B_G(6, 14, 22, 30, this.SIGMA82[i * 16 + 6], this.SIGMA82[i * 16 + 7]);
			this.B2B_G(0, 10, 20, 30, this.SIGMA82[i * 16 + 8], this.SIGMA82[i * 16 + 9]);
			this.B2B_G(2, 12, 22, 24, this.SIGMA82[i * 16 + 10], this.SIGMA82[i * 16 + 11]);
			this.B2B_G(4, 14, 16, 26, this.SIGMA82[i * 16 + 12], this.SIGMA82[i * 16 + 13]);
			this.B2B_G(6, 8, 18, 28, this.SIGMA82[i * 16 + 14], this.SIGMA82[i * 16 + 15]);
		}
		for (i = 0; i < 16; i++) {
			ctx.h[i] = ctx.h[i] ^ this.v[i] ^ this.v[i + 16];
		}
	}
	blake2bInit(outlen, key, salt, personal) {
		if (outlen === 0 || outlen > 64) {
			throw new Error("Illegal output length, expected 0 < length <= 64");
		}
		if (key && key.length > 64) {
			throw new Error("Illegal key, expected Uint8Array with 0 < length <= 64");
		}
		if (salt && salt.length !== 16) {
			throw new Error("Illegal salt, expected Uint8Array with length is 16");
		}
		if (personal && personal.length !== 16) {
			throw new Error("Illegal personal, expected Uint8Array with length is 16");
		}
		const ctx = {
			b: new Uint8Array(128),
			h: new Uint32Array(16),
			t: 0,
			c: 0,
			outlen,
		};
		this.parameterBlock.fill(0);
		this.parameterBlock[0] = outlen;
		if (key) this.parameterBlock[1] = key.length;
		this.parameterBlock[2] = 1;
		this.parameterBlock[3] = 1;
		if (salt) this.parameterBlock.set(salt, 32);
		if (personal) this.parameterBlock.set(personal, 48);
		for (let i = 0; i < 16; i++) {
			ctx.h[i] = this.BLAKE2B_IV32[i] ^ this.B2B_GET32(this.parameterBlock, i * 4);
		}
		if (key) {
			this.blake2bUpdate(ctx, key);
			ctx.c = 128;
		}
		return ctx;
	}
	blake2bUpdate(ctx, input) {
		for (let i = 0; i < input.length; i++) {
			if (ctx.c === 128) {
				ctx.t += ctx.c;
				this.blake2bCompress(ctx, false);
				ctx.c = 0;
			}
			ctx.b[ctx.c++] = input[i];
		}
	}
	blake2bFinal(ctx) {
		ctx.t += ctx.c;
		while (ctx.c < 128) {
			ctx.b[ctx.c++] = 0;
		}
		this.blake2bCompress(ctx, true);
		const out = new Uint8Array(ctx.outlen);
		for (let i = 0; i < ctx.outlen; i++) {
			out[i] = ctx.h[i >> 2] >> (8 * (i & 3));
		}
		return out;
	}
	blake2bStart(input, key, outlen, salt, personal) {
		outlen = outlen || 64;
		const ctx = this.blake2bInit(outlen, key, this.normalizeInput(salt), this.normalizeInput(personal));
		this.blake2bUpdate(ctx, this.normalizeInput(input));
		return this.blake2bFinal(ctx);
	}
	normalizeInput(input) {
		let ret;
		if (input instanceof Uint8Array) {
			ret = input;
		} else if (typeof input === "string") {
			const encoder = new TextEncoder();
			ret = encoder.encode(input);
		} else {
			throw new Error("Input must be an string, Buffer or Uint8Array");
		}
		return ret;
	}
	toHex(bytes) {
		return Array.prototype.map
			.call(bytes, function (n) {
				return (n < 16 ? "0" : "") + n.toString(16);
			})
			.join("");
	}
	static hash(message = "", secret, length = 64, salt = new Uint8Array(16), personal = new Uint8Array(16)) {
		if (secret?.length === 0) secret = undefined;
		if (typeof secret === "string") secret = new TextEncoder().encode(secret);
		let b1 = new Blake2b();
		const output = b1.blake2bStart(message, secret, length, salt, personal);
		return b1.toHex(output);
	}
}
export { Blake2b as default };
