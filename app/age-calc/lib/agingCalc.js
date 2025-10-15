/**
 * Calcula o total de pontos de bônus de ataque por nível de Aging
 */
function getAtkBonusTotals(aging, despertado) {
  const lvl1_9 = Math.min(aging, 9)
  const lvl10_19 = Math.min(Math.max(aging - 9, 0), 10)
  const lvl20_25 = Math.max(aging - 19, 0)

  // bônus de ATQ por faixa
  let bonus = lvl1_9 * 1 + lvl10_19 * 2 + lvl20_25 * 3

  // bônus extra de arma despertada
  if (despertado) bonus += aging

  return bonus
}

/**
 * Mapas auxiliares para taxa de ataque e crítico em armas
 */
const RATE_GROUP_5 = ["Adagas", "Espadas", "Garras", "Foices"]
const RATE_GROUP_10 = ["Machados", "Martelos", "Punhos", "Cajados", "Fantasmas"]
const CRIT_GROUP = ["Adagas", "Espadas", "Garras", "Foices", "Arcos", "Lanças"]

/**
 * Faixas de bônus de absorção
 */
function getAbsorptionBonus(type, level) {
  const tier = level <= 9 ? 0.5 : level <= 19 ? 1.0 : 1.5
  if (type === "escudo") {
    return level <= 9 ? 0.2 : level <= 19 ? 0.4 : 0.6
  }
  return tier
}

/**
 * Função principal: calcula stats finais de um item dado Aging e despertado
 */
export function calcAging(item, aging, despertado = false) {
  const { category, type, base } = item

  if (category === "armas") {
    const { min, max, rate, crit } = base
    const atkBonus = getAtkBonusTotals(aging, despertado)

    const newMin = min + atkBonus
    const newMax = max + atkBonus

    let ratePerLevel = 0
    if (RATE_GROUP_5.includes(type)) ratePerLevel = 5
    if (RATE_GROUP_10.includes(type)) ratePerLevel = 10
    const newRate = rate + ratePerLevel * aging

    const critPerLevel = CRIT_GROUP.includes(type) ? 0.5 : 0
    const newCrit = Math.floor(crit + critPerLevel * aging)

    return {
      min: newMin,
      max: newMax,
      rate: newRate,
      crit: newCrit,
    }
  }

  if (category === "defesas") {
    let defense = base.defense
    let absorption = base.absorption || 0
    let block = base.block || 0
    let attack = base.attack || 0

    for (let lvl = 1; lvl <= aging; lvl++) {
      switch (type) {
        case "armadura":
        case "roupao":
          defense = Math.floor(defense * 1.05)
          absorption += getAbsorptionBonus(type, lvl)
          break

        case "orbital":
        case "luvas":
        case "botas":
        case "outro":
          // botas, orbital e luvas têm +10% por lvl
          defense = Math.floor(defense * 1.1)
          absorption += getAbsorptionBonus(type, lvl)
          break

        case "bracelete":
          defense = Math.floor(defense * 1.1)
          attack += 5
          break

        case "escudo":
          block += 0.5
          absorption += getAbsorptionBonus(type, lvl)
          break
      }
    }

    return {
      defense: Math.floor(defense),
      absorption: Number(absorption.toFixed(1)),
      block: Number(block.toFixed(1)),
      attack,
    }
  }

  throw new Error(`Categoria desconhecida: ${category}`)
}
