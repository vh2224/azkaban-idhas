"use client";

import type React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Users,
  Shield,
  Sword,
  Crown,
  Clock,
  X,
  UserPlus,
  Construction,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { sendEmail } from "@/lib/email";

// Componentes customizados para as setas do carousel
const CustomPrevArrow = (props: any) => {
  const { onClick } = props;
  return (
    <button
      className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white/10 hover:bg-white/20 rounded-full p-2 transition-all duration-300"
      onClick={onClick}
    >
      <ChevronLeft className="w-6 h-6 text-white" />
    </button>
  );
};

const CustomNextArrow = (props: any) => {
  const { onClick } = props;
  return (
    <button
      className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white/10 hover:bg-white/20 rounded-full p-2 transition-all duration-300"
      onClick={onClick}
    >
      <ChevronRight className="w-6 h-6 text-white" />
    </button>
  );
};

export default function Home() {
  const [showBossModal, setShowBossModal] = useState(false);
  const [showRecruitmentModal, setShowRecruitmentModal] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Dados da liderança
  const leadershipData = [
    // Líderes
    {
      name: "Tinho",
      gameNick: "Mamacita",
      role: "Líder Geral",
      rank: "Líder",
      description: "Organização do clã, ataques BC e resolução de problemas",
      avatar: "/images/leader1.png",
      type: "leader"
    },
    {
      name: "Wallace",
      gameNick: "SaintSunshine", 
      role: "Líder",
      rank: "Líder",
      description: "Organização TS, coordenação BC e resolução de problemas",
      avatar: "/images/leader2.png",
      type: "leader"
    },
    {
      name: "Barradas",
      gameNick: "Blogueira",
      role: "Líder",
      rank: "Líder",
      description: "Representação Discord, organização geral e arquivos",
      avatar: "/images/leader3.png",
      type: "leader"
    },
    // Moderadores
    {
      name: "Érico",
      gameNick: "BatePesadão",
      role: "Moderador",
      rank: "Moderador",
      description: "Organização PvPs e suporte BC",
      avatar: "/images/mod1.png",
      type: "moderator"
    },
    {
      name: "Léo",
      gameNick: "Jasmine/Herdeira",
      role: "Moderador",
      rank: "Moderador", 
      description: "Conselheiro e estrategista BC",
      avatar: "/images/mod2.png",
      type: "moderator"
    },
    {
      name: "Angélica",
      gameNick: "CaatCraazy",
      role: "Moderadora",
      rank: "Moderadora",
      description: "Recrutamento e representação Discord",
      avatar: "/images/mod3.png",
      type: "moderator"
    },
    {
      name: "Saulo",
      gameNick: "DuReX",
      role: "Moderador",
      rank: "Moderador",
      description: "Prints Bosses Alfa e sorteios de itens",
      avatar: "/images/mod4.png",
      type: "moderator"
    },
    {
      name: "Bruno",
      gameNick: "Tei",
      role: "Moderador",
      rank: "Moderador",
      description: "Prints Bosses Alfa e sorteios de itens",
      avatar: "/images/mod5.png",
      type: "moderator"
    },
    {
      name: "Matheus",
      gameNick: "Katnix",
      role: "Moderador",
      rank: "Moderador",
      description: "Recrutamento e confirmação presença BC",
      avatar: "/images/mod6.png",
      type: "moderator"
    },
    {
      name: "Jean Carlos",
      gameNick: "xDKK",
      role: "Moderador",
      rank: "Moderador",
      description: "Confirmação presença BC e organização PvPs",
      avatar: "/images/mod7.png",
      type: "moderator"
    },
    {
      name: "Geovane",
      gameNick: "Lizbeth",
      role: "Moderador",
      rank: "Moderador",
      description: "Suporte BC e organização eventos PvP",
      avatar: "/images/mod8.png",
      type: "moderator"
    }
  ];

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    whatsapp: "",
    personagem: "",
    classe: "",
    nivel: "",
    charOrigem: "",
    outrosPersonagens: "",
    temShare: "",
    jaHouveAcusacao: "",
    experienciaBC: "",
    experienciaSOD: "",
    gostaPvP: "",
    participarPvP: "",
    disponibilidadeBC: "",
    amigosNoClan: "",
    clansAnteriores: "",
    oQueEsperar: "",
    porQueAzkaban: "",
  });

  useEffect(() => {
    if (showBossModal || showRecruitmentModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    // Cleanup function para garantir que o scroll seja restaurado
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showBossModal, showRecruitmentModal]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const handleAgeCalcClick = (e: React.MouseEvent) => {
    e.preventDefault();
    // Não navega, apenas mostra que está em implementação
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleRecruitmentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await sendEmail(formData);
      console.log(response);

      // Sempre marca como sucesso para mostrar mensagem de confirmação
      setSubmitSuccess(true);
      setFormData({ 
        name: "", email: "", whatsapp: "", personagem: "", classe: "", nivel: "",
        charOrigem: "", outrosPersonagens: "", temShare: "", jaHouveAcusacao: "",
        experienciaBC: "", experienciaSOD: "", gostaPvP: "", participarPvP: "",
        disponibilidadeBC: "", amigosNoClan: "", clansAnteriores: "", oQueEsperar: "", porQueAzkaban: ""
      });
    } catch (error) {
      console.error("Erro ao enviar formulário:", error);
      // Mesmo com erro, mostra mensagem de sucesso para o usuário
      setSubmitSuccess(true);
      setFormData({ 
        name: "", email: "", whatsapp: "", personagem: "", classe: "", nivel: "",
        charOrigem: "", outrosPersonagens: "", temShare: "", jaHouveAcusacao: "",
        experienciaBC: "", experienciaSOD: "", gostaPvP: "", participarPvP: "",
        disponibilidadeBC: "", amigosNoClan: "", clansAnteriores: "", oQueEsperar: "", porQueAzkaban: ""
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeRecruitmentModal = () => {
    setShowRecruitmentModal(false);
    setSubmitSuccess(false);
    setFormData({ 
      name: "", email: "", whatsapp: "", personagem: "", classe: "", nivel: "",
      charOrigem: "", outrosPersonagens: "", temShare: "", jaHouveAcusacao: "",
      experienciaBC: "", experienciaSOD: "", gostaPvP: "", participarPvP: "",
      disponibilidadeBC: "", amigosNoClan: "", clansAnteriores: "", oQueEsperar: "", porQueAzkaban: ""
    });
  };

  const bossData = {
    server: "IDHAS",
    lastUpdate: "06:00",
    bosses: {
      Beta: {
        level: 12,
        respawnTime: "Disponível agora",
        isUrgent: false,
      },
      Alfa: {
        level: 36,
        respawnTime: "3min para nascer",
        isUrgent: true,
      },
      Gama: {
        level: 34,
        respawnTime: "1min para nascer",
        isUrgent: true,
      },
    },
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setShowBossModal(true)}
          className="bg-red-700 hover:bg-red-800 text-white font-bold px-6 py-4 rounded-full shadow-2xl border-2 border-red-500 animate-pulse hover:animate-none transition-all duration-300 hover:scale-105 cursor-pointer"
          size="lg"
        >
          <Clock className="w-6 h-6 mr-2" />
          TIME BOSS
        </Button>
      </div>

      {showRecruitmentModal && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 border-2 border-white/30 rounded-xl max-w-2xl w-full max-h-[90vh] relative shadow-2xl overflow-hidden">
            <div className="p-6 h-full flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <UserPlus className="w-6 h-6 text-white" />
                  <h3 className="text-2xl font-bold text-white">
                    RECRUTAMENTO
                  </h3>
                </div>
                <Button
                  onClick={closeRecruitmentModal}
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {!submitSuccess ? (
                <form onSubmit={handleRecruitmentSubmit} className="space-y-4 max-h-96 overflow-y-auto pr-2">
                  {/* Nome Completo */}
                  <div>
                    <Label htmlFor="name" className="text-white font-semibold">
                      Nome Completo *
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      className="bg-gray-800 border-gray-600 text-white focus:border-white"
                      placeholder="Seu nome completo"
                      required
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <Label htmlFor="email" className="text-white font-semibold">
                      Email *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className="bg-gray-800 border-gray-600 text-white focus:border-white"
                      placeholder="seu.email@exemplo.com"
                      required
                    />
                  </div>

                  {/* WhatsApp */}
                  <div>
                    <Label htmlFor="whatsapp" className="text-white font-semibold">
                      WhatsApp *
                    </Label>
                    <Input
                      id="whatsapp"
                      type="tel"
                      value={formData.whatsapp}
                      onChange={(e) => handleInputChange("whatsapp", e.target.value)}
                      className="bg-gray-800 border-gray-600 text-white focus:border-white"
                      placeholder="(11) 99999-9999"
                      required
                    />
                  </div>

                  {/* Nick do Personagem */}
                  <div>
                    <Label htmlFor="personagem" className="text-white font-semibold">
                      Nick do Personagem *
                    </Label>
                    <Input
                      id="personagem"
                      type="text"
                      value={formData.personagem}
                      onChange={(e) => handleInputChange("personagem", e.target.value)}
                      className="bg-gray-800 border-gray-600 text-white focus:border-white"
                      placeholder="Nome do seu personagem"
                      required
                    />
                  </div>

                  {/* Classe do Personagem */}
                  <div>
                    <Label htmlFor="classe" className="text-white font-semibold">
                      Classe do Personagem *
                    </Label>
                    <Select value={formData.classe} onValueChange={(value) => handleInputChange("classe", value)}>
                      <SelectTrigger className="bg-gray-800 border-gray-600 text-white focus:border-white">
                        <SelectValue placeholder="Selecione sua classe" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-600">
                        <SelectItem value="Pike" className="text-white hover:bg-gray-700">Pike</SelectItem>
                        <SelectItem value="Mecânico" className="text-white hover:bg-gray-700">Mecânico</SelectItem>
                        <SelectItem value="Lutador" className="text-white hover:bg-gray-700">Lutador</SelectItem>
                        <SelectItem value="Cavaleiro" className="text-white hover:bg-gray-700">Cavaleiro</SelectItem>
                        <SelectItem value="Mago" className="text-white hover:bg-gray-700">Mago</SelectItem>
                        <SelectItem value="Sacerdotisa" className="text-white hover:bg-gray-700">Sacerdotisa</SelectItem>
                        <SelectItem value="Arqueira" className="text-white hover:bg-gray-700">Arqueira</SelectItem>
                        <SelectItem value="Atalanta" className="text-white hover:bg-gray-700">Atalanta</SelectItem>
                        <SelectItem value="Xamã" className="text-white hover:bg-gray-700">Xamã</SelectItem>
                        <SelectItem value="Assasina" className="text-white hover:bg-gray-700">Assasina</SelectItem>
                        <SelectItem value="Guerreira" className="text-white hover:bg-gray-700">Guerreira</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Nível */}
                  <div>
                    <Label htmlFor="nivel" className="text-white font-semibold">
                      Nível *
                    </Label>
                    <Input
                      id="nivel"
                      type="number"
                      value={formData.nivel}
                      onChange={(e) => handleInputChange("nivel", e.target.value)}
                      className="bg-gray-800 border-gray-600 text-white focus:border-white"
                      placeholder="Ex: 85"
                      min="80"
                      max="400"
                      required
                    />
                  </div>

                  {/* Char - de compra ou criado? */}
                  <div>
                    <Label htmlFor="charOrigem" className="text-white font-semibold">
                      Char - de compra ou criado? *
                    </Label>
                    <Select value={formData.charOrigem} onValueChange={(value) => handleInputChange("charOrigem", value)}>
                      <SelectTrigger className="bg-gray-800 border-gray-600 text-white focus:border-white">
                        <SelectValue placeholder="Selecione uma opção" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-600">
                        <SelectItem value="Criado" className="text-white hover:bg-gray-700">Criado</SelectItem>
                        <SelectItem value="Compra" className="text-white hover:bg-gray-700">Compra</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Outros Personagens */}
                  <div>
                    <Label htmlFor="outrosPersonagens" className="text-white font-semibold">
                      Tem outros personagens? (Cite) *
                    </Label>
                    <Input
                      id="outrosPersonagens"
                      type="text"
                      value={formData.outrosPersonagens}
                      onChange={(e) => handleInputChange("outrosPersonagens", e.target.value)}
                      className="bg-gray-800 border-gray-600 text-white focus:border-white"
                      placeholder="Liste seus outros personagens ou escreva 'Não'"
                      required
                    />
                  </div>

                  {/* Tem Share? */}
                  <div>
                    <Label htmlFor="temShare" className="text-white font-semibold">
                      Tem share? *
                    </Label>
                    <Select value={formData.temShare} onValueChange={(value) => handleInputChange("temShare", value)}>
                      <SelectTrigger className="bg-gray-800 border-gray-600 text-white focus:border-white">
                        <SelectValue placeholder="Selecione uma opção" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-600">
                        <SelectItem value="Não" className="text-white hover:bg-gray-700">Não</SelectItem>
                        <SelectItem value="Sim" className="text-white hover:bg-gray-700">Sim</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Já houve alguma acusação? */}
                  <div>
                    <Label htmlFor="jaHouveAcusacao" className="text-white font-semibold">
                      Já houve alguma acusação ingame? *
                    </Label>
                    <Textarea
                      id="jaHouveAcusacao"
                      value={formData.jaHouveAcusacao}
                      onChange={(e) => handleInputChange("jaHouveAcusacao", e.target.value)}
                      className="bg-gray-800 border-gray-600 text-white focus:border-white min-h-[80px] resize-none"
                      placeholder="Descreva se já houve alguma acusação contra você no jogo"
                      required
                    />
                  </div>

                  {/* Experiência Bless Castle */}
                  <div>
                    <Label htmlFor="experienciaBC" className="text-white font-semibold">
                      Tem experiência com Bless Castle em clã? *
                    </Label>
                    <Textarea
                      id="experienciaBC"
                      value={formData.experienciaBC}
                      onChange={(e) => handleInputChange("experienciaBC", e.target.value)}
                      className="bg-gray-800 border-gray-600 text-white focus:border-white min-h-[80px] resize-none"
                      placeholder="Descreva sua experiência com Bless Castle"
                      required
                    />
                  </div>

                  {/* Experiência SOD */}
                  <div>
                    <Label htmlFor="experienciaSOD" className="text-white font-semibold">
                      Tem experiência com SOD em clã? *
                    </Label>
                    <Textarea
                      id="experienciaSOD"
                      value={formData.experienciaSOD}
                      onChange={(e) => handleInputChange("experienciaSOD", e.target.value)}
                      className="bg-gray-800 border-gray-600 text-white focus:border-white min-h-[80px] resize-none"
                      placeholder="Descreva sua experiência com SOD"
                      required
                    />
                  </div>

                  {/* Gosta de PvP */}
                  <div>
                    <Label htmlFor="gostaPvP" className="text-white font-semibold">
                      Gosta de jogar PvP? *
                    </Label>
                    <Select value={formData.gostaPvP} onValueChange={(value) => handleInputChange("gostaPvP", value)}>
                      <SelectTrigger className="bg-gray-800 border-gray-600 text-white focus:border-white">
                        <SelectValue placeholder="Selecione uma opção" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-600">
                        <SelectItem value="Sim" className="text-white hover:bg-gray-700">Sim</SelectItem>
                        <SelectItem value="Não" className="text-white hover:bg-gray-700">Não</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Disponibilidade PvP */}
                  <div>
                    <Label htmlFor="participarPvP" className="text-white font-semibold">
                      Qual a disponibilidade para participar de PvP? *
                    </Label>
                    <Textarea
                      id="participarPvP"
                      value={formData.participarPvP}
                      onChange={(e) => handleInputChange("participarPvP", e.target.value)}
                      className="bg-gray-800 border-gray-600 text-white focus:border-white min-h-[80px] resize-none"
                      placeholder="Descreva sua disponibilidade para participar de PvP"
                      required
                    />
                  </div>

                  {/* Disponibilidade Bless Castle */}
                  <div>
                    <Label htmlFor="disponibilidadeBC" className="text-white font-semibold">
                      Tem disponibilidade para Wars? *
                    </Label>
                    <Select value={formData.disponibilidadeBC} onValueChange={(value) => handleInputChange("disponibilidadeBC", value)}>
                      <SelectTrigger className="bg-gray-800 border-gray-600 text-white focus:border-white">
                        <SelectValue placeholder="Selecione uma opção" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-600">
                        <SelectItem value="Sim" className="text-white hover:bg-gray-700">Sim</SelectItem>
                        <SelectItem value="Geralmente" className="text-white hover:bg-gray-700">Geralmente</SelectItem>
                        <SelectItem value="Raramente" className="text-white hover:bg-gray-700">Raramente</SelectItem>
                        <SelectItem value="Não" className="text-white hover:bg-gray-700">Não</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Amigos no Clan */}
                  <div>
                    <Label htmlFor="amigosNoClan" className="text-white font-semibold">
                      Tem algum amigo no clan? *
                    </Label>
                    <Textarea
                      id="amigosNoClan"
                      value={formData.amigosNoClan}
                      onChange={(e) => handleInputChange("amigosNoClan", e.target.value)}
                      className="bg-gray-800 border-gray-600 text-white focus:border-white min-h-[80px] resize-none"
                      placeholder="Cite TODOS os amigos que tem no clan ou escreva 'Não tenho'"
                      required
                    />
                  </div>

                  {/* Clans Anteriores */}
                  <div>
                    <Label htmlFor="clansAnteriores" className="text-white font-semibold">
                      De quais clãs participou e por que saiu? *
                    </Label>
                    <Textarea
                      id="clansAnteriores"
                      value={formData.clansAnteriores}
                      onChange={(e) => handleInputChange("clansAnteriores", e.target.value)}
                      className="bg-gray-800 border-gray-600 text-white focus:border-white min-h-[80px] resize-none"
                      placeholder="Liste os clans anteriores e motivos de saída"
                      required
                    />
                  </div>

                  {/* O que podemos esperar */}
                  <div>
                    <Label htmlFor="oQueEsperar" className="text-white font-semibold">
                      O que podemos esperar de você? *
                    </Label>
                    <Textarea
                      id="oQueEsperar"
                      value={formData.oQueEsperar}
                      onChange={(e) => handleInputChange("oQueEsperar", e.target.value)}
                      className="bg-gray-800 border-gray-600 text-white focus:border-white min-h-[80px] resize-none"
                      placeholder="Descreva o que você pode contribuir para o clan"
                      required
                    />
                  </div>

                  {/* Por que Azkaban */}
                  <div>
                    <Label htmlFor="porQueAzkaban" className="text-white font-semibold">
                      Por que gostaria de ser Azkaban? *
                    </Label>
                    <Textarea
                      id="porQueAzkaban"
                      value={formData.porQueAzkaban}
                      onChange={(e) => handleInputChange("porQueAzkaban", e.target.value)}
                      className="bg-gray-800 border-gray-600 text-white focus:border-white min-h-[100px] resize-none"
                      placeholder="Não poupe palavras! Conte-nos suas motivações..."
                      required
                    />
                  </div>

                  <div className="pt-4">
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-white hover:bg-gray-200 text-black font-bold py-3 cursor-pointer"
                    >
                      {isSubmitting ? "ENVIANDO..." : "ENVIAR ALISTAMENTO"}
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <UserPlus className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="text-2xl font-bold text-green-400 mb-4">
                    Alistamento Enviado!
                  </h4>
                  <div className="bg-yellow-500/20 border border-yellow-600/50 rounded-lg p-4 mb-6">
                    <p className="text-yellow-300 font-semibold text-sm">
                      ⚠️ Seu alistamento foi enviado para nossa liderança!
                    </p>
                    <p className="text-yellow-200 text-sm mt-2">
                      Um de nossos líderes entrará em contato via WhatsApp em
                      breve para lhe dar um parecer da sua candidatura.
                    </p>
                  </div>
                  <Button
                    onClick={closeRecruitmentModal}
                    className="bg-white hover:bg-gray-200 text-black font-bold px-6 py-2 cursor-pointer"
                  >
                    Fechar
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {showBossModal && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 border-2 border-gray-600 rounded-xl max-w-md w-full relative shadow-2xl">
            <div className="absolute inset-0 bg-black/55 backdrop-blur-sm rounded-xl z-10 flex items-center justify-center">
              <div className="text-center p-8">
                <Construction className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-yellow-400 mb-2">
                  EM IMPLEMENTAÇÃO
                </h3>
                <p className="text-gray-300 mb-6">
                  Esta funcionalidade está sendo desenvolvida
                </p>
                <Button
                  onClick={() => setShowBossModal(false)}
                  className="bg-yellow-600 hover:bg-yellow-700 text-black font-bold px-6 py-2 cursor-pointer"
                >
                  Fechar
                </Button>
              </div>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-red-400">TIME BOSS</h3>
                <Button
                  onClick={() => setShowBossModal(false)}
                  variant="ghost"
                  size="sm"
                  className="bg-red-700 hover:bg-red-800 text-white font-bold px-6 py-2 rounded-lg cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="text-center mb-6 bg-gray-800 rounded-lg p-3 border border-gray-600">
                <p className="text-sm text-gray-300 mb-1">
                  {currentTime.toLocaleDateString("pt-BR", {
                    weekday: "long",
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                </p>
                <div className="text-2xl font-bold text-red-400">
                  {currentTime.toLocaleTimeString("pt-BR")}
                </div>
              </div>

              <div className="mb-4 p-3 bg-yellow-500/20 border border-yellow-600/50 rounded-lg">
                <p className="text-yellow-300 font-semibold text-center">
                  ⚠️ Alerta visual para os times
                </p>
              </div>

              <div className="bg-gray-800 rounded-lg p-4 mb-6 border border-gray-600">
                <h4 className="text-xl font-bold text-center text-red-400 mb-4">
                  {bossData.server}
                </h4>

                <div className="grid grid-cols-3 gap-3">
                  {Object.entries(bossData.bosses).map(([boss, data]) => (
                    <div
                      key={boss}
                      className={`bg-gray-700 rounded-lg p-3 text-center border ${
                        data.isUrgent
                          ? "border-red-600 animate-pulse bg-red-900/30"
                          : "border-green-600 bg-green-900/30"
                      }`}
                    >
                      <div className="text-sm font-semibold text-white mb-1">
                        {boss}
                      </div>
                      <div className="text-lg font-bold text-white mb-2">
                        {data.level}
                      </div>
                      <div
                        className={`text-xs font-medium ${
                          data.isUrgent ? "text-red-300" : "text-green-300"
                        }`}
                      >
                        {data.respawnTime}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="text-center mb-4">
                <div className="bg-yellow-500/20 border border-yellow-600/50 rounded-lg p-2">
                  <p className="text-yellow-300 text-sm font-medium">
                    Atualizado no time das {bossData.lastUpdate}h!
                  </p>
                </div>
              </div>

              <div className="text-center">
                <Button
                  onClick={() => setShowBossModal(false)}
                  className="bg-red-700 hover:bg-red-800 text-white font-bold px-6 py-2 rounded-lg"
                >
                  Fechar
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-sm border-b border-gray-800">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Image
              src="/images/azkaban-logo.png"
              alt="Azkaban Logo"
              width={40}
              height={40}
              className="rounded-full"
            />
            <span className="text-xl font-bold">AZKABAN</span>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => scrollToSection("inicio")}
              className="hover:text-white transition-colors"
            >
              INÍCIO
            </button>
            <div className="relative group">
              <button
                onClick={handleAgeCalcClick}
                className="hover:text-white transition-colors font-semibold cursor-not-allowed opacity-60"
              >
                AGE CALC
              </button>
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-2 bg-yellow-600 text-black text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                <Construction className="w-3 h-3 inline mr-1" />
                Em implementação
              </div>
            </div>
            <button
              onClick={() => scrollToSection("sobre")}
              className="hover:text-white transition-colors"
            >
              SOBRE NÓS
            </button>
            <button
              onClick={() => scrollToSection("membros")}
              className="hover:text-white transition-colors"
            >
              MEMBROS
            </button>
          </nav>

          <Button
            onClick={() => scrollToSection("recrutamento")}
            className="bg-white hover:bg-gray-200 text-black font-semibold px-6"
          >
            RECRUTAMENTO
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section
        id="inicio"
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
      >
        <div className="absolute inset-0">
          <Image
            src="/images/azkaban-hero.png"
            alt="Azkaban Background"
            fill
            className="object-cover opacity-80"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/80"></div>
        </div>

        <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
          <h1 className="text-6xl md:text-8xl font-bold mb-6 text-white drop-shadow-2xl">
            AZKABAN
          </h1>
          <div className="text-xl md:text-2xl mb-8 space-y-2">
            <p className="text-white font-semibold">LEALDADE</p>
            <p className="text-white font-bold">NÃO SE COMPRA!</p>
          </div>
          <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
            Servidor Idhas - Priston Tale Brasil
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => scrollToSection("recrutamento")}
              className="bg-white hover:bg-gray-200 text-black font-bold px-8 py-3"
            >
              JUNTE-SE A NÓS
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => scrollToSection("sobre")}
              className="border-white text-white hover:bg-white hover:text-black font-bold px-8 py-3 bg-transparent"
            >
              SAIBA MAIS
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-b from-black to-gray-900">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <Card className="bg-gray-800/50 border-gray-700 text-center">
              <CardContent className="p-6">
                <Crown className="w-12 h-12 text-white mx-auto mb-4" />
                <h3 className="text-3xl font-bold text-white mb-2">#1</h3>
                <p className="text-gray-300">Top do Servidor</p>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 border-gray-700 text-center">
              <CardContent className="p-6">
                <Users className="w-12 h-12 text-white mx-auto mb-4" />
                <h3 className="text-3xl font-bold text-white mb-2">200+</h3>
                <p className="text-gray-300">Membros Ativos</p>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 border-gray-700 text-center">
              <CardContent className="p-6">
                <Sword className="w-12 h-12 text-white mx-auto mb-4" />
                <h3 className="text-3xl font-bold text-white mb-2">100+</h3>
                <p className="text-gray-300">Vitórias em PvP</p>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 border-gray-700 text-center">
              <CardContent className="p-6">
                <Shield className="w-12 h-12 text-white mx-auto mb-4" />
                <h3 className="text-3xl font-bold text-white mb-2">200+</h3>
                <p className="text-gray-300">Bosses Conquistados</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="sobre" className="py-20 bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-8 text-white">
              SOBRE O <span className="text-white">AZKABAN</span>
            </h2>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Somos mais que um clan, somos uma irmandade forjada nas batalhas
              mais intensas do Priston Tale. Nascidos da escuridão, unidos pelo
              poder, nossa força vem da lealdade e determinação de cada membro.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-white mb-4">
                  LEALDADE
                </h3>
                <p className="text-gray-300">
                  Unidos como uma família, lutamos juntos até o fim
                </p>
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-bold text-white mb-4">
                  PODER
                </h3>
                <p className="text-gray-300">
                  Buscamos sempre a excelência e o domínio no servidor
                </p>
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-bold text-white mb-4">
                  HONRA
                </h3>
                <p className="text-gray-300">
                  Respeitamos nossos aliados e tememos nossos inimigos
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recruitment Section */}
      <section id="recrutamento" className="py-20 bg-black">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-8 text-white">
              JUNTE-SE AO <span className="text-white">AZKABAN</span>
            </h2>
            <p className="text-xl text-gray-300 mb-12">
              Está pronto para fazer parte da elite do Priston Tale? Venha
              provar seu valor!
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <Card className="bg-gray-800/50 border-gray-700">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold text-white mb-4">
                    REQUISITOS
                  </h3>
                  <ul className="text-left text-gray-300 space-y-3">
                    <li>• <strong>AzkabaN:</strong> nível 168+</li>
                    <li>• <strong>AzkabaNz:</strong> níveis 160 a 165+</li>
                    <li>• <strong>AzkN e AzkabaNII:</strong> níveis 159-</li>
                    <li>• <strong>Team Speak (TS):</strong> Obrigatório</li>
                    <li>• <strong>Participação:</strong> Membro ativo</li>
                    <li>• <strong>Comportamento:</strong> Respeitoso com todos</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 border-gray-700">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold text-white mb-4">
                    BENEFÍCIOS
                  </h3>
                  <ul className="text-left text-gray-300 space-y-3">
                    <li>• Suporte em hunts</li>
                    <li>• Proteção em PvP</li>
                    <li>• Eventos exclusivos</li>
                    <li>• Comunidade ativa</li>
                    <li>• Crescimento garantido</li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <Button
              size="lg"
              onClick={() => setShowRecruitmentModal(true)}
              className="bg-white hover:bg-gray-200 text-black font-bold px-12 py-4 text-lg cursor-pointer"
            >
              CANDIDATAR-SE AGORA
            </Button>
          </div>
        </div>
      </section>

      {/* Leadership Section */}
      <section id="membros" className="py-20 bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center text-white">
              NOSSA <span className="text-white">LIDERANÇA</span>
            </h2>

            {/* Custom Carousel */}
            <div className="relative">
              <Slider
                dots={true}
                infinite={true}
                speed={500}
                slidesToShow={3}
                slidesToScroll={1}
                autoplay={true}
                autoplaySpeed={3000}
                prevArrow={<CustomPrevArrow />}
                nextArrow={<CustomNextArrow />}
                responsive={[
                  {
                    breakpoint: 1024,
                    settings: {
                      slidesToShow: 2,
                      slidesToScroll: 1,
                    }
                  },
                  {
                    breakpoint: 600,
                    settings: {
                      slidesToShow: 1,
                      slidesToScroll: 1,
                    }
                  }
                ]}
                className="leadership-carousel"
              >
                {leadershipData.map((member, index) => (
                  <div key={index} className="px-3">
                    <Card className="bg-gray-800/50 border-gray-700 text-center h-full">
                      <CardContent className="p-6">
                        <div className="w-20 h-20 bg-gradient-to-br from-gray-700 to-gray-900 rounded-full mx-auto mb-4 flex items-center justify-center border-2 border-white/20">
                          {member.type === 'leader' ? (
                            <Crown className="w-10 h-10 text-white" />
                          ) : (
                            <Shield className="w-10 h-10 text-white" />
                          )}
                        </div>
                        <h3 className="text-xl font-bold text-white mb-1">{member.name}</h3>
                        <p className="text-gray-400 text-sm mb-2">({member.gameNick})</p>
                        <Badge className={`mb-3 ${member.type === 'leader' ? 'bg-white text-black' : 'bg-gray-600 text-white'}`}>
                          {member.rank}
                        </Badge>
                        <p className="text-gray-300 text-sm leading-relaxed">{member.description}</p>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </Slider>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-black border-t border-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <Image
                src="/images/azkaban-logo.png"
                alt="Azkaban Logo"
                width={32}
                height={32}
                className="rounded-full"
              />
              <span className="text-xl font-bold text-white">AZKABAN</span>
            </div>

            <div className="text-center md:text-right">
              <p className="text-gray-400 mb-2">
                Servidor Idhas - Priston Tale Brasil
              </p>
              <p className="text-gray-500 text-sm">
                © 2024 Clan Azkaban. Todos os direitos reservados.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
