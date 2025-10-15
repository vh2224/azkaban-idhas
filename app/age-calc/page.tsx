"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Calculator, Home, Sparkles } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState, useEffect } from "react"
import { calcAging, calcReverseAging } from "../../lib/agingCalc.js"

export default function AgeCalc() {
  const [calcType, setCalcType] = useState("limpo-para-age")
  const [category, setCategory] = useState("")
  const [itemType, setItemType] = useState("")
  const [selectedItem, setSelectedItem] = useState("")
  const [aging, setAging] = useState("1")
  const [despertado, setDespertado] = useState(false)
  const [items, setItems] = useState({})
  const [images, setImages] = useState({})
  const [result, setResult] = useState(null)

  // Stats inputs
  const [minAtk, setMinAtk] = useState("")
  const [maxAtk, setMaxAtk] = useState("")
  const [atkRate, setAtkRate] = useState("")
  const [defense, setDefense] = useState("")
  const [absorption, setAbsorption] = useState("")
  const [block, setBlock] = useState("")

  useEffect(() => {
    Promise.all([
      fetch("/age-calc/data/items.json").then((res) => res.json()),
      fetch("/age-calc/data/images.json").then((res) => res.json()),
    ])
      .then(([itemsData, imagesData]) => {
        setItems(itemsData)
        setImages(imagesData)
      })
      .catch((err) => console.error("Erro ao carregar dados:", err))
  }, [])

  const categories = [...new Set(Object.values(items).map((item) => item.category))]
  const types = category
    ? [
        ...new Set(
          Object.values(items)
            .filter((item) => item.category === category)
            .map((item) => item.type),
        ),
      ]
    : []
  const itemsList =
    category && itemType
      ? Object.entries(items).filter(([_, item]) => item.category === category && item.type === itemType)
      : []

  const selectedItemData = selectedItem ? items[selectedItem] : null
  const itemImage = selectedItem ? images[selectedItem] : null

  const calculate = () => {
    if (!selectedItemData || !aging) return

    const agingLevel = Number.parseInt(aging)
    const isWeapon = selectedItemData?.category === "armas"

    if (calcType === "limpo-para-age") {
      // Calcula como o item ficaria com aging
      const result = calcAging(selectedItemData, agingLevel, despertado)
      setResult({
        type: "forward",
        original: selectedItemData.base,
        calculated: result,
        aging: agingLevel,
        despertado,
      })
    } else {
      const userStats = {}

      if (isWeapon) {
        userStats.min = Number.parseInt(minAtk) || 0
        userStats.max = Number.parseInt(maxAtk) || 0
        if (selectedItemData.type === "Arcos") {
          userStats.crit = Number.parseInt(atkRate) || 0
          userStats.rate = selectedItemData.base.rate
        } else {
          userStats.rate = Number.parseInt(atkRate) || 0
          userStats.crit = selectedItemData.base.crit
        }
      } else {
        if (selectedItemData.type === "escudo") {
          userStats.block = Number.parseFloat(block) || 0
          userStats.absorption = Number.parseFloat(absorption) || 0
          userStats.defense = selectedItemData.base.defense
        } else if (selectedItemData.type === "bracelete") {
          userStats.defense = Number.parseInt(defense) || 0
          userStats.attack = Number.parseInt(atkRate) || 0
        } else {
          userStats.defense = Number.parseInt(defense) || 0
          userStats.absorption = Number.parseFloat(absorption) || 0
        }
      }

      const calculatedClean = calcReverseAging(userStats, selectedItemData, agingLevel, despertado)

      const perfectClean = selectedItemData.base

      const deltas = {}
      if (isWeapon) {
        deltas.min = calculatedClean.min - perfectClean.min
        deltas.max = calculatedClean.max - perfectClean.max
        if (selectedItemData.type !== "Arcos") {
          deltas.rate = calculatedClean.rate - perfectClean.rate
        }
      } else {
        if (selectedItemData.type === "escudo") {
          deltas.block = calculatedClean.block - (perfectClean.block || 0)
          deltas.absorption = calculatedClean.absorption - (perfectClean.absorption || 0)
        } else if (selectedItemData.type === "bracelete") {
          deltas.defense = calculatedClean.defense - perfectClean.defense
          deltas.attack = calculatedClean.attack - (perfectClean.attack || 0)
        } else {
          deltas.defense = calculatedClean.defense - perfectClean.defense
          deltas.absorption = calculatedClean.absorption - (perfectClean.absorption || 0)
        }
      }

      setResult({
        type: "reverse",
        userStats,
        calculatedClean,
        perfectClean,
        deltas,
        aging: agingLevel,
        despertado,
      })
    }
  }

  const resetForm = () => {
    setCategory("")
    setItemType("")
    setSelectedItem("")
    setAging("1")
    setDespertado(false)
    setMinAtk("")
    setMaxAtk("")
    setAtkRate("")
    setDefense("")
    setAbsorption("")
    setBlock("")
    setResult(null)
  }

  const fillPerfectStats = () => {
    if (!selectedItemData) return

    const isWeapon = selectedItemData.category === "armas"
    if (isWeapon) {
      setMinAtk(selectedItemData.base.min.toString())
      setMaxAtk(selectedItemData.base.max.toString())
      if (selectedItemData.type === "Arcos") {
        setAtkRate(selectedItemData.base.crit.toString())
      } else {
        setAtkRate(selectedItemData.base.rate.toString())
      }
    } else {
      if (selectedItemData.type === "escudo") {
        setBlock(selectedItemData.base.block?.toString() || "0")
        setAbsorption(selectedItemData.base.absorption?.toString() || "0")
      } else if (selectedItemData.type === "bracelete") {
        setDefense(selectedItemData.base.defense.toString())
        setAtkRate(selectedItemData.base.attack?.toString() || "0")
      } else {
        setDefense(selectedItemData.base.defense.toString())
        setAbsorption(selectedItemData.base.absorption?.toString() || "0")
      }
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-gray-800 bg-black/90 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Image src="/images/azkaban-logo.png" alt="Azkaban Logo" width={40} height={40} className="rounded-full" />
            <span className="text-xl font-bold">AZKABAN</span>
          </div>

          <Link href="/">
            <Button variant="outline" className="border-gray-600 text-white hover:bg-gray-800 bg-transparent">
              <Home className="w-4 h-4 mr-2" />
              Voltar ao Site
            </Button>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Title Section */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-6">
              <Calculator className="w-12 h-12 text-orange-400 mr-4" />
              <h1 className="text-4xl md:text-6xl font-bold text-white">
                AGE <span className="text-orange-400">CALC</span>
              </h1>
            </div>
            <p className="text-xl text-gray-300 mb-4">Calculadora de Aging - Priston Tale</p>
            <p className="text-gray-400">Selecione um item e calcule seus stats com aging</p>
          </div>

          {/* Calc Type Selection */}
          <div className="flex justify-center mb-8">
            <div className="flex bg-gray-800 rounded-lg p-1">
              <Button
                onClick={() => setCalcType("limpo-para-age")}
                className={`px-6 py-2 rounded-md transition-colors ${
                  calcType === "limpo-para-age"
                    ? "bg-green-600 text-white"
                    : "bg-transparent text-gray-300 hover:bg-gray-700"
                }`}
              >
                LIMPO PARA AGE
              </Button>
              <Button
                onClick={() => setCalcType("age-para-limpo")}
                className={`px-6 py-2 rounded-md transition-colors ${
                  calcType === "age-para-limpo"
                    ? "bg-green-600 text-white"
                    : "bg-transparent text-gray-300 hover:bg-gray-700"
                }`}
              >
                AGE PARA LIMPO
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Calculator Form */}
            <Card className="bg-gray-900 border-gray-700">
              <CardHeader>
                <CardTitle className="text-2xl text-orange-400 flex items-center">
                  <Calculator className="w-6 h-6 mr-2" />
                  Calculadora de {calcType === "limpo-para-age" ? "LIMPO PARA AGE" : "AGE PARA LIMPO"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Category Selection */}
                <div className="space-y-2">
                  <Label className="text-white font-semibold">DEFESA OU ATAQUE?</Label>
                  <Select
                    value={category}
                    onValueChange={(value) => {
                      setCategory(value)
                      setItemType("")
                      setSelectedItem("")
                    }}
                  >
                    <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                      <SelectValue placeholder="-- Selecione --" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-600">
                      <SelectItem value="armas" className="text-white hover:bg-gray-700">
                        Armas ({Object.values(items).filter((item) => item.category === "armas").length} itens)
                      </SelectItem>
                      <SelectItem value="defesas" className="text-white hover:bg-gray-700">
                        Defesas ({Object.values(items).filter((item) => item.category === "defesas").length} itens)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Type Selection */}
                {category && (
                  <div className="space-y-2">
                    <Label className="text-white font-semibold">TIPO:</Label>
                    <Select
                      value={itemType}
                      onValueChange={(value) => {
                        setItemType(value)
                        setSelectedItem("")
                      }}
                    >
                      <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                        <SelectValue placeholder="-- Selecione --" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-600">
                        {types.map((type) => {
                          const itemCount = Object.values(items).filter(
                            (item) => item.category === category && item.type === type,
                          ).length
                          return (
                            <SelectItem key={type} value={type} className="text-white hover:bg-gray-700">
                              {type} ({itemCount} {itemCount === 1 ? "item" : "itens"})
                            </SelectItem>
                          )
                        })}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Item Selection */}
                {itemType && (
                  <div className="space-y-2">
                    <Label className="text-white font-semibold">ITEM:</Label>
                    <Select value={selectedItem} onValueChange={setSelectedItem}>
                      <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                        <SelectValue placeholder="-- Selecione --" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-600">
                        {itemsList.map(([name, item]) => (
                          <SelectItem key={name} value={name} className="text-white hover:bg-gray-700">
                            {item?.level ? `[${item.level}] ${name}` : name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Item Display & Stats */}
                {selectedItem && selectedItemData && (
                  <div className="bg-gray-800 rounded-lg p-4 border border-gray-600">
                    <div className="flex items-center space-x-4 mb-4">
                      {itemImage && (
                        <div className="w-16 h-16 bg-gray-700 rounded-lg flex items-center justify-center">
                          <Image
                            src={`/abstract-geometric-shapes.png?height=48&width=48&query=${selectedItem}`}
                            alt={selectedItem}
                            width={48}
                            height={48}
                            className="rounded"
                          />
                        </div>
                      )}
                      <div>
                        <h3 className="text-lg font-bold text-white">{selectedItem}</h3>
                        <Badge className="bg-orange-600 text-white">
                          {selectedItemData?.category === "armas" ? "Arma" : "Defesa"}
                        </Badge>
                      </div>
                    </div>

                    {/* Aging Selection */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="space-y-2">
                        <Label className="text-white font-semibold">Aging:</Label>
                        <Select value={aging} onValueChange={setAging}>
                          <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-800 border-gray-600">
                            {Array.from({ length: 25 }, (_, i) => i + 1).map((level) => (
                              <SelectItem key={level} value={level.toString()} className="text-white hover:bg-gray-700">
                                +{level}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {selectedItemData?.category === "armas" && (
                        <div className="flex items-center space-x-2 mt-6">
                          <Checkbox
                            id="despertado"
                            checked={despertado}
                            onCheckedChange={setDespertado}
                            className="border-gray-600"
                          />
                          <Label htmlFor="despertado" className="text-white text-sm">
                            Despertado?
                          </Label>
                        </div>
                      )}
                    </div>

                    {/* Stats Input (only for age-para-limpo) */}
                    {calcType === "age-para-limpo" && (
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <Label className="text-white font-semibold">Stats Atuais:</Label>
                          <Button
                            onClick={fillPerfectStats}
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                          >
                            <Sparkles className="w-4 h-4 mr-1" />
                            Perf
                          </Button>
                        </div>

                        {selectedItemData?.category === "armas" ? (
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label className="text-white text-sm">Atq min:</Label>
                              <Input
                                type="number"
                                value={minAtk}
                                onChange={(e) => setMinAtk(e.target.value)}
                                className="bg-gray-700 border-gray-600 text-white"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-white text-sm">Atq max:</Label>
                              <Input
                                type="number"
                                value={maxAtk}
                                onChange={(e) => setMaxAtk(e.target.value)}
                                className="bg-gray-700 border-gray-600 text-white"
                              />
                            </div>
                            <div className="space-y-2 col-span-2">
                              <Label className="text-white text-sm">
                                {selectedItemData?.type === "Arcos" ? "Crítico:" : "Taxa atq:"}
                              </Label>
                              <Input
                                type="number"
                                value={atkRate}
                                onChange={(e) => setAtkRate(e.target.value)}
                                className="bg-gray-700 border-gray-600 text-white"
                              />
                            </div>
                          </div>
                        ) : (
                          <div className="grid grid-cols-2 gap-4">
                            {selectedItemData?.type === "escudo" ? (
                              <>
                                <div className="space-y-2">
                                  <Label className="text-white text-sm">Bloqueio:</Label>
                                  <Input
                                    type="number"
                                    value={block}
                                    onChange={(e) => setBlock(e.target.value)}
                                    className="bg-gray-700 border-gray-600 text-white"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label className="text-white text-sm">Absorção:</Label>
                                  <Input
                                    type="number"
                                    step="0.1"
                                    value={absorption}
                                    onChange={(e) => setAbsorption(e.target.value)}
                                    className="bg-gray-700 border-gray-600 text-white"
                                  />
                                </div>
                              </>
                            ) : selectedItemData?.type === "bracelete" ? (
                              <>
                                <div className="space-y-2">
                                  <Label className="text-white text-sm">Defesa:</Label>
                                  <Input
                                    type="number"
                                    value={defense}
                                    onChange={(e) => setDefense(e.target.value)}
                                    className="bg-gray-700 border-gray-600 text-white"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label className="text-white text-sm">Taxa atq:</Label>
                                  <Input
                                    type="number"
                                    value={atkRate}
                                    onChange={(e) => setAtkRate(e.target.value)}
                                    className="bg-gray-700 border-gray-600 text-white"
                                  />
                                </div>
                              </>
                            ) : (
                              <>
                                <div className="space-y-2">
                                  <Label className="text-white text-sm">Defesa:</Label>
                                  <Input
                                    type="number"
                                    value={defense}
                                    onChange={(e) => setDefense(e.target.value)}
                                    className="bg-gray-700 border-gray-600 text-white"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label className="text-white text-sm">Absorção:</Label>
                                  <Input
                                    type="number"
                                    step="0.1"
                                    value={absorption}
                                    onChange={(e) => setAbsorption(e.target.value)}
                                    className="bg-gray-700 border-gray-600 text-white"
                                  />
                                </div>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    <div className="flex gap-3 mt-6">
                      <Button
                        onClick={calculate}
                        className="flex-1 bg-orange-600 hover:bg-orange-700 text-white font-bold"
                      >
                        Calcular!
                      </Button>
                      <Button
                        onClick={resetForm}
                        variant="outline"
                        className="border-gray-600 text-white hover:bg-gray-800 bg-transparent"
                      >
                        Reset
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Results */}
            <Card className="bg-gray-900 border-gray-700">
              <CardHeader>
                <CardTitle className="text-2xl text-orange-400">Resultado</CardTitle>
              </CardHeader>
              <CardContent>
                {result ? (
                  <div className="space-y-4">
                    {result.type === "forward" ? (
                      // Limpo para Age results
                      <div className="bg-gray-800 rounded-lg p-4 border border-gray-600">
                        <h3 className="text-lg font-semibold text-white mb-4">
                          {selectedItem} +{result.aging}
                          {result.despertado && " (Despertado)"}
                        </h3>

                        {selectedItemData?.category === "armas" ? (
                          <div className="space-y-2 text-white">
                            <div>
                              Ataque min: <span className="text-green-400">{result.calculated.min}</span>
                            </div>
                            <div>
                              Ataque max: <span className="text-green-400">{result.calculated.max}</span>
                            </div>
                            {selectedItemData?.type === "Arcos" ? (
                              <div>
                                Crítico: <span className="text-green-400">{result.calculated.crit}</span>
                              </div>
                            ) : (
                              <div>
                                Taxa de ataque: <span className="text-green-400">{result.calculated.rate}</span>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="space-y-2 text-white">
                            {selectedItemData?.type === "escudo" ? (
                              <>
                                <div>
                                  Bloqueio: <span className="text-green-400">{result.calculated.block}</span>
                                </div>
                                <div>
                                  Absorção: <span className="text-green-400">{result.calculated.absorption}</span>
                                </div>
                              </>
                            ) : selectedItemData?.type === "bracelete" ? (
                              <>
                                <div>
                                  Defesa: <span className="text-green-400">{result.calculated.defense}</span>
                                </div>
                                <div>
                                  Taxa de ataque: <span className="text-green-400">{result.calculated.attack}</span>
                                </div>
                              </>
                            ) : (
                              <>
                                <div>
                                  Defesa: <span className="text-green-400">{result.calculated.defense}</span>
                                </div>
                                <div>
                                  Absorção: <span className="text-green-400">{result.calculated.absorption}</span>
                                </div>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    ) : (
                      // Age para Limpo results
                      <div className="space-y-4">
                        <div className="bg-gray-800 rounded-lg p-4 border border-gray-600">
                          <h3 className="text-lg font-semibold text-white mb-4">
                            Comparação: {selectedItem} +{result.aging}
                            {result.despertado && " (Despertado)"}
                          </h3>

                          <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                              <h4 className="text-sm font-semibold text-gray-300 mb-2">
                                Stats Inseridos (+{result.aging})
                              </h4>
                              <div className="bg-gray-700 rounded p-3 space-y-1 text-sm">
                                {selectedItemData.category === "armas" ? (
                                  <>
                                    <div>
                                      Atq min: <span className="text-blue-400">{result.userStats.min}</span>
                                    </div>
                                    <div>
                                      Atq max: <span className="text-blue-400">{result.userStats.max}</span>
                                    </div>
                                    {selectedItemData.type !== "Arcos" && (
                                      <div>
                                        Taxa atq: <span className="text-blue-400">{result.userStats.rate}</span>
                                      </div>
                                    )}
                                  </>
                                ) : (
                                  <>
                                    {selectedItemData.type === "escudo" ? (
                                      <>
                                        <div>
                                          Bloqueio: <span className="text-blue-400">{result.userStats.block}</span>
                                        </div>
                                        <div>
                                          Absorção: <span className="text-blue-400">{result.userStats.absorption}</span>
                                        </div>
                                      </>
                                    ) : selectedItemData.type === "bracelete" ? (
                                      <>
                                        <div>
                                          Defesa: <span className="text-blue-400">{result.userStats.defense}</span>
                                        </div>
                                        <div>
                                          Taxa atq: <span className="text-blue-400">{result.userStats.attack}</span>
                                        </div>
                                      </>
                                    ) : (
                                      <>
                                        <div>
                                          Defesa: <span className="text-blue-400">{result.userStats.defense}</span>
                                        </div>
                                        <div>
                                          Absorção: <span className="text-blue-400">{result.userStats.absorption}</span>
                                        </div>
                                      </>
                                    )}
                                  </>
                                )}
                              </div>
                            </div>

                            <div>
                              <h4 className="text-sm font-semibold text-gray-300 mb-2">Como ficaria Limpo</h4>
                              <div className="bg-gray-700 rounded p-3 space-y-1 text-sm">
                                {selectedItemData.category === "armas" ? (
                                  <>
                                    <div>
                                      Atq min: <span className="text-blue-400">{result.calculatedClean.min}</span>
                                      <span className="text-gray-400"> / </span>
                                      <span className="text-green-400">{result.perfectClean.min}</span>
                                    </div>
                                    <div>
                                      Atq max: <span className="text-blue-400">{result.calculatedClean.max}</span>
                                      <span className="text-gray-400"> / </span>
                                      <span className="text-green-400">{result.perfectClean.max}</span>
                                    </div>
                                    {selectedItemData.type !== "Arcos" && (
                                      <div>
                                        Taxa atq: <span className="text-blue-400">{result.calculatedClean.rate}</span>
                                        <span className="text-gray-400"> / </span>
                                        <span className="text-green-400">{result.perfectClean.rate}</span>
                                      </div>
                                    )}
                                  </>
                                ) : (
                                  <>
                                    {selectedItemData.type === "escudo" ? (
                                      <>
                                        <div>
                                          Bloqueio:{" "}
                                          <span className="text-blue-400">{result.calculatedClean.block}</span>
                                          <span className="text-gray-400"> / </span>
                                          <span className="text-green-400">{result.perfectClean.block || 0}</span>
                                        </div>
                                        <div>
                                          Absorção:{" "}
                                          <span className="text-blue-400">{result.calculatedClean.absorption}</span>
                                          <span className="text-gray-400"> / </span>
                                          <span className="text-green-400">{result.perfectClean.absorption || 0}</span>
                                        </div>
                                      </>
                                    ) : selectedItemData.type === "bracelete" ? (
                                      <>
                                        <div>
                                          Defesa:{" "}
                                          <span className="text-blue-400">{result.calculatedClean.defense}</span>
                                          <span className="text-gray-400"> / </span>
                                          <span className="text-green-400">{result.perfectClean.defense}</span>
                                        </div>
                                        <div>
                                          Taxa atq:{" "}
                                          <span className="text-blue-400">{result.calculatedClean.attack}</span>
                                          <span className="text-gray-400"> / </span>
                                          <span className="text-green-400">{result.perfectClean.attack || 0}</span>
                                        </div>
                                      </>
                                    ) : (
                                      <>
                                        <div>
                                          Defesa:{" "}
                                          <span className="text-blue-400">{result.calculatedClean.defense}</span>
                                          <span className="text-gray-400"> / </span>
                                          <span className="text-green-400">{result.perfectClean.defense}</span>
                                        </div>
                                        <div>
                                          Absorção:{" "}
                                          <span className="text-blue-400">{result.calculatedClean.absorption}</span>
                                          <span className="text-gray-400"> / </span>
                                          <span className="text-green-400">{result.perfectClean.absorption || 0}</span>
                                        </div>
                                      </>
                                    )}
                                  </>
                                )}
                              </div>
                              <div className="text-xs text-gray-400 mt-1">Calculado / Perfeito</div>
                            </div>
                          </div>

                          <div className="bg-gray-700 rounded-lg p-4">
                            <h4 className="text-lg font-semibold text-white mb-3 flex items-center">
                              <Sparkles className="w-5 h-5 mr-2" />
                              Análise de Perfeição
                            </h4>

                            {(() => {
                              const isPerfect =
                                selectedItemData?.category === "armas"
                                  ? result.deltas.min === 0 &&
                                    result.deltas.max === 0 &&
                                    (selectedItemData?.type === "Arcos" || result.deltas.rate === 0)
                                  : selectedItemData?.type === "escudo"
                                    ? result.deltas.block === 0 && result.deltas.absorption === 0
                                    : selectedItemData?.type === "bracelete"
                                      ? result.deltas.defense === 0 && result.deltas.attack === 0
                                      : result.deltas.defense === 0 && result.deltas.absorption === 0

                              return isPerfect ? (
                                <div className="flex items-center p-3 bg-green-900/30 border border-green-600 rounded-lg">
                                  <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                                  <span className="text-green-400 font-semibold">
                                    ✓ Item estava PERFEITO quando limpo! O aging foi aplicado corretamente.
                                  </span>
                                </div>
                              ) : (
                                <div className="space-y-2">
                                  <div className="flex items-center p-3 bg-red-900/30 border border-red-600 rounded-lg mb-3">
                                    <div className="w-3 h-3 bg-red-500 rounded-full mr-3"></div>
                                    <span className="text-red-400 font-semibold">
                                      ✗ Item NÃO estava perfeito quando limpo
                                    </span>
                                  </div>

                                  <div className="text-sm space-y-1">
                                    {selectedItemData?.category === "armas" ? (
                                      <>
                                        {result.deltas.min !== 0 && (
                                          <div className={result.deltas.min > 0 ? "text-green-400" : "text-red-400"}>
                                            • Ataque min: {result.deltas.min > 0 ? "+" : ""}
                                            {result.deltas.min} pontos {result.deltas.min > 0 ? "acima" : "abaixo"} do
                                            perfeito
                                          </div>
                                        )}
                                        {result.deltas.max !== 0 && (
                                          <div className={result.deltas.max > 0 ? "text-green-400" : "text-red-400"}>
                                            • Ataque max: {result.deltas.max > 0 ? "+" : ""}
                                            {result.deltas.max} pontos {result.deltas.max > 0 ? "acima" : "abaixo"} do
                                            perfeito
                                          </div>
                                        )}
                                        {selectedItemData?.type !== "Arcos" && result.deltas.rate !== 0 && (
                                          <div className={result.deltas.rate > 0 ? "text-green-400" : "text-red-400"}>
                                            • Taxa de ataque: {result.deltas.rate > 0 ? "+" : ""}
                                            {result.deltas.rate} pontos {result.deltas.rate > 0 ? "acima" : "abaixo"} do
                                            perfeito
                                          </div>
                                        )}
                                      </>
                                    ) : (
                                      <>
                                        {selectedItemData?.type === "escudo" ? (
                                          <>
                                            {result.deltas.block !== 0 && (
                                              <div
                                                className={result.deltas.block > 0 ? "text-green-400" : "text-red-400"}
                                              >
                                                • Bloqueio: {result.deltas.block > 0 ? "+" : ""}
                                                {result.deltas.block.toFixed(1)} pontos{" "}
                                                {result.deltas.block > 0 ? "acima" : "abaixo"} do perfeito
                                              </div>
                                            )}
                                            {result.deltas.absorption !== 0 && (
                                              <div
                                                className={
                                                  result.deltas.absorption > 0 ? "text-green-400" : "text-red-400"
                                                }
                                              >
                                                • Absorção: {result.deltas.absorption > 0 ? "+" : ""}
                                                {result.deltas.absorption.toFixed(1)} pontos{" "}
                                                {result.deltas.absorption > 0 ? "acima" : "abaixo"} do perfeito
                                              </div>
                                            )}
                                          </>
                                        ) : selectedItemData?.type === "bracelete" ? (
                                          <>
                                            {result.deltas.defense !== 0 && (
                                              <div
                                                className={
                                                  result.deltas.defense > 0 ? "text-green-400" : "text-red-400"
                                                }
                                              >
                                                • Defesa: {result.deltas.defense > 0 ? "+" : ""}
                                                {result.deltas.defense} pontos{" "}
                                                {result.deltas.defense > 0 ? "acima" : "abaixo"} do perfeito
                                              </div>
                                            )}
                                            {result.deltas.attack !== 0 && (
                                              <div
                                                className={result.deltas.attack > 0 ? "text-green-400" : "text-red-400"}
                                              >
                                                • Taxa de ataque: {result.deltas.attack > 0 ? "+" : ""}
                                                {result.deltas.attack} pontos{" "}
                                                {result.deltas.attack > 0 ? "acima" : "abaixo"} do perfeito
                                              </div>
                                            )}
                                          </>
                                        ) : (
                                          <>
                                            {result.deltas.defense !== 0 && (
                                              <div
                                                className={
                                                  result.deltas.defense > 0 ? "text-green-400" : "text-red-400"
                                                }
                                              >
                                                • Defesa: {result.deltas.defense > 0 ? "+" : ""}
                                                {result.deltas.defense} pontos{" "}
                                                {result.deltas.defense > 0 ? "acima" : "abaixo"} do perfeito
                                              </div>
                                            )}
                                            {result.deltas.absorption !== 0 && (
                                              <div
                                                className={
                                                  result.deltas.absorption > 0 ? "text-green-400" : "text-red-400"
                                                }
                                              >
                                                • Absorção: {result.deltas.absorption > 0 ? "+" : ""}
                                                {result.deltas.absorption.toFixed(1)} pontos{" "}
                                                {result.deltas.absorption > 0 ? "acima" : "abaixo"} do perfeito
                                              </div>
                                            )}
                                          </>
                                        )}
                                      </>
                                    )}
                                  </div>
                                </div>
                              )
                            })()}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Calculator className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400 text-lg">Selecione um item e configure os parâmetros para calcular</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
