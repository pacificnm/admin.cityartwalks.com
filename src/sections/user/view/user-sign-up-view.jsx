/**
 * @version 1.0.0
 * @author jaimie garner
 * @namespace CityArtWalks.Sections.User.Views
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

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { endpoints } from 'src/endpoints';

import {
  Facebook,
  EmailIcon,
  GoogleIcon,
  InfoCircleIcon,
  CheckCircleIcon,
  VerifiedCheckIcon,
} from 'src/components/icons';

import { UserSignUpButton } from './user-signup-button';
/**
 * @memberof CityArtWalks.Sections.User.Views
 * @function UserSignUpView
 * @description Displays the user sign-up page for anonymous users who need to create an account
 * to access USER, MEMBER, or ADMIN content. Integrates with Auth0 for authentication.
 *
 * Features:
 * - Clear benefits of creating an account
 * - Direct Auth0 authentication integration
 * - Social login options through Auth0
 * - Responsive design for all devices
 *
 * @component
 * @returns {JSX.Element} The rendered UserSignUpView component
 *
 * @example
 * import { UserSignUpView } from 'src/sections/user/view/user-sign-up-view';
 *
 * function SignUpPage() {
 *   return <UserSignUpView />;
 * }
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/User-SignUp-View} User SignUp Documentation
 */
export function UserSignUpView({ containerMaxWidth = 'md', cardMaxWidth = 600 }) {
  const userBenefits = [
    'Save your favorite art pieces and locations',
    'Create personalized art walk routes',
    'Track your art discovery progress',
    'Join the community discussions',
    'Receive personalized recommendations',
    'Access exclusive content and features',
    'Connect with local artists and art lovers',
    'Never lose your art walk history',
  ];

  const handleSignUpClick = () => {
    // Redirect to Auth0 sign-up
    window.location.href = endpoints.auth.login;
  };

  return (
    <Container maxWidth={containerMaxWidth} sx={{ py: 8 }}>
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h2" component="h1" gutterBottom>
          Join City Art Walks
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
          Create your free account to unlock personalized art discovery
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
        {/* Free Badge */}
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
            icon={<VerifiedCheckIcon size={20} />}
            label="Free Forever"
            color="success"
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
              Free to join
            </Typography>
            <Typography variant="body1" color="text.secondary">
              No credit card required • Sign up in seconds
            </Typography>
          </Box>

          <Divider sx={{ mb: 3 }} />

          {/* Benefits List */}
          <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
            What you&apos;ll get:
          </Typography>
          <List sx={{ mb: 3 }}>
            {userBenefits.map((benefit, index) => (
              <ListItem key={index} sx={{ py: 0.5, px: 0 }}>
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <CheckCircleIcon size={20} sx={{ color: 'primary.main' }} />
                </ListItemIcon>
                <ListItemText
                  primary={benefit}
                  slotProps={{
                    primary: {
                      variant: 'body2',
                    },
                  }}
                />
              </ListItem>
            ))}
          </List>

          <Divider sx={{ mb: 3 }} />

          {/* Action Buttons */}
          <Stack spacing={2}>
            <UserSignUpButton />
            <Button
              component={RouterLink}
              href={paths.faqs}
              variant="outlined"
              size="large"
              fullWidth
              startIcon={<InfoCircleIcon size={20} />}
              sx={{ py: 1.5 }}
            >
              Learn More
            </Button>
          </Stack>

          {/* Social Login Info */}
          <Box sx={{ textAlign: 'center', mt: 3, mb: 2 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Sign up with:
            </Typography>
            <Stack direction="row" spacing={1} justifyContent="center" sx={{ mt: 1 }}>
              <Chip
                icon={<GoogleIcon size={16} />}
                label="Google"
                variant="outlined"
                size="small"
              />
              <Chip
                icon={<Facebook size={16} />}
                label="Facebook"
                variant="outlined"
                size="small"
              />
              <Chip icon={<EmailIcon size={16} />} label="Email" variant="outlined" size="small" />
            </Stack>
          </Box>

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
            Secure authentication powered by Auth0.
            <br />
            By signing up, you agree to our{' '}
            <Typography
              component={RouterLink}
              href={paths.termsOfService}
              variant="caption"
              sx={{
                color: 'primary.main',
                textDecoration: 'underline',
                '&:hover': {
                  textDecoration: 'none',
                },
              }}
            >
              Terms of Service
            </Typography>{' '}
            and{' '}
            <Typography
              component={RouterLink}
              href={paths.privacyPolicy}
              variant="caption"
              sx={{
                color: 'primary.main',
                textDecoration: 'underline',
                '&:hover': {
                  textDecoration: 'none',
                },
              }}
            >
              Privacy Policy
            </Typography>
            .
          </Typography>
        </CardContent>
      </Card>

      {/* Additional Info */}
      <Box sx={{ textAlign: 'center', mt: 6 }}>
        <Typography variant="body2" color="text.secondary">
          Already have an account?{' '}
          <Button
            variant="text"
            onClick={handleSignUpClick}
            sx={{
              textTransform: 'none',
              fontWeight: 'medium',
              p: 0,
              minWidth: 'auto',
            }}
          >
            Sign in here
          </Button>
        </Typography>
      </Box>
    </Container>
  );
}

UserSignUpView.propTypes = {
  containerMaxWidth: PropTypes.oneOfType([
    PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl', false]),
    PropTypes.bool,
  ]),
  cardMaxWidth: PropTypes.oneOfType([PropTypes.number, PropTypes.string, PropTypes.bool]),
};
