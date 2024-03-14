# Adyen Risk

Generates [Adyen's `dfValue`](https://docs.adyen.com/risk-management/) risk data.

## Usage

```js
import getAdyenFingerprint from "./getAdyenFingerprint.js";


const fp = getAdyenFingerprint({
    userAgent: USER_AGENT,
    timezone: timezone,
    doNotTrack: true,
});
console.log(fp);
```

See [`app.js`](example/app.js) for more details.