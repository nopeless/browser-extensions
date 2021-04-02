import { LoggingManager } from './classes/Logging';
import { HTTPError } from './exceptions/HTTPError';
import * as tosdr from './index';


declare var browser: any;

function checkNotification(service: any) {
    LoggingManager.debug("ep:checkNotification", "Retrieving settings");
    browser.storage.local.get('settings').then((items: any) => {
        LoggingManager.debug("ep:checkNotification", "Successfully retrieved settings");
        if (items.settings.notifications) {
            LoggingManager.debug("ep:checkNotification", "Notifications are enabled");
            const last = localStorage.getItem(`notification/${service.id}/last/update`);
            const lastRate = localStorage.getItem(`notification/${service.id}/last/rate`);
            let shouldShow = false;

            if (!service.rated) { return; }

            const rate: any = service.rated;
            if (rate === 'D' || rate === 'E') {
                if (last) {
                    const lastModified = parseInt(Date.parse(last).toString(), 10);
                    const daysSinceLast = (new Date().getTime() - lastModified) / (1000 * 60 * 60 * 24);

                    if (daysSinceLast > 7) {
                        LoggingManager.debug("ep:checkNotification", "displaying rating as its older than 7 days");
                        shouldShow = true;
                    }
                } else {
                    LoggingManager.debug("ep:checkNotification", "Displaying rating");
                    shouldShow = true;
                }
            } else if (lastRate === 'D' || lastRate === 'E') {
                shouldShow = true;
            }

            if (shouldShow) {
                localStorage.setItem(`notification/${service.id}/last/update`, new Date().toDateString());
                localStorage.setItem(`notification/${service.id}/last/rate`, rate);

                LoggingManager.debug("ep:checkNotification", "Creating notification");
                browser.notifications.create('tosdr-notify', {
                    type: 'basic',
                    title: service.name,
                    message: rate,
                    iconUrl: './icons/icon@2x.png',
                });

                browser.notifications.onClicked.addListener((notificationId: any) => {
                    LoggingManager.debug("ep:checkNotification", "Notification clicked");
                    browser.notifications.clear(notificationId);
                    browser.tabs.create({
                        url: `https://tosdr.org/en/service/${service.id}`,
                    });
                });

                browser.notifications.onClosed.addListener((notificationId: any) => {
                    LoggingManager.debug("ep:checkNotification", "Clearing notification");
                    browser.notifications.clear(notificationId);
                });
            }
        } else {
            LoggingManager.debug("ep:checkNotification", "Notifications are disabled");
        }
    });
}


function initializePageAction(tab: any) {
    LoggingManager.debug("ep:initializePageAction", "Initializing pageaction", tab);
    // console.log('initializePageAction', tab);
    /*
    return getService(tab).then((service) => {
        // console.log('got service', service);
        if (service) {
            browser.pageAction.setIcon({
                tabId: tab.id,
                path: getIconForService(service),
            });
            browser.pageAction.setPopup({
                tabId: tab.id,
                popup: `popup/popup.html#${service.mainDomain}`,
            });
            browser.pageAction.show(tab.id);
            checkNotification(service);
        } else {
            browser.pageAction.setIcon({
                tabId: tab.id,
                path: 'icons/class/none.png',
            });
            browser.pageAction.setPopup({
                tabId: tab.id,
                popup: `popup/popup.html#${getDomain(tab.url)}`,
            });
            browser.pageAction.show(tab.id);
        }
        LoggingManager.debug("ep:initializePageAction", "Initialized pageaction", tab);
    }).catch((err) => {
        if (err.message === 'no domain name provided') {
            return;
        }
        if (err.message === 'details not found') {
            browser.pageAction.setIcon({
                tabId: tab.id,
                path: 'icons/class/none.png',
            });
            browser.pageAction.setPopup({
                tabId: tab.id,
                popup: `popup/popup.html#${getDomain(tab.url)}`,
            });
            browser.pageAction.show(tab.id);
        }
    });
    */
}

/**
 * The function that initializes the extension 
*/

async function init() {
    try {
        let services = await tosdr.APIManager.getAllServices();
        LoggingManager.debug("ep:init", "Saving services to storage");
        browser.storage.local.set(services).then(() => {
            LoggingManager.debug("ep:init", "Saved services to storage");
            const gettingAllTabs = browser.tabs.query({});
            return gettingAllTabs.then((tabs: any) => {
                tabs.forEach((t: any) => {
                    // Only active tabs should get the pageAction
                    if (t.active) {
                        LoggingManager.debug("ep:init", "Initializing pageaction", t);
                        initializePageAction(t);
                        LoggingManager.debug("ep:init", "Initialized pageaction", t);
                    }
                });
            });
        });
    } catch (ex) {
        if (ex instanceof HTTPError) {
            return console.log("Encountered an HTTP error:", ex.statusCode);
        }
        console.log("Encountered an error:", ex.stack);
    }


    browser.tabs.onUpdated.addListener((id: any, changeInfo: any, tab: any) => {
        // console.log('updated', id, changeInfo, tab);
        if (changeInfo.status === 'complete') {
            initializePageAction(tab);
        }
    });

    browser.runtime.onInstalled.addListener((details: any) => {
        if (typeof details !== 'undefined' && (details.reason === 'install' || details.reason === 'update')) {
            browser.runtime.openOptionsPage();
        }
    });

}

init();