import { Order, CartItem } from '../types';
import { formatCFA } from './formatters';

export const WHATSAPP_BUSINESS_URL = "https://wa.me/message/QJ4AAYTVECKYG1";

export function buildWhatsAppOrderMessage(order: Order): string {
  const itemsText = order.items
    .map(
      (item) =>
        `• ${item.quantity}x *${item.product.name}*` +
        (item.selectedSize ? ` [Taille: ${item.selectedSize}]` : '') +
        (item.selectedColor ? ` [Couleur: ${item.selectedColor}]` : '') +
        ` → ${formatCFA(item.product.price * item.quantity)}`
    )
    .join('\n');

  const addr = order.shippingAddress;
  const addressText = addr
    ? `\n👤 *Client:* ${addr.fullName}\n📧 *E-mail:* ${addr.email}\n📍 *Adresse:* ${addr.address}, ${addr.postalCode} ${addr.city}`
    : '';

  const message =
`🛍️ *NOUVELLE COMMANDE - MORTUTO-SHOP*
----------------------------------
🆔 *N° Commande:* ${order.id}
📅 *Date:* ${order.date}${addressText}

📦 *ARTICLES:*
${itemsText}

💰 *TOTAL:* *${formatCFA(order.totalAmount)}*
----------------------------------
Bonjour mortuto-shop ! Je viens d'effectuer cette commande et je souhaite la valider avec vous sur WhatsApp.`;

  return message;
}

export function buildWhatsAppCartMessage(cartItems: CartItem[], totalAmount: number): string {
  const itemsText = cartItems
    .map(
      (item) =>
        `• ${item.quantity}x *${item.product.name}*` +
        (item.selectedSize ? ` [Taille: ${item.selectedSize}]` : '') +
        (item.selectedColor ? ` [Couleur: ${item.selectedColor}]` : '') +
        ` → ${formatCFA(item.product.price * item.quantity)}`
    )
    .join('\n');

  const message =
`🛒 *MON PANIER MORTUTO-SHOP*
----------------------------------
📦 *ARTICLES:*
${itemsText}

💰 *ESTIMATION TOTAL:* *${formatCFA(totalAmount)}*
----------------------------------
Bonjour mortuto-shop ! Je souhaite commander ces articles présents dans mon panier.`;

  return message;
}

export function openWhatsAppOrder(order: Order) {
  const text = buildWhatsAppOrderMessage(order);
  const url = `${WHATSAPP_BUSINESS_URL}?text=${encodeURIComponent(text)}`;
  window.open(url, '_blank');
}

export function openWhatsAppCart(cartItems: CartItem[], totalAmount: number) {
  const text = buildWhatsAppCartMessage(cartItems, totalAmount);
  const url = `${WHATSAPP_BUSINESS_URL}?text=${encodeURIComponent(text)}`;
  window.open(url, '_blank');
}
