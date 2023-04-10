import { useCallback, useEffect, useState } from "react";

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
  validate?: (value: T) => (string | undefined) | Promise<string | undefined>
): FormValue<T> => {
  const [value, setValue] = useState<T>(defaultValue);
  const [error, setError] = useState<string | undefined>(undefined);
  const [isPristine, setIsPristine] = useState(true);

  const handleValidate = useCallback(
    (newValue: T) => {
      if (!validate) {
        setError(undefined);
        return;
      }
      const errorOrPromise = validate(newValue);
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
    [validate]
  );

  const handleChangeValue = useCallback((newValue: T) => {
    setValue(newValue);
    handleValidate(newValue);
  }, []);

  const handleBlur = useCallback(() => {
    setIsPristine(false);
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
