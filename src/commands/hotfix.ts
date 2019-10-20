import {Command, flags} from '@oclif/command'
import * as inquirer from 'inquirer'
import * as simplegit from 'simple-git/promise'

import {
  DEFAULT_REMOTE,
  DEVELOP_BRANCH,
  EPIC_BRANCH_PREFIX,
  HOTFIX_BRANCH_PREFIX,
  KANBAN_URL,
  MASTER_BRANCH,
  RELEASE_BRANCH_PREFIX,
} from '../utils/constants'

import {release} from '../utils/shared'

const git = simplegit()

const genEpicBranchName = (name: string) => `${EPIC_BRANCH_PREFIX}/${name}`


export default class Hotfix extends Command {
  static description = 'Start or finish a hotfix. A hotfix goes directly into all non-production environments'

  static examples = [
    '$ tflow hotfix start: Create a new hotfix branch.',
    '$ tflow hotfix finish: Finishes the hotfix and creates a PR towards dev and staging'
  ]

  static flags = {
    help: flags.help({char: 'h'}),
  }

  static args = [{name: 'subcommand'}]

  async start() {
    const branchResponse: any = await inquirer.prompt([{
      name: 'id',
      message: "What's the id of your hotfix? ([0-9a-zA-Z]+)",
      type: 'input',
      validate: (id: string) => id.match(/^[0-9a-zA-Z]+$/) ? true : false
    }, {
      name: 'name',
      message: 'Write a short name for your hotfix ([0-9a-zA-Z]+)',
      type: 'input',
      validate: (name: string) => name.match(/^[0-9a-zA-Z]+$/) ? true : false
    }])

    const newBranchName = `${HOTFIX_BRANCH_PREFIX}/${branchResponse.id}-${branchResponse.name}`

    await git.checkoutBranch(newBranchName, MASTER_BRANCH)
    this.log(`Created branch ${newBranchName} from ${MASTER_BRANCH}. Pulling from origin...`)
    await git.pull(DEFAULT_REMOTE, MASTER_BRANCH)

    this.log('You are ready to start coding the hotfix.')
    this.log('Once you are done, commit your changes and run "tflow hotfix finish"')
  }

  async finish() {
    const localBranches = await git.branchLocal()
    const currBranch = localBranches.current
    const [branchType, hotfixName] = currBranch.split('/')

    if (!hotfixName || branchType !== HOTFIX_BRANCH_PREFIX) {
      this.log(`Please checkout a hotfix branch. A hotfix branch has the following shape: ${HOTFIX_BRANCH_PREFIX}/[HOTFIX_ID]-[HOTFIX_NAME]`)
      return
    }

    const readyResponse = await inquirer.prompt([{
      name: 'ready',
      message: `Push commits and create a PR for ${hotfixName}?`,
      type: 'confirm',
      default: true,
    }])

    if (readyResponse.ready) {
      await git.push(DEFAULT_REMOTE, currBranch, {'--set-upstream': null})
    }

    const taskId = hotfixName.split('-')[0]

    const masterRelease = `${MASTER_BRANCH}-${RELEASE_BRANCH_PREFIX}/${HOTFIX_BRANCH_PREFIX}/${hotfixName}`
    await release(`title=Hotfix:+${hotfixName}+release+to+${MASTER_BRANCH}&body=${KANBAN_URL}/${taskId}`, currBranch, masterRelease, MASTER_BRANCH, this.log)

    const devRelease = `${DEVELOP_BRANCH}-${RELEASE_BRANCH_PREFIX}/${HOTFIX_BRANCH_PREFIX}/${hotfixName}`
    await release(`title=Hotfix:+${hotfixName}+release+to+${DEVELOP_BRANCH}&body=${KANBAN_URL}/${taskId}`, currBranch, devRelease, DEVELOP_BRANCH, this.log)
  }

  async run() {
    const {args} = this.parse(Hotfix)

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
