/**
 * @type {import('@remix-run/dev/config').AppConfig}
 */
module.exports = {
    "ignoredRouteFiles": ["**/.*"],
    "serverDependenciesToBundle": [
        /^rehype.*/,
        /^remark.*/,
        "mdx-bundler",
        "@mdx-js/react"
    ]
};
