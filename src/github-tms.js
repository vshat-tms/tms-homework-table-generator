import { Octokit } from "octokit";
import { getStudentsDataNicknames } from "./students.js"
import * as fs from 'fs';

const CACHE_FILE = 'cache/cache.json';
const OCTOKIT = new Octokit({ auth: process.env.GITHUB_ACCESS_TOKEN });
const COMMITER = {
    name: 'TMS bot',
    email: 'vadym.shatokhin+tms@gmail.com',
}
const OWNER = 'vshat-tms'

export async function sayHello() {
    const {
        data: { login },
    } = await OCTOKIT.rest.users.getAuthenticated();
    console.log("Hello, %s", login);
}

export async function overwriteGithubFile(repo, path, message, text) {
    let res = await OCTOKIT.rest.repos.getContent({
        owner: OWNER,
        repo,
        path,
    })
    const sha = res.data.sha
    const contentEncoded = Buffer.from(text).toString('base64')
    await OCTOKIT.rest.repos.createOrUpdateFileContents({
        owner: OWNER,
        repo,
        path,
        message,
        content: contentEncoded,
        committer: COMMITER,
        author: COMMITER,
        sha
    });
}

export async function listPulls(repo) {
    const pulls = await OCTOKIT.paginate(OCTOKIT.rest.pulls.list, {
        owner: OWNER,
        repo,
        state: 'all',
        per_page: 100
    })

    return pulls.map(p => ({
        number: p.number,
        title: p.title,
        user: p.user.login,
        state: p.state,
        html_url: p.html_url,
    }))

}

export async function getEvents(repo, issueNumber) {
    const events = await OCTOKIT.paginate(OCTOKIT.rest.issues.listEvents, {
        owner: OWNER,
        repo,
        issue_number: issueNumber,
        per_page: 100
    })
    return events.map(e => ({
        actor: e.actor.login,
        event: e.event,
        created_at: e.created_at
    }))
}

async function getHomeworkStatusInternal(repo) {
    const allNicknames = getStudentsDataNicknames()
    const results = {}
    allNicknames.forEach(n => results[n] = { status: 'unknown' })

    const pulls = await listPulls(repo)

    pulls.forEach(p => {
        results[p.user] = {
            status: 'pending',
            pull_url: p.html_url
        }
    })

    const closedPulls = pulls.filter(p => p.state == 'closed')

    for (const pull of closedPulls) {
        const events = await getEvents(repo, pull.number)

        const closedByMe = events.find(e => e.actor === 'vshat-tms' && e.event === 'closed') !== undefined

        if (closedByMe) {
            results[pull.user]['status'] = 'accepted'
        }
    }

    return results
}

export async function getHomeworkStatus(repo, options) {
    options = options || {}
    const useCache = options.cache || options.cache === undefined;

    let cache = {}
    if (useCache && fs.existsSync(CACHE_FILE)) {
        cache = JSON.parse(fs.readFileSync(CACHE_FILE));
        if(cache[repo]) return cache[repo]
    }

    console.log('Collecting homework data from github repo: ' + repo)
    const status = await getHomeworkStatusInternal(repo)

    cache[repo] = status
    fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 4));

    return status
}
