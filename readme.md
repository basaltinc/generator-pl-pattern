# Pattern Lab pattern Yeoman Generator

[![Greenkeeper badge](https://badges.greenkeeper.io/basaltinc/generator-pl-pattern.svg)](https://greenkeeper.io/)

Running this asks a few questions about your Front End component that uses BEM naming scheme and used in Pattern Lab, then generates the front end files needed: scss, twig, etc.

## Installation

```
npm i -g yo generator-pl-pattern
```

## Usage

```
yo pl-pattern
```

Either `cd` into `pattern-lab/source/_patterns/` before running, or use the flag below to pick the base directory.

### Options

The command can be ran with these flags to change options:

- `--base path/to/source/_patterns/` - Set the base path. This will list folders inside to suggest as places where components will be scaffolded. 
