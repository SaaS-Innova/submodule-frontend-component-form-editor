import { Controller, useFormContext } from "react-hook-form";
import { inputValidator } from "../../../../library/utilities/helperFunction";
import { Editor } from "primereact/editor";
import { IFormFieldType } from "../../../../library/utilities/constant";
import { IFormProps } from "../formInterface/forms.model";
import { FormFieldError } from "../formFieldError/FormFieldError";
export const EditorField = (props: IFormProps) => {
  const { attribute, form, fieldType } = props;
  const { label } = form[attribute];
  const { required } = form[attribute].rules;
  const {
    formState: { errors },
    control,
  } = useFormContext();

  const getClassNames = () => {
    let labelClassName = "";
    let fieldClassName = "";
    let divClassName = "";

    switch (fieldType) {
      case IFormFieldType.NO_LABEL:
        labelClassName = "";
        fieldClassName = "field p-fluid";
        divClassName = "";
        break;
      case IFormFieldType.TOP_LABEL:
        labelClassName = "";
        fieldClassName = "field p-fluid";
        divClassName = "";
        break;
      default:
        labelClassName = "col-12 mb-3 md:col-3 md:mb-0";
        fieldClassName = "field grid";
        divClassName = "col-12 md:col-9 relative";
        break;
    }

    return { labelClassName, fieldClassName, divClassName };
  };
  const { labelClassName, fieldClassName, divClassName } = getClassNames();

  const labelElement = (
    <label htmlFor={attribute} className={labelClassName}>
      {label} {required && "*"}
    </label>
  );

  return (
    <div className={fieldClassName}>
      {fieldType !== IFormFieldType.NO_LABEL && labelElement}
      <div className={divClassName}>
        <Controller
          name={attribute}
          control={control}
          rules={inputValidator(form[attribute].rules, label)}
          render={({ field }) => (
            <Editor
              {...field}
              id={attribute}
              value={field.value}
              style={{ height: "240px", width: "100%" }}
              onTextChange={(e) => {
                field.onChange(e.htmlValue);
              }}
              showHeader={false}
              className={`${errors[attribute] ? "p-invalid" : ""}`}
              modules={{
                toolbar: [
                  [{ size: ["small", false, "large", "huge"] }],
                  [{ font: [] }],
                  ["bold", "italic", "underline"],
                  [{ color: [] }, { background: [] }],
                  [{ list: "ordered" }, { list: "bullet" }, { align: [] }],
                  ["image", "code-block", "link"],
                  ["clean"],
                ],
              }}
            />
          )}
        />
        <FormFieldError data={{ errors, name: attribute }} />
      </div>
    </div>
  );
};
