import {Events} from "discord.js"
import {ClientEventHandler} from "../../types.ts"

class ErrorEventHandler implements ClientEventHandler {
	public name = Events.Error
	public execute(err: any) {
		console.log(err)
	}
}

export default new ErrorEventHandler()
