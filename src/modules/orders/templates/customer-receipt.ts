export const receiptTemplate = (data: {
  orderNumber: string;
  subtotal: string;
  taxPercentage: number;
  taxAmount: string;
  shippingType: string;
  shippingAmount: string;
  orderTotal: string;
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
    <title>Your order is confirmed</title>
    <!--[if mso]>
    <noscript>
        <xml>
            <o:OfficeDocumentSettings>
                <o:PixelsPerInch>96</o:PixelsPerInch>
            </o:OfficeDocumentSettings>
        </xml>
    </noscript>
    <![endif]-->
    <style>
        /* Keep your original styles for Apple Mail and other clients */
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

        /* Gmail fallback - solid background instead of image */
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

        /* Ensure all content stays above the background */
        .header,
        .order-summary,
        .items-section,
        .pricing-section,
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
        
        .item-name {
            font-weight: 700;
            color: #005235;
            font-size: 15px;
            margin-bottom: 6px;
            line-height: 1.4;
        }
        
        .item-quantity {
            color: #666;
            font-size: 13px;
            margin-bottom: 4px;
            font-weight: 500;
        }
        
        .item-variant {
            color: #C90016;
            font-size: 13px;
            font-weight: 600;
            display: inline-block;
        }
        
        .item-total {
            color: #005235;
            font-weight: 700;
            font-size: 16px;
            text-align: right;
            min-width: 120px;
        }
        
        .pricing-section {
            padding: 32px 40px;
            border-bottom: 1px solid #e8e8e8;
        }
        
        .pricing-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 16px;
            padding: 8px 0;
            border-radius: 6px;
        }
        
        .pricing-label {
            color: #005235;
            font-size: 15px;
            font-weight: 600;
        }
        
        .pricing-value {
            color: #C90016;
            font-size: 15px;
            font-weight: 700;
        }
        
        .total-row {
            padding-top: 16px;
            margin-top: 16px;
            padding: 16px;
            margin: 16px -16px 0;
        }
        
        .total-row .pricing-label,
        .total-row .pricing-value {
            color: #333;
            font-weight: 700;
            font-size: 18px;
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

        /* Force Gmail to respect flexbox fallbacks */
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
            .order-summary,
            .items-section,
            .pricing-section,
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
            
            .item-total {
                text-align: center;
                margin-top: 12px;
                min-width: auto;
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

            /* Force mobile pricing layout */
            .pricing-row {
                display: block !important;
                text-align: center;
            }

            .pricing-label,
            .pricing-value {
                display: block !important;
                text-align: center !important;
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
            
            .pricing-row {
                font-size: 14px;
            }
            
            .total-row .pricing-label,
            .total-row .pricing-value {
                font-size: 16px;
            }
        }
    </style>
</head>
<body>
    <!-- Gmail detection wrapper -->
    <div class="gmail-fix">
        <div class="email-container gmail-bg-fallback">
            <!-- Header -->
            <div class="header">
                <h1>Thank you for ordering from IYLMIBS!</h1>
                <p>Hey ${data.customerDetails.name}, your order is being processed and deliveries take within 1-3 weeks, You will be notified as soon as your order is shipped.</p>
            </div>

            <!-- Order Summary with Gmail fallback -->
            <div class="order-summary">
                <div class="order-header gmail-flex-fallback">
                    <div class="order-info">
                        <span class="order-label">Order number</span>
                        <span class="order-number"># ${data.orderNumber}</span>
                    </div>
                    <div class="logo-container">
                        <img src="https://res.cloudinary.com/dmkomqw3p/image/upload/v1749643809/1_demtho.png" alt="IYLMIBS Logo">
                    </div>
                </div>
            </div>

            <!-- Items Section -->
            <div class="items-section">
                <div class="items-title">Order summary (${data.items.length} ${data.items.length === 1 ? 'item' : 'items'})</div>
                ${data.items
                  .map(
                    (item) => `
                    <!-- Gmail-compatible item structure -->
                    <div class="item">
                        <div style="display: table; width: 100%;">
                            <div style="display: table-cell; width: 120px; vertical-align: top; padding-right: 20px;">
                                ${
                                  item.image
                                    ? `<img src="${item.image}" alt="${item.productName}" class="item-image" style="display: block; width: 100px; height: 120px; border-radius: 6px; object-fit: cover;">`
                                    : '<div class="item-image" style="background-color: #f5f5f5; display: flex; align-items: center; justify-content: center; color: #999; width: 100px; height: 120px; border-radius: 6px;">No Image</div>'
                                }
                            </div>
                            <div style="display: table-cell; vertical-align: top; padding-right: 20px;">
                                <div class="item-name" style="font-weight: 700; color: #005235; font-size: 15px; margin-bottom: 6px; line-height: 1.4;">${item.productName}</div>
                                <div class="item-quantity" style="color: #666; font-size: 13px; margin-bottom: 4px; font-weight: 500;">${data.currency} ${item.unitPrice.toLocaleString()} x ${item.quantity}</div>
                                <div class="item-variant" style="color: #C90016; font-size: 13px; font-weight: 600; display: inline-block;">${item.variantName}</div>
                            </div>
                            <div style="display: table-cell; vertical-align: top; text-align: right; white-space: nowrap;">
                                <div class="item-total" style="color: #005235; font-weight: 700; font-size: 16px;">
                                    ${data.currency}${item.lineTotal.toLocaleString()}
                                </div>
                            </div>
                        </div>
                    </div>
                `,
                  )
                  .join('')}
            </div>

            <!-- Pricing Section with Gmail-safe tables -->
            <div class="pricing-section">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <td style="padding: 8px 0; border-bottom: 1px solid #f5f5f5;">
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="width: 100%;">
                                <tr>
                                    <td style="color: #005235; font-size: 15px; font-weight: 600;">Subtotal</td>
                                    <td style="color: #C90016; font-size: 15px; font-weight: 700; text-align: right;">${data.currency}${data.subtotal.toLocaleString()}</td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; border-bottom: 1px solid #f5f5f5;">
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="width: 100%;">
                                <tr>
                                    <td style="color: #005235; font-size: 15px; font-weight: 600;">Shipping (${data.shippingType})</td>
                                    <td style="color: #C90016; font-size: 15px; font-weight: 700; text-align: right;">${data.currency}${data.shippingAmount.toLocaleString()}</td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; border-bottom: 1px solid #f5f5f5;">
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="width: 100%;">
                                <tr>
                                    <td style="color: #005235; font-size: 15px; font-weight: 600;">Tax (${data.taxPercentage}%)</td>
                                    <td style="color: #C90016; font-size: 15px; font-weight: 700; text-align: right;">${data.currency}${data.taxAmount.toLocaleString()}</td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 16px 0; border-top: 2px solid #e8e8e8; border-radius: 8px;">
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="width: 100%;">
                                <tr>
                                    <td style="color: #333; font-size: 18px; font-weight: 700; padding: 0 16px;">Total</td>
                                    <td style="color: #333; font-size: 18px; font-weight: 700; text-align: right; padding: 0 16px;">${data.currency}${data.orderTotal.toLocaleString()}</td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </div>

            <!-- Addresses Section -->
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
                    If you have any questions, reply to this email or contact us at 
                    <a href="mailto:ifyouleavemeillbescared@gmail.com">ifyouleavemeillbescared@gmail.com</a>
                </div>
            </div>
        </div>
    </div>
</body>
</html>
`;
