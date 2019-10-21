import * as simplegit from 'simple-git/promise'

import {
  DEFAULT_REMOTE,
  EPIC_BRANCH_PREFIX,
} from './constants'

const open = require('open')

const git = simplegit()
const epicBranchRegex = `^\\*?\\s*(remotes\\/origin\\/)?${EPIC_BRANCH_PREFIX}\\/[^\\/]+$`

export const getEpicBranches = async (includeLocal = false) => {
  await git.fetch()
  const options = []
  if (includeLocal) {
    options.push('all')
  }
  const branches = await git.branch(options)
  const epicBranches = branches.all.filter(branch => branch.match(new RegExp(epicBranchRegex)))
  const cleanBranches = epicBranches.map((branch: string) => branch.replace(/^\*?\s*(remotes\/origin\/)?/, ''))
  return cleanBranches
}

export const getRemote = async () => {
  const remoteResponse = await git.remote(['-v']) || ''
  const remoteRegex = `^${DEFAULT_REMOTE}\\t*\\s*(.*)\\s\\(push\\)$`
  const remoteRegexGroups = remoteResponse.match(new RegExp(remoteRegex, 'm'))
  if (remoteRegexGroups && remoteRegexGroups.length > 0) {
    return remoteRegexGroups[1]
  }
}

export const release = async (releaseTitle: string, sourceBranch: string, interBranch: string, destBranch: string, log: any) => {
  log(`Releasing ${sourceBranch} to ${destBranch}...`)
  await git.checkoutBranch(interBranch, sourceBranch)
  log(`Pushing changes to ${interBranch}`)
  await git.push(DEFAULT_REMOTE, interBranch, {'--set-upstream': null})
  log(`Pulling changes from ${destBranch}. Remember to check for conflicts afterwards...`)
  const options: any = {}
  await git.pull(DEFAULT_REMOTE, destBranch, options)
  log('Creating pull request...')
  const remote = await getRemote()
  if (!remote) {
    log(`Could not find a valid remote at ${DEFAULT_REMOTE}`)
    return
  }
  await open(`${remote}/compare/${destBranch}...${interBranch}?quick_pull=1&${releaseTitle}&labels=release`)
}
