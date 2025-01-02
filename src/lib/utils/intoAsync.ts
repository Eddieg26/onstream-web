export async function intoAsync(callback: () => void, timeout: number = 0) {
	return new Promise((resolve) => {
		setTimeout(() => resolve(callback()), timeout);
	});
}
