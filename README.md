tflow
=====

Git-flow adapted by Terminal

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/tflow.svg)](https://npmjs.org/package/tflow)
[![Downloads/week](https://img.shields.io/npm/dw/tflow.svg)](https://npmjs.org/package/tflow)
[![License](https://img.shields.io/npm/l/tflow.svg)](https://github.com/Terminal-Systems/tflow/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g tflow
$ tflow COMMAND
running command...
$ tflow (-v|--version|version)
tflow/0.0.1 darwin-x64 node-v10.16.3
$ tflow --help [COMMAND]
USAGE
  $ tflow COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`tflow feat [SUBCOMMAND]`](#tflow-feat-subcommand)
* [`tflow release [DESTINATION_BRANCH]`](#tflow-release-destination_branch)
* [`tflow hotfix [HOTFIX]`](#tflow-hotfix-subcommand)
* [`tflow help [COMMAND]`](#tflow-help-command)

## `tflow feat [SUBCOMMAND]`

Start or finish a feature by branching from an epic branch

```
USAGE
  $ tflow feat [SUBCOMMAND]

OPTIONS
  -c, --create     forces creation of an epic branch instead of choosing an existing one
  -h, --help       show CLI help
```

_See code: [src/commands/feat.ts](https://github.com/Terminal-Systems/tflow/blob/v0.0.1/src/commands/feat.ts)_

## `tflow release [DESTINATION_BRANCH]`

Merge an epic to develop or master

```
USAGE
  $ tflow release [DESTINATION_BRANCH]

OPTIONS
  -h, --help       show CLI help
  -e, --epic       The name of the epic to release (will be prompted if left out)
  -v, --version    The version to release (will be prompted if left out)
```

_See code: [src/commands/release.ts](https://github.com/Terminal-Systems/tflow/blob/v0.0.1/src/commands/release.ts)_

## `tflow hotfix [SUBCOMMAND]`

Start or finish a hotfix. A hotfix goes directly into all non-production environments

```
USAGE
  $ tflow hotfix [SUBCOMMAND]

OPTIONS
  -h, --help       show CLI help
```

_See code: [src/commands/hotfix.ts](https://github.com/Terminal-Systems/tflow/blob/v0.0.1/src/commands/hotfix.ts)_

## `tflow help [COMMAND]`

display help for tflow

```
USAGE
  $ tflow help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v2.2.1/src/commands/help.ts)_
<!-- commandsstop -->
