
addLayer("US", {
    name: "Universal Shifts", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "US", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
        points: new Decimal(0)
    }},
    color: "#AA66AA",
    requires: new Decimal(100), // Can be a function that takes requirement increases into account
    resource: "Universal Shifts", // Name of prestige currency
    baseResource: "Quarks", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "custom", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    canReset() {
    // Formula: 10^ (3 * (1.3**x + 1))
    let x = player[this.layer].points;
    let cost = Decimal.pow(10, Decimal.mul(3, Decimal.pow(1.35, Decimal.pow(1.35, x)).add(1)));
    return player.points.gte(cost)
    },
    getResetGain() {
    // For "static" style (one point at a time)
    if (!this.canReset()) return new Decimal(0);
    return new Decimal(1);
    },

    getNextAt() {
    // This shows the requirement for the next prestige level in the UI
    let x = player[this.layer].points;
    return Decimal.pow(10, Decimal.mul(3, Decimal.pow(1.35, Decimal.pow(1.35, x)).add(1)));
    },

    prestigeButtonText() {
    return "Reset for 1 UNIVERSAL SHIFT<br>Next at:<br> " + format(this.getNextAt()) + " Quarks.";
    },

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
        1: {
            requirementDescription: "Universal Shift #2",
            effectDescription: "*3 Quarks, and *2 Subatomic Particles",
            done() {
                return player.US.points.gte(2) // The condition to earn it
            },
        },
        2: {
            requirementDescription: "Universal Shift #3",
            effectDescription: "Unlock Dimensions, an exponentially growing layer.",
            done() {
                return player.US.points.gte(3) // The condition to earn it
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

        if (hasUpgrade('A', 12)) mult = mult.times(2)

        if (hasMilestone('US', 1)) mult = mult.times(2)
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
            unlocked() { return hasUpgrade('SA', 11) }, 
        },
         13: {
            title: "Subatomic Particles can't split sooooo ye.",
            description: "Subatomic Particles boost Quarks",
            cost: new Decimal(5),
            effect() {
                return player[this.layer].points.add(1).pow(0.35)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, // Add formatting to the effect
            unlocked() { return hasUpgrade('SA', 12) }, 
        },
         14: {
            title: "Antimatter dimensions but matter?",
            description: "Quarks boost themselves (somehow???).",
            cost: new Decimal(15),
            effect() {
                return player.points.add(1).pow(0.25)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, // Add formatting to the effect
            unlocked() { return hasUpgrade('SA', 13) }, 
        },
         15: {
            title: "Might collapse the universe soon...",
            description: "Double your Subatomic Particle gain.",
            cost: new Decimal(30),
            unlocked() { return hasUpgrade('SA', 14) }, 
        },
         21: {
            title: "nvm it's still far away (post-scaling)",
            description: "Raise the power of Quarks by 0.1.",
            cost: new Decimal(100),
            unlocked() { return hasUpgrade('SA', 15) }, 
        },
         22: {
            title: "Protons, Neutrons, and Electrons",
            description: "Triple Quarks Gain.",
            cost: new Decimal(250),
            unlocked() { return hasUpgrade('SA', 21) }, 
        },
         23: {
            title: "Up Quarks and Down Quarks and the 5 other types",
            description: "*7 Quarks Gain",
            cost: new Decimal(1000),
            unlocked() { return hasUpgrade('SA', 22) }, 
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
    upgrades: {
    11: {
    title: "YIPPE ATOMIC ATOMS",
    description: "*3 Quarks, and *1 Subatomic Particles.",
    cost: new Decimal(1),
    },
    12: {
    title: "Atoms can't split, it causes a bomb!",
    description: "*2 Quarks and Subatomic Particles.",
    cost: new Decimal(2),
    },
    13: {
    title: "these upgrades are so weak",
    description: "Quarks boost Quarks.",
    cost: new Decimal(4),
    effect() {
        return player.points.add(1).pow(0.1)
    },
    effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
    },
    },
    layerShown(){
        return hasMilestone("US", 0);
    },
})