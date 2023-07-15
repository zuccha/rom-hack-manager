import { useCallback, useEffect, useState } from "react";

export type FormValueOptions<T> = {
  isDirty?: boolean;
  onBlur?: () => void;
  validate?: (value: T) => (string | undefined) | Promise<string | undefined>;
};

export type FormValue<T> = {
  error: string | undefined;
  handleBlur: () => void;
  handleChangeValue: (value: T) => void;
  isPristine: boolean;
  isValid: boolean;
  value: T;
};

const useFormValue = <T>(
  defaultValue: T,
  options: FormValueOptions<T>
): FormValue<T> => {
  const [value, setValue] = useState<T>(defaultValue);
  const [error, setError] = useState<string | undefined>(undefined);
  const [isPristine, setIsPristine] = useState(!options.isDirty);

  const handleValidate = useCallback(
    (newValue: T) => {
      if (!options.validate) {
        setError(undefined);
        return;
      }
      const errorOrPromise = options.validate(newValue);
      if (errorOrPromise === undefined) {
        setError(undefined);
        return;
      }
      if (typeof errorOrPromise === "string") {
        setError(errorOrPromise);
        return;
      }
      setError("");
      errorOrPromise.then((newError) => {
        setError(newError);
      });
    },
    [options.validate]
  );

  const handleChangeValue = useCallback(
    (newValue: T) => {
      setValue(newValue);
      handleValidate(newValue);
    },
    [handleValidate]
  );

  const handleBlur = useCallback(() => {
    setIsPristine(false);
    options.onBlur?.();
  }, []);

  useEffect(() => {
    handleValidate(value);
  }, [handleValidate]);

  return {
    error,
    handleBlur,
    handleChangeValue,
    isPristine,
    isValid: error === undefined,
    value,
  };
};

export default useFormValue;
