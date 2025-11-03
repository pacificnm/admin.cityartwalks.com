/**
 * @version 1.0.0
 * @author jaimie garner
 * @namespace CityArtWalks.Sections.Product.Views
 */

'use client';

import React from 'react';
import PropTypes from 'prop-types';

import {
  Box,
  Card,
  Chip,
  List,
  Stack,
  Button,
  Divider,
  ListItem,
  Container,
  Typography,
  CardContent,
  ListItemIcon,
  ListItemText,
} from '@mui/material';

import { Iconify } from 'src/components/iconify';
import SubscribeButton from 'src/components/stripe/subscribe-button';

/**
 * @memberof CityArtWalks.Sections.Product.Views
 * @function ProductUpgradeView
 * @description Displays the product upgrade page for users who need to upgrade from USER to MEMBER status.
 * This component will eventually integrate with Square for subscription handling.
 *
 * Features:
 * - Clear pricing and benefits display
 * - Call-to-action for subscription upgrade
 * - Placeholder for Square payment integration
 * - Responsive design for all devices
 *
 * @component
 * @returns {JSX.Element} The rendered ProductUpgradeView component
 *
 * @example
 * import { ProductUpgradeView } from 'src/sections/product/view/product-upgrade-view';
 *
 * function UpgradePage() {
 *   return <ProductUpgradeView />;
 * }
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Product-Upgrade-View} Product Upgrade Documentation
 */
export function ProductUpgradeView({ containerMaxWidth = 'md', cardMaxWidth = 600 }) {
  const memberBenefits = [
    'Access to exclusive art walks and tours',
    'Priority booking for special events',
    'Member-only art piece recommendations',
    'Advanced search and filtering options',
    'Offline map downloads',
    'Personal art discovery journal',
    'Direct messaging with local artists',
    'Early access to new features',
  ];

  const handleLearnMoreClick = () => {
    // TODO: Navigate to detailed membership page
    console.log('Learn more about membership benefits');
  };

  return (
    <Container maxWidth={containerMaxWidth} sx={{ py: 8 }}>
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h2" component="h1" gutterBottom>
          Upgrade to Member
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
          Annual membership to City Art Walks. Get exclusive access to curated walking paths,
          member-only content, personalized art recommendations, and early previews of new public
          art. Support our mission to connect people through art discovery.
        </Typography>
      </Box>

      <Card
        elevation={8}
        sx={{
          maxWidth: cardMaxWidth || undefined,
          mx: 'auto',
          borderRadius: 3,
          border: '2px solid',
          borderColor: 'primary.main',
          position: 'relative',
          overflow: 'visible',
        }}
      >
        {/* Premium Badge */}
        <Box
          sx={{
            position: 'absolute',
            top: -12,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 1,
          }}
        >
          <Chip
            icon={<Iconify icon="solar:star-bold" />}
            label="Most Popular"
            color="primary"
            sx={{
              fontWeight: 'bold',
              px: 2,
              py: 0.5,
            }}
          />
        </Box>

        <CardContent sx={{ p: 4 }}>
          {/* Pricing Header */}
          <Box sx={{ textAlign: 'center', mb: 4, mt: 2 }}>
            <Typography variant="h3" component="div" color="primary.main" gutterBottom>
              $39.99
              <Typography component="span" variant="h6" color="text.secondary">
                /year
              </Typography>
            </Typography>
            <Typography variant="body1" color="text.secondary">
              City Art Walks Annual Membership
            </Typography>
          </Box>

          <Divider sx={{ mb: 3 }} />

          {/* Benefits List */}
          <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
            Member Benefits:
          </Typography>
          <List sx={{ mb: 3 }}>
            {memberBenefits.map((benefit, index) => (
              <ListItem key={index} sx={{ py: 0.5, px: 0 }}>
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <Iconify icon="solar:check-circle-bold" color="primary.main" width={20} />
                </ListItemIcon>
                <ListItemText primary={benefit} primaryTypographyProps={{ variant: 'body2' }} />
              </ListItem>
            ))}
          </List>

          <Divider sx={{ mb: 3 }} />

          {/* Action Buttons */}
          <Stack spacing={2}>
            <SubscribeButton />
            <Button
              variant="outlined"
              size="large"
              fullWidth
              onClick={handleLearnMoreClick}
              sx={{ py: 1.5 }}
            >
              Learn More
            </Button>
          </Stack>

          {/* Footer Text */}
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              display: 'block',
              textAlign: 'center',
              mt: 3,
              lineHeight: 1.4,
            }}
          >
            Secure payment processing powered by Stripe.
            <br />
            Your subscription helps support local artists and art communities.
          </Typography>
        </CardContent>
      </Card>

      {/* Additional Info */}
      <Box sx={{ textAlign: 'center', mt: 6 }}>
        <Typography variant="body2" color="text.secondary">
          Have questions? Contact our support team at{' '}
          <Typography component="span" color="primary.main" sx={{ fontWeight: 'medium' }}>
            support@cityartwalks.com
          </Typography>
        </Typography>
      </Box>
    </Container>
  );
}

ProductUpgradeView.propTypes = {
  containerMaxWidth: PropTypes.oneOfType([
    PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl', false]),
    PropTypes.bool,
  ]),
  cardMaxWidth: PropTypes.oneOfType([PropTypes.number, PropTypes.string, PropTypes.bool]),
};
