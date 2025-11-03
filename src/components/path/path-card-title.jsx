/**
 * @namespace CityArtWalks.Components.Path.PathCardTitle
 * @version 1.0.0
 * @author jaimie garner
 */
import ListItemText from '@mui/material/ListItemText';

export function PathCardTitle({ title }) {
  return (
    <ListItemText
      sx={{ mt: 7, mb: 1 }}
      primary={title}
      primaryTypographyProps={{ typography: 'subtitle1' }}
      secondaryTypographyProps={{ component: 'span', mt: 0.5 }}
    />
  );
}
