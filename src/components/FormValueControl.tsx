import { FormValue } from "../hooks/useFormValue";

type FormValueProps<T> = {
  children: any;
  value: FormValue<T>;
};

function FormValueControl<T>({ children, value }: FormValueProps<T>) {
  return (
    <div className="column">
      {children}
      {value.error !== undefined && !value.isPristine && (
        <span className="text-danger" style={styles.error}>
          {value.error}
        </span>
      )}
    </div>
  );
}

export default FormValueControl;

const styles = {
  error: { fontSize: "0.8em", paddingLeft: "1em" },
};
