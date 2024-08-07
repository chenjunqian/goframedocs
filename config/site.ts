export type SiteConfig = typeof siteConfig

export const siteConfig = {
    name: "Goframe",
    description:
        "GoFrame is a modular, high-performance, enterprise-level Go development framework. It is a general-purpose foundational framework that serves as an enhanced extension to the Golang standard library, encompassing versatile core components for development. Its strengths lie in its practicality, modularity, comprehensive documentation, rich modules, high usability, strong generality, and team-oriented design. GoFrame is suitable for developing both full-fledged engineering projects and as a toolkit due to its decoupled modular design. Whether you're looking to develop a business-oriented project in Golang, small or large-scale, GoFrame is your top choice. If you aim to create a Golang component library, GoFrame's ready-to-use, powerful foundational component library will greatly increase your efficiency.",
    keywords: ["goframe", "goframe framework", "goframe website", "goframe documentation", "gf", "gf framework", "gf website", "gf documentation"],
    mainNav: [
        {
            title: "Home",
            href: "/",
        },
    ],
    links: {
        github: "https://github.com/gogf/gf",
    },
}

export type DocsRouterInfo = {
    fullPath?: string
    markdownPath?: string
    PreBtnName?: string
    PreBtnPath?: string
    NextBtnName?: string
    NextBtnPath?: string
}

export const getDocsRouterInfo = (path: string): DocsRouterInfo => {
    let routerInfo: DocsRouterInfo = {}

    switch (path) {
        case 'installation':
            routerInfo = {
                fullPath: '/docs/installation',
                markdownPath: '/docs/quick-start/installation.md',
                PreBtnName: 'Introduction',
                PreBtnPath: '/docs/',
                NextBtnName: 'Create Application',
                NextBtnPath: '/docs/create-application',
            }
            break;

        case 'create-application':
            routerInfo = {
                fullPath: '/docs/create-application',
                markdownPath: '/docs/quick-start/create-application.md',
                PreBtnName: 'Installation',
                PreBtnPath: '/docs/installation',
                NextBtnName: 'Create Application',
                NextBtnPath: '/docs/create-application',
            }
            break;

        case 'startup':
            routerInfo = {
                fullPath: '/docs/startup',
                markdownPath: '/docs/quick-start/instance-startup.md',
                PreBtnName: 'Create Application',
                PreBtnPath: '/docs/create-application',
                NextBtnName: 'Configuration',
                NextBtnPath: '/docs/configuration',
            }
            break;

        case 'configuration':
            routerInfo = {
                fullPath: '/docs/configuration',
                markdownPath: '/docs/quick-start/configuration.md',
                PreBtnName: 'Staretup',
                PreBtnPath: '/docs/startup',
                NextBtnName: 'Example',
                NextBtnPath: '/docs/example',
            }
            break;

        case 'example':
            routerInfo = {
                fullPath: '/docs/example',
                markdownPath: '/docs/quick-start/example.md',
                PreBtnName: 'Configuration',
                PreBtnPath: '/docs/configuration',
                NextBtnName: 'Core Component',
                NextBtnPath: '/docs/core-component/object-management',
            }
            break;

        case 'core-component/object-management':
            routerInfo = {
                fullPath: '/docs/core-component/object-management',
                markdownPath: '/docs/core-component/object-management.md',
                PreBtnName: 'Example',
                PreBtnPath: '/docs/example',
                NextBtnName: 'Debug Mode',
                NextBtnPath: '/docs/core-component/debug-mode',
            }
            break;

        case 'core-component/debug-mode':
            routerInfo = {
                fullPath: '/docs/core-component/debug-mode',
                markdownPath: '/docs/core-component/debug-mode.md',
                PreBtnName: 'Core Component | Object Management',
                PreBtnPath: '/docs/core-component/object-management',
                NextBtnName: 'Core Component | Command',
                NextBtnPath: '/docs/core-component/command',
            }
            break;

        case 'core-component/command':
            routerInfo = {
                fullPath: '/docs/core-component/command',
                markdownPath: '/docs/core-component/command/command.md',
                PreBtnName: 'Core Component | Debug Mode',
                PreBtnPath: '/docs/core-component/debug-mode',
                NextBtnName: 'Command | Basic Concept',
                NextBtnPath: '/docs/core-component/command/basic-concept',
            }
            break;

        case 'core-component/command/basic-concept':
            routerInfo = {
                fullPath: '/docs/core-component/command/basic-concept',
                markdownPath: '/docs/core-component/command/basic-concept.md',
                PreBtnName: 'Core Component | Command',
                PreBtnPath: '/docs/core-component/command',
                NextBtnName: 'Command | Function',
                NextBtnPath: '/docs/core-component/command/function',
            }
            break;

        case 'core-component/command/function':
            routerInfo = {
                fullPath: '/docs/core-component/command/function',
                markdownPath: '/docs/core-component/command/function.md',
                PreBtnName: 'Command | Basic Concept',
                PreBtnPath: '/docs/core-component/command/basic-concept',
                NextBtnName: 'Command | Parser',
                NextBtnPath: '/docs/core-component/command/parser',
            }
            break;

        case 'core-component/command/parser':
            routerInfo = {
                fullPath: '/docs/core-component/command/parser',
                markdownPath: '/docs/core-component/command/parser.md',
                PreBtnName: 'Command | Function',
                PreBtnPath: '/docs/core-component/command/function',
                NextBtnName: 'Command | Parser',
                NextBtnPath: '/docs/core-component/command/parser',
            }
            break;

        case 'core-component/command/object':
            routerInfo = {
                fullPath: '/docs/core-component/command/object',
                markdownPath: '/docs/core-component/command/object.md',
                PreBtnName: 'Command | Parser',
                PreBtnPath: '/docs/core-component/command/parser',
                NextBtnName: 'Command | Parameter',
                NextBtnPath: '/docs/core-component/command/parameter',
            }
            break;

        case 'core-component/command/parameter':
            routerInfo = {
                fullPath: '/docs/core-component/command/parameter',
                markdownPath: '/docs/core-component/command/parameter.md',
                PreBtnName: 'Command | Object',
                PreBtnPath: '/docs/core-component/command/object',
                NextBtnName: 'Command | Terminal Interaction',
                NextBtnPath: '/docs/core-component/command/terminal-interaction',
            }
            break;

        case 'core-component/command/terminal-interaction':
            routerInfo = {
                fullPath: '/docs/core-component/command/terminal-interaction',
                markdownPath: '/docs/core-component/command/terminal-interaction.md',
                PreBtnName: 'Command | Parameter',
                PreBtnPath: '/docs/core-component/command/parameter',
                NextBtnName: 'Command | Tracing',
                NextBtnPath: '/docs/core-component/command/tracing',
            }
            break;

        case 'core-component/command/tracing':
            routerInfo = {
                fullPath: '/docs/core-component/command/tracing',
                markdownPath: '/docs/core-component/command/tracing.md',
                PreBtnName: 'Command | Terminal Interaction',
                PreBtnPath: '/docs/core-component/command/terminal-interaction',
                NextBtnName: 'Core Component | Configuration',
                NextBtnPath: '/docs/core-component/configuration',
            }
            break;

        case 'core-component/configuration':
            routerInfo = {
                fullPath: '/docs/core-component/configuration',
                markdownPath: '/docs/core-component/configuration/overview.md',
                PreBtnName: 'Command | Tracing',
                PreBtnPath: '/docs/core-component/command/tracing',
                NextBtnName: 'Configuration | Object',
                NextBtnPath: '/docs/core-component/configuration/object',
            }
            break;

        case 'core-component/configuration/object':
            routerInfo = {
                fullPath: '/docs/core-component/configuration/object',
                markdownPath: '/docs/core-component/configuration/object.md',
                PreBtnName: 'Configuration | Overview',
                PreBtnPath: '/docs/core-component/configuration',
                NextBtnName: 'Configuration | Config File',
                NextBtnPath: '/docs/core-component/configuration/config-file',
            }
            break;

        case 'core-component/configuration/config-file':
            routerInfo = {
                fullPath: '/docs/core-component/configuration/config-file',
                markdownPath: '/docs/core-component/configuration/config-file.md',
                PreBtnName: 'Configuration | Object',
                PreBtnPath: '/docs/core-component/configuration/object',
                NextBtnName: 'Configuration | Function',
                NextBtnPath: '/docs/core-component/configuration/function',
            }
            break;

        case 'core-component/configuration/function':
            routerInfo = {
                fullPath: '/docs/core-component/configuration/function',
                markdownPath: '/docs/core-component/configuration/function.md',
                PreBtnName: 'Configuration | Config File',
                PreBtnPath: '/docs/core-component/configuration/config-file',
                NextBtnName: 'Configuration | Interface',
                NextBtnPath: '/docs/core-component/configuration/interface-base',
            }
            break;

        case 'core-component/configuration/interface-base':
            routerInfo = {
                fullPath: '/docs/core-component/configuration/interface-base',
                markdownPath: '/docs/core-component/configuration/interface-base.md',
                PreBtnName: 'Configuration | Function',
                PreBtnPath: '/docs/core-component/configuration/function',
                NextBtnName: 'Configuration | Adapter',
                NextBtnPath: '/docs/core-component/configuration/adapter',
            }
            break;

        case 'core-component/configuration/adapter':
            routerInfo = {
                fullPath: '/docs/core-component/configuration/adapter',
                markdownPath: '/docs/core-component/configuration/adapter.md',
                PreBtnName: 'Configuration | Interface',
                PreBtnPath: '/docs/core-component/configuration/interface-base',
                NextBtnName: 'Core Component | Log',
                NextBtnPath: '/docs/core-component/log',
            }
            break;

        case 'core-component/log':
            routerInfo = {
                fullPath: '/docs/core-component/log',
                markdownPath: '/docs/core-component/log/overview.md',
                PreBtnName: 'Configuration | Adapter',
                PreBtnPath: '/docs/core-component/configuration/adapter',
                NextBtnName: 'Core Component | Command',
                NextBtnPath: '/docs/core-component/command',
            }
            break;
        
        case 'core-component/log/config':
            routerInfo = {
                fullPath: '/docs/core-component/log/config',
                markdownPath: '/docs/core-component/log/config.md',
                PreBtnName: 'Core Component | Log',
                PreBtnPath: '/docs/core-component/log',
                NextBtnName: 'Log | Level',
                NextBtnPath: '/docs/core-component/log/level',
            }
            break;

        case 'core-component/log/level':
            routerInfo = {
                fullPath: '/docs/core-component/log/level',
                markdownPath: '/docs/core-component/log/level.md',
                PreBtnName: 'Log | Config',
                PreBtnPath: '/docs/core-component/log/config',
                NextBtnName: 'Log | Path',
                NextBtnPath: '/docs/core-component/log/path',
            }
            break;

        case 'core-component/log/path':
            routerInfo = {
                fullPath: '/docs/core-component/log/path',
                markdownPath: '/docs/core-component/log/path.md',
                PreBtnName: 'Log | Level',
                PreBtnPath: '/docs/core-component/log/level',
                NextBtnName: 'Log | Chain Operation',
                NextBtnPath: '/docs/core-component/log/chain-opts',
            }
            break;

        case 'core-component/log/chain-opts':
            routerInfo = {
                fullPath: '/docs/core-component/log/chain-opts',
                markdownPath: '/docs/core-component/log/chain-opts.md',
                PreBtnName: 'Log | Path',
                PreBtnPath: '/docs/core-component/log/path',
                NextBtnName: 'Log | Color Print',
                NextBtnPath: '/docs/core-component/log/color-print',
            }
            break;

        case 'core-component/log/color-print':
            routerInfo = {
                fullPath: '/docs/core-component/log/color-print',
                markdownPath: '/docs/core-component/log/color-print.md',
                PreBtnName: 'Log | Chain Operation',
                PreBtnPath: '/docs/core-component/log/chain-opts',
                NextBtnName: 'Log | Context',
                NextBtnPath: '/docs/core-component/log/context',
            }
            break;

        case 'core-component/log/context':
            routerInfo = {
                fullPath: '/docs/core-component/log/context',
                markdownPath: '/docs/core-component/log/context.md',
                PreBtnName: 'Log | Color Print',
                PreBtnPath: '/docs/core-component/log/color-print',
                NextBtnName: 'Log | Handler',
                NextBtnPath: '/docs/core-component/log/handler',
            }
            break;

        case 'core-component/log/handler':
            routerInfo = {
                fullPath: '/docs/core-component/log/handler',
                markdownPath: '/docs/core-component/log/handler.md',
                PreBtnName: 'Log | Context',
                PreBtnPath: '/docs/core-component/log/context',
                NextBtnName: 'Log | JSON Format',
                NextBtnPath: '/docs/core-component/log/json-format',
            }
            break;

        case 'core-component/log/json-format':
            routerInfo = {
                fullPath: '/docs/core-component/log/json-format',
                markdownPath: '/docs/core-component/log/json-format.md',
                PreBtnName: 'Log | Handler',
                PreBtnPath: '/docs/core-component/log/handler',
                NextBtnName: 'Log | Async',
                NextBtnPath: '/docs/core-component/log/async',
            }
            break;

        case 'core-component/log/async':
            routerInfo = {
                fullPath: '/docs/core-component/log/async',
                markdownPath: '/docs/core-component/log/async.md',
                PreBtnName: 'Log | JSON Format',
                PreBtnPath: '/docs/core-component/log/json-format',
                NextBtnName: 'Log | Stack Print',
                NextBtnPath: '/docs/core-component/log/stack-print',
            }
            break;

        case 'core-component/log/stack-print':
            routerInfo = {
                fullPath: '/docs/core-component/log/stack-print',
                markdownPath: '/docs/core-component/log/stack-print.md',
                PreBtnName: 'Log | Async',
                PreBtnPath: '/docs/core-component/log/async',
                NextBtnName: 'Log | Debug Info',
                NextBtnPath: '/docs/core-component/log/debug-info',
            }
            break;

        case 'core-component/log/debug-info':
            routerInfo = {
                fullPath: '/docs/core-component/log/debug-info',
                markdownPath: '/docs/core-component/log/debug-info.md',
                PreBtnName: 'Log | Stack Print',
                PreBtnPath: '/docs/core-component/log/stack-print',
                NextBtnName: 'Log | Writer',
                NextBtnPath: '/docs/core-component/log/writer',
            }
            break;

        case 'core-component/log/writer':
            routerInfo = {
                fullPath: '/docs/core-component/log/writer',
                markdownPath: '/docs/core-component/log/writer.md',
                PreBtnName: 'Log | Debug Info',
                PreBtnPath: '/docs/core-component/log/debug-info',
                NextBtnName: 'Log | Flags',
                NextBtnPath: '/docs/core-component/log/flags',
            }
            break;
        
        case 'core-component/log/flags':
            routerInfo = {
                fullPath: '/docs/core-component/log/flags',
                markdownPath: '/docs/core-component/log/flags.md',
                PreBtnName: 'Log | Writer',
                PreBtnPath: '/docs/core-component/log/writer',
                NextBtnName: 'Log | Rotate',
                NextBtnPath: '/docs/core-component/log/rotate',
            }
            break;

        case 'core-component/log/rotate':
            routerInfo = {
                fullPath: '/docs/core-component/log/rotate',
                markdownPath: '/docs/core-component/log/rotate.md',
                PreBtnName: 'Log | Flags',
                PreBtnPath: '/docs/core-component/log/flags',
                NextBtnName: 'Log | FAQ',
                NextBtnPath: '/docs/core-component/log/faq',
            }
            break;

        case 'core-component/log/faq':
            routerInfo = {
                fullPath: '/docs/core-component/log/faq',
                markdownPath: '/docs/core-component/log/faq.md',
                PreBtnName: 'Log | Rotate',
                PreBtnPath: '/docs/core-component/log/rotate',
                NextBtnName: 'Core Component | Error',
                NextBtnPath: '/docs/core-component/error',
            }
            break;

        case 'core-component/error':
            routerInfo = {
                fullPath: '/docs/core-component/error',
                markdownPath: '/docs/core-component/error/overview.md',
                PreBtnName: 'Log | FAQ',
                PreBtnPath: '/docs/core-component/log/faq',
                NextBtnName: 'Error | Function',
                NextBtnPath: '/docs/core-component/error/function',
            }
            break;

        case 'core-component/error/function':
            routerInfo = {
                fullPath: '/docs/core-component/error/function',
                markdownPath: '/docs/core-component/error/function.md',
                PreBtnName: 'Core Component | Error',
                PreBtnPath: '/docs/core-component/error',
                NextBtnName: 'Error | Stack',
                NextBtnPath: '/docs/core-component/error/stack',
            }
            break;

        case 'core-component/error/stack':
            routerInfo = {
                fullPath: '/docs/core-component/error/stack',
                markdownPath: '/docs/core-component/error/stack.md',
                PreBtnName: 'Error | Compare',
                PreBtnPath: '/docs/core-component/error/compare',
                NextBtnName: 'Error | Code',
                NextBtnPath: '/docs/core-component/error/code',
            }
            break;
        
        case 'core-component/error/code':
            routerInfo = {
                fullPath: '/docs/core-component/error/code',
                markdownPath: '/docs/core-component/error/code.md',
                PreBtnName: 'Error | Stack',
                PreBtnPath: '/docs/core-component/error/stack',
                NextBtnName: 'Error | Others',
                NextBtnPath: '/docs/core-component/error/others',
            }
            break;

        case 'core-component/error/others':
            routerInfo = {
                fullPath: '/docs/core-component/error/others',
                markdownPath: '/docs/core-component/error/others.md',
                PreBtnName: 'Error | Code',
                PreBtnPath: '/docs/core-component/error/code',
                NextBtnName: 'Error | Best Practices',
                NextBtnPath: '/docs/core-component/error/best-practices',
            }
            break;

        case 'core-component/error/best-practices':
            routerInfo = {
                fullPath: '/docs/core-component/error/best-practices',
                markdownPath: '/docs/core-component/error/best-practices.md',
                PreBtnName: 'Error | Others',
                PreBtnPath: '/docs/core-component/error/others',
                NextBtnName: 'Error | Banchmark',
                NextBtnPath: '/docs/core-component/error/benchmark',
            }
            break;

        case 'core-component/error/benchmark':
            routerInfo = {
                fullPath: '/docs/core-component/error/benchmark',
                markdownPath: '/docs/core-component/error/benchmark.md',
                PreBtnName: 'Error | Best Practices',
                PreBtnPath: '/docs/core-component/error/best-practices',
                NextBtnName: 'Core Component | Data Validation',
                NextBtnPath: '/docs/core-component/data-valid',
            }
            break;


        default:
            break;
    }

    return routerInfo
}