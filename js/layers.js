
addLayer("US", {
    name: "Universal Shifts", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "US", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
        points: new Decimal(0)
    }},
    color: "#AA66AA",
    requires: new Decimal(1000), // Can be a function that takes requirement increases into account
    resource: "Universal Shifts", // Name of prestige currency
    baseResource: "Quarks", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    base: 1000,
    exponent: 1.3, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "u", description: "U: Reset for Universal Shift", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    onPrestige(gain) {
    // This wipes the higher layers when you prestige US
    if (player.SA) layerDataReset("SA");
    if (player.A) layerDataReset("A");
    
    // This resets the main points at the very top
    setTimeout(() => {
        player.points = new Decimal(10);
    }, 0)
    },
    doReset(resettingLayer) {
    // This PREVENTS US from resetting when SA or A resets
    let keep = ["points", "upgrades", "milestones", "buyables"];
    if (layers[resettingLayer].row > this.row) {
        layerDataReset(this.layer, keep);
    }
    },
    milestones: {
        0: {
            requirementDescription: "Universal Shift #1",
            effectDescription: "Unlocks Atoms, and *2.5 Quarks.",
            done() { 
                return player.US.points.gte(1) // The condition to earn it
            },
        },
    },
    layerShown(){return true
    }
})

addLayer("SA", {
    name: "Subatomic Particles", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "SA", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    branches: ["US"],
    color: "#8F0000",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "Subatomic Particles", // Name of prestige currency
    baseResource: "Quarks", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        if (hasUpgrade('SA', 15)) mult = mult.times(2)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    onPrestige(gain) {
    // Wait for the engine to finish, then strike it down to 0
    setTimeout(() => {
        player.points = new Decimal(0);
    }, 0);
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "s", description: "S: Reset for Subatomic Particles", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return true

    },
    upgrades: {
         11: {
            title: "I don't think subatomic particles can dissapear...",
            description: "Start gaining Quarks.",
            cost: new Decimal(1),
        },
         12: {
            title: "If this was real it would have exploded.",
            description: "Triple your Quarks gain.",
            cost: new Decimal(2),
        },
         13: {
            title: "Subatomic Particles can't split sooooo ye.",
            description: "Subatomic Particles boost Quarks",
            cost: new Decimal(5),
            effect() {
                return player[this.layer].points.add(1).pow(0.5)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, // Add formatting to the effect
        },
         14: {
            title: "Antimatter dimensions but matter?",
            description: "Quarks boost themselves (somehow???).",
            cost: new Decimal(15),
            effect() {
                return player.points.add(1).pow(0.3)
            },
            gainMult() {
                let mult = new Decimal(1)
                if (hasUpgrade('SA', 14)) mult = mult.times(upgradeEffect('SA', 14))
                return mult
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, // Add formatting to the effect

        },
         15: {
            title: "Might collapse the universe soon...",
            description: "Double your Subatomic Particle gain.",
            cost: new Decimal(30),
        },
    },
    infoboxes: {
        lore: {
            title: "Hello there.",
            body() { return "Hi! This is my upgrade tree that i'm finally making, the only reason is because i'm a nerd and want to play and make things. Anyways, i beat the Prestige Tree today, and in science, the unit is Atoms and other things, so yea.  Now, about Subatomic Particles. Subatomic Particles are made up from quarks (except electrons), so the quarks combine to make more subatomic particles." },
    },
    }
})

addLayer("A", {
    name: "Atoms", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "A", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
    }},
    branches: ["SA"],
    color: "#FF0000",
    requires: new Decimal(100), // Can be a function that takes requirement increases into account
    resource: "Atoms", // Name of prestige currency
    baseResource: "Subatomic Particles", // Name of resource prestige is based on
    baseAmount() {return player.SA.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.33, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 2, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "a", description: "A: Reset for Atoms", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){
        return hasMilestone("US", 0);
    },
})