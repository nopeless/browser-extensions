import { APIManager } from './classes/API';
import { DomainManager } from './classes/Domain';
import { LoggingManager } from './classes/Logging';
import { HTTPError } from './exceptions/HTTPError';
import * as tosdr from './index';


declare var browser: any;

function getIconForService(service: any) { // eslint-disable-line no-unused-vars
    const imageName = service.rated ? service.rated.toLowerCase() : 'false';
    return `assets/images/icons/class/${imageName}.png`;
}


function checkNotification(service: any) {
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
            iconUrl: 'assets/images/icons/icon@2x.png',
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
}


function loading(load: boolean) {
    var x = document.getElementsByClassName("loading")[0] as HTMLElement;
    if (load) {
        x.style.display = "block";
    } else {
        x.style.display = "none";
    }
}

function escapeHTML(unsafe: string) {
    return (`${unsafe}`)
        .replace(/&(?!amp;)/g, '&amp;')
        .replace(/<(?!lt;)/g, '&lt;')
        .replace(/>(?!gt;)/g, '&gt;')
        .replace(/"(?!quot;)/g, '&quot;')
        .replace(/'(?!#039;)/g, '&#039;');
}


function tosdrPoint(service: any, dataPoint: any) {
    let badge;
    let icon;
    // let sign;
    if (dataPoint) {
        if (dataPoint.case.classification === 'good') {
            badge = 'badge-success';
            icon = 'thumbs-up';
            // sign = '+';
        } else if (dataPoint.case.classification === 'bad') {
            badge = 'badge-warning';
            icon = 'thumbs-down';
            // sign = '-';
        } else if (dataPoint.case.classification === 'blocker') {
            badge = 'badge-important';
            icon = 'times';
            // sign = '×';
        } else if (dataPoint.case.classification === 'neutral') {
            badge = 'badge-secondary';
            icon = 'asterisk';
            // sign = '→';
        } else {
            badge = '';
            icon = 'question';
            // sign = '?';
        }
        const pointText = dataPoint.title || '';

        // Extract links from text
        const taggedText = pointText.split(/(<\/?\w+(?:(?:\s+\w+(?:\s*=\s*(?:".*?"|'.*?'|[^'">\s]+))?)+\s*|\s*)\/?>)/gim);
        $(`#popup-point-${service.id}-${dataPoint.id}`)
            .append($('<div>', { class: dataPoint.case.classification })
                .append($('<h5>')
                    .append($('<span>', { class: `badge ${badge}`, title: escapeHTML(dataPoint.case.classification) })
                        .append($('<li>', { class: `fas fa-${icon}` })))
                    .append($('<a>', {
                        href: escapeHTML(dataPoint.discussion), target: '_blank', class: 'ml-2', text: dataPoint.title,
                    }))));

        $(`#popup-point-${service.id}-${dataPoint.id}`).append($('<p>'));
        if (taggedText.length > 1) {
            taggedText.forEach((t: any) => {
                $(`#popup-point-${service.id}-${dataPoint.id} p`).append(t);
            });
        } else {
            $(`#popup-point-${service.id}-${dataPoint.id} p`).text(pointText);
        }
    }
}

document.addEventListener("tosdr-popup-loaded", async function (e: any) {
    LoggingManager.debug("ep:addEventListener->tosdr-popup-loaded", "Popup loaded, wohoo");
    const serviceUrl = window.location.hash.substr(1);

    loading(true);
    /* Close Logic */

    let closeButtons = document.getElementsByClassName("close");
    for (var i = 0; i < closeButtons.length; i++) {
        closeButtons[i].addEventListener('click', function () {
            window.close();
        }, false);
    }

    DomainManager.getLiveServiceDetails(serviceUrl).then((service) => {
        LoggingManager.debug("ep:addEventListener->tosdr-popup-loaded:getLiveServiceDetails", service.parameters);

        service.parameters.points.forEach((p: any) => {
            LoggingManager.debug("ep:addEventListener->tosdr-popup-loaded:points", p);
            $('.tosdr-points').append($('<li>', { id: `popup-point-${service.id}-${p}`, class: 'point' }));
            tosdrPoint(service, p);
        });

        loading(false);


    });

});


function initializePageAction(tab: any) {
    LoggingManager.debug("ep:initializePageAction", "Initializing pageaction", tab);
    // console.log('initializePageAction', tab);

    return DomainManager.getService(tab).then((service: any) => {
        LoggingManager.debug("ep:initializePageAction", "Received Service", service);
        if (service) {
            browser.pageAction.setIcon({
                tabId: tab.id,
                path: getIconForService(service),
            });
            browser.pageAction.setPopup({
                tabId: tab.id,
                popup: `popup.html#${service.mainDomain}`,
            });
            browser.pageAction.show(tab.id);
            checkNotification(service);
        } else {
            browser.pageAction.setIcon({
                tabId: tab.id,
                path: 'assets/images/icons/class/none.png',
            });
            browser.pageAction.setPopup({
                tabId: tab.id,
                popup: `popup.html#${DomainManager.getDomain(tab.url)}`,
            });
            browser.pageAction.show(tab.id);
        }
        LoggingManager.debug("ep:initializePageAction", "Initialized pageaction", tab);
    }).catch((err: any) => {
        LoggingManager.debug("ep:initializePageAction", "Failed to find service", err);
        if (err.message === 'no domain name provided') {
            return;
        }
        if (err.message === 'details not found') {
            browser.pageAction.setIcon({
                tabId: tab.id,
                path: 'assets/images/icons/class/none.png',
            });
            browser.pageAction.setPopup({
                tabId: tab.id,
                popup: `popup.html#${DomainManager.getDomain(tab.url)}`,
            });
            browser.pageAction.show(tab.id);
        }
    });

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