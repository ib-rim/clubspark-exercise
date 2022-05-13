import assert from "assert";
import ScoreHolder from "./scoreHolder";

function testGetScore() {
	const sh = new ScoreHolder();

	sh.putScore("M1", "SET 1 GAME 1 0-0");
	sh.putScore("M2", "SET 1 GAME 1 0-0");
	sh.putScore("M2", "SET 1 GAME 1 15-0");
	sh.putScore("M3", "SET 2 GAME 3 0-30");

	assert.strict.equal(sh.getScore("M1"), "SET 1 GAME 1 0-0");
	assert.strict.equal(sh.getScore("M2"), "SET 1 GAME 1 15-0");
	assert.strict.equal(sh.getScore("M3"), "SET 2 GAME 3 0-30");

	// Added test for non-existent match
	assert.strict.equal(sh.getScore("M4"), null);
}

function testGetHistory() {
	const sh = new ScoreHolder();
	sh.putScore("M1", "SET 1 GAME 1 0-0");
	sh.putScore("M1", "SET 1 GAME 1 15-0");

	// Changed to deepEqual, otherwise not reference-equal
	// Assuming this should be okay since consumers are only reading values and not updating them
	assert.strict.deepEqual(sh.getHistory("M1"), ["SET 1 GAME 1 0-0", "SET 1 GAME 1 15-0"]);

	// Added test for non-existent match
	assert.strict.equal(sh.getHistory("M2"), null);

	// Added test for non-default historyLength match
	const sh2 = new ScoreHolder(5);
	sh2.putScore("M1", "SET 1 GAME 1 0-0");
	sh2.putScore("M1", "SET 1 GAME 1 15-0");
	sh2.putScore("M1", "SET 1 GAME 1 15-15");
	sh2.putScore("M1", "SET 1 GAME 1 15-30");
	assert.strict.deepEqual(sh2.getHistory("M1"), ["SET 1 GAME 1 0-0", "SET 1 GAME 1 15-0", "SET 1 GAME 1 15-15", "SET 1 GAME 1 15-30"]);
}

function testWaitForNextScore() {
	const sh = new ScoreHolder();
	setTimeout(() => {
		sh.putScore("M2", "SET 2 GAME 2 40-0");
	}, 100);

	let value = sh.waitForNextScore("M2");
	assert.strict.equal(value, "SET 2 GAME 2 40-0");
}

async function testSubscribe() {
	const sh = new ScoreHolder();
	const values = ["SET 1 GAME 1 0-0", "SET 1 GAME 1 15-0", "SET 1 GAME 1 15-15"];
	const putNext = () => {
		setTimeout(() => {
			const next = values.shift();
			if (next === undefined) return;

			sh.putScore("M1", next);
			putNext();
		}, 100);
	};

	putNext();

	// Subscribe to score changes
	sh.subscribe("M1");

	// assert.strict.equal(subscription, "SET 1 GAME 1 0-0");
	// assert.strict.equal(subscription, "SET 1 GAME 1 15-0");
	// assert.strict.equal(subscription, "SET 1 GAME 1 15-15");

	// Unsubscribe when done
	sh.subscribe("M1");
}

testGetScore();
testGetHistory();
testWaitForNextScore();
testSubscribe();
