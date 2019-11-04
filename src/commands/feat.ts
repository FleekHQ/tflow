import {Command, flags} from '@oclif/command'
import * as inquirer from 'inquirer'
import * as simplegit from 'simple-git/promise'

const open = require('open')

import {
  DEFAULT_REMOTE,
  EPIC_BRANCH_PREFIX,
  FEATURE_BRANCH_PREFIX,
  KANBAN_URL,
  MASTER_BRANCH,
} from '../utils/constants'

import {getEpicBranches, getRemote} from '../utils/shared'

const git = simplegit()

const genEpicBranchName = (name: string) => `${EPIC_BRANCH_PREFIX}/${name}`


export default class Feat extends Command {
  static description = 'Start or finish a feature by branching from an epic branch'

  static examples = [
    '$ tflow feat start: Create a new feature.',
    '$ tflow feat finish: Finishes the feature and creates a PR towards the epic branch.',
  ]

  static flags = {
    help: flags.help({char: 'h'}),
    // flag with a value (-n, --name=VALUE)
    create: flags.boolean({char: 'c', description: 'force creation of an epic branch'})
  }

  static args = [{name: 'subcommand'}]

  async start() {
    const {flags} = this.parse(Feat)

    let epicName = ''

    const epicBranches = await getEpicBranches()

    if (flags.create || !epicBranches || epicBranches.length === 0) {
      let epicBranchResponse: any
      if (!flags.create) {
        epicBranchResponse = await inquirer.prompt([{
          name: 'create',
          message: 'No epic branches detected. Create one?',
          type: 'confirm',
          default: true,
        }])

        if (!epicBranchResponse.create) {
          this.log(`an epic branch (in the form of ${genEpicBranchName('[EPIC_NAME]')} is required to continue.`)
          return
        }
      }


      epicBranchResponse = await inquirer.prompt([{
        name: 'name',
        message: 'Choose a name for the epic branch ([a-z0-9-]+)',
        type: 'input',
        validate: name => name.match(/^[a-z0-9-]+$/) ? true : false
      }])
      epicName = `${epicBranchResponse.name}`
      this.log('Creating new epic branch...')
      await git.checkoutBranch(genEpicBranchName(epicName), MASTER_BRANCH)
      this.log(`Pulling ${MASTER_BRANCH} changes...`)
      await git.pull(DEFAULT_REMOTE, MASTER_BRANCH)
      this.log('Pushing the new branch...')
      await git.push(DEFAULT_REMOTE, genEpicBranchName(epicName), {'--set-upstream': null})
    } else {
      const epicBranchResponse: any = await inquirer.prompt([{
        name: 'name',
        message: 'select an epic branch to use:',
        type: 'list',
        choices: epicBranches,
      }])
      epicName = epicBranchResponse.name.split('/')[1]
      await git.checkout(genEpicBranchName(epicName))
      await git.pull(DEFAULT_REMOTE, genEpicBranchName(epicName))

    }

    const branchResponse: any = await inquirer.prompt([{
      name: 'id',
      message: "What's the id of your task or feature? ([0-9a-zA-Z]+)",
      type: 'input',
      validate: (id: string) => id.match(/^[0-9a-zA-Z]+$/) ? true : false
    }, {
      name: 'name',
      message: 'Write a short name for your task or feature ([0-9a-zA-Z-]+)',
      type: 'input',
      validate: (name: string) => name.match(/^[0-9a-zA-Z-]+$/) ? true : false
    }])

    const newBranchName = `${FEATURE_BRANCH_PREFIX}/${epicName}/ch${branchResponse.id}/${branchResponse.name}`

    await git.checkoutBranch(newBranchName, genEpicBranchName(epicName))
    this.log(`Created branch ${newBranchName} from ${genEpicBranchName(epicName)}`)
    this.log('You are ready to start coding the feature.')
    this.log('Once you are done, commit your changes and run "$ tflow feat finish"')

  }

  async finish() {
    const localBranches = await git.branchLocal()
    const currBranch = localBranches.current
    const [branchType, epicName, taskId, featName] = currBranch.split('/')
    const epicBranch = `${EPIC_BRANCH_PREFIX}/${epicName}`
    if (!featName || branchType !== FEATURE_BRANCH_PREFIX) {
      this.log(`Please checkout a feature branch. A feature branch has the following shape: ${FEATURE_BRANCH_PREFIX}/[EPIC_NAME]/[FEATURE_ID]/[FEATURE_NAME]`)
      return
    }

    const readyResponse = await inquirer.prompt([{
      name: 'ready',
      message: `Push commits and create a PR for ${featName}?`,
      type: 'confirm',
      default: true,
    }])

    const remote = await getRemote()
    if (!remote) {
      this.log(`Could not find a valid remote at ${DEFAULT_REMOTE}`)
      return
    }

    if (readyResponse.ready) {
      await git.push(DEFAULT_REMOTE, currBranch, {'--set-upstream': null})
      await open(`${remote}/compare/${epicBranch}...${currBranch}?quick_pull=1&title=${epicName}:+${featName}&body=${KANBAN_URL}/${taskId}&labels=feature`)
    }

    this.log('If you want to release your changes, run "$ tflow release [DEST_BRANCH_NAME]". e.g "$ tflow release develop"')
  }

  async run() {
    const {args} = this.parse(Feat)

    switch (args.subcommand) {
    case 'start':
      return this.start()
    case 'finish':
      return this.finish()
    default:
      return this._help()
    }
  }
}
