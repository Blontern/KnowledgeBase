param(
    [switch]$env,
    [switch]$init,
    [switch]$build
)

if ($env) {
    fnm env --use-on-cd | Out-String | Invoke-Expression
    fnm use 22
}

if ($init) {
    npm add -D vitepress
    npx vitepress init
}

if ($build) {
    npm run docs:build
}
else {
    npm run docs:dev
}