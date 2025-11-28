import mixpanel from 'mixpanel-browser';

const MIXPANEL_TOKEN = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN;

export const initMixpanel = () => {
    if (!MIXPANEL_TOKEN) {
        console.warn('Mixpanel token is missing! Check your .env file.');
        return;
    }

    // Check if already initialized
    if (mixpanel.get_distinct_id) {
        try {
            mixpanel.get_distinct_id();
            return; // Already initialized
        } catch (e) {
            // Not initialized, continue
        }
    }

    mixpanel.init(MIXPANEL_TOKEN, { autocapture: true });
}