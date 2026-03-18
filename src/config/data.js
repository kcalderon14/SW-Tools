export const sitesData = [
    {
        site: "www.solarwinds.com",
        lang: ['/de/', '/es/', '/pt/', '/fr/', '/ja/', '/ko/', '/zh/'],
        policies: [
            { name: "ER_Solarwinds4C", paths: ['/resources/'], langs: ['/de/', '/es/', '/fr/'] },
            { name: "ER_Solarwinds4D", paths: ['/resources/'], langs: ['/ja/', '/ko/', '/pt/', '/zh/'] },
            { name: "ER_Solarwinds4B", paths: ['/resources/'], langs: [] },
            { name: "ER_Solarwinds3A", paths: [], langs: ['/de/', '/es/', '/fr/'] },
            { name: "ER_Solarwinds3B", paths: [], langs: ['/ja/', '/ko/'] },
            { name: "ER_Solarwinds3C", paths: [], langs: ['/pt/', '/zh/'] },
            { name: "ER_Solarwinds2", paths: [], langs: [] },
        ]
    },
    {
        site: "www.dameware.com",
        lang: ['/de/', '/pt/', '/fr/', '/ja/'],
        policies: [
            { name: "ER_Brandsites", paths: [], langs: [] }
        ]
    },
    {
        site: "www.webhelpdesk.com",
        lang: ['NA'],
        policies: [
            { name: "ER_Webhelpdesk", paths: [], langs: [] }
        ]
    },
    {
        site: "www.serv-u.com",
        lang: ['NA'],
        policies: [
            { name: "ER_Servu", paths: [], langs: [] }
        ]
    },
    {
        site: "www.kiwisyslog.com",
        lang: ['NA'],
        policies: [
            { name: "ER_Kiwi", paths: [], langs: [] }
        ]
    },
    {
        site: "www.appoptics.com",
        lang: ['/de/', '/es/', '/pt/', '/fr/', '/ja/', '/ko/', '/zh/'],
        policies: [
            { name: "ER_appotpics", paths: [], langs: [] }
        ]
    },
    {
        site: "try.solarwinds.com",
        lang: ['NA'],
        policies: [
            { name: "ER_TrySWDC", paths: [], langs: [] }
        ]
    },
    {
        site: "support.solarwinds.com",
        lang: ['NA'],
        policies: [
            { name: "ER_CSC_2", paths: [], langs: [] }
        ]
    },
    {
        site: "www.loggly.com",
        lang: ['NA'],
        policies: [
            { name: "ER_Loggly", paths: [], langs: [] }
        ]
    },
    {
        site: "www.pingdom.com",
        lang: ['NA'],
        policies: [
            { name: "ER_Pingdom", paths: [], langs: [] }
        ]
    },
    {
        site: "www.dnsstuff.com",
        lang: ['NA'],
        policies: [
            { name: "ER_DNSstuff", paths: [], langs: [] }
        ]
    },
    {
        site: "www.papertrail.com",
        lang: ['NA'],
        policies: [
            { name: "ER_Papertrail", paths: [], langs: [] }
        ]
    },
    {
        site: "www.monalytic.com",
        lang: ['NA'],
        policies: [
            { name: "ER_Monalytic", paths: [], langs: [] }
        ]
    }
];

export const redirectTypes = [301, 302];

export const errors = {
    wrongDomain: 'Selected domain does not match.',
    selfRedirected: 'This is redirected to the same URL, this might cause a redirect loop.',
    locMismatch: 'Localized versions do not match.'
}

export const fileContent = `ruleName,matchURL,scheme,host,path,query,disabled,result.useIncomingQueryString,result.useIncomingSchemeAndHost,result.useRelativeUrl,result.redirectURL,result.statusCode\n`;