import { useEffect, useState } from "react";

const useIsValid = <T>(
  value: T,
  validate: (value: T) => Promise<string | undefined>
): boolean => {
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    validate(value).then((error) => setIsValid(!error));
  }, [validate, value]);

  return isValid;
};

export default useIsValid;
