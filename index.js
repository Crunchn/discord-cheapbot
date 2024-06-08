// Require the necessary discord.js classes
const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
const { token } = require('./config.json');
const { Tags } = require('./events/sqlite.js');
const { doTHINGS } = require('./events/csAPI.js');

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.commands = new Collection();
client.cooldowns = new Collection();

const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		// Set a new item in the Collection with the key as the command name and the value as the exported module
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

// Log in to Discord with your client's token
client.login(token);

async function executejs(file, ...args) {
	const f = require(file)
	if (!f) throw new Error("Invalid file")
	return f.execute(...args)
  }

function sleep(ms) {
	return new Promise((resolve) => {
	  setTimeout(resolve, ms);
	});
  }

async function post(uCondition) {
	if(uCondition){
		console.log('No Update Needed')
	} else {
		//hack to let fetch update finish before run
		await sleep(5000);
		const tagList = await Tags.findAll();
		const tagString = tagList.map(t => t.channel);
		tagString.forEach((tagString) => {
			try {
				console.log("Queue update to " + tagString);
				executejs('./commands/utility/freegames.js', client.channels.cache.get(tagString), 0)
			}
			catch (error) {            
				console.log('aint it cheif');
			}
		});
	}
};

client.on(Events.ClientReady, () => {
	setInterval(() => {
		doTHINGS()
		.then(uCondition => {
			post(uCondition)
		});
	}, 1000 * 60 * 60); //Check for update every hour

});

