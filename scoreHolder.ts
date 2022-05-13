export default class ScoreHolder {
	//N (historyLength) is defined when ScoreHolder class is instantiated
	//Defaults to 3 if not defined
	constructor(historyLength: number = 3) {
		this.historyLength = historyLength;
	}

	private historyLength;
	private matches: { id: string; scores: string[] }[] = [];

	// private eventTarget: EventTarget = new EventTarget();

	// The producer can store an updated score for a given match
	// Assumptions:
	// - Only producers can use putScore, authentication already handled elsewhere
	// - Format is always the same (M{a}, SET {b} GAME {c} {d}-{e}) and verified elsewhere
	// - Scores are already verified elsewhere
	putScore(match: string, score: string): void {
		let matchFound = false;

		// Search for given match and update scores if found
		for (let i = 0; i < this.matches.length && !matchFound; i++) {
			if (this.matches[i].id === match) {
				this.matches[i].scores.push(score);
				matchFound = true;
			}
		}

		// If match doesn't exist already, create with score
		if (!matchFound) {
			let newMatch = {
				id: match,
				scores: [score],
			};
			this.matches.push(newMatch);
		}

		// For waitForNextScore():
		// "newScore" event dispatched that says what match has been updated with what score
		// const event = new CustomEvent("newScore", {
		// 	detail: {
		// 		match: match,
		// 		score: score,
		// 	},
		// });
		// this.eventTarget.dispatchEvent(event);
	}

	// The consumer can retrieve the latest score for a given match
	getScore(match: string): unknown {
		// Search for given match and return latest score if found
		for (let i = 0; i < this.matches.length; i++) {
			if (this.matches[i].id === match) {
				return this.matches[i].scores[this.matches[i].scores.length - 1];
			}
		}
		// If match doesn't exist
		return null;
	}

	// The consumer can get the last N scores for a specific match
	// N is defined when ScoreHolder class is instantiated (historyLength)
	getHistory(match: string): unknown {
		// Search for given match and return last N scores if found
		for (let i = 0; i < this.matches.length; i++) {
			if (this.matches[i].id === match) {
				return this.matches[i].scores.splice(-this.historyLength);
			}
		}
		// If match doesn't exist
		return null;
	}

	// The consumer can wait for the next score for a given match
	// should respond to `putScore()` being called
	waitForNextScore(match: string): unknown {
		// My thought process is that putScore() should trigger some event that details what match has been updated with what score
		// waitForNextScore() should activate a listener for events triggered by putScore()
		// and return the score to the consumer if it is the requested match
		// Should potentially make use of async/await and promises?
		//
		// E.g.
		// // Listen for newScore event
		// this.eventTarget.addEventListener("newScore", (event: any) => {
		// 	//If match is the same the consumer requested
		// 	if (event.detail.match === match) {
		// 		return event.detail.score;
		// 	}
		// });
		// If match doesn't exist
		// return null;
		return;
	}

	// The consumer can subscribe to (and unsubscribe from) score changes
	// should respond to `putScore()` being called
	subscribe(match: string): unknown {
		// My thought process is that subscribe() should make use of waitForNextScore() to repeatedly get score changes
		// What I'm unsure of is how to return the score while keeping subscribe() running so further scores can be returned
		// since calling subscribe() again would cause it to unsubscribe
		// Should potentially make use of async/await and promises?
		//
		// // Subscribe
		// While subscribed to match
		//   return waitForNextScore(match) to consumer
		//
		// // Unsubscribe
		// If consumer already subscribed to given match, stop looping waitForNextScore(match)
		// If match doesn't exist
		// return null;
		return;
	}
}
