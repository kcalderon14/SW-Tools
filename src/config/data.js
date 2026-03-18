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

export const stagingServers = [
    {
        ip: '23.50.51.34',
        label: 'Staging A (23.50.51.34)',
        domains: ['www.solarwinds.com', 'solarwindspartnersummit.com', 'www.dnsstuff.com', 'www.serv-u.com', 'www.pingdom.com']
    },
    {
        ip: '23.50.52.34',
        label: 'Staging B (23.50.52.34)',
        domains: ['jobs.solarwinds.com', 'try.solarwinds.com', 'do.solarwinds.com', 'www.itproday.org', 'www.dameware.com', 'www.serv-u.com', 'www.appoptics.com', 'www.loggly.com']
    },
    {
        ip: '23.50.55.49',
        label: 'Staging C (23.50.55.49)',
        domains: ['support.solarwinds.com', 'www.serv-u.com', 'www.papertrail.com']
    },
    {
        ip: '23.203.12.81',
        label: 'Staging D (23.203.12.81)',
        domains: ['www.webhelpdesk.com', 'www.kiwisyslog.com', 'www.solarwinds.ru', 'try.solarwinds.com']
    },
    {
        ip: '23.50.52.41',
        label: 'Staging E (23.50.52.41)',
        domains: ['www.pingdom.com']
    },
    {
        ip: '23.34.126.223',
        label: 'Staging F (23.34.126.223)',
        domains: ['www.webhelpdesk.com']
    }
];