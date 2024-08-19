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
    fullPath: string
    markdownPath?: string
    PreBtnName?: string
    PreBtnPath?: string
    NextBtnName?: string
    NextBtnPath?: string
}

export type DocsRouterInfoDict = {
    [key: string]: DocsRouterInfo
}

export const routerInfoDic: DocsRouterInfoDict = {
    'installation': {
        fullPath: '/docs/installation',
        markdownPath: '/docs/quick-start/installation.md',
        PreBtnName: 'Introduction',
        PreBtnPath: '/docs/',
        NextBtnName: 'Create Application',
        NextBtnPath: '/docs/create-application',
    },

    'create-application': {
        fullPath: '/docs/create-application',
        markdownPath: '/docs/quick-start/create-application.md',
        PreBtnName: 'Installation',
        PreBtnPath: '/docs/installation',
        NextBtnName: 'Create Application',
        NextBtnPath: '/docs/create-application',
    },

    'startup': {
        fullPath: '/docs/startup',
        markdownPath: '/docs/quick-start/instance-startup.md',
        PreBtnName: 'Create Application',
        PreBtnPath: '/docs/create-application',
        NextBtnName: 'Configuration',
        NextBtnPath: '/docs/configuration',
    },

    'configuration': {
        fullPath: '/docs/configuration',
        markdownPath: '/docs/quick-start/configuration.md',
        PreBtnName: 'Staretup',
        PreBtnPath: '/docs/startup',
        NextBtnName: 'Example',
        NextBtnPath: '/docs/example',
    },

    'example': {
        fullPath: '/docs/example',
        markdownPath: '/docs/quick-start/example.md',
        PreBtnName: 'Configuration',
        PreBtnPath: '/docs/configuration',
        NextBtnName: 'Core Component',
        NextBtnPath: '/docs/core-component/object-management',
    },

    'core-component/object-management': {
        fullPath: '/docs/core-component/object-management',
        markdownPath: '/docs/core-component/object-management.md',
        PreBtnName: 'Example',
        PreBtnPath: '/docs/example',
        NextBtnName: 'Debug Mode',
        NextBtnPath: '/docs/core-component/debug-mode',
    },

    'core-component/debug-mode': {
        fullPath: '/docs/core-component/debug-mode',
        markdownPath: '/docs/core-component/debug-mode.md',
        PreBtnName: 'Core Component | Object Management',
        PreBtnPath: '/docs/core-component/object-management',
        NextBtnName: 'Core Component | Command',
        NextBtnPath: '/docs/core-component/command',
    },

    'core-component/command': {
        fullPath: '/docs/core-component/command',
        markdownPath: '/docs/core-component/command/command.md',
        PreBtnName: 'Core Component | Debug Mode',
        PreBtnPath: '/docs/core-component/debug-mode',
        NextBtnName: 'Command | Basic Concept',
        NextBtnPath: '/docs/core-component/command/basic-concept',
    },

    'core-component/command/basic-concept': {
        fullPath: '/docs/core-component/command/basic-concept',
        markdownPath: '/docs/core-component/command/basic-concept.md',
        PreBtnName: 'Core Component | Command',
        PreBtnPath: '/docs/core-component/command',
        NextBtnName: 'Command | Function',
        NextBtnPath: '/docs/core-component/command/function',
    },

    'core-component/command/function': {
        fullPath: '/docs/core-component/command/function',
        markdownPath: '/docs/core-component/command/function.md',
        PreBtnName: 'Command | Basic Concept',
        PreBtnPath: '/docs/core-component/command/basic-concept',
        NextBtnName: 'Command | Parser',
        NextBtnPath: '/docs/core-component/command/parser',
    },

    'core-component/command/parser': {
        fullPath: '/docs/core-component/command/parser',
        markdownPath: '/docs/core-component/command/parser.md',
        PreBtnName: 'Command | Function',
        PreBtnPath: '/docs/core-component/command/function',
        NextBtnName: 'Command | Parser',
        NextBtnPath: '/docs/core-component/command/parser',
    },

    'core-component/command/object': {
        fullPath: '/docs/core-component/command/object',
        markdownPath: '/docs/core-component/command/object.md',
        PreBtnName: 'Command | Parser',
        PreBtnPath: '/docs/core-component/command/parser',
        NextBtnName: 'Command | Parameter',
        NextBtnPath: '/docs/core-component/command/parameter',
    },

    'core-component/command/parameter': {
        fullPath: '/docs/core-component/command/parameter',
        markdownPath: '/docs/core-component/command/parameter.md',
        PreBtnName: 'Command | Object',
        PreBtnPath: '/docs/core-component/command/object',
        NextBtnName: 'Command | Terminal Interaction',
        NextBtnPath: '/docs/core-component/command/terminal-interaction',
    },

    'core-component/command/terminal-interaction': {
        fullPath: '/docs/core-component/command/terminal-interaction',
        markdownPath: '/docs/core-component/command/terminal-interaction.md',
        PreBtnName: 'Command | Parameter',
        PreBtnPath: '/docs/core-component/command/parameter',
        NextBtnName: 'Command | Tracing',
        NextBtnPath: '/docs/core-component/command/tracing',
    },

    'core-component/command/tracing': {
        fullPath: '/docs/core-component/command/tracing',
        markdownPath: '/docs/core-component/command/tracing.md',
        PreBtnName: 'Command | Terminal Interaction',
        PreBtnPath: '/docs/core-component/command/terminal-interaction',
        NextBtnName: 'Core Component | Configuration',
        NextBtnPath: '/docs/core-component/configuration',
    },

    'core-component/configuration': {
        fullPath: '/docs/core-component/configuration',
        markdownPath: '/docs/core-component/configuration/overview.md',
        PreBtnName: 'Command | Tracing',
        PreBtnPath: '/docs/core-component/command/tracing',
        NextBtnName: 'Configuration | Object',
        NextBtnPath: '/docs/core-component/configuration/object',
    },

    'core-component/configuration/object': {
        fullPath: '/docs/core-component/configuration/object',
        markdownPath: '/docs/core-component/configuration/object.md',
        PreBtnName: 'Configuration | Overview',
        PreBtnPath: '/docs/core-component/configuration',
        NextBtnName: 'Configuration | Config File',
        NextBtnPath: '/docs/core-component/configuration/config-file',
    },

    'core-component/configuration/config-file': {
        fullPath: '/docs/core-component/configuration/config-file',
        markdownPath: '/docs/core-component/configuration/config-file.md',
        PreBtnName: 'Configuration | Object',
        PreBtnPath: '/docs/core-component/configuration/object',
        NextBtnName: 'Configuration | Function',
        NextBtnPath: '/docs/core-component/configuration/function',
    },

    'core-component/configuration/function': {
        fullPath: '/docs/core-component/configuration/function',
        markdownPath: '/docs/core-component/configuration/function.md',
        PreBtnName: 'Configuration | Config File',
        PreBtnPath: '/docs/core-component/configuration/config-file',
        NextBtnName: 'Configuration | Interface',
        NextBtnPath: '/docs/core-component/configuration/interface-base',
    },

    'core-component/configuration/interface-base': {
        fullPath: '/docs/core-component/configuration/interface-base',
        markdownPath: '/docs/core-component/configuration/interface-base.md',
        PreBtnName: 'Configuration | Function',
        PreBtnPath: '/docs/core-component/configuration/function',
        NextBtnName: 'Configuration | Adapter',
        NextBtnPath: '/docs/core-component/configuration/adapter',
    },

    'core-component/configuration/adapter': {
        fullPath: '/docs/core-component/configuration/adapter',
        markdownPath: '/docs/core-component/configuration/adapter.md',
        PreBtnName: 'Configuration | Interface',
        PreBtnPath: '/docs/core-component/configuration/interface-base',
        NextBtnName: 'Core Component | Log',
        NextBtnPath: '/docs/core-component/log',
    },

    'core-component/log': {
        fullPath: '/docs/core-component/log',
        markdownPath: '/docs/core-component/log/overview.md',
        PreBtnName: 'Configuration | Adapter',
        PreBtnPath: '/docs/core-component/configuration/adapter',
        NextBtnName: 'Core Component | Command',
        NextBtnPath: '/docs/core-component/command',
    },

    'core-component/log/config': {
        fullPath: '/docs/core-component/log/config',
        markdownPath: '/docs/core-component/log/config.md',
        PreBtnName: 'Core Component | Log',
        PreBtnPath: '/docs/core-component/log',
        NextBtnName: 'Log | Level',
        NextBtnPath: '/docs/core-component/log/level',
    },

    'core-component/log/level': {
        fullPath: '/docs/core-component/log/level',
        markdownPath: '/docs/core-component/log/level.md',
        PreBtnName: 'Log | Config',
        PreBtnPath: '/docs/core-component/log/config',
        NextBtnName: 'Log | Path',
        NextBtnPath: '/docs/core-component/log/path',
    },

    'core-component/log/path': {
        fullPath: '/docs/core-component/log/path',
        markdownPath: '/docs/core-component/log/path.md',
        PreBtnName: 'Log | Level',
        PreBtnPath: '/docs/core-component/log/level',
        NextBtnName: 'Log | Chain Operation',
        NextBtnPath: '/docs/core-component/log/chain-opts',
    },

    'core-component/log/chain-opts': {
        fullPath: '/docs/core-component/log/chain-opts',
        markdownPath: '/docs/core-component/log/chain-opts.md',
        PreBtnName: 'Log | Path',
        PreBtnPath: '/docs/core-component/log/path',
        NextBtnName: 'Log | Color Print',
        NextBtnPath: '/docs/core-component/log/color-print',
    },

    'core-component/log/color-print': {
        fullPath: '/docs/core-component/log/color-print',
        markdownPath: '/docs/core-component/log/color-print.md',
        PreBtnName: 'Log | Chain Operation',
        PreBtnPath: '/docs/core-component/log/chain-opts',
        NextBtnName: 'Log | Context',
        NextBtnPath: '/docs/core-component/log/context',
    },

    'core-component/log/context': {
        fullPath: '/docs/core-component/log/context',
        markdownPath: '/docs/core-component/log/context.md',
        PreBtnName: 'Log | Color Print',
        PreBtnPath: '/docs/core-component/log/color-print',
        NextBtnName: 'Log | Handler',
        NextBtnPath: '/docs/core-component/log/handler',
    },

    'core-component/log/handler': {
        fullPath: '/docs/core-component/log/handler',
        markdownPath: '/docs/core-component/log/handler.md',
        PreBtnName: 'Log | Context',
        PreBtnPath: '/docs/core-component/log/context',
        NextBtnName: 'Log | JSON Format',
        NextBtnPath: '/docs/core-component/log/json-format',
    },

    'core-component/log/json-format': {
        fullPath: '/docs/core-component/log/json-format',
        markdownPath: '/docs/core-component/log/json-format.md',
        PreBtnName: 'Log | Handler',
        PreBtnPath: '/docs/core-component/log/handler',
        NextBtnName: 'Log | Async',
        NextBtnPath: '/docs/core-component/log/async',
    },

    'core-component/log/async': {
        fullPath: '/docs/core-component/log/async',
        markdownPath: '/docs/core-component/log/async.md',
        PreBtnName: 'Log | JSON Format',
        PreBtnPath: '/docs/core-component/log/json-format',
        NextBtnName: 'Log | Stack Print',
        NextBtnPath: '/docs/core-component/log/stack-print',
    },
    'core-component/log/stack-print': {
        fullPath: '/docs/core-component/log/stack-print',
        markdownPath: '/docs/core-component/log/stack-print.md',
        PreBtnName: 'Log | Async',
        PreBtnPath: '/docs/core-component/log/async',
        NextBtnName: 'Log | Debug Info',
        NextBtnPath: '/docs/core-component/log/debug-info',
    },

    'core-component/log/debug-info': {
        fullPath: '/docs/core-component/log/debug-info',
        markdownPath: '/docs/core-component/log/debug-info.md',
        PreBtnName: 'Log | Stack Print',
        PreBtnPath: '/docs/core-component/log/stack-print',
        NextBtnName: 'Log | Writer',
        NextBtnPath: '/docs/core-component/log/writer',
    },

    'core-component/log/writer': {
        fullPath: '/docs/core-component/log/writer',
        markdownPath: '/docs/core-component/log/writer.md',
        PreBtnName: 'Log | Debug Info',
        PreBtnPath: '/docs/core-component/log/debug-info',
        NextBtnName: 'Log | Flags',
        NextBtnPath: '/docs/core-component/log/flags',
    },

    'core-component/log/flags': {
        fullPath: '/docs/core-component/log/flags',
        markdownPath: '/docs/core-component/log/flags.md',
        PreBtnName: 'Log | Writer',
        PreBtnPath: '/docs/core-component/log/writer',
        NextBtnName: 'Log | Rotate',
        NextBtnPath: '/docs/core-component/log/rotate',
    },

    'core-component/log/rotate': {
        fullPath: '/docs/core-component/log/rotate',
        markdownPath: '/docs/core-component/log/rotate.md',
        PreBtnName: 'Log | Flags',
        PreBtnPath: '/docs/core-component/log/flags',
        NextBtnName: 'Log | FAQ',
        NextBtnPath: '/docs/core-component/log/faq',
    },

    'core-component/log/faq': {
        fullPath: '/docs/core-component/log/faq',
        markdownPath: '/docs/core-component/log/faq.md',
        PreBtnName: 'Log | Rotate',
        PreBtnPath: '/docs/core-component/log/rotate',
        NextBtnName: 'Core Component | Error',
        NextBtnPath: '/docs/core-component/error',
    },

    'core-component/error': {
        fullPath: '/docs/core-component/error',
        markdownPath: '/docs/core-component/error/overview.md',
        PreBtnName: 'Log | FAQ',
        PreBtnPath: '/docs/core-component/log/faq',
        NextBtnName: 'Error | Function',
        NextBtnPath: '/docs/core-component/error/function',
    },

    'core-component/error/function': {
        fullPath: '/docs/core-component/error/function',
        markdownPath: '/docs/core-component/error/function.md',
        PreBtnName: 'Core Component | Error',
        PreBtnPath: '/docs/core-component/error',
        NextBtnName: 'Error | Stack',
        NextBtnPath: '/docs/core-component/error/stack',
    },

    'core-component/error/compare': {
        fullPath: '/docs/core-component/error/compare',
        markdownPath: '/docs/core-component/error/compare.md',
        PreBtnName: 'Error | Function',
        PreBtnPath: '/docs/core-component/error/function',
        NextBtnName: 'Error | Code',
        NextBtnPath: '/docs/core-component/error/code',
    },

    'core-component/error/stack': {
        fullPath: '/docs/core-component/error/stack',
        markdownPath: '/docs/core-component/error/stack.md',
        PreBtnName: 'Error | Compare',
        PreBtnPath: '/docs/core-component/error/compare',
        NextBtnName: 'Error | Code',
        NextBtnPath: '/docs/core-component/error/code',
    },

    'core-component/error/code': {
        fullPath: '/docs/core-component/error/code',
        markdownPath: '/docs/core-component/error/code.md',
        PreBtnName: 'Error | Stack',
        PreBtnPath: '/docs/core-component/error/stack',
        NextBtnName: 'Error | Others',
        NextBtnPath: '/docs/core-component/error/others',
    },

    'core-component/error/others': {
        fullPath: '/docs/core-component/error/others',
        markdownPath: '/docs/core-component/error/others.md',
        PreBtnName: 'Error | Code',
        PreBtnPath: '/docs/core-component/error/code',
        NextBtnName: 'Error | Best Practices',
        NextBtnPath: '/docs/core-component/error/best-practices',
    },

    'core-component/error/best-practices': {
        fullPath: '/docs/core-component/error/best-practices',
        markdownPath: '/docs/core-component/error/best-practices.md',
        PreBtnName: 'Error | Others',
        PreBtnPath: '/docs/core-component/error/others',
        NextBtnName: 'Error | Banchmark',
        NextBtnPath: '/docs/core-component/error/benchmark',
    },

    'core-component/error/benchmark': {
        fullPath: '/docs/core-component/error/benchmark',
        markdownPath: '/docs/core-component/error/benchmark.md',
        PreBtnName: 'Error | Best Practices',
        PreBtnPath: '/docs/core-component/error/best-practices',
        NextBtnName: 'Core Component | Data Validation',
        NextBtnPath: '/docs/core-component/data-valid',
    },

    'core-component/data-valid': {
        fullPath: '/docs/core-component/data-valid',
        markdownPath: '/docs/core-component/data-valid/overview.md',
        PreBtnName: 'Error | Banchmark',
        PreBtnPath: '/docs/core-component/error/benchmark',
        NextBtnName: 'Data Validation | Rule',
        NextBtnPath: '/docs/core-component/data-valid/rule',
    },

    'core-component/data-valid/rule': {
        fullPath: '/docs/core-component/data-valid/rule',
        markdownPath: '/docs/core-component/data-valid/rule.md',
        PreBtnName: 'Data Validation | Overview',
        PreBtnPath: '/docs/core-component/data-valid/',
        NextBtnName: 'Data Validation | Object',
        NextBtnPath: '/docs/core-component/data-valid/object',
    },

    'framework-design': {
        fullPath: '/docs/framework-design',
        markdownPath: '/docs/framework-design/module-design.md',
        NextBtnName: 'Module Design',
        NextBtnPath: '/docs/framework-design/module-design',
    },

    'framework-design/module-design': {
        fullPath: '/docs/framework-design/module-design',
        markdownPath: '/docs/framework-design/module-design.md',
        PreBtnName: 'Framework Design',
        PreBtnPath: '/docs/framework-design/',
        NextBtnName: 'Unified Framework Design',
        NextBtnPath: '/docs/framework-design/unified-framework-design',
    },

    'framework-design/unified-framework-design': {
        fullPath: '/docs/framework-design/unified-framework-design',
        markdownPath: '/docs/framework-design/unified-framework-design.md',
        PreBtnName: 'Module Design',
        PreBtnPath: '/docs/framework-design/module-design',
        NextBtnName: 'Project Package Design',
        NextBtnPath: '/docs/framework-design/project-package-design',
    },

    'framework-design/project-package-design': {
        fullPath: '/docs/framework-design/project-package-design',
        markdownPath: '/docs/framework-design/project-package-design.md',
        PreBtnName: 'Unified Framework Design',
        PreBtnPath: '/docs/framework-design/unified-framework-design',
        NextBtnName: 'Dao Design',
        NextBtnPath: '/docs/framework-design/dao-design',
    },

    'framework-design/dao-design': {
        fullPath: '/docs/framework-design/dao-design',
        markdownPath: '/docs/framework-design/dao-design.md',
        PreBtnName: 'Project Package Design',
        PreBtnPath: '/docs/framework-design/project-package-design',
        NextBtnName: 'constructure Design',
        NextBtnPath: '/docs/framework-design/constructure-design',
    },

    'framework-design/constructure-design': {
        fullPath: '/docs/framework-design/constructure-design',
        markdownPath: '/docs/framework-design/constructure-design.md',
        PreBtnName: 'Dao Design',
        PreBtnPath: '/docs/framework-design/dao-design',
        NextBtnName: 'Data&Bz model',
        NextBtnPath: '/docs/framework-design/data-bz-model',
    },

    'framework-design/data-bz-model': {
        fullPath: '/docs/framework-design/data-bz-model',
        markdownPath: '/docs/framework-design/data-bz-model.md',
        PreBtnName: 'constructure Design',
        PreBtnPath: '/docs/framework-design/constructure-design',
        NextBtnName: 'Microservice',
        NextBtnPath: '/docs/framework-design/microservice',
    },

    'framework-design/microservice': {
        fullPath: '/docs/framework-design/microservice',
        markdownPath: '/docs/framework-design/microservice.md',
        PreBtnName: 'Data&Bz model',
        PreBtnPath: '/docs/framework-design/data-bz-model',
        NextBtnName: 'Tracing Design',
        NextBtnPath: '/docs/framework-design/tracing-design',
    },

    'framework-design/tracing-design': {
        fullPath: '/docs/framework-design/tracing-design',
        markdownPath: '/docs/framework-design/tracing-design.md',
        PreBtnName: 'Microservice',
        PreBtnPath: '/docs/framework-design/microservice',
        NextBtnName: 'Error Design',
        NextBtnPath: '/docs/framework-design/error-design',
    },

    'framework-design/error-design': {
        fullPath: '/docs/framework-design/error-design',
        markdownPath: '/docs/framework-design/error-design.md',
        PreBtnName: 'Tracing Design',
        PreBtnPath: '/docs/framework-design/tracing-design',
        NextBtnName: 'Interface&Generic',
        NextBtnPath: '/docs/framework-design/interface-generic-design',
    },

    'framework-design/interface-generic-design': {
        fullPath: '/docs/framework-design/interface-generic-design',
        markdownPath: '/docs/framework-design/interface-generic-design.md',
        PreBtnName: 'Error Design',
        PreBtnPath: '/docs/framework-design/error-design',
        NextBtnName: 'Implict&Explicit',
        NextBtnPath: '/docs/framework-design/implict-explicit-init',
    },

    'framework-design/implict-explicit-init': {
        fullPath: '/docs/framework-design/implict-explicit-init',
        markdownPath: '/docs/framework-design/implict-explicit-init.md',
        PreBtnName: 'Interface&Generic',
        PreBtnPath: '/docs/framework-design/interface-generic-design',
        NextBtnName: 'Context',
        NextBtnPath: '/docs/framework-design/context-design',
    },

    'framework-design/context-design': {
        fullPath: '/docs/framework-design/context-design',
        markdownPath: '/docs/framework-design/context-design.md',
        PreBtnName: 'Implict&Explicit',
        PreBtnPath: '/docs/framework-design/implict-explicit-init',
        NextBtnName: 'Enum',
        NextBtnPath: '/docs/framework-design/enum-management',
    },

    'framework-design/enum-management': {
        fullPath: '/docs/framework-design/enum-management',
        markdownPath: '/docs/framework-design/enum-management.md',
        PreBtnName: 'Context',
        PreBtnPath: '/docs/framework-design/context-design',
    },
}
