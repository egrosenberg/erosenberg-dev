import { loadTextFile } from "./files.mjs";
import Handlebars from "handlebars";

const CONTENT_LINK_REG = /@UUID\[.+?\]?{.+?}/g;
const LINK_UUID_REG = /(?<=\[).+?(?=\])/g;
const LINK_ID_REG = /(?<=\.(?=[^.]*$)).+/g;
const LINK_LABEL_REG = /(?<=\{).+?(?=\})/g;

/**
 * Registers system-wide handlebars helpers
 */
function registerHelpers() {
    /**
     * Logical
     */
    Handlebars.registerHelper('eq', ( a, b) => a === b);
    Handlebars.registerHelper('neq', (a, b) => a !== b);
    Handlebars.registerHelper('lt',  (a, b) => a < b);
    Handlebars.registerHelper('gt',  (a, b) => a > b);
    Handlebars.registerHelper('leq', (a, b) => a <= b);
    Handlebars.registerHelper('geq', (a, b) => a >= b);
    Handlebars.registerHelper('or',  (a, b) => a || b);
    Handlebars.registerHelper('and', (a, b) => a && b);
    Handlebars.registerHelper('not', (a) => !a);
    Handlebars.registerHelper('ifThen', function(arg1, arg2, arg3) {
        return (arg1 ? arg2 : arg3??"");
    });
    Handlebars.registerHelper('not', (a) => !a);
    /**
     * Other
     */
    Handlebars.registerHelper("for", function(from, to, incr, block) {
        var accum = "";
        for(var i = from; i <= to; i += incr)
            accum += block.fn(i);
        return accum;
    });
    Handlebars.registerHelper("repeat", (n, options) => {
        let output = ""
        let offset = parseInt(options.hash.offset);
        offset = isNaN(offset) ? 0 : offset;
        for (let i = 0; i < n; i++) {
            output += options.fn(this).replace('@index', i + offset);
        }
        return output;
    });
    Handlebars.registerHelper("percent", (n, options) => {
        let number = parseFloat(n);
        if (isNaN(number)) {
            return "";
        }
        number = Math.round(number * 100);
        const signStr = options.hash.sign ? (number >= 0 ? "+" : "") : "";
        return `${signStr}${number}${options.hash.symbol ? "%" : ""}`;
    });
    Handlebars.registerHelper("numberFormat", (n, options) => {
        let number = parseFloat(n);
        if (isNaN(number)) {
            return "";
        }
        if (options.hash.decimals && !isNaN(parseFloat(options.hash.decimals))) {
            number = number.toFixed(parseFloat(options.hash.decimals));
        }
        const signStr = options.hash.sign ? (number >= 0 ? "+" : "") : "";
        return `${signStr}${number}${options.hash.symbol ? "%" : ""}`;
    });
    Handlebars.registerHelper("diff", (a, b) => {
        a = parseFloat(a);
        b = parseFloat(b);
        if (isNaN(a) || isNaN(b)) {
            return "";
        }
        return a - b;
    });
    Handlebars.registerHelper("sum", (a, b) => {
        a = parseFloat(a);
        b = parseFloat(b);
        if (isNaN(a) || isNaN(b)) {
            return "";
        }
        return a + b;
    });
    Handlebars.registerHelper("capitalize", (a) => {
        return String(a).charAt(0).toUpperCase() + String(a).slice(1);
    });
    // check if all object values are 0 or otherwise falsy
    Handlebars.registerHelper("zeroedObject", (o) => {
        if (typeof o !== "object") return false;
        let empty = true;
        for (const [, value] of Object.entries(o)) {
            if (value) {
                empty = false;
                break;
            }
        }
        return empty;
    })
}

/**
 * Renders a handlebars template from a url
 * @param {String} url path to handlebars template file
 * @param {Object?} data to use for rendering handlebars template
 * @returns {Promise} rendered handlebars remplate
 */
async function renderFromTemplate(url, data = {}) {
    try {
        const content = await loadTextFile(url);
        const template = Handlebars.compile(content);
        const msg = template(data);
        return enrichHtml(msg);
    } catch (error) {
        console.error(error);
        return undefined;
    }
}

/**
 * Registers handlebar partials from a list of strings
 * @param {String[]} urls to load partials from
 */
async function loadPartials(urls) {
    for (const url of urls) {
        const content = await loadTextFile(url);
        Handlebars.registerPartial(url, content);
    }
}

/**
 * Performs some text enrichment on a rendered element
 * @param {String} text
 */
function enrichHtml(text) {
    text = text.replace(CONTENT_LINK_REG, (link) => {
        const uuid = link.match(LINK_UUID_REG)?.[0] ?? "";
        const id = uuid.match(LINK_ID_REG)?.[0] ?? "";
        const label = link.match(LINK_LABEL_REG)?.[0] ?? link;
        return `<a class="content-link" data-uuid="${uuid}"
            data-id="${id}"> ${label} </a>`;
    });
    return text;
}

export default {
    renderFromTemplate,
    loadPartials,
    registerHelpers
}