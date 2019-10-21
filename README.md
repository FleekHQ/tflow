tflow
=====

Git-flow adapted for Terminal repos

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/tflow.svg)](https://npmjs.org/package/tflow)
[![Downloads/week](https://img.shields.io/npm/dw/tflow.svg)](https://npmjs.org/package/tflow)
[![License](https://img.shields.io/npm/l/tflow.svg)](https://github.com/Terminal-Systems/tflow/blob/master/package.json)

![alt text](https://storage.googleapis.com/terminal-ci/docs/tflow-preview.gif "Preview")

<!-- toc -->
* [Usage](#usage)
* [Terminal Git Flow](#terminal-git-flow)
* [Commands](#commands)
<!-- tocstop -->

# Usage
<!-- usage -->
```sh-session
$ npm install -g terminal-flow
$ tflow COMMAND
running command...
$ tflow (-v|--version|version)
terminal-flow/0.0.3 darwin-x64 node-v10.16.3
$ tflow --help [COMMAND]
USAGE
  $ tflow COMMAND
...
```
<!-- usagestop -->

# Terminal Git Flow

We have flows for features and hotfixes. `tflow` automates the process of creating and merging these into our environments.

## Environments rules

We have production (mapped to the `production` branch), staging (mapped to `master` branch) and `development` (mapped to `develop` branch).

Staging must branch off from production. Develop is free from staging/production and can be broken at times.

When an epic is finished and tested in develop, it must wait in its epic branch until we are ready to release it into production. When the time comes, the epic is merged into staging, tested and it's either reverted or released.

No commit goes directly into production unless its an emergency. The idea is that staging mirrors production all the time, so that new epics behave exactly the same way in staging and production.

## Features

Features are created from an epic branch, which groups many features that compose an epic.

1. Create a feature (`tflow feat start`, `git commit ...`, `tflow feat finish`)

2. Release a feature to develop (`tflow release develop`)

3. Release a feature to staging (`tflow release master`). **Don't do this until its ready to be released to production!**

![alt text](https://storage.googleapis.com/terminal-ci/docs/Branch%20feature%20flow.png "Feature flow")

## Hotfixes

![alt text](https://storage.googleapis.com/terminal-ci/docs/Branch%20hotfix%20flow.png "Hotfix flow")

1. Create the hotfix (`tflow hotfix start`)

2. Release the hotfix to all envs (`tflow hotfix finish`)

# Commands
<!-- commands -->
* [`tflow feat [SUBCOMMAND]`](#tflow-feat-subcommand)
* [`tflow help [COMMAND]`](#tflow-help-command)
* [`tflow hotfix [SUBCOMMAND]`](#tflow-hotfix-subcommand)
* [`tflow release [BRANCH]`](#tflow-release-branch)

## `tflow feat [SUBCOMMAND]`

Start or finish a feature by branching from an epic branch

```
USAGE
  $ tflow feat [SUBCOMMAND]

OPTIONS
  -c, --create  force creation of an epic branch
  -h, --help    show CLI help

EXAMPLES
  $ tflow feat start: Create a new feature.
  $ tflow feat finish: Finishes the feature and creates a PR towards the epic branch.
```

_See code: [src/commands/feat.ts](https://github.com/Terminal-Systems/tflow/blob/v0.0.3/src/commands/feat.ts)_

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

## `tflow hotfix [SUBCOMMAND]`

Start or finish a hotfix. A hotfix goes directly into all non-production environments

```
USAGE
  $ tflow hotfix [SUBCOMMAND]

OPTIONS
  -h, --help  show CLI help

EXAMPLES
  $ tflow hotfix start: Create a new hotfix branch.
  $ tflow hotfix finish: Finishes the hotfix and creates a PR towards dev and staging
```

_See code: [src/commands/hotfix.ts](https://github.com/Terminal-Systems/tflow/blob/v0.0.3/src/commands/hotfix.ts)_

## `tflow release [BRANCH]`

Release an epic to a test environment

```
USAGE
  $ tflow release [BRANCH]

OPTIONS
  -e, --epic=epic        The name of the epic to release (will be prompted if left out)
  -h, --help             show CLI help
  -v, --version=version  The version to release (will be prompted if left out)

EXAMPLE
  $ tflow release develop
```

_See code: [src/commands/release.ts](https://github.com/Terminal-Systems/tflow/blob/v0.0.3/src/commands/release.ts)_
<!-- commandsstop -->
