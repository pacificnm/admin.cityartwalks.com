import { CityForm } from 'src/forms/city';

export function TabFormView(props) {
  const { currentCity } = props;
  return <CityForm currentCity={currentCity} />;
}
