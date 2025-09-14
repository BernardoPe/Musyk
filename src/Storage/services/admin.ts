import { Snowflake } from "discord.js"

class AdminService {
	private readonly admins: Snowflake[]

	constructor() {
		this.admins = this.parseAdminsFromEnv()
	}

	private parseAdminsFromEnv(): Snowflake[] {
		const adminString = process.env.ADMINS || ""
		return adminString
			.split(",")
			.map((id) => id.trim())
			.filter((id) => id.length > 0)
	}

	public getAdmins(): Snowflake[] {
		return [...this.admins] // Return copy to prevent mutation
	}

	public isAdmin(userId: Snowflake): boolean {
		return this.admins.includes(userId)
	}
}

export const adminService = new AdminService()
