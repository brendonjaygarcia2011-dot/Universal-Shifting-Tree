addLayer("A", {
    name: "Atoms", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "A", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#FF0000",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "Atoms", // Name of prestige currency
    baseResource: "Subatomic Particles", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "a", description: "A: Reset for Atoms", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return true

    },
    upgrades: {
         11: {
            title: "I don't think atoms can dissapear...",
            description: "Double your Subatomic Particle gain.",
            cost: new Decimal(1),
        },
         12: {
            title: "If this was real it would have exploded.",
            description: "Triple your Subatomic Particle gain.",
            cost: new Decimal(2),
        },
         13: {
            title: "The atoms split to make more particles.",
            description: "Atoms boost Subatomic Particles.",
            cost: new Decimal(5),
            effect() {
                return player[this.layer].points.add(1).pow(0.5)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, // Add formatting to the effect
        },
         14: {
            title: "Antimatter dimensions but matter?",
            description: "Subatomic Particles boost themselves (somehow???).",
            cost: new Decimal(15),
            effect() {
                return player.points.add(1).pow(0.1)
            },
            gainMult() {
                let mult = new Decimal(1)
                if (hasUpgrade('A', 14)) mult = mult.times(upgradeEffect('A', 14))
                return mult
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, // Add formatting to the effect

        },
    },
    infoboxes: {
    lore: {
        title: "Hello there",
        body() { return "Hi! This is my upgrade tree that i'm finally making, the only reason is because i'm a nerd and want to play and make things. Anyways, i beat the Prestige Tree today, and in science, the unit is Atoms and other things, so yea." },
        etc
    },
    etc
    }
})
