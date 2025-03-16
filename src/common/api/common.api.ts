import axios from 'axios'

export const instance = axios.create({
	baseURL: 'https://social-network.samuraijs.com/api/1.1/',
	withCredentials: true,
	headers: {
		'API-KEY': '8eb9d411-463e-4094-b3dd-5f539fee88d5'
	}
})




