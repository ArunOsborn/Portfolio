import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root',
})
export class Formatter {
	/**
	 * Converts a total number of minutes into an hour and minute string.
	 * @param totalMinutes The total number of minutes to convert.
	 * @returns A string in the format "X hours Y minutes".
	 */
	formatMinutes(totalMinutes: number): string {
		if (typeof totalMinutes !== 'number' || isNaN(totalMinutes)) {
			return "Unknown time";
		}

		const hours = Math.floor(totalMinutes / 60);
		const minutes = totalMinutes % 60;

		// Ensure minutes are formatted with two digits (e.g., 5 becomes "05")
		const formattedMinutes = String(minutes).padStart(2, '0');

		return `${hours} hours ${formattedMinutes} minutes`;
	}
}