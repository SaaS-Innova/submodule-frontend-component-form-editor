import { Controller, useFormContext } from "react-hook-form";
import { inputValidator } from "../../../../library/utilities/helperFunction";
import { Editor } from "primereact/editor";
import { IFormFieldType } from "../../../../library/utilities/constant";
import { IFormProps } from "../formInterface/forms.model";
import { FormFieldError } from "../formFieldError/FormFieldError";
//@ts-ignore
import ImageResize from "quill-image-resize-module-react";
import Quill from "quill";
import { useState, useEffect } from "react";
import "./style.css";

Quill.register("modules/imageResize", ImageResize);

export const EditorField = (props: IFormProps) => {
  const { attribute, form, fieldType } = props;
  const { label } = form[attribute];
  const { required } = form[attribute].rules;
  const [editorValue, setEditorValue] = useState<string | null>("");
  const [headerHeight, setHeaderHeight] = useState(42);

  const {
    formState: { errors, defaultValues },
    control,
  } = useFormContext();

  /*
   * This useEffect is used to set the initial value of the editor
   * based on the default value provided in the form
   */
  useEffect(() => {
    const initialValue = defaultValues?.[attribute] ?? "";
    setEditorValue(initialValue);
  }, [attribute, defaultValues]);

  /*
   * This useEffect is used to observe the toolbar height of the editor
   * and set the height of the editor content accordingly
   */
  useEffect(() => {
    const observer = new MutationObserver((mutationsList, observer) => {
      const header = document.querySelector(".ql-toolbar");
      if (header) {
        const resizeObserver = new ResizeObserver((entries) => {
          for (let entry of entries) {
            setHeaderHeight(entry.contentRect.height + 18);
          }
        });

        resizeObserver.observe(header);

        return () => {
          resizeObserver.unobserve(header);
          resizeObserver.disconnect();
          observer.disconnect();
        };
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
    };
  }, [document.querySelector(".ql-toolbar")]);

  const getClassNames = () => {
    let labelClassName = "";
    let fieldClassName = "";
    let divClassName = "";
    switch (fieldType) {
      case IFormFieldType.NO_LABEL:
        labelClassName = "";
        fieldClassName = "field p-fluid";
        divClassName = "editor-parent";
        break;
      case IFormFieldType.TOP_LABEL:
        labelClassName = "";
        fieldClassName = "field p-fluid";
        divClassName = "editor-parent";
        break;
      default:
        labelClassName = "col-12 mb-3 md:col-3 md:mb-0";
        fieldClassName = "field grid";
        divClassName = "col-12 md:col-9 relative editor-parent";
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
          render={({ field }) => {
            return (
              <Editor
                id={attribute}
                value={editorValue || field.value || ""}
                style={{
                  width: "100%",
                  height: `calc(100% - ${headerHeight + "px"})`,
                  overflow: "hidden",
                }}
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
                  imageResize: {
                    parchment: Quill.import("parchment"),
                    displayStyles: {
                      backgroundColor: "black",
                      border: "none",
                      color: "white",
                    },
                    modules: ["Resize", "DisplaySize", "Toolbar"],
                  },
                }}
              />
            );
          }}
        />
        <FormFieldError data={{ errors, name: attribute }} />
      </div>
    </div>
  );
};
