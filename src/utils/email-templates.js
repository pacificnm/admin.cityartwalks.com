/**
 * Email Template Utility
 *
 * This module provides email template generation for review system notifications.
 * It creates responsive HTML email templates with consistent branding and styling
 * for various review-related events and communications.
 *
 * @namespace CityArtWalks.Utils.EmailTemplates
 * @fileoverview Email template generation for review notifications
 * @author Jaimie Garner
 * @version 1.0.0
 *
 * @requires {@link https://github.com/pacificnm/cityartwalks.com/wiki/Debug} debugLog/debugError - Debug utilities
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Review-System} - Review system documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Email-Templates} - Email template documentation
 */

import { debugLog, debugError } from 'src/lib/debug';

/**
 * @memberof CityArtWalks.Utils.EmailTemplates
 * @description Email branding and styling configuration
 * @constant {Object} EMAIL_BRANDING
 */
const EMAIL_BRANDING = {
  siteName: 'CityArtWalks',
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://cityartwalks.com',
  logoUrl: process.env.NEXT_PUBLIC_LOGO_URL || 'https://cityartwalks.com/logo.png',
  primaryColor: '#1976d2',
  secondaryColor: '#f5f5f5',
  textColor: '#333333',
  linkColor: '#1976d2',
  footerColor: '#666666',
  borderColor: '#e0e0e0',
};

/**
 * @memberof CityArtWalks.Utils.EmailTemplates
 * @description Base email template styles
 * @constant {string} BASE_STYLES
 */
const BASE_STYLES = `
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: ${EMAIL_BRANDING.textColor};
      margin: 0;
      padding: 0;
      background-color: ${EMAIL_BRANDING.secondaryColor};
    }
    
    .email-container {
      max-width: 600px;
      margin: 0 auto;
      background-color: white;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    
    .email-header {
      background-color: ${EMAIL_BRANDING.primaryColor};
      color: white;
      padding: 20px;
      text-align: center;
    }
    
    .email-header h1 {
      margin: 0;
      font-size: 24px;
      font-weight: 600;
    }
    
    .email-logo {
      max-width: 150px;
      height: auto;
      margin-bottom: 10px;
    }
    
    .email-body {
      padding: 30px;
    }
    
    .email-title {
      font-size: 20px;
      font-weight: 600;
      margin-bottom: 20px;
      color: ${EMAIL_BRANDING.textColor};
    }
    
    .email-content {
      font-size: 16px;
      margin-bottom: 25px;
    }
    
    .email-button {
      display: inline-block;
      background-color: ${EMAIL_BRANDING.primaryColor};
      color: white !important;
      text-decoration: none;
      padding: 12px 24px;
      border-radius: 6px;
      font-weight: 600;
      margin: 10px 0;
    }
    
    .email-button?:hover {
      background-color: #1565c0;
    }
    
    .email-footer {
      background-color: ${EMAIL_BRANDING.secondaryColor};
      padding: 20px;
      text-align: center;
      font-size: 14px;
      color: ${EMAIL_BRANDING.footerColor};
      border-top: 1px solid ${EMAIL_BRANDING.borderColor};
    }
    
    .review-card {
      background-color: #f9f9f9;
      padding: 15px;
      border-radius: 6px;
      margin: 15px 0;
      border-left: 4px solid ${EMAIL_BRANDING.primaryColor};
    }
    
    .review-rating {
      color: #ff9800;
      font-weight: 600;
    }
    
    .success-banner {
      background-color: #e8f5e8;
      color: #2e7d32;
      padding: 15px;
      border-radius: 6px;
      margin-bottom: 20px;
      border-left: 4px solid #4caf50;
    }
    
    .warning-banner {
      background-color: #fff3e0;
      color: #f57c00;
      padding: 15px;
      border-radius: 6px;
      margin-bottom: 20px;
      border-left: 4px solid #ff9800;
    }
    
    .error-banner {
      background-color: #ffebee;
      color: #d32f2f;
      padding: 15px;
      border-radius: 6px;
      margin-bottom: 20px;
      border-left: 4px solid #f44336;
    }
    
    .entity-info {
      background-color: #f5f5f5;
      padding: 12px;
      border-radius: 4px;
      margin: 10px 0;
    }
    
    .entity-info strong {
      color: ${EMAIL_BRANDING.primaryColor};
    }
    
    .divider {
      height: 1px;
      background-color: ${EMAIL_BRANDING.borderColor};
      margin: 20px 0;
    }
    
    @media only screen and (max-width: 600px) {
      .email-container {
        margin: 0;
        border-radius: 0;
      }
      
      .email-body {
        padding: 20px;
      }
      
      .email-title {
        font-size: 18px;
      }
      
      .email-content {
        font-size: 15px;
      }
    }
  </style>
`;

/**
 * Generates base email template structure
 *
 * @memberof CityArtWalks.Utils.EmailTemplates
 * @function generateBaseTemplate
 * @param {Object} options - Template options
 * @param {string} options.title - Email title
 * @param {string} options.content - Email body content
 * @param {string} [options.preheader] - Email preheader text
 * @returns {string} Complete HTML email template
 * @private
 */
function generateBaseTemplate({ title, content, preheader = '' }) {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <title>${title}</title>
      ${preheader ? `<meta name="description" content="${preheader}">` : ''}
      ${BASE_STYLES}
    </head>
    <body>
      <div style="display: none; max-height: 0; overflow: hidden;">${preheader}</div>
      
      <div class="email-container">
        <div class="email-header">
          <img src="${EMAIL_BRANDING.logoUrl}" alt="${EMAIL_BRANDING.siteName}" class="email-logo">
          <h1>${EMAIL_BRANDING.siteName}</h1>
        </div>
        
        <div class="email-body">
          ${content}
        </div>
        
        <div class="email-footer">
          <p>© ${new Date().getFullYear()} ${EMAIL_BRANDING.siteName}. All rights reserved.</p>
          <p>
            <a href="${EMAIL_BRANDING.siteUrl}" style="color: ${EMAIL_BRANDING.linkColor};">Visit our website</a> | 
            <a href="${EMAIL_BRANDING.siteUrl}/preferences" style="color: ${EMAIL_BRANDING.linkColor};">Email preferences</a>
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * Generates star rating HTML for emails
 *
 * @memberof CityArtWalks.Utils.EmailTemplates
 * @function generateStarRating
 * @param {number} rating - Rating value (1-5)
 * @returns {string} HTML star rating
 * @private
 */
function generateStarRating(rating) {
  const fullStars = Math.floor(rating);
  const emptyStars = 5 - fullStars;

  let stars = '';
  for (let i = 0; i < fullStars; i++) {
    stars += '★';
  }
  for (let i = 0; i < emptyStars; i++) {
    stars += '☆';
  }

  return `<span class="review-rating">${stars} (${rating}/5)</span>`;
}

/**
 * Creates review approval email template
 *
 * @memberof CityArtWalks.Utils.EmailTemplates
 * @async
 * @function createReviewApprovalEmail
 * @param {Object} params - Email parameters
 * @param {string} params.userName - Name of the reviewer
 * @param {string} params.entityName - Name of the reviewed entity
 * @param {string} params.entityType - Type of entity (art piece, artist, etc.)
 * @param {number} params.rating - Review rating
 * @param {string} params.comment - Review comment
 * @param {string} params.entityUrl - URL to the entity page
 * @param {boolean} [params.isAIApproved=false] - Whether approved by AI
 * @returns {Promise<Object>} Email template object
 *
 * @example
 * const email = await createReviewApprovalEmail({
 *   userName: 'John Doe',
 *   entityName: 'Downtown Mural',
 *   entityType: 'art piece',
 *   rating: 5,
 *   comment: 'Amazing artwork!',
 *   entityUrl: 'https://cityartwalks.com/art-pieces/downtown-mural'
 * });
 */
export async function createReviewApprovalEmail({
  userName,
  entityName,
  entityType,
  rating,
  comment,
  entityUrl,
  isAIApproved = false,
}) {
  try {
    debugLog(
      'CityArtWalks.Utils.EmailTemplates.createReviewApprovalEmail',
      `Creating approval email for ${userName}`
    );

    const title = 'Review Approved - CityArtWalks';
    const preheader = `Your ${rating}-star review for ${entityName} has been approved and is now live.`;

    const content = `
      <div class="success-banner">
        <strong>✅ Review Approved!</strong>
      </div>
      
      <h2 class="email-title">Your review is now live</h2>
      
      <div class="email-content">
        <p>Hi ${userName},</p>
        
        <p>Great news! Your review for <strong>${entityName}</strong> has been approved and is now visible to other users exploring our platform.</p>
        
        <div class="review-card">
          <div class="entity-info">
            <strong>${entityType.charAt(0).toUpperCase() + entityType.slice(1)}:</strong> ${entityName}
          </div>
          <p><strong>Your rating?:</strong> ${generateStarRating(rating)}</p>
          <p><strong>Your review?:</strong></p>
          <p style="font-style: italic; margin-left: 10px;">"${comment}"</p>
        </div>
        
        <p>Thank you for contributing to our community! Your insights help other art enthusiasts discover amazing experiences.</p>
        
        ${
          isAIApproved
            ? '<p><small>This review was automatically approved by our AI moderation system.</small></p>'
            : '<p><small>This review was approved by our moderation team.</small></p>'
        }
      </div>
      
      <p style="text-align: center;">
        <a href="${entityUrl}" class="email-button">View Your Review</a>
      </p>
      
      <div class="divider"></div>
      
      <p style="font-size: 14px; color: #666;">
        Keep exploring and sharing your experiences! We'd love to hear about more art discoveries.
      </p>
    `;

    return {
      subject: `✅ Review Approved: ${entityName}`,
      html: generateBaseTemplate({ title, content, preheader }),
      text: `Review Approved - CityArtWalks\n\nHi ${userName},\n\nYour ${rating}-star review for ${entityName} has been approved and is now live.\n\nYour review: "${comment}"\n\nView it here: ${entityUrl}\n\nThanks for contributing to our community!`,
    };
  } catch (error) {
    debugError('CityArtWalks.Utils.EmailTemplates.createReviewApprovalEmail', error);
    throw new Error('Failed to create review approval email');
  }
}

/**
 * Creates review rejection email template
 *
 * @memberof CityArtWalks.Utils.EmailTemplates
 * @async
 * @function createReviewRejectionEmail
 * @param {Object} params - Email parameters
 * @param {string} params.userName - Name of the reviewer
 * @param {string} params.entityName - Name of the reviewed entity
 * @param {string} params.entityType - Type of entity
 * @param {string} params.reason - Rejection reason
 * @param {Array<string>} [params.suggestions] - Improvement suggestions
 * @param {string} params.entityUrl - URL to the entity page
 * @returns {Promise<Object>} Email template object
 */
export async function createReviewRejectionEmail({
  userName,
  entityName,
  entityType,
  reason,
  suggestions = [],
  entityUrl,
}) {
  try {
    debugLog(
      'CityArtWalks.Utils.EmailTemplates.createReviewRejectionEmail',
      `Creating rejection email for ${userName}`
    );

    const title = 'Review Update - CityArtWalks';
    const preheader = `Your review for ${entityName} needs some adjustments.`;

    let suggestionsHtml = '';
    if (suggestions.length > 0) {
      suggestionsHtml = `
        <div style="margin: 15px 0;">
          <strong>Here are some suggestions to help?:</strong>
          <ul style="margin: 10px 0; padding-left: 20px;">
            ${suggestions.map((suggestion) => `<li>${suggestion}</li>`).join('')}
          </ul>
        </div>
      `;
    }

    const content = `
      <div class="warning-banner">
        <strong>📝 Review Needs Revision</strong>
      </div>
      
      <h2 class="email-title">Your review requires some adjustments</h2>
      
      <div class="email-content">
        <p>Hi ${userName},</p>
        
        <p>Thank you for taking the time to review <strong>${entityName}</strong>. While we appreciate your feedback, your review doesn't quite meet our community guidelines yet.</p>
        
        <div class="entity-info">
          <strong>${entityType.charAt(0).toUpperCase() + entityType.slice(1)}:</strong> ${entityName}
        </div>
        
        <div style="background-color: #fff3e0; padding: 15px; border-radius: 6px; margin: 15px 0;">
          <strong>Reason?:</strong> ${reason}
        </div>
        
        ${suggestionsHtml}
        
        <p>Don't worry! You can always submit a new review that follows our guidelines. We encourage authentic, helpful reviews that focus on your genuine experience.</p>
      </div>
      
      <p style="text-align: center;">
        <a href="${entityUrl}" class="email-button">Write a New Review</a>
      </p>
      
      <div class="divider"></div>
      
      <p style="font-size: 14px; color: #666;">
        Need help? Check out our <a href="${EMAIL_BRANDING.siteUrl}/review-guidelines" style="color: ${EMAIL_BRANDING.linkColor};">review guidelines</a> for tips on writing great reviews.
      </p>
    `;

    return {
      subject: `📝 Review Update: ${entityName}`,
      html: generateBaseTemplate({ title, content, preheader }),
      text: `Review Update - CityArtWalks\n\nHi ${userName},\n\nYour review for ${entityName} needs some adjustments.\n\nReason: ${reason}\n\n${suggestions.length > 0 ? `Suggestions?:\n${suggestions.map((s) => `- ${s}`).join('\n')}\n\n` : ''}You can submit a new review here: ${entityUrl}\n\nThanks for your understanding!`,
    };
  } catch (error) {
    debugError('CityArtWalks.Utils.EmailTemplates.createReviewRejectionEmail', error);
    throw new Error('Failed to create review rejection email');
  }
}

/**
 * Creates new review notification email for content owners
 *
 * @memberof CityArtWalks.Utils.EmailTemplates
 * @async
 * @function createNewReviewOwnerEmail
 * @param {Object} params - Email parameters
 * @param {string} params.ownerName - Name of the content owner
 * @param {string} params.reviewerName - Name of the reviewer
 * @param {string} params.entityName - Name of the reviewed entity
 * @param {string} params.entityType - Type of entity
 * @param {number} params.rating - Review rating
 * @param {string} params.comment - Review comment (truncated)
 * @param {string} params.entityUrl - URL to the entity page
 * @returns {Promise<Object>} Email template object
 */
export async function createNewReviewOwnerEmail({
  ownerName,
  reviewerName,
  entityName,
  entityType,
  rating,
  comment,
  entityUrl,
}) {
  try {
    debugLog(
      'CityArtWalks.Utils.EmailTemplates.createNewReviewOwnerEmail',
      `Creating new review email for owner ${ownerName}`
    );

    const title = 'New Review - CityArtWalks';
    const preheader = `${reviewerName} left a ${rating}-star review for your ${entityType}.`;

    // Truncate comment for email display
    const truncatedComment = comment.length > 150 ? comment.substring(0, 150) + '...' : comment;

    const content = `
      <h2 class="email-title">You received a new review!</h2>
      
      <div class="email-content">
        <p>Hi ${ownerName},</p>
        
        <p>Exciting news! <strong>${reviewerName}</strong> just left a review for your ${entityType}.</p>
        
        <div class="review-card">
          <div class="entity-info">
            <strong>${entityType.charAt(0).toUpperCase() + entityType.slice(1)}:</strong> ${entityName}
          </div>
          <p><strong>Rating?:</strong> ${generateStarRating(rating)}</p>
          <p><strong>Review by ${reviewerName}:</strong></p>
          <p style="font-style: italic; margin-left: 10px;">"${truncatedComment}"</p>
          ${comment.length > 150 ? '<p style="margin-left: 10px;"><em>Click below to read the full review</em></p>' : ''}
        </div>
        
        <p>Reviews like this help others discover your amazing work. Thank you for being part of our community!</p>
      </div>
      
      <p style="text-align: center;">
        <a href="${entityUrl}#reviews" class="email-button">View Full Review</a>
      </p>
      
      <div class="divider"></div>
      
      <p style="font-size: 14px; color: #666;">
        Keep creating amazing art experiences! Each review helps build our vibrant community.
      </p>
    `;

    return {
      subject: `🌟 New ${rating}-star review: ${entityName}`,
      html: generateBaseTemplate({ title, content, preheader }),
      text: `New Review - CityArtWalks\n\nHi ${ownerName},\n\n${reviewerName} left a ${rating}-star review for your ${entityType} "${entityName}".\n\nReview: "${truncatedComment}"\n\nView it here: ${entityUrl}#reviews\n\nThanks for being part of our community!`,
    };
  } catch (error) {
    debugError('CityArtWalks.Utils.EmailTemplates.createNewReviewOwnerEmail', error);
    throw new Error('Failed to create new review owner email');
  }
}

/**
 * Creates admin notification email for flagged reviews
 *
 * @memberof CityArtWalks.Utils.EmailTemplates
 * @async
 * @function createFlaggedReviewAdminEmail
 * @param {Object} params - Email parameters
 * @param {string} params.flaggerName - Name of user who flagged the review
 * @param {string} params.entityName - Name of the reviewed entity
 * @param {string} params.entityType - Type of entity
 * @param {string} params.reason - Flagging reason
 * @param {string} params.comment - Review comment
 * @param {number} params.rating - Review rating
 * @param {string} params.moderationUrl - URL to moderation interface
 * @returns {Promise<Object>} Email template object
 */
export async function createFlaggedReviewAdminEmail({
  flaggerName,
  entityName,
  entityType,
  reason,
  comment,
  rating,
  moderationUrl,
}) {
  try {
    debugLog(
      'CityArtWalks.Utils.EmailTemplates.createFlaggedReviewAdminEmail',
      'Creating flagged review admin email'
    );

    const title = 'Review Flagged - Admin Alert';
    const preheader = `${flaggerName} flagged a review for ${entityName}.`;

    const content = `
      <div class="error-banner">
        <strong>🚩 Review Flagged for Moderation</strong>
      </div>
      
      <h2 class="email-title">Admin Action Required</h2>
      
      <div class="email-content">
        <p>A review has been flagged and requires your attention.</p>
        
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 6px; margin: 15px 0;">
          <p><strong>Flagged by?:</strong> ${flaggerName}</p>
          <p><strong>Reason?:</strong> ${reason}</p>
          <p><strong>Entity?:</strong> ${entityName} (${entityType})</p>
        </div>
        
        <div class="review-card">
          <p><strong>Review Details?:</strong></p>
          <p><strong>Rating?:</strong> ${generateStarRating(rating)}</p>
          <p><strong>Comment?:</strong></p>
          <p style="font-style: italic; margin-left: 10px; background-color: white; padding: 10px; border-radius: 4px;">"${comment}"</p>
        </div>
        
        <p>Please review this content and take appropriate action.</p>
      </div>
      
      <p style="text-align: center;">
        <a href="${moderationUrl}" class="email-button">Review & Moderate</a>
      </p>
      
      <div class="divider"></div>
      
      <p style="font-size: 14px; color: #666;">
        This notification was sent because you are an administrator. Respond promptly to maintain community standards.
      </p>
    `;

    return {
      subject: `🚩 Review Flagged: ${entityName}`,
      html: generateBaseTemplate({ title, content, preheader }),
      text: `Review Flagged - Admin Alert\n\nA review has been flagged for moderation.\n\nFlagged by: ${flaggerName}\nReason: ${reason}\nEntity: ${entityName} (${entityType})\nRating: ${rating}/5\nComment: "${comment}"\n\nModerate here: ${moderationUrl}`,
    };
  } catch (error) {
    debugError('CityArtWalks.Utils.EmailTemplates.createFlaggedReviewAdminEmail', error);
    throw new Error('Failed to create flagged review admin email');
  }
}

/**
 * Creates digest email for batched admin notifications
 *
 * @memberof CityArtWalks.Utils.EmailTemplates
 * @async
 * @function createAdminDigestEmail
 * @param {Object} params - Email parameters
 * @param {string} params.digestType - Type of digest (flagged, ai_failed, etc.)
 * @param {Array} params.notifications - Array of notifications
 * @param {string} params.timeframe - Time period for the digest
 * @param {string} params.dashboardUrl - URL to admin dashboard
 * @returns {Promise<Object>} Email template object
 */
export async function createAdminDigestEmail({
  digestType,
  notifications,
  timeframe,
  dashboardUrl,
}) {
  try {
    debugLog(
      'CityArtWalks.Utils.EmailTemplates.createAdminDigestEmail',
      `Creating admin digest email for ${digestType}`
    );

    const count = notifications.length;
    const title = 'Admin Digest - CityArtWalks';

    let digestTitle = '';
    let digestIcon = '';
    let bannerClass = 'warning-banner';

    switch (digestType) {
      case 'reviewFlagged':
        digestTitle = `${count} Review${count > 1 ? 's' : ''} Flagged`;
        digestIcon = '🚩';
        bannerClass = 'error-banner';
        break;
      case 'aiModerationFailed':
        digestTitle = `${count} AI Moderation Failure${count > 1 ? 's' : ''}`;
        digestIcon = '🤖';
        break;
      case 'moderationQueueBacklog':
        digestTitle = `${count} Review${count > 1 ? 's' : ''} Pending`;
        digestIcon = '⏰';
        break;
      default:
        digestTitle = `${count} Admin Notification${count > 1 ? 's' : ''}`;
        digestIcon = '📋';
    }

    const preheader = `${digestTitle} in the last ${timeframe}.`;

    const notificationItems = notifications
      .slice(0, 10)
      .map((notification) => {
        const data = notification.data || {};
        return `
        <div style="background-color: white; padding: 12px; margin: 8px 0; border-radius: 4px; border-left: 3px solid ${EMAIL_BRANDING.primaryColor};">
          <p style="margin: 0; font-size: 14px;">
            ${data.entityName ? `<strong>${data.entityName}</strong> - ` : ''}
            ${data.reason || data.message || 'Requires attention'}
          </p>
          ${data.flaggerName ? `<p style="margin: 5px 0 0 0; font-size: 12px; color: #666;">Flagged by: ${data.flaggerName}</p>` : ''}
        </div>
      `;
      })
      .join('');

    const content = `
      <div class="${bannerClass}">
        <strong>${digestIcon} ${digestTitle}</strong>
      </div>
      
      <h2 class="email-title">Admin Digest - ${timeframe}</h2>
      
      <div class="email-content">
        <p>Here's a summary of recent activity requiring your attention?:</p>
        
        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 6px; margin: 15px 0;">
          ${notificationItems}
          ${notifications.length > 10 ? `<p style="text-align: center; margin: 10px 0; font-style: italic;">... and ${notifications.length - 10} more</p>` : ''}
        </div>
        
        <p>Please review these items when you have a moment. Prompt moderation helps maintain our community standards.</p>
      </div>
      
      <p style="text-align: center;">
        <a href="${dashboardUrl}" class="email-button">View Admin Dashboard</a>
      </p>
      
      <div class="divider"></div>
      
      <p style="font-size: 14px; color: #666;">
        This digest was sent because multiple ${digestType.replace(/([A-Z])/g, ' $1').toLowerCase()} notifications occurred in a short period.
      </p>
    `;

    return {
      subject: `${digestIcon} Admin Digest: ${digestTitle}`,
      html: generateBaseTemplate({ title, content, preheader }),
      text: `Admin Digest - CityArtWalks\n\n${digestTitle} in the last ${timeframe}.\n\n${notifications.map((n) => `- ${n.data?.entityName || 'Item'}: ${n.data?.reason || n.data?.message || 'Requires attention'}`).join('\n')}\n\nView dashboard: ${dashboardUrl}`,
    };
  } catch (error) {
    debugError('CityArtWalks.Utils.EmailTemplates.createAdminDigestEmail', error);
    throw new Error('Failed to create admin digest email');
  }
}

/**
 * Creates a simple text-only email template
 *
 * @memberof CityArtWalks.Utils.EmailTemplates
 * @function createTextEmail
 * @param {Object} params - Email parameters
 * @param {string} params.subject - Email subject
 * @param {string} params.message - Email message
 * @param {string} [params.actionUrl] - Optional action URL
 * @param {string} [params.actionText] - Optional action button text
 * @returns {Object} Email template object
 */
export function createTextEmail({ subject, message, actionUrl, actionText = 'View Details' }) {
  const textContent = `
    ${message}
    
    ${actionUrl ? `\n${actionText}: ${actionUrl}\n` : ''}
    
    --
    ${EMAIL_BRANDING.siteName}
    ${EMAIL_BRANDING.siteUrl}
  `;

  const htmlContent = `
    <h2 class="email-title">${subject}</h2>
    <div class="email-content">
      <p>${message.replace(/\n/g, '</p><p>')}</p>
      ${
        actionUrl
          ? `
        <p style="text-align: center;">
          <a href="${actionUrl}" class="email-button">${actionText}</a>
        </p>
      `
          : ''
      }
    </div>
  `;

  return {
    subject,
    html: generateBaseTemplate({ title: subject, content: htmlContent }),
    text: textContent.trim(),
  };
}

// Utility functions removed to fix lint warnings
// Add back if needed in the future
