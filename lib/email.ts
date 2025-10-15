import emailjs from "@emailjs/browser";

interface EmailData {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

// Configuração do EmailJS
const EMAILJS_CONFIG = {
  serviceId: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || "service_npjpw7n",
  templateId: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || "template_24r9hdd",
  publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || "qbCPhEhK_VbiW2E6A",
};

// Função para enviar email usando EmailJS (funciona no frontend)
export async function sendEmail(data: any): Promise<boolean> {
  const {
    name,
    email,
    whatsapp,
    personagem,
    classe,
    nivel,
    charOrigem,
    outrosPersonagens,
    temShare,
    jaHouveAcusacao,
    experienciaBC,
    experienciaSOD,
    gostaPvP,
    participarPvP,
    disponibilidadeBC,
    amigosNoClan,
    clansAnteriores,
    oQueEsperar,
    porQueAzkaban,
  } = data;

  try {
    const templateParams = {
      to_name: "Liderança Azkaban - Recrutamento",
      from_name: name,
      email: email,
      whatsapp: whatsapp,
      personagem: personagem,
      classe: classe,
      nivel: nivel,
      char_origem: charOrigem,
      outros_personagens: outrosPersonagens,
      tem_share: temShare,
      ja_houve_acusacao: jaHouveAcusacao,
      experiencia_bc: experienciaBC,
      experiencia_sod: experienciaSOD,
      gosta_pvp: gostaPvP,
      participar_pvp: participarPvP,
      disponibilidade_bc: disponibilidadeBC,
      amigos_no_clan: amigosNoClan,
      clans_anteriores: clansAnteriores,
      o_que_esperar: oQueEsperar,
      por_que_azkaban: porQueAzkaban,
      date: new Date().toLocaleString("pt-BR"),
      whatsapp_link: `https://wa.me/${whatsapp.replace(/\D/g, "")}`,
    };

    const result = await emailjs.send(
      EMAILJS_CONFIG.serviceId,
      EMAILJS_CONFIG.templateId,
      templateParams,
      EMAILJS_CONFIG.publicKey
    );

    console.log("Email enviado com sucesso:", result.text);
    return true;
  } catch (error) {
    console.error("Erro ao enviar email:", error);
    return false;
  }
}

// Função alternativa usando Resend via API Route (recomendado para produção)
export async function sendEmailViaAPI(data: any): Promise<boolean> {
  try {
    const response = await fetch("/api/send-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (response.ok) {
      console.log("Email enviado via API com sucesso");
      return true;
    } else {
      console.error("Erro na API de email:", result.message);
      return false;
    }
  } catch (error) {
    console.error("Erro ao enviar email via API:", error);
    return false;
  }
}

// Função alternativa usando Resend (recomendado para produção)
// Para usar esta função, instale: npm install resend
/*
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendEmailWithResend(emailData: EmailData): Promise<boolean> {
  try {
    const { data, error } = await resend.emails.send({
      from: emailData.from || 'noreply@seudominio.com',
      to: [emailData.to],
      subject: emailData.subject,
      html: emailData.html,
    })

    if (error) {
      console.error('Erro ao enviar email:', error)
      return false
    }

    console.log('Email enviado com sucesso:', data?.id)
    return true
  } catch (error) {
    console.error('Erro ao enviar email:', error)
    return false
  }
}
*/
