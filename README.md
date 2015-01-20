duo-typescript
============================

typescript compiler plugin for duo

# Overview #

duo-typescript uses version 1.4 of the typescript compiler

# API #

duoTypescript(options);

options:

Name       		   | Description											| Default
-------------------|--------------------------------------------------------|-----------
declaration	       | generate an external declaration file                  | true
gulpMode           | use gulp-style logging									| false
noImplicitAny      | typescript compiler option 							| false
target			   | typescript compiler option								| es5

# component.json #

## exported declarations ##
declaration files are generated for local components and components which have been linked using
`component link`

you can specify the location of the generated external definition file like this:

```
{
    "name" : "component-builder-typescript-example",
    "typescript" : {
        "definition": "exports/component-builder-typescript-example.d.ts"
    },
    "dependencies" : {
        "component/jsdomify": "1.3"
    },
    "main" : "example/example.ts",
    "scripts" : [
        "exports/component-builder-typescript-example.d.ts",
        "example/_dependencies.d.ts",
        "example/example.ts",
        "example/example-types.d.ts"  
    ]
}
```

# Credits #

Greg Smith [Tsify](https://github.com/smrq/tsify)
Bart van der Schoor [dts-bundle](https://github.com/TypeStrong/dts-bundle)

