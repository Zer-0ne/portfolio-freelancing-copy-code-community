/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ["d112y698adiu2z.cloudfront.net", 'external-content.duckduckgo.com', 'firebasestorage.googleapis.com','drive.google.com',"github.com"],
        remotePatterns:[
            {
                protocol:'https',
                hostname:'**.d112y698adiu2z.cloudfront.net'
            },
            {
                protocol:'https',
                hostname:'**.firebasestorage.googleapis.com'
            },
            {
                protocol:'https',
                hostname:'**.external-content.duckduckgo.com'
            },
            {
                protocol:'https',
                hostname:'**.drive.google.com'
            },
            {
                protocol:'https',
                hostname:'**."github.com"'
            },
            {
                protocol:'https',
                hostname:'**.**.**'
            },
            {
                protocol:'https',
                hostname:'**.**'
            },

        ]
    }
}

module.exports = nextConfig
