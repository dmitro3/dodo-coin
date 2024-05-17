import { Telegraf } from 'telegraf';
import * as console from 'console';
import { UserFromGetMe } from 'telegraf/types';
import { TheMessageContext } from './types/dodo';

declare global {
	var CT_BOTS: {
		[key: string]: CustomTelegraf
	}
}
if (!global.CT_BOTS) global.CT_BOTS = {};


export default class CustomTelegraf extends Telegraf {
	readyEvents: (typeof this.onReady)[] = [];
	disconnectEvents: (typeof this.onDis)[] = [];
	me: UserFromGetMe | undefined;
	name: string;
	ready: boolean = false;
	id: string;

	constructor(name: string, token: string) {
		super(token);
		this.name = name;
		this.id = name.replaceAll(" ", "_")+`:${Object.keys(global.CT_BOTS).length}:`+Math.random();

		console.log(this.id, 'Initializing', 'Bot');
		this.telegram.getMe().then((me) => {
			this.me = me;
			this.launch(() => {
				this.onReady.bind(this)(me);
			}).catch((e)=>{
				this.onDis.bind(this)(e,this)
			});
		}).catch((e)=>{
			this.onDis.bind(this)(e,this)
		});
		global.CT_BOTS[this.id] = this;
	}

	private onReady(bot: UserFromGetMe) {
		this.me = bot;

		for (const readyEvent of this.readyEvents) {
			try {
				readyEvent(bot);
			} catch (e) {
				console.error(`Error in Ready event[${bot.username}]`);
			}
		}
		this.on("message", this.event);
		this.start(this.event);
		this.ready = true;
	}

	private onDis(e: Error,t: CustomTelegraf) {
		if (!global.CT_BOTS[this.id]) {
			console.log("Ignored Bot", this.id);
			return;
		}

		console.log(this.id, "Disconnected", e?.message ?? e);
		for (let disconnectEvent of this.disconnectEvents) {
			try {
				disconnectEvent(e, t);
			} catch (e) {
				console.error(e);
			}
		}
		this.disconnectEvents = [];
		delete global.CT_BOTS?.[this.id];
	}

	public onDisconnect(e: (e: Error, T: this) => void) {
		this.disconnectEvents.push(e);
	}

	event: (ctx: TheMessageContext)=>Promise<any> = async ()=>console.log(this.id,"MISS")
	onMessage(func: typeof this.event) {
		this.event = func;
	}

	async waitToReady(): Promise<UserFromGetMe> {
		if (this.me) {
			return this.me;
		}

		return await new Promise(r => {
			this.readyEvents.push((bot) => {
				r(bot);
			});
		});
	}
}
