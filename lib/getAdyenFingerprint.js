import { calculateMd5_b64 } from "./md5.js";
import { DateTime } from "luxon";
import { randomUUID } from "node:crypto";


const PADDING_LENGTHS = {
    plugins: 10,
    nrOfPlugins: 3,
    fonts: 10,
    nrOfFonts: 3,
    timeZone: 10,
    video: 10,
    superCookies: 10,
    userAgent: 10,
    mimeTypes: 10,
    nrOfMimeTypes: 3,
    canvas: 10,
    cpuClass: 5,
    platform: 5,
    doNotTrack: 5,
    webglFp: 10,
    jsFonts: 10,
};

/**
 * @param {string} userAgent
 * @param {string} [timezone] https://en.wikipedia.org/wiki/List_of_tz_database_time_zones
 * @param {string} [platform] navigator.platform
 * @param {boolean} [doNotTrack] navigator.doNotTrack
 * @param {number} [colorDepth]
 * @param {number} [screenWidth]
 * @param {number} [screenHeight]
 * @returns {string}
 */
export function getAdyenFingerprint({
    userAgent,
    timezone = "America/Los_Angeles",
    platform = "Win32",
    doNotTrack = false,
    colorDepth = 24,
    screenWidth = 1920,
    screenHeight = 1080,
}) {
    const plugins = dfGetPlug();
    const tz = dfGetTz(timezone);
    const mimes = dfGetMimes();
    const cpuClass = undefined;
    const doNotTrackString = doNotTrack ? "1" : null;

    const fp = {
        plugins: padString(calculateMd5_b64(plugins.obj), PADDING_LENGTHS.plugins),
        nrOfPlugins: padString(plugins.nr.toString(), PADDING_LENGTHS.nrOfPlugins),
        fonts: padString("", PADDING_LENGTHS.fonts),
        nrOfFonts: padString("", PADDING_LENGTHS.nrOfFonts),
        timeZone: padString(calculateMd5_b64(tz.C + "**" + tz.D), PADDING_LENGTHS.timeZone),
        video: padString(((screenWidth + 7) * (screenHeight + 7) * colorDepth).toString(), PADDING_LENGTHS.video),
        superCookies: padString(calculateMd5_b64(dfGetDS()), Math.floor(PADDING_LENGTHS.superCookies / 2)) + padString(calculateMd5_b64(dfGetIEUD()), Math.floor(PADDING_LENGTHS.superCookies / 2)),
        userAgent: padString(calculateMd5_b64(userAgent), PADDING_LENGTHS.userAgent),
        mimeTypes: padString(calculateMd5_b64(mimes.mimeTypesString), PADDING_LENGTHS.mimeTypes),
        nrOfMimeTypes: padString(mimes.mimeTypesLength.toString(), PADDING_LENGTHS.nrOfMimeTypes),
        canvas: padString(calculateMd5_b64(dfCanvasFingerprint()), 10),
        cpuClass: padString(cpuClass ? calculateMd5_b64(cpuClass) : "", PADDING_LENGTHS.cpuClass),
        platform: padString(platform ? calculateMd5_b64(platform) : "", PADDING_LENGTHS.platform),
        doNotTrack: padString(doNotTrackString ? calculateMd5_b64(doNotTrackString) : "", PADDING_LENGTHS.doNotTrack),
        jsFonts: padString(calculateMd5_b64(getJsFonts()), PADDING_LENGTHS.jsFonts),
        webglFp: padString(calculateMd5_b64(getWebglFp()), PADDING_LENGTHS.webglFp),
    };

    const fpHash = dfHashConcat(fp);
    const entropy = dfGetEntropy(userAgent);

    return `${fpHash}:${entropy}`;
}

function dfGetMimes() {
    const mimeTypes = {
        0: {
            description: "",
            suffixes: "pdf",
            type: "application/pdf"
        },
        1: {
            description: "Portable Document Format",
            suffixes: "pdf",
            type: "application/x-google-chrome-pdf"
        },
    };

    let mimeTypesString = "";
    const mimeTypesLength = Object.keys(mimeTypes).length;
    for(let i = 0; i < mimeTypesLength; i++) {
        let item = mimeTypes[i.toString()];
        mimeTypesString += `${item.description}${item.type}${item.suffixes}`;
    }

    return {
        mimeTypesString,
        mimeTypesLength,
    };
}

/**
 * @param {string} timezone
 * @returns {{C: number, D: number}}
 */
function dfGetTz(timezone) {
    return {
        C: -DateTime.fromMillis(1717273198425, {
            zone: timezone,
        }).offset,
        D: -DateTime.fromMillis(1733088010818, {
            zone: timezone,
        }).offset,
    };
}

/**
 * @returns {{nr: number, obj: string}}
 */
function dfGetPlug() {
    return {
        nr: 2,
        obj: "Plugin 0: Chrome PDF Plugin; Portable Document Format; internal-pdf-viewer; (Portable Document Format; application/x-google-chrome-pdf; pdf). Plugin 1: Chrome PDF Viewer; ; mhjfbmdgcfjbbpaeojofohoefgiehjai; (; application/pdf; pdf). "
    };
}

/**
 * @returns {string}
 */
function dfGetDS() {
    // Has localStorage and has sessionStorage
    return "DOM-LS: Yes, DOM-SS: Yes";
}
/**
 * @returns {string}
 */
function dfGetIEUD() {
    // Internet Explorer stuff
    return ", IE-UD: No";
}

/**
 * @returns {string}
 */
function getJsFonts() {
    return "";
}

/**
 * @returns {string}
 */
function getWebglFp() {
    return `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAACWCAYAAABkW7XSAAAAAXNSR0IArs4c6QAA${randomUUID()}§88824812102565534321638410241638416163843016164095WebKit WebGLWebGL GLSL ES 1.0 (OpenGL ES GLSL ES 1.0 Chromium)0WebKitWebGL 1.0 (OpenGL ES 2.0 Chromium)ANGLE_instanced_arraysEXT_blend_minmaxEXT_color_buffer_half_floatEXT_depth_clampEXT_disjoint_timer_queryEXT_float_blendEXT_frag_depthEXT_shader_texture_lodEXT_texture_compression_bptcEXT_texture_compression_rgtcEXT_texture_filter_anisotropicEXT_sRGBKHR_parallel_shader_compileOES_element_index_uintOES_fbo_render_mipmapOES_standard_derivativesOES_texture_floatOES_texture_float_linearOES_texture_half_floatOES_texture_half_float_linearOES_vertex_array_objectWEBGL_color_buffer_floatWEBGL_compressed_texture_s3tcWEBGL_compressed_texture_s3tc_srgbWEBGL_debug_renderer_infoWEBGL_debug_shadersWEBGL_depth_textureWEBGL_draw_buffersWEBGL_lose_contextWEBGL_multi_drawWEBGL_polygon_mode`;
}

/**
 * @returns {string}
 */
function dfCanvasFingerprint() {
    return `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAACWCAYAAABkW7XSAAAAAXNSR0IArs4c6QAA${randomUUID()}`;
}

/**
 * @param {string} str
 * @param {number} maxLength
 * @returns {string}
 */
function padString(str, maxLength) {
    if(str.length >= maxLength) {
        return str.substring(0, maxLength);
    } else {
        return str.padStart(maxLength, "0");
    }

}

/**
 * @param {object} fp
 * @returns {string}
 */
function dfHashConcat(fp) {
    // try {
    //     let output = "";
    //     output = e.plugins + e.nrOfPlugins + e.fonts + e.nrOfFonts + e.timeZone + e.video + e.superCookies + e.userAgent + e.mimeTypes + e.nrOfMimeTypes + e.canvas + e.cpuClass + e.platform + e.doNotTrack + e.webglFp + e.jsFonts;
    //     output = output.replace(/\+/g, "G").replace(/\//g, "D");
    //     return output;
    // } catch(err) {
    //     return "";
    // }

    return [
        fp.plugins,
        fp.nrOfPlugins,
        fp.fonts,
        fp.nrOfFonts,
        fp.timeZone,
        fp.video,
        fp.superCookies,
        fp.userAgent,
        fp.mimeTypes,
        fp.nrOfMimeTypes,
        fp.canvas,
        fp.cpuClass,
        fp.platform,
        fp.doNotTrack,
        fp.webglFp,
        fp.jsFonts,
    ]
        .join("")
        .replace(/\+/g, "G")
        .replace(/\//g, "D");

}

/**
 * @param {string} userAgent
 * @returns {"20"|"40"}
 */
function dfGetEntropy(userAgent) {
    return ["iPad", "iPhone", "iPod"].some(x => userAgent.includes(x)) ? "20" : "40";
}