import axios from 'axios';
import { DomainManager } from './Domain';
import { LoggingManager } from './Logging';




declare var browser: any;

export class StorageManager {

    public static getDomainEntryFromStorage(domain: string) {
        // console.log('getDomainEntryFromStorage', domain)
        return browser.storage.local.get('tosdr/review/' + domain)
            .then((resultSet: any) => resultSet['tosdr/review/' + domain] || undefined);
    }

    public static getServiceDetails(domain: any, tries = 0) {
        if (!domain) {
            return Promise.reject(new Error('no domain name provided'));
        }
        if (tries > 10) {
            return Promise.reject(new Error(`too many redirections ${domain}`));
        }

        return this.getDomainEntryFromStorage(domain).then((details: any) => {
            if (!details) {
                const domainParts = domain.split('.');
                if (domainParts.length > 2) {
                    return this.getServiceDetails(domainParts.slice(1).join('.'), tries + 1);
                }
                return Promise.reject(new Error('details not found'));
            }
            if (details.see) {
                return this.getServiceDetails(details.see, tries + 1);
            }
            // console.log('mainDomain set', details)
            return Object.assign({
                mainDomain: domain,
            }, details);
        });
    }

}