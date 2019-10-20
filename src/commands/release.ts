import {Command, flags} from '@oclif/command'
import * as inquirer from 'inquirer'

import {EPIC_BRANCH_PREFIX, RELEASE_BRANCH_PREFIX} from '../utils/constants'
import {getEpicBranches, release} from '../utils/shared'

export default class Release extends Command {
  static description = 'Release an epic to a test environment'

  static examples = [
    '$ tflow release develop',
  ]

  static flags = {
    help: flags.help({char: 'h'}),
    epic: flags.string({char: 'e', description: 'The name of the epic to release (will be prompted if left out)'}),
    version: flags.string({char: 'v', description: 'The version to release (will be prompted if left out)'}),
  }

  static args = [{name: 'branch'}]

  async run() {
    const {args, flags} = this.parse(Release)

    if (!args.branch) {
      this.log('branch is a required argument')
      return
    }

    let {epic, version} = flags

    if (!epic) {
      const epicBranches = await getEpicBranches()
      if (!epicBranches || epicBranches.length === 0) {
        this.log('No epic branches found in remote. Did you push your changes using "$ tflow feat finish"?')
        return
      }

      const epicBranchResponse: any = await inquirer.prompt([{
        name: 'name',
        message: 'select an epic branch to release:',
        type: 'list',
        choices: epicBranches,
      }])

      epic = epicBranchResponse.name
    }

    if (!epic) {
      this.log('Epic branch not found')
      return
    }

    const epicName = epic.split('/')[1]

    if (!version) {
      const versionResponse: any = await inquirer.prompt([{
        name: 'version',
        message: 'How to name this release?',
        default: '1.0',
        type: 'input',
        validation: (id: string) => id.match(/^[0-9a-zA-Z-]+$/) ? true : false
      }])
      version = versionResponse.version
    }

    if (!version) {
      this.log('Version is undefined')
      return
    }

    const newBranchName = `${args.branch}-${RELEASE_BRANCH_PREFIX}/${EPIC_BRANCH_PREFIX}/${epicName}-${version}`

    return release(`title=${epicName}:+Release+${version}+to+${args.branch}`, epic, newBranchName, args.branch, this.log)
  }
}
