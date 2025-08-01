export const orderDelivered = (data: {
  deliveryCompany: string;
  trackingNumber: string;
  deliveryPin: string;
  orderNumber: string;
  currency: string;
  customerDetails: {
    email: string;
    name: string;
    phone: string;
  };
  items: Array<{
    productName: string;
    variantName: string;
    image?: string;
    quantity: number;
    unitPrice: string;
    lineTotal: string;
  }>;
  shippingAddress: {
    address: string;
    city?: string;
    state: string;
    postalCode?: string;
    country: string;
  };
}) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your order has been shipped!</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            line-height: 1.6;
            color: #333333;
            min-height: 100vh;
            padding: 20px 0;
        }
        
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            position: relative;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
            border-radius: 12px;
            overflow: hidden;
        }

        .gmail-bg-fallback {
            background-color: rgba(255, 255, 255, 0.02);
        }

        .email-container::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url('https://res.cloudinary.com/dmkomqw3p/image/upload/v1751045754/WALLPAPERMOBILE_ej2lzd.png') center/cover;
            opacity: 0.2;
            pointer-events: none;
            z-index: 1;
        }

        .header,
        .shipping-info,
        .tracking-section,
        .order-summary,
        .items-section,
        .addresses-section,
        .cta-section {
            position: relative;
            z-index: 2;
        }
        
        .header {
            padding: 40px;
            text-align: center;
            border-bottom: 2px solid #e8e8e8;
        }
        
        .header h1 {
            color: #C90016;
            font-size: 26px;
            font-weight: 700;
            margin-bottom: 12px;
            text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
        }
        
        .header p {
            color: #555;
            font-size: 16px;
            line-height: 1.5;
            max-width: 480px;
            margin: 0 auto;
        }

        .shipping-info {
            padding: 32px 40px;
            background: linear-gradient(135deg, rgba(0, 82, 53, 0.05) 0%, rgba(201, 0, 22, 0.05) 100%);
            border-bottom: 1px solid #e8e8e8;
        }

        .shipping-badge {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            background: #005235;
            color: white;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 14px;
            font-weight: 600;
            margin-bottom: 16px;
        }

        .shipping-status {
            font-size: 18px;
            font-weight: 700;
            color: #005235;
            margin-bottom: 8px;
        }

        .shipping-description {
            color: #666;
            font-size: 15px;
            line-height: 1.5;
        }
        
        .tracking-section {
            padding: 32px 40px;
            border-bottom: 1px solid #e8e8e8;
            background: rgba(201, 0, 22, 0.02);
        }

        .tracking-title {
            font-size: 20px;
            font-weight: 700;
            color: #C90016;
            margin-bottom: 20px;
            text-align: center;
        }

        .tracking-card {
            background: white;
            border: 2px solid #e8e8e8;
            border-radius: 12px;
            padding: 24px;
            text-align: center;
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
        }

        .tracking-number {
            font-size: 24px;
            font-weight: 700;
            color: #005235;
            font-family: 'Courier New', monospace;
            letter-spacing: 2px;
            margin-bottom: 16px;
            padding: 12px;
            background: rgba(0, 82, 53, 0.1);
            border-radius: 8px;
        }

        .logistics-info {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
            flex-wrap: wrap;
            gap: 16px;
        }

        .logistics-company {
            color: #666;
            font-size: 14px;
            font-weight: 600;
        }

        .delivery-pin {
            background: #C90016;
            color: white;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 14px;
            font-weight: 700;
        }

        .track-button {
            display: inline-block;
            background: linear-gradient(135deg, #005235 0%, #00693d 100%);
            color: white;
            padding: 14px 32px;
            border-radius: 8px;
            text-decoration: none;
            font-weight: 700;
            font-size: 16px;
            transition: transform 0.2s ease;
        }

        .track-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(0, 82, 53, 0.3);
        }

        .order-summary {
            padding: 24px 40px;
            border-bottom: 1px solid #e8e8e8;
        }
        
        .order-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
            gap: 16px;
        }
        
        .order-info {
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .order-label {
            color: #005235;
            font-weight: 600;
            font-size: 15px;
        }
        
        .order-number {
            color: #C90016;
            font-weight: 700;
            font-size: 18px;
        }
        
        .logo-container img {
            width: 90px;
            height: 90px;
            object-fit: contain;
            filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
        }
        
        .items-section {
            padding: 32px 40px;
            border-bottom: 1px solid #e8e8e8;
        }

        .items-title {
            font-size: 20px;
            font-weight: 700;
            color: #C90016;
            margin-bottom: 24px;
            padding-bottom: 8px;
            border-bottom: 2px solid rgba(201, 0, 22, 0.1);
        }
        
        .item {
            display: flex;
            align-items: flex-start;
            padding: 20px 0;
            border-bottom: 1px solid #f5f5f5;
        }
        .item:last-child {
            border-bottom: none;
        }
        
        .item-image {
            width: 100px;
            height: 120px;
            margin-right: 20px;
            border-radius: 6px;
            object-fit: cover;
        }
        
        .item-details {
            flex: 1;
        }
        
        .responsive-item-name {
            font-weight: 700;
            color: #005235;
            font-size: 15px;
            margin-bottom: 6px;
            line-height: 1.4;
        }
        
        .responsive-item-quantity {
            color: #666;
            font-size: 13px;
            margin-bottom: 4px;
            font-weight: 500;
        }
        
        .responsive-item-variant {
            color: #C90016;
            font-size: 13px;
            font-weight: 600;
            display: inline-block;
        }
        
        .responsive-item-total {
            color: #005235;
            font-weight: 700;
            font-size: 16px;
            text-align: right;
            min-width: 120px;
        }
        
        .addresses-section {
            padding: 32px 40px;
            border-bottom: 1px solid #e8e8e8;
        }
        
        .address-block {
            padding: 20px;
            border-radius: 8px;
        }
        
        .address-title {
            font-weight: 700;
            color: #005235;
            font-size: 16px;
            margin-bottom: 12px;
        }
        
        .address {
            color: #555;
            font-size: 14px;
            line-height: 1.6;
        }
        
        .cta-section {
            padding: 32px 40px;
            text-align: center;
        }
        
        .help-text {
            color: #666;
            font-size: 14px;
            line-height: 1.6;
        }
        
        .help-text a {
            color: #C90016;
            text-decoration: none;
            font-weight: 600;
            border-bottom: 1px solid rgba(201, 0, 22, 0.3);
        }
        
        .help-text a:hover {
            border-bottom-color: #C90016;
        }

        /* Gmail-specific overrides */
        u + .gmail-fix .email-container {
            background-color: rgba(201, 0, 22, 0.02) !important;
        }

        u + .gmail-fix .email-container::before {
            display: none !important;
        }

        .gmail-flex-fallback {
            display: table;
            width: 100%;
        }

        .gmail-flex-fallback .order-info,
        .gmail-flex-fallback .logo-container {
            display: table-cell;
            vertical-align: middle;
        }

        .gmail-flex-fallback .logo-container {
            text-align: right;
        }
        
        /* Mobile Responsive */
        @media (max-width: 600px) {
            body {
                padding: 10px 0;
            }
            
            .email-container {
                margin: 0 10px;
                border-radius: 8px;
            }
            
            .header,
            .shipping-info,
            .tracking-section,
            .order-summary,
            .items-section,
            .addresses-section,
            .cta-section {
                padding-left: 24px;
                padding-right: 24px;
            }
            
            .order-header,
            .gmail-flex-fallback {
                display: block !important;
                text-align: center;
            }

            .gmail-flex-fallback .order-info,
            .gmail-flex-fallback .logo-container {
                display: block !important;
                text-align: center !important;
                margin-bottom: 12px;
            }
            
            .item {
                display: block !important;
                text-align: center;
            }
            
            .item-image {
                margin: 0 auto 16px auto;
                display: block;
            }
            
            .responsive-item-total {
                text-align: center !important;
                margin-top: 12px;
                min-width: auto;
            }

            .responsive-item-name {
                font-size: 14px;
            }
            
            .responsive-item-quantity {
                font-size: 12px;
            }
            
            .responsive-item-variant {
                font-size: 12px;
            }
            
            .header h1 {
                font-size: 22px;
            }
            
            .header p {
                font-size: 15px;
            }
            
            .items-title {
                font-size: 18px;
            }

            .tracking-number {
                font-size: 20px;
                letter-spacing: 1px;
            }

            .logistics-info {
                display: block !important;
                text-align: center;
            }

            .logistics-company,
            .delivery-pin {
                display: block !important;
                margin-bottom: 12px;
            }

            .track-button {
                font-size: 14px;
                padding: 12px 24px;
            }
        }
        
        @media (max-width: 480px) {
            .header {
                padding: 24px 16px;
            }
            
            .header h1 {
                font-size: 20px;
            }
            
            .items-title {
                font-size: 16px;
            }

            .responsive-item-name {
                font-size: 13px;
            }
            
            .responsive-item-quantity {
                font-size: 11px;
            }
            
            .responsive-item-variant {
                font-size: 11px;
            }

            .responsive-item-total {
                font-size: 14px;
            }

            .tracking-card {
                padding: 16px;
            }

            .tracking-number {
                font-size: 18px;
            }
        }
    </style>
</head>
<body>
    <div class="gmail-fix">
        <div class="email-container gmail-bg-fallback">
            <!-- Header -->
            <div class="header">
                <h1>Your order is on it's way!</h1>
                <p>Hey ${data.customerDetails.name}, Your IYLMIBS order has been shipped. Track your package using the details below.</p>
            </div>

            <!-- Shipping Status -->
            <div class="shipping-info">
                <div class="shipping-status">Package has been Shipped</div>
                <div class="shipping-description">Thank you for your patience! Your order has been processed and is now with our delivery partner. Expected delivery within 1-4 business days.</div>
            </div>

            <!-- Tracking Information -->
            <div class="tracking-section">
                <div class="tracking-title">Track Your Package</div>
                <div class="tracking-card">
                    <div class="tracking-number">${data.deliveryPin}</div>
                    
                    <div class="logistics-info">
                        <div class="logistics-company">📦 Delivered by: ${data.deliveryCompany}</div>
                        <div class="delivery-pin">🔐 Delivery PIN: ${data.deliveryPin}</div>
                    </div>

                    <a href="https://giglogistics.com/track/${data.trackingNumber}" class="track-button">Track Your Package</a>
                </div>
            </div>

            <!-- Order Summary -->
            <div class="order-summary">
                <div class="order-header gmail-flex-fallback">
                    <div class="order-info">
                        <span class="order-label">Order number</span>
                        <span class="order-number"> # ${data.orderNumber}</span>
                    </div>
                    <div class="logo-container">
                        <img src="https://res.cloudinary.com/dmkomqw3p/image/upload/v1749643809/1_demtho.png" alt="IYLMIBS Logo">
                    </div>
                </div>
            </div>

            <!-- Items Section -->
            <div class="items-section">
                <div class="items-title">Items being shipped (${data.items.length} item${data.items.length === 1 ? '' : 's'})</div>

                ${data.items
                  .map(
                    (item) => `
                    <!-- Gmail-compatible item structure -->
                    <div class="item">
                       <div class="item" style="width: 100%; display: block; padding: 16px 0; border-bottom: 1px solid #f0f0f0;">
                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse;">
                            <tr>
                             <td width="120" valign="top" style="padding-right: 16px;">
                                 ${
                                   item.image
                                     ? `<img src="${item.image}" alt="${item.productName}" style="display: block; width: 100px; height: 120px; border-radius: 6px; object-fit: cover;">`
                                     : `<div style="width: 100px; height: 120px; background-color: #f5f5f5; border-radius: 6px; display: flex; align-items: center; justify-content: center; color: #999; font-size: 12px;">No Image</div>`
                                 }
                            </td>
                            <td valign="top" style="padding-right: 16px;">
                             <div style="font-weight: 700; color: #005235; font-size: 13px; margin-bottom: 6px; line-height: 1.4;">
                              ${item.productName}
                                 </div>
                             <div style="color: #666; font-size: 11px; margin-bottom: 4px; font-weight: 500;">
                             ${data.currency} ${item.unitPrice.toLocaleString()} x ${item.quantity}
                             </div>
                             <div style="color: #C90016; font-size: 11px; font-weight: 600;">
                             ${item.variantName}
                            </div>
                             </td>
                             <td valign="top" align="right" style="white-space: nowrap;">
                                  <div style="color: #005235; font-weight: 700; font-size: 14px;">
                                     ${data.currency}${item.lineTotal.toLocaleString()}
                                    </div>
                             </td>
                        </tr>
                        </table>
                    </div>
                    </div>
                `,
                  )
                  .join('')}
            </div>

            <!-- Delivery Address -->
             <div class="addresses-section">
                <div class="address-block">
                    <div class="address-title">Shipping address</div>
                    <div class="address">
                        ${data.shippingAddress.address}<br>
                        ${data.shippingAddress.city ? `${data.shippingAddress.city}, ` : ''} <br>
                        ${data.shippingAddress.state} <br>
                        ${data.shippingAddress.postalCode ? `${data.shippingAddress.postalCode}<br>` : ''}
                        ${data.shippingAddress.country} <br>
                        ${data.customerDetails.phone}
                    </div>
                </div>
            </div>

            <!-- CTA Section -->
            <div class="cta-section">
                <div class="help-text">
                    Questions about your shipment? Contact us at 
                    <a href="mailto:ifyouleavemeillbescared@gmail.com">ifyouleavemeillbescared@gmail.com</a>
                </div>
            </div>
        </div>
    </div>
</body>
</html>
`;
