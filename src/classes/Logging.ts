import { inspect } from 'util';

export class LoggingManager {


    public static info(className: string, ...args: any) {
        let objs = [];
        for (var i = 0; i < arguments.length; i++) {
            if (typeof arguments[i] === "string") {
                objs.push(arguments[i]);
                continue;
            }
            objs.push(inspect(arguments[i]));
        }
        objs.shift();
        console.info("INFO:", `[${className}]`, objs.join(" "));
    }

    public static debug(className: string, ...args: any) {
        let objs = [];
        for (var i = 0; i < arguments.length; i++) {
            if (typeof arguments[i] === "string") {
                objs.push(arguments[i]);
                continue;
            }
            objs.push(inspect(arguments[i]));
        }
        objs.shift();
        console.log("DEBUG:", `[${className}]`, objs.join(" "));
    }


    public static warn(className: string, ...args: any) {
        let objs = [];
        for (var i = 0; i < arguments.length; i++) {
            if (typeof arguments[i] === "string") {
                objs.push(arguments[i]);
                continue;
            }
            objs.push(inspect(arguments[i]));
        }
        objs.shift();
        console.warn("WARN:", `[${className}]`, objs.join(" "));
    }


    public static error(className: string, ...args: any) {
        let objs = [];
        for (var i = 0; i < arguments.length; i++) {
            if (typeof arguments[i] === "string") {
                objs.push(arguments[i]);
                continue;
            }
            objs.push(inspect(arguments[i]));
        }
        objs.shift();
        console.error("ERR:", `[${className}]`, objs.join(" "));
    }
}