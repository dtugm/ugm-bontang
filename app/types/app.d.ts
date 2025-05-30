declare interface IFormInput {
  type?:
    | "autocomplete"
    | "autocomplete_server"
    | "checkbox"
    | "combobox"
    | "datepicker"
    | "datepicker_v2"
    | "daterange"
    | "file"
    | "file_image"
    | "password"
    | "select"
    | "text"
    | "number"
    | "textarea"
    | "usergroup"
    | "usergroupaccess"
    | "provider"
    | "project_phase"
    | "icon"
    | "parent_menu"
    | "richtexteditor"
    | "filebox"
    | "milestone"
    | "file_image_v2"
    | "file_v2"
    | "kontraktor"
    | "radio"
    | "siteRealId";

  label: string;
  placeholder?: string;
  rules?: any[];
  disabled?: boolean;
  readonly?: boolean;
  /**
   * items: only for type select | autocomplete | combobox
   */
  items?: any[];
  /**
   * itemValue: only for type select | autocomplete | combobox | and custom list like usergroup etc
   */
  itemValue?: string;
  /**
   * itemTitle: only for type select | autocomplete | combobox | and custom list like usergroup etc
   */
  itemTitle?: string;
  hide?: boolean;
  cols?: number;
  sm?: number;
  md?: number;
  lg?: number;
  hint?: string;
  persistentHint?: boolean;
  classLabel?: string;
  px?: number;
  py?: number;
  /**
   * preview_img: only for type file_image
   */
  preview_img?: string;
  loading?: boolean;
  isFilter?: boolean;
  multiple?: boolean;
  canSelectAll?: boolean;
  clearable?: boolean;
  hideDetails?: boolean;
  tooltip?: string;

  isMultiple?: boolean;
  // checkbox
  falseValue?: any | undefined;
  trueValue?: any | undefined;

  /**
   * accept: only for type filebox
   */
  accept?: string;

  // EVENTS
  onClick?: any;
  onSearch?: any;
}
declare type TFormInputs<TPayloadOrParams> = {
  [K in keyof TPayloadOrParams]?: IFormInput;
};
