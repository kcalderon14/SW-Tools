import { sitesData } from '../config/data';
import { errors } from '../config/data';
import { fileContent } from '../config/data';

export default class Redirect {
    constructor(ticket, ruleName, domain, langValidation){
        this.ticket = ticket,
        this.ruleName = ruleName
        this.domain = domain,
        this.info = []
        this.status = false;
        this.policy = [];
        this.langValidation = langValidation;
    }

    addRedirect(redirectId, matchUrl = "TBD", resultUrl = "/", queryString, schemeAndHost, useRelative, statusCode, langValidation){
        const redirect = {
                redirectId: redirectId,
                matchUrl: matchUrl,
                resultUrl: resultUrl,
                queryString: queryString,
                schemeAndHost: this.useHost(resultUrl),
                useRelative: this.isRelative(resultUrl),
                statusCode: statusCode,
                isLoc: this.isLoc(matchUrl),
                redirectStatus: this.validations(matchUrl, resultUrl).status,
                redirectStatusMessage: this.validations(matchUrl, resultUrl).message.join('\n')
        };
        this.langValidation = langValidation;
        this.info.push(redirect);
        this.getPolicy();
    }

    isLoc(url){
        let flag = false;
        const lang = this.getLang();
        lang.forEach(e => {
            if (url.includes(e)) {
                flag = true;
            }
        })
        return flag;
    }

    getLang() {
        let lang;
        sitesData.forEach((e, i) => {
            if (e.site === this.domain) {
                lang = e.lang;
            }
        });
        return lang;
    }

    validations(url, resultUrl){
        let result = {
            status: true,
            message: []
        }
        if (!url.includes(this.domain)) {
            result.status = false;
            result.message.push(errors.wrongDomain);
        }
        if (resultUrl === url.slice(url.indexOf('.com') + 4, url.length)) {
            result.status = false;
            result.message.push(errors.selfRedirected);
        }
        if (resultUrl.indexOf('/') === 0 && this.langValidation) {
                const lang = this.getLang();
                if (lang[0] !== 'NA') {
                    for (const e of lang) {
                        if ((url.includes(e) && !resultUrl.includes(e)) || (!url.includes(e) && resultUrl.includes(e))) {
                            result.status = false;
                            result.message.push(errors.locMismatch);
                            continue;
                        }
                    }
                }
        }
        return result;
    }

    readyToGenerate(){
        let flag = true;
        for (const interator of this.info) {
            if (!interator.redirectStatus) {
                this.status = false;
                flag = false;
                break;
            }
        }
        return flag;
    }

    updateRedirect(id, data){
        for (const element of this.info) {
            if (element.redirectId === id) {
                element.statusCode = data;
                break;
            }
        }
    }

    updateRedirectQuery(id, data){
        for (const element of this.info) {
            if (element.redirectId === id) {
                element.queryString = data;
                break;
            }
        }
    }

    isRelative(resultUrl){
        return resultUrl.startsWith('/') ? 1: '';
    }

    useHost(resultUrl) {
        return resultUrl.startsWith('/') ? 'copy_scheme_hostname': '' ;
    }

    getPolicy(){
        this.policy.length = 0;
        const siteConfig = sitesData.find(e => e.site === this.domain);
        if (!siteConfig) return;
        siteConfig.policies.forEach(p => {
            this.policy.push(p.name);
        });
    }

    getPolicyForUrl(matchUrl){
        const siteConfig = sitesData.find(e => e.site === this.domain);
        if (!siteConfig) return null;

        const allLangs = siteConfig.lang.filter(l => l !== 'NA');
        const isLocUrl = allLangs.some(l => matchUrl.includes(l));

        for (const policy of siteConfig.policies) {
            const hasPathRule = policy.paths && policy.paths.length > 0;
            if (hasPathRule) {
                if (!policy.paths.some(p => matchUrl.includes(p))) continue;
            } else {
                const allPaths = siteConfig.policies
                    .filter(p => p.paths && p.paths.length > 0)
                    .flatMap(p => p.paths);
                if (allPaths.some(p => matchUrl.includes(p))) continue;
            }

            const hasLangRule = policy.langs && policy.langs.length > 0;
            if (hasLangRule) {
                if (policy.langs.some(l => matchUrl.includes(l))) return policy.name;
            } else {
                if (!isLocUrl) return policy.name;
            }
        }

        return siteConfig.policies[siteConfig.policies.length - 1].name;
    }

    generateContent(){
        const buckets = {};

        this.info.forEach((e) => {
            const policyName = this.getPolicyForUrl(e.matchUrl);
            if (!buckets[policyName]) {
                buckets[policyName] = fileContent;
            }
            buckets[policyName] += `${this.ruleName},${e.matchUrl},,,,,,${e.queryString},${e.useRelative},${e.schemeAndHost},${e.resultUrl},${e.statusCode}\n`;
        });

        return Object.entries(buckets).map(([policyName, content]) => ({
            policyName,
            content
        }));
    }
}
