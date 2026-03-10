let modInfo = {
	name: "The Universal Shifting Tree",
	author: "Elitheli",
	pointsName: "Quarks",
	modFiles: ["layers.js", "tree.js"],

	discordName: "",
	discordLink: "",
	initialStartPoints: new Decimal (10), // Used for hard resets and new players
	offlineLimit: 0,  // In hours
}

// Set your version in num and name
let VERSION = {
	num: "0.1",
	name: "UNIVERSAL COLLAPSE",
}

let changelog = `<h1>Changelog:</h1><br>
	<h2>v0.1: UNIVERSAL COLLAPSE</h3><br>
	<h4>3/10/26</h4>
		- Implemented Universal Shift<br>
		- Locked atoms until 100 Subatomic Particles<br>
		- OH MY GOSH THIS WAS SO HARD TO IMPLEMENT<br><br>
	<h3>v0.02: nvm the quarks align</h3><br>
	<h4>3/7/26</h4>
		- Changed Subatomic Particles to Quarks (i'll add explanations later)<br>
		- Changed Atoms to Subatomic Particles (reasonable)<br><br>
	<h3>v0.01: The atoms align.</h3><br>
	<h4>3/6/26</h4>
		- Added Subatomic Particles.<br>
		- MY BRAIN IS ALREADY DEAD.`

let winText = `This game is very short sowwy :( Anyways, good job you beat my game.`

// If you add new functions anywhere inside of a layer, and those functions have an effect when called, add them here.
// (The ones here are examples, all official functions are already taken care of)
var doNotCallTheseFunctionsEveryTick = ["blowUpEverything"]

function getStartPoints(){
    return new Decimal(modInfo.initialStartPoints)
}

// Determines if it should show points/sec
function canGenPoints(){
	return true
}

// Calculate points/sec!
function getPointGen() {
	if(!canGenPoints())
		return new Decimal(0)

	let gain = new Decimal(0)
	if (hasUpgrade('SA', 11)) gain = gain.add(1)
	if (hasUpgrade('SA', 12)) gain = gain.times(3)
	if (hasUpgrade('SA', 13)) gain = gain.times(upgradeEffect('SA', 13))
	if (hasUpgrade('SA', 14)) gain = gain.times(upgradeEffect('SA', 14))
	return gain
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
}}

// Display extra things at the top of the page
var displayThings = [
]

// Determines when the game "ends"
function isEndgame() {
	return player.points.gte(new Decimal("1000"))
}



// Less important things beyond this point!

// Style for the background, can be a function
var backgroundStyle = {

}

// You can change this if you have things that can be messed up by long tick lengths
function maxTickLength() {
	return(3600) // Default is 1 hour which is just arbitrarily large
}

// Use this if you need to undo inflation from an older version. If the version is older than the version that fixed the issue,
// you can cap their current resources with this.
function fixOldSave(oldVersion){
}