import { Controller, useFormContext } from 'react-hook-form';

import { StateSelect } from 'src/components/state-select';

// ----------------------------------------------------------------------

export function RHFStateSelect({ name, helperText, ...other }) {
  const { control, setValue } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <StateSelect
          id={`${name}-rhf-state-select`}
          value={field.value}
          onChange={(event, newValue) => setValue(name, newValue, { shouldValidate: true })}
          error={!!error}
          helperText={error?.message ?? helperText}
          {...other}
        />
      )}
    />
  );
}
