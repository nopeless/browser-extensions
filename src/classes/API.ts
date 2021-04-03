import axios from 'axios';
import { HTTPError } from '../exceptions/HTTPError';
import { all_services } from '../models/all_services.model';
import { rest_service } from '../models/rest_service.model';
import { LoggingManager } from './Logging';

export class APIManager {

    public static PROTO: string = 'https';
    public static ENDPOINT: string = 'api.tosdr.org';


    public static async getService(service: string): Promise<rest_service> {

        let uri = this.PROTO + '://' + this.ENDPOINT + '/rest-service/v1/' + service + '.json';

        LoggingManager.debug("APIManager:getService", "Making a request to:", uri);

        let result = await axios.get(uri, {
            validateStatus: function (status) {
                return true;
            },
        });

        if (result.status !== 200) {
            throw new HTTPError(result.statusText, result.status);
        }

        return result.data as rest_service;
    }

    public static async getAllServices(): Promise<all_services> {

        let uri = this.PROTO + '://' + this.ENDPOINT + '/v1/all.json&cache';

        LoggingManager.debug("APIManager:getAllServices", "Making a request to:", uri);

        let result = await axios.get(uri, {
            validateStatus: function (status) {
                return true;
            },
        });

        if (result.status !== 200) {
            throw new HTTPError(result.statusText, result.status);
        }

        return result.data as all_services;
    }
}