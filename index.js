const core = require('@actions/core');
const {IncomingWebhook} = require('@slack/webhook');

const webhookUrl = core.getInput('webhook', {required: true});
const webhook = new IncomingWebhook(webhookUrl);

const status = core.getInput('status');

// 1. message text
let text = core.getInput('text');
if (text === '') {
	if (status === 'success') {
		text = ':rocket| Action ran successfully.';
	} else if (status === 'failure') {
		text = ':x: Action failed.';
	} else if (status === 'cancelled') {
		text = ':heavy_multiplication_x: Step was cancelled.';
	} else {
		core.warning('cannot create message: got an invalid status string');
	}
}

// 2. attachments color
let color = core.getInput('color');
if (color === '') {
	if (status === 'success') {
		color = 'good';
	} else if (status === 'failure') {
		color = 'danger';
	} else if (status === 'cancelled') {
		color = '#808080';
	} else {
		core.warning('assigning default color: got an invalid status string');
		color = 'good';
	}
}

// 3. build message
const actor = process.env.GITHUB_ACTOR;
const server = process.env.GITHUB_SERVER_URL;
const repo = process.env.GITHUB_REPOSITORY;
const runId = process.env.GITHUB_RUN_ID;
const workflow = process.env.GITHUB_WORKFLOW;
const commitSha = process.env.GITHUB_SHA;

const commitShaShort = commitSha.slice(0, 7);

const fields = [
	{
		title: 'Ref',
		value: process.env.GITHUB_REF,
		short: true,
	},
	{
		title: 'Event',
		value: process.env.GITHUB_EVENT,
		short: true,
	},
	{
		title: 'Actions URL',
		value: '<' + server + '/' + repo + '/actions/runs/' + runId + '|' + workflow + '>',
		short: true,
	},
	{
		title: 'Commit',
		value: '<' + server + '/' + repo + '/commit/' + commitSha + '|' + commitShaShort + '>',
		short: true,
	},
];

const customFields = JSON.parse(core.getInput('custom_fields'));

const message = {
	username: core.getInput('username'),
	icon_url: core.getInput('icon_url'),
	icon_emoji: core.getInput('icon_emoji'),
	text: text,
	attachments: [{
		color: color,
		author_name: actor,
		author_link: server + '/' + actor,
		author_icon: server + '/' + actor + '.png?size=32',
		fields: fields.concat(customFields),
	}],
};

// 4. send message
(async () => {
	await webhook.send(message);
})();
