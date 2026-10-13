import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root',
})
export class GeneralService {

	/**
	 * Takes a dictionary of weights and returns their chances as percentages adding up to 1
	 * @param weights A dictionary where keys are item names and values are their corresponding weights.
	 * @returns 
	 */
	getChancesFromWeights(weights: {[key: string]: number}): {[key: string]: number} {
		const totalWeight = Object.values(weights).reduce((sum, weight) => sum + weight, 0);
		const chances: {[key: string]: number} = {};
		for (const key in weights) {
			chances[key] = (weights[key] / totalWeight) * 100;
		}
		return chances;
	}
}
