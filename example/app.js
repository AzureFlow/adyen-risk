import {getAdyenFingerprint} from "../lib/getAdyenFingerprint.js";


const USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36";

// const timezone = "Asia/Tokyo";
// const timezone = "Europe/London";
// const timezone = "America/Los_Angeles";
// const timezone = "America/Chicago";
const timezone = "America/New_York";

const fp = getAdyenFingerprint({
    userAgent: USER_AGENT,
    timezone: timezone,
    doNotTrack: true,
});

const good = "x355cNd9Pi0020000000000000LlDyZ49njD0050271576cVB94iKzBGnGpwGmJ6V9swEtLkIt16002q7zBvelero00000qZkTExMpCOGsb0UDZDMD1B2M2Y8Asg:40"
console.log(fp === good);
