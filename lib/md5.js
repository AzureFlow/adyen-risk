import {createHash} from "node:crypto";


/**
 * @param {string} msg
 * @returns {string}
 */
export function calculateMd5_b64(msg) {
	return createHash("md5")
		.update(msg)
		.digest("base64")
		.replaceAll("=", "");
}