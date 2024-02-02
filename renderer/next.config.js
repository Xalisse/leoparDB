const webpack = require('webpack')

/** @type {import('next').NextConfig} */
module.exports = {
    trailingSlash: true,
    images: {
        unoptimized: true,
    },

    // main process' webpack config
    webpack: (webpackConfig) => {
        webpackConfig.externals.push({
            'node:path': '{}',
        })
        webpackConfig.plugins.push(
            // Remove node: from import specifiers, because Next.js does not yet support node: scheme
            // https://github.com/vercel/next.js/issues/28774
            new webpack.NormalModuleReplacementPlugin(/^node:/, (resource) => {
                resource.request = resource.request.replace(/^node:/, '')
            })
        )

        return webpackConfig
    },
}
