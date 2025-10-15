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

/**
 * Função reversa: calcula stats originais (limpos) baseado nos stats com aging
 * Usa busca iterativa para encontrar o valor base correto
 */
export function calcReverseAging(userStats, item, aging, despertado = false) {
  const { category, type, base } = item

  if (category === "armas") {
    const atkBonus = getAtkBonusTotals(aging, despertado)

    const originalMin = userStats.min - atkBonus
    const originalMax = userStats.max - atkBonus

    let ratePerLevel = 0
    if (RATE_GROUP_5.includes(type)) ratePerLevel = 5
    if (RATE_GROUP_10.includes(type)) ratePerLevel = 10
    const originalRate = userStats.rate - ratePerLevel * aging

    const critPerLevel = CRIT_GROUP.includes(type) ? 0.5 : 0
    const originalCrit = userStats.crit - critPerLevel * aging

    return {
      min: originalMin,
      max: originalMax,
      rate: originalRate,
      crit: Math.floor(originalCrit),
    }
  }

  if (category === "defesas") {
    // Para defesas, usamos busca iterativa porque o Math.floor() a cada nível
    // torna impossível fazer cálculo reverso direto

    function findOriginalDefense(targetDefense, type, aging) {
      // Busca em uma faixa razoável ao redor do valor estimado
      const estimate = Math.floor(targetDefense / Math.pow(1.05, aging))
      const searchRange = 50 // busca +/- 50 pontos

      for (
        let baseDefense = Math.max(1, estimate - searchRange);
        baseDefense <= estimate + searchRange;
        baseDefense++
      ) {
        let testDefense = baseDefense

        // Simula o aging exatamente como o jogo faz
        for (let lvl = 1; lvl <= aging; lvl++) {
          switch (type) {
            case "armadura":
            case "roupao":
              testDefense = Math.floor(testDefense * 1.05)
              break
            case "orbital":
            case "luvas":
            case "botas":
            case "outro":
              testDefense = Math.floor(testDefense * 1.1)
              break
            case "bracelete":
              testDefense = Math.floor(testDefense * 1.1)
              break
            case "escudo":
              // escudo não tem crescimento de defesa
              break
          }
        }

        // Se encontrou o valor exato, retorna o base
        if (testDefense === targetDefense) {
          return baseDefense
        }
      }

      // Se não encontrou exato, retorna a estimativa
      return estimate
    }

    function findOriginalAbsorption(targetAbsorption, type, aging) {
      let totalBonus = 0
      for (let lvl = 1; lvl <= aging; lvl++) {
        totalBonus += getAbsorptionBonus(type, lvl)
      }
      return Math.max(0, targetAbsorption - totalBonus)
    }

    const originalDefense = findOriginalDefense(userStats.defense, type, aging)
    const originalAbsorption = findOriginalAbsorption(userStats.absorption || 0, type, aging)

    let originalBlock = userStats.block || 0
    let originalAttack = userStats.attack || 0

    if (type === "escudo") {
      originalBlock = Math.max(0, (userStats.block || 0) - aging * 0.5)
    }

    if (type === "bracelete") {
      originalAttack = Math.max(0, (userStats.attack || 0) - aging * 5)
    }

    return {
      defense: originalDefense,
      absorption: Number(originalAbsorption.toFixed(1)),
      block: Number(originalBlock.toFixed(1)),
      attack: originalAttack,
    }
  }

  throw new Error(`Categoria desconhecida: ${category}`)
}
