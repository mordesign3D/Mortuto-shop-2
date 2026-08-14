import { Order, CartItem } from '../types';
import { formatCFA } from './formatters';

// Numéro WhatsApp direct du propriétaire de la boutique mortuto-shop (Sénégal +221 77 178 86 56)
export const WHATSAPP_PHONE_NUMBER = "221771788656";
export const WHATSAPP_DISPLAY_NUMBER = "77 178 86 56 (+221)";
export const WHATSAPP_BUSINESS_URL = `https://wa.me/${WHATSAPP_PHONE_NUMBER}`;

export function buildWhatsAppOrderMessage(order: Order): string {
  const itemsText = order.items
    .map(
      (item) =>
        `• ${item.quantity}x *${item.product.name}*` +
        (item.selectedSize ? ` [Option/Taille: ${item.selectedSize}]` : '') +
        (item.selectedColor ? ` [Couleur: ${item.selectedColor}]` : '') +
        ` → ${formatCFA(item.product.price * item.quantity)}`
    )
    .join('\n');

  const addr = order.shippingAddress;
  const addressText = addr
    ? `\n👤 *Client:* ${addr.fullName}\n📞 *Téléphone:* ${addr.phone || 'Non renseigné'}\n📧 *E-mail:* ${addr.email}\n📍 *Adresse de livraison:* ${addr.address}, ${addr.postalCode} ${addr.city}`
    : '';

  const message =
`🛍️ *NOUVELLE COMMANDE - MORTUTO-SHOP*
----------------------------------
🆔 *N° Commande:* ${order.id}
📅 *Date:* ${order.date}${addressText}

📦 *DÉTAIL DES ARTICLES :*
${itemsText}

💰 *MONTANT TOTAL :* *${formatCFA(order.totalAmount)}*
----------------------------------
Bonjour mortuto-shop ! Je viens de finaliser cette commande sur votre boutique et je vous l'envoie directement sur votre compte WhatsApp 771788656 pour validation et livraison.`;

  return message;
}

export function buildWhatsAppCartMessage(cartItems: CartItem[], totalAmount: number): string {
  const itemsText = cartItems
    .map(
      (item) =>
        `• ${item.quantity}x *${item.product.name}*` +
        (item.selectedSize ? ` [Option/Taille: ${item.selectedSize}]` : '') +
        (item.selectedColor ? ` [Couleur: ${item.selectedColor}]` : '') +
        ` → ${formatCFA(item.product.price * item.quantity)}`
    )
    .join('\n');

  const message =
`🛒 *COMMANDE DIRECTE DU PANIER - MORTUTO-SHOP*
----------------------------------
📦 *ARTICLES SÉLECTIONNÉS :*
${itemsText}

💰 *TOTAL DU PANIER :* *${formatCFA(totalAmount)}*
----------------------------------
Bonjour mortuto-shop ! Je souhaite commander directement ces articles de mon panier vers votre compte WhatsApp (771788656). Merci de me donner les détails pour la livraison.`;

  return message;
}

export function openWhatsAppOrder(order: Order) {
  const text = buildWhatsAppOrderMessage(order);
  const url = `https://wa.me/${WHATSAPP_PHONE_NUMBER}?text=${encodeURIComponent(text)}`;
  window.open(url, '_blank');
}

export function openWhatsAppCart(cartItems: CartItem[], totalAmount: number) {
  const text = buildWhatsAppCartMessage(cartItems, totalAmount);
  const url = `https://wa.me/${WHATSAPP_PHONE_NUMBER}?text=${encodeURIComponent(text)}`;
  window.open(url, '_blank');
}

export function openWhatsAppReportIssue() {
  const text = `⚠️ *SIGNALEMENT DE PROBLÈME - MORTUTO-SHOP*
----------------------------------
Bonjour mortuto-shop ! Je rencontre un problème / j'ai une question concernant le site ou une commande. 
Détails : `;
  const url = `https://wa.me/${WHATSAPP_PHONE_NUMBER}?text=${encodeURIComponent(text)}`;
  window.open(url, '_blank');
}

