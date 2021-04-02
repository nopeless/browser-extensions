import { HTTPError } from './exceptions/HTTPError';
import * as tosdr from './index';


async function init() {
    try {
        let services = await tosdr.APIManager.getAllServices();


        console.log(services.parameters.services.length);
    } catch (ex) {
        if (ex instanceof HTTPError) {
            return console.log("Encountered an HTTP error:", ex.statusCode);
        }
        console.log("Encountered an error:", ex.stack);
    }
}

init();